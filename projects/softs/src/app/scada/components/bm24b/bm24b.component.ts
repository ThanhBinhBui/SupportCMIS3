import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as fs from 'file-saver';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { HISMessageService } from '../../services/his-message.service';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import '../../../../assets/font/fontTimesNewRoman-normal.js';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-bm24b',
  templateUrl: './bm24b.component.html',
  styleUrls: ['./bm24b.component.css']
})
export class Bm24bComponent implements OnInit {

  listMain: any[];
  listMainCa: any[];
  mainListCa: any[];
  mainCaCurrent: any;
  listCa: any[];
  listTinhTrang: any[];
  listLuuY: any[];
  selectedCa: any;
  selectedCaCurrent: any;
  selectedCategory: any;
  listCategory: any[];
  contentLuuY: any;
  contentTinhTrang: any;
  idLuuY: any;
  idTinhTrang: any;
  mainCurrent: any;
  FROM_DATE: string;
  TO_DATE: string;
  FROM_DATE_CA: string;
  TO_DATE_CA: string;
  login: any;
  lstORG: any[];
  selectedORG_CODE: string;
  editDialog: boolean;
  submitted: boolean;
  submittedCa: boolean;
  dialog: boolean;
  dialogCa: boolean;
  isUpdate: boolean;
  isUpdateCa: boolean;
  tinhs: any[];
  filterTinhs: any[];
  filterTinhsDonViNgoai: any[];
  selectedDonViQuanLy: any;
  selectedDonViQuanLyNgoai: any;
  loadingSuKien: boolean;
  loadingTinhTrang: boolean;
  loadingLuuY: boolean;
  loading: boolean;
  listUser: any[];
  listDMCa: any[];
  selectedCaTypingCurrent: any;
  submitedGiao: boolean = false;
  submitedNhan: boolean = false;
  loadingModal: boolean = false;

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
      { label: 'BM24 - Sổ Nhật Ký Vận Hành', routerLink: 'nkvh/so' }
    ]);
  }

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    this.hisMessageService.getDMTinh().subscribe(data => {
      this.tinhs = data;
      this.selectedDonViQuanLy = data[0].MA_DVIQLY;
      this.selectedDonViQuanLyNgoai = data[0].MA_DVIQLY;
    });
    this.hisMessageService.getShortUserByOrg({
      "ORG_CODE": user.ORG_CODE
    }).subscribe(data => { this.listUser = data; console.log(data) });
    this.hisMessageService.getAllDMCa().subscribe(data => { console.log(data); this.listDMCa = data });
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
    console.log(JSON.parse(localStorage.getItem("user")));
    this.search();
  }

  convertStringToDate(str) {
    if (str !== null && str !== '') {
      return str.substr(6, 4) + '-' + str.substr(3, 2) + '-' + str.substr(0, 2);
    } else {
      return null;
    }
  }
  convertStringToDateVN(str) {
    if (str !== null && str !== '') {
      return str.substr(3, 2) + '/' + str.substr(0, 2) + '/' + str.substr(6, 4);
    } else {
      return null;
    }
  }
  search() {
    if (this.FROM_DATE !== undefined && this.TO_DATE !== undefined && this.FROM_DATE !== null && this.TO_DATE !== null && this.FROM_DATE !== '' && this.TO_DATE !== '') {
      this.loading = true;

      this.hisMessageService.getBM24NhatKyVanHanhByDate({ startTime: this.convertStringToDate(this.FROM_DATE), endTime: this.convertStringToDate(this.TO_DATE) })
        .subscribe(data => {
          console.log(data);
          this.listMain = data;
          this.loading = false;
        })
    }
    else {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn thời gian tìm kiếm' });
    }
  }

  getSuKien(idCa) {
    this.loadingSuKien = true;
    this.hisMessageService.getBM24SoNhatKyVanHanh({ ID_CA: idCa }).subscribe(
      data => {
        console.log(data);
        this.listMain = data;
        this.loadingSuKien = false;
      });
  }
  getTinhTrang(idCa) {
    this.loadingTinhTrang = true;
    this.hisMessageService.getBM24SoNhatKyVanHanhTinhTrang({ ID_CA: idCa }).subscribe(
      data => {
        console.log(data);
        this.listTinhTrang = data;
        this.loadingTinhTrang = false;
      });
  }
  getLuuY(idCa) {
    this.loadingLuuY = true;
    this.hisMessageService.getBM24SoNhatKyVanHanhLuuY({ ID_CA: idCa }).subscribe(
      data => {
        console.log(data);
        this.listLuuY = data;
        this.loadingLuuY = false;
      });
  }
  getNumber(str: string) {
    return Number(str);
  }

  openNew() {
    this.mainCurrent = {};
    this.contentTinhTrang = null;
    this.contentLuuY = null;
    this.idTinhTrang = null;
    this.idLuuY = null;
    this.submitted = false;
    this.dialog = true;
    this.isUpdate = false;
  }
  openNewCa() {
    // this.mainCaCurrent = {};
    //       this.submittedCa = false;
    //       this.dialogCa = true;
    //       this.isUpdateCa = false;
    this.hisMessageService.checkStatusCaBeforeCreateCa().subscribe((data) => {
      if (data !== null && data.length !== 0) {
        if (Number(data[0].STATUS_SIGNED) === 4) {
          this.mainCaCurrent = {};
          this.submittedCa = false;
          this.dialogCa = true;
          this.isUpdateCa = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Trạng thái ca trước chưa ký xong!', life: 3000 });
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Lỗi kết nối máy chủ', life: 3000 });
      }
    })

  }

  editItem(item: any) {

    this.mainCurrent = { ...item };
    
    this.mainCurrent.END_TIME = item.END_TIME === '0001-01-01T00:00:00' ? null : new Date(item.END_TIME);
    this.mainCurrent.START_TIME = new Date(item.START_TIME);
    this.selectedDonViQuanLy=this.mainCurrent.DONVI_QUANLY;
    this.selectedDonViQuanLyNgoai=this.mainCurrent.DONVI_XULY;
    this.isUpdate = true;
    this.dialog = true;

  }
  deleteItem(item: any) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa thông tin sự kiện ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hisMessageService.deleteSoNhatKyVanHanh(item).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.getSuKien(this.selectedCa);
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
    this.selectedDonViQuanLy = null;
    this.selectedDonViQuanLyNgoai = null;
    this.mainCurrent = {};
    this.contentTinhTrang = null;
    this.contentLuuY = null;
    this.idTinhTrang = null;
    this.idLuuY = null;
  }
  hideDialogCa() {
    this.dialogCa = false;
    this.isUpdate = false;
    this.submitted = false;
    this.selectedCaCurrent = null;
    this.mainCaCurrent = {};
  }
  close() {
    this.dialog = false;
    this.dialog = false;
    this.isUpdate = false;
    this.submitted = false;
    this.selectedDonViQuanLy = null;
    this.selectedDonViQuanLyNgoai = null;
    this.mainCurrent = {};
    this.contentTinhTrang = null;
    this.contentLuuY = null;
    this.idTinhTrang = null;
    this.idLuuY = null;
  };
  getNameTinh(str) {
    const tmp = this.tinhs.filter(i => i.MA_TINH === str)[0]
    if (tmp !== undefined && tmp !== null) {
      return tmp.TEN_TINH
    }
    return "";
  }
  getNameDonViQuanLy(str) {
    const tmp = this.tinhs.filter(i => i.MA_DVIQLY === str)[0]
    if (tmp !== undefined && tmp !== null) {
      return tmp.TEN_TINH
    }
    return "";
  }
  checkDouplicateStaffInCa(listGiao, listNhan) {
    try {
      let result = false;
      listGiao.forEach(itemGiao => {
        listNhan.forEach(itemNhan => {
          debugger;
          if (itemGiao.USER_ID === itemNhan.USER_ID) {
            result = true;
          }
        })
      });
      return result;

    } catch (ex) {
      return true;
    }
  }
  validateFormCa(item) {
    debugger;
    if (item.LIST_GIAO === undefined || item.LIST_NHAN === undefined || this.selectedCaCurrent === null || item.LIST_GIAO.length === 0 || item.LIST_NHAN.length === 0) {
      return 'Vui lòng nhập đủ thông tin'
    } else if (item.LIST_NHAN.length < 2) {
      return 'Vui lòng chọn đủ 2 người nhận ca';
    } else if (item.LIST_GIAO.length < 2) {
      return 'Vui lòng chọn đủ 2 người giao ca';
    } else if (this.checkDouplicateStaffInCa(item.LIST_GIAO, item.LIST_NHAN)) {
      return 'Vui lòng chọn đúng vai trò giao nhận ca! Mõi nhân viên chỉ có thể giao hoặc nhận!';
    } else {
      return 'SUCCESS';
    }
  }
  validateFormSuKien(item) {
    if (item === null && item === undefined) {
      return 'Lỗi'
    } else if (item.START_TIME === undefined || item.START_TIME === null) {
      return 'Vui lòng chọn thời gian bắt đầu và kết thúc!';
    } else if (item.DONVI_QUANLY === undefined || item.DONVI_QUANLY === null) {
      debugger;
      return 'Vui lòng chọn đơn vị quản lý';
    } else if (item.DONVI_XULY === undefined || item.DONVI_XULY === null) {
      return 'Vui lòng chọn đơn vị xử lý';
    } else if (item.LOAI_SUKIEN === undefined || item.LOAI_SUKIEN === null) {
      return 'Vui lòng chọn loại sự kiện';
    } else if (item.QUA_TRINH === undefined || item.QUA_TRINH === null) {
      return 'Vui lòng chọn quá trình';
    } else if (item.THOI_GIAN === undefined || item.THOI_GIAN === null) {
      return 'Vui lòng nhập thời gian';
    } else if (item.GHI_CHU === undefined || item.GHI_CHU === null) {
      return 'Vui lòng nhập ghi chú';
    } else if (item.TIEPNHAN_SCADA === undefined || item.TIEPNHAN_SCADA === null) {
      return 'Vui lòng nhập người tiếp nhận scada';
    } else if (item.TIEPNHAN_NGOAI === undefined || item.TIEPNHAN_NGOAI === null) {
      return 'Vui lòng chọn người tiếp nhận ngoài';
    } else if (item.SU_KIEN === undefined || item.SU_KIEN === null) {
      return 'Vui lòng nhập sự kiện';
    } else if (item.NGUYEN_NHAN === undefined || item.NGUYEN_NHAN === null) {
      return 'Vui lòng nhập nguyên nhân';
    } else {
      return 'SUCCESS';
    }
  }
  validateFormTinhTrang(item) {
    debugger;
    if (item === null && item === undefined) {
      return 'Lỗi'
    } else if (item.CONTENT === undefined || item.CONTENT === null) {
      return 'Vui lòng nhập nội dung';
    } else {
      return 'SUCCESS';
    }
  }
  saveItem() {
    //debugger;
    this.submitted = true;
    this.mainCurrent.DONVI_QUANLY=this.selectedDonViQuanLy;
    this.mainCurrent.DONVI_XULY=this.selectedDonViQuanLyNgoai;
    const check = this.validateFormSuKien(this.mainCurrent);
    debugger;
    if (check === 'SUCCESS') {
        this.hisMessageService.updateSoNhatKyVanHanh(this.mainCurrent).subscribe(result => {
          console.log(result);
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã thêm thành công', life: 3000 });
            this.search()
          }
        });
      this.hideDialog();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: check, life: 3000 });
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

  filterTinhDonViNgoai(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.tinhs.length; i++) {
      const tinh = this.tinhs[i];
      if (tinh.TEN_TINH.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tinh);
      }
    }
    this.filterTinhsDonViNgoai = filtered;
  }

  exportExcel() {
    const fileName = 'SoNhatKyVanHanh';
    const title = 'SỔ NHẬT KÝ VẬN HÀNH';
    let param = {
      listMain: this.listMain.map(item => {
        debugger;
        item.DONVI_XULY = this.getNameDonViQuanLy(item.DONVI_XULY);
        item.DONVI_QUANLY = this.getNameDonViQuanLy(item.DONVI_QUANLY);
        return item;
      }),
      listTinhTrang: this.listTinhTrang,
      listLuuY: this.listLuuY,
      // NGAY: this.convertStringToDateVN(this.selectedCaTypingCurrent.NGAY),
      NGAY: this.selectedCaTypingCurrent.NGAY,
      LABEL_TIME: this.selectedCaTypingCurrent.LABEL_TIME,
      LIST_GIAO: this.selectedCaTypingCurrent.LIST_GIAO,
      LIST_NHAN: this.selectedCaTypingCurrent.LIST_NHAN,
      ID: this.selectedCaTypingCurrent ? this.selectedCaTypingCurrent.ID : null

    };
    console.log(param);

    let workbook = this.reportService.showReportBM24(
      param,
      '23/02/2022',
      fileName,
      title,
      'NGAY'
    );
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + '.xlsx');
    });
  }

  exportPDF() {
    let param = {
      listSuKien: this.listMain.map(item => {
        item.DONVI_XULY = this.getNameDonViQuanLy(item.DONVI_XULY);
        item.DONVI_QUANLY = this.getNameDonViQuanLy(item.DONVI_QUANLY);
        return item;
      }),
      listTinhTrang: this.listTinhTrang,
      listLuuY: this.listLuuY,
      // NGAY: this.convertStringToDateVN(this.selectedCaTypingCurrent.NGAY),
      NGAY: this.selectedCaTypingCurrent.NGAY,
      LABEL_TIME: this.selectedCaTypingCurrent.LABEL_TIME,
      LIST_GIAO: this.selectedCaTypingCurrent.LIST_GIAO,
      LIST_NHAN: this.selectedCaTypingCurrent.LIST_NHAN,
      ID: this.selectedCaTypingCurrent ? this.selectedCaTypingCurrent.ID : null

    };
    fetch(`${this.hisMessageService.getScadaURL()}HISMessage/convertHtmlToPdf`, {
      // fetch(`${this.hisMessageService.getScadaURL()}EVNCA/SignLocalCA`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(param)
    })
      .then(response => {
        console.log(response);
        return response.blob();
      })
      .then(blob => {

        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "report.pdf";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();

        //afterwards we remove the element again         
      })
      .catch((error) => {
        console.log(error);
      });
    console.log({ listSuKien: this.listMain, listTinhTrang: this.listTinhTrang, listLuuY: this.listLuuY, NGAY: this.selectedCaTypingCurrent.NGAY, LABEL_TIME: this.selectedCaTypingCurrent.LABEL_TIME });

    // this.hisMessageService.convertHtmlToPdf({ listSuKien: this.listMain, listTinhTrang: this.listTinhTrang, listLuuY: this.listLuuY,NGAY:this.selectedCaTypingCurrent.NGAY,LABEL_TIME:this.selectedCaTypingCurrent.LABEL_TIME}).subscribe(data => {

    // });

    // pdf.setFont('fontTimesNewRoman');

    // pdf.html(elementHTML, {

    //   callback: function (pdf) {

    //     // pdf.text("Đơn Vị Ngoài",20,20);
    //     // pdf.setFont("fontTimesNewRoman");
    //     // // pdf.setFont("ConsolasHex", "Bold");
    //     // pdf.setFontSize(12);
    //     pdf.save('export.pdf');
    //   },

    //   //margin: [60, 60, 60, 60],
    //   // x: 32,
    //   // y: 32,
    // });

    // Save the PDF
    // doc.save('sample-document.pdf');
  }

  encodedStr(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
      return '&#' + i.charCodeAt(0) + ';';
    })
  };
  checkNumber(str) {
    return Number(str);
  }
  exportExcelOld() {
    debugger;
    let table = `<table cellspacing="0" border="0" style="width:1300px">
    <tr>
      <td colspan=17 height="33" align="center" valign=middle><b><font face="Times New Roman" size=5 color="#000000">S&#7892; NH&#7852;T K&Yacute; V&#7852;N H&Agrave;NH </font></b></td>
    </tr>
    <tr>
      <td colspan=5 height="26" align="left" height="25" align="left" valign=middle sdnum="1033;1033;M/D/YYYY"><i><font face="Times New Roman" size=4 color="#000000">&#272;&#7871;n  ${this.selectedCaTypingCurrent.LABEL_TIME.substr(0, 2)} gi&#7901; ${this.selectedCaTypingCurrent.LABEL_TIME.substr(3, 2)} ng&agrave;y  ${this.selectedCaTypingCurrent.NGAY.split("/")[1]} th&aacute;ng ${this.selectedCaTypingCurrent.NGAY.split("/")[0]} n&#259;m ${this.selectedCaTypingCurrent.NGAY.split("/")[2].substr(0, 4)}</font></i></td>
      
      <td colspan=4 align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">Nh&acirc;n vi&ecirc;n tr&#7921;c ca :</font></i></td>`;
    // <<<<<<< .mine
    //       if(this.selectedCaTypingCurrent.LIST_GIAO.split ("; ").length===1){
    //         table += `<td colspan=8 align="left" valign=middle><i><font face="Times New Roman" size=4 color="#000000">1. ${this.encodedStr(this.selectedCaTypingCurrent.LIST_GIAO.split ("; ")[0])}</font></i></td>
    // ||||||| .r136
    //       if(this.selectedCaTypingCurrent.LIST_GIAO.split("; ").length===1){
    //         table += `<td colspan=8 align="left" valign=middle><i><font face="Times New Roman" size=4 color="#000000">1. ${this.selectedCaTypingCurrent.LIST_GIAO.split("; ")[0]}</font></i></td>
    // =======
    if (this.selectedCaTypingCurrent.LIST_GIAO.split("; ").length === 1) {
      table += `<td colspan=8 align="left" valign=middle><i><font face="Times New Roman" size=4 color="#000000">1. ${this.selectedCaTypingCurrent.LIST_GIAO.split("; ")[0]}</font></i></td></tr>`;
      //       }else if (this.selectedCaTypingCurrent.LIST_GIAO.split ("; ").length>=2 ){
      //         table+=` <td colspan=4 align="left" valign=middle><i><font face="Times New Roman" size=4 color="#000000">1. ${this.encodedStr(this.selectedCaTypingCurrent.LIST_GIAO.split ("; ")[0])}</font></i></td>
      //         <td colspan=4 align="left" valign=top><i><font face="Times New Roman" size=4 color="#000000">2. ${this.encodedStr(this.selectedCaTypingCurrent.LIST_GIAO.split ("; ")[1])}</font></i></td>

      //       </tr>`;        
      //       }else if (this.selectedCaTypingCurrent.LIST_GIAO.split("; ").length>=2 ){
      //         table+=` <td colspan=4 align="left" valign=middle><i><font face="Times New Roman" size=4 color="#000000">1. ${this.selectedCaTypingCurrent.LIST_GIAO.split("; ")[0]}</font></i></td>
      //         <td colspan=4 align="left" valign=top><i><font face="Times New Roman" size=4 color="#000000">2. ${this.selectedCaTypingCurrent.LIST_GIAO.split("; ")[1]}</font></i></td>
      // =======
      //       </tr>`;
    } else if (this.selectedCaTypingCurrent.LIST_GIAO.split("; ").length >= 2) {
      table += ` <td colspan=4 align="left" valign=middle><i><font face="Times New Roman" size=4 color="#000000">1. ${this.selectedCaTypingCurrent.LIST_GIAO.split("; ")[0]}</font></i></td>
        <td colspan=4 align="left" valign=top><i><font face="Times New Roman" size=4 color="#000000">2. ${this.selectedCaTypingCurrent.LIST_GIAO.split("; ")[1]}</font></i></td>
      </tr>`;
    } else {

    }
    table += ` <tr>
      <td colspan=17 height="26" align="left" valign=middle sdnum="1033;1033;M/D/YYYY"><i><font face="Times New Roman" size=4 color="#000000">&#272;&#7871;&#110; ${this.selectedCaTypingCurrent.LABEL_TIME.substr(12, 2)} gi&#7901; ${this.selectedCaTypingCurrent.LABEL_TIME.substr(15, 2)} ng&agrave;y ${this.selectedCaTypingCurrent.NGAY.split("/")[1]} th&aacute;ng ${this.selectedCaTypingCurrent.NGAY.split("/")[0]} n&#259;m ${this.selectedCaTypingCurrent.NGAY.split("/")[2].substr(0, 4)}</font></i></td>
    </tr>
    <tr>
      <td style="width: 120px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" colspan=2 height="51" align="center" valign=middle sdnum="1033;1033;M/D/YYYY"><b><font face="Times New Roman" size=4 color="#000000">Ng&agrave;y, Gi&#7901;</font></b></td>
      <td style="width: 180px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=3 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">S&#7920; KI&#7878;N</font></b></td>
      <td style="width: 180px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=3 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">NGUY&Ecirc;N NH&Acirc;N</font></b></td>
      <td style="width: 120px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=3 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">&#272;&#416;N V&#7882; QU&#7842;N L&Yacute;</font></b></td>
      <td style="width: 120px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" colspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">TI&#7870;P NH&#7852;N<br>TH&Ocirc;NG TIN</font></b></td>
      <td style="width: 300px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" colspan=5 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">PH&Acirc;N LO&#7840;I S&#7920; KI&#7878;N</font></b></td>
      <td style="width: 120px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" colspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">TR&Aacute;CH NHI&#7878;M<br>X&#7916; L&Yacute;</font></b></td>
      <td style="width: 120px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" colspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">K&#7870;T QU&#7842;<br>X&#7916; L&Yacute;</font></b></td>
      <td style="width: 120px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=3 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">GHI CH&Uacute;</font></b></td>
    </tr>
    <tr>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=2 height="46" align="center" valign=middle sdnum="1033;1033;M/D/YYYY"><b><font face="Times New Roman" size=4 color="#000000">B&#7855;t &#273;&#7847;u</font></b></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">K&#7871;t th&uacute;c</font></b></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">&#272;&#417;n v&#7883; ngo&agrave;i</font></b></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">TT&#272;H SCADA</font></b></td>
      <td style="width: 120px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" colspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">HT SCADA</font></b></td>
      <td style="width: 120px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" colspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">Cung c&#7845;p &#273;i&#7879;n</font></b></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">C&ocirc;ng t&aacute;c</font></b></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000" rowspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">TT&#272;H SCADA</font></b></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000" rowspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">&#272;&#417;n v&#7883; ngo&agrave;i</font></b></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">&#272;&atilde; x&#7917; l&yacute;</font></b></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=2 align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">T&#7891;n t&#7841;i</font></b></td>
      </tr>
    <tr>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">S&#7921; c&#7889; </font></b></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">HTBT</font></b></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">S&#7921; c&#7889;</font></b></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000">HTBT</font></b></td>
      </tr>
    <tr>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" height="25" align="center" valign=middle sdnum="1033;1033;M/D/YYYY"><i><font face="Times New Roman" size=4 color="#000000">1</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">2</font></i></td>
      <td style="width:180px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">3</font></i></td>
      <td style="width:180px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">4</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">5</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">6</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">7</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">8</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">9</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">10</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">11</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">12</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">13</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">14</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">15</font></i></td>
      <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">16</font></i></td>
      <td style="width: 120px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><i><font face="Times New Roman" size=4 color="#000000">17</font></i></td>
    </tr>
    <tr>
      <td style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" colspan=17 height="25" align="left" valign=middle sdnum="1033;1033;M/D/YYYY"><b><font face="Times New Roman" size=4 color="#000000">1. S&#7921; ki&#7879;n trong ca tr&#7921;c:</font></b></td>
      </tr>`
    if (this.listMain !== null && this.listMain !== undefined) {
      this.listMain.map(item => {
        table += `
          <tr>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" height="75" align="center" valign=middle sdval="43957.9548611111" sdnum="1033;1033;M/D/YYYY H:MM"><font face="Times New Roman" size=4>${item.START_TIME}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle sdval="43978.6020833333" sdnum="1033;1033;M/D/YYYY H:MM"><font face="Times New Roman" size=4>${item.END_TIME}</font></td>
            <td style="width: 180px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="left" valign=middle><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(item.SU_KIEN)}</font></td>
            <td style="width: 180px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000;" align="left" valign=middle><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(item.NGUYEN_NHAN)}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(this.getNameDonViQuanLy(item.DONVI_QUANLY))}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(item.TIEPNHAN_NGOAI)}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(item.TIEPNHAN_SCADA)}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><font face="Times New Roman" size=4 color="#000000">${item.LOAI_SUKIEN === 'HT_SCADA_SU_CO' ? 'x' : ''}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><font face="Times New Roman" size=4 color="#000000">${item.LOAI_SUKIEN === 'HT_SCADA_HTBT' ? 'x' : ''}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><font face="Times New Roman" size=4 color="#000000">${item.LOAI_SUKIEN === 'CUNG_CAP_DIEN_SU_CO' ? 'x' : ''}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><font face="Times New Roman" size=4 color="#000000">${item.LOAI_SUKIEN === 'CUNG_CAP_DIEN_HTBT' ? 'x' : ''}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><font face="Times New Roman" size=4 color="#000000">${item.LOAI_SUKIEN === 'CONG_TAC' ? 'x' : ''}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(item.TNXL_SCADA)}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(this.getNameDonViQuanLy(item.TNXL_NGOAI))}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><font face="Times New Roman" size=4 color="#000000">${item.KQ_DAXULY === '1' ? 'x' : ''}</font></td>
            <td style="width: 60px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle><font face="Times New Roman" size=4 color="#000000">${item.KQ_DAXULY === '0' ? 'x' : ''}</font></td>
            <td style="width: 120px;border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" align="center" valign=middle bgcolor="#FFFFFF"><font face="Times New Roman" size=4 color="#000000">${item.GHI_CHU}</font></td>
          </tr>`;
      })
    }

    table += `
    <tr>
      <td colspan=17 style="border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000; border-right: 1px solid #000000" height="25" align="left" valign=middle sdnum="1033;1033;M/D/YYYY"><b><font face="Times New Roman" size=4 color="#000000">2. T&igrave;nh tr&#7841;ng v&#7853;n h&agrave;nh c&aacute;c thi&#7871;t b&#7883; trong MCC, BCC:</font></b></td>
      </tr>`;

    if (this.listTinhTrang !== null && this.listTinhTrang !== undefined) {
      this.listTinhTrang.map(item => {
        table += `
        <tr>
          <td colspan=17 style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" height="28" align="left" valign=middle sdnum="1033;1033;M/D/YYYY"><font face="Times New Roman" size=4 color="#000000">- ${item.CONTENT}</font></td>
        </tr>`;
      })
    }

    table += `
      <tr>
      <td colspan=17 style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" height="25" align="left" valign=middle sdnum="1033;1033;M/D/YYYY"><b><font face="Times New Roman" size=4 color="#000000">3. C&aacute;c v&#7845;n &#273;&#7873; l&#432;u &yacute; trong phi&ecirc;n giao-nh&#7853;n ca: </font></b></td>
    </tr>
   `;
    if (this.listLuuY !== null && this.listLuuY !== undefined) {
      this.listLuuY.map(item => {
        table += `
        <tr>
          <td colspan=17 style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000" height="28" align="left" valign=middle sdnum="1033;1033;M/D/YYYY"><font face="Times New Roman" size=4 color="#000000">- ${item.CONTENT}</font></td>
        </tr>`;
      })

    }

    table += `
    <tr>
      <td colspan=17 height="25" align="left" valign=middle><font face="Times New Roman" size=4 color="#FF0000"><br></font></td>
    </tr>
    <tr>
      <td colspan=7 height="25" align="center" valign=middle><i><font face="Times New Roman" size=4> Giao ca l&uacute;c ${this.selectedCaTypingCurrent.LABEL_TIME.substr(12, 2)} gi&#7901; ${this.selectedCaTypingCurrent.LABEL_TIME.substr(15, 2)} ng&agrave;y ${this.selectedCaTypingCurrent.NGAY.split("/")[1]} th&aacute;ng ${this.selectedCaTypingCurrent.NGAY.split("/")[0]} n&#259;m ${this.selectedCaTypingCurrent.NGAY.split("/")[2].substr(0, 4)}</font></i></td>
      <td colspan=13 align="center" valign=middle></td>
    </tr>
    <tr>
      <td colspan=7 height="25" align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000"><b><font face="Times New Roman" size=4 color="#000000">NG&#431;&#7900;I GIAO CA</font></b></td>
      <td colspan=3></td>
      <td colspan=7 height="25" align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000"><b><font face="Times New Roman" size=4 color="#000000">NG&#431;&#7900;I NH&#7852;N CA</font></b></td>
    </tr>
    <tr>
      <td colspan=17 height="25" align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000"><br></font></b></td>
    </tr>
	<tr>
      <td colspan=17 height="25" align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000"><br></font></b></td>
    </tr>
	<tr>
      <td colspan=17 height="25" align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000"><br></font></b></td>
    </tr>    
    <tr>`;

    // 		if(this.selectedCaTypingCurrent.LIST_GIAO.split ("; ").length===1||this.selectedCaTypingCurrent.LIST_NHAN.split ("; ").length===1){
    //       table += `<td colspan = 13 align = 'center' valign = middle ></ td ></tr><tr><td colspan = 7 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><b ><font face = 'Times New Roman' size = 4 color = '#000000' >${this.encodedStr(this.selectedCaTypingCurrent.LIST_GIAO.split ("; ")[0])}</font></b></td><td colspan = 3 ></ td ><td colspan = 7 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><b ><font face = 'Times New Roman' size = 4 color = '#000000' >${this.encodedStr(this.selectedCaTypingCurrent.LIST_NHAN.split ("; ")[0])}</font></b></td></tr><tr><td colspan = 17 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><br ></ font ></ b ></ td ></tr><tr><td colspan = 17 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><br ></ font ></ b ></ td ></tr><tr><td colspan = 17 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><br ></ font ></ b ></ td ></tr><tr>`;        
    //     }else if (this.selectedCaTypingCurrent.LIST_GIAO.split ("; ").length>=2 && this.selectedCaTypingCurrent.LIST_NHAN.split ("; ").length>=2){
    //       table+=` <td style="width:300px" colspan=3 height="25" align="right" valign=middle><b><font face="Times New Roman" size=4 color="#000000"><b><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(this.selectedCaTypingCurrent.LIST_GIAO.split ("; ")[0])}</font></b></td>

    // 		if(this.selectedCaTypingCurrent.LIST_GIAO.split("; ").length===1||this.selectedCaTypingCurrent.LIST_NHAN.split("; ").length===1){
    //       table += `<td colspan = 13 align = 'center' valign = middle ></ td ></tr><tr><td colspan = 7 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><b ><font face = 'Times New Roman' size = 4 color = '#000000' >${this.encodedStr(this.selectedCaTypingCurrent.LIST_GIAO.split("; ")[0])}</font></b></td><td colspan = 3 ></ td ><td colspan = 7 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><b ><font face = 'Times New Roman' size = 4 color = '#000000' >${this.encodedStr(this.selectedCaTypingCurrent.LIST_NHAN.split("; ")[0])}</font></b></td></tr><tr><td colspan = 17 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><br ></ font ></ b ></ td ></tr><tr><td colspan = 17 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><br ></ font ></ b ></ td ></tr><tr><td colspan = 17 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><br ></ font ></ b ></ td ></tr><tr>`;        
    //     }else if (this.selectedCaTypingCurrent.LIST_GIAO.split("; ").length>=2 && this.selectedCaTypingCurrent.LIST_NHAN.split("; ").length>=2){
    //       table+=` <td style="width:300px" colspan=3 height="25" align="right" valign=middle><b><font face="Times New Roman" size=4 color="#000000"><b><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(this.selectedCaTypingCurrent.LIST_GIAO.split("; ")[0])}</font></b></td>
    // =======
    if (this.selectedCaTypingCurrent.LIST_GIAO.split("; ").length === 1 || this.selectedCaTypingCurrent.LIST_NHAN.split("; ").length === 1) {
      table += `<td colspan = 13 align = 'center' valign = middle ></ td ></tr><tr><td colspan = 7 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><b ><font face = 'Times New Roman' size = 4 color = '#000000' >${this.encodedStr(this.selectedCaTypingCurrent.LIST_GIAO.split("; ")[0])}</font></b></td><td colspan = 3 ></ td ><td colspan = 7 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><b ><font face = 'Times New Roman' size = 4 color = '#000000' >${this.encodedStr(this.selectedCaTypingCurrent.LIST_NHAN.split("; ")[0])}</font></b></td></tr><tr><td colspan = 17 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><br ></ font ></ b ></ td ></tr><tr><td colspan = 17 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><br ></ font ></ b ></ td ></tr><tr><td colspan = 17 height = '25' align = 'center' valign = middle ><b ><font face = 'Times New Roman' size = 4 color = '#000000' ><br ></ font ></ b ></ td ></tr><tr>`;
    } else if (this.selectedCaTypingCurrent.LIST_GIAO.split("; ").length >= 2 && this.selectedCaTypingCurrent.LIST_NHAN.split("; ").length >= 2) {
      table += ` <td style="width:300px" colspan=3 height="25" align="right" valign=middle><b><font face="Times New Roman" size=4 color="#000000"><b><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(this.selectedCaTypingCurrent.LIST_GIAO.split("; ")[0])}</font></b></td>

      <td style="width:60px"></td>
      <td style="width:180px" colspan=3 height="25" align="left" valign=middle><b><font face="Times New Roman" size=4 color="#000000"><b><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(this.selectedCaTypingCurrent.LIST_GIAO.split("; ")[1])}</font></b></td>
      <td style="width:180px" colspan=3></td>
      <td style="width:180px" colspan=3 height="25" align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000"><b><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(this.selectedCaTypingCurrent.LIST_NHAN.split("; ")[0])}</b></td>
      <td style="width:60px"></td>
      <td style="width:120px" colspan=3 height="25" align="center" valign=middle><b><font face="Times New Roman" size=4 color="#000000"><b><font face="Times New Roman" size=4 color="#000000">${this.encodedStr(this.selectedCaTypingCurrent.LIST_NHAN.split("; ")[1])}</b></td>
    </tr>`;
    } else {

    }

    table += `
    <tr>
      <td colspan=17 height="25" align="center" valign=middle sdnum="1033;1033;M/D/YYYY"><b><font face="Times New Roman" size=4 color="#000000"><br></font></b></td>
    </tr>
  </table>
  `;


    this.saveAsExcelFile(table, "reportBM24");
    // this.saveAsExcelFile(table.replace(/<th/g, `<th style='border: 0.05em solid black; vertical-align: middle;'`).replace(/<td/g, `<td style='border: 0.05em solid black; vertical-align: middle;'`), "reportBM24");

    // import("xlsx").then(xlsx => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.listMain);
    //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   this.saveAsExcelFile(excelBuffer, "reportBM12");
    // });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {

    let EXCEL_TYPE = 'application/vnd.ms-excel;charset=UTF-8';
    let EXCEL_EXTENSION = '.xls';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }

  signEVNCA(loaiKy) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn ký số?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        debugger;
        this.loadingModal = true;
        if (loaiKy == "NHAN" && Number(this.selectedCaTypingCurrent.STATUS_SIGNED) < 2) {
          this.messageService.add({ severity: 'error', summary: 'Cảnh báo', detail: "Chưa ký số giao ca" });
          return;
        }
        var param = {
          listSuKien: this.listMain !== null && this.listMain.length !== 0 ? this.listMain.map(item => {
            debugger;
            item.DONVI_XULY = this.getNameDonViQuanLy(item.DONVI_XULY);
            item.DONVI_QUANLY = this.getNameDonViQuanLy(item.DONVI_QUANLY);
            return item;
          }) : null,
          listTinhTrang: this.listTinhTrang,
          listLuuY: this.listLuuY,
          NGAY: this.selectedCaTypingCurrent.NGAY,
          LABEL_TIME: this.selectedCaTypingCurrent.LABEL_TIME,
          LIST_GIAO: this.selectedCaTypingCurrent.LIST_GIAO,
          LIST_NHAN: this.selectedCaTypingCurrent.LIST_NHAN,
          ID: this.selectedCaTypingCurrent ? this.selectedCaTypingCurrent.ID : null,
          USER_ID: this.login.USER_ID,
          USER_ID_CA: this.login.USER_ID_CA,
          TYPE_SIGNED: loaiKy,
          FULL_NAME: this.login.FULL_NAME
        };
        fetch(`${this.hisMessageService.getScadaURL()}EVNCA/SignLocalCA`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(param)
        })
          .then(response => response.json())
          .then(res => {
            if (res === 'SUCCESS') {
              if (loaiKy == "GIAO") {
                this.submitedGiao = true;
              } else if (loaiKy == "NHAN") {
                this.submitedNhan = true;
              }
              this.loadingModal = false;
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: "Ký số thành công" });
            } else {
              if (loaiKy == "GIAO") {
                this.submitedGiao = true;
              } else if (loaiKy == "NHAN") {
                this.submitedNhan = false;
              }
              this.loadingModal = false;
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: res });
            }

          })
          .catch((error) => {
            console.log(error);
            this.loadingModal = false;
          });
      }
    });
  }

  exportPDF_Signed() {
    var param = {
      ID: this.selectedCaTypingCurrent ? this.selectedCaTypingCurrent.ID : null
    };
    fetch(`${this.hisMessageService.getScadaURL()}HISMessage/exportPDF_Signed`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(param)
    })
      .then(response => {
        console.log(response);
        return response.blob();
      })
      .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "SoNKVH_Signed.pdf";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();
        //afterwards we remove the element again         
      })
      .catch((error) => {
        console.log(error);
      });
  }
  hideVisibleView() {
    this.selectedCaTypingCurrent = null;
  }
  checkVisibleView() {
    let result = this.selectedCaTypingCurrent;
    return result;
  }
  checkVisibleThem() {
    let result = this.selectedCaTypingCurrent && this.checkNumber(this.selectedCaTypingCurrent.STATUS_SIGNED);
    return !result;
  }
  checkVisibleKyGiao() {
    let res = !this.submitedGiao && this.listMain && this.listMain.length > 0 && this.selectedCaTypingCurrent && this.login && this.selectedCaTypingCurrent.LIST_GIAO_ID.includes(this.login.USER_ID) && !this.selectedCaTypingCurrent.USERS_SIGNED_FROM.includes(this.login.USER_ID);
    return res;
  }

  checkVisibleKyNhan() {
    let res = !this.submitedNhan && this.listMain && this.listMain.length > 0 && this.selectedCaTypingCurrent && this.login && this.selectedCaTypingCurrent.LIST_NHAN_ID.includes(this.login.USER_ID) && !this.selectedCaTypingCurrent.USERS_SIGNED_TO.includes(this.login.USER_ID) && Number(this.selectedCaTypingCurrent.STATUS_SIGNED) >= 2;
    return res;
  }

  checkVisibleDownloadSigned() {
    let res = this.submitedGiao || this.submitedNhan || (this.listMain && this.listMain.length > 0 && this.selectedCaTypingCurrent && this.selectedCaTypingCurrent.STATUS_SIGNED);
    return res;
  }
}

