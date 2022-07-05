import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm18Component } from './bm18.component';

describe('Bm18Component', () => {
  let component: Bm18Component;
  let fixture: ComponentFixture<Bm18Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm18Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm18Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
