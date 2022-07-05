import { TestBed } from '@angular/core/testing';

import { DmTinhService } from './dm-tinh.service';

describe('DmTinhService', () => {
  let service: DmTinhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DmTinhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
