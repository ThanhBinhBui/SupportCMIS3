import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfigService } from '../../config/services/config.service';

@Injectable({
   providedIn: 'root'
})
export class HISMessageService {
   protected apiURL = ConfigService.config.url.scada;
   protected apiHRMS = ConfigService.config.url.hrms;
   protected apiQTHT = ConfigService.config.url.qtht;
   protected apiCmis = ConfigService.config.url.spcmis;

   constructor(private http: HttpClient) { }

   public getCMISDoDemThietBiTreoThao(param: any): Observable<any> {
      return this.http.post(this.apiCmis + "getCMISDoDemThietBiTreoThao", param);
   }

   public getScadaURL() {
      return this.apiURL;
   }
   public convertStringToDate(str) {
      if (Object.prototype.toString.call(str) === '[object Date]') {
         return str.getFullYear() + '-' + (str.getMonth() + 1) + '-' + str.getDate();
      } else if (str !== null && str !== '' && str.length === 10) {
         return str.substr(6, 4) + '-' + str.substr(3, 2) + '-' + str.substr(0, 2);
      } else if (str !== null && str !== '' && str.length < 10) {
         if (str.includes("/")) {
            let arr = str.split("/");
            return arr[2] + '-' + arr[1] + '-' + arr[0];
         } else if (str.includes("-")) {
            let arr = str.split("-");
            return arr[2] + '-' + arr[1] + '-' + arr[0];
         }
         return null;
      } else {
         return null;
      }
   }
   public insertHISMessage(param: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertHISMessage", param);
   }
   public getShortUserByOrg(param: any): Observable<any> {
      return this.http.post(this.apiQTHT + "getShortUserByOrg", param);
   }
   public insertHISMessageDirection(param: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertHISMessageDirection", param);
   }
   public insertTinHieuCongSuatDirection(param: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertTinHieuCongSuatDirection", param);
   }
   public insertHISMessageFromFolder(): Observable<any> {
      return this.http.get(this.apiURL + "HISMessage/insertHISMessageFromFolder");
   }
   public getDMTinh(): Observable<any> {
      console.log(this.apiURL);
      return this.http.get(this.apiURL + "HISMessage/getAllDMTinh");
   }
   public insertDMTinh(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertDMTinh", body);
   }
   public updateDMTinh(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateDMTinh", body);
   }
   public deleteDMTinh(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteDMTinh", body);
   }
   public getDMTBASPC(): Observable<any> {
      return this.http.get(this.apiURL + "HISMessage/getDMTBASPC");
   }
   public insertDMTBASPC(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertDMTBASPC", body);
   }
   public updateDMTBAPSC(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateDMTBASPC", body);
   }
   public deleteDMTBAPSC(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteDMTBASPC", body);
   }

   public getDMTBAKH(): Observable<any> {
      return this.http.get(this.apiURL + "HISMessage/getDMTBAKH");
   }
   public insertDMTBAKH(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertDMTBAKH", body);
   }
   public updateDMTBAKH(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateDMTBAKH", body);
   }
   public deleteDMTBAKH(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteDMTBAKH ", body);
   }

   public getDMLLTB22(): Observable<any> {
      return this.http.get(this.apiURL + "HISMessage/getDMLLTB22");
   }
   public insertDMLLTB22(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertDMLLTB22", body);
   }
   public updateDMLLTB22(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateDMLLTB22", body);
   }
   public deleteDMLLTB22(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteDMLLTB22 ", body);
   }

