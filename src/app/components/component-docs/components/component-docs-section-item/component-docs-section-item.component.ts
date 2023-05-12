import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-component-docs-section-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './component-docs-section-item.component.html',
    styleUrls: ['./component-docs-section-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentDocsSectionItemComponent {
    @Input() label!: string;
}
