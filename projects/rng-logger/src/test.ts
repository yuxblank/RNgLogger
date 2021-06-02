// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import {getTestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {PLATFORM_CONSOLE_LOGGER, RNgPlatformLogger} from "./lib/rng-logger-providers";
import {LogLevel} from "./lib/rng-logger-api";

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(
    [...RNgPlatformLogger({
      maxBuffer: 10,
      level: LogLevel.DEBUG
    }), PLATFORM_CONSOLE_LOGGER]
  )
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
