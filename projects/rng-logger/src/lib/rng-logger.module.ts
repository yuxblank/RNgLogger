import {Injector, NgModule} from '@angular/core';
import {Logger} from "./rng-logger-api";
import {RNgLoggerFactory} from "./rng-logger-providers";


@NgModule({
  providers: [
    {provide: Logger, useFactory: RNgLoggerFactory, deps: [Injector]},
  ]
})
export class RNgLoggerModule {}
