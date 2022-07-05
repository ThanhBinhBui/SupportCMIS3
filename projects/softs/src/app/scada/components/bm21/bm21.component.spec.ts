import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm21Component } from './bm21.component';

describe('Bm21Component', () => {
  let component: Bm21Component;
  let fixture: ComponentFixture<Bm21Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm21Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm21Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
