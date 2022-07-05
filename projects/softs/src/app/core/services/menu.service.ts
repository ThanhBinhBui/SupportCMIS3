import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigService } from '../../config/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  protected url = ConfigService.config.url;
  private menuSource = new Subject<string>();
  private resetSource = new Subject();

  constructor(private http: HttpClient) { }

  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();

  onMenuStateChange(key: string): void {
    this.menuSource.next(key);
  }

  reset(): void {
    this.resetSource.next();
  }

  public getMenuBarByUser(param: any): any {
    return this.http.post(this.url.qtht + 'getMenuBarByUser', param);
  }
}
