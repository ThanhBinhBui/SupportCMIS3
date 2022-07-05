import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmTbaSpcComponent } from './dm-tba-spc.component';

describe('DmTbaSpcComponent', () => {
  let component: DmTbaSpcComponent;
  let fixture: ComponentFixture<DmTbaSpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmTbaSpcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmTbaSpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
