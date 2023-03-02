import { Injectable } from '@angular/core';
import { DocumentData } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { CompletedBoss } from '../models/completed-boss.model';
import { FirebaseService } from './firebase/firebase-service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CompletedBossService {

  private _completedBossesList: CompletedBoss[] = [] /*[
    {
      id: 1,
      idBoss: 1,
      idUser: 1,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 2,
      idBoss: 2,
      idUser: 1,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 3,
      idBoss: 3,
      idUser: 1,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 4,
      idBoss: 4,
      idUser: 1,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 5,
      idBoss: 5,
      idUser: 1,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 6,
      idBoss: 6,
      idUser: 1,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 7,
      idBoss: 7,
      idUser: 1,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 8,
      idBoss: 8,
      idUser: 1,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 9,
      idBoss: 9,
      idUser: 1,
      startDate: '2022-08-12',
      finishDate: '2022-09-03',
      notes: 'GG'
    },
    {
      id: 10,
      idBoss: 1,
      idUser: 2,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 11,
      idBoss: 2,
      idUser: 2,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 12,
      idBoss: 3,
      idUser: 2,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 13,
      idBoss: 4,
      idUser: 2,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 14,
      idBoss: 5,
      idUser: 2,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 15,
      idBoss: 6,
      idUser: 2,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 16,
      idBoss: 7,
      idUser: 2,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 17,
      idBoss: 8,
      idUser: 2,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 18,
      idBoss: 9,
      idUser: 2,
      startDate: '2022-08-12',
      finishDate: '2022-09-03',
      notes: 'GG'
    },
    {
      id: 19,
      idBoss: 1,
      idUser: 3,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 20,
      idBoss: 2,
      idUser: 3,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 21,
      idBoss: 3,
      idUser: 3,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 22,
      idBoss: 4,
      idUser: 3,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 23,
      idBoss: 5,
      idUser: 3,
      startDate: '2022-12-08',
      finishDate: '2022-12-09',
      notes: 'GG'
    },
    {
      id: 24,
      idBoss: 6,
      idUser: 3,
      startDate: '2022-10-08',
      finishDate: '2022-12-11',
      notes: 'GG'
    },
  ]*/

  private _completedBoss:BehaviorSubject<CompletedBoss[]> = new BehaviorSubject(this._completedBossesList);
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

  

  getCompletedBossesByUserId(idUser: string) {
    return this._completedBossesList.filter(c=>c.idUser === idUser)
  }

  getBossCompletedByBossId(idBoss: string, idUser?: string) {
    return this._completedBossesList.find(c=>c.idBoss===idBoss && c.idUser===idUser)
  }

  async addCompletedBoss(completedb: CompletedBoss){
    try {
      await this.firebase.createDocument('completed_bosses', completedb);  
    } catch (error) {
      console.log(error);
    }
  }

  updateCompletedBoss(completedBoss:CompletedBoss) {
    var _completedBoss = this._completedBossesList.find(c=>c.id==completedBoss.id);
    if(_completedBoss){
      _completedBoss.idBoss = completedBoss.idBoss;
      _completedBoss.idUser = completedBoss.idUser;
      _completedBoss.startDate = completedBoss.startDate;
      _completedBoss.finishDate = completedBoss.finishDate;
      _completedBoss.notes = completedBoss.notes;
    }
    
    this._completedBoss.next(this._completedBossesList);
  }

  deleteCompletedBossById(id:number) {
    this._completedBossesList = this._completedBossesList.filter(c=>c.id != id); 
    this._completedBoss.next(this._completedBossesList);
  }
}
