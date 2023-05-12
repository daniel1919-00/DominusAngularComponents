import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderDocsComponent } from './uploader-docs.component';

describe('UploaderDocsComponent', () => {
  let component: UploaderDocsComponent;
  let fixture: ComponentFixture<UploaderDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UploaderDocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploaderDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
