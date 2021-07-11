import {LogLevel} from "./rng-logger-api";
import {LoggerFactory, logLevelAsLcString} from "./rng-logger-providers";

/**
 * Log decorators metadata
 * @see Log
 */
export interface LogDecoratorMetadata {
  /**
   * Log level to use. Default is DEBUG
   * @see LogLevel
   */
  level?: LogLevel
  /**
   * a message to apply
   */
  message?: string;
}

/**
 * @Log decorator for class methods
 * @param logMethod optional configuration
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
