import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DominusUploaderComponent} from "../../dominus/dominus-uploader/dominus-uploader.component";
import {MatCardModule} from "@angular/material/card";
import {DOMINUS_UPLOADER_INTL, DominusUploaderIntl} from "../../dominus/dominus-uploader/dominus-uploader";

@Component({
  selector: 'app-uploader-demo',
  standalone: true,
  imports: [CommonModule, DominusUploaderComponent, MatCardModule],
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

}
