import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm12Component } from './bm12.component';

describe('Bm12Component', () => {
  let component: Bm12Component;
  let fixture: ComponentFixture<Bm12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm12Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
