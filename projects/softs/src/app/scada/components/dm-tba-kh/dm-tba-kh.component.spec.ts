import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmTbaKhComponent } from './dm-tba-kh.component';

describe('DmTbaKhComponent', () => {
  let component: DmTbaKhComponent;
  let fixture: ComponentFixture<DmTbaKhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmTbaKhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmTbaKhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
