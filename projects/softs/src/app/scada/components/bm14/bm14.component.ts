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
  selector: 'app-bm14',
  templateUrl: './bm14.component.html',
  styleUrls: ['./bm14.component.css', '../../../../styles.css']
})
export class Bm14Component implements OnInit {
  loading: boolean;
  lstMain: any[];
  FROM_DATE: string;
  TO_DATE: string;
  login: any;
  lstORG: any[];
  MA_DVIQLY: string;
  cols: any[];

  constructor(private scadaService: ScadaService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private reportService: ReportService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'BM14 - Thống kê mất kết nối thiết bị trên Hệ thống SCADA', routerLink: 'scada/bm14' }
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
    this.FROM_DATE = this.datePipe.transform(now, 'dd/MM/yyyy');
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
    if (dFROM_DATE > dTO_DATE) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn ngày khai báo từ nhỏ hơn hoặc bằng ngày khai báo đến' });
      this.loading = false;
    }
    else {
      let TN = dFROM_DATE.format('YYYYMMDD');
      let DN = dTO_DATE.format('YYYYMMDD');
      this.scadaService.spc_Scada_BM14MatKetNoi({ DVQL: this.MA_DVIQLY, TN: TN, DN: DN }).subscribe(
        data => {
          this.lstMain = data;
          this.loading = false;
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
          this.loading = false;
        });
    }
  }

  exportExcel() {
    const title = 'THỐNG KÊ MẤT KẾT NỐI THIẾT BỊ TRÊN HỆ THỐNG SCADA THEO THIẾT BỊ';
    this.cols = [
      { field: 'STT', header: 'STT' },
      { field: 'TEN_DVI', header: 'Đơn vị' },
      { field: 'B2', header: 'Tên thiết bị (B2)' },
      { field: 'B3', header: 'Tên thiết bị (B3)' },
      { field: 'TIME_OPEN', header: 'Mất kết nối', type: 'datetime_second' },
      { field: 'TIME_CLOSE', header: 'Khôi phục kết nối', type: 'datetime_second' },
      { field: 'TIME_DIFF', header: 'Thời gian mất kết nối' }
    ];
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