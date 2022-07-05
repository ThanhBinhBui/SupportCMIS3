import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { HISMessageService } from '../../services/his-message.service';
import * as FileSaver from 'file-saver';
import * as fs from 'file-saver';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-bm22a',
  templateUrl: './bm22a.component.html',
  styleUrls: ['./bm22a.component.css']
})
export class Bm22aComponent implements OnInit {

  trams: any[];
  selectedTram: any;
  filterTrams: any[];
  listMain: any[];
  listCa: any[];
  listTinhTrang: any[];
  listLuuY: any[];
  selectedCa: any;
  selectedCategory: any;
  listCategory: any[];
  contentLuuY: any;
  contentTinhTrang: any;
  idLuuY: any;
  idTinhTrang: any;
  mainCurrent: any;
  FROM_DATE: string;
  TO_DATE: string;
  login: any;
  lstORG: any[];
  listDonVi: any[];
  maDonViSelected: any;
  selectedORG_CODE: string;
  editDialog: boolean;
  submitted: boolean;
  dialog: boolean;
  isUpdate: boolean;
  tinhs: any[];
  filterTinhs: any[];
  filterTinhsDonViNgoai: any[];
  selectedTinh: any;
  selectedTinhDonViNgoai: any;
  loading: boolean;
  monthCurrent: any;
  yearCurrent: any;

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
      { label: 'BM22a - Hiện trạng đồng bộ RELAY 110kV', routerLink: 'thietbi/bm22a' }
    ]);
  }

  ngOnInit(): void {
    this.hisMessageService.getDMTinh().subscribe(data => {
      this.tinhs = data;
    });
    this.hisMessageService.getDMTBASPC().subscribe(data => {
      console.log(data);
      this.trams = data;
    });

    this.hisMessageService.getDMTinh().subscribe(
      data => this.listDonVi = data
    );
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
    console.log(this.FROM_DATE);
    this.search();
    //this.login = JSON.parse(localStorage.getItem('SPC_KBYT_USER'));
  }
  convertStringToDate(str) {
    if (str !== null && str !== '') {
      return str.substr(6, 4) + '-' + str.substr(3, 2) + '-' + str.substr(0, 2);
    } else {
      return null;
    }
  }

  search() {

    this.loading = true;
    let month = Number(moment(this.FROM_DATE, "MM").format('MM')).toString();
    let year = Number(moment(this.FROM_DATE, "MM/YYYY").format('MM/YYYY').substr(3, 4)).toString();
    this.listMain = [];

    this.monthCurrent = month;
    this.yearCurrent = year;
    // console.log({ month, year });
    debugger;

    this.hisMessageService.getBM22AHienTrangDongBoThoiGianRELAY110({ MA_DVIQLY: this.maDonViSelected, month, year }).subscribe(data => {
      if (data !== null && data !== undefined && data.length !== 0) {
        this.listMain = data.map((el, i) => Object.assign(el, { STT: i + 1 }));
      }
      this.loading = false;
    });
  }

  getNumber(str: string) {
    return Number(str);
  }

  openNew() {
    this.mainCurrent = {};
    this.contentTinhTrang = null;
    this.contentLuuY = null;
    this.idTinhTrang = null;
    this.idLuuY = null;
    this.submitted = false;
    this.dialog = true;
    this.isUpdate = false;
  }
  editItem(item: any) {
    this.selectedTram = this.trams.filter(i => i.MA_TRAM === item.MA_TRAM)[0];
    this.mainCurrent = { ...item };
    this.isUpdate = true;
    this.dialog = true;
  }
  hideDialog() {
    this.dialog = false;
    this.isUpdate = false;
    this.submitted = false;
    this.selectedTinh = null;
    this.selectedTinhDonViNgoai = null;
    this.mainCurrent = {};
    this.contentTinhTrang = null;
    this.contentLuuY = null;
    this.idTinhTrang = null;
    this.idLuuY = null;
  }
  close() {
    this.dialog = false;
    this.dialog = false;
    this.isUpdate = false;
    this.submitted = false;
    this.selectedTinh = null;
    this.selectedTinhDonViNgoai = null;
    this.mainCurrent = {};
    this.contentTinhTrang = null;
    this.contentLuuY = null;
    this.idTinhTrang = null;
    this.idLuuY = null;
  };
  saveItem() {
    this.mainCurrent.MA_TRAM = this.selectedTram.MA_TRAM;
    debugger;
    this.hisMessageService.insertBM22AHienTrangDongBoThoiGianRELAY110(Object.assign(this.mainCurrent, { NGUOI_TAO: JSON.parse(localStorage.getItem('user')).FULL_NAME })).subscribe(result => {
      console.log(result);
      if (result.result === 'SUCCESS') {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã thêm thành công', life: 3000 });
        this.search();
        this.selectedTinh = null;
        this.dialog = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Successful', detail: 'Lỗi thêm dữ liệu', life: 3000 });
      }
    });
  }

  filterTram(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.trams.length; i++) {
      const tba = this.trams[i];
      if (tba.TEN_TINH.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tba);
      }
    }
    this.filterTrams = filtered;
  }
  exportExcel() {
    const fileName = 'BM22a';
    const title = 'HIỆN TRẠNG ĐỒNG BỘ THỜI GIAN CỦA RELAY TRẠM 110KV';
    let workbook = this.reportService.showReportBM22a(
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
    <th rowspan="2">STT</th>
    <th rowspan="2">Đơn Vị</th>
    <th rowspan="2">Cấp điện áp (kV)</th>
    <th rowspan="2">Tổng số TBA đang vận hành trên lưới</th>
    <th colspan="3">Số TBA đã đồng bộ thời gian</th>
    <th rowspan="2">Số TBA chưa đồng bộ thời gian</th>
    <th rowspan="2">Đã đồng bộ</th>
    <th rowspan="2">Chưa đồng bộ</th>
    <th rowspan="2">Ghi Chú</th>
</tr>
<tr class="trHeader">
    <th>100% thiết bị</th>
    <th>Từ 80 đến dưới 100% thiết bị</th>
    <th>Nhỏ hơn 80% thiết bị</th>
</tr>`;
    this.listMain.length === 0 ? null : this.listMain.map(item => {
      table += `<tr class="p-selectable-row">
      <td class="bodySTT">${item.STT}</td>
      <td class="bodySTT">${item.TEN_DVIQLY}</td>
      <td class="bodySTT">${item.CAP_DIEN_AP}</td>
      <td class="bodySTT">${item.TONG_SO_TBI_DANG_VH}</td>
      <td class="bodySTT">${item.SO_TBI_DA_DONGBO_100}</td>
      <td class="bodySTT">${item.SO_TBI_DA_DONGBO_80_100}</td>
      <td class="bodySTT">${item.SO_TBI_DA_DONGBO_0_80}</td>
      <td class="bodySTT">${item.SO_TBA_CHUA_DONGBO_THOIGIAN}</td>
      <td class="bodySTT">${item.SO_TBI_DA_DONGBO}</td>
      <td class="bodySTT">${item.SO_TBI_CHUA_DONGBO}</td>
      <td class="bodySTT">${item.GHI_CHU}</td>
     
  </tr>`;
    });
    table += `</table>`;
    debugger;
    this.saveAsExcelFile(table.replace(/<th/g, '<th style="border: 0.2em solid black; vertical-align: middle;"').replace(/<td/g, '<td style="border: 0.2em solid black; vertical-align: middle;"'), "reportBM22");

    // import("xlsx").then(xlsx => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.listMain);
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
