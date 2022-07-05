import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from '../../../app.breadcrumb.service';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.css']
})
export class EmptyComponent implements OnInit {

  constructor(private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Pages' },
      { label: 'Empty Page' }
    ]);
  }

  ngOnInit(): void {
  }

}
