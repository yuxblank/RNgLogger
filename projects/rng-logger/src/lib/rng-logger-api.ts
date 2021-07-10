import {Observable} from "rxjs";
import {getPlatform, Inject, InjectionToken} from "@angular/core";
import {LoggerFactory, logLevelAsLcString} from "./rng-logger-providers";

export abstract class Logger {
  abstract info(message: string|any, ...options: any[]):void;
  abstract warn(message: string|any, ...options: any[]):void;
  abstract error(message: string|any, ...options: any[]):void;
  abstract debug(message: string|any, ...options: any[]):void;
  abstract trace(message: string|any, ...options: any[]):void;
}

export enum LogLevel {
  TRACE,
  DEBUG,
  ERROR,
  WARN,
  INFO
}

export interface Event {
  message: any|string;
  level: LogLevel;
  options: any[];
  time: Date;
}

export type LoggerOptions = {
  maxBuffer: number;
  level: LogLevel,
  nonResolvedStrategy: "NOP" | "ERROR"
}

export const DEFAULT_OPTIONS : LoggerOptions = {
  maxBuffer: 50,
  level: LogLevel.ERROR,
  nonResolvedStrategy: "NOP"
}

export const RNG_LOGGER_OPTS = new InjectionToken<LoggerOptions>("RNG_LOGGER_OPTS");



export abstract class LogStreamHandler {
  abstract put(event: Event): void;
  abstract get$(level?: LogLevel): Observable<Event[]>;
  abstract last$(level?:LogLevel): Observable<Event>;
  abstract clear():void;
}

export interface LogDecoratorMetadata {
  level?: LogLevel
  message?: string;
}

/**
 * @Log decorator
 * @param logMethod
 * @constructor
 */
export const Log = (logMethod?: LogDecoratorMetadata) => (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
  let original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    let loggerFactory = LoggerFactory();
    let level = LogLevel.DEBUG;
    if (logMethod && logMethod?.level) {
      level = logMethod.level
    }
    let targetName = "";
    if (target.constructor){
      targetName = `${target.constructor.name}::`;
    }
    let message = logMethod?.message ? " " +logMethod.message : "";
    // @ts-ignore
    loggerFactory[logLevelAsLcString(level)](`${targetName}${propertyKey}${message}`, ...args);
    original.apply(this, args);
  }
}
