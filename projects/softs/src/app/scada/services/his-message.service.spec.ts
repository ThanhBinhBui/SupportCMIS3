import { TestBed } from '@angular/core/testing';

import { HISMessageService } from './his-message.service';

describe('HISMessageService', () => {
  let service: HISMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HISMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
