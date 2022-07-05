import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { HISMessageService } from '../../services/his-message.service';
import * as FileSaver from 'file-saver';
import * as fs from 'file-saver';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-bm12',
  templateUrl: './bm12.component.html',
  styleUrls: ['./bm12.component.css']
})
export class Bm12Component implements OnInit {

  lstMain: any[];
  mainCurrent: any;
  FROM_DATE: string;
  TO_DATE: string;
  login: any;
  lstORG: any[];
  selectedORG_CODE: string;
  editDialog: boolean;
  submitted: boolean;
  loading:boolean;

  constructor(private hisMessageService: HISMessageService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private reportService: ReportService,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      // { label: 'QL Báo cáo SCADA', routerLink: '/' },
      { label: 'BM12 - Thống kê và đánh giá thao tác xa', routerLink: 'ttdk/bm12' }
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
      this.loading=true;
      this.hisMessageService.getBM12({ startTime: TN, endTime: DN }).subscribe(
        data => {
          
          this.lstMain = data;
          this.loading=false;
        });
    }
  }
  getNumber(str: string){
    return Number(str);
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
    
    this.hisMessageService.updateReasonBM11({ ID: this.mainCurrent.id, Reason: this.mainCurrent.NGUYENNHAN }).subscribe(result => {
      if (result.result === 'SUCCESS') {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã cập nhật thành công', life: 3000 });
        this.search();
        this.hideDialog();
      }
    })
  }
  exportExcelOld() {
    let table=`<table><tr class="trHeader">
    <th pSortableColumn="TIMESTAMP" class="p-col-1" rowspan="3">STT
        
    </th>
    <th pSortableColumn="MILLI_SECONDS" class="p-col-1" rowspan="3">Đơn Vị
        
    </th>
    <th pSortableColumn="b1" class="p-col-1" rowspan="3">Tên TBA 110kV ĐKX
       
    </th>
    <th pSortableColumn="b2" class="p-col-1" colspan="10">Tình hình thực hiện điều khiển xa
    </th>
</tr>
<tr class="trHeader">
    <th pSortableColumn="TIMESTAMP" class="p-col-1" rowspan="2">Chương trình

    </th>
    <th pSortableColumn="MILLI_SECONDS" class="p-col-1" colspan="3">Tổng số lượng thao tác điều
        khiển xa

    </th>
    <th pSortableColumn="MILLI_SECONDS" class="p-col-1" colspan="3">Số lượng thao tác điều khiển xa
        tốt

    </th>
    <th pSortableColumn="MILLI_SECONDS" class="p-col-1" colspan="3">Số lượng thao tác tại thiết bị

    </th>
</tr>
<tr class="trHeader">
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">110KV

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">22KV

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">Tổng

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">110KV

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">22KV

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">Tổng

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">110KV

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">22KV

    </th>
    <th pSortableColumn="TIMESTAMP" cass="p-col-1">Tổng

    </th>
</tr>`;
    this.lstMain.length===0?null:this.lstMain.map(item=>{
      table+=`<tr class="p-selectable-row">
      <td class="bodySTT">${item.STT}</td>
      <td class="bodySTT">${item.TEN_DVIQLY}</td>
      <td class="bodySTT">${item.TEN_TRAM}</td>
      <td class="bodySTT">SP7</td>
      <td class="bodySTT">${item.TONG_110}</td>
      <td class="bodySTT">${item.TONG_22}</td>
      <td class="bodySTT">${this.getNumber(item.TONG_22)+this.getNumber(item.TONG_110)}</td>
      <td class="bodySTT">${item.TONG_110_GOOD}</td>
      <td class="bodySTT">${item.TONG_22_GOOD}</td>
      <td class="bodySTT">${this.getNumber(item.TONG_22_GOOD)+this.getNumber(item.TONG_110_GOOD)}</td>
      <td class="bodySTT">${item.TONG_110_TTB}</td>
      <td class="bodySTT">${item.TONG_22_TTB}</td>
      <td class="bodySTT">${this.getNumber(item.TONG_22_TTB)+this.getNumber(item.TONG_110_TTB)}</td>
      
  </tr>`;
    });
    table+=`</table>`;
    debugger;
    this.saveAsExcelFile(table.replace(/<th/g, '<th style="border: 0.2em solid black; vertical-align: middle;"').replace(/<td/g, '<td style="border: 0.2em solid black; vertical-align: middle;"'), "reportBM12");
    
    // import("xlsx").then(xlsx => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.lstMain);
    //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   this.saveAsExcelFile(excelBuffer, "reportBM12");
    // });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    debugger;
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xls';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }

  exportExcel() {
    const fileName = 'BM12';
    const title = 'Thống kê và đánh giá thao tác xa';
    let workbook = this.reportService.showReportBM12(
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
