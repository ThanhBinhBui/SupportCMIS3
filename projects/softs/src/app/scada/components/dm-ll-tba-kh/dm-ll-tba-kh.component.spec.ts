import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DMLLTBAKHComponent } from './dm-ll-tba-kh.component';

describe('DMLLTBAKHComponent', () => {
  let component: DMLLTBAKHComponent;
  let fixture: ComponentFixture<DMLLTBAKHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DMLLTBAKHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DMLLTBAKHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
