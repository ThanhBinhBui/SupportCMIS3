import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { HISMessageService } from '../../services/his-message.service';
import * as FileSaver from 'file-saver';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-import-excel-hismessage.component',
  templateUrl: './import-excel-hismessage.component.html',
  styleUrls: ['./import-excel-hismessage.component.css']
})
export class ImportExcelHisMessageComponent implements OnInit {
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

  fileUpload() {
    
    try {
      this.loadingModal = true;
      if (this.fileInput.files.length > 0) {
        const selectedFile = this.fileInput.files[0];
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event) => {
          console.log(event);
          let binaryData = event.target.result;
          let workbook = XLSX.read(binaryData, { type: 'binary' });
          workbook.SheetNames.forEach(sheet => {
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            //this.hisMessageService.getABC().subscribe(data => console.log(data));
            // this.convertedJson=JSON.stringify(data,undefined,4);
            let dataFromExcel = [];
            data.map(item => {
              dataFromExcel.push({
                "ID": "",
                "TIMESTAMP": item["Time stamp"].toString(),
                "MILLI_SECONDS": item["Milliseconds"].toString(),
                "B1": item["B1"].toString(),
                "B2": item["B2"].toString(),
                "B3": item["B3"].toString(),
                "ELEMENT": item["Element"].toString(),
                "DESCRIPTION": item["Description"].toString(),
                "STATUS": item["Status"].toString(),
                "TAG": item["Tag"].toString(),
                "OPERATOR": item["Operator"].toString(),
                "MESSAGE_CLASS": item["Message Class"].toString(),
                "VALUE": item["Value"].toString(),
                "INDICATOR": item["Indicator"].toString(),
                "LIMIT": item["Limit"].toString(),
                "UNITS": item["Units"].toString(),
                "CONSOLE": item["Console"].toString(),
                "SOE": item["SoE"].toString(),
                "COMMENT": item["Comment"].toString(),
                "USER_COMMENT": item["User comment"].toString(),
                "DATE_CREATE": "08/01/2021 00:00:00",
                "USER_CREATE": "binhbt",
                "A": item["A"].toString()
              });
            });
            debugger;
            this.hisMessageService.insertHISMessageDirection({ data: dataFromExcel, nguoiTao: JSON.parse(localStorage.getItem("user")).FULL_NAME, fileName: selectedFile.name }).subscribe(data => {
              console.log(data);
              // alert('import thành công');
              this.loadingModal = false;
              this.search();
              this.fileInput.clear();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Lưu dữ liệu thành công', life: 3000 });
            })
  
          })
        }
      }
    } catch (err) {
      console.log(err);
      this.loadingModal = false;
    }
  }

  convertStringToDate(str) {
    if (str !== null && str !== '') {
      return str.substr(6, 4) + '-' + str.substr(3, 2) + '-' + str.substr(0, 2);
    } else {
      return null;
    }
  }

  getCa(startTime, endTime) {
    this.loading = true;
    this.hisMessageService.getHISMessageLog({ startTime, endTime }).subscribe(data => {

      this.listMain = data;
      console.log(data);
      this.loading = false;
    });
  }
  search() {
    if (this.FROM_DATE !== undefined && this.TO_DATE !== undefined && this.FROM_DATE !== null && this.TO_DATE !== null && this.FROM_DATE !== '' && this.TO_DATE !== '') {
      this.loading = true;
      debugger;
      this.hisMessageService.getHISMessageLog({ startTime: this.convertStringToDate(this.FROM_DATE), endTime: this.convertStringToDate(this.TO_DATE) }).subscribe(data => {
        console.log(data);
        this.listMain = data;
        this.loading = false;
      })
    }
    else {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn thời gian tìm kiếm' });
    }
  }

  constructor(private hisMessageService: HISMessageService, private breadcrumbService: BreadcrumbService,
    private messageService: MessageService, private datePipe: DatePipe) {
    this.breadcrumbService.setItems([
      { label: 'SCADA' },
      { label: 'Import file Hismessage', routerLink: ['admin/importHISMessage'] }
    ]);
  }
  ngOnInit(): void {
    let now = new Date();
    var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.FROM_DATE = this.datePipe.transform(firstDay, 'dd/MM/yyyy');
    this.TO_DATE = this.datePipe.transform(now, 'dd/MM/yyyy');
    console.log(JSON.parse(localStorage.getItem("user")));
    this.search();
  }


}


