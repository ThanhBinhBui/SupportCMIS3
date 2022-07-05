import { Component, OnInit,ViewChild } from '@angular/core';
import { HISMessageService } from './../../services/his-message.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { Tinh } from '../dm-tinh/tinh';
import { LLTB22 } from './llTB22';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { FileUpload } from 'primeng/fileupload';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';
import { ReportService } from '../../services/report.service';
@Component({
  selector: 'app-dm-lltb22',
  templateUrl: './dm-lltb22.component.html',
  styleUrls: ['./dm-lltb22.component.css']
})
export class DmLltb22Component implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;
  dialog: boolean;
  llTB22s: any[];
  llTB22: any;
  scrollXColumn: Number;
  filterTinhs: Tinh[];
  tinhs: Tinh[];
  selectedTinh: any;
  submitted: boolean;
  cols: any[];
  isUpdate: boolean = false;
  loading: boolean;

  constructor(private hisMessageService: HISMessageService, private messageService: MessageService,
    private confirmationService: ConfirmationService,private reportService: ReportService, private breadcrumbService: BreadcrumbService,
    private datePipe: DatePipe) {
    this.breadcrumbService.setItems([
      { label: 'SCADA' },
      { label: 'Danh mục theo dõi thiết bị 22', routerLink: ['admin/dmLLTB22'] }
    ]);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event): void => {
    this.scrollXColumn = event.target.scrollLeft;
  };

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
          if(item.DANGKETNOI!==null&&item.DANGKETNOI!==undefined&&item.DANGKETNOI.length>0){
            item.DANGKETNOI='True';
          }else{
            item.DANGKETNOI='False';
          }
          this.hisMessageService.insertDMLLTB22(item).subscribe(data => {
            debugger;
            console.log(data);
            count+=1;
            if(count===arr.length){
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Lưu dữ liệu thành công', life: 3000 });
              this.getAllDMLLTB22();
              this.fileInput.clear();
            }
          })
        });
        
      }
    }
  }
  initDataCurrent() {
    let tmpDate = new Date();
    let dateCurrent = tmpDate.getDate() + '/' + (tmpDate.getMonth() + 1) + '/' + tmpDate.getFullYear();
    this.llTB22 = {
      DANGKETNOI: "True",
      GIAOTHUCKETNOI: "IEC-101",
      ID: "",
      LOAI_THIETBI: "",
      MA_TINH: "",
      NGAN_LO: "",
      SCADA_ASDU: "",
      SCADA_IMEI: "",
      SCADA_KETNOI: "",
      SCADA_MODEM: "",
      SCADA_NAM: "",
      SCADA_SODIENTHOAI: "",
      SCADA_TEN: "",
      TDK_HIEULOAI: "",
      TDK_NAMVANHANH: "",
      TDK_NHASANXUAT: "",
      TDK_SONO: "",
      TEN_THIETBI: "",
      TEN_TINH: "",
      TEN_TRAM_110: "",
      TT_KHACHHANG: "",
      VITRI_THIETBI: "",
    }
  }


  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
    this.initDataCurrent();
    this.hisMessageService.getDMLLTB22().subscribe(data => { this.llTB22s = data; console.log(data) });
    this.hisMessageService.getDMTinh().subscribe(data => {
      this.tinhs = data
    });
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'MA_TINH', header: 'Ma tỉnh' },
      { field: 'TEN_TINH', header: 'Tên tỉnh' },
      { field: 'TEN_TRAM_110', header: 'Tên trạm' },
      { field: 'NGAN_LO', header: 'Tên trạm không dấu' },
      { field: 'TEN_THIETBI', header: 'Tên phát tuyến' },
      { field: 'VITRI_THIETBI', header: 'ID' },
      { field: 'LOAI_THIETBI', header: 'Ma tỉnh' },
      { field: 'TDK_HIEULOAI', header: 'Tên tỉnh' },
      { field: 'TDK_NHASANXUAT', header: 'Tên trạm' },
      { field: 'TDK_SONO', header: 'Tên trạm không dấu' },
      { field: 'TDK_NAMVANHANH', header: 'Tên phát tuyến' },
      { field: 'SCADA_KETNOI', header: 'ID' },
      { field: 'SCADA_NAM', header: 'Ma tỉnh' },
      { field: 'SCADA_MODEM', header: 'Tên tỉnh' },
      { field: 'SCADA_TEN', header: 'Tên trạm' },
      { field: 'SCADA_ASDU', header: 'Tên trạm không dấu' },
      { field: 'SCADA_IMEI', header: 'Tên phát tuyến' },
      { field: 'SCADA_SODIENTHOAI', header: 'Ma tỉnh' },
      { field: 'GIAOTHUCKETNOI', header: 'Tên tỉnh' },
      { field: 'TT_KHACHHANG', header: 'Tên trạm' },
      { field: 'DANGKETNOI', header: 'Tên trạm không dấu' },
      { field: 'MATKETNOI', header: 'Tên phát tuyến' }

    ];
  }

  openNew() {
    this.initDataCurrent();
    this.submitted = false;
    this.dialog = true;
  }

  getAllDMLLTB22() {
    this.loading = true;
    this.hisMessageService.getDMLLTB22().subscribe(data => { this.llTB22s = data; this.loading = false; });
    this.isUpdate = false;
    this.submitted = false;
    this.dialog = false;
  }

  editItem(llTB22: LLTB22) {
    this.llTB22 = { ...llTB22 };

    this.selectedTinh = llTB22.MA_TINH;
    this.isUpdate = true;
    this.dialog = true;
  }

  deleteItem(llTB22: LLTB22) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xoá RECLOSER/LBS  ' + llTB22.TEN_TRAM_110 + ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hisMessageService.deleteDMLLTB22(llTB22).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.getAllDMLLTB22();
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
  close() {
    this.dialog = false;
    this.selectedTinh = null;
  };
  validateForm(item) {
    if (item === null && item === undefined) {
      return 'Lỗi'
    }
    else if (item.TEN_TRAM_110 === '' || item.NGAN_LO === '' || item.TEN_THIETBI === '' || item.VITRI_THIETBI === '') {
      return 'Vui lòng nhập đủ thông tin cần thiết';
    }
    else if (item.TEN_TRAM_110.length > 255) {
      return 'Lỗi nhập tên trạm 110 dài hơn 255 ký tự';
    }
    else if (isNaN(Number(item.SCADA_SODIENTHOAI))) {
      return 'Lỗi nhập số điện thoại không phải là số';
    }
    else if (isNaN(Number(item.SCADA_ASDU))) {
      return 'Lỗi nhập ASDU không phải là số';
    }
    else {
      return 'SUCCESS';
    }
  }
  saveItem() {
    this.submitted = true;
    this.llTB22.MA_TINH = this.selectedTinh;
    const check = this.validateForm(this.llTB22);
    debugger;
    if (check === 'SUCCESS') {
      if (this.isUpdate === false) {
        this.hisMessageService.insertDMLLTB22(this.llTB22).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã thêm thành công', life: 3000 });
            this.getAllDMLLTB22();
          }
        });
      } else {
        this.hisMessageService.updateDMLLTB22(this.llTB22).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã cập nhật thành công', life: 3000 });
            this.getAllDMLLTB22();
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
    const fileName = 'LLTB22';
    const title = 'DANH MỤC RECLOSER/LBS 21 PCs';
    let workbook = this.reportService.showReportDMLLTB22(
      this.llTB22s,
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
    <th rowspan="2" pSortableColumn="TEN_TINH"> Tên đơn vị 
    </th>
    <th rowspan="2" pSortableColumn="TEN_TRAM_110"> Tên trạm 110kV 
    </th>
    <th rowspan="2" pSortableColumn="NGAN_LO"> Ngăn lộ 22kV 
    </th>
    <th rowspan="2" pSortableColumn="TEN_THIETBI"> Tên thiết bị
    </th>
    <th rowspan="2" pSortableColumn="VITRI_THIETBI"> Vị trí thiết bị 
    </th>
    <th rowspan="2" pSortableColumn="LOAI_THIETBI"> Loại thiết bị</th>
    <th colspan="4" >Tủ điều kiển</th>
    <th colspan="7" >Kết nối SCADA</th>
    <th rowspan="2"> Giao thức kết nối</th>
    <th rowspan="2"> Thông tin khách hàng</th>
    <th rowspan="2"> Đang kết nối </th>
    <th rowspan="2"> Đang mất kết nối </th>
    </tr>
<tr class="trHeader">
    <th pSortableColumn="TDK_HIEULOAI"> TDK hiệu loại 
    </th>
    <th pSortableColumn="TDK_NHASANXUAT"> TDK nhà sản xuất 
    </th>
    <th pSortableColumn="TDK_SONO"> TDK số No 
    </th>
    <th pSortableColumn="TDK_NAMVANHANH"> TDK năm vận hành
    </th>
    <th pSortableColumn="SCADA_KETNOI"> Kết nối SCADA 
    </th>
    <th pSortableColumn="SCADA_NAM"> SCADA năm 
    </th>
    <th pSortableColumn="SCADA_MODEM"> SCADA modem 
    </th>
    <th pSortableColumn="SCADA_TEN"> SCADA tên 
    </th>
    <th pSortableColumn="SCADA_ASDU"> SCADA ASDU 
    </th>
    <th pSortableColumn="SCADA_IMEI"> SCADA số Imei 
    </th>
    <th pSortableColumn="SCADA_SODIENTHOAI"> SCADA SĐT
    </th>
    
</tr>`;
    this.llTB22s.length === 0 ? null : this.llTB22s.map(item => {
      table += `<tr>
      <td class="bodySTT" >
                                  ${item.TEN_TINH}
                              </td>
                              <td class="bodySTT" > 
                                  ${item.TEN_TRAM_110}
                              </td>
                              <td class="bodySTT">
                                  ${item.NGAN_LO}
                              </td>
                              <td class="bodySTT">
                                  ${item.TEN_THIETBI}
                              </td>
      
                              <td class="bodySTT"> 
                                  ${item.VITRI_THIETBI}
                              </td>
                              <td class="bodySTT">  
                                  ${item.LOAI_THIETBI}
                              </td>
                              <td class="bodySTT">  
                                  ${item.TDK_HIEULOAI}
                              </td>
                              <td class="bodySTT">
                                  ${item.TDK_NHASANXUAT}
                              </td>
                              <td class="bodySTT">
                                  ${item.TDK_SONO}
                              </td>
      
                              <td class="bodySTT">
                                  ${item.TDK_NAMVANHANH}
                              </td>
                              <td class="bodySTT">
                                  ${item.SCADA_KETNOI}
                              </td>
                              <td class="bodySTT"> 
                                  ${item.SCADA_NAM}
                              </td>
                              <td class="bodySTT">  
                                  ${item.SCADA_MODEM}
                              </td>
                              <td class="bodySTT"> 
                                  ${item.SCADA_TEN}
                              </td>
                              <td class="bodySTT">
                                  ${item.SCADA_ASDU}
                              </td>
                              <td class="bodySTT">
                                  ${item.SCADA_IMEI}
                              </td>
                              <td class="bodySTT">
                                  ${item.SCADA_SODIENTHOAI}
                              </td>
                              <td class="bodySTT">
                                  ${item.GIAOTHUCKETNOI}
                              </td>
                              <td class="bodySTT">
                                  ${item.TT_KHACHHANG}
                              </td>
                              <td class="bodySTT"> 
                                  ${item.DANGKETNOI === 'True' ? 'x' : ''}
                              </td>
                              <td class="bodySTT">
                                  ${item.DANGKETNOI === 'False' ? 'x' : ''}
                              </td>
                              
                          </tr>`;
    });
    table += `</table>`;
    debugger;
    this.saveAsExcelFile(table.replace(/<th/g, '<th style="border: 0.2em solid black; vertical-align: middle;"').replace(/<td/g, '<td style="border: 0.2em solid black; vertical-align: middle;"'), "reportLLTB22");

    // import("xlsx").then(xlsx => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.llTB22s);
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
