import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm16Component } from './bm16.component';

describe('Bm16Component', () => {
  let component: Bm16Component;
  let fixture: ComponentFixture<Bm16Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm16Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
