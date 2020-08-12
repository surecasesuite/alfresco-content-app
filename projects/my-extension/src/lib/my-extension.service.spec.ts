import { TestBed } from '@angular/core/testing';

import { MyExtensionService } from './my-extension.service';

describe('MyExtensionService', () => {
  let service: MyExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyExtensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
