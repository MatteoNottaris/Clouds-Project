export class weeklyData{
    deaths : any;
    cases : any;
    recovered : any;

    constructor(deaths,cases,recovered){
        this.deaths = deaths;
        this.cases = cases;
        this.recovered = recovered;
    }
}