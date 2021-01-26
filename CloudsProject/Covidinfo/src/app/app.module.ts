import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import{AngularFireModule} from '@angular/fire';
import{ AngularFirestoreModule} from '@angular/fire/firestore'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { SigninComponent } from './signin/signin.component';
import { CovidinfoComponent } from './covidinfo/covidinfo.component';

import {HttpClientModule} from '@angular/common/http';
import { WorldDataComponent } from './data/world-data/world-data.component';
import { CountriesDataComponent } from './data/countries-data/countries-data.component';

import{ChartsModule} from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    CovidinfoComponent,
    WorldDataComponent,
    CountriesDataComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule,
  ],entryComponents:[WorldDataComponent,CountriesDataComponent],
  providers: [],
  bootstrap: [AppComponent]
}) 
export class AppModule { }
