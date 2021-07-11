import {TestBed} from "@angular/core/testing";
import {LoggerFactory, NOPLogger} from "./rng-logger-providers";
import {RNgLoggerModule} from "./rng-logger.module";

// cannot test due to static nature of TestBed platform
xdescribe("RngLogger NOP", () => {

  beforeAll(() => {
    TestBed.resetTestEnvironment();
  });


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RNgLoggerModule
      ]
    })

  });


  it("should be able to get NOP by LoggerFactory", () => {
    let factory = LoggerFactory() as NOPLogger;
    expect(factory.isNop).toEqual(true);
  })
})
