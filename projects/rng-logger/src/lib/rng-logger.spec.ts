import {TestBed} from '@angular/core/testing';
import {Logger, LogLevel, LogStreamHandler} from "./rng-logger-api";
import {APP_CONSOLE_LOGGER} from "./rng-logger-providers";
import {take} from "rxjs/operators";


describe('RNgLogger', () => {
  let logger: Logger;
  let handler: LogStreamHandler

  beforeAll(() => {

  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        APP_CONSOLE_LOGGER
      ]
    });
    logger = TestBed.get(Logger);
    handler = TestBed.get(LogStreamHandler);
  });

  afterEach(() => {
    handler.clear();
  })

  it('should be created', () => {
    expect(logger).toBeTruthy();
  });

  it("should be able to write to the stream", (done) => {
    handler.last$(LogLevel.DEBUG)
      .pipe(take(1))
      .subscribe(
      next => {
        expect(next.message).toEqual("debug");
        done();
      }
    )
    logger.debug("debug", "some data");
  })
  it("CONSOLE logger should be able to log with console", () => {

    let spyInfo = spyOn(console, "info");
    let spyDebug = spyOn(console, "debug");
    let spyError = spyOn(console, "error");
    let spyTrace = spyOn(console, "trace");
    let spyWarn= spyOn(console, "warn");
    logger.info("info", "some data");
    expect(spyInfo).toHaveBeenCalledWith("info","some data");

    logger.warn("warn", []);
    expect(spyWarn).toHaveBeenCalledWith("warn",[]);

    logger.error("error", []);
    expect(spyError).toHaveBeenCalledWith("error",[]);

    logger.debug("debug", []);
    expect(spyDebug).toHaveBeenCalledWith("debug",[]);

    logger.trace("trace", []);
    expect(spyTrace).not.toHaveBeenCalledWith("trace",[]);
  })

  it("logs should be filter by root level", () => {
    handler.get$()
      .pipe()
      .subscribe(
        next => {
          expect(next.find(f => f.level < LogLevel.TRACE)).toBeUndefined();
        }
      );
    handler.get$(LogLevel.INFO)
      .pipe()
      .subscribe(
        next => {
          expect(next.find(f => f.level < LogLevel.INFO)).toBeUndefined();
        }
      );

    logger.debug("debug", "some data");
    logger.warn("warn", "some data");
    logger.info("info", "some data");
    logger.trace("trace", "some data");
    logger.error("errpr", "some data");
  })
});
