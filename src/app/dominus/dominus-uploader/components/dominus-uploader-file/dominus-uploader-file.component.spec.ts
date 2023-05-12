import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DominusUploaderFileComponent } from './dominus-uploader-file.component';

describe('DominusUploaderFileComponent', () => {
  let component: DominusUploaderFileComponent;
  let fixture: ComponentFixture<DominusUploaderFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DominusUploaderFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DominusUploaderFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
