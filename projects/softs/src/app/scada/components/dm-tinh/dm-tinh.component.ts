import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { HISMessageService } from './../../services/his-message.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { Tinh } from './tinh';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
import { ReportService } from '../../services/report.service';
@Component({
  selector: 'app-dm-tinh',
  templateUrl: './dm-tinh.component.html',
  styleUrls: ['./dm-tinh.component.css']
})
export class DmTinhComponent implements OnInit {

  @ViewChild('fileInput') fileInput: FileUpload;

  tinhDialog: boolean;

  tinhs: Tinh[];

  tinh: Tinh;

  selectedTinhs: Tinh[];

  submitted: boolean;

  cols: any[];

  isUpdate: boolean = false;
  loading: boolean;

  constructor(private hisMessageService: HISMessageService, private messageService: MessageService,
    private reportService: ReportService, private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'SCADA' },
      { label: 'Danh mục tỉnh', routerLink: ['admin/dmTinh'] }
    ]);
  }

  ngOnInit() {
    this.hisMessageService.getDMTinh().subscribe(data => { console.log(data); this.tinhs = data });

    this.cols = [
      { field: 'MA_TINH', header: 'Mã Tỉnh' },
      { field: 'TEN_TINH', header: 'Tên Tỉnh' },
      { field: 'TEN_DVIQLY', header: 'Tên Đơn Vị Quản Lý' },
      { field: 'TEN_PHATTUYEN', header: 'Tên Phát Tuyến' }
    ];
  }

  openNew() {
    this.tinh = {};
    this.submitted = false;
    this.tinhDialog = true;
  }

  deleteItem(tinh: Tinh) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xoá tỉnh ' + tinh.TEN_TINH + ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hisMessageService.deleteDMTinh(tinh).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.getAllDMTinh();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã xoá thành công', life: 3000 });
          }
        })
      }
    });
  }

  getAllDMTinh() {
    this.loading = true;
    this.hisMessageService.getDMTinh().subscribe(data => { this.tinhs = data; this.loading = false });
    this.isUpdate = false;
    this.submitted = false;
    this.tinhDialog = false;
  }

  editItem(tinh: Tinh) {
    this.tinh = { ...tinh };
    this.isUpdate = true;
    this.tinhDialog = true;
  }

  hideDialog() {
    this.tinhDialog = false;
    this.isUpdate = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;

    if (this.isUpdate === false) {
      this.hisMessageService.insertDMTinh(this.tinh).subscribe(result => {
        if (result.result === 'SUCCESS') {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã thêm thành công', life: 3000 });
          this.getAllDMTinh();
        }
      });
    } else {
      this.hisMessageService.updateDMTinh(this.tinh).subscribe(result => {
        if (result.result === 'SUCCESS') {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã cập nhật thành công', life: 3000 });
          this.getAllDMTinh();
        }
      })
    }
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
          arr=JSON.parse(json_object);         
         
        })
        let count=0;
        arr.map(item=>{
          this.hisMessageService.insertDMTinh(item).subscribe(data => {
            debugger;
            console.log(data);
            count+=1;
            if(count===arr.length){
              console.log(count+'=='+arr.length);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Lưu dữ liệu thành công', life: 3000 });
              this.getAllDMTinh();
              this.fileInput.clear();
            }
          })
        });
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Lưu dữ liệu thành công', life: 3000 });      
      }
    }
  }

  exportExcel() {
    const fileName = 'DMTinh';
    const title = 'Danh mục tỉnh';
    let workbook = this.reportService.showReportDMTinh(
      this.tinhs,
      fileName,
      title
    );
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + '.xlsx');
    });
  }

  exportExcelOld() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.tinhs);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "reportDMTinh");
    });
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
