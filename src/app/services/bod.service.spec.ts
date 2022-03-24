import { TestBed } from '@angular/core/testing';

import { BodService } from './bod.service';

describe('BodService', () => {
  let service: BodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
