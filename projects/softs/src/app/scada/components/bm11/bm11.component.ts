import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { HISMessageService } from '../../services/his-message.service';
import * as FileSaver from 'file-saver';
import * as fs from 'file-saver';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-bm11',
  templateUrl: './bm11.component.html',
  styleUrls: ['./bm11.component.css',]
})
export class Bm11Component implements OnInit {

  lstMain: any[];
  mainCurrent: any;
  FROM_DATE: string;
  TO_DATE: string;
  login: any;
  lstORG: any[];
  selectedORG_CODE: string;
  editDialog: boolean;
  submitted: boolean;
  loading: boolean;

  constructor(private hisMessageService: HISMessageService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService,
    private reportService: ReportService) {
    this.breadcrumbService.setItems([
      // { label: 'QL Báo cáo SCADA', routerLink: '/' },
      { label: 'BM11 - Thống kê thao tác từ trung tâm điều kiển', routerLink: 'ttdk/bm11' }
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
    this.search();
  }

  search() {
    let dFROM_DATE = moment(this.FROM_DATE, "DD/MM/YYYY");
    let dTO_DATE = moment(this.TO_DATE, "DD/MM/YYYY");
    this.lstMain = [];
    if (dFROM_DATE > dTO_DATE) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn ngày khai báo từ nhỏ hơn hoặc bằng ngày khai báo đến' });
    }
    else {
      let TN = dFROM_DATE.format('YYYY-MM-DD hh:ss:mm');
      let DN = dTO_DATE.format('YYYY-MM-DD hh:ss:mm');
      this.loading = true;
      this.hisMessageService.getBM11({ startTime: TN, endTime: DN }).subscribe(
        data => {
          console.log(data);
          this.lstMain = data;
          this.loading = false;
        });
    }
  }

  editItem(main: any) {
    this.mainCurrent = { ...main };
    this.editDialog = true;
  }

  hideDialog() {
    this.editDialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;
    debugger;
    this.hisMessageService.updateReasonBM11({ ID: this.mainCurrent.ID, Reason: this.mainCurrent.NGUYENNHAN }).subscribe(result => {
      if (result.result === 'SUCCESS') {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã cập nhật thành công', life: 3000 });
        this.search();
        this.hideDialog();
      }
    })
  }
  exportExcelOld() {
    let table = `<table><tr class="trHeader">
    <th pSortableColumn="TIMESTAMP"  class="p-col-1">Time stamp
    </th>
    <th pSortableColumn="MILLI_SECONDS"  class="p-col-1">Milli Second
    </th>
    <th pSortableColumn="b1"  class="p-col-1">B1
    </th>
    <th pSortableColumn="b2"  class="p-col-1">B2
    </th>
    <th pSortableColumn="b3"  class="p-col-1">B3
    </th>
    <th pSortableColumn="ELEMENT"  class="p-col-1">Element
    </th>
    <th pSortableColumn="DESCRIPTION"  class="p-col-1">Description
    </th>
    <th pSortableColumn="STATUS"  class="p-col-1">Status
    </th>
    <th pSortableColumn="TAG"  class="p-col-1">Tag
    </th>
    <th pSortableColumn="OPERATOR"  class="p-col-1">Operator
    </th>
    <th pSortableColumn="NGUYENNHAN"  class="p-col-1">Nguyên nhân thao tác không thành công
        
    </th>
</tr>`;
    this.lstMain.length === 0 ? null : this.lstMain.map(item => {
      table += `<tr class="p-selectable-row">
      <td class="bodySTT">
          ${item.TIMESTAMP}
      </td>
      <td>
          ${item.MILLI_SECONDS}
      </td>
      <td>
          ${item.B1}
      </td>
      <td>
          ${item.B2}
      </td>
      <td>
          ${item.B3}
      </td>
      <td>
          ${item.ELEMENT}
      </td>
      <td>
          ${item.DESCRIPTION}
      </td>
      <td>
          ${item.STATUS}
      </td>
      <td>
          ${item.TAG}
      </td>
      <td>
          ${item.OPERATOR}
      </td>
      <td>
          ${item.NGUYENNHAN}
      </td>
  </tr>`;
    });
    table += `</table>`;
    debugger;
    this.saveAsExcelFile(table.replace(/<th/g, '<th style="border: 0.2em solid black; vertical-align: middle;"').replace(/<td/g, '<td style="border: 0.2em solid black; vertical-align: middle;"'), "reportBM11");

    // import("xlsx").then(xlsx => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.mainCurrent);
    //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   this.saveAsExcelFile(excelBuffer, "reportBM11");
    // });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xls';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }

  exportExcel() {
    const fileName = 'BM11';
    const title = 'Thống kê thao tác từ TTĐK';
    let workbook = this.reportService.showReportBM11(
      this.lstMain,
      fileName,
      title
    );
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + '.xlsx');
    });
  }

}
