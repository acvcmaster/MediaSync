import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  nativeWarning(methodName: string) {
    console.warn(`Native: tried calling ${methodName}, but Cordova is not available. ` +
      `Make sure to include cordova.js or run in a device/simulator`);
  }
}
