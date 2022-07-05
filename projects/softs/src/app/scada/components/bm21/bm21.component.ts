import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { HISMessageService } from '../../services/his-message.service';
import * as FileSaver from 'file-saver';
import * as fs from 'file-saver';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/tristatecheckbox';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-bm21',
  templateUrl: './bm21.component.html',
  styleUrls: ['./bm21.component.css']
})
export class Bm21Component implements OnInit {

  listMain: any[];
  mainTong: any;
  monthCurrent: any;
  yearCurrent: any;
  mainCurrent: any;
  loading: boolean;
  FROM_DATE: string;
  TO_DATE: string;
  login: any;
  lstORG: any[];
  selectedORG_CODE: string;
  editDialog: boolean;
  submitted: boolean;

  constructor(private hisMessageService: HISMessageService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService,
    private reportService: ReportService) {
    this.breadcrumbService.setItems([
      // { label: 'QL Báo cáo SCADA', routerLink: '/' },
      { label: 'BM21 - Đánh giá tình trạng vận hành SCADA tại các TBA', routerLink: 'thietbi/bm21' }
    ]);
  }

  ngOnInit(): void {
    this.config.setTranslation({
      dayNames: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
      dayNamesShort: ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
      dayNamesMin: ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
      monthNames: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
      monthNamesShort: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
      today: 'Hôm nay',
      clear: 'Hủy',
      weekHeader: 'Tuần'
    });
    let now = new Date();
    var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.FROM_DATE = this.datePipe.transform(firstDay, 'MM/yyyy');
    this.TO_DATE = this.datePipe.transform(now, 'MM/yyyy');
    this.login = JSON.parse(localStorage.getItem('SPC_KBYT_USER'));
    this.search();
  }

  search() {
    this.loading = true;
    let month = Number(moment(this.FROM_DATE, "MM").format('MM')).toString();
    let year = Number(moment(this.FROM_DATE, "MM/YYYY").format('MM/YYYY').substr(3, 4)).toString();

    this.monthCurrent = month;
    this.yearCurrent = year;
    this.listMain = [];
    console.log({ month, year });
    this.getReport({ month, year });
    //this.loading=false;
  }
  handleData(listMatKetNoi, listTongMatKetNoi, listTinhHinhDieuKhien, listChatLuongTinHieu) {
    let result = [];
    if (listChatLuongTinHieu !== null && listChatLuongTinHieu.length !== 0) {
      listChatLuongTinHieu.map((item, index) => {
        item['STT'] = index + 1;
        let itemMatKetNoi = listMatKetNoi === null ? [] : listMatKetNoi.filter(i => i.MA_DVIQLY === item.MA_DVIQLY);
        let itemTongMatKetNoi = listTongMatKetNoi === null ? [] : listTongMatKetNoi.filter(i => i.MA_DVIQLY === item.MA_DVIQLY);
        let itemTinhHinhDieuKhien = listTinhHinhDieuKhien === null ? [] : listTinhHinhDieuKhien.filter(i => i.MA_DVIQLY === item.MA_DVIQLY);
        if (itemMatKetNoi !== [] && itemMatKetNoi.length !== 0) {
          item["TONG_GIO_MATKETNOI"] = itemMatKetNoi[0]["TONG_GIO_MATKETNOI"];
          item["TONG_MATKETNOI_KHOIPHUC"] = itemMatKetNoi[0]["TONG_MATKETNOI_KHOIPHUC"];
        } else {
          item["TONG_GIO_MATKETNOI"] = '';
          item["TONG_MATKETNOI_KHOIPHUC"] = '';
        }
        if (itemTongMatKetNoi !== [] && itemTongMatKetNoi.length !== 0) {
          item["TONG_MATKETNOI"] = itemTongMatKetNoi[0]["TONG_MATKETNOI"];
        } else {
          item["TONG_MATKETNOI"] = '';
        }
        if (itemTinhHinhDieuKhien !== [] && itemTinhHinhDieuKhien.length !== 0) {

          item["TONG_22"] = itemTinhHinhDieuKhien[0]["TONG_22"];
          item["TONG_22_TTB"] = itemTinhHinhDieuKhien[0]["TONG_22_TTB"];
          item["TONG_110"] = itemTinhHinhDieuKhien[0]["TONG_110"];
          item["TONG_110_TTB"] = itemTinhHinhDieuKhien[0]["TONG_110_TTB"];
          item["NOTE"] = itemTinhHinhDieuKhien[0]["NOTE"];
        } else {
          item["TONG_22"] = '';
          item["TONG_22_TTB"] = '';
          item["TONG_110"] = '';
          item["TONG_110_TTB"] = '';
          item["NOTE"] = '';
        }

        result.push(item);
      })
    }
    return result;
  }
  getReport(body: any) {
    this.mainTong = {};

    forkJoin([
      this.hisMessageService.getBM21ReportMatKetNoi(body),
      this.hisMessageService.getBM21ReportTongMatKetNoi(body),
      this.hisMessageService.getBM21ReportTinhHinhDieuKhien(body),
      this.hisMessageService.getBM21ReportChatLuongTinHieu(body)]
    ).subscribe(([listMatKetNoi, listTongMatKetNoi, listTinhHinhDieuKhien, listChatLuongTinHieu]) => {
      this.listMain = this.handleData(listMatKetNoi, listTongMatKetNoi, listTinhHinhDieuKhien, listChatLuongTinHieu)

      if (this.listMain.length > 0) {
        for (let i = 0; i < Object.keys(this.listMain[0]).length; i++) {
          const key = Object.keys(this.listMain[0])[i];
          for (let j = 0; j < this.listMain.length; j++) {
            if (key !== 'NOTE' && key !== 'MA_DVIQLY' && key !== 'TEN_DVIQLY' && key !== 'DU' && key !== 'DUNG' && key !== 'STT') {
              const value = Number(this.listMain[j][key]);
              if (typeof value === "number") {
                if (key in this.mainTong) {
                  this.mainTong[key] += value;
                }
                else {
                  this.mainTong[key] = value;
                }
              }
            }

          }
        }
      }
      console.log(this.mainTong);
      console.log(this.listMain);
      console.log(listTinhHinhDieuKhien);
      console.log(listMatKetNoi);
      console.log(listTongMatKetNoi);
      console.log(listTinhHinhDieuKhien);
      this.loading = false;
    })
  }
  getNumber(str: string) {
    return Number(str);
  }

