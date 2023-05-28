import {InjectionToken} from "@angular/core";

export interface DominusFile {
    name: string;
    size?: number;
    type?: string;
    imagePreviewUrl?: string;
    data?: { [key: string]: any };
}

export interface DominusQueuedFile {
    id: number;
    name: string;
    size: number;
    progress: number;
    error: string;
    file: File;
    canRetryUpload: boolean;
    imagePreviewUrl?: string;
}

export enum DominusUploaderIntl {
    UNKNOWN_ERROR,
    INVALID_EXTENSION,
    MAX_SIZE_EXCEEDED,
    ALLOWED_EXTENSIONS,
    MULTIPLE_NO_FILES_MESSAGE,
    MULTIPLE_ADD_FILES_BTN,
    SINGLE_NO_FILES_MESSAGE,
    NO_IMAGE_MESSAGE,
}

export const DOMINUS_UPLOADER_INTL = new InjectionToken<Record<DominusUploaderIntl, string>>('dominus uploader i18n strings');
