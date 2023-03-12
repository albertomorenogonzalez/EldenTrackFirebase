import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { DocumentData } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";
import { Boss } from "../models/boss.model";
import { FileUploaded, FirebaseService } from "./firebase/firebase-service";

@Injectable({
  providedIn: 'root'
})
export class BossService {

  private _boss:BehaviorSubject<Boss[]> = new BehaviorSubject([]);
  public boss$ = this._boss.asObservable();

  unsubscr;
  constructor(
    private firebase:FirebaseService
  ) {
    this.unsubscr = this.firebase.subscribeToCollection('bosses',this._boss, this.mapBoss);
  }

  ngOnDestroy(): void {
    this.unsubscr();
  }

  private mapBoss(doc:DocumentData){
    return {
      id:0,
      docId:doc["id"],
      name:doc["data"]().name,
      area:doc["data"]().area,
      location:doc["data"]().location,
      description:doc["data"]().description,
      lifePoints:doc["data"]().lifePoints,
      image:doc["data"]().image
    };
  }

  getBossList(){
    return this._boss.value;
  }

  async addBoss(boss:Boss){
    var _boss = {
      docId:boss.id,
      name:boss.name,
      area:boss.area,
      location:boss.location,
      description:boss.description,
      lifePoints:boss.lifePoints
    };
    if(boss['pictureFile']){
      var response = await this.uploadImage(boss['pictureFile']);
      _boss['image'] = response.file;
    }
    try {
      await this.firebase.createDocument('bosses', _boss);  
    } catch (error) {
      console.log(error);
    }
  }

  uploadImage(file):Promise<any>{  
    return new Promise(async (resolve, reject)=>{
      try {
        const data = await this.firebase.imageUpload(file);  
        resolve(data);
      } catch (error) {
        resolve(error);
      }
    });
  }

  getBossById(id:string):Promise<Boss>{
    return new Promise<Boss>(async (resolve, reject)=>{
      try {
        var boss = (await this.firebase.getDocument('bosses', id));
        resolve({
          id:0,
          docId:boss.id,
          name:boss.data["name"],
          area:boss.data["area"],
          location:boss.data["location"],
          description:boss.data["description"],
          lifePoints:boss.data["lifePoints"],
          image:boss.data["image"]
        });  
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateBoss(boss:Boss){
    var _boss = {
      docId:boss.docId,
      name:boss.name,
      area:boss.area,
      location:boss.location,
      description:boss.description,
      lifepoints:boss.lifePoints,
    };
    if(boss['pictureFile']){
      var response:FileUploaded = await this.uploadImage(boss['pictureFile']);
      _boss['image'] = response.file;
    }
    try {
      await this.firebase.updateDocument('bosses', _boss.docId, _boss);  
    } catch (error) {
      console.log(error);
    }
  }

  async deleteBoss(boss:Boss){
    await this.firebase.deleteDocument('bosses', boss.docId);
  }

  async writeToFile(){
    var dataToText = JSON.stringify(this._boss.value);
    var data = new Blob([dataToText], {type: 'text/plain'});
    this.firebase.fileUpload(data, 'text/plain', 'bosses', '.txt');
  }
}
