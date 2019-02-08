// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import * as _ from 'lodash';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./app', true, /\.spec\.ts$/);
context.keys()
  .forEach(file => {
    if (_.includes(file, './login/') === true) {
      context(file);
    }
    if (_.includes(file, './reservation/') === true) {
      context(file);
    }
    if (_.includes(file, './import/') === true) {
      context(file);
    }
    if (_.includes(file, './export/') === true) {
      context(file);
    }
  });
// const context = require.context('./app/reservation/reservation.component.spec.ts');
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
