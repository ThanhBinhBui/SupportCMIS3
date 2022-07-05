import { Component, OnInit, ViewChild } from '@angular/core';
import { HISMessageService } from './../../services/his-message.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { TBAKH } from './tbaKH';
import { Tinh } from '../dm-tinh/tinh';
import * as FileSaver from 'file-saver';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';
import { FileUpload } from 'primeng/fileupload';
import { ReportService } from '../../services/report.service';
@Component({
  selector: 'app-dm-tba-kh',
  templateUrl: './dm-tba-kh.component.html',
  styleUrls: ['./dm-tba-kh.component.css']
})
export class DmTbaKhComponent implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;
  dialog: boolean;

  tbaKH: TBAKH;
  tbaKHs: TBAKH[];
  filterTinhs: Tinh[];
  tinhs: Tinh[];
  scrollXColumn: Number;
  selectedTinh: any;
  cols: any[];
  submitted: boolean;
  isUpdate: boolean = false;
  loading: boolean;

  constructor(private hisMessageService: HISMessageService, private messageService: MessageService,
    private reportService: ReportService, private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'SCADA' },
      { label: 'Danh mục trạm biến áp khách hàng', routerLink: ['admin/dmTBAKH'] }
    ]);
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event): void => {
    this.scrollXColumn = event.target.scrollLeft;
  };

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
    this.hisMessageService.getDMTBAKH().subscribe(data => this.tbaKHs = data);
    console.log(this.tbaKHs);
    this.hisMessageService.getDMTinh().subscribe(data => {

      this.tinhs = data
    });
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'MA_TINH', header: 'Ma tỉnh' },
      { field: 'TEN_TINH', header: 'Tên tỉnh' },
      { field: 'TEN_TRAM', header: 'Tên trạm' },
      { field: 'TEN_B1', header: 'Tên trạm không dấu' },

    ];
  }

  openNew() {
    this.tbaKH = {};
    this.submitted = false;
    this.dialog = true;
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
          this.hisMessageService.insertDMTBAKH(item).subscribe(data => {
            debugger;
            console.log(data);
            count+=1;
            if(count===arr.length){
              console.log(count+'=='+arr.length);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Lưu dữ liệu thành công', life: 3000 });
              this.getAllDMTBAKH();
              this.fileInput.clear();
            }
          })
        });
        
      }
    }
  }

  getAllDMTBAKH() {
    this.loading = true;
    this.hisMessageService.getDMTBAKH().subscribe(data => { console.log(data); this.tbaKHs = data; this.loading = false });
    this.isUpdate = false;
    this.submitted = false;
    this.dialog = false;
  }

  editItem(tbaKH: TBAKH) {
    this.tbaKH = { ...tbaKH };
    this.selectedTinh = { ...tbaKH };
    this.isUpdate = true;
    this.dialog = true;
  }

  deleteItem(tbaKH: TBAKH) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xoá trạm ' + tbaKH.TEN_TRAM + ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hisMessageService.deleteDMTBAKH(tbaKH).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.getAllDMTBAKH();
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
    this.selectedTinh = null;

  }
  validateForm(item) {
    if (item === null && item === undefined) {
      return 'Lỗi'
    }
    else if (item.MA_TRAM.length > 10 || item.MA_TRAM.length < 1) {
      return 'Lỗi mã trạm chỉ có từ 1 đến 10 ký tự';
    }
    else if (item.MA_TRAM === '' || item.TEN_TRAM === '' || item.TEN_B1 === '') {
      return 'Vui lòng nhập đủ dữ liệu cần thiết';
    }
    else {
      return 'SUCCESS';
    }
  }
  saveItem() {
    this.submitted = true;
    this.tbaKH.MA_TINH = this.selectedTinh.MA_TINH;

    // this.tbaKH = { ...this.tbaKH, MA_TINH: this.selectedTinh.MA_TINH }
    const check = this.validateForm(this.tbaKH);
    if (check === 'SUCCESS') {
      if (this.isUpdate === false) {

        this.hisMessageService.insertDMTBAKH(this.tbaKH).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã thêm thành công', life: 3000 });
            this.getAllDMTBAKH();
          }
        });
      } else {

        this.hisMessageService.updateDMTBAKH(this.tbaKH).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã cập nhật thành công', life: 3000 });
            this.getAllDMTBAKH();
            this.selectedTinh = null;

          }
        })
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Successful', detail: check, life: 3000 });
    }

    this.selectedTinh = null;
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
    const fileName = 'DMTBAKH';
    const title = 'Danh mục trạm biến áp khách hàng';
    let workbook = this.reportService.showReportDMTBAKH(
      this.tbaKHs,
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
      const worksheet = xlsx.utils.json_to_sheet(this.tbaKHs);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "reportLLTBAKH");
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
