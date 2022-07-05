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
  selector: 'app-bm01',
  templateUrl: './bm01.component.html',
  styleUrls: ['./bm01.component.css', '../../../../styles.css']
})

export class Bm01Component implements OnInit {
  loading: boolean;
  lstMain: any[];
  FROM_DATE: string;
  TO_DATE: string;
  login: any;
  lstORG: any[];
  MA_DVIQLY: string;
  dataTong: any;
  docDialog: boolean;
  submitted: boolean;
  Subject: any = "Báo cáo ngừng giảm CCĐ khách hàng";
  HtmlMsg: any;
  selectedRows: any[];

  constructor(private scadaService: ScadaService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private reportService: ReportService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'BM01 - Báo cáo sự cố gây ngừng, giảm cung cấp điện cho khách hàng', routerLink: 'scada/bm01' }
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
    this.loading = true;
    let dFROM_DATE = moment(this.FROM_DATE, "DD/MM/YYYY");
    let dTO_DATE = moment(this.TO_DATE, "DD/MM/YYYY");
    this.lstMain = [];
    this.dataTong = {};
    if (dFROM_DATE > dTO_DATE) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn ngày khai báo từ nhỏ hơn hoặc bằng ngày khai báo đến' });
    }
    else {
      let TN = dFROM_DATE.format('YYYYMMDD');
      let DN = dTO_DATE.format('YYYYMMDD');
      this.scadaService.spc_Scada_BM1SuCoNGCCD({ DVQL: this.MA_DVIQLY, TN: TN, DN: DN }).subscribe(
        data => {
          this.lstMain = data;
          this.loading = false;
          if (data.length > 0) {
            for (let i = 0; i < Object.keys(data[0]).length; i++) {
              const key = Object.keys(data[0])[i];
              for (let j = 0; j < data.length; j++) {
                const value = data[j][key];
                if (typeof value === "number") {
                  if (key in this.dataTong) {
                    this.dataTong[key] += value;
                  }
                  else {
                    this.dataTong[key] = value;
                  }
                }
              }
            }
            this.selectedRows = data;
          }
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
          this.loading = false;
        });
    }
  }

  checkRowWarning(item) {
    let mustHasValue = Object.keys(item).map(key => item[key]).filter(a => a == undefined || a == null);
    return mustHasValue.length > 0;
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
      let workbook = this.reportService.showReportBM01(
        this.selectedRows,
        this.FROM_DATE,
        this.TO_DATE,
        this.Subject
      );
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let file = new File([blob], this.Subject + '.xlsx');
        this.scadaService.SendMail({ FULL_NAME: this.login.FULL_NAME, ReportType: "bm01", Subject: this.Subject, HtmlMsg: this.HtmlMsg, FILE_CONTENT: file }).subscribe(
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
    let workbook = this.reportService.showReportBM01(
      this.lstMain,
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