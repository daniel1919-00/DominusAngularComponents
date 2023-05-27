import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ElementRef, EventEmitter, HostBinding,
    Inject,
    Input, OnDestroy,
    OnInit,
    Optional, Output, Self, ViewChild,
} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {DOMINUS_UPLOADER_INTL, DominusFile, DominusQueuedFile, DominusUploaderIntl} from "./dominus-uploader";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {HttpClient, HttpClientModule, HttpEventType, HttpHeaders} from "@angular/common/http";
import {catchError, fromEvent, of, Subject, takeUntil} from "rxjs";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ControlValueAccessor, NgControl} from "@angular/forms";
import {DominusUploaderFileComponent} from "./components/dominus-uploader-file/dominus-uploader-file.component";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {MAT_FORM_FIELD, MatFormField, MatFormFieldControl} from "@angular/material/form-field";

@Component({
    standalone: true,
    selector: 'dominus-uploader',
    templateUrl: './dominus-uploader.component.html',
    imports: [
        MatButtonModule,
        MatIconModule,
        CommonModule,
        HttpClientModule,
        MatProgressBarModule,
        DominusUploaderFileComponent
    ],
    styleUrls: ['./dominus-uploader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: DominusUploaderComponent
        }
    ]
})
export class DominusUploaderComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor, MatFormFieldControl<DominusFile[]> {
    static nextId = 0;

    @ViewChild('uploaderContainer') uploaderContainer!: ElementRef;
    @ViewChild('fileInput') fileInput!: ElementRef;

    /**
     * Endpoint that handles storing the file
     */
    @Input() fileSaveEndpoint!: string;
    @Input() fileSaveEndpointRequestMethod = 'POST';
    @Input() fileSaveEndpointRequestHeaders?: HttpHeaders | {[p: string]: string | string[]} | Promise<HttpHeaders | {[p: string]: string | string[]}>;

    /**
     * Endpoint to be called when deleting a file or clearing all uploaded files if [multiple] = true
     */
    @Input() fileDeleteEndpoint?: string;
    @Input() fileDeleteEndpointRequestMethod = 'DELETE';
    @Input() fileDeleteEndpointRequestHeaders?: HttpHeaders | {[p: string]: string | string[]} | Promise<HttpHeaders | {[p: string]: string | string[]}>;

    /**
     * Allow multiple files?
     */
    @Input() multiple = false;

    /**
     * A list of allowed file extensions(lowercase), if empty the extension check is skipped.
     * Example: ['txt', 'xlsx', ...]
     */
    @Input() allowedExtensions: string[] = [];

    /**
     * Maximum file size in bytes
     */
    @Input() maxFileSize = 5 * 1024 * 1024;

    /**
     * Whether to show a preview if the uploaded file is an image
     */
    @Input() showImagePreview = true;

    /**
     * [ngStyle] compatible object
     */
    @Input() imagePreviewStyles: {[style: string]: string} = {'max-width': '100px'};

    /**
     * Event triggered when all the files in the upload queue are uploaded.
     */
    @Output() uploadFinished = new EventEmitter<DominusFile[]>();

    @HostBinding() id = `dominus-uploader-${DominusUploaderComponent.nextId++}`;

    stateChanges = new Subject<void>();
    hasFiles = false;
    focused = false;
    controlType = 'dominus-uploader';
    _containerClasses: {[klass: string]: boolean} = {
        'container': true,
        'multiple': false,
        'mat-form-field': false,
        'dragover': false
    };
    _value: DominusFile[] = [];
    _lastFileId = 0;
    _filesQueue  = new Map<number, DominusQueuedFile>();
    _disabled: boolean = false;
    _required: boolean = false;


    protected _onChange = (files: DominusFile[]) => files;
    protected _onTouched = () => {};
    protected isInAngularForm = false;
    protected readonly DominusUploaderIntl = DominusUploaderIntl;
    protected readonly componentDestroyed$ = new Subject<void>();

    private _placeholder: string = '';

