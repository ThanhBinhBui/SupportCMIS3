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
  selector: 'app-bm07',
  templateUrl: './bm07.component.html',
  styleUrls: ['./bm07.component.css', '../../../../styles.css']
})
export class Bm07Component implements OnInit {
  loading: boolean;
  lstMain: any[];
  FROM_DATE: string;
  login: any;
  lstORG: any[];
  MA_DVIQLY: string;
  cols: any[];
  colFields: any[];
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
      { label: 'BM07 - Bảng theo dõi công suất và phụ tải', routerLink: 'scada/bm07' }
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
    this.FROM_DATE = this.datePipe.transform(now, 'dd/MM/yyyy');
    this.login = JSON.parse(localStorage.getItem('user'));
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
      [
        { field: 'STT', header: 'STT', type: 'string', className: 'headerSTT', rowspan: 2 },
        { field: 'TenDonVi', header: 'Đơn vị', type: 'string', className: 'headerText10', rowspan: 2 },
        { field: 'Loai', header: 'CS-SL', type: 'string', className: 'headerSTT', rowspan: 2 }
      ],
      []
    ];
    this.colFields = [
      { field: 'STT', header: 'STT', type: 'string', className: 'headerSTT', rowspan: 2 },
      { field: 'TenDonVi', header: 'Đơn vị', type: 'string', className: 'headerText', rowspan: 2 },
      { field: 'Loai', header: 'CS-SL', type: 'string', className: 'headerSTT', rowspan: 2 }
    ];
    //lấy 7 ngày gần nhất
    for (let index = 1; index < 8; index++) {
      let ngayDuyet = moment(this.FROM_DATE, "DD/MM/YYYY").add(index - 7, 'days');
      let colNgay = { header: ngayDuyet.format('DD/MM/YYYY'), type: 'string', className: 'headerText', colspan: 2 };
      this.cols[0].push(colNgay);
      let colThucTe = { field: 'N' + index, header: 'Thực tế', type: 'number', className: 'headerRow2' };
      this.cols[1].push(colThucTe);
      let colTyLe = { field: 'N' + index + '_TyLe', header: 'So với ngày trước (%)', type: 'number', className: 'headerRow2' };
      this.cols[1].push(colTyLe);
      this.colFields.push(colThucTe);
      this.colFields.push(colTyLe);
    }
    this.globalFilterFields = this.colFields.map(a => a.field);
    this.scadaService.spc_Scada_BM7_CongSuatPhuTaiNgay({ DVQL: this.MA_DVIQLY, TN: TN, SOURCE: this.selectedSource }).subscribe(
      data => {
        // data = data.map((el, i) => Object.assign(el, { STT: i + 1 }));
        this.lstMain = data;
        this.loading = false;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
        this.loading = false;
      });
  }

  exportExcel() {
    const title = 'Bảng theo dõi công suất và phụ tải';
    let workbook = this.reportService.showReportBM07(
      this.lstMain,
      this.FROM_DATE,
      title,
      this.cols
    );
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    });
  }
}