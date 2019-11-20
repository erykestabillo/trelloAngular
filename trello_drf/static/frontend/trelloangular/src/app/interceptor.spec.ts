import { Interceptor } from './interceptor';
import { TestBed, inject } from '@angular/core/testing';


describe('Interceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Interceptor]
    });
  });


  // it('should create an instance', () => {
  //   expect(new Interceptor()).toBeTruthy();
  // });

  it('should create an instance', inject([Interceptor], (service: Interceptor)  => {
    expect(service).toBeTruthy();
  }));

});