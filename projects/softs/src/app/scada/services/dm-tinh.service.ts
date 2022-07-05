import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConfigService } from '../../config/services/config.service';


@Injectable({
  providedIn: 'root'
})
export class DmTinhService {
  protected apiURL = ConfigService.config.url.scada;
  constructor(private http: HttpClient) { }

  public getTinhs(): Observable<any> {
    return this.http.get(this.apiURL + "getAllDMTinh");
  }

  public insertDMTinh(body:any): Observable<any> {
    return this.http.post(this.apiURL + "insertDMTinh",body);
  }
  public updateDMTinh(body:any): Observable<any> {
    return this.http.post(this.apiURL + "updateDMTinh",body);
  }
  public deleteDMTinh(body:any): Observable<any> {
    return this.http.post(this.apiURL + "deleteDMTinh",body);
  }

  
  // getProductsMixed() {
  //     return this.http.get<any>('assets/demo/data/products-mixed.json')
  //     .toPromise()
  //     .then(res => res.data as Product[])
  //     .then(data => data);
  // }

  // getProductsWithOrdersSmall() {
  //     return this.http.get<any>('assets/demo/data/products-orders-small.json')
  //     .toPromise()
  //     .then(res => res.data as Product[])
  //     .then(data => data);
  // }
}
