import { Component, OnInit,ViewChild } from '@angular/core';
import { HISMessageService } from '../../services/his-message.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { Tinh } from '../dm-tinh/tinh';
import { LLTKH } from './llTKH';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';
import { FileUpload } from 'primeng/fileupload';
import { ReportService } from '../../services/report.service';
@Component({
  selector: 'app-dm-ll-tba-kh',
  templateUrl: './dm-ll-tba-kh.component.html',
  styleUrls: ['./dm-ll-tba-kh.component.css']
})
export class DMLLTBAKHComponent implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;
  dialog: boolean;
  llTKHs: any[];
  scrollXColumn: Number;
  llTKH: any;
  filterTBAs: any[];
  tbas: any[];
  selectedTBA: any;
  submitted: boolean;
  cols: any[];
  isUpdate: boolean = false;
  loading: boolean;

  constructor(private hisMessageService: HISMessageService, private messageService: MessageService,
    private reportService: ReportService,
    private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService,
    private datePipe: DatePipe) {
    this.breadcrumbService.setItems([
      { label: 'SCADA' },
      { label: 'Lý lịch trạm biến áp khách hàng', routerLink: ['admin/dmLLTKH'] }
    ]);
  }
  onScrollXColumn(event) {
    //debugger
    this.scrollXColumn = event.target.scrollLeft;
  }
  uploadFileDaChon() {
    if (this.fileInput.files.length > 0) {
      const selectedFile = this.fileInput.files[0];
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(selectedFile);
      fileReader.onload = (event) => {
        console.log(event);
        const dataFile = event.target.result;
        var workbook = XLSX.read(dataFile, {
          type: 'binary'
        });
        let arr;
        workbook.SheetNames.forEach(function (sheetName) {
          // Here is your object
          var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          var json_object = JSON.stringify(XL_row_object);
          console.log(json_object);
          arr = JSON.parse(json_object);

        });
        let count = 0;
        arr.map(item => {
          debugger;
          this.hisMessageService.insertDMLLTKH(item).subscribe(data => {
            debugger;
            console.log(data);
            count+=1;
            if(count===arr.length){
              console.log(count+'=='+arr.length);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Lưu dữ liệu thành công', life: 3000 });
              this.getAllDMLLTKH();
              this.fileInput.clear();
            }
          })
        });
        
      }
    }
  }
  initDataCurrent() {
    let dateCurrent = new Date();
    // let dateCurrent = tmpDate.getDate() + '/' + (tmpDate.getMonth() + 1) + '/' + tmpDate.getFullYear();
    this.llTKH = {
      CDA: "CDA_220KV",
      CS_LAPDATMVA: "",
      CS_MWMWP: "",
      CS_VANHANH: "",
      ID: "",
      LDTBGSCLDN_NGAYNT: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      LDTBGSCLDN_VANBANXACNHAN: "",
      MA_TINH: "",
      MA_TRAM: "",
      NLTT: "NLTT_DIESEL",
      SCADAA2_GIAOTHUC: "IEC-104",
      SCADAA2_NGAYNHIEMTHU: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      SCADAA2_VANBANXACNHAN: "",
      SCADASPC_GIAOTHUC: "IEC-104",
      SCADASPC_NAMNT1: "",
      SCADASPC_NAMNT2: "",
      SCADASPC_NGAYNGHIEMTHU: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      SCADASPC_POINT: "",
      SCADASPC_VANBANXACNHAN: "",
      TEN_TINH: "",
      TEN_TRAM: "",
      TTKH_LIENHE: "",
      TTKH_NGAYVANHANH: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      TTKH_PHUONGAN: "",
      TTKH_THIETBIDAUNOI: "",
      XTHDT_NGAYTHUCHIEN: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      XTHDT_NHANVIENTHUCHIEN: ""
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event): void => {
    this.scrollXColumn = event.target.scrollLeft;
  };

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
    this.initDataCurrent();
    let a = new Date();
    console.log(this.hisMessageService.convertStringToDate(a));
    console.log(this.hisMessageService.convertStringToDate('1/1/2021'));
    console.log(this.hisMessageService.convertStringToDate('1-1-2021'));
    console.log(this.hisMessageService.convertStringToDate('01/11/2021'));

    this.hisMessageService.getDMLLTKH().subscribe(data => { console.log(data); this.llTKHs = data });
    this.hisMessageService.getDMTBAKH().subscribe(data => {
      this.tbas = data
    });
  }

  openNew() {
    this.initDataCurrent();
    this.submitted = false;
    this.dialog = true;
  }

  getAllDMLLTKH() {
    this.loading = true;
    this.hisMessageService.getDMLLTKH().subscribe(data => { this.llTKHs = data; this.loading = false; });
    this.isUpdate = false;
    this.submitted = false;
    this.dialog = false;
  }

  editItem(llTKH: LLTKH) {
    this.llTKH = { ...llTKH };
    this.llTKH.XTHDT_NGAYTHUCHIEN = this.datePipe.transform(new Date(this.llTKH.XTHDT_NGAYTHUCHIEN), 'dd/MM/yyyy');
    this.llTKH.LDTBGSCLDN_NGAYNT = this.datePipe.transform(new Date(this.llTKH.LDTBGSCLDN_NGAYNT), 'dd/MM/yyyy');
    this.llTKH.SCADAA2_NGAYNHIEMTHU = this.datePipe.transform(new Date(this.llTKH.SCADAA2_NGAYNHIEMTHU), 'dd/MM/yyyy');
    this.llTKH.SCADASPC_NGAYNGHIEMTHU = this.datePipe.transform(new Date(this.llTKH.SCADASPC_NGAYNGHIEMTHU), 'dd/MM/yyyy');
    this.llTKH.TTKH_NGAYVANHANH = this.datePipe.transform(new Date(this.llTKH.TTKH_NGAYVANHANH), 'dd/MM/yyyy');    

    this.selectedTBA = llTKH.MA_TRAM;
    this.isUpdate = true;
    this.dialog = true;
  }

  deleteItem(llTKH: LLTKH) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xoá thông tin trạm  ' + llTKH.TEN_TRAM + ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hisMessageService.deleteDMLLTKH(llTKH).subscribe(result => {

          if (result.result === 'SUCCESS') {
            this.getAllDMLLTKH();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã xoá thành công', life: 3000 });
          }
        })
      }
    });
  }

  hideDialog() {
    this.dialog = false;
    this.isUpdate = false;
    this.submitted = false;
    this.selectedTBA = null;

  }
  close() {
    this.dialog = false;
    this.selectedTBA = null;
  };
  validateForm(item) {
    if (item === null && item === undefined) {
      return 'Lỗi'
    } else if (isNaN(Number(item.CS_VANHANH)) || isNaN(Number(item.CS_MWMWP)) || isNaN(Number(item.CS_LAPDATMVA))) {
      return 'Lỗi nhập công suất vận hành không phải số';
    } else {
      return 'SUCCESS';
    }
  }
  convertStringToDate(str) {
    if (str !== null && str !== '') {
      let arr = str.split('/');
      return Number(arr[2]).toLocaleString('en-US', {
        minimumIntegerDigits: 4,
        useGrouping: false
      }) + Number(arr[1]).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + Number(arr[0]).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
    } else {
      return null;
    }
  }
  saveItem() {
    // debugger;
    this.submitted = true;
    this.llTKH.MA_TRAM = this.selectedTBA;
    let request = this.llTKH;
    debugger;
    request.SCADAA2_NGAYNHIEMTHU = this.convertStringToDate(request.SCADAA2_NGAYNHIEMTHU);
    request.SCADASPC_NGAYNGHIEMTHU = this.convertStringToDate(request.SCADASPC_NGAYNGHIEMTHU);
    request.TTKH_NGAYVANHANH = this.convertStringToDate(request.TTKH_NGAYVANHANH);
    request.XTHDT_NGAYTHUCHIEN = this.convertStringToDate(request.XTHDT_NGAYTHUCHIEN);
    request.LDTBGSCLDN_NGAYNT = this.convertStringToDate(request.LDTBGSCLDN_NGAYNT);
    const check = this.validateForm(this.llTKH);
    debugger;
    if (check === 'SUCCESS') {
      if (this.isUpdate === false) {
        debugger;
        this.hisMessageService.insertDMLLTKH(request).subscribe(result => {
          console.log(result);
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã thêm thành công', life: 3000 });
            this.getAllDMLLTKH();
            this.selectedTBA = null;
          }
        });
      } else {
        this.hisMessageService.updateDMLLTKH(request).subscribe(result => {
          console.log(result);
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã cập nhật thành công', life: 3000 });
            this.getAllDMLLTKH();
            this.selectedTBA = null;
          }
        })
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Successful', detail: check, life: 3000 });
      this.submitted = false;
    }

  }

  filterTBA(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.tbas.length; i++) {
      const tba = this.tbas[i];
      if (tba.TEN_TRAM.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tba);
      }
    }

    this.filterTBAs = filtered;
  }
  exportExcel() {
    const fileName = 'DMLLTBAKH';
    const title = 'THEO DÕI CÁC TRẠM BIẾN ÁP KHÁCH HÀNG';
    let workbook = this.reportService.showReportDMLLTBAKH(
      this.llTKHs,
      fileName,
      title
    );
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + '.xlsx');
    });
  }
  exportExcelOld() {
    let table = `<table><tr class="trHeader">
    <th rowspan="2" pSortableColumn="TEN_TINH">Tên Tỉnh 
    </th>
    <th rowspan="2" pSortableColumn="TEN_TRAM">Tên Trạm 
    </th>
    <th  rowspan="2" class="headerText">Mã Trạm</th>
    <th  colspan="4" class="headerText center" >Thông Tin Khách Hàng</th>
    <th  colspan="5">Năng Lượng Tái Tạo 
    </th>
    <th  colspan="1">Ngành Khác
    </th>
    <th  colspan="3">Cấp Điện Áp</th>
    <th  colspan="3">Công Suất</th>
    <th  colspan="6">Kết Nối SCADA Về EVNSPC</th>
    <th  colspan="3">Kết Nối SCADA Về A2 <br/>Theo VB 6454/EVN SPC-KT ngày 31/7/2020</th>
    <th  colspan="2">Lắp Đặt Thiết Bị Giám Sát Chất Lượng Điện Năng</th>
    <th  colspan="2">Xóa Tín Hiệu Dư Thừa</th>
</tr>
<tr>
<th pSortableColumn="TTKH_LIENHE">Liên Hệ
</th>
<th pSortableColumn="TTKH_PHUONGAN">Phương Án 
</th>
<th pSortableColumn="TTKH_THIETBIDAUNOI">Thiết bị đầu nối 
</th>
<th pSortableColumn="TTKH_NGAYVANHANH">Ngày Vận Hành
</th>
<th pSortableColumn="NLTT_DIESEL">DIESEL 
</th>
<th pSortableColumn="NLTT_NMDGIO">NMĐ Gió
</th>
<th pSortableColumn="NLTT_NMDMATTROI">NMĐ Mặt Trời
</th>
<th pSortableColumn="NLTT_NMNHIETDIEN">NM Nhiệt Điện
</th>
<th pSortableColumn="NLTT_NMTHUYDIEN">NM Thủy Điện
</th>
<th pSortableColumn="NLK_NGANHNGHE">Ngành Nghề 
</th>
<th pSortableColumn="CDA_220KV">220kV 
</th>
<th pSortableColumn="CDA_110KV">110kV
</th>
<th pSortableColumn="CDA_22KV">22kV 
</th>
<th pSortableColumn="CS_LAPDATMVA">Lắp Đặt MVA 
</th>
<th pSortableColumn="CS_MWMWP">MW MWp 
</th>
<th pSortableColumn="CS_VANHANH">Vận Hành 
</th>
<th pSortableColumn="SCADASPC_GIAOTHUC">EVN SPC Giao Thức
</th>
<th pSortableColumn="SCADASPC_NGAYNGHIEMTHU">EVN SPC Ngày NT
</th>
<th pSortableColumn="SCADASPC_NAMNT1">EVN SPC Năm NT 1 
</th>

<th >EVN SPC Năm NT 2 
</th>
<th >EVN SPC Xác Nhận 
</th>
<th >EVN SPC Point 
</th>
<th >A2 Giao Thức 
</th>
<th >A2 Ngày NT 
</th>
<th>A2 Xác Nhận
</th>
<th >CLDN Ngày NT 
</th>
<th >CLDN Xác Nhận 
</th>
<th >XTH Ngày Thực Hiện 
</th>
<th >XTH Nhân Viên Thực Hiện 
</th>
</tr>`;
    this.llTKHs.length === 0 ? null : this.llTKHs.map(item => {
      table += `<tr>
      <td class="bodySTT" >
          ${item.TEN_TINH}
      </td>
      <td class="bodySTT" >
          ${item.TEN_TRAM}
      </td>

      <td class="bodySTT">
          ${item.MA_TRAM}
      </td>
      <td class="bodySTT">
          ${item.TTKH_LIENHE}
      </td>

      <td class="bodySTT">
          ${item.TTKH_PHUONGAN}
      </td>
      <td class="bodySTT">
          ${item.TTKH_THIETBIDAUNOI}
      </td>
      <td class="bodySTT">
          ${item.TTKH_NGAYVANHANH}
      </td>
      <td class="bodySTT">
          ${item.NLTT_DIESEL === 'True' ? 'x' : ''}
      </td>
      <td class="bodySTT">
          ${item.NLTT_NMDGIO === 'True' ? 'x' : ''}
      </td>
      <td class="bodySTT">
          ${item.NLTT_NMDMATTROI === 'True' ? 'x' : ''}
      </td>
      <td class="bodySTT">
          ${item.NLTT_NMNHIETDIEN === 'True' ? 'x' : ''}
      </td>
      <td class="bodySTT">
          ${item.NLTT_NMTHUYDIEN === 'True' ? 'x' : ''}
      </td>
      <td class="bodySTT">
          ${item.NLK_NGANHNGHE === 'True' ? 'x' : ''}
      </td>
      <td class="bodySTT">
          ${item.CDA_220KV === 'True' ? 'x' : ''}
      </td>
      <td class="bodySTT">
          ${item.CDA_110KV === 'True' ? 'x' : ''}
      </td>
      <td class="bodySTT">
          ${item.CDA_22KV === 'True' ? 'x' : ''}
      </td>
      <td class="bodySTT">
          ${item.CS_LAPDATMVA}
      </td>
      <td class="bodySTT">
          ${item.CS_MWMWP}
      </td>
      <td class="bodySTT">
          ${item.CS_VANHANH}
      </td>
      <td class="bodySTT">
          ${item.SCADASPC_GIAOTHUC}
      </td>
      <td class="bodySTT">
          ${item.SCADASPC_NGAYNGHIEMTHU}
      </td>

      <td class="bodySTT">
          ${item.SCADASPC_NAMNT1}
      </td>
      <td class="bodySTT">
          ${item.SCADASPC_NAMNT2}
      </td>
      <td class="bodySTT">
          ${item.SCADASPC_VANBANXACNHAN}
      </td>
      <td class="bodySTT">
          ${item.SCADASPC_POINT}
      </td>
      <td class="bodySTT">
          ${item.SCADAA2_GIAOTHUC}
      </td>
      <td class="bodySTT">
          ${item.SCADAA2_NGAYNHIEMTHU}
      </td>
      <td class="bodySTT">
          ${item.SCADAA2_VANBANXACNHAN}
      </td>
      <td class="bodySTT">
          ${item.LDTBGSCLDN_NGAYNT}
      </td>
      <td class="bodySTT">
          ${item.LDTBGSCLDN_VANBANXACNHAN}
      </td>
      <td class="bodySTT">
          ${item.XTHDT_NGAYTHUCHIEN}
      </td>
      <td class="bodySTT">
          ${item.XTHDT_NHANVIENTHUCHIEN}
      </td>
  </tr>`;
    });
    table += `</table>`;
    debugger;
    this.saveAsExcelFile(table.replace(/<th/g, '<th style="border: 0.2em solid black; vertical-align: middle;"').replace(/<td/g, '<td style="border: 0.2em solid black; vertical-align: middle;"'), "reportLLTBAKH");

    // import("xlsx").then(xlsx => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.llTKHs);
    //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   this.saveAsExcelFile(excelBuffer, "reportLLTBAKH");
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

}
