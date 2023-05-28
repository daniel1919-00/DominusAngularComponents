import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DominusUploaderComponent} from "../../../dominus/dominus-uploader/dominus-uploader.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {
    DominusUploaderFileComponent
} from "../../../dominus/dominus-uploader/components/dominus-uploader-file/dominus-uploader-file.component";
import {MatFormFieldControl} from "@angular/material/form-field";
import {DominusQueuedFile} from "../../../dominus/dominus-uploader/dominus-uploader";
import {finalize, interval, take, takeUntil} from "rxjs";
import {
    DominusUploaderImageComponent
} from "../../../dominus/dominus-uploader/components/dominus-uploader-image/dominus-uploader-image.component";

@Component({
    standalone: true,
    selector: 'app-fake-uploader',
    templateUrl: './../../../dominus/dominus-uploader/dominus-uploader.component.html',
    imports: [
        MatButtonModule,
        MatIconModule,
        CommonModule,
        HttpClientModule,
        DominusUploaderFileComponent,
        DominusUploaderImageComponent
    ],
    styleUrls: ['./../../../dominus/dominus-uploader/dominus-uploader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: FakeUploaderComponent
        }
    ]
})
export class FakeUploaderComponent extends DominusUploaderComponent {
    override _uploadFile(queuedDominusFile: DominusQueuedFile) {
        const speed = 50000;
        const duration = Math.ceil(queuedDominusFile.size / speed);
        let loaded = 0;

        interval(1000).pipe(takeUntil(this.componentDestroyed$), take(duration), finalize(() => {
            if(!this.multiple)
            {
                this._value = [];
            }
            this._value.push({
                name: queuedDominusFile.file.name,
                size: queuedDominusFile.file.size,
                type: queuedDominusFile.file.type,
                imagePreviewUrl: queuedDominusFile.file.type.includes('image') ? URL.createObjectURL(queuedDominusFile.file) : '',
                data: {
                    serverResponseData: 123
                }
            });
            this._filesQueue.delete(queuedDominusFile.id);
            this.hasFiles = true;
            this.changeDetector.markForCheck();
            this._onChange(this.value);
            if(this.isInAngularForm && !this._filesQueue.size)
            {
                this.uploadFinished.next(this.value);
            }
        })).subscribe(() => {
            loaded += speed;
            queuedDominusFile.progress = Math.floor(loaded / queuedDominusFile.size * 100);
            this.changeDetector.markForCheck();
        });

        return new Promise(() => {}) as Promise<void>;
    }

   override removeFile(fileIndex: number) {
        this._value.splice(fileIndex, 1);
        this.hasFiles = this._value.length > 0;
        this.changeDetector.markForCheck();
        this._onChange(this.value);

        return new Promise(() => {}) as Promise<void>;
    }
}
