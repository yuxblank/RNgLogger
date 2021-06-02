import {APP_INITIALIZER, getPlatform, Injector, PLATFORM_INITIALIZER, StaticProvider} from "@angular/core";
import {DEFAULT_OPTIONS, Logger, LoggerOptions, LogLevel, LogStreamHandler, RNG_LOGGER_OPTS} from "./rng-logger-api";
import {ReactiveLogStreamHandler} from "./reactive-log-stream-handler";
import { RngLogger } from "./rng-logger";

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


export function RNgLoggerFactory(injector: Injector) : Logger {
  try {
     return new RngLogger(injector.get(LogStreamHandler));
  } catch {
    return NOP_LOGGER;
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


export function LoggerFactory(injector?: Injector): Logger | RngLogger {
  if (!injector) {
    let platform = getPlatform();
    if (!platform) {
      return NOP_LOGGER;
    }
    try {
      return platform.injector.get(Logger);
    } catch {
      return NOP_LOGGER;
    }
  }
  try {
    return injector.get(Logger);
  } catch {
    return NOP_LOGGER;
  }
}

function logLevelAsLcString(level: LogLevel):string{
  switch (level){
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


export const PLATFORM_CONSOLE_LOGGER: StaticProvider = {provide: PLATFORM_INITIALIZER, multi: true, useFactory: browserLoggerFactory, deps:[LogStreamHandler]};
export const APP_CONSOLE_LOGGER: StaticProvider = {provide: APP_INITIALIZER,multi:true, useFactory: browserLoggerFactory, deps:[LogStreamHandler]};

export function browserLoggerFactory(handler: LogStreamHandler) {
  return () => {
    handler.last$()
      .subscribe(next => {
          // @ts-ignore
        console[logLevelAsLcString(next.level)](next.message, ...next.options)
      })
  }

}

