import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, Optional} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {DOMINUS_UPLOADER_INTL, DominusFile, DominusQueuedFile, DominusUploaderIntl} from "./dominus-uploader";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {HttpClient, HttpClientModule, HttpEventType} from "@angular/common/http";
import {catchError, finalize, of} from "rxjs";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
    standalone: true,
    selector: 'dominus-uploader',
    templateUrl: './dominus-uploader.component.html',
    imports: [
        MatButtonModule,
        MatIconModule,
        CommonModule,
        HttpClientModule,
        MatProgressBarModule
    ],
    styleUrls: ['./dominus-uploader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DominusUploaderComponent implements OnInit {
    @Input() endpointUrl!: string;
    @Input() multiple = false;
    @Input() allowedExtensions: string[] = [];

    _value: DominusFile[] = [];
    hasFiles = false;

    _lastFileId = 0;
    _filesQueue: {[key: number]: DominusQueuedFile} = {};

    constructor(
        private readonly http: HttpClient,
        private readonly changeDetector: ChangeDetectorRef,
        @Optional() @Inject(DOMINUS_UPLOADER_INTL) private readonly intl: Record<DominusUploaderIntl, string>
    ) {
        this.intl = intl || {
            [DominusUploaderIntl.UNKNOWN_ERROR]: 'Upload Failed'
        };
    }

    ngOnInit() {
        if(!this.endpointUrl) {
            throw new Error('Dominus uploader: Please set the [endpointUrl]!')
        }
    }

    get value(): DominusFile | DominusFile[] | undefined {
        return this.multiple ? this._value : this._value[0];
    }

    @Input()
    set value(value: DominusFile | DominusFile[] | undefined) {
        if(this.multiple) {
            value = value || [];
            if(!Array.isArray(value)) {
                throw new Error('Uploader value must be an array when the [multiple] attribute is set to true.');
            }

            this._value = value;
        }
        else {
            this._value = value ? [value as DominusFile] : [];
        }

        this.hasFiles = this._value.length > 0;
    }

    onFiles(event: Event) {
        const fileInput = event.target as HTMLInputElement;

        if (fileInput && fileInput.files?.length) {
            const files = this.multiple ? fileInput.files : [fileInput.files[0]];

            for(let i = files.length; i--;) {
                const file = files[i];
                const formData = new FormData();
                formData.append("file", file);

                const queuedDominusFile: DominusQueuedFile = {
                    id: ++this._lastFileId,
                    name: file.name,
                    progress: 0,
                    size: file.size,
                    error: ''
                };

                this._filesQueue[queuedDominusFile.id] = queuedDominusFile;

                this.http.post(this.endpointUrl, formData, {reportProgress: true, observe: 'events'}).pipe(
                    catchError(() => {
                        queuedDominusFile.error = this.intl[DominusUploaderIntl.UNKNOWN_ERROR];
                        queuedDominusFile.progress = 0;
                        this.changeDetector.markForCheck();
                        return of(null);
                    }),
                    finalize(() => {
                        if(queuedDominusFile.error === '') {
                            this._value.push({
                                name: file.name,
                                size: file.size
                            });
                            delete this._filesQueue[queuedDominusFile.id];
                            this.changeDetector.markForCheck();
                        }
                    })
                ).subscribe(event => {
                    if (event && event.type == HttpEventType.UploadProgress) {
                        queuedDominusFile.progress = Math.floor((event.total || 0) / event.loaded * 100)
                        this.changeDetector.markForCheck();
                    }
                });
            }
        }
    }

    removeFile(fileindex: number) {

    }
}
