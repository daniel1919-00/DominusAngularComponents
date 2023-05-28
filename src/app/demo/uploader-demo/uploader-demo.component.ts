import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {DOMINUS_UPLOADER_INTL, DominusUploaderIntl} from "../../dominus/dominus-uploader/dominus-uploader";
import {MatTabsModule} from "@angular/material/tabs";
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {UploaderDocsComponent} from "./docs/uploader-docs/uploader-docs.component";
import {FakeUploaderComponent} from "./fake-uploader/fake-uploader.component";
import {MatInputModule} from "@angular/material/input";
import {MatDividerModule} from "@angular/material/divider";

@Component({
    selector: 'app-uploader-demo',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatTabsModule, ReactiveFormsModule, UploaderDocsComponent, FakeUploaderComponent, MatInputModule, MatDividerModule],
    templateUrl: './uploader-demo.component.html',
    styleUrls: ['./uploader-demo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: DOMINUS_UPLOADER_INTL,
        useValue: {
            [DominusUploaderIntl.UNKNOWN_ERROR]: 'Upload Failed'
        }
    }]
})
export class UploaderDemoComponent {
    multipleFilesForm: UntypedFormGroup;
    singleFilesForm: UntypedFormGroup;
    singleImageUploaderForm: UntypedFormGroup;
    multipleImageUploaderForm: UntypedFormGroup;

    constructor(
        private fb: UntypedFormBuilder
    )
    {
        this.multipleFilesForm = fb.group({
            uploaderValue: [[]],
        });

        this.singleFilesForm = fb.group({
            uploaderValue: [[]],
        });

        this.multipleImageUploaderForm = fb.group({
            uploaderValue: [[]],
        });

        this.singleImageUploaderForm = fb.group({
            uploaderValue: [[]],
        });

    }
}
