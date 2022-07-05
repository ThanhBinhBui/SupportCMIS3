import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibCatComponent } from './lib-cat.component';

describe('LibCatComponent', () => {
  let component: LibCatComponent;
  let fixture: ComponentFixture<LibCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibCatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
