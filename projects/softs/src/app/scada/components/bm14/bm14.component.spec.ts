import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm14Component } from './bm14.component';

describe('Bm14Component', () => {
  let component: Bm14Component;
  let fixture: ComponentFixture<Bm14Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm14Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
