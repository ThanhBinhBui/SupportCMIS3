import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm10Component } from './bm10.component';

describe('Bm10Component', () => {
  let component: Bm10Component;
  let fixture: ComponentFixture<Bm10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm10Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
