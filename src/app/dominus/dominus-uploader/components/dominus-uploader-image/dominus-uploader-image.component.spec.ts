import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DominusUploaderImageComponent } from './dominus-uploader-image.component';

describe('DominusUploaderImageComponent', () => {
  let component: DominusUploaderImageComponent;
  let fixture: ComponentFixture<DominusUploaderImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DominusUploaderImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DominusUploaderImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
