import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm01aComponent } from './bm01a.component';

describe('Bm01aComponent', () => {
  let component: Bm01aComponent;
  let fixture: ComponentFixture<Bm01aComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm01aComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm01aComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
