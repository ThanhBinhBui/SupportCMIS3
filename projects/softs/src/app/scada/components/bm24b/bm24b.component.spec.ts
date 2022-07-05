import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm24bComponent } from './bm24b.component';

describe('Bm24bComponent', () => {
  let component: Bm24bComponent;
  let fixture: ComponentFixture<Bm24bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm24bComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm24bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
