import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm08Component } from './bm08.component';

describe('Bm08Component', () => {
  let component: Bm08Component;
  let fixture: ComponentFixture<Bm08Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm08Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm08Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
