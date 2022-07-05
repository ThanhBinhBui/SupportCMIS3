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
  selector: 'app-bm17',
  templateUrl: './bm17.component.html',
  styleUrls: ['./bm17.component.css', '../../../../styles.css']
})
export class Bm17Component implements OnInit {
  loading: boolean;
  TO_DATE: string;
  login: any;
  lstORG: any[];
  MA_DVIQLY: string;
  lstMainTBA110: any[];
  lstMainTBAKH: any[];
  lstMainTong: any[];
  lstMainKNT: any[];
  lstMainA2: any[];
  lstMainDKX: any[];
  lstMainPHONE: any[];

  constructor(private scadaService: ScadaService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private reportService: ReportService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'BM17 - Thống kê kết nối TBA', routerLink: 'scada/bm17' }
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
    this.lstMainTBA110 = [];
    this.lstMainTBAKH = [];
    this.lstMainTong = [];
    this.lstMainKNT = [];
    this.lstMainA2 = [];
    this.lstMainDKX = [];
    this.lstMainPHONE = [];
    let dTO_DATE = moment(this.TO_DATE, "DD/MM/YYYY");
    let DN = dTO_DATE.format('YYYYMMDD');
    this.scadaService.spc_Scada_BM17ThongKeKetNoiTBA({ DVQL: this.MA_DVIQLY, DN: DN }).subscribe(
      data => {
        this.lstMainTBA110 = data.spc_Scada_BM17ThongKeKetNoiTBA_TBA110;
        this.lstMainTBAKH = data.spc_Scada_BM17ThongKeKetNoiTBA_TBAKH;
        this.lstMainTong = data.spc_Scada_BM17ThongKeKetNoiTBA_Tong;
        this.lstMainKNT = data.spc_Scada_BM17ThongKeKetNoiTBA_KNT;
        this.lstMainA2 = data.spc_Scada_BM17ThongKeKetNoiTBA_A2;
        this.lstMainDKX = data.spc_Scada_BM17ThongKeKetNoiTBA_DKX;
        this.lstMainPHONE = data.spc_Scada_BM17ThongKeKetNoiTBA_PHONE;
        this.loading = false;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
        this.loading = false;
      });
  }

  exportExcel() {
    const title = 'THỐNG KÊ KẾT NỐI TBA';
    let workbook = this.reportService.showReportBM17(
      this.lstMainTong,
      this.lstMainKNT,
      this.lstMainA2,
      this.lstMainDKX,
      this.lstMainPHONE,
      this.lstMainTBA110,
      this.lstMainTBAKH,
      this.TO_DATE,
      title
    );
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    });
  }
}