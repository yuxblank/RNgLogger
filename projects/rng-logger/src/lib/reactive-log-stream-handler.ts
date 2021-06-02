import {LoggerOptions, LogLevel, LogStreamHandler, RNG_LOGGER_OPTS} from "./rng-logger-api";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Inject, Injectable} from "@angular/core";
import {Event} from "./rng-logger-api";
import {filter, map} from "rxjs/operators";

@Injectable()
export class ReactiveLogStreamHandler extends LogStreamHandler{

  private readonly events: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>([]);


  constructor(@Inject(RNG_LOGGER_OPTS) private opts: LoggerOptions) {
    super();
  }

  get$(level?: LogLevel): Observable<Event[]> {
    return this.events.pipe(
      map(e => e.filter(f => {
        if (level) { return f.level >= level; }
        else return f.level >= this.opts.level;
      })),
      filter(value => value.length > 0),
    )
  }

  last$(level?: LogLevel): Observable<Event> {
    return this.events.pipe(
      map(e => e.filter(f => {
        if (level) { return f.level >= level; }
        else return f.level >= this.opts.level;
      })),
      filter(value => value.length > 0),
      map(value => value[0]),
      filter(value =>  !!value)
    )
  }

  put(event: Event): void {
    let value = this.events.getValue();
    value.unshift(event);
    let events = value.slice(0, this.opts.maxBuffer);
    this.events.next(events)
    }

  clear(): void {
    this.events.next([]);
  }




}
