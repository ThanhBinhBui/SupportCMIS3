import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm13Component } from './bm13.component';

describe('Bm13Component', () => {
  let component: Bm13Component;
  let fixture: ComponentFixture<Bm13Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm13Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
