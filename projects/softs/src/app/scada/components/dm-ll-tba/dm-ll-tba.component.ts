import { Component, OnInit, ViewChild } from '@angular/core';
import { HISMessageService } from './../../services/his-message.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { Tinh } from '../dm-tinh/tinh';
import { LLTBA } from './llTBA';
import { TBASPC } from '../dm-tba-spc/tbaSPC';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';
import { FileUpload } from 'primeng/fileupload';
import { ReportService } from '../../services/report.service';
@Component({
  selector: 'app-dm-ll-tba',
  templateUrl: './dm-ll-tba.component.html',
  styleUrls: ['./dm-ll-tba.component.css']
})
export class DmLlTbaComponent implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;
  dialog: boolean;
  tbaSPCs: any[];
  selectedTBASPC: any;
  filterTBASPCs: any[];
  llTBAs: LLTBA[];
  llTBA: any;
  tinhs: Tinh[];
  filterTinhs: Tinh[];
  selectedTinh: any;
  submitted: boolean;
  cols: any[];
  isUpdate: boolean = false;
  scrollXColumn: Number;
  loading: boolean;

  constructor(private hisMessageService: HISMessageService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService, private reportService: ReportService,
    private datePipe: DatePipe) {
    this.breadcrumbService.setItems([
      { label: 'SCADA' },
      { label: 'Lý lịch trạm biến áp SPC', routerLink: ['admin/dmLLTBA'] }
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
          if (item.XOATIN_HIEUDU !== null && item.XOATIN_HIEUDU !== undefined && item.XOATIN_HIEUDU.length > 0) {
            item.XOATIN_HIEUDU = "True";
          } else {
            item.XOATIN_HIEUDU = "False";
          }
          // item.DEADDBANB_NGAYTHUCHIEN = new Date(item.DEADDBANB_NGAYTHUCHIEN);
          // item.DVDKX_NGAYVH_DKX = new Date(item.DVDKX_NGAYVH_DKX);
          // item.ETESPC_NGAYNT = new Date(item.ETESPC_NGAYNT);
          // item.LTBF90_MBAT1 = new Date(item.LTBF90_MBAT1);
          // item.LTBF90_MBAT2 = new Date(item.LTBF90_MBAT2);
          // item.RELAY87B_NGAYNT = new Date(item.RELAY87B_NGAYNT);
          // item.RELAY87L_NGAYNT = new Date(item.RELAY87L_NGAYNT);
          // item.THGSNDC_NGAYNT = new Date(item.THGSNDC_NGAYNT);
          // item.XTHDT_NGAYTHUCHIEN = new Date(item.XTHDT_NGAYTHUCHIEN);

          debugger;
          this.hisMessageService.insertDMLLTBA(item).subscribe(data => {
            debugger;
            console.log(data);
            count += 1;
            if (count === arr.length) {
              console.log(count + '==' + arr.length);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Lưu dữ liệu thành công', life: 3000 });
              this.getAllDMLLTBA();
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
    this.llTBA = {
      ID: "",
      ASDU: "",
      CMU: "",
      CONGSUAT_T1: "",
      CONGSUAT_T2: "",
      DEADDBANB_NGAYTHUCHIEN: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      DEADDBANB_VANBANXACNHAN: "",
      DKX: "",
      DUAN_SPC: "",
      DU_AN: "",
      DVDKX_NGAYVH_DKX: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      DVDKX_VANBANXACNHAN: "",
      ETESPC_NAMNT: dateCurrent.getFullYear(),
      ETESPC_NGAYNT: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      ETESPC_VANBANXACNHAN: "",
      GHI_CHU: "",
      HMI: "",
      ID_BACKUP: "",
      IP_PHONE: "",
      KETNOIA2_GIAOTHUC: "IEC-104",
      KETNOIA2_VANBANXACNHAN: "",
      LTBF90_MBAT1: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      LTBF90_MBAT2: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      LTBF90_VANBANXACNHANT1: "",
      LTBF90_VANBANXACNHANT2: "",
      MA_TINH: "",
      MA_TRAM: "",
      NGOAI_TROI: "",
      NPT22KV35KV_SPTDKX_TTDK: "",
      NPT22KV35KV_TONGSOPHATTUYEN: "",
      RELAY87B_NGAYNT: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      RELAY87B_XACNHAN: "",
      RELAY87L_NGANLO: "",
      RELAY87L_NGAYNT: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      RELAY87L_VANBANXACNHAN: "",
      RTU_BAY: "",
      RTU_MAIN: "",
      SNTB22KV_SNDKX_TTDK: "",
      SNTB22KV_TONGSO: "",
      TBAVHKNT_DVH_CVH: "",
      TBAVHKNT_VANBANXACNHAN: "",
      TEN_TINH: "",
      TEN_TRAM: "",
      THGSNDC_NGAYNT: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      THGSNDC_VANBANXACNHAN: "",
      TONGSO_NGANLO: "",
      TUHOPBO: "",
      UPDATE_RTU_CONFIG: "",
      VHDKX_SP7HMI: "SP7",
      VNPT_PHONE: "",
      XOATIN_HIEUDU: "True",
      XTHDT_NGAYTHUCHIEN: this.datePipe.transform(dateCurrent, 'dd/MM/yyyy'),
      XTHDT_NHANVIENTHUCHIEN: ""
    }
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);

    this.initDataCurrent();
    this.hisMessageService.getDMLLTBA().subscribe(data => {
      console.log(data);

      this.llTBAs = data;
    });
    this.hisMessageService.getDMTinh().subscribe(data => {
      this.tinhs = data
    });
    this.hisMessageService.getDMTBASPC().subscribe(data => {
      console.log(data);
      this.tbaSPCs = data
    });
  }

  openNew() {
    this.initDataCurrent();
    this.submitted = false;
    this.dialog = true;
  }
  converStringToDate(str) {
    if (str !== null && str !== '' && str.length >= 10) {
      let result = str.substr(0, 10);
      // debugger;
      result = result.split("/");
      var date = new Date(result[2], result[1] - 1, result[0]);
      return date;
    } else {
      return '';
    }
  }

  getAllDMLLTBA() {
    this.loading = true;
    this.hisMessageService.getDMLLTBA().subscribe(data => {
      console.log(data);
      this.llTBAs = data;
      this.loading = false;
    });
    this.isUpdate = false;
    this.submitted = false;
    this.dialog = false;
  }

  editItem(llTBA: LLTBA) {
    this.llTBA = { ...llTBA };

    this.selectedTBASPC = llTBA.MA_TRAM;
    this.llTBA.XTHDT_NGAYTHUCHIEN = this.datePipe.transform(new Date(this.llTBA.XTHDT_NGAYTHUCHIEN), 'dd/MM/yyyy');
    this.llTBA.DEADDBANB_NGAYTHUCHIEN = this.datePipe.transform(new Date(this.llTBA.DEADDBANB_NGAYTHUCHIEN), 'dd/MM/yyyy');
    this.llTBA.RELAY87L_NGAYNT = this.datePipe.transform(new Date(this.llTBA.RELAY87L_NGAYNT), 'dd/MM/yyyy');
    this.llTBA.RELAY87B_NGAYNT = this.datePipe.transform(new Date(this.llTBA.RELAY87B_NGAYNT), 'dd/MM/yyyy');
    this.llTBA.DVDKX_NGAYVH_DKX = this.datePipe.transform(new Date(this.llTBA.DVDKX_NGAYVH_DKX), 'dd/MM/yyyy');
    this.llTBA.ETESPC_NGAYNT = this.datePipe.transform(new Date(this.llTBA.ETESPC_NGAYNT), 'dd/MM/yyyy');
    this.llTBA.THGSNDC_NGAYNT = this.datePipe.transform(new Date(this.llTBA.THGSNDC_NGAYNT), 'dd/MM/yyyy');
    this.llTBA.LTBF90_MBAT1 = this.datePipe.transform(new Date(this.llTBA.LTBF90_MBAT1), 'dd/MM/yyyy');
    this.llTBA.LTBF90_MBAT2 = this.datePipe.transform(new Date(this.llTBA.LTBF90_MBAT2), 'dd/MM/yyyy');
    this.isUpdate = true;
    this.dialog = true;
  }

  deleteItem(llTBA: LLTBA) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa thông tin trạm ' + llTBA.TEN_TRAM + ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hisMessageService.deleteDMLLTBA(llTBA).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.getAllDMLLTBA();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã xoá thành công', life: 3000 });
          }
        })
      }
    });
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

  hideDialog() {
    this.dialog = false;
    this.isUpdate = false;
    this.submitted = false;
    this.selectedTinh = null;
    this.selectedTBASPC = null;

  }
  close() {
    this.dialog = false;
    this.selectedTinh = null;
    this.selectedTBASPC = null;
  };
  validateForm(item) {
    if (item === null && item === undefined) {
      return 'Lỗi'
    } else if (isNaN(Number(item.SNTB22KV_SNDKX_TTDK))) {
      return 'Lỗi nhập số ngăn điều kiển không phải số';
    } else if (isNaN(Number(item.NPT22KV35KV_SPTDKX_TTDK)) || isNaN(Number(item.NPT22KV35KV_TONGSOPHATTUYEN))) {
      return 'Lỗi nhập số ngăn phát tuyến 22kV,35kV không phải số';
    } else if (Number(item.NPT22KV35KV_SPTDKX_TTDK) > Number(item.NPT22KV35KV_TONGSOPHATTUYEN)) {
      return 'Số ngăn ngăn phát tuyến 22kV,35kV nhỏ hơn tổng số';
    }
    else if (isNaN(Number(item.TONGSO_NGANLO)) || isNaN(Number(item.RELAY87L_NGANLO))) {
      return 'Số ngăn lộ phải là số';
    }
    else if (isNaN(Number(item.IP_PHONE)) || isNaN(Number(item.VNPT_PHONE)) || Number(item.VNPT_PHONE) > 100000000000) {
      return 'Số điện thoại không hợp lệ';
    }
    else if (isNaN(Number(item.ID_BACKUP))) {
      return 'Id backup không hợp lệ';
    }
    else if (isNaN(Number(item.ASDU))) {
      return 'ASDU không hợp lệ';
    }
    else if (isNaN(Number(item.SNTB22KV_SNDKX_TTDK)) || isNaN(Number(item.SNTB22KV_TONGSO))) {
      return 'Lỗi nhập số ngăn tụ không phải số';
    }
    else if (isNaN(Number(item.CONGSUAT_T1)) || isNaN(Number(item.CONGSUAT_T2))) {
      return 'Lỗi nhập công suất không phải số';
    }
    else if (Number(item.SNTB22KV_SNDKX_TTDK) > Number(item.SNTB22KV_TONGSO)) {
      return 'Số ngăn tụ bù 22kV phải nhỏ hơn tổng số';
    } else if (item.MA_TRAM === null || item.MA_TRAM === '' || item.MA_TRAM === undefined) {
      return 'Vui lòng chọn trạm';
    } else {
      return 'SUCCESS';
    }
  }
  saveItem() {
    this.submitted = true;


    this.llTBA.MA_TRAM = this.selectedTBASPC;
    let request = this.llTBA;

    request.DVDKX_NGAYVH_DKX = this.convertStringToDate(request.DVDKX_NGAYVH_DKX);
    request.ETESPC_NGAYNT = this.convertStringToDate(request.ETESPC_NGAYNT);
    request.THGSNDC_NGAYNT = this.convertStringToDate(request.THGSNDC_NGAYNT);
    request.LTBF90_MBAT1 = this.convertStringToDate(request.LTBF90_MBAT1);
    request.LTBF90_MBAT2 = this.convertStringToDate(request.LTBF90_MBAT2);
    request.RELAY87B_NGAYNT = this.convertStringToDate(request.RELAY87B_NGAYNT);
    request.RELAY87L_NGAYNT = this.convertStringToDate(request.RELAY87L_NGAYNT);
    request.DEADDBANB_NGAYTHUCHIEN = this.convertStringToDate(request.DEADDBANB_NGAYTHUCHIEN);
    request.XTHDT_NGAYTHUCHIEN = this.convertStringToDate(request.XTHDT_NGAYTHUCHIEN);
    request.ETESPC_NAMNT = request.ETESPC_NAMNT.toString();
    const check = this.validateForm(this.llTBA);
    if (check === 'SUCCESS') {
      if (this.isUpdate === false) {
        debugger;
        this.hisMessageService.insertDMLLTBA(request).subscribe(result => {
          console.log(result);
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã thêm thành công', life: 3000 });
            this.getAllDMLLTBA();
            this.selectedTinh = null;
            this.selectedTBASPC = null;
          }
        });
      } else {
        //debugger;
        this.hisMessageService.updateDMLLTBA(request).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã cập nhật thành công', life: 3000 });
            this.getAllDMLLTBA();
            this.selectedTinh = null;
            this.selectedTBASPC = null;
          }
        })
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Successful', detail: check, life: 3000 });
      this.submitted = false;
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

  filterTramSPC(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.tbaSPCs.length; i++) {
      const tba = this.tbaSPCs[i];
      if (tba.TEN_TINH.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tba);
      }
    }

    this.filterTBASPCs = filtered;
  }

  exportExcel() {
    const fileName = 'LLTBASPC';
    const title = 'THEO DÕI CÁC TRẠM BIẾN ÁP CỦA EVN SPC';
    let workbook = this.reportService.showReportDMLLTBASPC(
      this.llTBAs,
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
    <th rowspan="2">Tên Tỉnh
    </th>
    <th rowspan="2">Tên Trạm
    </th>
    <th rowspan="2" pSortableColumn="MA_TRAM" >Mã Trạm 
    </th>
    <th rowspan="2" pSortableColumn="XOATIN_HIEUDU">Xóa Tín Hiệu Dư
    </th>
    <th rowspan="2" pSortableColumn="CONGSUAT_T1">Công suất T1
    </th>
    <th rowspan="2" pSortableColumn="CONGSUAT_T2">Công suất T2
    </th>
    <th rowspan="2" pSortableColumn="ASDU">ASDU 
    </th>
    <th rowspan="2" pSortableColumn="ID_BACKUP">ID Backup 
    </th>
    <th rowspan="2" pSortableColumn="CMU">CMU
    </th>
    <th rowspan="2" pSortableColumn="RTU_MAIN">RTU Main
    </th>
    <th rowspan="2" pSortableColumn="RTU_BAY">RTU Bay
    </th>
    <th rowspan="2" pSortableColumn="UPDATE_RTU_CONFIG">Update RTU
    </th>
    <th rowspan="2" pSortableColumn="HMI">HMI 
    </th>
    <th rowspan="2" pSortableColumn="DU_AN">Dự Án 
    </th>
    <th rowspan="2" pSortableColumn="DUAN_SPC">Dự Án SPC
    </th>
    <th rowspan="2" pSortableColumn="VHDKX_SP7HMI">SP7/HMI
    </th>
    <th rowspan="2" pSortableColumn="DKX">DKX
    </th>
    <th rowspan="2" pSortableColumn="IP_PHONE">IP Phone 
    </th>
    <th rowspan="2" pSortableColumn="VNPT_PHONE">VNPT Phone
    </th>
    <th rowspan="2" pSortableColumn="GHI_CHU">Ghi Chú
    </th>
    <th colspan="2"  >Kết nối A2</th>
    <th colspan="2"  >Trạm biến áp Vận hành Không người trực</th>
    <th colspan="2"  >Đưa vào điều khiển xa</th>
    <th colspan="3"  >End-to-End về EVN SPC</th>
    <th colspan="2"  >Tín hiệu giám sát nguồn DC</th>
    <th colspan="4"  >Lắp thiết bị F90</th>
    <th colspan="2"  >Lắp relay 87B</th>
    <th colspan="3"  >Lắp relay 87L</th>
    <th colspan="2"  >Deadbanb (8458/EVN SPC-KT ngày 30/9/2020)</th>
    <th colspan="2"  >Xóa tín hiệu dư thừa</th>
    <th colspan="2"  >Ngăn Phát tuyến 22kV& 35kV</th>
    <th colspan="2"  >Số ngăn Tụ bù 22kV</th>
    <th rowspan="2"  >Tổng số ngăn lộ</th>
    <th rowspan="2"  >Tủ hợp bộ</th>
    <th rowspan="2"  >Ngoài trời</th>

</tr>
<tr class="trHeader">
    
    <th >A2 Giao Thức
    </th>
    <th>A2 Xác Nhận 
    </th>
    <th >TBAVHKNT Vận Hành
    </th>
    <th>TBAVHKNT Xác Nhận 
    </th>
    <th >ĐKX Vận Hành 
    </th>
    <th >ĐKX Xác Nhận
    </th>
    <th>E-T-E SPC Ngày NT 
    </th>
    <th >E-T-E SPC Năm NT
    </th>
    <th >E-T-E SPC Xác Nhận
    </th>
    <th >THGX DC Ngày NT
    </th>
    <th >THGX DC Xác Nhận 
    </th>
    <th >F90 MBA T1
    </th>
    <th >F90 MBA Xác Nhận 
    </th>
    <th >F90 MBA T2
    </th>
    <th >F90 MBA Xác Nhận
    </th>
    <th >87B Ngày NT
    </th>
    <th >87B Xác Nhận
    </th>
    <th >87L Ngăn Lộ 
    </th>
    <th >87L Ngày NT
    </th>
    <th >87L Xác Nhận
    </th>
    <th >Deadbanb Ngày Thực Hiện
    </th>
    <th>Deadbanb Xác Nhận
    </th>
    <th>XTHDT Ngày Thực Hiện
    </th>
    <th >XTHDT Nhân viên thực hiện
    </th>
    <th> 22kV& 35kV Tổng Số
    </th>
    <th> 22kV& 35kV TTĐK 
    </th>
    <th>22kV Tổng Số 
    </th>
    <th >22kV TTDK
    </th>
</tr>`;
    this.llTBAs.length === 0 ? null : this.llTBAs.map(item => {
      table += `<tr>
      <td >
          ${item.TEN_TINH}
      </td>
      <td >
          ${item.TEN_TRAM}
      </td>
      <td >
          ${item.MA_TRAM}
      </td>
      <td >
          ${item.XOATIN_HIEUDU === 'True' ? 'x' : ''}
      </td>

      <td >
          ${item.CONGSUAT_T1}
      </td>

      <td >
          ${item.CONGSUAT_T2}
      </td>
      <td >
          ${item.ASDU}
      </td>
      <td >
          ${item.ID_BACKUP}
      </td>
      <td >
          ${item.CMU}
      </td>
      <td >
          ${item.RTU_MAIN}
      </td>
      <td >
          ${item.RTU_BAY}
      </td>
      <td >
          ${item.UPDATE_RTU_CONFIG}
      </td>
      <td >
          ${item.HMI}
      </td>
      <td >
          ${item.DU_AN}
      </td>
      <td >
          ${item.DUAN_SPC}
      </td>
      <td > 
          ${item.VHDKX_SP7HMI}
      </td>
      <td >
          ${item.DKX}
      </td>
      <td >
          ${item.IP_PHONE}
      </td>
      <td >
          ${item.VNPT_PHONE}
      </td>
      <td >
          ${item.GHI_CHU}
      </td>
      <td >
          ${item.KETNOIA2_GIAOTHUC}
      </td>
      <td >
          ${item.KETNOIA2_VANBANXACNHAN}
      </td>
      <td >
          ${item.TBAVHKNT_DVH_CVH}
      </td>
      <td >
          ${item.TBAVHKNT_VANBANXACNHAN}
      </td>
      <td >
          ${item.DVDKX_NGAYVH_DKX}
      </td>
      <td >
          ${item.DVDKX_VANBANXACNHAN}
      </td>
      <td >
          ${item.ETESPC_NGAYNT}
      </td>
      <td >
          ${item.ETESPC_NAMNT}
      </td>
      <td >
          ${item.ETESPC_VANBANXACNHAN}
      </td>
      <td >
          ${item.THGSNDC_NGAYNT}
      </td>
      <td >
          ${item.THGSNDC_VANBANXACNHAN}
      </td>
      <td >
          ${item.LTBF90_MBAT1}
      </td>
      <td >
          ${item.LTBF90_VANBANXACNHANT1}
      </td>
      <td >
          ${item.LTBF90_MBAT2}
      </td>
      <td >
          ${item.LTBF90_VANBANXACNHANT2}
      </td>

      <td >
          ${item.RELAY87B_NGAYNT}
      </td>
      <td >
          ${item.RELAY87B_XACNHAN}
      </td>

      <td >
          ${item.RELAY87L_NGANLO}
      </td>
      <td >
          ${item.RELAY87L_NGAYNT}
      </td>
      <td >
          ${item.RELAY87L_VANBANXACNHAN}
      </td>

      <td >
          ${item.DEADDBANB_NGAYTHUCHIEN}
      </td>
      <td >
          ${item.DEADDBANB_VANBANXACNHAN}
      </td>
      <td >
          ${item.XTHDT_NGAYTHUCHIEN}
      </td>
      <td >
          ${item.XTHDT_NHANVIENTHUCHIEN}
      </td>
      <td >
          ${item.NPT22KV35KV_TONGSOPHATTUYEN}
      </td>
      <td >
          ${item.NPT22KV35KV_SPTDKX_TTDK}
      </td>
      <td >
          ${item.SNTB22KV_TONGSO}
      </td>
      <td >
          ${item.SNTB22KV_SNDKX_TTDK}
      </td>
      <td >
          ${item.TONGSO_NGANLO}
      </td>
      <td >
          ${item.TUHOPBO}
      </td>
      <td >
          ${item.NGOAI_TROI}
      </td>
  </tr>`;
    });
    table += `</table>`;
    debugger;
    this.saveAsExcelFile(table.replace(/<th/g, '<th style="border: 0.2em solid black; vertical-align: middle;"').replace(/<td/g, '<td style="border: 0.2em solid black; vertical-align: middle;"'), "reportLLTBAKH");
    // import("xlsx").then(xlsx => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.llTBAs);
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