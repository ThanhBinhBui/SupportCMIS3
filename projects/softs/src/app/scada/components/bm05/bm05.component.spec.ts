import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm05Component } from './bm05.component';

describe('Bm05Component', () => {
  let component: Bm05Component;
  let fixture: ComponentFixture<Bm05Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm05Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm05Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
