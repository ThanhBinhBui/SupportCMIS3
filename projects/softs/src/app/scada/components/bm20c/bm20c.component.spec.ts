import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm20cComponent } from './bm20c.component';

describe('Bm20cComponent', () => {
  let component: Bm20cComponent;
  let fixture: ComponentFixture<Bm20cComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm20cComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm20cComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
