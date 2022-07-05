import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';

import { MainComponent } from './core/components/main/main.component';
import { LoginComponent } from './core/components/login/login.component';
import { AccessdeniedComponent } from './core/pages/accessdenied/accessdenied.component';
import { NotfoundComponent } from './core/pages/notfound/notfound.component';
import { ErrorComponent } from './core/pages/error/error.component';
import { Bm01Component } from './scada/components/bm01/bm01.component';
import { Bm03Component } from './scada/components/bm03/bm03.component';
import { Bm02Component } from './scada/components/bm02/bm02.component';
import { Bm01aComponent } from './scada/components/bm01a/bm01a.component';
import { DmTinhComponent } from './scada/components/dm-tinh/dm-tinh.component';
import { DmTbaSpcComponent } from './scada/components/dm-tba-spc/dm-tba-spc.component';
import { DmTbaKhComponent } from './scada/components/dm-tba-kh/dm-tba-kh.component';
import { DmLltb22Component } from './scada/components/dm-lltb22/dm-lltb22.component';
import { DmLlTbaComponent } from './scada/components/dm-ll-tba/dm-ll-tba.component';
import { DMLLTBAKHComponent } from './scada/components/dm-ll-tba-kh/dm-ll-tba-kh.component';
import { ImportExcelHisMessageComponent } from './scada/components/import-excel-hismessage/import-excel-hismessage.component';
import { Bm11Component } from './scada/components/bm11/bm11.component';
import { Bm12Component } from './scada/components/bm12/bm12.component';
import { Bm04Component } from './scada/components/bm04/bm04.component';
import { Bm05Component } from './scada/components/bm05/bm05.component';
import { Bm14Component } from './scada/components/bm14/bm14.component';
import { Bm06Component } from './scada/components/bm06/bm06.component';
import { Bm07Component } from './scada/components/bm07/bm07.component';
import { Bm08Component } from './scada/components/bm08/bm08.component';
import { Bm09Component } from './scada/components/bm09/bm09.component';
import { Bm10Component } from './scada/components/bm10/bm10.component';
import { Bm24Component } from './scada/components/bm24/bm24.component';
import { Bm13Component } from './scada/components/bm13/bm13.component';
import { UserComponent } from './scada/components/user/user.component';
import { Bm21Component } from './scada/components/bm21/bm21.component';
import { Bm22Component } from './scada/components/bm22/bm22.component';
import { Bm22aComponent } from './scada/components/bm22a/bm22a.component';
import { Bm23Component } from './scada/components/bm23/bm23.component';
import { Bm15Component } from './scada/components/bm15/bm15.component';
import { Bm16Component } from './scada/components/bm16/bm16.component';
import { Bm17Component } from './scada/components/bm17/bm17.component';
import { Bm18Component } from './scada/components/bm18/bm18.component';
import { Bm19Component } from './scada/components/bm19/bm19.component';
import { Bm20aComponent } from './scada/components/bm20a/bm20a.component';
import { Bm20bComponent } from './scada/components/bm20b/bm20b.component';
import { Bm20cComponent } from './scada/components/bm20c/bm20c.component';
import { DashboardComponent } from './scada/components/dashboard/dashboard.component';
import { LibComponent } from './scada/components/lib/lib.component';
import { DmCaComponent } from './scada/components/dm-ca/dm-ca.component';
import { DmEmailComponent } from './scada/components/dm-email/dm-email.component';
import { ImportTinHieuCongSuatComponent } from './scada/components/import-tin-hieu-cong-suat/import-tin-hieu-cong-suat.component';
import { CaImageComponent } from './scada/components/ca-image/ca-image.component';
import { LibCatComponent } from './scada/components/lib-cat/lib-cat.component';
import { Bm24aComponent } from './scada/components/bm24a/bm24a.component';
import { Bm24bComponent } from './scada/components/bm24b/bm24b.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: MainComponent,
                children: [
                    { path: '', component: DashboardComponent,canActivate: [AuthGuard] },
                    { path: 'ThietBiTreoThao', component: LibComponent,canActivate: [AuthGuard] },
                    { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard] },
                    { path: 'ca-image', component: CaImageComponent, canActivate: [AuthGuard] },
                    { path: 'admin/dmca', component: DmCaComponent, canActivate: [AuthGuard] },
                    { path: 'admin/dmemail', component: DmEmailComponent, canActivate: [AuthGuard] },
                    { path: 'ccd/bm01', component: Bm01Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'ccd/bm01a', component: Bm01aComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'ccd/bm02', component: Bm02Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'ccd/bm03', component: Bm03Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'ccd/bm04', component: Bm04Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'phutai/bm05', component: Bm05Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'phutai/bm06', component: Bm06Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'phutai/bm07', component: Bm07Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'phutai/bm08', component: Bm08Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'phutai/bm09', component: Bm09Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'phutai/bm10', component: Bm10Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'ttdk/bm11', component: Bm11Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'ttdk/bm12', component: Bm12Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'ttdk/bm13', component: Bm13Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'kenhtruyen/bm14', component: Bm14Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'kenhtruyen/bm15', component: Bm15Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'kenhtruyen/bm16', component: Bm16Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'kenhtruyen/bm17', component: Bm17Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'kenhtruyen/bm18', component: Bm18Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'kenhtruyen/bm19', component: Bm19Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'thietbi/bm20a', component: Bm20aComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'thietbi/bm20b', component: Bm20bComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'thietbi/bm20c', component: Bm20cComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'thietbi/bm21', component: Bm21Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'thietbi/bm22', component: Bm22Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'thietbi/bm22a', component: Bm22aComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'thietbi/bm23', component: Bm23Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'nkvh/so', component: Bm24Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'nkvh/thongkesukienNKVH', component: Bm24aComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'nkvh/xulysukienNKVH', component: Bm24bComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI', 'BAO_CAO'] } },
                    { path: 'admin/account', component: UserComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI'] } },
                    { path: 'admin/dmTinh', component: DmTinhComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI'] } },
                    { path: 'admin/dmTBASPC', component: DmTbaSpcComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI'] } },
                    { path: 'admin/dmTBAKH', component: DmTbaKhComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI'] } },
                    { path: 'admin/importHISMessage', component: ImportExcelHisMessageComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI'] } },
                    { path: 'admin/importTinHieuCongSuat', component: ImportTinHieuCongSuatComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI'] } },
                    { path: 'admin/lib-cat', component: LibCatComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI'] } },
                    { path: 'admin/dmLLTB22', component: DmLltb22Component, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI'] } },
                    { path: 'admin/dmLLTBA', component: DmLlTbaComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI'] } },
                    { path: 'admin/dmLLTKH', component: DMLLTBAKHComponent, canActivate: [AuthGuard], data: { roles: ['QUAN_TRI'] } }
                ]
            },
            { path: 'error', component: ErrorComponent },
            { path: 'access', component: AccessdeniedComponent },
            { path: 'notfound', component: NotfoundComponent },
            { path: 'login', component: LoginComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }