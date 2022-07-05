import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm03Component } from './bm03.component';

describe('Bm03Component', () => {
  let component: Bm03Component;
  let fixture: ComponentFixture<Bm03Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm03Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
