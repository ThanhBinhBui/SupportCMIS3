import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Config } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  static config: Config;
  constructor(private http: HttpClient) { }

  load(): any {
    // localStorage.removeItem('SPC_QLTK_USER');
    const jsonFile = `assets/config/config.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response: Config) => {
        ConfigService.config = response as Config;
        resolve();
      }).catch((response: any) => {
        reject('Could not load the config file');
      });
    });
  }
}
