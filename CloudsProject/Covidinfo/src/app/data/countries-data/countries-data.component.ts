import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { covidData_countries } from './covidData_countries';
import { CovidinfoService } from 'src/app/covidinfo.service';
import { dataInfo } from './dataInfo';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { User } from 'src/app/user.model';


@Component({
  selector: 'app-countries-data',
  templateUrl: './countries-data.component.html',
  styleUrls: ['./countries-data.component.css']
})
export class CountriesDataComponent implements OnInit {


  //Declarations
  user :User;
  covidData_countries : covidData_countries[];

  covidData_countriesBis : covidData_countries;
  private summary_url : string = "https://api.covid19api.com/summary";

  covidData_all =[];
  private all_url : string = "https://api.covid19api.com/total/dayone/country/";

  
  check : string ;

  constructor(private http: HttpClient,public covidinfoService: CovidinfoService) { }

  //Pie chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Dead Cases'], ['Recovered Cases'], ['Active Cases']];
  public pieChartData: SingleDataSet = [1,1,1];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


  //Bar chart
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ["0","0" ,"0" ,"0" ,"0" ,"0","0" ];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [], label: 'Total Cases' },
    { data: [], label: 'Total Recoveries' },
    { data: [], label: 'Total Deaths' },
  ];

  //Line chart
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Total Cases' },
    { data: [], label: 'Total Recoveries' },
    { data: [], label: 'Total Death' },
  ];
  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];
  lineChartOptions = {
    responsive: true,
  };
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  //Functions
  ngOnInit(): void {
    this.user = this.covidinfoService.getUser();
    this.getDataSummary().subscribe(data => {
      this.covidData_countries = data.Countries;
      this.getOptions();
    });
  }

  getDataSummary(): Observable<dataInfo>{
    return this.http.get<dataInfo>(this.summary_url)
  }

  getDataAll(country): Observable<any>{
    return this.http.get<any>(this.all_url + country)
  }
  
  getDate():string{
    var date = new Date();
    var new_date = "";
    if(date.getMonth()+1<10){
      let month = "0"+(date.getMonth()+1);
      new_date = date.getFullYear() +"-"+ month +"-"+ date.getDate() ;
    } 
    else{
      let month = date.getMonth();
      new_date = date.getFullYear() +"-"+ month +"-"+ date.getDate() ;
    }
    return new_date
  }

  showData(){
    this.check = "";
    var new_date = this.getDate();
    var country = (<HTMLInputElement>document.querySelector("#select_countries")).value;
    this.covidinfoService.getDataFirebase(country,"summary").subscribe((data : covidData_countries)=>{
      this.covidData_countriesBis = data;
      if(this.covidData_countriesBis==undefined || this.covidData_countriesBis.Date<new_date){
        this.getDataSummary().subscribe(data =>{
          this.covidData_countries = data.Countries;
          for(let i=0;i<this.covidData_countries.length;i++){
            if(this.covidData_countries[i].Country == country){
              this.covidData_countriesBis = this.covidData_countries[i];
              break
            }
          }
          this.covidData_countriesBis.Date = new_date;
          this.covidData_countriesBis.ActiveCases = this.covidData_countriesBis.TotalConfirmed - this.covidData_countriesBis.TotalRecovered;
          this.covidData_countriesBis.MortalityRate = ((this.covidData_countriesBis.TotalDeaths/this.covidData_countriesBis.TotalConfirmed * 100).toFixed(1)).toString()+ " %";
          this.covidData_countriesBis.RecoveryRate = ((this.covidData_countriesBis.TotalRecovered/this.covidData_countriesBis.TotalConfirmed * 100).toFixed(1)).toString()+ " %";
          this.getDataAll(country).subscribe(data=>{
            this.covidData_all = data;
            this.displayChartAll();
            this.displayBarWeekly();
            this.filledTable(); 
            this.displayPieChart();
            this.displayNews();
            this.covidinfoService.setDataFirebase(country,this.covidData_countriesBis,"summary");
            this.covidinfoService.setDataFirebase(country,{listAll : this.covidData_all},"all");
            this.check = "ok";
            return
          })
        })
      }
      else{
        this.covidData_countriesBis.ActiveCases = this.covidData_countriesBis.TotalConfirmed - this.covidData_countriesBis.TotalRecovered;
        this.covidData_countriesBis.MortalityRate = ((this.covidData_countriesBis.TotalDeaths/this.covidData_countriesBis.TotalConfirmed * 100).toFixed(1)).toString() + " %";
        this.covidData_countriesBis.RecoveryRate = ((this.covidData_countriesBis.TotalRecovered/this.covidData_countriesBis.TotalConfirmed * 100).toFixed(1)).toString()+ " %";
        this.covidinfoService.getDataFirebase(country,"all").subscribe((data:{listAll : any})=>{
          this.covidData_all = data.listAll;
          this.displayChartAll();
          this.displayBarWeekly();
          this.filledTable();
          this.displayPieChart();
          this.displayNews();
          this.check = "ok";
          return
        })
      }
    })
  }

  getOptions(){
    var options="";
    for(let i=0;i<this.covidData_countries.length;i++){
      options += "<option>" + this.covidData_countries[i].Country + "</option>";
    }
    document.querySelector("#select_countries").innerHTML = options;
  }

  transformDate(oldDate):string{
    var new_date = "";
    var year = oldDate.getFullYear().toString();
    new_date = (oldDate.getMonth()+1) + "/" + oldDate.getDate() + "/" + year.substr(year.length - 2);
    return new_date
  }

  filledTable(){
    var text = "<td>"+ this.covidData_countriesBis.Country+ "</td>";
    text += "<td>"+ this.covidData_countriesBis.CountryCode+ "</td>";
    text += "<td>"+ this.covidData_countriesBis.Slug+ "</td>";
    text += "<td>"+ this.covidData_countriesBis.NewConfirmed+ "</td>";
    text += "<td>"+ this.covidData_countriesBis.TotalConfirmed+ "</td>";
    text += "<td>"+ this.covidData_countriesBis.ActiveCases+ "</td>";
    text += "<td>"+ this.covidData_countriesBis.NewDeaths+ "</td>";
    text += "<td>"+ this.covidData_countriesBis.TotalDeaths+ "</td>";
    text += "<td>"+ this.covidData_countriesBis.MortalityRate+ "</td>";
    text += "<td>"+ this.covidData_countriesBis.NewRecovered+ "</td>";
    text += "<td>"+ this.covidData_countriesBis.TotalRecovered+ "</td>";
    text += "<td>"+ this.covidData_countriesBis.RecoveryRate+ "</td>";
    text += "<td>"+ this.covidData_countriesBis.Date.substring(0,10)+ "</td>";

    document.querySelector("#table").innerHTML = text;
  }

  displayPieChart(){
    this.pieChartData[0] = this.covidData_countriesBis.TotalDeaths;
    this.pieChartData[1] = this.covidData_countriesBis.TotalRecovered;
    this.pieChartData[2] = this.covidData_countriesBis.ActiveCases;
  }

  displayBarWeekly(){
    var dates = []
    for(let i=0;i<7;i++){
      dates.push((this.covidData_all[this.covidData_all.length-i-1].Date).substring(0,10));
    }
    dates = dates.reverse();
    this.barChartLabels = dates;

    var tampon = []
    for(let i=0;i<7;i++){
      tampon.push(this.covidData_all[this.covidData_all.length-i-1].Confirmed)
    }
    this.barChartData[0].data = tampon;
    
    var tamponBis = [];
    for(let i=0;i<7;i++){
      tamponBis.push(this.covidData_all[this.covidData_all.length-i-1].Recovered)
    }
    this.barChartData[1].data = tamponBis;

    var tamponTer = [];
    for(let i=0;i<7;i++){
      tamponTer.push(this.covidData_all[this.covidData_all.length-i-1].Deaths)
    }
    this.barChartData[2].data = tamponTer;
  }


  displayChartAll(){
    var dates = []
    for(let i=0;i<this.covidData_all.length;i++){
      dates.push((this.covidData_all[i].Date).substring(0,10))
    }
    this.lineChartLabels = dates;

    var tampon = []
    for(let i=0;i<this.covidData_all.length;i++){
      tampon.push(this.covidData_all[i].Confirmed)
    }
    this.lineChartData[0].data = tampon;
    
    var tamponBis = [];
    for(let i=0;i<this.covidData_all.length;i++){
      tamponBis.push(this.covidData_all[i].Recovered)
    }
    this.lineChartData[1].data = tamponBis;

    var tamponTer = [];
    for(let i=0;i<this.covidData_all.length;i++){
      tamponTer.push(this.covidData_all[i].Deaths)
    }
    this.lineChartData[2].data = tamponTer;
  }


  displayNews(){
    var news =[]
    var country = (<HTMLInputElement>document.querySelector("#select_countries")).value;
    this.covidinfoService.getDataFirebase(country,"news").subscribe((data:[])=>{
      news = data;
      if(news.length == 0){
        var text = "<h5 style='text-align:center;font-style:italic;'>There are no news for this country, please add a news at the bottom of the page !</h5>";
        document.querySelector("#news").innerHTML = text;
        return
      }
      if(news.length<=3){
        var text="";
        for(let i=0;i<news.length;i++){
          text += "<article style='border:2px solid black;text-align:center;margin-top:10px;background-color:lightskyblue'>" + this.transformDate(new Date(news[i].date)) + " : " + news[i].user + " : " + news[i].news + "</article>"
        }
        document.querySelector("#news").innerHTML = text;
      }
      else{
        var newNews= news
        .slice()
        .sort((a, b) => {
           return b.date - a.date
        })
        .slice(0, 3);

        var text ="";
        for(let i=0;i<newNews.length;i++){
          text += "<article style='border:2px solid black;text-align:center;margin-top:10px;background-color:lightskyblue'>" + this.transformDate(new Date(newNews[i].date)) + " : " + newNews[i].user + " : " + newNews[i].news + "</article>"
        }
        document.querySelector("#news").innerHTML = text;

      }
    })
  }


  addNews(){
    var news = (<HTMLInputElement>document.querySelector("#input_news")).value;
    var country = (<HTMLInputElement>document.querySelector("#select_countries")).value;
    var new_date = Date.now();
    var name = this.user.displayName;
    var obj = {
      news : news,
      date : new_date,
      user : name
    }
    this.covidinfoService.setDataFirebase(country,obj,new_date.toString());
    var news = (<HTMLInputElement>document.querySelector("#input_news")).value = "";
    this.displayNews();
  }

}
