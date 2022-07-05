import { Component, OnInit } from '@angular/core';
import {MainComponent} from '../main/main.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  themes: any[];

  themeColor = 'bluegrey';

  layout = 'moody';

  flatLayoutColors: any[];

  specialLayoutColors: any[];

  constructor(public app: MainComponent) {
  }

  ngOnInit(): void {
    this.flatLayoutColors = [
      { name: 'Amber Pink', label: 'amber', color: '#FFB300' },
      { name: 'Blue Amber', label: 'blue', color: '#1E88E5' },
      { name: 'Blue Grey Green', label: 'bluegrey', color: '#607D8B' },
      { name: 'Brown Cyan', label: 'brown', color: '#795548' },
      { name: 'Cyan Amber', label: 'cyan', color: '#00BCD4' },
      { name: 'Deep Orange Cyan', label: 'deeporange', color: '#F4511E' },
      { name: 'Deep Purple Orange', label: 'deeppurple', color: '#5E35B1' },
      { name: 'Green Brown', label: 'green', color: '#43A047' },
      { name: 'Grey Indigo', label: 'grey', color: '#757575' },
      { name: 'Indigo Pink', label: 'indigo', color: '#3f51b5' },
      { name: 'Light Blue Blue Grey', label: 'lightblue', color: '#03A9F4' },
      { name: 'Light Green Purple', label: 'lightgreen', color: '#7CB342' },
      { name: 'Lime Blue Grey', label: 'lime', color: '#C0CA33' },
      { name: 'Orange Indigo', label: 'orange', color: '#FB8C00' },
      { name: 'Pink Amber', label: 'pink', color: '#D81B60' },
      { name: 'Purple Pink', label: 'purple', color: '#8E24AA' },
      { name: 'Teal Red', label: 'teal', color: '#009688' },
      { name: 'Yellow Teal', label: 'yellow', color: '#FBC02D' },
    ];
    this.specialLayoutColors = [
      { image: 'reflection', label: 'reflection' },
      { image: 'moody', label: 'moody' },
      { image: 'cityscape', label: 'cityscape' },
      { image: 'cloudy', label: 'cloudy' },
      { image: 'storm', label: 'storm' },
      { image: 'palm', label: 'palm' },
      { image: 'flatiron', label: 'flatiron' }
    ];
    this.themes = [
      { image: 'bluegrey-green', label: 'bluegrey' },
      { image: 'indigo-pink', label: 'indigo' },
      { image: 'pink-amber', label: 'pink' },
      { image: 'purple-pink', label: 'purple' },
      { image: 'deeppurple-orange', label: 'deeppurple' },
      { image: 'blue-amber', label: 'blue' },
      { image: 'lightblue-bluegrey', label: 'lightblue' },
      { image: 'cyan-amber', label: 'cyan' },
      { image: 'teal-red', label: 'teal' },
      { image: 'green-brown', label: 'green' },
      { image: 'lightgreen-purple', label: 'lightgreen' },
      { image: 'lime-bluegrey', label: 'lime' },
      { image: 'yellow-teal', label: 'yellow' },
      { image: 'amber-pink', label: 'amber' },
      { image: 'orange-indigo', label: 'orange' },
      { image: 'deeporange-cyan', label: 'deeporange' },
      { image: 'brown-cyan', label: 'brown' },
      { image: 'grey-indigo', label: 'grey' }
    ];
  }

  changeTheme(theme): void {
    this.themeColor = theme;
    if (this.app.compactMode) {
      this.changeStyleSheetsColor('theme-css', 'theme-' + theme + '-compact.css');
    } else {
      this.changeStyleSheetsColor('theme-css', 'theme-' + theme + '.css');
    }
  }

  changeLayout(layout): void {
    this.layout = layout;
    this.changeStyleSheetsColor('layout-css', 'layout-' + layout + '.css');
  }

  changeThemeStyle(event, compactMode): void {
    if (compactMode) {
      this.changeStyleSheetsColor('theme-css', 'theme-' + this.themeColor + '-compact.css');
    } else {
      this.changeStyleSheetsColor('theme-css', 'theme-' + this.themeColor + '.css');
    }
  }

  changeStyleSheetsColor(id, value): void {
    const element = document.getElementById(id);
    const urlTokens = element.getAttribute('href').split('/');
    urlTokens[urlTokens.length - 1] = value;

    const newURL = urlTokens.join('/');

    this.replaceLink(element, newURL);
  }

  replaceLink(linkElement, href): void {
    if (this.isIE()) {
      linkElement.setAttribute('href', href);
    } else {
      const id = linkElement.getAttribute('id');
      const cloneLinkElement = linkElement.cloneNode(true);

      cloneLinkElement.setAttribute('href', href);
      cloneLinkElement.setAttribute('id', id + '-clone');

      linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

      cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', id);
      });
    }
  }

  onConfigButtonClick(event): void {
    this.app.configActive = !this.app.configActive;
    event.preventDefault();
  }

  onConfigCloseClick(event): void {
    this.app.configActive = false;
    event.preventDefault();
  }

  isIE(): any {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
  }

}
