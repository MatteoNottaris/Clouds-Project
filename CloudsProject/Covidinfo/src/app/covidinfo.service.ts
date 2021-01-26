import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import { User } from './user.model';
import { Router } from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { covidData_world } from './data/world-data/covidData_world';
import { covidData_countries } from './data/countries-data/covidData_countries';


@Injectable({
  providedIn: 'root'
})
export class CovidinfoService {

  private user:User;
  private summary_url = 'https://api.covid19api.com/summary';

  covidData = [];
  covidData_world : covidData_world;
  covidData_countries: covidData_countries;

  constructor(private afAuth: AngularFireAuth,
    private router: Router, 
    private firestore : AngularFirestore,
    private http: HttpClient,
    ) {}

  async signInWithGoogle(){
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.user={
      uid: credentials.user.uid,
      displayName :credentials.user.displayName,
      email: credentials.user.email
    };
    localStorage.setItem("user", JSON.stringify(this.user));
    this.updateUserData()
    this.router.navigate(["covidinfo"]);
  }

  private updateUserData(){
    this.firestore.collection("users").doc(this.user.uid).set({
      uid : this.user.uid,
      displayName : this.user.displayName,
      email : this.user.email
    },{merge:true});
  }

  getUser(){
    if (this.user ==null && this.userSignedIn()){
      this.user = JSON.parse(localStorage.getItem("user"))
    }
    return this.user;
  }

  userSignedIn(): boolean{
    return JSON.parse(localStorage.getItem("user")) != null;
  }

  signOut(){
  this.afAuth.signOut();
  localStorage.removeItem("user");
  this.user = null;
  this.router.navigate(["signin"]);
  }

  getData(): Observable<covidData_world>{
    return this.http.get<covidData_world>(this.summary_url)
  }

  


  getDataFirebase(country,api){
    if(country=="world"){
      if(api == "summary"){
        return this.firestore.collection("world").doc("covidData_world").valueChanges();
      }
      else if(api=="all"){
        return this.firestore.collection("worldAll").doc("covidData_world").valueChanges();
      }
      else{
        return this.firestore.collection("newsWorld").valueChanges();
      }
    }
    else{
      if(api == "summary"){
        return this.firestore.collection("countries").doc(country).valueChanges();
      }
      else if(api=="all"){
        return this.firestore.collection("countriesAll").doc(country).valueChanges();
      }
      else{
        return this.firestore.collection("newsCountries").doc("allCountries").collection(country).valueChanges();
      }
    }
  }
 

  setDataFirebase(country,newData,api){
    if(country=="world"){
      if(api=="summary"){
        this.firestore.collection("world").doc("covidData_world").set(newData,{merge:true});
        return
      }
      else if(api=="all"){
        this.firestore.collection("worldAll").doc("covidData_world").set(newData,{merge:true});
        return
      }
      else{
        this.firestore.collection("newsWorld").doc(api).set(newData,{merge:true});
        return
      }
    }
    else{
      if(api == "summary"){
        this.firestore.collection("countries").doc(country).set(newData,{merge:true});
        return
      }
      else if(api=="all"){
        this.firestore.collection("countriesAll").doc(country).set(newData,{merge:true});
        return
      }
      else{
        this.firestore.collection("newsCountries").doc("allCountries").collection(country).doc(api).set(newData,{merge:true});
        return
      }
    }
  }
  
}
