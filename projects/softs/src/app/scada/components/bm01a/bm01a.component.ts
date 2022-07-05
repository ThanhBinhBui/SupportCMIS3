import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as fs from 'file-saver';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { ReportService } from '../../services/report.service';
import { ScadaService } from '../../services/scada.service';

@Component({
  selector: 'app-bm01a',
  templateUrl: './bm01a.component.html',
  styleUrls: ['./bm01a.component.css', '../../../../styles.css'],
})
export class Bm01aComponent implements OnInit {
  loading1: boolean;
  loading4: boolean;
  loading5: boolean;
  lstAppMeter: any[];
  lst110: any[];
  lst22: any[];
  FROM_DATE: string;
  TO_DATE: string;
  login: any;
  lstORG: any[];
  docDialog: boolean;
  submitted: boolean;
  MA_DVIQLY: string;
  Subject: any = "Báo cáo cung cấp điện Lễ, Tết";
  HtmlMsg: any;

  constructor(private scadaService: ScadaService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private reportService: ReportService,
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'BM01A - Báo cáo cung cấp điện Lễ, Tết', routerLink: 'scada/bm01a' }
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
    this.FROM_DATE = this.datePipe.transform(firstDay, 'dd/MM/yyyy');
    this.TO_DATE = this.datePipe.transform(now, 'dd/MM/yyyy');
    this.login = JSON.parse(localStorage.getItem('user'));
    this.HtmlMsg = "Người báo cáo: " + this.login.FULL_NAME;
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
    this.loading1 = true;
    this.loading4 = true;
    this.loading5 = true;
    let dFROM_DATE = moment(this.FROM_DATE, "DD/MM/YYYY");
    let dTO_DATE = moment(this.TO_DATE, "DD/MM/YYYY");
    this.lstAppMeter = this.lst110 = this.lst22 = [];
    if (dFROM_DATE > dTO_DATE) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn ngày khai báo từ nhỏ hơn hoặc bằng ngày khai báo đến' });
    }
    else {
      let TN = dFROM_DATE.format('YYYYMMDD');
      let DN = dTO_DATE.format('YYYYMMDD');
      this.scadaService.spc_Scada_BM1A_TheoDoiCongSuat({ DVQL: this.MA_DVIQLY, TN: TN, DN: DN }).subscribe(
        data => {
          this.lstAppMeter = data;
          this.loading1 = false;
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
          this.loading1 = false;
        });
      this.scadaService.spc_Scada_BM1ATinhHinhSCLD110({ DVQL: this.MA_DVIQLY, TN: TN, DN: DN }).subscribe(
        data => {
          this.lst110 = data;
          this.loading4 = false;
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
          this.loading4 = false;
        });
      this.scadaService.spc_Scada_BM1ATinhHinhSCLD22({ DVQL: this.MA_DVIQLY, TN: TN, DN: DN }).subscribe(
        data => {
          this.lst22 = data;
          this.loading5 = false;
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
          this.loading5 = false;
        });
    }
  }

  showDiaglogMail() {
    this.docDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.docDialog = false;
    this.submitted = false;
  }

  sendMail() {
    this.submitted = true;
    if (this.Subject && this.HtmlMsg) {
      let workbook = this.reportService.showReportBM01a(
        this.lstAppMeter,
        this.lst110,
        this.lst22,
        this.FROM_DATE,
        this.TO_DATE,
        this.Subject
      );
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let file = new File([blob], this.Subject + '.xlsx');
        this.scadaService.SendMail({ FULL_NAME: this.login.FULL_NAME, ReportType: "bm01a", Subject: this.Subject, HtmlMsg: this.HtmlMsg, FILE_CONTENT: file }).subscribe(
          data => {
            if (data == "OK") {
              this.messageService.add({ key: 'tst', severity: 'success', summary: 'Thông báo', detail: "Gửi mail báo cáo thành công" });
            } else {
              this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: data });
            }
            this.docDialog = false;
            this.submitted = false;
          });
      });
    }
  }

  exportExcel() {
    let workbook = this.reportService.showReportBM01a(
      this.lstAppMeter,
      this.lst110,
      this.lst22,
      this.FROM_DATE,
      this.TO_DATE,
      this.Subject
    );
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.Subject + '.xlsx');
    });
  }
}