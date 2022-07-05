import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, DatePipe, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CaptchaModule } from 'primeng/captcha';
import localeVi from '@angular/common/locales/vi';
registerLocaleData(localeVi, 'vi');
import { LOCALE_ID } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BadgeModule } from 'primeng/badge';
import { ImportExcelHisMessageComponent } from './components/import-excel-hismessage/import-excel-hismessage.component';
import { Bm01Component } from './components/bm01/bm01.component';
import { Bm01aComponent } from './components/bm01a/bm01a.component';
import { Bm02Component } from './components/bm02/bm02.component';
import { Bm03Component } from './components/bm03/bm03.component';
import { DmTinhComponent } from './components/dm-tinh/dm-tinh.component';
import { DialogModule, Dialog } from 'primeng/dialog';
import { DmTbaSpcComponent } from './components/dm-tba-spc/dm-tba-spc.component';
import { DmTbaKhComponent } from './components/dm-tba-kh/dm-tba-kh.component';
import { DmLltb22Component } from './components/dm-lltb22/dm-lltb22.component';
import { DmLlTbaComponent } from './components/dm-ll-tba/dm-ll-tba.component';
import { DMLLTBAKHComponent } from './components/dm-ll-tba-kh/dm-ll-tba-kh.component';
import { Bm11Component } from './components/bm11/bm11.component';
import { Bm12Component } from './components/bm12/bm12.component';
import { Bm04Component } from './components/bm04/bm04.component';
import { Bm05Component } from './components/bm05/bm05.component';
import { Bm14Component } from './components/bm14/bm14.component';
import { Bm06Component } from './components/bm06/bm06.component';
import { Bm07Component } from './components/bm07/bm07.component';
import { Bm08Component } from './components/bm08/bm08.component'
import { ChartModule } from 'primeng/chart';
import { Bm09Component } from './components/bm09/bm09.component';
import { Bm10Component } from './components/bm10/bm10.component';
import { Bm13Component } from './components/bm13/bm13.component';
import { Bm24Component } from './components/bm24/bm24.component';
import { UserComponent } from './components/user/user.component';
import {MultiSelectModule} from 'primeng/multiselect';
import { Bm21Component } from './components/bm21/bm21.component';
import { Bm22Component } from './components/bm22/bm22.component';
import { Bm23Component } from './components/bm23/bm23.component';
import { Bm22aComponent } from './components/bm22a/bm22a.component';
import { Bm15Component } from './components/bm15/bm15.component';
import { Bm16Component } from './components/bm16/bm16.component';
import { Bm17Component } from './components/bm17/bm17.component';
import { Bm18Component } from './components/bm18/bm18.component';
import { Bm19Component } from './components/bm19/bm19.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Bm20aComponent } from './components/bm20a/bm20a.component';
import { Bm20bComponent } from './components/bm20b/bm20b.component';
import { Bm20cComponent } from './components/bm20c/bm20c.component';
import { LibComponent } from './components/lib/lib.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import {ProgressBarModule} from 'primeng/progressbar';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DmEmailComponent } from './components/dm-email/dm-email.component';
import { DmCaComponent } from './components/dm-ca/dm-ca.component';
import { ImportTinHieuCongSuatComponent } from './components/import-tin-hieu-cong-suat/import-tin-hieu-cong-suat.component';
import { CaImageComponent } from './components/ca-image/ca-image.component';
import { LibCatComponent } from './components/lib-cat/lib-cat.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Bm24aComponent } from './components/bm24a/bm24a.component';
import { Bm24bComponent } from './components/bm24b/bm24b.component';

@NgModule({
  declarations: [
    ImportExcelHisMessageComponent,
    Bm01Component,
    Bm01aComponent,
    Bm02Component,
    Bm03Component,
    DmTinhComponent,
    DmTbaSpcComponent,
    DmTbaKhComponent,
    DmLltb22Component,
    DmLlTbaComponent,
    DMLLTBAKHComponent,
    Bm11Component,
    Bm12Component,
    Bm13Component,
    Bm24Component,
    Bm04Component,
    Bm05Component,
    Bm14Component,
    Bm06Component,
    Bm07Component,
    Bm08Component,
    Bm09Component,
    Bm10Component,
    UserComponent,
    Bm21Component,
    Bm22Component,
    Bm23Component,
    Bm22aComponent,
    Bm10Component,
    Bm10Component,
    Bm15Component,
    Bm16Component,
    Bm17Component,
    Bm18Component,
    Bm19Component,
    DashboardComponent,
    Bm20aComponent,
    Bm20bComponent,
    Bm20cComponent,
    LibComponent,
    DmEmailComponent,
    DmCaComponent,
    ImportTinHieuCongSuatComponent,
    DmCaComponent,
    CaImageComponent,
    LibCatComponent,
    Bm24aComponent,
    Bm24bComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ColorPickerModule,
    ContextMenuModule,
    DataViewModule,
    DropdownModule,
    FieldsetModule,
    PaginatorModule,
    RippleModule,
    TableModule,
    TerminalModule,
    TieredMenuModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    VirtualScrollerModule,
    CaptchaModule,
    TimelineModule,
    RadioButtonModule,
    SplitButtonModule,
    BadgeModule,
    DialogModule,
    MultiSelectModule,
    InputNumberModule,
    FileUploadModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    InputTextareaModule,
    DialogModule,
    InputTextareaModule,
    InputSwitchModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: "vi-VN" },
    MessageService,
    DatePipe,
    ConfirmationService
  ]
})
export class ScadaModule { }
