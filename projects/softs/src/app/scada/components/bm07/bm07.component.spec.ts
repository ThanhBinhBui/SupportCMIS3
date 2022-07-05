import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm07Component } from './bm07.component';

describe('Bm07Component', () => {
  let component: Bm07Component;
  let fixture: ComponentFixture<Bm07Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm07Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm07Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