  editItem(main: any) {
    this.mainCurrent = { ...main };
    this.editDialog = true;
  }

  hideDialog() {
    this.editDialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;

    this.hisMessageService.insertBM21ReportChatLuongTinHieu(
      {
        MA_DVIQLY: this.mainCurrent.MA_DVIQLY,
        THANG: this.monthCurrent,
        NAM: this.yearCurrent,
        DU: this.mainCurrent.DU,
        DUNG: this.mainCurrent.DUNG,
        NGUOI_TAO: JSON.parse(localStorage.getItem('user')).FULL_NAME
      }).subscribe(result => {
        if (result.result === 'SUCCESS') {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã cập nhật thành công', life: 3000 });
          this.search();
          this.hideDialog();
        }
      })
  }
  exportExcel() {
    const fileName = 'BM21';
    const title = 'THỐNG KÊ & ĐÁNH GIÁ TÌNH TRẠNG VẬN HÀNH SCADA TẠI CÁC TBA 110KV THÁNG';
    let workbook = this.reportService.showReportBM21(
      this.listMain,
      fileName,
      title
    );
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + '.xlsx');
    });
  }
  exportExcelOld() {
    let table = `<table><tr class="trHeader">
    <th pSortableColumn="TIMESTAMP" class="p-col-1" rowspan="3">STT
        
    </th>
    <th pSortableColumn="MILLI_SECONDS" class="p-col-1" rowspan="3">Đơn Vị
        
    </th>
    <th pSortableColumn="b1" class="p-col-1" rowspan="3">Tên TBA 110kV ĐKX
       
    </th>
    <th pSortableColumn="b2" class="p-col-1" colspan="10">Tình hình thực hiện điều khiển xa
    </th>
</tr>
<tr class="trHeader">
    <th pSortableColumn="TIMESTAMP" class="p-col-1" rowspan="2">Chương trình

    </th>
    <th pSortableColumn="MILLI_SECONDS" class="p-col-1" colspan="3">Tổng số lượng thao tác điều
        khiển xa

    </th>
    <th pSortableColumn="MILLI_SECONDS" class="p-col-1" colspan="3">Số lượng thao tác điều khiển xa
        tốt

    </th>
    <th pSortableColumn="MILLI_SECONDS" class="p-col-1" colspan="3">Số lượng thao tác tại thiết bị

    </th>
</tr>
<tr class="trHeader">
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">110KV

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">22KV

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">Tổng

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">110KV

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">22KV

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">Tổng

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">110KV

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">22KV

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">Tổng

    </th>
</tr>`;
    this.listMain.length === 0 ? null : this.listMain.map(item => {
      table += `<tr class="p-selectable-row">
      <td class="bodySTT">${item.STT}</td>
      <td class="bodySTT">${item.TEN_DVIQLY}</td>
      <td class="bodySTT">${item.TEN_TRAM}</td>
      <td class="bodySTT">SP7</td>
      <td class="bodySTT">${item.TONG_110}</td>
      <td class="bodySTT">${item.TONG_22}</td>
      <td class="bodySTT">${this.getNumber(item.TONG_22) + this.getNumber(item.TONG_110)}</td>
      <td class="bodySTT">${item.TONG_110_GOOD}</td>
      <td class="bodySTT">${item.TONG_22_GOOD}</td>
      <td class="bodySTT">${this.getNumber(item.TONG_22_GOOD) + this.getNumber(item.TONG_110_GOOD)}</td>
      <td class="bodySTT">${item.TONG_110_TTB}</td>
      <td class="bodySTT">${item.TONG_22_TTB}</td>
      <td class="bodySTT">${this.getNumber(item.TONG_22_TTB) + this.getNumber(item.TONG_110_TTB)}</td>
      
  </tr>`;
    });
    table += `</table>`;
    debugger;
    this.saveAsExcelFile(table.replace(/<th/g, '<th style="border: 0.2em solid black; vertical-align: middle;"').replace(/<td/g, '<td style="border: 0.2em solid black; vertical-align: middle;"'), "reportBM12");

    // import("xlsx").then(xlsx => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.lstMain);
    //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   this.saveAsExcelFile(excelBuffer, "reportBM12");
    // });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    debugger;
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xls';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }

}
