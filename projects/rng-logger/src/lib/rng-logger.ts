import { Injectable } from '@angular/core';
import {Event, Logger, LogLevel, LogStreamHandler} from "./rng-logger-api";

@Injectable()
export class RngLogger extends Logger{

  constructor(private streamHandler: LogStreamHandler) {
    super();
  }

  debug(message: string|any, ...options: any[]): void {
    this.streamHandler.put(RngLogger.createEvent(LogLevel.DEBUG, message, options))
  }

  error(message: string|any, ...options: any[]): void {
    this.streamHandler.put(RngLogger.createEvent(LogLevel.ERROR, message, options))
  }

  info(message: string|any, ...options: any[]): void {
    this.streamHandler.put(RngLogger.createEvent(LogLevel.INFO, message, options))
  }

  trace(message: string|any, ...options: any[]): void {
    this.streamHandler.put(RngLogger.createEvent(LogLevel.TRACE, message, options))
  }

  warn(message: string|any, ...options: any[]): void {
    this.streamHandler.put(RngLogger.createEvent(LogLevel.WARN, message, options))
  }

  private static createEvent(level: LogLevel, message: any, options: any[]):Event {
    return {
      level: level,
      message: message,
      options: options,
      time: new Date()
    };
  }
}
