import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as fs from 'file-saver';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { ScadaService } from '../../services/scada.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-bm09',
  templateUrl: './bm09.component.html',
  styleUrls: ['./bm09.component.css', '../../../../styles.css']
})
export class Bm09Component implements OnInit {
  loading: boolean;
  lstMain: any[];
  FROM_DATE: string;
  login: any;
  lstORG: any[];
  MA_DVIQLY: string;
  cols: any[];
  globalFilterFields: any[];

  constructor(private scadaService: ScadaService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private reportService: ReportService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'BM09 - Thống kê sản lượng ngày', routerLink: 'scada/bm09' }
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
    this.FROM_DATE = this.datePipe.transform(now.setDate(now.getDate() - 1), 'dd/MM/yyyy');
    this.login = JSON.parse(localStorage.getItem('user'));
    this.cols = [
      { field: 'STT', header: 'STT', type: 'string', className: 'headerSTTFrozen' },
      { field: 'TenDonVi', header: 'Đơn vị', type: 'string', className: 'headerDonViFrozen' }
    ];
    // 24h
    for (let i = 1; i < 25; i++) {
      let colNgay = { field: 'H' + i, header: i + 'H', type: 'number', className: 'headerText10' };
      this.cols.push(colNgay);
    }
    let colCSMAX = { field: 'CSMAX', header: 'CSMAX', type: 'number', className: 'headerText10' };
    this.cols.push(colCSMAX);
    let colCSMIN = { field: 'CSMIN', header: 'CSMIN', type: 'number', className: 'headerText10' };
    this.cols.push(colCSMIN);
    let CSAVG = { field: 'CSAVG', header: 'CSAVG', type: 'number', className: 'headerText10' };
    this.cols.push(CSAVG);
    this.globalFilterFields = this.cols.map(a => a.field);
    this.scadaService.getAllDMTinh({}).subscribe(
      data => {
        if (data.TYPE != "ERROR" && data.MESSAGE != "NO DATA") {
          this.lstORG = data;
          this.MA_DVIQLY = data[0].MA_DVIQLY;
          this.search();
        }
      });
  }

  search() {
    this.loading = true;
    let dFROM_DATE = moment(this.FROM_DATE, "DD/MM/YYYY");
    let TN = dFROM_DATE.format('YYYYMMDD');
    this.lstMain = [];
    this.scadaService.spc_Scada_BM9_SanLuongNgay({ DVQL: this.MA_DVIQLY, TN: TN }).subscribe(
      data => {
        data = data.map((el, i) => Object.assign(el, { STT: i + 1 }));
        this.lstMain = data;
        this.loading = false;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
        this.loading = false;
      });
  }

  exportExcel() {
    const title = 'THỐNG KÊ SẢN LƯỢNG NGÀY';
    let workbook = this.reportService.showReportBM06(
      this.lstMain,
      this.FROM_DATE,
      title,
      this.cols,
      title,
      'NGAY'
    );
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    });
  }
}