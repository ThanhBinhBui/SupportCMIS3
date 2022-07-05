import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm01Component } from './bm01.component';

describe('Bm01Component', () => {
  let component: Bm01Component;
  let fixture: ComponentFixture<Bm01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm01Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
