import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm11Component } from './bm11.component';

describe('Bm11Component', () => {
  let component: Bm11Component;
  let fixture: ComponentFixture<Bm11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm11Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
