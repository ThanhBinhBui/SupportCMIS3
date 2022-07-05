import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { ReportService } from '../../services/report.service';
import { ScadaService } from '../../services/scada.service';

@Component({
  selector: 'app-bm04',
  templateUrl: './bm04.component.html',
  styleUrls: ['./bm04.component.css', '../../../../styles.css']
})
export class Bm04Component implements OnInit {
  loading: boolean;
  lstMain: any[];
  FROM_DATE: string;
  TO_DATE: string;
  login: any;
  lstORG: any[];
  MA_DVIQLY: string;
  dataTong: any;

  constructor(private scadaService: ScadaService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private reportService: ReportService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'BM04 - Thống kê sự cố theo đơn vị', routerLink: 'scada/bm04' }
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
    let dTO_DATE = moment(this.TO_DATE, "DD/MM/YYYY");
    this.lstMain = [];
    this.dataTong = {};
    if (dFROM_DATE > dTO_DATE) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn ngày khai báo từ nhỏ hơn hoặc bằng ngày khai báo đến' });
    }
    else {
      let TN = dFROM_DATE.format('YYYYMMDD');
      let DN = dTO_DATE.format('YYYYMMDD');
      this.scadaService.spc_Scada_BM4_SuCoTheoDV({ DVQL: this.MA_DVIQLY, TN: TN, DN: DN }).subscribe(
        data => {
          data = data.map((el, i) => Object.assign(el, { STT: i + 1 }));
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
          }
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
          this.loading = false;
        });
    }
  }

  exportExcel() {
    this.reportService.showReportBM04(
      this.lstMain,
      this.FROM_DATE,
      this.TO_DATE
    )
  }
}