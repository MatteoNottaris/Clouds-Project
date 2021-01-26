import { Component, OnInit } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { CovidinfoService } from '../covidinfo.service';
import { User } from '../user.model';
import { covidData_world } from '../data/world-data/covidData_world';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CountriesDataComponent } from '../data/countries-data/countries-data.component';
import { WorldDataComponent } from '../data/world-data/world-data.component';
import { covidData_countries } from '../data/countries-data/covidData_countries';




@Component({
  selector: 'app-covidinfo',
  templateUrl: './covidinfo.component.html',
  styleUrls: ['./covidinfo.component.css']
})
export class CovidinfoComponent implements OnInit {
  [x: string]: any;

  user : User;
  

  constructor(public covidinfoService: CovidinfoService,
    private http: HttpClient,
    ) { }

  ngOnInit(): void {
    this.user = this.covidinfoService.getUser();
  }

  

  assignComponent(component){
    if(component==='world_data'){
      this.dataComponent = WorldDataComponent;
    }
    else{
      this.dataComponent = CountriesDataComponent;
    }
  }


  

}
