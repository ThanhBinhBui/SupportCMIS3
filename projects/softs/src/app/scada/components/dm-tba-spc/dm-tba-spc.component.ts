import { Component, OnInit, ViewChild } from '@angular/core';
import { HISMessageService } from './../../services/his-message.service';
import { FileUpload } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { Tinh } from '../dm-tinh/tinh';
import { TBASPC } from './tbaSPC';
import * as FileSaver from 'file-saver';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';
import { ReportService } from '../../services/report.service';
@Component({
  selector: 'app-dm-tba-spc',
  templateUrl: './dm-tba-spc.component.html',
  styleUrls: ['./dm-tba-spc.component.css']
})
export class DmTbaSpcComponent implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;
  dialog: boolean;

  tbaSPCs: TBASPC[];
  tbaSPC: TBASPC;

  filterTinhs: Tinh[];
  tinhs: Tinh[];

  selectedTinh: any;

  submitted: boolean;

  cols: any[];

  isUpdate: boolean = false;
  loading: boolean;

  constructor(private hisMessageService: HISMessageService, private messageService: MessageService,
    private reportService: ReportService, private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'SCADA' },
      { label: 'Danh mục trạm biến áp SPC', routerLink: ['admin/dmTBASPC'] }
    ]);
  }

  ngOnInit() {
    this.hisMessageService.getDMTBASPC().subscribe(data => this.tbaSPCs = data);
    console.log(this.tbaSPCs);

    this.hisMessageService.getDMTinh().subscribe(data => {

      this.tinhs = data
    });
    this.cols = [
      { field: 'MA_TRAM', header: 'Mã Trạm' },
      { field: 'MA_TINH', header: 'Mã Tỉnh' },
      { field: 'TEN_TINH', header: 'Tên Tỉnh' },
      { field: 'TEN_TRAM', header: 'Tên Trạm' },
      { field: 'TEN_B1', header: 'Tên Trạm Không Dấu' },
      { field: 'TEN_PHATTUYEN', header: 'Tên Phát Tuyến' }

    ];
  }

  openNew() {
    this.tbaSPC = {};
    this.submitted = false;
    this.dialog = true;
  }

  getAllDMTBASPC() {
    this.loading = true;
    this.hisMessageService.getDMTBASPC().subscribe(data => { console.log(data); this.tbaSPCs = data; this.loading = false });
    this.isUpdate = false;
    this.submitted = false;
    this.dialog = false;
  }

  editItem(tbaSPC: TBASPC) {
    this.tbaSPC = { ...tbaSPC };
    this.selectedTinh = { ...tbaSPC };
    this.isUpdate = true;
    this.dialog = true;
  }

  deleteItem(tbaSPC: TBASPC) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa trạm ' + tbaSPC.TEN_TRAM + ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hisMessageService.deleteDMTBAPSC(tbaSPC).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.getAllDMTBASPC();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã xoá thành công', life: 3000 });
          }
        })
      }
    });
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

        })
        let count=0;
        arr.map(item => {
          this.hisMessageService.insertDMTBASPC(item).subscribe(data => {
            debugger;
            console.log(data);
            count+=1;
            if(count===arr.length){
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Lưu dữ liệu thành công', life: 3000 });
              this.getAllDMTBASPC();
              this.fileInput.clear();
            }
          })
        });
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Lưu dữ liệu thành công', life: 3000 });
      }
    }
  }

  hideDialog() {
    this.dialog = false;
    this.isUpdate = false;
    this.submitted = false;
    this.selectedTinh = null;
  }
  validateForm(item) {
    if (item === null && item === undefined) {
      return 'Lỗi'
    }
    else if (item.MA_TRAM.length > 10 || item.MA_TRAM.length < 1) {
      return 'Lỗi mã trạm chỉ có từ 1 đến 10 ký tự';
    }
    else if (item.MA_TRAM === '' || item.TEN_TRAM === '' || item.TEN_B1 === '' || item.TEN_PHATTUYEN === '') {
      return 'Vui lòng nhập đủ dữ liệu cần thiết';
    }
    else {
      return 'SUCCESS';
    }
  }
  saveItem() {
    this.submitted = true;
    this.tbaSPC.MA_TINH = this.selectedTinh.MA_TINH;
    const check = this.validateForm(this.tbaSPC);
    if (check === 'SUCCESS') {
      if (this.isUpdate === false) {
        this.selectedTinh = null;
        this.hisMessageService.insertDMTBASPC(this.tbaSPC).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã thêm thành công', life: 3000 });
            this.getAllDMTBASPC();
          }
        });
      } else {
        this.hisMessageService.updateDMTBAPSC(this.tbaSPC).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã cập nhật thành công', life: 3000 });
            this.getAllDMTBASPC();
            this.selectedTinh = null;
          }
        })
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Successful', detail: check, life: 3000 });
    }


  }

  filterTinh(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.tinhs.length; i++) {
      const tinh = this.tinhs[i];
      if (tinh.TEN_TINH.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tinh);
      }
    }

    this.filterTinhs = filtered;
  }
  exportExcel() {
    const fileName = 'DMTBASPC';
    const title = 'Danh mục trạm biến áp SPC';
    let workbook = this.reportService.showReportDMTBASPC(
      this.tbaSPCs,
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
      const worksheet = xlsx.utils.json_to_sheet(this.tbaSPCs);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "reportDMTBASPC");
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
