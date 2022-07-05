import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  menuClick: boolean;

  menuButtonClick: boolean;

  topbarMenuButtonClick: boolean;

  topbarMenuClick: boolean;

  topbarMenuActive: boolean;

  activeTopbarItem: Element;

  layoutMode = 'static';

  sidebarActive: boolean;

  mobileMenuActive: boolean;

  darkMenu = false;

  isRTL = false;

  menuHoverActive: boolean;

  resetMenu: boolean;

  configActive: boolean;

  configClick: boolean;

  inputStyle = 'outlined';

  ripple = true;

  compactMode = false;

  constructor(private menuService: MenuService, private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  onWrapperClick(): void {
    if (!this.menuClick && !this.menuButtonClick) {
      this.mobileMenuActive = false;
    }

    if (!this.topbarMenuClick && !this.topbarMenuButtonClick) {
      this.topbarMenuActive = false;
      this.activeTopbarItem = null;
    }

    if (!this.menuClick) {
      if (this.isHorizontal()) {
        this.menuService.reset();
      }

      this.menuHoverActive = false;
    }

    if (this.configActive && !this.configClick) {
      this.configActive = false;
    }

    this.configClick = false;
    this.menuClick = false;
    this.menuButtonClick = false;
    this.topbarMenuClick = false;
    this.topbarMenuButtonClick = false;
  }

  onMenuButtonClick(event: Event): void {
    this.menuButtonClick = true;

    if (this.isMobile()) {
      this.mobileMenuActive = !this.mobileMenuActive;
    }

    event.preventDefault();
  }

  onTopbarMobileMenuButtonClick(event: Event): void {
    this.topbarMenuButtonClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;
    event.preventDefault();
  }

  onTopbarRootItemClick(event: Event, item: Element): void {
    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = null;
    } else {
      this.activeTopbarItem = item;
    }

    event.preventDefault();
  }

  onTopbarMenuClick(event: Event): void {
    this.topbarMenuClick = true;
  }

  onSidebarClick(event: Event): void {
    this.menuClick = true;
    this.resetMenu = false;
  }

  onConfigClick(event): void {
    this.configClick = true;
  }

  onRippleChange(event): void {
    this.ripple = event.checked;
  }

  onToggleMenuClick(event: Event): void {
    this.layoutMode = this.layoutMode !== 'static' ? 'static' : 'overlay';
    event.preventDefault();
  }

  isMobile(): boolean {
    return window.innerWidth <= 1024;
  }

  isTablet(): boolean {
    const width = window.innerWidth;
    return width <= 1024 && width > 640;
  }

  isDesktop(): boolean {
    return window.innerWidth > 1024;
  }

  isHorizontal(): boolean {
    return this.layoutMode === 'horizontal';
  }

  isOverlay(): boolean {
    return this.layoutMode === 'overlay';
  }
}
