import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-component-docs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './component-docs.component.html',
    styleUrls: ['./component-docs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentDocsComponent {

}
