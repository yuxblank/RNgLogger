import {Observable} from "rxjs";
import {InjectionToken} from "@angular/core";

export abstract class Logger {
  abstract info(message: string, ...options: any[]):void;
  abstract warn(message: string, ...options: any[]):void;
  abstract error(message: string, ...options: any[]):void;
  abstract debug(message: string, ...options: any[]):void;
  abstract trace(message: string, ...options: any[]):void;
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
  level: LogLevel
}

export const DEFAULT_OPTIONS : LoggerOptions = {
  maxBuffer: 50,
  level: LogLevel.ERROR
}

export const RNG_LOGGER_OPTS = new InjectionToken<LoggerOptions>("RNG_LOGGER_OPTS");



export abstract class LogStreamHandler {
  abstract put(event: Event): void;
  abstract get$(level?: LogLevel): Observable<Event[]>;
  abstract last$(level?:LogLevel): Observable<Event>;
  abstract clear():void;
}
