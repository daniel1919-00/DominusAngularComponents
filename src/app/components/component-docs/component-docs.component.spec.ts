import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentDocsComponent } from './component-docs.component';

describe('ComponentDocsComponent', () => {
  let component: ComponentDocsComponent;
  let fixture: ComponentFixture<ComponentDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ComponentDocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
