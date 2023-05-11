import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, Optional} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {DOMINUS_UPLOADER_INTL, DominusFile, DominusQueuedFile, DominusUploaderIntl} from "./dominus-uploader";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {HttpClient, HttpClientModule, HttpEventType} from "@angular/common/http";
import {catchError, of} from "rxjs";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ControlValueAccessor} from "@angular/forms";

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
export class DominusUploaderComponent implements OnInit, ControlValueAccessor {
    /**
     * Endpoint that handles storing the file
     */
    @Input() fileSaveEndpoint!: string;
    @Input() fileSaveEndpointRequestMethod = 'POST';

    /**
     * Endpoint to be called when deleting a file or clearing all uploaded files if [multiple] = true
     */
    @Input() fileDeleteEndpoint?: string;
    @Input() fileDeleteEndpointRequestMethod = 'DELETE';

    /**
     * Allow multiple files?
     */
    @Input() multiple = false;

    /**
     * A list of allowed file extensions(lowercase), if empty the extension check is skipped.
     */
    @Input() allowedExtensions: string[] = [];

    /**
     * Maximum file size in bytes
     */
    @Input() maxFileSize = 5 * 1024 * 1024;

    /**
     * A small image preview is rendered next tot the file name if an image is detected
     */
    @Input() showImagePreview = true;

    _value: DominusFile[] = [];
    hasFiles = false;

    _lastFileId = 0;
    _filesQueue: { [key: number]: DominusQueuedFile } = {};

    private _onChange = () => {};
    private _onTouched = () => {};

    constructor(
        private readonly http: HttpClient,
        private readonly changeDetector: ChangeDetectorRef,
        @Optional() @Inject(DOMINUS_UPLOADER_INTL) private readonly intl: Record<DominusUploaderIntl, string>
    ) {
        const defaultIntl: Record<DominusUploaderIntl, string> = {
            [DominusUploaderIntl.UNKNOWN_ERROR]: 'Upload Failed!',
            [DominusUploaderIntl.INVALID_EXTENSION]: 'Invalid file extension!',
            [DominusUploaderIntl.MAX_SIZE_EXCEEDED]: 'File size is too big!'
        };

        if (intl) {
            for (let intlKey in intl) {
                defaultIntl[intlKey as any as DominusUploaderIntl] = intl[intlKey as any as DominusUploaderIntl];
            }
        }

        this.intl = defaultIntl;
    }

    ngOnInit() {
        if (!this.fileSaveEndpoint) {
            throw new Error('Dominus uploader: Please set the [fileSaveEndpoint] @Input()!')
        }
    }

    get value(): DominusFile[] {
        return this._value;
    }

    @Input()
    set value(value: DominusFile[]) {
        value = value || [];

        if (!Array.isArray(value)) {
            throw new Error('Uploader value must be an array of type DominusFile[].');
        }

        this._value = value;
        this.hasFiles = this._value.length > 0;
    }

    onFiles(event: Event) {
        const fileInput = event.target as HTMLInputElement;

        if (fileInput && fileInput.files?.length) {
            const files = this.multiple ? fileInput.files : [fileInput.files[0]];

            for (let i = files.length; i--;) {
                const file: File = files[i];
                const error = this.checkFile(file);

                const queuedDominusFile: DominusQueuedFile = {
                    id: ++this._lastFileId,
                    name: file.name,
                    progress: 0,
                    size: file.size,
                    error: error
                };

                this._filesQueue[queuedDominusFile.id] = queuedDominusFile;

                if (error !== '') {
                    continue;
                }

                const formData = new FormData();
                formData.append("file", file);

                this.http.request(this.fileSaveEndpointRequestMethod, this.fileSaveEndpoint, {
                    reportProgress: true,
                    observe: 'events',
                    body: formData
                }).pipe(
                    catchError(() => {
                        queuedDominusFile.error = this.intl[DominusUploaderIntl.UNKNOWN_ERROR];
                        queuedDominusFile.progress = 0;
                        this.changeDetector.markForCheck();
                        return of(null);
                    }),
                ).subscribe(event => {
                    if (event) {
                        switch (event.type) {
                            case HttpEventType.UploadProgress:
                                queuedDominusFile.progress = Math.floor(event.loaded / (event.total || 1) * 100);
                                this.changeDetector.markForCheck();
                                break;

                            case HttpEventType.Response:
                                this._value.push({
                                    name: file.name,
                                    size: file.size,
                                    type: file.type,
                                    isImage: file.type.includes('image'),
                                    data: event.body || {}
                                });

                                delete this._filesQueue[queuedDominusFile.id];
                                this.hasFiles = true;
                                this.changeDetector.markForCheck();
                                break;
                        }
                    }
                });
            }
        }
    }

    removeFile(fileIndex: number) {
        const file = this._value.splice(fileIndex, 1)[0];

        if(this.fileDeleteEndpoint)
        {
            this.http.request(this.fileSaveEndpointRequestMethod, this.fileDeleteEndpoint, {body: [file]}).subscribe(() =>
            {

            });
        }

        this.hasFiles = this._value.length > 0;
        this.changeDetector.markForCheck();
    }

    private checkFile(file: File): string {
        const allowedExtensions = this.allowedExtensions;

        if (allowedExtensions.length) {
            const dotIndex = file.name.lastIndexOf('.');
            let extensionValid;

            if (dotIndex < 0) {
                extensionValid = false;
            } else {
                const fileExtension = file.name.substring(dotIndex + 1).toLowerCase();
                extensionValid = allowedExtensions.indexOf(fileExtension) !== -1;
            }

            if (!extensionValid) {
                return this.intl[DominusUploaderIntl.INVALID_EXTENSION];
            }
        }

        if (file.size > this.maxFileSize) {
            return this.intl[DominusUploaderIntl.MAX_SIZE_EXCEEDED];
        }

        return '';
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    writeValue(val: DominusFile[]): void {
        this.value = val;
    }
}