   public getDMLLTBA(): Observable<any> {
      return this.http.get(this.apiURL + "HISMessage/getDMLLTBA");
   }
   public insertDMLLTBA(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertDMLLTBA", body);
   }
   public updateDMLLTBA(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateDMLLTBA", body);
   }
   public deleteDMLLTBA(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteDMLLTBA ", body);
   }
   public getDMLLTKH(): Observable<any> {
      return this.http.get(this.apiURL + "HISMessage/getDMLLTKH");
   }
   public insertDMLLTKH(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertDMLLTKH", body);
   }
   public updateDMLLTKH(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateDMLLTKH", body);
   }
   public deleteDMLLTKH(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteDMLLTKH", body);
   }
   public getTest(): Observable<any> {
      return of({
         "data": [
            {
               "id": 1000,
               "name": "James Butt",
               "country": {
                  "name": "Algeria",
                  "code": "dz"
               },
               "company": "Benton, John B Jr",
               "date": "2015-09-13",
               "status": "unqualified",
               "verified": true,
               "activity": 17,
               "representative": {
                  "name": "Ioni Bowcher",
                  "image": "ionibowcher.png"
               },
               "balance": 70663
            }
         ]
      }
      );
   }
   public getBM11(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getBM11", body);
   }
   public updateReasonBM11(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateReasonBM11", body);
   }
   public getBM12(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getBM12", body);
   }
   public getBM24SoNhatKyVanHanhCa(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getNhatKyVanHanhCa", body);
   }
   public insertSoNhatKyVanHanhCa(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertSoNhatKyVanHanhCa", body);
   }
   public updateSoNhatKyVanHanhCa(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateSoNhatKyVanHanhCa", body);
   }
   public deleteSoNhatKyVanHanhCa(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteSoNhatKyVanHanhCa", body);
   }
   public getBM24SoNhatKyVanHanh(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getNhatKyVanHanh", body);
   }
   public getBM24NhatKyVanHanhByDate(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getNhatKyVanHanhByDate", body);
   }
   public insertSoNhatKyVanHanh(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertSoNhatKyVanHanh", body);
   }
   public updateSoNhatKyVanHanh(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateSoNhatKyVanHanh", body);
   }
   public deleteSoNhatKyVanHanh(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteSoNhatKyVanHanh", body);
   }
   public getBM24SoNhatKyVanHanhLuuY(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getNhatKyVanHanhLuuY", body);
   }
   public insertSoNhatKyVanHanhLuuY(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertSoNhatKyVanHanhLuuY", body);
   }
   public updateSoNhatKyVanHanhLuuY(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateSoNhatKyVanHanhLuuY", body);
   }
   public deleteSoNhatKyVanHanhLuuY(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteSoNhatKyVanHanhLuuY", body);
   }
   public getBM24SoNhatKyVanHanhTinhTrang(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getNhatKyVanHanhTinhTrang", body);
   }
   public insertSoNhatKyVanHanhTinhTrang(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertSoNhatKyVanHanhTinhTrang", body);
   }
   public updateSoNhatKyVanHanhTinhTrang(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateSoNhatKyVanHanhTinhTrang", body);
   }
   public deleteSoNhatKyVanHanhTinhTrang(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteSoNhatKyVanHanhTinhTrang", body);
   }
   public getAllUser(): Observable<any> {
      return this.http.get(this.apiURL + "HISMessage/getAllUser");
   }
   public getAllUserByDonVi(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getAllUserByDonVi", body);
   }
   public getAllRole(): Observable<any> {
      return this.http.get(this.apiURL + "HISMessage/getAllRole");
   }
   public getAllEmail(): Observable<any> {
      return this.http.get(this.apiURL + "HISMessage/getAllEmail");
   }
   public insertEmail(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertEmail", body);
   }
   public updateEmail(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateEmail", body);
   }
   public deleteEmail(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteEmail", body);
   }
   public getAllDMCa(): Observable<any> {
      return this.http.get(this.apiURL + "HISMessage/getAllDMCa");
   }
   public checkStatusCaBeforeCreateCa(): Observable<any> {
      return this.http.get(this.apiURL + "HISMessage/checkStatusCaBeforeCreateCa");
   }
   public insertDMCa(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertDMCa", body);
   }
   public deleteDMCa(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteDMCa", body);
   }
   public insertUser(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertUser", body);
   }
   public getSoNhatKyVanHanhCa(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getSoNhatKyVanHanhCa", body);
   }
   public getHISMessageLog(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getHISMessageLog", body);
   }
   public getTinHieuCongSuatLog(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getTinHieuCongSuatLog", body);
   }
   public insertCa(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertCa", body);
   }
   public updateUser(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/updateUser", body);
   }
   public deleteUser(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteUser", body);
   }
   public getBM13(body: any): Observable<any> {
      return this.http.post(this.apiURL + "PMIS_EVNSPC/spc_Scada_BM13_CongTacTheoDV", body);
   }
   public getBM21ReportMatKetNoi(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getBM21ReportMatKetNoi", body);
   }
   public getBM21ReportTongMatKetNoi(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getBM21ReportTongMatKetNoi", body);
   }
   public getBM21ReportTinhHinhDieuKhien(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getBM21ReportTinhHinhDieuKhien", body);
   }
   public getBM21ReportChatLuongTinHieu(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getBM21ReportChatLuongTinHieu", body);
   }
   public insertBM21ReportChatLuongTinHieu(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertBM21ReportChatLuongTinHieu", body);
   }
   public getAllDonViHRM(): Observable<any> {
      const body = JSON.stringify({ "ORG_CODE": "ALL" });
      return this.http.post(this.apiHRMS + 'getOrgByOrgCode', body);
   }
   public getAllUserByDonViHRM(body): Observable<any> {
      return this.http.post(this.apiHRMS + 'getEmployeeByDept', body);
   }
   public getBM22AHienTrangDongBoThoiGianRELAY110(body): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getBM22AHienTrangDongBoThoiGianRELAY110", body);
   }
   public getBM22TongHopDongBoThoiGianRELAY110(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getBM22TongHopDongBoThoiGianRELAY110", body);
   }
   public getBM23ThaoTacTaiTBA(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getBM23ThaoTacTaiTBA", body);
   }
   public insertBM23ThaoTacTaiTBA(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertBM23ThaoTacTaiTBA", body);
   }
   public deleteBM23ThaoTacTaiTBA(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getBM22AHienTrangDongBoThoiGianRELAY110", body);
   }
   public insertBM22TongHopDongBoThoiGianRELAY110(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertBM22TongHopDongBoThoiGianRELAY110", body);
   }
   public deleteBM22TongHopDongBoThoiGianRELAY110(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteBM22TongHopDongBoThoiGianRELAY110", body);
   }
   public insertBM22AHienTrangDongBoThoiGianRELAY110(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/insertBM22AHienTrangDongBoThoiGianRELAY110", body);
   }
   public deleteBM22AHienTrangDongBoThoiGianRELAY110(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/deleteBM22AHienTrangDongBoThoiGianRELAY110", body);
   }
   public convertHtmlToPdf(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/convertHtmlToPdf", body);
   }
   public getSoNhatKyVanHanhDMCa(body: any): Observable<any> {
      return this.http.post(this.apiURL + "HISMessage/getSoNhatKyVanHanhDMCa", body);
   }
}
