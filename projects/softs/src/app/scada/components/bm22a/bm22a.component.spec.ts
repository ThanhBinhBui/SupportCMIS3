import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bm22aComponent } from './bm22a.component';

describe('Bm22aComponent', () => {
  let component: Bm22aComponent;
  let fixture: ComponentFixture<Bm22aComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bm22aComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bm22aComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
