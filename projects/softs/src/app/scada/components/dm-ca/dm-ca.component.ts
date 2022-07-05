import { Component, OnInit } from '@angular/core';

import { HISMessageService } from './../../services/his-message.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-dm-ca',
  templateUrl: './dm-ca.component.html',
  styleUrls: ['./dm-ca.component.css']
})
export class DmCaComponent implements OnInit {

  dialog: boolean;

  listMain: any[];

  mainCurrent: any;

  submitted: boolean;

  isUpdate: boolean = false;
  loading:boolean;

  constructor(private hisMessageService: HISMessageService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'SCADA' },
      { label: 'Danh mục ca', routerLink: ['admin/dmca'] }
    ]);
  }

  ngOnInit() {
    this.getAllDMCA();
  }
  getAllDMCA(){
    this.loading=true;
    this.hisMessageService.getAllDMCa().subscribe(data => {console.log(data);this.listMain = data;this.loading=false});

  }

  openNew() {
    this.mainCurrent = {};
    this.submitted = false;
    this.dialog = true;
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xoá ca ' + item.NAME + ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hisMessageService.deleteDMCa(item).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.getAllDMCA();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã xoá thành công', life: 3000 });
          }
        })
      }
    });
  }

  
  editItem(item) {
    this.mainCurrent = { ...item };
    this.isUpdate = true;
    this.dialog = true;
  }

  hideDialog() {
    this.dialog = false;
    this.isUpdate = false;
    this.submitted = false;
  }

  saveItem(item) {
    this.submitted = true;

    if (this.isUpdate === false) {
      this.hisMessageService.insertDMCa(item).subscribe(result => {
        if (result.result === 'SUCCESS') {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã thêm thành công', life: 3000 });
          this.getAllDMCA();
          this.hideDialog();
        }
      });
    } else {
      this.hisMessageService.insertDMCa(item).subscribe(result => {
        if (result.result === 'SUCCESS') {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã cập nhật thành công', life: 3000 });
          this.getAllDMCA();
          this.hideDialog();
        }
      })
    }
  }
  // exportExcel() {
  //   import("xlsx").then(xlsx => {
  //     const worksheet = xlsx.utils.json_to_sheet(this.tinhs);
  //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  //     this.saveAsExcelFile(excelBuffer, "reportDMTinh");
  //   });
  // }
  
  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //   let EXCEL_EXTENSION = '.xls';
  //   const data: Blob = new Blob([buffer], {
  //     type: EXCEL_TYPE
  //   });
  //   FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  // }

}
