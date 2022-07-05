import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../../core/components/main/main.component';
import { environment } from '../../../../environments/environment';
import { MenuService } from '../../services/menu.service';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  model: any[];

  login: any;
  user: any;

  constructor(public app: MainComponent, private menuService: MenuService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    debugger
    switch (this.user.role) {
      case 0:
        this.model = [
          { label: 'Trang chủ', icon: PrimeIcons.HOME, routerLink: [''] },         
        ];
        break;
      case 1:
        this.model = [   
          { label: 'Thiết bị treo tháo', icon: PrimeIcons.FOLDER_OPEN, routerLink: ['ThietBiTreoThao'] },
          { label: 'Hiệu chỉnh chỉ số định kỳ', icon: PrimeIcons.FOLDER_OPEN, routerLink: ['ThietBiTreoThao1'] },
          { label: 'Tính toán hóa đơn', icon: PrimeIcons.FOLDER_OPEN, routerLink: ['ThietBiTreoThao2'] },
        ];
        break;
      default:
        this.model = [
          { label: 'Trang chủ', icon: PrimeIcons.HOME, routerLink: [''] },
          { label: 'Thiết bị treo tháo', icon: PrimeIcons.FOLDER_OPEN, routerLink: ['ThietBiTreoThao'] },
        ];

    }

    

  }

  onMenuClick(): void {
    this.app.menuClick = true;
  }


}
