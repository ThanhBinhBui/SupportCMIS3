import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmTinhComponent } from './dm-tinh.component';

describe('DmTinhComponent', () => {
  let component: DmTinhComponent;
  let fixture: ComponentFixture<DmTinhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmTinhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmTinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
