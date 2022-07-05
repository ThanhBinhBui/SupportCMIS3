import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { HISMessageService } from '../../services/his-message.service';
import * as FileSaver from 'file-saver';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { MessageService } from 'primeng/api';
import * as fs from 'file-saver';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-bm24a',
  templateUrl: './bm24a.component.html',
  styleUrls: ['./bm24a.component.css']
})
export class Bm24aComponent implements OnInit {

  TO_DATE: string;
  FROM_DATE: string;
  loading: boolean;
  listMain: any[];
  loadingModal: boolean;
  tinhs: any[];
  getNameTinh(str) {
    const tmp = this.tinhs.filter(i => i.MA_TINH === str)[0]
    if (tmp !== undefined && tmp !== null) {
      return tmp.TEN_TINH
    }
    return "";
  }

  getDate(d: any) {
    const dateCurrent = new Date(Number(d));
    return `${dateCurrent.getMonth() + 1}/${dateCurrent.getDate()}/${dateCurrent.getFullYear()} ${dateCurrent.getHours()}:${dateCurrent.getMinutes()}:${dateCurrent.getSeconds()}`;
  }

  convertStringToDate(str) {
    if (str !== null && str !== '') {
      return str.substr(6, 4) + '-' + str.substr(3, 2) + '-' + str.substr(0, 2);
    } else {
      return null;
    }
  }
  getNameDonViQuanLy(str) {
    const tmp = this.tinhs.filter(i => i.MA_DVIQLY === str)[0]
    if (tmp !== undefined && tmp !== null) {
      return tmp.TEN_TINH
    }
    return "";
  }
  exportExcel() {
    const fileName = 'SuKienSoNhatKyVanHanh';
    const title = 'SỰ KIỆN SỔ NHẬT KÝ VẬN HÀNH';
    let param =
      this.listMain.map(item => {
        debugger;
        item.TNXL_NGOAI = this.getNameDonViQuanLy(item.TNXL_NGOAI);
        item.DONVI_QUANLY = this.getNameDonViQuanLy(item.DONVI_QUANLY);
        return item;
      });



    console.log(param);

    let workbook = this.reportService.showReportBM24A(
      param,     
      fileName,
      title,
    );
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + '.xlsx');
    });
  }

  search() {
    if (this.FROM_DATE !== undefined && this.TO_DATE !== undefined && this.FROM_DATE !== null && this.TO_DATE !== null && this.FROM_DATE !== '' && this.TO_DATE !== '') {
      this.loading = true;
      
      this.hisMessageService.getBM24NhatKyVanHanhByDate({ startTime: this.convertStringToDate(this.FROM_DATE), endTime: this.convertStringToDate(this.TO_DATE) })
        .subscribe(data => {
          console.log(data);
          this.listMain = data;
          this.loading = false;
        })
    }
    else {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn thời gian tìm kiếm' });
    }
  }

  constructor(private hisMessageService: HISMessageService, private breadcrumbService: BreadcrumbService, private reportService: ReportService,
    private messageService: MessageService, private datePipe: DatePipe) {
    this.breadcrumbService.setItems([
      { label: 'SCADA' },
      { label: 'Thống kê Sự Kiện', routerLink: ['nkvh/thongkesukienNKVH'] }
    ]);
  }
  ngOnInit(): void {
    this.hisMessageService.getDMTinh().subscribe(data => {
      this.tinhs = data;
    });
    let now = new Date();
    var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.FROM_DATE = this.datePipe.transform(firstDay, 'dd/MM/yyyy');
    this.TO_DATE = this.datePipe.transform(now, 'dd/MM/yyyy');
    console.log(JSON.parse(localStorage.getItem("user")));
    this.search();
  }

}
