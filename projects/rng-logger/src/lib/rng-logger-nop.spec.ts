import {getTestBed, TestBed} from "@angular/core/testing";
import {
  APP_CONSOLE_LOGGER,
  LoggerFactory,
  NOPLogger,
  PLATFORM_CONSOLE_LOGGER,
  RNgPlatformLogger
} from "./rng-logger-providers";
import {RngLogger} from "./rng-logger";
import {Logger, LogLevel, LogStreamHandler} from "./rng-logger-api";
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";
import {Injector, NgModule} from "@angular/core";
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
