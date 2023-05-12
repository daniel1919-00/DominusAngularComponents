import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentDocsSectionComponent } from './component-docs-section.component';

describe('ComponentDocsSectionComponent', () => {
  let component: ComponentDocsSectionComponent;
  let fixture: ComponentFixture<ComponentDocsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ComponentDocsSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentDocsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
