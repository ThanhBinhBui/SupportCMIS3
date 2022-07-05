import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm24aComponent } from './bm24a.component';

describe('Bm24aComponent', () => {
  let component: Bm24aComponent;
  let fixture: ComponentFixture<Bm24aComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm24aComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm24aComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