    constructor(
        protected readonly http: HttpClient,
        protected readonly changeDetector: ChangeDetectorRef,
        private _elementRef: ElementRef<HTMLElement>,
        @Optional() @Inject(DOMINUS_UPLOADER_INTL) public readonly intl: Record<DominusUploaderIntl, string>,
        @Optional() @Inject(MAT_FORM_FIELD) public matFormField: MatFormField,
        @Optional() @Self() public ngControl: NgControl,
    ) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }

        this._containerClasses['mat-form-field'] = !!this.matFormField;

        const defaultIntl: Record<DominusUploaderIntl, string> = {
            [DominusUploaderIntl.UNKNOWN_ERROR]: 'Upload Failed!',
            [DominusUploaderIntl.INVALID_EXTENSION]: 'Invalid file extension!',
            [DominusUploaderIntl.MAX_SIZE_EXCEEDED]: 'File size is too big!',
            [DominusUploaderIntl.MULTIPLE_NO_FILES_MESSAGE]: 'Drop files here!',
            [DominusUploaderIntl.SINGLE_NO_FILES_MESSAGE]: 'No file',
            [DominusUploaderIntl.ALLOWED_EXTENSIONS]: 'Allowed Extensions',
            [DominusUploaderIntl.MULTIPLE_ADD_FILES_BTN]: 'Add files',
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
            throw new Error('Dominus uploader: Please set the [fileSaveEndpoint] @Input()!');
        }

        this._containerClasses['multiple'] = this.multiple;
    }

    ngAfterViewInit() {
        const uploaderContainer = this.matFormField?._elementRef.nativeElement || this.uploaderContainer.nativeElement;
        fromEvent<DragEvent>(uploaderContainer, 'dragover').pipe(takeUntil(this.componentDestroyed$)).subscribe((evt) => this.onDragOver(evt));
        fromEvent<DragEvent>(uploaderContainer, 'dragleave').pipe(takeUntil(this.componentDestroyed$)).subscribe((evt) => this.onDragLeave(evt));
        fromEvent<DragEvent>(uploaderContainer, 'drop').pipe(takeUntil(this.componentDestroyed$)).subscribe((evt) => this.onFilesDropped(evt));
    }

    /**
     * Opens the file input dialog.
     */
    openFilesInput() {
        this.fileInput.nativeElement.click()
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
        this.stateChanges.next();
    }

    _onFiles(addedFiles: FileList) {
        if (!(addedFiles && addedFiles.length)) {
            return;
        }

        const files = this.multiple ? addedFiles : [addedFiles[0]];

        for (let i = files.length; i--;) {
            const file: File = files[i];
            const error = this.checkFile(file);

            const queuedDominusFile: DominusQueuedFile = {
                id: ++this._lastFileId,
                name: file.name,
                progress: 0,
                size: file.size,
                error: error,
                canRetryUpload: error === '',
                file: file
            };

            this._filesQueue.set(queuedDominusFile.id, queuedDominusFile);

            if (error === '') {
                this._uploadFile(queuedDominusFile);
            }
        }

        this.fileInput.nativeElement.value = '';
    }

    async _uploadFile(queuedDominusFile: DominusQueuedFile) {
        const formData = new FormData();
        const file = queuedDominusFile.file;

        formData.append("file", file);

        const requestHeaders = this.fileSaveEndpointRequestHeaders instanceof Promise ? await this.fileSaveEndpointRequestHeaders : this.fileSaveEndpointRequestHeaders;

        this.http.request(this.fileSaveEndpointRequestMethod, this.fileSaveEndpoint, {
            reportProgress: true,
            observe: 'events',
            body: formData,
            headers: requestHeaders
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
                        if(!this.multiple)
                        {
                            this._value = [];
                        }
                        this._value.push({
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            imagePreviewUrl: file.type.includes('image') ? URL.createObjectURL(file) : '',
                            data: event.body || {}
                        });

                        this._onChange(this.value);
                        this._filesQueue.delete(queuedDominusFile.id);
                        this.hasFiles = true;
                        this.changeDetector.markForCheck();
                        this.uploadFinished.next(this.value);
                        break;
                }
            }
        });
    }

    _retryUpload(fileId: number) {
        const queuedFile = this._filesQueue.get(fileId);

        if(!queuedFile) {
            return;
        }

        if(!queuedFile.canRetryUpload) {
            this._filesQueue.delete(fileId);
            return;
        }

        this._uploadFile(queuedFile);
    }

    /**
     * Removes an uploaded file by index
     * @param fileIndex
     */
    async removeFile(fileIndex: number) {
        const file = this._value.splice(fileIndex, 1)[0];

        const requestHeaders = this.fileDeleteEndpointRequestHeaders instanceof Promise ? await this.fileDeleteEndpointRequestHeaders : this.fileDeleteEndpointRequestHeaders;

        if(this.fileDeleteEndpoint) {
            this.http.request(
                this.fileDeleteEndpointRequestMethod,
                this.fileDeleteEndpoint,
                {
                    body: [file],
                    headers: requestHeaders
                }).subscribe(() => {

            });
        }

        this.hasFiles = this._value.length > 0;
        this.changeDetector.markForCheck();
    }

    get errorState(): boolean {
        return (this.ngControl && this.ngControl.invalid && this.ngControl.touched) as boolean;
    }

    setDescribedByIds(ids: string[]) {
    }

    onContainerClick(event: MouseEvent) {
        this._onTouched();
    }

    @HostBinding('class.floating')
    get shouldLabelFloat() {
        return true;
    }

    get empty() {
        return this.value.length === 0;
    }

    get placeholder() {
        return this._placeholder;
    }

    @Input()
    set placeholder(plh) {
        this._placeholder = plh;
        this.stateChanges.next();
    }

    @Input()
    set disabled(state: boolean) {
        this._disabled = coerceBooleanProperty(state);
        this.stateChanges.next();
    }

    get disabled() {
        return this._disabled;
    }

    @Input()
    set required(state: boolean) {
        this._required = coerceBooleanProperty(state);
        this.stateChanges.next();
    }

    get required() {
        return this._required;
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
        this.isInAngularForm = true;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    writeValue(val: DominusFile[]): void {
        this.value = val;
    }

    private onDragOver(evt: DragEvent) {
        evt.preventDefault();
        evt.stopPropagation();
        this._containerClasses['dragover'] = true;
        this.changeDetector.markForCheck();
    }

    private onDragLeave(evt: DragEvent) {
        evt.preventDefault();
        evt.stopPropagation();
        this._containerClasses['dragover'] = false;
        this.changeDetector.markForCheck();
    }

    private onFilesDropped(evt: DragEvent) {
        const files = evt.dataTransfer?.files;
        if(files)
        {
            evt.preventDefault();
            evt.stopPropagation();
            this._containerClasses['dragover'] = false;
            this.changeDetector.markForCheck();
            this._onFiles(files);
        }
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

    ngOnDestroy(){
        this.componentDestroyed$.next();
        this.componentDestroyed$.complete();
        this.stateChanges.complete();
    }
}
