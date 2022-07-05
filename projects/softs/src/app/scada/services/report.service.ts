import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  fontTitle: any;
  fontHeader: any;
  fontItalic: any;
  fontText: any;

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.fontTitle = { name: 'Times New Roman', size: 20, bold: true };
    this.fontHeader = { name: 'Times New Roman', size: 14, bold: true };
    this.fontItalic = { name: 'Times New Roman', size: 14, italic: true };
    this.fontText = { name: 'Times New Roman', size: 13 };
  }

  addDefaultOrg(worksheet, colNumber, title, dateStart, dateEnd) {
    //CHXHCNVN
    worksheet.addRow([]).font = this.fontHeader;
    worksheet.lastRow.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    }
    let colNumberFloor = Math.floor(colNumber / 2);
    let posCHXHCNVN = colNumber - colNumberFloor > 4 ? colNumber - 3 : colNumberFloor + 1;
    worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, colNumberFloor > 4 ? 4 : colNumberFloor);
    worksheet.mergeCells(worksheet.lastRow.number, posCHXHCNVN, worksheet.lastRow.number, colNumber);
    worksheet.lastRow.getCell(1).value = 'TỔNG CÔNG TY ĐIỆN LỰC MIỀN NAM';
    worksheet.lastRow.getCell(posCHXHCNVN).value = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
    worksheet.addRow([]).font = this.fontHeader;
    worksheet.lastRow.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    }
    worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, colNumberFloor > 4 ? 4 : colNumberFloor);
    worksheet.mergeCells(worksheet.lastRow.number, posCHXHCNVN, worksheet.lastRow.number, colNumber);
    worksheet.lastRow.getCell(1).value = 'TRUNG TÂM ĐIỀU HÀNH SCADA';
    worksheet.lastRow.getCell(posCHXHCNVN).value = 'ĐỘC LẬP - TỰ DO - HẠNH PHÚC';
    worksheet.addRow([]);

    let titleRow = worksheet.addRow([title]);
    titleRow.font = this.fontTitle;
    titleRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, colNumber);
    //ngay/thang
    let strNgay;
    if (dateEnd == 'NGAY') {
      strNgay = 'Ngày ' + dateStart;
    } else if (dateEnd) {
      strNgay = 'Từ ngày ' + dateStart + ' đến ngày ' + dateEnd;
    }
    else {
      strNgay = 'Tháng ' + dateStart;
    }
    worksheet.addRow([strNgay]).font = this.fontItalic;
    worksheet.lastRow.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    }
    worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, colNumber);
    worksheet.addRow([]);
    return worksheet;
  }

  addHeader(worksheet, headerRow, header) {
    let j = 1;
    for (let i = 0; i < header.length; i++) {
      const element = header[i];
      let cell = headerRow.getCell(i + j);
      if (element.text || element.header) {
        cell.font = this.fontHeader;
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.value = element.text ? element.text : element.header;
        if (element.rowspan) {
          worksheet.mergeCells(Number(cell.row), Number(cell.col), Number(cell.row) + element.rowspan - 1, Number(cell.col));
        }
        if (element.colspan) {
          worksheet.mergeCells(Number(cell.row), Number(cell.col), Number(cell.row), Number(cell.col) + element.colspan - 1);
          j += element.colspan - 1;
        }
      }
    }
    return worksheet;
  }
  addHeaderNoBold(worksheet, headerRow, styleBold, header) {
    let j = 1;
    for (let i = 0; i < header.length; i++) {
      const element = header[i];
      let cell = headerRow.getCell(i + j);
      if (element.text || element.header) {
        if (styleBold === true) {
          cell.font = this.fontHeader;
        } else {
          cell.font = this.fontText;

        }
        cell.alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true
        }
        // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.value = element.text ? element.text : element.header;
        if (element.rowspan) {
          worksheet.mergeCells(Number(cell.row), Number(cell.col), Number(cell.row) + element.rowspan - 1, Number(cell.col));
        }
        if (element.colspan) {
          worksheet.mergeCells(Number(cell.row), Number(cell.col), Number(cell.row), Number(cell.col) + element.colspan - 1);
          j += element.colspan - 1;
        }
      }
    }
    return worksheet;
  }
  addHeaderHorizontalLeft(worksheet, headerRow, header) {
    let j = 1;
    for (let i = 0; i < header.length; i++) {
      const element = header[i];
      let cell = headerRow.getCell(i + j);
      if (element.text || element.header) {
        cell.font = this.fontHeader;
        cell.alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.value = element.text ? element.text : element.header;
        if (element.rowspan) {
          worksheet.mergeCells(Number(cell.row), Number(cell.col), Number(cell.row) + element.rowspan - 1, Number(cell.col));
        }
        if (element.colspan) {
          worksheet.mergeCells(Number(cell.row), Number(cell.col), Number(cell.row), Number(cell.col) + element.colspan - 1);
          j += element.colspan - 1;
        }
      }
    }
    return worksheet;
  }

  showReportBM01(data: any[], dateStart: String, dateEnd: String, fileName) {
    const title = 'BÁO CÁO SỰ CỐ GÂY NGỪNG, GIẢM CUNG CẤP ĐIỆN CHO KHÁCH HÀNG';
    let colNumber = 13;
    const header = [
      { index: 'A', text: "STT", rowspan: 2 },
      { index: 'B', text: "Tên đường dây, trạm biến áp bị sự cố", rowspan: 2 },
      { index: 'C', text: "Đơn vị quản lý vận hành", rowspan: 2 },
      { index: 'D', text: "Thời gian sự cố", colspan: 2 },
      { index: 'F', text: "Diễn biến sự cố", rowspan: 2 },
      { index: 'G', text: "Nguyên nhân", rowspan: 2 },
      { index: 'H', text: "Khu vực bị ngừng, giảm cấp điện", rowspan: 2 },
      { index: 'I', text: "Số KH bị ngừng, giảm cung cấp điện", rowspan: 2 },
      { index: 'J', text: "Thời gian gián đoạn cấp điện (phút), Nếu có chuyển tải thì phân ra nhiều khoảng thời gian khác nhau", rowspan: 2 },
      { index: 'K', text: "CS bị ngừng giảm (MW)", rowspan: 2 },
      { index: 'L', text: "Ước SL điện không cung cấp được (kWh)", rowspan: 2 },
      { index: 'M', text: "Số vụ trong năm (tuyến ĐD)", rowspan: 2 }
    ];
    const header2 = [
      {},
      {},
      {},
      { index: 'D', text: "Bắt đầu" },
      { index: 'E', text: "Kết thúc" }
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, dateEnd);

    let headerRow = worksheet.addRow(header);
    worksheet = this.addHeader(worksheet, headerRow, header);
    let headerRow2 = worksheet.getRow(worksheet.lastRow.number);
    worksheet = this.addHeader(worksheet, headerRow2, header2);

    data.forEach((element, index) => {
      let arrCell = [
        element.STT,
        element.TENTHIETBI,
        element.TENDV,
        this.datePipe.transform(element.BATDAU, 'dd/MM/yyyy HH:mm'),
        this.datePipe.transform(element.KETTHUC, 'dd/MM/yyyy HH:mm'),
        element.DIENBIEN,
        element.NGUYENNHAN,
        element.KHU_VUC_MD,
        element.SO_KH_MD,
        element.TGIAN,
        element.P_TAI,
        element.UOC_SL_NG,
        element.SL
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.getColumn('A').width = 10;
    worksheet.getColumn('B').width = 50;
    worksheet.getColumn('C').width = 40;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 40;
    worksheet.getColumn('G').width = 40;
    worksheet.getColumn('H').width = 40;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 20;
    worksheet.getColumn('L').width = 20;
    worksheet.getColumn('M').width = 20;
    return workbook;
  }

  showReportBM02(data: any[], dateStart: String, dateEnd: String) {
    const title = 'THỐNG KÊ SỰ CỐ CUNG CẤP ĐIỆN TỪ HỆ THỐNG SCADA';
    let colNumber = 9;
    const header = [
      { index: 'A', text: "STT", rowspan: 2 },
      { index: 'B', text: "Đơn vị quản lý vận hành", rowspan: 2 },
      { index: 'C', text: "Trạm biến áp (B1)", rowspan: 2 },
      { index: 'D', text: "Cấp điện áp (B2)", rowspan: 2 },
      { index: 'E', text: "Tên đường dây (B3)", rowspan: 2 },
      { index: 'F', text: "Thời gian sự cố", colspan: 2 },
      { index: 'H', text: "Tín hiệu SCADA", rowspan: 2 },
      { index: 'I', text: "Ghi chú", rowspan: 2 }
    ];
    const header2 = [
      {},
      {},
      {},
      {},
      {},
      { index: 'F', text: "Bắt đầu" },
      { index: 'G', text: "Kết thúc" }
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, dateEnd);

    let headerRow = worksheet.addRow(header);
    worksheet = this.addHeader(worksheet, headerRow, header);
    let headerRow2 = worksheet.getRow(worksheet.lastRow.number);
    worksheet = this.addHeader(worksheet, headerRow2, header2);

    data.forEach((element, index) => {
      let arrCell = [
        element.STT,
        element.TEN_DVI,
        element.B1,
        element.B2,
        element.B3,
        this.datePipe.transform(element.TIME_OPEN, 'dd/MM/yyyy HH:mm'),
        this.datePipe.transform(element.TIME_CLOSE, 'dd/MM/yyyy HH:mm'),
        element.ELEMENT,
        element.GHI_CHU
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.getColumn('A').width = 10;
    worksheet.getColumn('B').width = 50;
    worksheet.getColumn('C').width = 30;
    worksheet.getColumn('D').width = 30;
    worksheet.getColumn('E').width = 30;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 40;
    worksheet.getColumn('I').width = 20;
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    });
  }

  showReportBM03(data: any[], dateStart: String) {
    const title = 'BẢNG TỔNG HỢP THỰC HIỆN SỰ CỐ VÀ SUẤT SỰ CỐ';
    let colNumber = 10;
    const header = [
      { index: 'A', text: "Năm", rowspan: 3 },
      { index: 'B', text: "Sự cố 110kV", colspan: 4 },
      { index: 'F', text: "Sự cố 22kV", colspan: 4 },
      { index: 'J', text: "Tổng", rowspan: 3 }
    ];
    const header2 = [
      {},
      { index: 'B', text: "Đường dây", colspan: 2 },
      { index: 'D', text: "Trạm biến áp", rowspan: 2 },
      { index: 'E', text: "Tổng", rowspan: 2 },
      { index: 'H', text: "Trạm biến áp", rowspan: 2 },
      { index: 'I', text: "Tổng", rowspan: 2 }
    ];
    const header3 = [
      {},
      { index: 'B', text: "Thoáng qua" },
      { index: 'C', text: "Kéo dài" },
      { index: 'F', text: "Thoáng qua" },
      { index: 'G', text: "Kéo dài" },
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, null);

    let headerRow = worksheet.addRow(header);
    worksheet = this.addHeader(worksheet, headerRow, header);
    let headerRow2 = worksheet.getRow(worksheet.lastRow.number - 1);
    worksheet = this.addHeader(worksheet, headerRow2, header2);
    let headerRow3 = worksheet.getRow(worksheet.lastRow.number);
    worksheet = this.addHeader(worksheet, headerRow3, header3);

    data.forEach((element, index) => {
      let arrCell = [
        element.THANG,
        element.DZ_TQ110,
        element.DZ_KD110,
        element.TRAM110,
        element.TONG_110,
        element.DZ_TQ22,
        element.DZ_KD22,
        element.TRAM22,
        element.TONG_22,
        element.TONG
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    });
  }

  showReportBM04(data: any[], dateStart: String, dateEnd: String) {
    const title = 'THỐNG KÊ SỰ CỐ THEO ĐƠN VỊ';
    let colNumber = 11;
    const header = [
      { index: 'A', text: "STT", rowspan: 3 },
      { index: 'B', text: "Đơn vị quản lý vận hành", rowspan: 3 },
      { index: 'C', text: "Sự cố 110kV", colspan: 4 },
      { index: 'G', text: "Sự cố 22kV", colspan: 4 },
      { index: 'K', text: "Tổng", rowspan: 3 }
    ];
    const header2 = [
      {},
      {},
      { index: 'C', text: "Đường dây", colspan: 2 },
      { index: 'E', text: "Trạm biến áp", rowspan: 2 },
      { index: 'F', text: "Tổng", rowspan: 2 },
      { index: 'I', text: "Trạm biến áp", rowspan: 2 },
      { index: 'J', text: "Tổng", rowspan: 2 },
      {}
    ];
    const header3 = [
      {},
      {},
      { index: 'C', text: "Thoáng qua" },
      { index: 'D', text: "Kéo dài" },
      { index: 'G', text: "Thoáng qua" },
      { index: 'H', text: "Kéo dài" },
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, dateEnd);

    let headerRow = worksheet.addRow(header);
    worksheet = this.addHeader(worksheet, headerRow, header);
    let headerRow2 = worksheet.getRow(worksheet.lastRow.number - 1);
    worksheet = this.addHeader(worksheet, headerRow2, header2);
    let headerRow3 = worksheet.getRow(worksheet.lastRow.number);
    worksheet = this.addHeader(worksheet, headerRow3, header3);

    data.forEach((element, index) => {
      let arrCell = [
        element.STT,
        element.ORGDESC,
        element.DZ_TQ110,
        element.DZ_KD110,
        element.TRAM110,
        element.TONG_110,
        element.DZ_TQ22,
        element.DZ_KD22,
        element.TRAM22,
        element.TONG_22,
        element.TONG
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.getColumn('A').width = 10;
    worksheet.getColumn('B').width = 40;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 20;
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    });
  }

  showReportBM01a(lstAppMeter: any[], lst110: any[], lst22: any[], dateStart: String, dateEnd: String, fileName) {
    const title = 'BÁO CÁO CUNG CẤP ĐIỆN LỄ, TẾT';
    let colNumber = 4;
    const headerAppMeter = [
      { index: 'A', text: "Ngày" },
      { index: 'B', text: "Pmax (MW)" },
      { index: 'C', text: "Sản lượng điện nhận EVN (kWh)" }
    ];
    const header110 = [
      { index: 'A', text: "Ngày" },
      { index: 'B', text: "SCTQ (vụ)" },
      { index: 'C', text: "SCKD (vụ)" },
      { index: 'D', text: "SC TBA (vụ)" }
    ];
    const header22 = [
      { index: 'A', text: "Ngày" },
      { index: 'B', text: "SCTQ (vụ)" },
      { index: 'C', text: "SCKD (vụ)" },
      { index: 'D', text: "SC TBA (vụ)" }
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, dateEnd);

    let titleRow = worksheet.addRow(['1. Tình hình phụ tải']);
    titleRow.font = this.fontText;
    titleRow.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
    worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, colNumber);
    let headerRowAppMeter = worksheet.addRow(headerAppMeter);
    worksheet = this.addHeader(worksheet, headerRowAppMeter, headerAppMeter);
    lstAppMeter.forEach((element, index) => {
      let arrCell = [
        element.Ngay,
        element.PMAX,
        element.SanLuongDienNhanEVN
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });

    titleRow = worksheet.addRow(['2. Tình hình mất điện do rơ-le R81 tác động']);
    titleRow.font = this.fontText;
    titleRow.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
    worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, colNumber);

    titleRow = worksheet.addRow(['3. Tình hình mất điện do cắt giảm tải theo lệnh Điều độ']);
    titleRow.font = this.fontText;
    titleRow.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
    worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, colNumber);

    titleRow = worksheet.addRow(['4. Tình hình sự cố lưới điện 110kV']);
    titleRow.font = this.fontText;
    titleRow.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
    worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, colNumber);
    let headerRow110 = worksheet.addRow(header110);
    worksheet = this.addHeader(worksheet, headerRow110, header110);
    lst110.forEach((element, index) => {
      let arrCell = [
        element.NGAY,
        element.TQ,
        element.KD,
        element.TRAM
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });

    titleRow = worksheet.addRow(['5. Tình hình sự cố lưới điện 22kV']);
    titleRow.font = this.fontText;
    titleRow.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
    worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, colNumber);
    let headerRow22 = worksheet.addRow(header22);
    worksheet = this.addHeader(worksheet, headerRow22, header22);
    lst22.forEach((element, index) => {
      let arrCell = [
        element.NGAY,
        element.TQ,
        element.KD,
        element.TRAM
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.getColumn('A').width = 30;
    worksheet.getColumn('B').width = 30;
    worksheet.getColumn('C').width = 30;
    worksheet.getColumn('D').width = 30;
    return workbook;
  }

  showReportBM05(lstMain1: any[], lstMain2: any[], lstMain3: any[], dateStart: String, fileName, base64Chart) {
    const title = 'BÁO CÁO TÌNH HÌNH THỰC HIỆN CÔNG SUẤT VÀ SẢN LƯỢNG ĐIỆN NHẬN';
    let colNumber = 10;
    const header = [
      { index: 'A', text: "Giờ" },
      { index: 'B', text: "P (MW)" }
    ];
    const header3 = [
      { index: 'A', text: "So sánh (Tăng +/ giảm -)" },
      { index: 'B', text: "SL" },
      { index: 'C', text: "CS" },
      { index: 'D', text: "Ghi chú" }
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, 'NGAY');

    let titleRow = worksheet.addRow(['1. Công suất']);
    titleRow.font = this.fontHeader;
    titleRow.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
    worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, 2);
    let headerRow = worksheet.addRow(header);
    worksheet = this.addHeader(worksheet, headerRow, header);
    lstMain1.forEach((element, index) => {
      let arrCell = [
        element.NoiDung,
        element.GiaTri
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });

    let numColCurrent = 4;
    let titleRow2 = titleRow.getCell(numColCurrent);
    titleRow2.value = '2. Sản lượng điện nhận EVN';
    titleRow2.font = this.fontHeader;
    titleRow2.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
    worksheet.mergeCells(titleRow.number, numColCurrent, titleRow.number, numColCurrent + 1);

    lstMain2.forEach((element, index) => {
      let row2 = worksheet.getRow(titleRow.number + 1 + index);
      row2.getCell(numColCurrent).value = element.NoiDung;
      row2.getCell(numColCurrent).font = this.fontText;
      row2.getCell(numColCurrent).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 1).value = element.GiaTri;
      row2.getCell(numColCurrent + 1).font = this.fontText;
      row2.getCell(numColCurrent + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    numColCurrent += 3;
    let titleRow3 = titleRow.getCell(numColCurrent);
    titleRow3.value = '3. Công suất, sản lượng cùng kỳ';
    titleRow3.font = this.fontHeader;
    titleRow3.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
    worksheet.mergeCells(titleRow.number, numColCurrent, titleRow.number, numColCurrent + 3);
    let row2 = worksheet.getRow(titleRow.number + 1);
    row2.getCell(numColCurrent).value = header3[0].text;
    row2.getCell(numColCurrent).font = this.fontHeader;
    row2.getCell(numColCurrent).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 1).value = header3[1].text;
    row2.getCell(numColCurrent + 1).font = this.fontHeader;
    row2.getCell(numColCurrent + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 2).value = header3[2].text;
    row2.getCell(numColCurrent + 2).font = this.fontHeader;
    row2.getCell(numColCurrent + 2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 3).value = header3[3].text;
    row2.getCell(numColCurrent + 3).font = this.fontHeader;
    row2.getCell(numColCurrent + 3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    lstMain3.forEach((element, index) => {
      let row2 = worksheet.getRow(titleRow.number + 2 + index);
      row2.getCell(numColCurrent).value = element.NoiDung;
      row2.getCell(numColCurrent).font = this.fontText;
      row2.getCell(numColCurrent).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 1).value = element.GiaTri;
      row2.getCell(numColCurrent + 1).font = this.fontText;
      row2.getCell(numColCurrent + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 2).value = element.GiaTri2;
      row2.getCell(numColCurrent + 2).font = this.fontText;
      row2.getCell(numColCurrent + 2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 3).value = element.GhiChu;
      row2.getCell(numColCurrent + 3).font = this.fontText;
      row2.getCell(numColCurrent + 3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    const imageId2 = workbook.addImage({
      base64: base64Chart,
      extension: 'png',
    });
    worksheet.addImage(imageId2, {
      tl: { col: 3, row: 13 },
      ext: { width: 1100, height: 450 }
    });

    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 5;
    worksheet.getColumn('D').width = 40;
    worksheet.getColumn('E').width = 30;
    worksheet.getColumn('F').width = 5;
    worksheet.getColumn('G').width = 30;
    worksheet.getColumn('H').width = 15;
    worksheet.getColumn('I').width = 15;
    worksheet.getColumn('J').width = 20;
    return workbook;
  }

  showReportBM06(data: any[], dateStart: String, fileName, cols, title, typeReport) {
    let colNumber = cols.length;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, typeReport);

    let numColCurrent = 1;
    let row2 = worksheet.addRow([]);
    for (let index = 0; index < cols.length; index++) {
      const col = cols[index];
      row2.getCell(numColCurrent + index).value = col.header;
      row2.getCell(numColCurrent + index).font = this.fontHeader;
      row2.getCell(numColCurrent + index).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + index).alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      }
      worksheet.getColumn(row2.getCell(numColCurrent + index).col).width = 20;
    }
    data.forEach((element, index) => {
      let row2 = worksheet.addRow([]);
      for (let index = 0; index < cols.length; index++) {
        const col = cols[index];
        row2.getCell(numColCurrent + index).font = this.fontText;
        row2.getCell(numColCurrent + index).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        switch (col.type) {
          case 'datetime_second':
            row2.getCell(numColCurrent + index).value = this.datePipe.transform(element[col.field], 'dd/MM/yyyy HH:mm:ss');
            break;
          case 'datetime':
            row2.getCell(numColCurrent + index).value = this.datePipe.transform(element[col.field], 'dd/MM/yyyy HH:mm');
            break;
          case 'date':
            row2.getCell(numColCurrent + index).value = this.datePipe.transform(element[col.field], 'dd/MM/yyyy');
            break;
          default:
            row2.getCell(numColCurrent + index).value = element[col.field];
            break;
        }
      }
    });
    worksheet.getColumn('A').width = 10;
    worksheet.getColumn('B').width = 20;
    return workbook;
  }

  showReportBM07(data: any[], dateStart: String, title, cols) {
    let colNumber = cols[1].length + 3;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, 'NGAY');

    let headerRow = worksheet.addRow(cols[0]);
    worksheet = this.addHeader(worksheet, headerRow, cols[0]);
    let headerRow2 = worksheet.getRow(worksheet.lastRow.number);
    let j = 4;
    for (let i = 0; i < cols[1].length; i++) {
      const element = cols[1][i];
      let cell = headerRow2.getCell(i + j);
      if (element.text || element.header) {
        cell.font = this.fontHeader;
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.value = element.text ? element.text : element.header;
      }
    }

    let numColCurrent = 4;
    data.forEach((element, index) => {
      let row2 = worksheet.addRow([]);
      row2.getCell(1).value = index + 1;
      row2.getCell(1).font = this.fontText;
      row2.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(2).value = element["TenDonVi"];
      row2.getCell(2).font = this.fontText;
      row2.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(3).value = element["Loai"];
      row2.getCell(3).font = this.fontText;
      row2.getCell(3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      for (let index = 0; index < cols[1].length; index++) {
        const col = cols[1][index];
        row2.getCell(numColCurrent + index).value = element[col.field];
        row2.getCell(numColCurrent + index).font = this.fontText;
        row2.getCell(numColCurrent + index).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
    });
    worksheet.getColumn('A').width = 10;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 15;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 20;
    worksheet.getColumn('L').width = 20;
    worksheet.getColumn('M').width = 20;
    worksheet.getColumn('N').width = 20;
    worksheet.getColumn('O').width = 20;
    worksheet.getColumn('P').width = 20;
    worksheet.getColumn('Q').width = 20;
    return workbook;
  }

  showReportBM16(data: any[], dateStart: String, fileName, title) {
    let colNumber = 30;
    const header = [
      { index: 'A', text: "STT", rowspan: 3 },
      { index: 'B', text: "Đơn vị", rowspan: 3 },
      { index: 'C', text: "Trạm 110kV", colspan: 6 },
      { index: 'I', text: "Nhà máy điện", colspan: 15 },
      { index: 'X', text: "Thiết bị 22kV", colspan: 7 }
    ];
    const header2 = [
      {}, {},
      { index: 'C', text: "TBA KNT", colspan: 2 },
      { index: 'E', text: "Điều khiển xa", colspan: 2 },
      { index: 'G', text: "Giao thức A2", colspan: 2 },
      { index: 'I', text: "Gió", colspan: 3 },
      { index: 'L', text: "Mặt trời", colspan: 3 },
      { index: 'O', text: "Thủy điện", colspan: 3 },
      { index: 'R', text: "Nhiệt điện", colspan: 3 },
      { index: 'U', text: "Khác", colspan: 3 },
      { index: 'X', text: "Recloser", colspan: 3 },
      { index: 'AA', text: "LBS", colspan: 2 },
      { index: 'AC', text: "FI", colspan: 2 }
    ];
    const header3 = [
      {}, {},
      { index: 'C', text: "Đã chuyển" },
      { index: 'D', text: "Chưa chuyển" },
      { index: 'E', text: "Đã ĐKX" },
      { index: 'F', text: "Chưa ĐKX" },
      { index: 'G', text: "IEC-101" },
      { index: 'H', text: "IEC-104" },
      { index: 'I', text: "Giao thức ICCP" },
      { index: 'J', text: "Giao thức IEC-104" },
      { index: 'K', text: "Công suất" },
      { index: 'L', text: "Giao thức ICCP" },
      { index: 'M', text: "Giao thức IEC-104" },
      { index: 'N', text: "Công suất" },
      { index: 'O', text: "Giao thức ICCP" },
      { index: 'P', text: "Giao thức IEC-104" },
      { index: 'Q', text: "Công suất" },
      { index: 'R', text: "Giao thức ICCP" },
      { index: 'S', text: "Giao thức IEC-104" },
      { index: 'T', text: "Công suất" },
      { index: 'U', text: "Giao thức ICCP" },
      { index: 'V', text: "Giao thức IEC-104" },
      { index: 'W', text: "Công suất" },
      { index: 'X', text: "DNP3" },
      { index: 'Y', text: "IEC-101" },
      { index: 'Z', text: "IEC-104" },
      { index: 'AA', text: "IEC-101" },
      { index: 'AB', text: "IEC-104" },
      { index: 'AC', text: "IEC-101" },
      { index: 'AD', text: "IEC-104" }
    ];

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, 'NGAY');

    let headerRow = worksheet.addRow(header);
    worksheet = this.addHeader(worksheet, headerRow, header);
    let headerRow2 = worksheet.getRow(worksheet.lastRow.number - 1);
    worksheet = this.addHeader(worksheet, headerRow2, header2);
    let headerRow3 = worksheet.getRow(worksheet.lastRow.number);
    worksheet = this.addHeader(worksheet, headerRow3, header3);

    data.forEach((element, index) => {
      let arrCell = [
        element.STT,
        element.TEN_TINH,
        element.DA_CHUYEN,
        element.CHUA_CHUYEN,
        element.DKX,
        element.CHUA_DKX,
        element.SPC_IEC_101,
        element.SPC_IEC_104,
        element.NLTT_NMDGIO_ICCP,
        element.NLTT_NMDGIO_IEC_104,
        element.NLTT_NMDGIO_CS,
        element.NLTT_NMDMATTROI_ICCP,
        element.NLTT_NMDMATTROI_IEC_104,
        element.NLTT_NMDMATTROI_CS,
        element.NLTT_NMTHUYDIEN_ICCP,
        element.NLTT_NMTHUYDIEN_IEC_104,
        element.NLTT_NMTHUYDIEN_CS,
        element.NLTT_NMNHIETDIEN_ICCP,
        element.NLTT_NMNHIETDIEN_IEC_104,
        element.NLTT_NMNHIETDIEN_CS,
        element.NLK_NGANHNGHE_ICCP,
        element.NLK_NGANHNGHE_IEC_104,
        element.NLK_NGANHNGHE_CS,
        element.REC_DNP3,
        element.REC_IEC_101,
        element.REC_IEC_104,
        element.LBS_IEC_101,
        element.LBS_IEC_104,
        element.FI_IEC_101,
        element.FI_IEC_104
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.getColumn('A').width = 10;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 15;
    worksheet.getColumn('D').width = 15;
    worksheet.getColumn('E').width = 15;
    worksheet.getColumn('F').width = 15;
    worksheet.getColumn('G').width = 15;
    worksheet.getColumn('H').width = 15;
    worksheet.getColumn('I').width = 15;
    worksheet.getColumn('J').width = 15;
    worksheet.getColumn('K').width = 15;
    worksheet.getColumn('L').width = 15;
    worksheet.getColumn('M').width = 15;
    worksheet.getColumn('N').width = 15;
    worksheet.getColumn('O').width = 15;
    worksheet.getColumn('P').width = 15;
    worksheet.getColumn('Q').width = 15;
    worksheet.getColumn('R').width = 15;
    worksheet.getColumn('S').width = 15;
    worksheet.getColumn('T').width = 15;
    worksheet.getColumn('U').width = 15;
    worksheet.getColumn('V').width = 15;
    worksheet.getColumn('W').width = 15;
    worksheet.getColumn('X').width = 15;
    worksheet.getColumn('Y').width = 15;
    worksheet.getColumn('Z').width = 15;
    worksheet.getColumn('AA').width = 15;
    worksheet.getColumn('AB').width = 15;
    worksheet.getColumn('AC').width = 15;
    worksheet.getColumn('AD').width = 15;
    return workbook;
  }

  showReportBM17(lstMainTong: any[], lstMainKNT: any[], lstMainA2: any[], lstMainDKX: any[], lstMainPHONE: any[], lstMainTBA110: any[], lstMainTBAKH: any[], dateStart: String, title) {
    let colNumber = 11;
    const headerTong = [
      { index: 'A', text: "Tổng số TBA do EVN SPC quản lý" },
      { index: 'B', text: "PC Đồng Nai (TBA)" },
      { index: 'C', text: "20 tỉnh còn lại (TBA)" }
    ];
    const headerKNT = [
      { index: 'A', text: "TBA KNT" },
      { index: 'B', text: "PC Đồng Nai (TBA)" },
      { index: 'C', text: "20 tỉnh còn lại (TBA)" },
      { index: 'D', text: "Tổng" }
    ];
    const headerA2 = [
      { index: 'A', text: "Kết nối về A2" },
      { index: 'B', text: "PC Đồng Nai (TBA)" },
      { index: 'C', text: "20 tỉnh còn lại (TBA)" },
      { index: 'D', text: "Tổng" }
    ];
    const headerDKX = [
      { index: 'A', text: "TBA ĐIỀU KHIỂN XA" },
      { index: 'B', text: "PC Đồng Nai (TBA)" },
      { index: 'C', text: "20 tỉnh còn lại (TBA)" },
      { index: 'D', text: "Tổng" }
    ];
    const headerPHONE = [
      { index: 'A', text: "Loại" },
      { index: 'B', text: "PC Đồng Nai (TBA)" },
      { index: 'C', text: "20 tỉnh còn lại (TBA)" },
      { index: 'D', text: "Tổng" }
    ];
    const headerTBA110 = [
      { index: 'A', text: "Tỉnh" },
      { index: 'B', text: "TBA 110kV" }
    ];
    const headerTBAKH = [
      { index: 'A', text: "TBA khách hàng kết nối với hệ thống SCADA EVN SPC" },
      { index: 'B', text: "ICCP" },
      { index: 'C', text: "101" },
      { index: 'D', text: "104" },
      { index: 'E', text: "Tổng" },
      { index: 'F', text: "Công suất (MW)" }
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, 'NGAY');

    //Tong
    let headerRowTong = worksheet.addRow(headerTong);
    worksheet = this.addHeader(worksheet, headerRowTong, headerTong);
    lstMainTong.forEach((element, index) => {
      let arrCell = [
        element.Tong,
        element.DN,
        element.ConLai
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.addRow([]);
    //KNT
    let headerRow = worksheet.addRow(headerKNT);
    worksheet = this.addHeader(worksheet, headerRow, headerKNT);
    lstMainKNT.forEach((element, index) => {
      let arrCell = [
        element.Loai,
        element.DN,
        element.ConLai,
        element.Tong
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.addRow([]);
    //A2
    headerRow = worksheet.addRow(headerA2);
    worksheet = this.addHeader(worksheet, headerRow, headerA2);
    lstMainA2.forEach((element, index) => {
      let arrCell = [
        element.Loai,
        element.DN,
        element.ConLai,
        element.Tong
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.addRow([]);
    //DKX
    headerRow = worksheet.addRow(headerDKX);
    worksheet = this.addHeader(worksheet, headerRow, headerDKX);
    lstMainDKX.forEach((element, index) => {
      let arrCell = [
        element.Loai,
        element.DN,
        element.ConLai,
        element.Tong
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.addRow([]);
    //PHONE
    headerRow = worksheet.addRow(headerPHONE);
    worksheet = this.addHeader(worksheet, headerRow, headerPHONE);
    lstMainPHONE.forEach((element, index) => {
      let arrCell = [
        element.Loai,
        element.DN,
        element.ConLai,
        element.Tong
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.addRow([]);
    //TBA110
    headerRow = worksheet.addRow(headerTBA110);
    worksheet = this.addHeader(worksheet, headerRow, headerTBA110);
    lstMainTBA110.forEach((element, index) => {
      let arrCell = [
        element.TEN_TINH,
        element.SL
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    //TBAKH
    let numColCurrent = 6;
    let row2 = worksheet.getRow(headerRowTong.number);
    row2.getCell(numColCurrent).value = headerTBAKH[0].text;
    row2.getCell(numColCurrent).font = this.fontHeader;
    row2.getCell(numColCurrent).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 1).value = headerTBAKH[1].text;
    row2.getCell(numColCurrent + 1).font = this.fontHeader;
    row2.getCell(numColCurrent + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 2).value = headerTBAKH[2].text;
    row2.getCell(numColCurrent + 2).font = this.fontHeader;
    row2.getCell(numColCurrent + 2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 3).value = headerTBAKH[3].text;
    row2.getCell(numColCurrent + 3).font = this.fontHeader;
    row2.getCell(numColCurrent + 3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 4).value = headerTBAKH[4].text;
    row2.getCell(numColCurrent + 4).font = this.fontHeader;
    row2.getCell(numColCurrent + 4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 5).value = headerTBAKH[5].text;
    row2.getCell(numColCurrent + 5).font = this.fontHeader;
    row2.getCell(numColCurrent + 5).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    lstMainTBAKH.forEach((element, index) => {
      let row2 = worksheet.getRow(headerRowTong.number + 1 + index);
      row2.getCell(numColCurrent).value = element.Loai;
      row2.getCell(numColCurrent).font = this.fontText;
      row2.getCell(numColCurrent).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 1).value = element.ICCP;
      row2.getCell(numColCurrent + 1).font = this.fontText;
      row2.getCell(numColCurrent + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 2).value = element.IEC_101;
      row2.getCell(numColCurrent + 2).font = this.fontText;
      row2.getCell(numColCurrent + 2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 3).value = element.IEC_104;
      row2.getCell(numColCurrent + 3).font = this.fontText;
      row2.getCell(numColCurrent + 3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 4).value = element.Tong;
      row2.getCell(numColCurrent + 4).font = this.fontText;
      row2.getCell(numColCurrent + 4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 5).value = element.CS;
      row2.getCell(numColCurrent + 5).font = this.fontText;
      row2.getCell(numColCurrent + 5).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    worksheet.getColumn('A').width = 30;
    worksheet.getColumn('B').width = 30;
    worksheet.getColumn('C').width = 30;
    worksheet.getColumn('D').width = 10;
    worksheet.getColumn('E').width = 10;
    worksheet.getColumn('F').width = 60;
    worksheet.getColumn('G').width = 10;
    worksheet.getColumn('H').width = 10;
    worksheet.getColumn('I').width = 10;
    worksheet.getColumn('J').width = 10;
    worksheet.getColumn('K').width = 20;
    return workbook;
  }

  showReportBM18(lstMain: any[], dateStart: String, title, base64Chart) {
    let colNumber = 10;
    const header = [
      { index: 'A', text: "STT", rowspan: 3 },
      { index: 'B', text: "Tỉnh", rowspan: 3 },
      { index: 'C', text: "SPC quản lý", colspan: 6 },
      { index: 'D', text: "Khách hàng" }
    ];
    const header2 = [
      {}, {},
      { index: 'C', text: "Recloser", colspan: 5 },
      { index: 'D', text: "LBS" },
      { index: 'E', text: "Recloser" }
    ];
    const header3 = [
      {}, {},
      { index: 'C', text: "SPC-Rec-104" },
      { index: 'D', text: "SPC-Rec-101" },
      { index: 'E', text: "SPC-Rec-101-DA" },
      { index: 'F', text: "SPC-Rec-DNP3" },
      { index: 'G', text: "SPC-Rec-RTU-CMIC" },
      { index: 'H', text: "SPC-LBS-104" },
      { index: 'I', text: "KH-Rec-104" }
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, 'NGAY');

    let headerRow = worksheet.addRow(header);
    worksheet = this.addHeader(worksheet, headerRow, header);
    let headerRow2 = worksheet.getRow(headerRow.number + 1);
    worksheet = this.addHeader(worksheet, headerRow2, header2);
    let headerRow3 = worksheet.getRow(headerRow.number + 2);
    worksheet = this.addHeader(worksheet, headerRow3, header3);
    lstMain.forEach((element, index) => {
      let arrCell = [
        element.STT,
        element.TEN_TINH,
        element.SPC_Rec_104,
        element.SPC_Rec_101,
        element.SPC_Rec_101_DA,
        element.SPC_Rec_DNP3,
        element.SPC_Rec_RTU_CMIC,
        element.SPC_LBS_104,
        element.KH_Rec_104
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });

    const imageId2 = workbook.addImage({
      base64: base64Chart,
      extension: 'png',
    });
    worksheet.addImage(imageId2, {
      tl: { col: 10, row: headerRow.number },
      ext: { width: 1100, height: 600 }
    });

    worksheet.getColumn('A').width = 10;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 15;
    worksheet.getColumn('D').width = 15;
    worksheet.getColumn('E').width = 15;
    worksheet.getColumn('F').width = 15;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 15;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 5;
    return workbook;
  }

  showReportBM19(lstMainNSX_SPC_LBS: any[], lstMainNSX_SPC_Rec: any[], lstMainNSX_KH_Rec: any[], lstMainGiaoThuc: any[], dateStart: String, title) {
    let colNumber = 16;
    const headerNSX_SPC_LBS = [
      { index: 'A', text: "EVN SPC", colspan: 2 }
    ];
    const headerNSX_SPC_LBS2 = [
      { index: 'A', text: "LBS-Nhà sx-Hiệu" },
      { index: 'B', text: "Số lượng" }
    ];
    const headerNSX_SPC_Rec = [
      { index: 'A', text: "Recloser-Nhà sx-Hiệu" },
      { index: 'B', text: "Số lượng" }
    ];
    const headerNSX_KH_Rec = [
      { index: 'A', text: "Recloser-Nhà sx-Hiệu" },
      { index: 'B', text: "Số lượng" }
    ];
    const headerGiaoThuc = [
      { index: 'B', text: "104" },
      { index: 'C', text: "101" },
      { index: 'D', text: "101-DA" },
      { index: 'E', text: "DNP3" },
      { index: 'F', text: "RTU_CMIC" },
      { index: 'G', text: "Tổng" }
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, 'NGAY');

    //headerNSX_SPC_LBS
    let headerRow = worksheet.addRow(headerNSX_SPC_LBS);
    worksheet = this.addHeader(worksheet, headerRow, headerNSX_SPC_LBS);
    let headerRow2 = worksheet.getRow(headerRow.number + 1);
    worksheet = this.addHeader(worksheet, headerRow2, headerNSX_SPC_LBS2);
    lstMainNSX_SPC_LBS.forEach((element, index) => {
      let arrCell = [
        element.Loai,
        element.SL
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    //headerNSX_SPC_Rec
    let numColCurrent = 4;
    let titleRow3 = headerRow.getCell(numColCurrent);
    titleRow3.value = 'EVN SPC';
    titleRow3.font = this.fontHeader;
    titleRow3.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    titleRow3.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.mergeCells(headerRow.number, numColCurrent, headerRow.number, numColCurrent + 1);
    let row2 = worksheet.getRow(headerRow.number + 1);
    row2.getCell(numColCurrent).value = headerNSX_SPC_Rec[0].text;
    row2.getCell(numColCurrent).font = this.fontHeader;
    row2.getCell(numColCurrent).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 1).value = headerNSX_SPC_Rec[1].text;
    row2.getCell(numColCurrent + 1).font = this.fontHeader;
    row2.getCell(numColCurrent + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    lstMainNSX_SPC_Rec.forEach((element, index) => {
      let row2 = worksheet.getRow(headerRow.number + 2 + index);
      row2.getCell(numColCurrent).value = element.Loai;
      row2.getCell(numColCurrent).font = this.fontText;
      row2.getCell(numColCurrent).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 1).value = element.SL;
      row2.getCell(numColCurrent + 1).font = this.fontText;
      row2.getCell(numColCurrent + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    //headerNSX_KH_Rec    
    numColCurrent += 3;
    titleRow3 = headerRow.getCell(numColCurrent);
    titleRow3.value = 'Khách hàng';
    titleRow3.font = this.fontHeader;
    titleRow3.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    titleRow3.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.mergeCells(headerRow.number, numColCurrent, headerRow.number, numColCurrent + 1);
    row2 = worksheet.getRow(headerRow.number + 1);
    row2.getCell(numColCurrent).value = headerNSX_KH_Rec[0].text;
    row2.getCell(numColCurrent).font = this.fontHeader;
    row2.getCell(numColCurrent).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 1).value = headerNSX_KH_Rec[1].text;
    row2.getCell(numColCurrent + 1).font = this.fontHeader;
    row2.getCell(numColCurrent + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    lstMainNSX_KH_Rec.forEach((element, index) => {
      let row2 = worksheet.getRow(headerRow.number + 2 + index);
      row2.getCell(numColCurrent).value = element.Loai;
      row2.getCell(numColCurrent).font = this.fontText;
      row2.getCell(numColCurrent).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 1).value = element.SL;
      row2.getCell(numColCurrent + 1).font = this.fontText;
      row2.getCell(numColCurrent + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    //headerGiaoThuc    
    numColCurrent += 3;
    titleRow3 = headerRow.getCell(numColCurrent);
    titleRow3.value = 'Thiết bị đã kết nối SCADA';
    titleRow3.font = this.fontHeader;
    titleRow3.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    titleRow3.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.mergeCells(headerRow.number, numColCurrent, headerRow.number + 1, numColCurrent);
    titleRow3 = headerRow.getCell(numColCurrent + 1);
    titleRow3.value = 'Giao thức kết nối';
    titleRow3.font = this.fontHeader;
    titleRow3.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    titleRow3.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.mergeCells(headerRow.number, numColCurrent + 1, headerRow.number, numColCurrent + 6);
    row2 = worksheet.getRow(headerRow.number + 1);
    row2.getCell(numColCurrent + 1).value = headerGiaoThuc[0].text;
    row2.getCell(numColCurrent + 1).font = this.fontHeader;
    row2.getCell(numColCurrent + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 2).value = headerGiaoThuc[1].text;
    row2.getCell(numColCurrent + 2).font = this.fontHeader;
    row2.getCell(numColCurrent + 2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 3).value = headerGiaoThuc[2].text;
    row2.getCell(numColCurrent + 3).font = this.fontHeader;
    row2.getCell(numColCurrent + 3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 4).value = headerGiaoThuc[3].text;
    row2.getCell(numColCurrent + 4).font = this.fontHeader;
    row2.getCell(numColCurrent + 4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 5).value = headerGiaoThuc[4].text;
    row2.getCell(numColCurrent + 5).font = this.fontHeader;
    row2.getCell(numColCurrent + 5).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(numColCurrent + 6).value = headerGiaoThuc[5].text;
    row2.getCell(numColCurrent + 6).font = this.fontHeader;
    row2.getCell(numColCurrent + 6).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    lstMainGiaoThuc.forEach((element, index) => {
      let row2 = worksheet.getRow(headerRow.number + 2 + index);
      row2.getCell(numColCurrent).value = element.Loai;
      row2.getCell(numColCurrent).font = this.fontText;
      row2.getCell(numColCurrent).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 1).value = element.IEC_104;
      row2.getCell(numColCurrent + 1).font = this.fontText;
      row2.getCell(numColCurrent + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 2).value = element.IEC_101;
      row2.getCell(numColCurrent + 2).font = this.fontText;
      row2.getCell(numColCurrent + 2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 3).value = element.IEC_101_DA;
      row2.getCell(numColCurrent + 3).font = this.fontText;
      row2.getCell(numColCurrent + 3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 4).value = element.DNP3;
      row2.getCell(numColCurrent + 4).font = this.fontText;
      row2.getCell(numColCurrent + 4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 5).value = element.RTU_CMIC;
      row2.getCell(numColCurrent + 5).font = this.fontText;
      row2.getCell(numColCurrent + 5).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row2.getCell(numColCurrent + 6).value = element.Tong;
      row2.getCell(numColCurrent + 6).font = this.fontText;
      row2.getCell(numColCurrent + 6).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    worksheet.getColumn('A').width = 30;
    worksheet.getColumn('B').width = 15;
    worksheet.getColumn('C').width = 5;
    worksheet.getColumn('D').width = 30;
    worksheet.getColumn('E').width = 15;
    worksheet.getColumn('F').width = 5;
    worksheet.getColumn('G').width = 30;
    worksheet.getColumn('H').width = 15;
    worksheet.getColumn('I').width = 5;
    worksheet.getColumn('J').width = 30;
    worksheet.getColumn('K').width = 10;
    worksheet.getColumn('L').width = 10;
    worksheet.getColumn('M').width = 10;
    worksheet.getColumn('N').width = 10;
    worksheet.getColumn('O').width = 15;
    worksheet.getColumn('P').width = 10;
    return workbook;
  }

  showReportBM20b(data: any[], dateStart: String, fileName, title, typeReport) {
    let colNumber = 13;
    const header = [
      { index: 'A', text: "STT", rowspan: 2 },
      { index: 'B', text: "Đơn vị", rowspan: 2 },
      { index: 'C', text: "Tổng số thiết bị RMU, LBS, Recloser, Compact, trạm cắt đang vận hành trên lưới", rowspan: 2 },
      { index: 'D', text: "Số thiết bị RMU, LBS, Recloser, Compact, trạm cắt đã kết nối SCADA", colspan: 2 },
      { index: 'F', text: "Số thiết bị RMU, LBS, Recloser, Compact, trạm cắt chưa kết nối SCADA", colspan: 2 },
      { index: 'H', text: "Tổng số REC/LBS mất kết nối SCADA", rowspan: 2 },
      { index: 'I', text: "Tổng thiết bị Rec/LBS hiện đang điều khiển xa ", rowspan: 2 },
      { index: 'J', text: "Số lượng REC", colspan: 2 },
      { index: 'L', text: "Số lượng LBS", colspan: 2 }
    ];
    const header2 = [
      {},
      {},
      {},
      { index: 'D', text: "Lũy kế hiện tại" },
      { index: 'E', text: "Trong kỳ" },
      { index: 'F', text: "Số thiết bị RMU, LBS, Recloser, Compact, trạm cắt đủ điều kiện cải tạo nhưng chưa lắp đặt SCADA" },
      { index: 'G', text: "Số thiết bị RMU, LBS, Recloser, Compact, trạm cắt không đủ điều kiện cải tạo để lắp đặt SCADA" },
      {}, {},
      { index: 'J', text: "Đang kết nối" },
      { index: 'K', text: "Đang mất kết nối" },
      { index: 'L', text: "Đang kết nối" },
      { index: 'M', text: "Đang mất kết nối" }
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, typeReport);

    let headerRow = worksheet.addRow(header);
    worksheet = this.addHeader(worksheet, headerRow, header);
    let headerRow2 = worksheet.getRow(worksheet.lastRow.number);
    worksheet = this.addHeader(worksheet, headerRow2, header2);

    data.forEach((element, index) => {
      let arrCell = [
        element.STT,
        element.TEN_TINH,
        element.Tong,
        element.DANGKETNOI_LK,
        element.DANGKETNOI,
        element.DU_DK_CAITAO,
        element.CHUA_DU_DK_CAITAO,
        element.REC_LBS_MATKN,
        element.REC_LBS_DKX,
        element.REC_DANGKN,
        element.REC_MATKN,
        element.LBS_DANGKN,
        element.LBS_MATKN
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.getColumn('A').width = 10;
    worksheet.getColumn('B').width = 30;
    worksheet.getColumn('C').width = 30;
    worksheet.getColumn('D').width = 30;
    worksheet.getColumn('E').width = 30;
    worksheet.getColumn('F').width = 30;
    worksheet.getColumn('G').width = 30;
    worksheet.getColumn('H').width = 30;
    worksheet.getColumn('I').width = 30;
    worksheet.getColumn('J').width = 30;
    worksheet.getColumn('K').width = 30;
    worksheet.getColumn('L').width = 30;
    worksheet.getColumn('M').width = 30;
    return workbook;
  }

  showReportBM20c(data: any[], dateStart: String, fileName, title, typeReport) {
    let colNumber = 13;
    const header = [
      { index: 'A', text: "STT", rowspan: 2 },
      { index: 'B', text: "Đơn vị", rowspan: 2 },
      { index: 'C', text: "Nội dung", rowspan: 2 },
      { index: 'D', text: "Số lần đã điều khiển xa", colspan: 2 },
      { index: 'F', text: "Số lần đã điều khiển xa thành công", colspan: 2 },
      { index: 'H', text: "Tỉ lệ điều khiển xa thành công (%)", colspan: 2 },
      { index: 'J', text: "Số lần tổ TTLĐ phải đến trạm để điều khiển", colspan: 2 },
      { index: 'L', text: "Các nguyên nhân chính dẫn đến thao tác xa không thành công", rowspan: 2 }
    ];
    const header2 = [
      {},
      {},
      {},
      { index: 'D', text: "Lũy kế từ khi đưa vào VH" },
      { index: 'E', text: "Trong kỳ" },
      { index: 'F', text: "Lũy kế từ khi đưa vào VH" },
      { index: 'G', text: "Trong kỳ" },
      { index: 'H', text: "Lũy kế từ khi đưa vào VH" },
      { index: 'I', text: "Trong kỳ" },
      { index: 'J', text: "Lũy kế từ khi đưa vào VH" },
      { index: 'K', text: "Trong kỳ" }
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);
    worksheet = this.addDefaultOrg(worksheet, colNumber, title, dateStart, typeReport);

    let headerRow = worksheet.addRow(header);
    worksheet = this.addHeader(worksheet, headerRow, header);
    let headerRow2 = worksheet.getRow(worksheet.lastRow.number);
    worksheet = this.addHeader(worksheet, headerRow2, header2);

    data.forEach((element, index) => {
      let arrCell = [
        element.STT,
        element.TEN_TINH,
        element.NOI_DUNG,
        element.SLDKX_LK,
        element.SLDKX,
        element.SLDKX_TC_LK,
        element.SLDKX_TC,
        element.TLDKX_TC_LK,
        element.TLDKX_TC,
        element.SLDENTRAM_LK,
        element.SLDENTRAM,
        element.NGUYEN_NHAN
      ];
      let row2 = worksheet.addRow(arrCell);
      arrCell.forEach((cell, i) => {
        row2.getCell(i + 1).font = this.fontText;
        row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });
    worksheet.getColumn('A').width = 10;
    worksheet.getColumn('B').width = 30;
    worksheet.getColumn('C').width = 30;
    worksheet.getColumn('D').width = 30;
    worksheet.getColumn('E').width = 30;
    worksheet.getColumn('F').width = 30;
    worksheet.getColumn('G').width = 30;
    worksheet.getColumn('H').width = 30;
    worksheet.getColumn('I').width = 30;
    worksheet.getColumn('J').width = 30;
    worksheet.getColumn('K').width = 30;
    worksheet.getColumn('L').width = 60;
    return workbook;
  }
  showReportBM24(data: any, dateStart: String, fileName, title, typeReport) {
    let colNumber = 17;

    const startTimeCa = new Date(data.NGAY.replace('00:00:00', 'aa').replace('aa', data.LABEL_TIME.substr(0, 8)))
    let endTimeCa = new Date((new Date(data.NGAY.replace('00:00:00', 'aa').replace('aa', data.LABEL_TIME.substr(0, 8)))).setMinutes(this.getDuringCa(data.LABEL_TIME)));
    const header1 = [
      { index: 'A', text: "SỔ NHẬT KÝ VẬN HÀNH", colspan: 17, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];
    const header2 = [
      { index: 'A', text: "Từ:",horizontal: 'middle', vertical: 'right' },
      {
        index: 'B', text: `${startTimeCa.getHours().toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })} giờ ${startTimeCa.getMinutes().toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })} ngày ${startTimeCa.getDate().toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })} tháng ${(startTimeCa.getMonth() + 1).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })} năm ${startTimeCa.getFullYear()}`, colspan: 5
      }];
    const header3 = [
      { index: 'A', text: "Đến:",horizontal: 'middle', vertical: 'right' },
      {
        index: 'B', text: `${endTimeCa.getHours().toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })} giờ ${endTimeCa.getMinutes().toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })} ngày ${endTimeCa.getDate().toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })} tháng ${(endTimeCa.getMonth() + 1).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })} năm ${endTimeCa.getFullYear()}`, colspan:5
      },
      { index: 'G', text: "Ca trực:", colspan: 2 ,horizontal: 'middle', vertical: 'right'},
      { index: 'H', text: `1. ${data.LIST_GIAO.split(";")[0]} - 2. ${data.LIST_GIAO.split(";")[1]}`, colspan: 5 }
    
    ];
    const header4 = [
      { index: 'A', text: "Ngày, Giờ", colspan: 2 },
      { index: 'C', text: "TBA/NMĐ/TTĐK/REC/LBS: B3 (ASDU)/Tuyến SDH/IP", rowspan: 2 },
      { index: 'D', text: "ĐƠN VỊ QUẢN LÝ", rowspan: 2 },
      { index: 'E', text: "SỰ KIÊN/ DỊCH VỤ ẢNH HƯỞNG", rowspan: 2 },
      { index: 'F', text: "QUÁ TRÌNH XỬ LÝ", rowspan: 2 },
      { index: 'G', text: "NGUYÊN NHÂN", rowspan: 2 },
      { index: 'H', text: "PHÂN LOẠI SỰ KIỆN", rowspan: 2 },
      { index: 'I', text: "TIẾP NHẬN THÔNG TIN", colspan: 2 },
      { index: 'K', text: "ĐƠN VỊ XỬ LÝ", rowspan: 3 },
      { index: 'L', text: "THỜI GIAN XỬ LÝ", rowspan: 3 },
      { index: 'M', text: "GHI CHÚ/ĐÁNH GIÁ", rowspan: 3 }
    ];
    const header5 = [
      { index: 'A', text: "Bắt đầu"},
      { index: 'B', text: "Kết thúc"},
      {}, {}, {},{}, {}, {},
      { index: 'I', text: "Đơn vị khác"},
      { index: 'J', text: "TTĐH SCADA"},
      {}
    ];
    
    const header7 = [
      { index: 'A', text: '(1.1)' },
      { index: 'B', text: '(1.2)' },
      { index: 'C', text: '(2)' },
      { index: 'D', text: '(3)' },
      { index: 'E', text: '(4)' },
      { index: 'F', text: '(5)' },
      { index: 'G', text: '(6)' },
      { index: 'H', text: '(7)' },
      { index: 'I', text: '(8.1)' },
      { index: 'J', text: '(8.2)' },
      { index: 'K', text: '(9)' },
      { index: 'L', text: '(10)' },
      { index: 'M', text: '(11)' }
    ];
    const header8 = [
      { index: 'A', text: '1. Sự kiện trong ca trực:', colspan: 13 },
    ];
    const header9 = [
      { index: 'A', text: '2. Tình trạng vận hành các thiết bị trong MCC, BCC:', colspan: 13 },
    ];
    const header10 = [
      { index: 'A', text: '3. Các vấn đề lưu ý trong phiên giao-nhận ca: ', colspan: 13 },
    ];

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow2 = worksheet.addRow(header2);
    worksheet = this.addHeaderNoBold(worksheet, headerRow2, false, header2);

    let headerRow3 = worksheet.addRow(header3);
    worksheet = this.addHeaderNoBold(worksheet, headerRow3, false, header3);
    let headerRow4 = worksheet.getRow(headerRow3.number + 1);
    worksheet = this.addHeader(worksheet, headerRow4, header4);
    let headerRow5 = worksheet.getRow(headerRow3.number + 2);
    worksheet = this.addHeader(worksheet, headerRow5, header5);

    let headerRow7 = worksheet.addRow(header7);
    worksheet = this.addHeader(worksheet, headerRow7, header7);
    let headerRow8 = worksheet.addRow(header8);
    worksheet = this.addHeaderHorizontalLeft(worksheet, headerRow8, header8);
    if (data.listMain !== null && data.listMain.lenght !== 0) {
      data.listMain.forEach((element, index) => {
        let arrCell = [
          this.handleDateTime(element.START_TIME),
          this.handleDateTime(element.END_TIME),
          element.TEN_TB,
          element.DONVI_QUANLY,
          element.SU_KIEN,
          element.QUA_TRINH,
          element.NGUYEN_NHAN,
          element.LOAI_SUKIEN,
          element.TIEPNHAN_NGOAI,
          element.TIEPNHAN_SCADA,
          element.DONVI_XULY,
          element.THOI_GIAN,
          element.GHI_CHU
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }
    let headerRow9 = worksheet.addRow(header9);
    worksheet = this.addHeaderHorizontalLeft(worksheet, headerRow9, header9);
    if (data.listTinhTrang !== null && data.listTinhTrang.lenght !== 0) {
      data.listTinhTrang.forEach((element, index) => {
        let arrCell = [
          element.CONTENT
        ];
        let row2 = worksheet.addRow(arrCell);
        let cell = row2.getCell(1);
        worksheet.mergeCells(Number(cell.row), Number(cell.col), Number(cell.row), Number(cell.col) + 13 - 1);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }
    let headerRow10 = worksheet.addRow(header10);
    worksheet = this.addHeaderHorizontalLeft(worksheet, headerRow10, header10);
    if (data.listLuuY !== null && data.listLuuY.lenght !== 0) {
      data.listLuuY.forEach((element, index) => {
        let arrCell = [
          element.CONTENT
        ];
        let row2 = worksheet.addRow(arrCell);
        let cell = row2.getCell(1);
        worksheet.mergeCells(Number(cell.row), Number(cell.col), Number(cell.row), Number(cell.col) + 13 - 1);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

        });
      });
    }
    worksheet.addRow(null);

    let row2 = worksheet.addRow([`Giao ca lúc ${endTimeCa.getHours().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })} giờ ${endTimeCa.getMinutes().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })} ngày ${endTimeCa.getDate().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })} tháng ${(endTimeCa.getMonth() + 1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })} năm ${endTimeCa.getFullYear()}`]);
    let cell2 = row2.getCell(1);
    worksheet.mergeCells(Number(cell2.row), Number(cell2.col), Number(cell2.row), Number(cell2.col) + 3 - 1);

    row2.getCell(1).font = this.fontText;
    row2.getCell(1).alignment = {
      horizontal: 'left',
      vertical: 'middle',
      wrapText: true
    }

    let row3 = worksheet.addRow(["NGƯỜI GIAO CA", "", "", "", "", "NGƯỜI NHẬN CA"]);
    let cell3 = row3.getCell(1);
    worksheet.mergeCells(Number(cell3.row), Number(cell3.col), Number(cell3.row), Number(cell3.col) + 3 - 1);

    row3.getCell(1).font = this.fontHeader;
    row3.getCell(1).alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true
    }
    worksheet.mergeCells(Number(cell3.row), 6, Number(cell3.row), Number(cell3.col) + 12 - 1);
    row3.getCell(6).font = this.fontHeader;
    row3.getCell(6).alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true
    }
    worksheet.addRow(null);
    worksheet.addRow(null);
    worksheet.addRow(null);
    worksheet.addRow(null);

    let row4 = worksheet.addRow([`${data.LIST_GIAO.split(";")[0]}                                        ${data.LIST_GIAO.split(";")[1]}`, "", "", "", "", `${data.LIST_NHAN.split(";")[0]}                                        ${data.LIST_NHAN.split(";")[1]}`]);
    let cell4 = row4.getCell(1);
    worksheet.mergeCells(Number(cell4.row), Number(cell4.col), Number(cell4.row), Number(cell4.col) + 3 - 1);

    row4.getCell(1).font = this.fontHeader;
    row4.getCell(1).alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true
    }
    worksheet.mergeCells(Number(cell4.row), 6, Number(cell4.row), Number(cell4.col) + 12 - 1);
    row4.getCell(6).font = this.fontHeader;
    row4.getCell(6).alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true
    }

    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 60;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 60;
    worksheet.getColumn('F').width = 60;
    worksheet.getColumn('G').width = 60;
    worksheet.getColumn('H').width = 60;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 20;
    worksheet.getColumn('L').width = 60;
    worksheet.getColumn('M').width = 60;
    return workbook;
  }
  showReportBM11(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 10, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "Time stamp" },
      { index: 'B', text: "Milisecond" },
      { index: 'C', text: "B1" },
      { index: 'D', text: "B2" },
      { index: 'E', text: "B3" },
      { index: 'F', text: "Element" },
      { index: 'G', text: "Description" },
      { index: 'H', text: "Status" },
      { index: 'I', text: "Tag" },
      { index: 'J', text: "Operator" },
      { index: 'K', text: "Nguyên nhân thao tác không thành công" },

    ];


    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);

    if (data !== null && data.lenght !== 0) {
      data.forEach((element, index) => {
        let arrCell = [
          this.handleDateTime(element.TIMESTAMP),
          element.MILLI_SECONDS,
          element.B1,
          element.B2,
          element.B3,
          element.ELEMENT,
          element.DESCRIPTION,
          element.STATUS,
          element.TAG,
          element.OPERATOR,
          element.NGUYENNHAN
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }


    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 60;

    return workbook;
  }
  showReportBM12(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 10, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "Stt", rowspan: 3 },
      { index: 'B', text: "Đơn vị", rowspan: 3 },
      { index: 'C', text: "Tên TBA 110kV ĐKX", rowspan: 3 },
      { index: 'D', text: "Tình hình thực hiện điều khiển xa", colspan: 10 },

      { index: 'N', text: "Ghi Chú", rowspan: 3 }
    ];

    const header5 = [

      {}, {}, {},
      { index: 'D', text: "Chương trình", rowspan: 2 },
      { index: 'E', text: "Tổng số lượng thao tác điều khiển xa", colspan: 3 },

      { index: 'H', text: "Số lượng thao tác điều khiển xa tốt", colspan: 3 },

      { index: 'K', text: "Số lượng thao tác tại thiết bị", colspan: 3 },

      {}
    ];
    const header6 = [
      {}, {}, {}, {},
      { index: 'E', text: "110KV" },
      { index: 'F', text: "22KV" },
      { index: 'G', text: "Tổng" },
      { index: 'H', text: "110KV" },
      { index: 'I', text: "22KV" },
      { index: 'J', text: "Tổng" },
      { index: 'K', text: "110KV" },
      { index: 'L', text: "22KV" },
      { index: 'M', text: "Tổng" },
      {}
    ];


    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);
    let headerRow5 = worksheet.getRow(headerRow4.number + 1);
    worksheet = this.addHeader(worksheet, headerRow5, header5);
    let headerRow6 = worksheet.getRow(headerRow4.number + 2);
    worksheet = this.addHeader(worksheet, headerRow6, header6);

    if (data !== null && data.lenght !== 0) {
      data.forEach((element, index) => {
        let arrCell = [
          element.STT,
          element.TEN_DVIQLY,
          element.TEN_TRAM,
          "SP7",
          element.TONG_110,
          element.TONG_22,
          Number(element.TONG_22) + Number(element.TONG_110),
          element.TONG_110_GOOD,
          element.TONG_22_GOOD,
          Number(element.TONG_22_GOOD) + Number(element.TONG_110_GOOD),
          element.TONG_110_TTB,
          element.TONG_22_TTB,
          Number(element.TONG_22_TTB) + Number(element.TONG_110_TTB),
          ""
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }


    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 60;

    return workbook;
  }
  showReportBM13(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 10, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "Stt", rowspan: 3 },
      { index: 'B', text: "Tỉnh", rowspan: 3 },
      { index: 'C', text: "Công tác", colspan: 2 },
      { index: 'E', text: "Ghi chú", rowspan: 3 },
    ];

    const header5 = [
      {}, {},
      { index: 'D', text: "ĐD 110kV" },
      { index: 'E', text: "ĐD 22kV" },
      {}
    ];


    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);
    let headerRow5 = worksheet.getRow(headerRow4.number + 1);
    worksheet = this.addHeader(worksheet, headerRow5, header5);

    if (data !== null && data.lenght !== 0) {
      data.forEach((element, index) => {
        let arrCell = [
          element.STT,
          element.ORGDESC,
          element.DZ110,
          element.DZ22,
          ""
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }


    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 60;

    return workbook;
  }
  showReportBM21(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 10, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "STT", rowspan: 3 },
      { index: 'B', text: "Khu vực/TBA 110kV", rowspan: 3 },
      { index: 'C', text: "Tình trạng kết nối và điều khiển", colspan: 8 },
      { index: 'K', text: "Chất lượng tín hiệu (trạng thái, đo lường, cảnh báo)", colspan: 2 },
    ];

    const header5 = [

      {}, {},
      { index: 'C', text: "Mất kết nối", rowspan: 2 },
      { index: 'D', text: "Số lần mất kết nối", rowspan: 2 },
      { index: 'E', text: "Tổng thời gian mất kết nối (giờ)", rowspan: 2 },
      { index: 'F', text: "Tổng số lần điều khiển/tháng", colspan: 2 },
      { index: 'H', text: "Tổng số lần điều khiển không thành công( tính luôn mất kết nối không ĐK được)", colspan: 2 },
      { index: 'J', text: "Nguyên nhân điều khiển không thành công", rowspan: 2 },
      { index: 'K', text: "Đủ", rowspan: 2 },
      { index: 'L', text: "Đúng", rowspan: 2 }
    ];
    const header6 = [
      {}, {}, {}, {},
      {},
      { index: 'F', text: "Cấp điện áp 22kV" },
      { index: 'G', text: "Cấp điện áp 110kV" },
      { index: 'H', text: "Cấp điện áp 22kV" },
      { index: 'I', text: "Cấp điện áp 110kV" },
      {},
      {},
      {}
    ];


    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);
    let headerRow5 = worksheet.getRow(headerRow4.number + 1);
    worksheet = this.addHeader(worksheet, headerRow5, header5);
    let headerRow6 = worksheet.getRow(headerRow4.number + 2);
    worksheet = this.addHeader(worksheet, headerRow6, header6);

    if (data !== null && data.lenght !== 0) {
      data.forEach((element, index) => {
        let arrCell = [
          element.STT,
          element.TEN_DVIQLY,
          element.TONG_MATKETNOI,
          element.TONG_MATKETNOI_KHOIPHUC,
          element.TONG_GIO_MATKETNOI,
          element.TONG_22,
          element.TONG_110,
          element.TONG_22_TTB,
          element.TONG_110_TTB,
          element.NOTE,
          element.DU === 'True' ? 'x' : '',
          element.DUNG === 'True' ? 'x' : ''
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }


    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 60;

    return workbook;
  }
  showReportBM22(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 10, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "STT", rowspan: 2 },
      { index: 'B', text: "Đơn vị", rowspan: 2 },
      { index: 'C', text: "Cấp điện áp (kV)", rowspan: 2 },
      { index: 'D', text: "Tổng số TBA đang vận hành trên lưới", rowspan: 2 },
      { index: 'E', text: "Số TBA đã đồng bộ thời gian (trạm)", colspan: 3 },
      { index: 'H', text: "Số TBA chưa đồng bộ thời gian", rowspan: 2 },
      { index: 'I', text: "Đã đồng bộ", rowspan: 2 },
      { index: 'J', text: "Chưa đồng bộ", rowspan: 2 },
      { index: 'K', text: "Ghi chú", rowspan: 2 },
    ];

    const header5 = [
      {}, {}, {}, {},
      { index: 'E', text: "100 % thiết bị", },
      { index: 'F', text: "Từ 80 đến dưới 100% thiết bị" },
      { index: 'G', text: "Nhỏ hơn 80% thiết bị" },
      {}, {}, {}, {}
    ];


    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);
    let headerRow5 = worksheet.getRow(headerRow4.number + 1);
    worksheet = this.addHeader(worksheet, headerRow5, header5);

    if (data !== null && data.lenght !== 0) {
      data.forEach((item, index) => {
        let arrCell = [
          item.STT,
          item.TEN_DVIQLY,
          item.CAP_DIEN_AP,
          item.TONG_SO_TBI_DANG_VH,
          item.SO_TBI_DA_DONGBO_100,
          item.SO_TBI_DA_DONGBO_80_100,
          item.SO_TBI_DA_DONGBO_0_80,
          item.SO_TBA_CHUA_DONGBO_THOIGIAN,
          item.SO_TBI_DA_DONGBO,
          item.SO_TBI_CHUA_DONGBO,
          item.GHI_CHU,
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }


    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 60;

    return workbook;
  }
  showReportBM22a(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 10, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "STT" },
      { index: 'B', text: "TRẠM 110KV" },
      { index: 'C', text: "NGĂN" },
      { index: 'D', text: "MÃ HIỆU" },
      { index: 'E', text: "ĐỒNG BỘ TỪ GPS TẠI TRẠM" },
      { index: 'F', text: "ĐỒNG BỘ TỪ RTU/GATEWAY      " },
      { index: 'G', text: "CHƯA ĐỒNG BỘ" },
      { index: 'H', text: "NGUYÊN NHÂN CHƯA ĐỒNG BỘ      " },
      { index: 'I', text: "TÌNH TRẠNG VẬN HÀNH       " },
    ];


    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);

    if (data !== null && data.lenght !== 0) {
      data.forEach((item, index) => {
        let arrCell = [
          item.STT,
          item.TEN_TRAM,
          item.NGAN,
          item.MA_HIEU,
          item.DONG_BO === 'GPS' ? 'X' : '',
          item.DONG_BO === 'RTU-GATEWAY' ? 'X' : '',
          item.DONG_BO === 'CHUA' ? 'X' : '',
          item.NGUYEN_NHAN,
          item.TINH_TRANG_VH === 'DUNG' ? 'Đúng thời gian so với RTU_MAIN' : item.TINH_TRANG_VH === 'HIEU_CHINH' ? 'Hiệu chỉnh bằng tay theo thời gian RTU_MAIN' :
            'Chưa đưa vào vận hành'
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }


    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 40;
    worksheet.getColumn('I').width = 40;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 20;

    return workbook;
  }
  showReportBM23(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 10, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "STT", rowspan: 2 },
      { index: 'B', text: "Công Ty Điện Lực", rowspan: 2 },
      { index: 'C', text: "Tổ thao tác lưu động (TTLĐ)", colspan: 3 },
      { index: 'F', text: "Tổ thao tác tại trạm (TTTT)", colspan: 3 },
      { index: 'I', text: "Ghi chú", rowspan: 2 }
    ];

    const header5 = [
      {}, {},
      { index: 'C', text: "Số TTLĐ", },
      { index: 'F', text: "Nhân viên/ tổ" },
      { index: 'G', text: "Phạm vi quản lý  " },
      { index: 'F', text: "Số TTLĐ", },
      { index: 'G', text: "Nhân viên/ tổ" },
      { index: 'H', text: "Phạm vi quản lý  " },
      {}
    ];


    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);
    let headerRow5 = worksheet.getRow(headerRow4.number + 1);
    worksheet = this.addHeader(worksheet, headerRow5, header5);

    if (data !== null && data.lenght !== 0) {
      data.forEach((main, index) => {
        let arrCell = [
          main.STT,
          main.TEN_DVIQLY,
          main.LD_SO_TO,
          main.LD_SO_NV,
          main.LD_PHAM_VI,
          main.TT_SO_TO,
          main.TT_SO_NV,
          main.TT_PHAM_VI,
          main.GHI_CHU,
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }


    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 60;

    return workbook;
  }
  showReportDMTinh(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 10, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "Mã tỉnh" },
      { index: 'B', text: "Mã đơn vị quản lý" },
      { index: 'C', text: "Tên tỉnh" },
      { index: 'D', text: "Tên đơn vị quản lý" },
      { index: 'E', text: "Tên phát tuyến" }
    ];

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);

    if (data !== null && data.lenght !== 0) {
      data.forEach((main, index) => {
        let arrCell = [
          main.MA_TINH,
          main.MA_DVIQLY,
          main.TEN_TINH,
          main.TEN_DVIQLY,
          main.TEN_PHATTUYEN
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }


    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 60;

    return workbook;
  }
  showReportDMTBASPC(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 10, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "Mã trạm" },
      { index: 'B', text: "Tên tỉnh" },
      { index: 'C', text: "Tên trạm" },
      { index: 'D', text: "Tên B1" },
      { index: 'E', text: "Tên phát tuyến" }
    ];

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);

    if (data !== null && data.lenght !== 0) {
      data.forEach((main, index) => {
        let arrCell = [
          main.MA_TRAM,
          main.TEN_TINH,
          main.TEN_TRAM,
          main.TEN_B1,
          main.TEN_PHATTUYEN
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }


    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 60;

    return workbook;
  }
  showReportDMTBAKH(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 10, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "Mã trạm" },
      { index: 'B', text: "Tên tỉnh" },
      { index: 'C', text: "Tên trạm" },
      { index: 'D', text: "Tên B1" }
    ];

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);

    if (data !== null && data.lenght !== 0) {
      data.forEach((main, index) => {
        let arrCell = [
          main.MA_TRAM,
          main.TEN_TINH,
          main.TEN_TRAM,
          main.TEN_B1
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }


    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 60;

    return workbook;
  }
  showReportDMLLTBASPC(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 17, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "STT", rowspan: 2 },
      { index: 'B', text: "Tỉnh", rowspan: 2 },
      { index: 'C', text: "Mã trạm", rowspan: 2 },
      { index: 'D', text: "Tên trạm", rowspan: 2 },
      { index: 'E', text: "Xóa tín hiệu dư", rowspan: 2 },
      { index: 'F', text: "Công suất T1(MVA)", rowspan: 2 },
      { index: 'G', text: "Công suất T2(MVA)", rowspan: 2 },
      { index: 'H', text: "ASDU", rowspan: 2 },
      { index: 'I', text: "ID BACKUP", rowspan: 2 },
      { index: 'J', text: "CMU", rowspan: 2 },
      { index: 'K', text: "RTU MAIN", rowspan: 2 },
      { index: 'L', text: "RTU Bay", rowspan: 2 },
      { index: 'M', text: "Update RTU Config", rowspan: 2 },
      { index: 'N', text: "HMI", rowspan: 2 },
      { index: 'O', text: "Dự án ", rowspan: 2 },
      { index: 'P', text: "Dự án SPC", rowspan: 2 },
      { index: 'Q', text: "VH ĐKX SP7/HMI", rowspan: 2 },
      { index: 'R', text: "ĐKX", rowspan: 2 },
      { index: 'S', text: "VNPT PHONE", rowspan: 2 },
      { index: 'T', text: "VNPT Phone", rowspan: 2 },
      { index: 'U', text: "Ghi Chú", rowspan: 2 },
      { index: 'V', text: "Kết nối A2", colspan: 2 },
      { index: 'X', text: "Trạm biến áp vận hành không người trực", colspan: 2 },
      { index: 'Z', text: "Đưa vào điều khiển xa", colspan: 2 },
      { index: 'AB', text: "End-to-End về EVNSPC", colspan: 3 },
      { index: 'AE', text: "Tín hiệu giám sát nguồn DC", colspan: 2 },
      { index: 'AG', text: "Lắp thiết bị F90", colspan: 4 },
      { index: 'AK', text: "Lắp relay 87B", colspan: 2 },
      { index: 'AM', text: "Lắp relay 87L", colspan: 3 },
      { index: 'AP', text: "Deadbanb (8458/EVN SPC-KT ngày 30/9/2020)", colspan: 2 },
      { index: 'AR', text: "Xóa tín hiệu dư thừa", colspan: 2 },
      { index: 'AT', text: "Ngăn phát tuyến 22kV & 35kV", colspan: 2 },
      { index: 'AV', text: "Số ngăn tụ bù 22kV", colspan: 2 },
      { index: 'AX', text: "Tổng số ngăn lộ", rowspan: 2 },
      { index: 'AY', text: "Tủ hợp bộ", rowspan: 2 },
      { index: 'AZ', text: "Ngoài trời", rowspan: 2 },
    ];
    const header5 = [

      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
      { index: 'V', text: "Kết nối A2 giao thức" },
      { index: 'W', text: "Văn bản xác nhận" },
      { index: 'X', text: "Vận hành" },
      { index: 'Y', text: "Văn bản xác nhận" },
      { index: 'Z', text: "NGÀY VH ĐKX" },
      { index: 'AA', text: "Văn bản xác nhận" },
      { index: 'AB', text: "Ngày NT" },
      { index: 'AC', text: "Năm NT" },
      { index: 'AD', text: "Văn bản xác nhận" },
      { index: 'AE', text: "Ngày NT" },
      { index: 'AF', text: "Văn bản xác nhận" },
      { index: 'AG', text: "MBA T1" },
      { index: 'AH', text: "Văn bản xác nhận" },
      { index: 'AI', text: "MBA T2" },
      { index: 'AJ', text: "Văn bản xác nhận" },
      { index: 'AK', text: "Ngày NT" },
      { index: 'AL', text: "Văn bản xác nhận" },
      { index: 'AM', text: "Ngăn lộ" },
      { index: 'AN', text: "Ngày NT" },
      { index: 'AO', text: "Văn bản xác nhận" },
      { index: 'AP', text: "Ngày thực hiện" },
      { index: 'AQ', text: "Văn bản xác nhận" },
      { index: 'AR', text: "Ngày thực hiện" },
      { index: 'AS', text: "Nhân viên thực hiện" },
      { index: 'AT', text: "Tổng số phát tuyến" },
      { index: 'AU', text: "Số phát tuyến điều khiển xa từ TTĐK" },
      { index: 'AV', text: "Tổng số" },
      { index: 'AW', text: "Số ngăn điều khiển xa từ TTĐK" },
      {}, {}, {}
    ];

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);
    let headerRow5 = worksheet.getRow(headerRow4.number + 1);
    worksheet = this.addHeader(worksheet, headerRow5, header5);
    if (data !== null && data.lenght !== 0) {
      data.forEach((llTBA, index) => {
        let arrCell = [

          index + 1,
          llTBA.TEN_TINH
          ,

          llTBA.TEN_TRAM
          ,

          llTBA.MA_TRAM
          ,

          llTBA.XOATIN_HIEUDU === 'True' ? 'x' : ''
          ,


          llTBA.CONGSUAT_T1
          ,


          llTBA.CONGSUAT_T2
          ,

          llTBA.ASDU
          ,

          llTBA.ID_BACKUP
          ,

          llTBA.CMU
          ,

          llTBA.RTU_MAIN
          ,

          llTBA.RTU_BAY
          ,

          llTBA.UPDATE_RTU_CONFIG
          ,

          llTBA.HMI
          ,

          llTBA.DU_AN
          ,

          llTBA.DUAN_SPC
          ,

          llTBA.VHDKX_SP7HMI
          ,

          llTBA.DKX
          ,

          llTBA.IP_PHONE
          ,

          llTBA.VNPT_PHONE
          ,

          llTBA.GHI_CHU
          ,

          llTBA.KETNOIA2_GIAOTHUC
          ,

          llTBA.KETNOIA2_VANBANXACNHAN
          ,

          llTBA.TBAVHKNT_DVH_CVH
          ,

          llTBA.TBAVHKNT_VANBANXACNHAN
          ,

          llTBA.DVDKX_NGAYVH_DKX
          ,

          llTBA.DVDKX_VANBANXACNHAN
          ,

          llTBA.ETESPC_NGAYNT
          ,

          llTBA.ETESPC_NAMNT
          ,

          llTBA.ETESPC_VANBANXACNHAN
          ,

          llTBA.THGSNDC_NGAYNT
          ,

          llTBA.THGSNDC_VANBANXACNHAN
          ,

          llTBA.LTBF90_MBAT1
          ,

          llTBA.LTBF90_VANBANXACNHANT1
          ,

          llTBA.LTBF90_MBAT2
          ,

          llTBA.LTBF90_VANBANXACNHANT2
          ,


          llTBA.RELAY87B_NGAYNT
          ,

          llTBA.RELAY87B_XACNHAN
          ,


          llTBA.RELAY87L_NGANLO
          ,

          llTBA.RELAY87L_NGAYNT
          ,

          llTBA.RELAY87L_VANBANXACNHAN
          ,


          llTBA.DEADDBANB_NGAYTHUCHIEN
          ,

          llTBA.DEADDBANB_VANBANXACNHAN
          ,

          llTBA.XTHDT_NGAYTHUCHIEN
          ,

          llTBA.XTHDT_NHANVIENTHUCHIEN
          ,

          llTBA.NPT22KV35KV_TONGSOPHATTUYEN
          ,

          llTBA.NPT22KV35KV_SPTDKX_TTDK
          ,

          llTBA.SNTB22KV_TONGSO
          ,

          llTBA.SNTB22KV_SNDKX_TTDK
          ,

          llTBA.TONGSO_NGANLO
          ,

          llTBA.TUHOPBO
          ,

          llTBA.NGOAI_TROI
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }

    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 60;
    worksheet.getColumn('D').width = 60;
    worksheet.getColumn('E').width = 60;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 20;
    worksheet.getColumn('L').width = 20;
    worksheet.getColumn('M').width = 20;
    worksheet.getColumn('N').width = 20;
    worksheet.getColumn('O').width = 60;
    worksheet.getColumn('P').width = 60;
    worksheet.getColumn('Q').width = 60;
    return workbook;
  }
  showReportDMLLTBAKH(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 17, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "STT", rowspan: 2 },
      { index: 'B', text: "Tỉnh", rowspan: 2 },
      { index: 'C', text: "Tên Trạm/Nhà máy điện", rowspan: 2 },
      { index: 'D', text: "Liên hệ khách hàng", rowspan: 2 },
      { index: 'E', text: "Phương án đấu nối ", rowspan: 2 },
      { index: 'F', text: "Thiết bị đấu nối", rowspan: 2 },
      { index: 'G', text: "Ngày vận hành", rowspan: 2 },
      { index: 'H', text: "NL tái tạo", colspan: 5 },
      { index: 'M', text: "NL khác" },
      { index: 'N', text: "Cấp điện áp", colspan: 3 },
      { index: 'Q', text: "Công suất", colspan: 3 },
      { index: 'T', text: "Kết nối SCADA về EVN SPC", colspan: 6 },
      { index: 'Z', text: "Kết nối SCADA về A2 Theo VB 6454/EVN SPC-KT ngày 31/7/2020", colspan: 3 },
      { index: 'AC', text: "Lắp đặt thiết bị giám sát chất lượng điện năng", colspan: 2 },
      { index: 'AE', text: "Xóa tín hiệu dư thừa	", colspan: 2 },

    ];
    const header5 = [

      {}, {}, {}, {}, {}, {}, {},
      { index: 'H', text: "Diesel" },
      { index: 'I', text: "NMĐ gió" },
      { index: 'J', text: "NMĐ mặt trời" },
      { index: 'K', text: "NM nhiệt điện" },
      { index: 'L', text: "NM thủy điện" },
      { index: 'M', text: "Nghành nghề" },
      { index: 'N', text: "220 kV" },
      { index: 'O', text: "110 kV" },
      { index: 'P', text: "22 kV" },
      { index: 'Q', text: "Lắp đặt MVA" },
      { index: 'R', text: "MW MWp" },
      { index: 'S', text: "Vận hành" },
      { index: 'T', text: "Giao thức" },
      { index: 'U', text: "Ngày nghiệm thu" },
      { index: 'V', text: "Năm NT" },
      { index: 'W', text: "Năm NT" },
      { index: 'X', text: "Văn bản xác nhận" },
      { index: 'Y', text: "Point" },
      { index: 'Z', text: "Giao thức" },
      { index: 'AA', text: "Ngày nghiệm thu" },
      { index: 'AB', text: "Văn bản xác nhận" },
      { index: 'AC', text: "Ngày NT" },
      { index: 'AD', text: "Văn bản xác nhận" },
      { index: 'AE', text: "Ngày thực hiện" },
      { index: 'AF', text: "Nhân viên thực hiện" }

    ];

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);
    let headerRow5 = worksheet.getRow(headerRow4.number + 1);
    worksheet = this.addHeader(worksheet, headerRow5, header5);
    if (data !== null && data.lenght !== 0) {
      data.forEach((llTKH, index) => {
        let arrCell = [
          index + 1,
          llTKH.TEN_TINH
          ,

          llTKH.TEN_TRAM
          ,

          llTKH.TTKH_LIENHE
          ,


          llTKH.TTKH_PHUONGAN
          ,

          llTKH.TTKH_THIETBIDAUNOI
          ,

          llTKH.TTKH_NGAYVANHANH
          ,

          llTKH.NLTT === 'NLTT_DIESEL' ? 'x' : ''
          ,

          llTKH.NLTT === 'NLTT_NMDGIO' ? 'x' : ''
          ,

          llTKH.NLTT === 'NLTT_NMDMATTROI' ? 'x' : ''
          ,

          llTKH.NLTT === 'NLTT_NMNHIETDIEN' ? 'x' : ''
          ,

          llTKH.NLTT === 'NLTT_NMTHUYDIEN' ? 'x' : ''
          ,

          llTKH.NLTT === 'NLK_NGANHNGHE' ? 'x' : ''
          ,

          llTKH.CDA === 'CDA_220KV' ? 'x' : ''
          ,

          llTKH.CDA === 'CDA_110KV' ? 'x' : ''
          ,

          llTKH.CDA === 'CDA_22KV' ? 'x' : ''
          ,

          llTKH.CS_LAPDATMVA
          ,

          llTKH.CS_MWMWP
          ,

          llTKH.CS_VANHANH
          ,

          llTKH.SCADASPC_GIAOTHUC
          ,

          llTKH.SCADASPC_NGAYNGHIEMTHU
          ,


          llTKH.SCADASPC_NAMNT1
          ,

          llTKH.SCADASPC_NAMNT2
          ,

          llTKH.SCADASPC_VANBANXACNHAN
          ,

          llTKH.SCADASPC_POINT
          ,

          llTKH.SCADAA2_GIAOTHUC
          ,

          llTKH.SCADAA2_NGAYNHIEMTHU
          ,

          llTKH.SCADAA2_VANBANXACNHAN
          ,

          llTKH.LDTBGSCLDN_NGAYNT
          ,

          llTKH.LDTBGSCLDN_VANBANXACNHAN
          ,

          llTKH.XTHDT_NGAYTHUCHIEN
          ,

          llTKH.XTHDT_NHANVIENTHUCHIEN
          ,
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }

    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 60;
    worksheet.getColumn('D').width = 60;
    worksheet.getColumn('E').width = 60;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 20;
    worksheet.getColumn('L').width = 20;
    worksheet.getColumn('M').width = 20;
    worksheet.getColumn('N').width = 20;
    worksheet.getColumn('O').width = 60;
    worksheet.getColumn('P').width = 60;
    worksheet.getColumn('Q').width = 60;
    return workbook;
  }
  showReportDMLLTB22(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 17, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];
    const header4 = [
      { index: 'A', text: "STT", rowspan: 2 },
      { index: 'B', text: "Tên Dơn vị", rowspan: 2 },
      { index: 'C', text: "Tên trạm 110kV", rowspan: 2 },
      { index: 'D', text: "Ngăn lộ 22kV", rowspan: 2 },
      { index: 'E', text: "Tên Thiết bị", rowspan: 2 },
      { index: 'F', text: "Vị trí thiết bị", rowspan: 2 },
      { index: 'G', text: "Loại thiết bị", rowspan: 2 },
      { index: 'H', text: "Tủ điều khiển", colspan: 4 },
      { index: 'L', text: "Kết nối SCADA", colspan: 7 },
      { index: 'S', text: "Giao thức kết nối", rowspan: 2 },
      { index: 'T', text: "Thông tin khách hàng", rowspan: 2 },
      { index: 'U', text: "Đang kết nối", rowspan: 2 },
      { index: 'V', text: "Đang mất kết nối", rowspan: 2 }
    ];
    const header5 = [

      {}, {}, {}, {}, {}, {}, {},
      { index: 'H', text: "Hiệu loại" },
      { index: 'I', text: "Nhà sản xuất      " },
      { index: 'J', text: "Số No" },
      { index: 'K', text: "Năm vận hành" },
      { index: 'L', text: "Kết nối SCADA" },
      { index: 'M', text: "Năm" },
      { index: 'N', text: "Modem" },
      { index: 'O', text: "Tên SCADA" },
      { index: 'P', text: "ASDU" },
      { index: 'Q', text: "Số Imei của modem" },
      { index: 'R', text: "Số điện thoại" },
      {}, {}, {}, {}
    ];

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);

    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);
    let headerRow5 = worksheet.getRow(headerRow4.number + 1);
    worksheet = this.addHeader(worksheet, headerRow5, header5);
    if (data !== null && data.lenght !== 0) {
      data.forEach((llTB22, index) => {
        let arrCell = [
          index + 1,


          llTB22.TEN_TINH
          ,

          llTB22.TEN_TRAM_110
          ,

          llTB22.NGAN_LO
          ,

          llTB22.TEN_THIETBI
          ,
          llTB22.VITRI_THIETBI
          ,

          llTB22.LOAI_THIETBI
          ,

          llTB22.TDK_HIEULOAI
          ,

          llTB22.TDK_NHASANXUAT
          ,

          llTB22.TDK_SONO
          ,
          llTB22.TDK_NAMVANHANH
          ,

          llTB22.SCADA_KETNOI
          ,

          llTB22.SCADA_NAM
          ,

          llTB22.SCADA_MODEM
          ,

          llTB22.SCADA_TEN
          ,

          llTB22.SCADA_ASDU
          ,

          llTB22.SCADA_IMEI
          ,

          llTB22.SCADA_SODIENTHOAI
          ,

          llTB22.GIAOTHUCKETNOI
          ,

          llTB22.TT_KHACHHANG
          ,

          llTB22.DANGKETNOI === 'True' ? 'x' : ''
          ,

          llTB22.DANGKETNOI === 'False' ? 'x' : ''
          ,
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }

    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 60;
    worksheet.getColumn('D').width = 60;
    worksheet.getColumn('E').width = 60;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 20;
    worksheet.getColumn('L').width = 20;
    worksheet.getColumn('M').width = 20;
    worksheet.getColumn('N').width = 20;
    worksheet.getColumn('O').width = 60;
    worksheet.getColumn('P').width = 60;
    worksheet.getColumn('Q').width = 60;
    return workbook;
  }
  showReportBM24A(data: any, fileName, title) {
    const header1 = [
      { index: 'A', text: title, colspan: 17, horizontal: 'middle', vertical: 'left', wrapText: true }
    ];

    const header4 = [
      { index: 'A', text: "Ngày, Giờ", colspan: 2 },
      { index: 'C', text: "TBA/NMĐ/TTĐK/REC/LBS: B3 (ASDU)/Tuyến SDH/IP", rowspan: 2 },
      { index: 'D', text: "ĐƠN VỊ QUẢN LÝ", rowspan: 2 },
      { index: 'E', text: "SỰ KIÊN/ DỊCH VỤ ẢNH HƯỞNG", rowspan: 2 },
      { index: 'F', text: "QUÁ TRÌNH XỬ LÝ",  rowspan: 2},
      { index: 'G', text: "NGUYÊN NHÂN", rowspan: 2 },
      { index: 'H', text: "PHÂN LOẠI SỰ KIỆN",  rowspan: 2},
      { index: 'I', text: "TIẾP NHẬN THÔNG TIN", colspan: 2 },
      { index: 'K', text: "ĐƠN VỊ XỬ LÝ", rowspan: 2 },
      { index: 'L', text: "THỜI GIAN XỬ LÝ", rowspan: 2 },
      { index: 'M', text: "GHI CHÚ/ĐÁNH GIÁ", rowspan: 2 }
    ];
    const header5 = [
      { index: 'A', text: "Bắt đầu"},
      { index: 'B', text: "Kết thúc"},
      {}, {}, {},{}, {}, {},
      { index: 'I', text: "Đơn vị khác"},
      { index: 'J', text: "TTĐH SCADA"},
      {}
    ];
    
    const header7 = [
      { index: 'A', text: '(1.1)' },
      { index: 'B', text: '(1.2)' },
      { index: 'C', text: '(2)' },
      { index: 'D', text: '(3)' },
      { index: 'E', text: '(4)' },
      { index: 'F', text: '(5)' },
      { index: 'G', text: '(6)' },
      { index: 'H', text: '(7)' },
      { index: 'I', text: '(8.1)' },
      { index: 'J', text: '(8.2)' },
      { index: 'K', text: '(9)' },
      { index: 'L', text: '(10)' },
      { index: 'M', text: '(11)' }
    ];
    const header8 = [
      { index: 'A', text: '1. Sự kiện trong ca trực:', colspan: 13 },
    ];
    const header9 = [
      { index: 'A', text: '2. Tình trạng vận hành các thiết bị trong MCC, BCC:', colspan: 17 },
    ];
    const header10 = [
      { index: 'A', text: '3. Các vấn đề lưu ý trong phiên giao-nhận ca: ', colspan: 17 },
    ];

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    let headerRow1 = worksheet.addRow(header1);
    worksheet = this.addHeaderNoBold(worksheet, headerRow1, true, header1);


    let headerRow4 = worksheet.addRow(header4);
    worksheet = this.addHeader(worksheet, headerRow4, header4);
    let headerRow5 = worksheet.getRow(headerRow4.number + 1);
    worksheet = this.addHeader(worksheet, headerRow5, header5);
    // let headerRow6 = worksheet.getRow(headerRow4.number + 2);
    // worksheet = this.addHeader(worksheet, headerRow6, header6);

    let headerRow7 = worksheet.addRow(header7);
    worksheet = this.addHeader(worksheet, headerRow7, header7);
    let headerRow8 = worksheet.addRow(header8);
    worksheet = this.addHeaderHorizontalLeft(worksheet, headerRow8, header8);
    
    if (data !== null && data.lenght !== 0) {
      data.forEach((element, index) => {
        let arrCell = [
          this.handleDateTime(element.START_TIME),
          this.handleDateTime(element.END_TIME),
          element.TEN_TB,
          element.DONVI_QUANLY,
          element.SU_KIEN,
          element.QUA_TRINH,
          element.NGUYEN_NHAN,
          element.LOAI_SUKIEN,
          element.TIEPNHAN_NGOAI,
          element.TIEPNHAN_SCADA,
          element.DONVI_XULY,
          element.THOI_GIAN,
          element.GHI_CHU
        ];
        let row2 = worksheet.addRow(arrCell);
        arrCell.forEach((cell, i) => {
          row2.getCell(i + 1).font = this.fontText;
          row2.getCell(i + 1).merge = this.fontText;
          row2.getCell(i + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
    }

    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 60;
    worksheet.getColumn('D').width = 60;
    worksheet.getColumn('E').width = 60;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 20;
    worksheet.getColumn('L').width = 20;
    worksheet.getColumn('M').width = 20;
    worksheet.getColumn('N').width = 20;
    worksheet.getColumn('O').width = 60;
    worksheet.getColumn('P').width = 60;
    worksheet.getColumn('Q').width = 60;
    return workbook;
  }

  handleDateTime(str) {
    if (str === null || str === undefined || str === "0001-01-01T00:00:00") {
      return null;
    } else {
      let date = new Date(str);
      return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
    }
  }

  getDuringCa(str) {
    try {
      let start = new Date('2022-01-01T' + str.substr(0, 8));
      let end = new Date('2022-01-01T' + str.substr(12, 8));
      if (end <= start) {
        return 24 * 60 - Number((start.getHours() * 60 + start.getMinutes()) - (end.getHours() * 60 + end.getMinutes()));
      } else {
        return Number((end.getHours() * 60 + end.getMinutes()) - (start.getHours() * 60 + start.getMinutes()));
      }
    } catch (ex) {
      return 0;
    }
  }

}