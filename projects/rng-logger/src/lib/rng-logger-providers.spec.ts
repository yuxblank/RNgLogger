import {TestBed} from "@angular/core/testing";
import {LoggerFactory, NOP_LOGGER, NOPLogger} from "./rng-logger-providers";
import {Logger, LogStreamHandler} from "./rng-logger-api";
import {Injector} from "@angular/core";
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";


describe("RngLogger providers", () => {
  let logger: Logger;
  let handler: LogStreamHandler


  beforeEach(() => {

    TestBed.resetTestEnvironment();
    TestBed.resetTestingModule();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())

    TestBed.configureTestingModule({
      imports: []
    })

    logger = TestBed.get(Logger);
    handler = TestBed.get(LogStreamHandler);
  });


  it("should be able to get RootLogger by LoggerFactory", () => {
    let spy = spyOn(console, "debug");
    LoggerFactory().debug("debug", {opts: ["a","b","c"]});
    expect(spy).toHaveBeenCalledWith("debug",{opts: ["a","b","c"]})
  })
  it("should be able to get RootLogger by root injector", () => {
    LoggerFactory(TestBed.get(Injector))
  })

  it("should be able to get RootLogger by root injector", () => {
    let loggerFactory = LoggerFactory(Injector.create({
      parent: undefined,
      providers: []
    })) as NOPLogger;

    expect(loggerFactory.isNop).toEqual(true);

    let spyAll = spyOnAllFunctions(NOP_LOGGER);

    loggerFactory.debug("");
    loggerFactory.error("");
    loggerFactory.info("");
    loggerFactory.warn("");
    loggerFactory.trace("");

    expect(spyAll.debug).toHaveBeenCalled();
    expect(spyAll.error).toHaveBeenCalled();
    expect(spyAll.info).toHaveBeenCalled();
    expect(spyAll.warn).toHaveBeenCalled();
    expect(spyAll.trace).toHaveBeenCalled();
  })
})
