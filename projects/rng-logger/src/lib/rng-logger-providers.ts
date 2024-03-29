import {APP_INITIALIZER, getPlatform, Injector, PLATFORM_INITIALIZER, StaticProvider} from "@angular/core";
import {DEFAULT_OPTIONS, Logger, LoggerOptions, LogLevel, LogStreamHandler, RNG_LOGGER_OPTS} from "./rng-logger-api";
import {ReactiveLogStreamHandler} from "./reactive-log-stream-handler";
import {RngLogger} from "./rng-logger";


let platformLogger: Logger;

export const RNG_LOGGER_PROVIDERS: StaticProvider[] = [
  {provide: LogStreamHandler, useClass: ReactiveLogStreamHandler, deps: [RNG_LOGGER_OPTS]},
  {provide: Logger, useFactory: RNgLoggerFactory, deps: [Injector]},
  {provide: RngLogger, useExisting: Logger}
];


export function RNgPlatformLogger(options: LoggerOptions = DEFAULT_OPTIONS): StaticProvider[] {
  return [
    {provide: RNG_LOGGER_OPTS, useValue: options},
    ...RNG_LOGGER_PROVIDERS
  ];
}


export function RNgLoggerFactory(injector: Injector): Logger {
  try {
    return new RngLogger(injector.get(LogStreamHandler));
  } catch(e) {
    let opts;
    try {
      opts = injector.get(RNG_LOGGER_OPTS);
    }
    catch {
      return NOP_LOGGER;
    }
    if (opts.nonResolvedStrategy ===  "NOP"){
      return NOP_LOGGER;
    }
    throw "Logger cannot be resolved";
  }
}

export interface NOPLogger extends Logger {
  isNop: boolean;
}

export const NOP_LOGGER: NOPLogger = {
  isNop: true,
  debug(message: any, ...options: any[]): void {
  }, error(message: any, ...options: any[]): void {
  }, info(message: any, ...options: any[]): void {
  }, trace(message: any, ...options: any[]): void {
  }, warn(message: any, ...options: any[]): void {
  }
}


function getPlatformLogger(){
  if (!!platformLogger){
    return platformLogger;
  }
  let platform = getPlatform();
  if (!platform) {
    return NOP_LOGGER;
  }
  return RNgLoggerFactory(platform.injector)
}


export function LoggerFactory(injector?: Injector): Logger | RngLogger {
  if (!injector) {
    return getPlatformLogger();
  }
  return RNgLoggerFactory(injector);
}

export function logLevelAsLcString(level: LogLevel): string {
  switch (level) {
    case LogLevel.INFO: {
      return "info";
    }
    case LogLevel.WARN: {
      return "warn";
    }
    case LogLevel.ERROR: {
      return "error";
    }
    case LogLevel.DEBUG: {
      return "debug";
    }
    case LogLevel.TRACE: {
      return "trace";
    }
    default: {
      return "log";
    }
  }
}


export const PLATFORM_CONSOLE_LOGGER: StaticProvider = {
  provide: PLATFORM_INITIALIZER,
  multi: true,
  useFactory: browserLoggerFactory,
  deps: [LogStreamHandler]
};
export const APP_CONSOLE_LOGGER: StaticProvider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: browserLoggerFactory,
  deps: [LogStreamHandler]
};

export function browserLoggerFactory(handler: LogStreamHandler) {
  return () => {
    handler.last$()
      .subscribe(next => {
        // @ts-ignore
        console[logLevelAsLcString(next.level)](next.message, ...next.options)
      })
  }
}

