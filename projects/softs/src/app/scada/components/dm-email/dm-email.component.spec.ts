import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmEmailComponent } from './dm-email.component';

describe('DmEmailComponent', () => {
  let component: DmEmailComponent;
  let fixture: ComponentFixture<DmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
