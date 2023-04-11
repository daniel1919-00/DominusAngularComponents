import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DominusUploaderComponent } from './dominus-uploader.component';

describe('DominusUploaderComponent', () => {
  let component: DominusUploaderComponent;
  let fixture: ComponentFixture<DominusUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DominusUploaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DominusUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
