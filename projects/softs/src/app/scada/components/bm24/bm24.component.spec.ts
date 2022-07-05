import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm24Component } from './bm24.component';

describe('Bm24Component', () => {
  let component: Bm24Component;
  let fixture: ComponentFixture<Bm24Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm24Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm24Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
