import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PoComboFilterService } from './po-combo-filter.service';

describe('PoComboFilterService ', () => {
  let comboService: PoComboFilterService;
  let httpMock: HttpTestingController;

  const mockURL = 'rest/tecnologies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        PoComboFilterService
      ]
    });

    comboService = TestBed.get(PoComboFilterService);
    httpMock = TestBed.get(HttpTestingController);

    comboService.configProperties(mockURL, 'name', 'id');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return only filtered data', done => {
    const items: any = 'items';

    comboService.getFilteredData({}).subscribe(response => {

      expect(response.length).toBe(1);
      expect(response[items]).toBeUndefined();

      done();
    });

    httpMock
      .expectOne((req: HttpRequest<any>) => req.url === mockURL && req.method === 'GET')
      .flush({items: [{name: 'Angular', id: 'angular'}]});
  });

  it('should not return any filtered data', done => {
    const items: any = 'items';

    comboService.getFilteredData({}).subscribe(response => {

      expect(response.length).toBe(0);
      expect(response[items]).toBeUndefined();

      done();
    });

    httpMock
      .expectOne((req: HttpRequest<any>) => req.url === mockURL && req.method === 'GET')
      .flush({items: []});
  });

  it('should return the object converted to PoComboOption', done => {
    const param = 'angular';

    comboService.getObjectByValue(param).subscribe(object => {

      expect('label' in object).toBeTruthy();
      expect('value' in object).toBeTruthy();

      done();
    });

    httpMock.expectOne(`${mockURL}/${param}`).flush({id: 'angular', name: 'Angular'});
  });

  it('should not return the object', done => {
    const param = 'react';

    comboService.getObjectByValue(param).subscribe(object => {

      expect(object).toBeUndefined();

      done();
    });

    httpMock.expectOne(`${mockURL}/${param}`).flush(null);
  });

  it('should parse option and change keys of object', () => {
    const valueExpected = { label: 'teste', value: 'valor' };

    comboService.fieldLabel = 'label';
    comboService.fieldValue = 'value';

    const result = comboService['parseToComboOption'](valueExpected);
    const resultStringfy = JSON.stringify(result);

    expect(resultStringfy).toBe(JSON.stringify(valueExpected));
  });

  it('shouldn`t return when parseToComboOption get null', () => {
    expect(comboService['parseToComboOption'](null)).toBeUndefined();
  });

});
