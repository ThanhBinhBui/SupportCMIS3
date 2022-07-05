import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm02Component } from './bm02.component';

describe('Bm02Component', () => {
  let component: Bm02Component;
  let fixture: ComponentFixture<Bm02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm02Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
