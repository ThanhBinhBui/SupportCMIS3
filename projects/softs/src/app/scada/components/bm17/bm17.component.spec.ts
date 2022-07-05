import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm17Component } from './bm17.component';

describe('Bm17Component', () => {
  let component: Bm17Component;
  let fixture: ComponentFixture<Bm17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
