import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ThemePalette} from "@angular/material/core";
import {DominusFile, DominusQueuedFile} from "../../dominus-uploader";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'dominus-uploader-image',
    standalone: true,
    imports: [CommonModule, MatProgressBarModule, MatButtonModule, MatIconModule],
    templateUrl: './dominus-uploader-image.component.html',
    styleUrls: ['./dominus-uploader-image.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DominusUploaderImageComponent {
    @Input() fileIndex!: number;
    @Input() file!: DominusFile | DominusQueuedFile;
    @Input() uploadProgress: number | undefined;
    @Input() progressBarColor: ThemePalette = 'primary';
    @Input() imagePreviewStyles!: {[style: string]: string};
    @Input() error: string | undefined;
    @Input() allowDeleteAction?: boolean;

    @Output() fileDelete = new EventEmitter<number>();
    @Output() fileRetry = new EventEmitter<number>();
}
