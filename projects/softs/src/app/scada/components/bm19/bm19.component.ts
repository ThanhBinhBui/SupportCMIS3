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
  selector: 'app-bm19',
  templateUrl: './bm19.component.html',
  styleUrls: ['./bm19.component.css', '../../../../styles.css']
})
export class Bm19Component implements OnInit {
  loading: boolean;
  TO_DATE: string;
  login: any;
  lstORG: any[];
  MA_DVIQLY: string;
  lstMainNSX_SPC_Rec: any[];
  lstMainNSX_SPC_LBS: any[];
  lstMainNSX_KH_Rec: any[];
  lstMainGiaoThuc: any[];

  constructor(private scadaService: ScadaService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private reportService: ReportService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'BM19 - Thống kê hiệu loại thiết bị 22kV', routerLink: 'scada/bm19' }
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
    this.lstMainGiaoThuc = [];
    this.lstMainNSX_KH_Rec = [];
    this.lstMainNSX_SPC_LBS = [];
    this.lstMainNSX_SPC_Rec = [];
    let dTO_DATE = moment(this.TO_DATE, "DD/MM/YYYY");
    let DN = dTO_DATE.format('YYYYMMDD');
    this.scadaService.spc_Scada_BM19ThongKeHieuLoaiTB({ DVQL: this.MA_DVIQLY, DN: DN }).subscribe(
      data => {
        this.lstMainGiaoThuc = data.spc_Scada_BM19ThongKeHieuLoaiTB_GiaoThuc;
        this.lstMainNSX_KH_Rec = data.spc_Scada_BM19ThongKeHieuLoaiTB_NSX_KH_Rec;
        this.lstMainNSX_SPC_LBS = data.spc_Scada_BM19ThongKeHieuLoaiTB_NSX_SPC_LBS;
        this.lstMainNSX_SPC_Rec = data.spc_Scada_BM19ThongKeHieuLoaiTB_NSX_SPC_Rec;
        this.loading = false;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
        this.loading = false;
      });
  }

  exportExcel() {
    const title = 'THỐNG KÊ HIỆU LOẠI THIẾT BỊ 22KV';
    let workbook = this.reportService.showReportBM19(
      this.lstMainNSX_SPC_LBS,
      this.lstMainNSX_SPC_Rec,
      this.lstMainNSX_KH_Rec,
      this.lstMainGiaoThuc,
      this.TO_DATE,
      title
    );
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    });
  }
}