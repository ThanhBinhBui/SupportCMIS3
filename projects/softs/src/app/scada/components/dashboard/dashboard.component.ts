import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { ScadaService } from '../../services/scada.service';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../../../styles.css']
})
export class DashboardComponent implements OnInit {
  products: any[];

  sortOptions: any[];

  sortOrder: number;

  sortField: string;

  user: any;

  constructor(private router:Router) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.products = [
      {
        "id": "1000",
        "code": "f230fh0g3",
        "name": "CMIS 3",
        "description": "Phần mềm CMIS 3",
        "image": "cmis.jpg",
        "price": 65,
        "category": "Tính năng 1",
        "quantity": 24,
        "inventoryStatus": "INSTOCK",
        "rating": 5,
        "role": 1
      },
      {
        "id": "1001",
        "code": "nvklal433",
        "name": "CMIS2EVNSPC",
        "description": "Quản lý thông tin khách hàng",
        "image": "cmis2.jpg",
        "price": 72,
        "category": "Tính năng 2",
        "quantity": 61,
        "inventoryStatus": "INSTOCK",
        "rating": 4,
        "role": 2
      },
      {
        "id": "1002",
        "code": "zz21cz3c1",
        "name": "KTGSMBD",
        "description": "Phần mềm kiểm tra giám sát mua bán điện",
        "image": "gsmbd.jpg",
        "price": 79,
        "category": "Tính năng 3",
        "quantity": 2,
        "inventoryStatus": "LOWSTOCK",
        "rating": 3,
        "role": 3
      },
      {
        "id": "1003",
        "code": "244wgerg2",
        "name": "Appmeter",
        "description": "Phần mềm Appmeter",
        "image": "appmeter.jpg",
        "price": 29,
        "category": "Tính năng 4",
        "quantity": 25,
        "inventoryStatus": "INSTOCK",
        "rating": 5,
        "role": 4
      }
    ]

    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];
  }

  navigation(role) {
    this.user.role = role;
    // debugger;
    localStorage.setItem('user', JSON.stringify(this.user));
    // this.router.navigate(['/ThietBiTreoThao'])
    console.log(window.location.href);
    window.open(window.location.href+'ThietBiTreoThao', "_blank");
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}