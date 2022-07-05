import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExcelHisMessageComponent } from './import-excel-hismessage.component';

describe('ImportExcelHisMessageComponent', () => {
  let component: ImportExcelHisMessageComponent;
  let fixture: ComponentFixture<ImportExcelHisMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportExcelHisMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExcelHisMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
