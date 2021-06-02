import {NgModule} from '@angular/core';
import {Logger, LogStreamHandler} from "./rng-logger-api";
import {RNgLoggerFactory} from "./rng-logger-providers";


@NgModule({
  providers: [
    {provide: Logger, useFactory: RNgLoggerFactory, deps: [LogStreamHandler]},
  ]
})
export class RNgLoggerModule {}
