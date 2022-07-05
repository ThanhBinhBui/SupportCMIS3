import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as fs from 'file-saver';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { ScadaService } from '../../services/scada.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-bm18',
  templateUrl: './bm18.component.html',
  styleUrls: ['./bm18.component.css', '../../../../styles.css']
})
export class Bm18Component implements OnInit {
  @ViewChild('chart') chartMain: any;
  loading: boolean;
  lstMain: any[];
  TO_DATE: string;
  login: any;
  lstORG: any[];
  MA_DVIQLY: string;
  basicData: any;
  basicOptions: any;

  constructor(private scadaService: ScadaService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private reportService: ReportService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'BM18 - Thống kê thiết bị kết nối theo tỉnh', routerLink: 'scada/bm18' }
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
    this.basicOptions = {
      type: 'bar',
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    };
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
    this.lstMain = [];
    let dTO_DATE = moment(this.TO_DATE, "DD/MM/YYYY");
    let DN = dTO_DATE.format('YYYYMMDD');
    this.scadaService.spc_Scada_BM18ThongKeKetNoiTheoTinh({ DVQL: this.MA_DVIQLY, DN: DN }).subscribe(
      data => {
        this.lstMain = data;
        let labels = this.lstMain.map(a => a.TEN_TINH);
        let SPC_Rec_104 = this.lstMain.map(a => Number(a.SPC_Rec_104));
        let SPC_Rec_101 = this.lstMain.map(a => Number(a.SPC_Rec_101));
        let SPC_Rec_101_DA = this.lstMain.map(a => Number(a.SPC_Rec_101_DA));
        let SPC_Rec_DNP3 = this.lstMain.map(a => Number(a.SPC_Rec_DNP3));
        let SPC_Rec_RTU_CMIC = this.lstMain.map(a => Number(a.SPC_Rec_RTU_CMIC));
        let SPC_LBS_104 = this.lstMain.map(a => Number(a.SPC_LBS_104));
        let KH_Rec_104 = this.lstMain.map(a => Number(a.KH_Rec_104));
        this.basicData = {
          labels: labels,
          datasets: [
            {
              label: 'SPC quản lý Recloser SPC-Rec-104',
              data: SPC_Rec_104
            },
            {
              label: 'SPC quản lý Recloser SPC-Rec-101',
              data: SPC_Rec_101
            },
            {
              label: 'SPC quản lý Recloser SPC-Rec-101-DA',
              data: SPC_Rec_101_DA
            },
            {
              label: 'SPC quản lý Recloser SPC-Rec-DNP3',
              data: SPC_Rec_DNP3
            },
            {
              label: 'SPC quản lý Recloser SPC-Rec-RTU-CMIC',
              data: SPC_Rec_RTU_CMIC
            },
            {
              label: 'SPC quản lý LBS SPC-LBS-104',
              data: SPC_LBS_104
            },
            {
              label: 'Khách hàng Recloser KH-Rec-104',
              data: KH_Rec_104
            }
          ]
        };
        this.loading = false;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
        this.loading = false;
      });
  }

  exportExcel() {
    const title = 'THỐNG KÊ THIẾT BỊ KẾT NỐI THEO TỈNH';
    const ctx = this.chartMain.chart.canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.chartMain.chart.width, this.chartMain.chart.height);
    ctx.restore();
    let strBase64Chart = this.chartMain.chart.canvas.toDataURL();
    let workbook = this.reportService.showReportBM18(
      this.lstMain,
      this.TO_DATE,
      title,
      strBase64Chart
    );
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    });
  }
}