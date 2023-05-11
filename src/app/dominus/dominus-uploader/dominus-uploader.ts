import {InjectionToken} from "@angular/core";

export interface DominusFile {
  name: string;
  size: number;
  type: string;
  isImage: boolean;
  data: {[key: string]: any};
}

export interface DominusQueuedFile {
  id: number;
  name: string;
  size: number;
  progress: number;
  error: string;
}

export enum DominusUploaderIntl {
  UNKNOWN_ERROR,
  INVALID_EXTENSION,
  MAX_SIZE_EXCEEDED
}

export const DOMINUS_UPLOADER_INTL = new InjectionToken<Record<DominusUploaderIntl, string>>('dominus uploader i18n strings');
