import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentDocsSectionItemComponent } from './component-docs-section-item.component';

describe('ComponentDocsSectionItemComponent', () => {
  let component: ComponentDocsSectionItemComponent;
  let fixture: ComponentFixture<ComponentDocsSectionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ComponentDocsSectionItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentDocsSectionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
