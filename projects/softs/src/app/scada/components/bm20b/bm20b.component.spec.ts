import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm20bComponent } from './bm20b.component';

describe('Bm20bComponent', () => {
  let component: Bm20bComponent;
  let fixture: ComponentFixture<Bm20bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm20bComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm20bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
