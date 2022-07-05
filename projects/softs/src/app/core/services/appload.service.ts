import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../config/models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ApploadService {

  static config: Config;

  constructor(private http: HttpClient) { }

  init(): any {
    const jsonFile = `assets/config/config.json`;
    return new Promise<void>((resolve, reject) => {
      // log out
      // localStorage.removeItem('SPC_QLTK_USER');

      // get config
      this.http.get(jsonFile).toPromise().then((response: Config) => {
        ApploadService.config = response as Config;
        resolve();
      }).catch((response: any) => {
        reject('Could not load the config file');
      });
    });
  }
}
