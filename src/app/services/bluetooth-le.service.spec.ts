import { TestBed } from '@angular/core/testing';

import { BluetoothLEService } from './bluetooth-le.service';

describe('BluetoothLEService', () => {
  let service: BluetoothLEService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BluetoothLEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
