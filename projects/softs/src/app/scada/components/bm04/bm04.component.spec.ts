import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm04Component } from './bm04.component';

describe('Bm04Component', () => {
  let component: Bm04Component;
  let fixture: ComponentFixture<Bm04Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm04Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
