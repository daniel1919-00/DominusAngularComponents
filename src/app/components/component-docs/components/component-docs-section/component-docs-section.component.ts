import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-component-docs-section',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './component-docs-section.component.html',
    styleUrls: ['./component-docs-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentDocsSectionComponent {
    @Input() label!: string;
}
