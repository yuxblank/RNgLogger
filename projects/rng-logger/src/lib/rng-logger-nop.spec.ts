import {TestBed} from "@angular/core/testing";
import {LoggerFactory, NOP_LOGGER, NOPLogger} from "./rng-logger-providers";
import {RNgLoggerModule} from "./rng-logger.module";
import {Injector} from "@angular/core";
import {LogLevel, LogStreamHandler, RNG_LOGGER_OPTS} from "./rng-logger-api";

describe("RngLogger NOP", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RNgLoggerModule
      ],
    })
    TestBed.get(LogStreamHandler).clear();
  });

  it("Nop logger should be defined", () => {
    let factory = NOP_LOGGER;
    expect(factory.isNop).toEqual(true);
  })

  it("should be able to call NOP logger impl", () => {
    let factory = NOP_LOGGER;
    expect(factory.warn("")).toBeUndefined()
    expect(factory.trace("")).toBeUndefined()
    expect(factory.info("")).toBeUndefined()
    expect(factory.error("")).toBeUndefined()
    expect(factory.debug("")).toBeUndefined()
  })

  it("should be able to get NOP logger from factory", () => {
    let loggerFactory = LoggerFactory(Injector.create({
      parent: undefined,
      providers: [
        {
          provide: RNG_LOGGER_OPTS, useValue: {
            maxBuffer: 50,
            level: LogLevel.ERROR,
            nonResolvedStrategy: "NOP"
          }
        },
      ]
    })) as NOPLogger;

    expect(loggerFactory.isNop).toBeTrue();
  })

  it("should throw if not logger and strategy is not ", () => {
    expect(() => {
      LoggerFactory(Injector.create({
        parent: undefined,
        providers: [
          {
            provide: RNG_LOGGER_OPTS, useValue: {
              maxBuffer: 50,
              level: LogLevel.ERROR,
              nonResolvedStrategy: "ERROR"
            }
          },
        ]
      })) as NOPLogger;
    }).toThrow();
  });

})
