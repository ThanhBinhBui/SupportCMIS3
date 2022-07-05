import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm09Component } from './bm09.component';

describe('Bm09Component', () => {
  let component: Bm09Component;
  let fixture: ComponentFixture<Bm09Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm09Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm09Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
