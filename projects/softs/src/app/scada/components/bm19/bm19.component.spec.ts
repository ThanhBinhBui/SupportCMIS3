import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm19Component } from './bm19.component';

describe('Bm19Component', () => {
  let component: Bm19Component;
  let fixture: ComponentFixture<Bm19Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm19Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm19Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
