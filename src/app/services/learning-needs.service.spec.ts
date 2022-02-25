import { TestBed } from '@angular/core/testing';

import { LearningNeedsService } from './learning-needs.service';

describe('LearningNeedsService', () => {
  let service: LearningNeedsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningNeedsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
