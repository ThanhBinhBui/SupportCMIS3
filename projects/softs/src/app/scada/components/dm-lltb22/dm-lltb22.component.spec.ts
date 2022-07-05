import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmLltb22Component } from './dm-lltb22.component';

describe('DmLltb22Component', () => {
  let component: DmLltb22Component;
  let fixture: ComponentFixture<DmLltb22Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmLltb22Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmLltb22Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
