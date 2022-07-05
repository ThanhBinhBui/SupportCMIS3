import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../config/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ScadaService {
  protected apiServer = ConfigService.config.url;


  constructor(private http: HttpClient) { }

  public spc_Scada_Dashboard(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_Dashboard', param);
  }

  public spc_Scada_Dashboard_KetNoi(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_Dashboard_KetNoi', param);
  }

  public getAllDMTinh(param: any): Observable<any> {
    return this.http.get(this.apiServer.scada + 'HISMessage/getAllDMTinh', param);
  }

  public spc_Scada_BM1SuCoNGCCD(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'PMIS_EVNSPC/spc_Scada_BM1SuCoNGCCD', param);
  }

  public spc_Scada_BM2SuCoCCDSCADA(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_BM2SuCoCCDSCADA', param);
  }

  public spc_Scada_BM1A_TheoDoiCongSuat(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'AppMeter/spc_Scada_BM1A_TheoDoiCongSuat', param);
  }

  public spc_Scada_BM1ATinhHinhSCLD110(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'PMIS_EVNSPC/spc_Scada_BM1ATinhHinhSCLD110', param);
  }

  public spc_Scada_BM1ATinhHinhSCLD22(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'PMIS_EVNSPC/spc_Scada_BM1ATinhHinhSCLD22', param);
  }

  public spc_Scada_BM3_SuCoSuatSuCo(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'PMIS_EVNSPC/spc_Scada_BM3_SuCoSuatSuCo', param);
  }

  public spc_Scada_BM4_SuCoTheoDV(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'PMIS_EVNSPC/spc_Scada_BM4_SuCoTheoDV', param);
  }

  public spc_Scada_BM5_THTHCongSuatSanLuong(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'AppMeter/spc_Scada_BM5_THTHCongSuatSanLuong', param);
  }

  public spc_Scada_BM6_ThongKeSanLuongThang(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'AppMeter/spc_Scada_BM6_ThongKeSanLuongThang', param);
  }

  public spc_Scada_BM7_CongSuatPhuTaiNgay(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'AppMeter/spc_Scada_BM7_CongSuatPhuTaiNgay', param);
  }

  public spc_Scada_BM8_CongSuatNgay21PC(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'AppMeter/spc_Scada_BM8_CongSuatNgay21PC', param);
  }

  public spc_Scada_BM9_SanLuongNgay(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'AppMeter/spc_Scada_BM9_SanLuongNgay', param);
  }

  public spc_Scada_BM10TheoDoiCongSuat_Scada(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_BM10TheoDoiCongSuat_Scada', param);
  }

  public spc_Scada_BM14MatKetNoi(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_BM14MatKetNoi', param);
  }

  public spc_Scada_BM15MatKetNoi_TK(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_BM15MatKetNoi_TK', param);
  }

  public spc_Scada_BM16TheoDoiKetNoi(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_BM16TheoDoiKetNoi', param);
  }

  public spc_Scada_BM17ThongKeKetNoiTBA(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_BM17ThongKeKetNoiTBA', param);
  }

  public spc_Scada_BM18ThongKeKetNoiTheoTinh(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_BM18ThongKeKetNoiTheoTinh', param);
  }

  public spc_Scada_BM19ThongKeHieuLoaiTB(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_BM19ThongKeHieuLoaiTB', param);
  }

  public spc_Scada_BM20AThongKeThietBi(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_BM20AThongKeThietBi', param);
  }

  public spc_Scada_BM20BBaoCaoDKX(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_BM20BBaoCaoDKX', param);
  }

  public spc_Scada_BM20CTongHopKQThaoTacXa(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/spc_Scada_BM20CTongHopKQThaoTacXa', param);
  }

  public DOC_CATEGORY_ACTIVE(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/DOC_CATEGORY_ACTIVE', param);
  }

  public DOC_CATEGORY(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/DOC_CATEGORY', param);
  }

  public DOC_FILE_BY_CATEGORY_ID(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/DOC_FILE_BY_CATEGORY_ID', param);
  }

  public DOC_FILE_CRU(param: any): Observable<any> {
    const formData: FormData = new FormData();
    let headersConfig = new HttpHeaders();
    headersConfig.append('Content-Type', 'multipart/form-data');
    headersConfig.append('Accept', 'application/json');
    if (param.FILE_CONTENT) {
      formData.append('FILE_CONTENT', param.FILE_CONTENT, param.FILE_CONTENT.name);
    }
    else {
      formData.append('FILE_CONTENT', param.FILE_CONTENT);
    }
    formData.append('CATEGORY_ID', param.CATEGORY_ID);
    formData.append('ORD', param.ORD);
    formData.append('TITLE', param.TITLE);
    formData.append('FILE_ID', param.FILE_ID ? param.FILE_ID : "");
    return this.http.post(this.apiServer.scada + 'SCADA/DOC_FILE_CRU', formData, { headers: headersConfig });
  }

  public DOC_FILE_DEL(param: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('FILE_ID', param.FILE_ID);
    return this.http.post(this.apiServer.scada + 'SCADA/DOC_FILE_DEL', formData);
  }

  public DOC_CATEGORY_DEL(param: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('CATEGORY_ID', param.CATEGORY_ID);
    return this.http.post(this.apiServer.scada + 'SCADA/DOC_CATEGORY_DEL', formData);
  }

  public DOC_CATEGORY_CRU(param: any): Observable<any> {
    const formData: FormData = new FormData();
    let headersConfig = new HttpHeaders();
    headersConfig.append('Content-Type', 'multipart/form-data');
    headersConfig.append('Accept', 'application/json');
    formData.append('IS_ACTIVE', param.IS_ACTIVE ? param.IS_ACTIVE : false);
    formData.append('ORD', param.ORD);
    formData.append('CATEGORY_NAME', param.CATEGORY_NAME);
    formData.append('CATEGORY_ID', param.CATEGORY_ID ? param.CATEGORY_ID : "");
    return this.http.post(this.apiServer.scada + 'SCADA/DOC_CATEGORY_CRU', formData, { headers: headersConfig });
  }

  public GetFileById(param: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('FILE_ID', param.FILE_ID);
    return this.http.post(this.apiServer.scada + 'SCADA/GetFileById', formData, {
      responseType: 'arraybuffer'
    });
  }

  public SendMail(param: any): Observable<any> {
    const formData: FormData = new FormData();
    let headersConfig = new HttpHeaders();
    headersConfig.append('Content-Type', 'multipart/form-data');
    headersConfig.append('Accept', 'application/json');
    if (param.FILE_CONTENT) {
      formData.append('FILE_CONTENT', param.FILE_CONTENT, param.FILE_CONTENT.name);
    }
    else {
      formData.append('FILE_CONTENT', param.FILE_CONTENT);
    }
    formData.append('FULL_NAME', param.FULL_NAME);
    formData.append('ReportType', param.ReportType);
    formData.append('Subject', param.Subject);
    formData.append('HtmlMsg', param.HtmlMsg);
    return this.http.post(this.apiServer.scada + 'Mail/SendMail', formData, { headers: headersConfig });
  }

  public CA_IMAGE(param: any): Observable<any> {
    return this.http.post(this.apiServer.scada + 'SCADA/CA_IMAGE', param);
  }

  public CA_IMAGE_CRU(param: any): Observable<any> {
    const formData: FormData = new FormData();
    let headersConfig = new HttpHeaders();
    headersConfig.append('Content-Type', 'multipart/form-data');
    headersConfig.append('Accept', 'application/json');
    if (param.FILE_CONTENT) {
      formData.append('FILE_CONTENT', param.FILE_CONTENT, param.FILE_CONTENT.name);
    }
    else {
      formData.append('FILE_CONTENT', param.FILE_CONTENT);
    }
    formData.append('USER_ID', param.USER_ID);
    formData.append('USER_ID_CA', param.USER_ID_CA);
    formData.append('MARGIN_LEFT', param.MARGIN_LEFT);
    formData.append('MARGIN_BOTTOM', param.MARGIN_BOTTOM);
    formData.append('CA_IMAGE_ID', param.CA_IMAGE_ID ? param.CA_IMAGE_ID : "");
    return this.http.post(this.apiServer.scada + 'SCADA/CA_IMAGE_CRU', formData, { headers: headersConfig });
  }
}