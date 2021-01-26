import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CovidinfoService } from 'src/app/covidinfo.service';
import { covidData_world } from './covidData_world';
import { dataInfo } from './dataInfo';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { SingleDataSet, Label, Color } from 'ng2-charts';
import { monthlyData} from './monthlyData';
import { User } from 'src/app/user.model';


@Component({
  selector: 'app-world-data',
  templateUrl: './world-data.component.html',
  styleUrls: ['./world-data.component.css']
})
export class WorldDataComponent implements OnInit {


  //Declarations
  user :User;

  covidData_world : covidData_world;
  private summary_url : string = "https://api.covid19api.com/summary";

  covidData_monthly : monthlyData;
  private monthly_url : string ="https://corona.lmao.ninja/v2/historical/all";


  constructor(private http: HttpClient,public covidinfoService: CovidinfoService) { }
  check=false;



  //Pie Chart 
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
    { data: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], label: 'Total Cases' },
    { data: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], label: 'Total Recoveries' },
    { data: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], label: 'Total Death' },
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
    var new_date = this.getDate();
    this.user = this.covidinfoService.getUser();
    this.covidinfoService.getDataFirebase("world","summary").subscribe((data: covidData_world)=>{
      this.covidData_world = data;
      if(this.covidData_world == undefined || this.covidData_world.Date<new_date){
        this.getDataSummary().subscribe(data =>{
          this.covidData_world = data.Global;
          this.covidData_world.Date = new_date;
          this.covidData_world.ActiveCases = this.covidData_world.TotalConfirmed-this.covidData_world.TotalRecovered;
          this.covidData_world.MortalityRate = ((this.covidData_world.TotalDeaths/this.covidData_world.TotalConfirmed * 100).toFixed(1)).toString() +" %";
          this.covidData_world.RecoveryRate = ((this.covidData_world.TotalRecovered/this.covidData_world.TotalConfirmed * 100).toFixed(1)).toString() +" %";
          this.getData30Days().subscribe(data=>{
            this.covidData_monthly = data;
            this.displayPieChart();
            this.displayChart30Days();
            this.displayBarWeekly();
            this.displayNews();
            this.check = true;
            this.covidinfoService.setDataFirebase("world",this.covidData_world,"summary");
            this.covidinfoService.setDataFirebase("world",this.covidData_monthly,"all");
            return
          })
        })
      }
      else{
        this.covidData_world.ActiveCases = this.covidData_world.TotalConfirmed-this.covidData_world.TotalRecovered;
        this.covidData_world.MortalityRate = ((this.covidData_world.TotalDeaths/this.covidData_world.TotalConfirmed * 100).toFixed(1)).toString() + " %";
        this.covidData_world.RecoveryRate = ((this.covidData_world.TotalRecovered/this.covidData_world.TotalConfirmed * 100).toFixed(1)).toString() +" %";
        this.covidinfoService.getDataFirebase("world","all").subscribe((data:monthlyData)=>{
          this.covidData_monthly = data;
          this.displayPieChart();
          this.displayChart30Days();
          this.displayBarWeekly();
          this.displayNews();
          this.check=true;
          return
        })
     }
    })
  }

  getDataSummary(): Observable<dataInfo>{
    return this.http.get<dataInfo>(this.summary_url)
  }

  getData30Days(): Observable<monthlyData>{
    return this.http.get<monthlyData>(this.monthly_url)
  }

  getDate():string{
    var date = new Date();
    var new_date = "";
    if(date.getMonth()+1<10){
      let month = "0"+(date.getMonth()+1);
      new_date = date.getFullYear() +"-"+ month +"-"+ date.getDate() ;
    }
    else{
      let month = date.getMonth() +1;
      new_date = date.getFullYear() +"-"+ month +"-"+ date.getDate() ;
    }
    return new_date
  }

  transformDate(oldDate):string{
    var new_date = "";
    var year = oldDate.getFullYear().toString();
    new_date = (oldDate.getMonth()+1) + "/" + oldDate.getDate() + "/" + year.substr(year.length - 2);
    return new_date
  }

  displayPieChart(){
    this.pieChartData[0] = this.covidData_world.TotalDeaths;
    this.pieChartData[1] = this.covidData_world.TotalRecovered;
    this.pieChartData[2] = this.covidData_world.ActiveCases;
  }

  displayBarWeekly(){
    var dates = []
    for(let obj in this.covidData_monthly.cases){
      dates.push(Date.parse(obj)/1000);
    }
    var date_sort_desc = function (date1, date2) {
      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
      return 0;
    };
    dates.sort(date_sort_desc);
    for(let i=0;i<dates.length;i++){
      dates[i] = this.transformDate(new Date(dates[i] * 1000))
    }
    dates = dates.slice(-1*7);
    this.barChartLabels = dates;
    

    var tampon = []
    for(let i=0;i<dates.length;i++){
      tampon.push(this.covidData_monthly.cases[dates[i]]);
    }
    this.barChartData[0].data = tampon;
    
    var tamponBis = [];
    for(let i=0;i<dates.length;i++){
      tamponBis.push(this.covidData_monthly.recovered[dates[i]]);
    }
    this.barChartData[1].data = tamponBis;

    var tamponTer = [];
    for(let i=0;i<dates.length;i++){
      tamponTer.push(this.covidData_monthly.deaths[dates[i]]);
    }
    this.barChartData[2].data = tamponTer;
  }

  displayChart30Days(){
    var dates = []
    for(let obj in this.covidData_monthly.cases){
      dates.push(Date.parse(obj)/1000);
    }
    var date_sort_desc = function (date1, date2) {
      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
      return 0;
    };
    dates.sort(date_sort_desc);
    for(let i=0;i<dates.length;i++){
      dates[i] = this.transformDate(new Date(dates[i] * 1000))
    }
    this.lineChartLabels = dates;

    var tampon = []
    for(let i=0; i<dates.length;i++){
      tampon.push(this.covidData_monthly.cases[dates[i]]);
    }
    this.lineChartData[0].data = tampon;
    
    var tamponBis = [];
    for(let i=0; i<dates.length;i++){
      tamponBis.push(this.covidData_monthly.recovered[dates[i]]);
    }
    this.lineChartData[1].data = tamponBis;

    var tamponTer = [];
    for(let i=0; i<dates.length;i++){
      tamponTer.push(this.covidData_monthly.deaths[dates[i]]);
    }
    this.lineChartData[2].data = tamponTer;
  }

  displayNews(){
    var news =[]
    this.covidinfoService.getDataFirebase("world","news").subscribe((data:[])=>{
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
    var new_date = Date.now();
    var name = this.user.displayName;
    var obj = {
      news : news,
      date : new_date,
      user : name
    }
    this.covidinfoService.setDataFirebase("world",obj,new_date.toString());
    var news = (<HTMLInputElement>document.querySelector("#input_news")).value = "";
    this.displayNews();
  }




}
