import { TestBed } from '@angular/core/testing';

import { CovidinfoService } from './covidinfo.service';

describe('CovidinfoService', () => {
  let service: CovidinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
