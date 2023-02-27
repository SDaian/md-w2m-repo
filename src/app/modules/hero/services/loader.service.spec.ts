import { TestBed } from '@angular/core/testing';

import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isLoading$ should emit true when show() is called', () => {
    service.show();
    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBeTrue();
    });
  });

  it('isLoading$ should emit false when hide() is called', () => {
    service.hide();
    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBeFalse();
    });
  });
});
