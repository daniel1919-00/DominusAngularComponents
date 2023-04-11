import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule} from "@angular/router";
import {dominusRoutes} from "./dominus-routes";
import {MatSidenavModule} from "@angular/material/sidenav";
import {SidenavMenuItemComponent} from "./components/sidenav-menu-item/sidenav-menu-item.component";
import {MatToolbarModule} from "@angular/material/toolbar";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(dominusRoutes),
        BrowserAnimationsModule,
        MatSidenavModule,
        SidenavMenuItemComponent,
        SidenavMenuItemComponent,
        MatToolbarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
