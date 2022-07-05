import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm20aComponent } from './bm20a.component';

describe('Bm20aComponent', () => {
  let component: Bm20aComponent;
  let fixture: ComponentFixture<Bm20aComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm20aComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm20aComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
