import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmLlTbaComponent } from './dm-ll-tba.component';

describe('DmLlTbaComponent', () => {
  let component: DmLlTbaComponent;
  let fixture: ComponentFixture<DmLlTbaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmLlTbaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmLlTbaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
