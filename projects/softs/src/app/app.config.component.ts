import {Component, OnInit} from '@angular/core';
import {AppMainComponent} from './app.main.component';

@Component({
    selector: 'app-config',
    template: `
        <div class="layout-config" [ngClass]="{'layout-config-active': app.configActive}" (click)="app.onConfigClick($event)">
            <a style="cursor: pointer" id="layout-config-button" class="layout-config-button" (click)="onConfigButtonClick($event)">
                <i class="pi pi-cog"></i>
            </a>
            <a style="cursor: pointer" class="layout-config-close" (click)="onConfigCloseClick($event)">
                <i class="pi pi-times"></i>
            </a>
            <div class="layout-config-content">
                <h5 style="margin-top: 0">Input Style</h5>
                <div class="p-formgroup-inline">
                    <div class="p-field-radiobutton">
                        <p-radioButton name="inputStyle" value="outlined" [(ngModel)]="app.inputStyle"
                                       inputId="inputStyle1"></p-radioButton>
                        <label for="inputStyle1">Outlined</label>
                    </div>
                    <div class="p-field-radiobutton">
                        <p-radioButton name="inputStyle" value="filled" [(ngModel)]="app.inputStyle" inputId="inputStyle2"></p-radioButton>
                        <label for="inputStyle2">Filled</label>
                    </div>
                </div>

                <h5>Ripple Effect</h5>
                <p-inputSwitch [ngModel]="app.ripple" (onChange)="app.onRippleChange($event)"></p-inputSwitch>

                <h5>Menu Type</h5>
                <div class="p-formgroup-inline">
                    <div class="p-field-radiobutton">
                        <p-radioButton name="layoutMode" value="overlay" [(ngModel)]="app.layoutMode" inputId="mode1"></p-radioButton>
                        <label for="mode1">Vertical</label>
                    </div>
                    <div class="p-field-radiobutton">
                        <p-radioButton name="layoutMode" value="horizontal" [(ngModel)]="app.layoutMode" inputId="mode2"></p-radioButton>
                        <label for="mode2">Horizontal</label>
                    </div>
                </div>

                <h5>Menu Colors</h5>
                <div class="p-formgroup-inline">
                    <div class="p-field-radiobutton">
                        <p-radioButton name="darkMenu" [value]="true" [(ngModel)]="app.darkMenu" inputId="darkMenu1"></p-radioButton>
                        <label for="darkMenu1">Dark</label>
                    </div>
                    <div class="p-field-radiobutton">
                        <p-radioButton name="darkMenu" [value]="false" [(ngModel)]="app.darkMenu" inputId="darkMenu2"></p-radioButton>
                        <label for="darkMenu2">Light</label>
                    </div>
                </div>

                <h5>Orientation</h5>
                <div class="p-formgroup-inline">
                    <div class="p-field-radiobutton">
                        <p-radioButton name="isRTL" [value]="false" [(ngModel)]="app.isRTL" inputId="isRTL1"></p-radioButton>
                        <label for="isRTL1">LTR</label>
                    </div>
                    <div class="p-field-radiobutton">
                        <p-radioButton name="isRTL" [value]="true" [(ngModel)]="app.isRTL" inputId="isRTL2"></p-radioButton>
                        <label for="isRTL2">RTL</label>
                    </div>
                </div>

                <h5>Theme Modes</h5>
                <div class="p-formgroup-inline">
                    <div class="p-field-radiobutton">
                        <p-radioButton name="compactMode" [value]="true" [(ngModel)]="app.compactMode" inputId="compactMode1"
                                       (onClick)="changeThemeStyle($event, true)"></p-radioButton>
                        <label for="compactMode1">Compact</label>
                    </div>
                    <div class="p-field-radiobutton">
                        <p-radioButton name="compactMode" [value]="false" [(ngModel)]="app.compactMode" inputId="compactMode2"
                                       (onClick)="changeThemeStyle($event, false)"></p-radioButton>
                        <label for="compactMode2">Standart</label>
                    </div>
                </div>

                <h5>Flat Layouts</h5>
                <div class="layout-themes">
                    <div *ngFor="let flatLayout of flatLayoutColors">
                        <a style="cursor: pointer" class="flat-layouts" (click)="changeLayout(flatLayout.label)"
                           [ngStyle]="{'background-color': flatLayout.color}">
                            <i class="pi pi-check" *ngIf="layout === flatLayout.label"></i>
                        </a>
                    </div>
                </div>

                <h5>Special Layouts</h5>
                <div class="layout-themes">
                    <div *ngFor="let specialLayout of specialLayoutColors">
                        <a style="cursor: pointer" (click)="changeLayout(specialLayout.label)">
                            <img src="assets/layout/images/configurator/layout/special/{{specialLayout.image}}.png"
                                 [alt]="specialLayout.label"/>
                            <i class="pi pi-check" *ngIf="layout === specialLayout.label"></i>
                        </a>
                    </div>
                </div>

                <h5>Themes</h5>
                <div class="layout-themes">
                    <div *ngFor="let theme of themes">
                        <a style="cursor: pointer" (click)="changeTheme(theme.label)">
                            <img src="assets/layout/images/configurator/theme/{{theme.image}}.svg" [alt]="theme.label"/>
                            <i class="pi pi-check" *ngIf="themeColor === theme.label"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AppConfigComponent implements OnInit {

    themes: any[];

    themeColor = 'bluegrey';

    layout = 'moody';

    flatLayoutColors: any[];

    specialLayoutColors: any[];

    constructor(public app: AppMainComponent) {
    }

    ngOnInit() {
        this.flatLayoutColors = [
            {name: 'Amber Pink', label: 'amber', color: '#FFB300'},
            {name: 'Blue Amber', label: 'blue', color: '#1E88E5'},
            {name: 'Blue Grey Green', label: 'bluegrey', color: '#607D8B'},
            {name: 'Brown Cyan', label: 'brown', color: '#795548'},
            {name: 'Cyan Amber', label: 'cyan', color: '#00BCD4'},
            {name: 'Deep Orange Cyan', label: 'deeporange', color: '#F4511E'},
            {name: 'Deep Purple Orange', label: 'deeppurple', color: '#5E35B1'},
            {name: 'Green Brown', label: 'green', color: '#43A047'},
            {name: 'Grey Indigo', label: 'grey', color: '#757575'},
            {name: 'Indigo Pink', label: 'indigo', color: '#3f51b5'},
            {name: 'Light Blue Blue Grey', label: 'lightblue', color: '#03A9F4'},
            {name: 'Light Green Purple', label: 'lightgreen', color: '#7CB342'},
            {name: 'Lime Blue Grey', label: 'lime', color: '#C0CA33'},
            {name: 'Orange Indigo', label: 'orange', color: '#FB8C00'},
            {name: 'Pink Amber', label: 'pink', color: '#D81B60'},
            {name: 'Purple Pink', label: 'purple', color: '#8E24AA'},
            {name: 'Teal Red', label: 'teal', color: '#009688'},
            {name: 'Yellow Teal', label: 'yellow', color: '#FBC02D'},
        ];
        this.specialLayoutColors = [
            {image: 'reflection', label: 'reflection'},
            {image: 'moody', label: 'moody'},
            {image: 'cityscape', label: 'cityscape'},
            {image: 'cloudy', label: 'cloudy'},
            {image: 'storm', label: 'storm'},
            {image: 'palm', label: 'palm'},
            {image: 'flatiron', label: 'flatiron'}
        ];
        this.themes = [
            {image: 'bluegrey-green', label: 'bluegrey'},
            {image: 'indigo-pink', label: 'indigo'},
            {image: 'pink-amber', label: 'pink'},
            {image: 'purple-pink', label: 'purple'},
            {image: 'deeppurple-orange', label: 'deeppurple'},
            {image: 'blue-amber', label: 'blue'},
            {image: 'lightblue-bluegrey', label: 'lightblue'},
            {image: 'cyan-amber', label: 'cyan'},
            {image: 'teal-red', label: 'teal'},
            {image: 'green-brown', label: 'green'},
            {image: 'lightgreen-purple', label: 'lightgreen'},
            {image: 'lime-bluegrey', label: 'lime'},
            {image: 'yellow-teal', label: 'yellow'},
            {image: 'amber-pink', label: 'amber'},
            {image: 'orange-indigo', label: 'orange'},
            {image: 'deeporange-cyan', label: 'deeporange'},
            {image: 'brown-cyan', label: 'brown'},
            {image: 'grey-indigo', label: 'grey'}
        ];
    }

    changeTheme(theme) {
        this.themeColor = theme;
        if (this.app.compactMode) {
            this.changeStyleSheetsColor('theme-css', 'theme-' + theme + '-compact.css');
        } else {
            this.changeStyleSheetsColor('theme-css', 'theme-' + theme + '.css');
        }
    }

    changeLayout(layout) {
        this.layout = layout;
        this.changeStyleSheetsColor('layout-css', 'layout-' + layout + '.css');
    }

    changeThemeStyle(event, compactMode) {
        if (compactMode) {
            this.changeStyleSheetsColor('theme-css', 'theme-' + this.themeColor + '-compact.css');
        } else {
            this.changeStyleSheetsColor('theme-css', 'theme-' + this.themeColor + '.css');
        }
    }

    changeStyleSheetsColor(id, value) {
        const element = document.getElementById(id);
        const urlTokens = element.getAttribute('href').split('/');
        urlTokens[urlTokens.length - 1] = value;

        const newURL = urlTokens.join('/');

        this.replaceLink(element, newURL);
    }

    replaceLink(linkElement, href) {
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

    onConfigButtonClick(event) {
        this.app.configActive = !this.app.configActive;
        event.preventDefault();
    }

    onConfigCloseClick(event) {
        this.app.configActive = false;
        event.preventDefault();
    }

    isIE() {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    }
}
