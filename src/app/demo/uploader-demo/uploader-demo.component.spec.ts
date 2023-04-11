import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderDemoComponent } from './uploader-demo.component';

describe('UploaderDemoComponent', () => {
  let component: UploaderDemoComponent;
  let fixture: ComponentFixture<UploaderDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UploaderDemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploaderDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
