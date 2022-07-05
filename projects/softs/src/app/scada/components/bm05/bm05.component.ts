import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as fs from 'file-saver';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { ReportService } from '../../services/report.service';
import { ScadaService } from '../../services/scada.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-bm05',
  templateUrl: './bm05.component.html',
  styleUrls: ['./bm05.component.css', '../../../../styles.css'],
})
export class Bm05Component implements OnInit {
  @ViewChild('chart') chartMain: any;
  loading: boolean;
  lstMain1: any[];
  lstMain2: any[];
  lstMain3: any[];
  FROM_DATE: string;
  login: any;
  lstORG: any[];
  MA_DVIQLY: string;
  basicData: any;
  basicOptions: any;
  docDialog: boolean;
  submitted: boolean;
  Subject: any = "Báo cáo tình hình thực hiện công suất và sản lượng điện nhận";
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
      { label: 'BM05 - Báo cáo tình hình thực hiện công suất và sản lượng điện nhận', routerLink: 'scada/bm05' }
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
    this.HtmlMsg = "Người báo cáo: " + this.login.FULL_NAME;
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
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
    let dFROM_DATE = moment(this.FROM_DATE, "DD/MM/YYYY");
    let TN = dFROM_DATE.format('YYYYMMDD');
    this.lstMain1 = this.lstMain2 = this.lstMain3 = [];
    this.scadaService.spc_Scada_BM5_THTHCongSuatSanLuong({ DVQL: this.MA_DVIQLY, TN: TN }).subscribe(
      data => {
        this.loading = false;
        this.lstMain1 = data.filter(a => a.Loai == '1.CongSuat');
        this.lstMain2 = data.filter(a => a.Loai == '2.SanLuong');
        this.lstMain3 = data.filter(a => a.Loai == '3.CSSL');
        let labels = this.lstMain1.map(a => a.NoiDung == "Công suất trung bình" ? "TB" : a.NoiDung);
        let values = this.lstMain1.map(a => Number(a.GiaTri.replace(".", "").replace(",", "")))
        this.basicData = {
          labels: labels,
          datasets: [
            {
              label: 'Công suất',
              data: values,
              fill: false,
              borderColor: '#42A5F5',
              tension: .4
            }
          ]
        };
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
        this.loading = false;
      });
  }

  initExport(fileName) {
    const ctx = this.chartMain.chart.canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.chartMain.chart.width, this.chartMain.chart.height);
    ctx.restore();
    let strBase64Chart = this.chartMain.chart.canvas.toDataURL();
    let workbook = this.reportService.showReportBM05(
      this.lstMain1,
      this.lstMain2,
      this.lstMain3,
      this.FROM_DATE,
      fileName,
      strBase64Chart
    );
    return workbook;
  }

  exportExcel() {
    let workbook = this.initExport(this.Subject);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.Subject + '.xlsx');
    });
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
      let workbook = this.initExport(this.Subject);
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let file = new File([blob], this.Subject + '.xlsx');
        this.scadaService.SendMail({ FULL_NAME: this.login.FULL_NAME, ReportType: "bm05", Subject: this.Subject, HtmlMsg: this.HtmlMsg, FILE_CONTENT: file }).subscribe(
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
}