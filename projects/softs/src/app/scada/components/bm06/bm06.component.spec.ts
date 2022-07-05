import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm06Component } from './bm06.component';

describe('Bm06Component', () => {
  let component: Bm06Component;
  let fixture: ComponentFixture<Bm06Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm06Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm06Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
