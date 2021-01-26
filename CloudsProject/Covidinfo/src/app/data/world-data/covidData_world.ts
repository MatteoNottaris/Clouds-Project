export class covidData_world{
    NewConfirmed : number;
    TotalConfirmed: number;
    NewDeaths: number;
    TotalDeaths: number;
    NewRecovered: number;
    TotalRecovered: number;
    Date : string;
    RecoveryRate : string;
    MortalityRate : string;
    ActiveCases : number;

    constructor(NewConfirmed,TotalConfirmed,NewDeaths,TotalDeaths,NewRecovered,TotalRecovered,Date,RecoveryRate,MortalityRate,ActiveCases){
        this.NewConfirmed = NewConfirmed;
        this.TotalConfirmed = TotalConfirmed;
        this.NewDeaths = NewDeaths;
        this.TotalDeaths = TotalDeaths;
        this.NewRecovered = NewRecovered;
        this.TotalRecovered = TotalRecovered;
        this.Date = Date;
        this.ActiveCases = ActiveCases;
        this.MortalityRate = MortalityRate;
        this.RecoveryRate = RecoveryRate;
    }
    
}


