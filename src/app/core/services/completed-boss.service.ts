import { Injectable } from '@angular/core';
import { DocumentData } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { CompletedBoss } from '../models/completed-boss.model';
import { FirebaseService } from './firebase/firebase-service';

@Injectable({
  providedIn: 'root'
})
export class CompletedBossService {

  private _completedBoss:BehaviorSubject<CompletedBoss[]> = new BehaviorSubject([]);
  public completedBoss$ = this._completedBoss.asObservable();

  unsubscr;
  constructor(
    private firebase:FirebaseService
  ) {
    this.unsubscr = this.firebase.subscribeToCollection('completed_bosses',this._completedBoss, this.mapCompletedBoss);
  }

  ngOnDestroy(): void {
    this.unsubscr();
  }

  private mapCompletedBoss(doc:DocumentData){
    return {
      id:0,
      docId:doc['id'],
      idBoss:doc['data']().idBoss,
      idUser:doc['data']().idUser,
      startDate:doc['data']().startDate,
      finishDate:doc['data']().finishDate,
      notes:doc['data']().notes
    };
  }

  getCompletedBosses() {
    return this._completedBoss.value;
  }

  getCompletedBossById(id:string){
    return new Promise<CompletedBoss>(async (resolve, reject)=>{
      try {
        var response = (await this.firebase.getDocument('completed_bosses', id));
        resolve({
          id:0,
          docId:response.id,
          idBoss:response.data['idBoss'],
          idUser:response.data['idUser'],
          startDate:response.data['startDate'],
          finishDate:response.data['finishDate'],
          notes:response.data['notes']
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getCompletedBossesBy(field, value){
    return new Promise<CompletedBoss[]>(async (resolve, reject)=>{
      try {
        var completedb = (await this.firebase.getDocumentsBy('completed_bosses', field, value)).map<CompletedBoss>(doc => {
          return {
            id:0,
            docId:doc.id,
            idBoss:doc.data['idBoss'],
            idUser:doc.data['idUser'],
            startDate:doc.data['startDate'],
            finishDate:doc.data['finishDate'],
            notes:doc.data['notes']
          }
        });
        resolve(completedb);  
      } catch (error) {
        reject(error);
      }
    });
  }

  getCompletedBossesByUserId(idUser: string) {
    return this.getCompletedBossesBy('idUser', idUser)
  }

  getBossCompletedByBossId(idBoss: string) {
    return this.getCompletedBossesBy('idBoss', idBoss)
  }

  async addCompletedBoss(completedb: CompletedBoss){
    try {
      await this.firebase.createDocument('completed_bosses', completedb);  
    } catch (error) {
      console.log(error);
    }
  }

  async updateCompletedBoss(completedb:CompletedBoss){
    try {
      await this.firebase.updateDocument('completed_bosses', completedb.docId, completedb);
    } catch (error) {
      console.log(error);
    }
    
  }

  async deleteCompletedBoss(completedb:CompletedBoss){
    try {
      await this.firebase.deleteDocument('completed_bosses', completedb.docId);
    } catch (error) {
      console.log(error);
    }
  }
}
