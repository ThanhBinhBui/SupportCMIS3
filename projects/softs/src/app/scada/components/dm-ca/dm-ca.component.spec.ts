import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmCaComponent } from './dm-ca.component';

describe('DmCaComponent', () => {
  let component: DmCaComponent;
  let fixture: ComponentFixture<DmCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmCaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
