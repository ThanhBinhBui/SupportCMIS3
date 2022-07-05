import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTinHieuCongSuatComponent } from './import-tin-hieu-cong-suat.component';

describe('ImportTinHieuCongSuatComponent', () => {
  let component: ImportTinHieuCongSuatComponent;
  let fixture: ComponentFixture<ImportTinHieuCongSuatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTinHieuCongSuatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTinHieuCongSuatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
