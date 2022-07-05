import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm23Component } from './bm23.component';

describe('Bm23Component', () => {
  let component: Bm23Component;
  let fixture: ComponentFixture<Bm23Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm23Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm23Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
