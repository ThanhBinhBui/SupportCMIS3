import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { ScadaService } from '../../services/scada.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-ca-image',
  templateUrl: './ca-image.component.html',
  styleUrls: ['./ca-image.component.css', '../../../../styles.css'],
  providers: [MessageService, ConfirmationService]
})
export class CaImageComponent implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;
  srcImage: any;
  login: any;
  MARGIN_LEFT: any = 0;
  MARGIN_BOTTOM: any = 0;

  constructor(private scadaService: ScadaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Cấu hình ký số', routerLink: 'ca-image' }
    ]);
  }

  ngOnInit() {
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
    this.login = JSON.parse(localStorage.getItem('user'));
    this.scadaService.CA_IMAGE({
      USER_ID: this.login.USER_ID,
      USER_ID_CA: this.login.USER_ID_CA,
    }).subscribe(
      data => {
        if (data.length > 0) {
          this.srcImage = "data:image/png;base64," + data[0].FILE_CONTENT;
          this.MARGIN_LEFT = data[0].MARGIN_LEFT;
          this.MARGIN_BOTTOM = data[0].MARGIN_BOTTOM;
        }
      });
  }

  uploadCAImage() {
    if (this.fileInput.files.length > 0 || this.srcImage) {
      let file = this.fileInput.files[0];
      let myFormFilesToUpload = {
        FILE_CONTENT: file,
        USER_ID: this.login.USER_ID,
        USER_ID_CA: this.login.USER_ID_CA,
        MARGIN_LEFT: this.MARGIN_LEFT,
        MARGIN_BOTTOM: this.MARGIN_BOTTOM
      };
      this.scadaService.CA_IMAGE_CRU(myFormFilesToUpload).subscribe(result => {
        if (result > 0) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Thông báo', detail: 'Cấu hình thành công' });
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
        else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: 'Cấu hình thất bại' });
        }
      });
    }
  }
}