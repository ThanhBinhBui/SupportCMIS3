import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaImageComponent } from './ca-image.component';

describe('CaImageComponent', () => {
  let component: CaImageComponent;
  let fixture: ComponentFixture<CaImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
