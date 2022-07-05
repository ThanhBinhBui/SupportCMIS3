import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { HISMessageService } from '../../services/his-message.service';
import * as FileSaver from 'file-saver';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-import-tin-hieu-cong-suat',
  templateUrl: './import-tin-hieu-cong-suat.component.html',
  styleUrls: ['./import-tin-hieu-cong-suat.component.css']
})
export class ImportTinHieuCongSuatComponent implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;
  TO_DATE: string;
  FROM_DATE: string;
  loading: boolean;
  listMain: any[];
  loadingModal: boolean;

  getDate(d: any) {
    const dateCurrent = new Date(Number(d));
    return `${dateCurrent.getMonth() + 1}/${dateCurrent.getDate()}/${dateCurrent.getFullYear()} ${dateCurrent.getHours()}:${dateCurrent.getMinutes()}:${dateCurrent.getSeconds()}`;
  }

  convertStringToDate(str) {
    if (str !== null && str !== '') {
      return str.substr(6, 4) + '-' + str.substr(3, 2) + '-' + str.substr(0, 2) + ' ' + str.substr(12, 8);
    } else {
      return null;
    }
  }

  fileUpload() {
    // debugger;
    try {
      this.loadingModal = true;
      if (this.fileInput.files.length > 0) {
        const selectedFile = this.fileInput.files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(selectedFile);
        fileReader.onload = (event) => {
          console.log(event);
          const binaryData = event.target.result;
          let data = JSON.parse(binaryData.toString());
          data.nguoiTao = JSON.parse(localStorage.getItem('user')).FULL_NAME;
          data.time = new Date(this.convertStringToDate(data.time));
          data.fileName = selectedFile.name;
          //debugger;

          this.hisMessageService.insertTinHieuCongSuatDirection(data).subscribe(data => {
            console.log(data);
            this.search();
            this.fileInput.clear();
            this.loadingModal=false;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Lưu dữ liệu thành công', life: 3000 });
          })
        }
      }
    } catch (err) {
      console.log(err);
      this.loadingModal = false;
    }
  }
  constructor(private hisMessageService: HISMessageService, private breadcrumbService: BreadcrumbService,
    private messageService: MessageService, private datePipe: DatePipe) {
    this.breadcrumbService.setItems([
      { label: 'SCADA' },
      { label: 'Import Tín Hiệu CS', routerLink: ['admin/importTinHieuCongSuat'] }
    ]);
  }
  ngOnInit(): void {
    
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    let now = new Date();
    var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.FROM_DATE = this.datePipe.transform(firstDay, 'dd/MM/yyyy');
    this.TO_DATE = this.datePipe.transform(now, 'dd/MM/yyyy');

    this.search();
  }
  search() {
    if (this.FROM_DATE !== undefined && this.TO_DATE !== undefined && this.FROM_DATE !== null && this.TO_DATE !== null && this.FROM_DATE !== '' && this.TO_DATE !== '') {
      this.loading = true;
      debugger;
      this.hisMessageService.getTinHieuCongSuatLog({ startTime: this.convertStringToDate(this.FROM_DATE), endTime: this.convertStringToDate(this.TO_DATE) }).subscribe(data => {
        console.log(data);
        this.listMain = data;
        this.loading = false;
      })
    }
    else {

      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn thời gian tìm kiếm' });
    }
  }
}
