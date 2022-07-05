import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm15Component } from './bm15.component';

describe('Bm15Component', () => {
  let component: Bm15Component;
  let fixture: ComponentFixture<Bm15Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm15Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
