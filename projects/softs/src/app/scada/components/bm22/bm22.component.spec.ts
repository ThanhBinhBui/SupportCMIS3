import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm22Component } from './bm22.component';

describe('Bm22Component', () => {
  let component: Bm22Component;
  let fixture: ComponentFixture<Bm22Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm22Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm22Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
