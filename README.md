[![Coverage Status](https://coveralls.io/repos/github/yuxblank/RNgLogger/badge.svg?branch=master)](https://coveralls.io/github/yuxblank/RNgLogger?branch=master)

# RNgLogger
The Reactive Angular Logging framework you wanted!

`RNgLogger` is a logging API that abstract the log stream from the actual log handler, allowing supporting multiple log targets at the same time within your Angular Application.

Easily switch between platforms (browser, server) with different logging handlers using the same API.

Straightforward replace for console usage!

From `console.info("message")` To  `LoggerFactory().info("message")`

## Features
- Simple logger interface as a reduced set of window.console
- Opt-in replacement for your un-wanted console.log statements
- Configurable level filtering and Log retention
- RX.JS based log stream handler allow multiple targets at the same time (console, FileSystem, Http Endpoints etc...)
- Angular Platform Logger allow to use the logger interface by Injection and via LoggerFactory() as most of the Logging frameworks
- No operation Logger (NOP) is provided by default when the logger it's not provided or cannot be resolved. (can be configured to throw error)
- Logger can be used anywhere, libraries included, and when the application does not register it's just a NOP implementation
- A built-in window.console handler for Platform browser apps!


## Getting started

`RNgLogger` is an Angular platform tool, to use it you must register the required providers at platform level.

NPM install:

`npm i rng-logger`


### Register the platform Logger

_In your Angular application entry (usually `main.ts` file), add the `RNgPlatformLogger` factory call._
```typescript
import {LogLevel, PLATFORM_CONSOLE_LOGGER, RNgPlatformLogger} from "rng-logger";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(
    RNgPlatformLogger(), // platForm
).bootstrapModule(AppModule)
  .catch(err => console.error(err));

```

`RNgPlatformLogger` is a factory that returns the providers required for the platform, and accept a configuration if needed.

_To Change the default configuration, you can apply like this:_

```typescript
import {LogLevel, PLATFORM_CONSOLE_LOGGER, RNgPlatformLogger} from "rng-logger";

RNgPlatformLogger({
      level: environment.production ? LogLevel.ERROR : LogLevel.TRACE, // log level
      maxBuffer: 100, // max items to retain
      nonResolvedStrategy: "ERROR" // strategy when Logger is not resolved
})
```


### Register a handler or create your own

A handler is an object that subscribe to the logger stream to produce an effect, for instance logging with the console.

_To use the provided console logger (browser only), just add the provider to the platform:_

```typescript
import {LogLevel, PLATFORM_CONSOLE_LOGGER, RNgPlatformLogger} from "rng-logger";

platformBrowserDynamic([
    ...RNgPlatformLogger(),
    PLATFORM_CONSOLE_LOGGER // PLATORM CONSOLE LOGGER 
  ]
).bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

`PLATFORM_CONSOLE_LOGGER` uses window.console to output the log stream.


You can supply multiple Handlers via `PLATFORM_INITIALIZER` (by registering at platform creation) or `APP_INITIALIZER` (in App modules).
Also, creating an instance of the handler in the module instantiation is possible, not recommended tough.

_An example function of a log handler is like this:_
```typescript
export function myHttpLogHandler(handler: LogStreamHandler, httpClient: HttpClient) {
  return () => {
    handler.last$()
      .pipe(switchMap(e => {
        return httpClient.post(`/api/log-service/${e.time.getTime()}`, {event: e.message, data: e.options})
      }))
      .subscribe(next => {})
  }
}

export const MY_HTTP_LOG_HANDLER: StaticProvider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: myHttpLogHandler,
  deps: [LogStreamHandler, HttpClient]
};

@NgModule({
  providers: [
    MY_HTTP_LOG_HANDLER
  ]
})
export class MyAppModule {}
```
### Using the logger
`RNgLogger` can be used via injection or by using the `LoggerFactory`.

The factory is a quite common pattern if you come from `SLF4J`, `Log4j` and many others.

The factory can return the root logger (Platform) directly when used with no-args, or an injector logger by providing the injector.

*Example of the Platform logger factory:*
```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  private readonly logger: Logger = LoggerFactory(); // get platform logger
  constructor() {}
  ngOnInit(): void {
    this.logger.info("App started");
  }
}
```

*Example of injected logger:*
```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private logger: Logger) {}
  ngOnInit(): void {
    this.logger.info("App started");
  }
}
```

*Example of logger factory via Injector:*
```typescript
@Directive({
  selector: 'my-directive',
})
export class MyDirective implements OnInit{
  constructor(private viewRef: ViewContainerRef) {}
  ngOnInit(): void {
    LoggerFactory(this.viewRef.injector).warn("Injector factory")
  }
}
```


## Known Limitations
- LoggerFactory cannot be referenced as a static member because the Angular Platform is not available and any call to getPlatform will return null.
    - use `private readonly logger: Logger = LoggerFactory();` and not `private static readonly logger: Logger = LoggerFactory();`

