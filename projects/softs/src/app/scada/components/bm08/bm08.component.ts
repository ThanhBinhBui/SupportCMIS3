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
  selector: 'app-bm08',
  templateUrl: './bm08.component.html',
  styleUrls: ['./bm08.component.css', '../../../../styles.css']
})
export class Bm08Component implements OnInit {
  loading: boolean;
  lstMain: any[];
  FROM_DATE: string;
  login: any;
  lstORG: any[];
  MA_DVIQLY: string;
  cols: any[];
  globalFilterFields: any[];
  lstSource: any[];
  selectedSource: any;

  constructor(private scadaService: ScadaService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private reportService: ReportService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'BM08 - Bảng công suất (MW)', routerLink: 'scada/bm08' }
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
    this.lstSource = [{ name: "APPMETER", code: "APPMETER" }, { name: "SCADA", code: "SCADA" }];
    this.selectedSource = "APPMETER";
    let now = new Date();
    this.FROM_DATE = this.datePipe.transform(now.setDate(now.getDate() - 1), 'dd/MM/yyyy');
    this.login = JSON.parse(localStorage.getItem('SPC_KBYT_USER'));
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
    this.cols = [
      { field: 'STT', header: 'STT', type: 'string', className: 'headerSTTFrozen' },
      { field: 'TenDonVi', header: 'Đơn vị', type: 'string', className: 'headerDonViFrozen' }
    ];
    // 24h
    for (let i = 1; i < 25; i++) {
      let colNgay = { field: 'H' + i, header: i, type: 'number', className: 'headerText10' };
      this.cols.push(colNgay);
    }
    let colCSMAX = { field: 'CSMAX', header: 'MAX Ngày', type: 'number', className: 'headerText10' };
    this.cols.push(colCSMAX);
    let ngayKT = dFROM_DATE.month() + 2;
    // tháng
    for (let index = 1; index < ngayKT; index++) {
      let colNgay = { field: 'T' + index, header: 'Tháng ' + index, type: 'number', className: 'headerText10' };
      this.cols.push(colNgay);
    }
    let colCSMAXThang = { field: 'TCSMAX', header: 'MAX Tháng', type: 'number', className: 'headerText10' };
    this.cols.push(colCSMAXThang);
    this.globalFilterFields = this.cols.map(a => a.field);
    this.scadaService.spc_Scada_BM8_CongSuatNgay21PC({ DVQL: this.MA_DVIQLY, TN: TN, SOURCE: this.selectedSource }).subscribe(
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
    const title = 'BẢNG CÔNG SUẤT (MW) TẠI 21 TỈNH/TP';
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