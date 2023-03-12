import { Injectable } from '@angular/core';
import { DocumentData } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { Follow } from '../models/follow.model';
import { FirebaseService } from './firebase/firebase-service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  private _followsList: Follow[] = []

  private _follow:BehaviorSubject<Follow[]> = new BehaviorSubject(this._followsList);
  public follow$ = this._follow.asObservable();

  unsubscr;
  constructor(
    private firebase:FirebaseService
  ) {
    this.unsubscr = this.firebase.subscribeToCollection('follows',this._follow, this.mapFollow);
  }

  ngOnDestroy(): void {
    this.unsubscr();
  }

  private mapFollow(doc:DocumentData){
    return {
      id:0,
      docId:doc['id'],
      idUser:doc['data']().idUser,
      userFollowed:doc['data']().userFollowed,
    };
  }

  public followPage: Boolean = false;

  getFollowList() {
    return this._follow.value;
  }

  getFollowsByUserId(idUser?: string) {
    return this._followsList.find(f=>f.idUser == idUser)
  }

  getFollowById(id: string) {
    return new Promise<Follow>(async (resolve, reject)=>{
      try {
        var follow = (await this.firebase.getDocument('follows', id));
        resolve({
          id:0,
          docId: follow.id,
          idUser: follow.data['idUser'],
          userFollowed: follow.data['userFollowed'],
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getFollowsBy(field, value){
    return new Promise<Follow[]>(async (resolve, reject)=>{
      try {
        var follows = (await this.firebase.getDocumentsBy('follows', field, value)).map<Follow>(doc=>{
          return {
            id:0,
            docId:doc.id,
            idUser:doc.data['idUser'],
            userFollowed:doc.data['userFollowed']
          }
        });
        resolve(follows);  
      } catch (error) {
        reject(error);
      }
    });
  }

  getFollowsByIdUser(idUser:string):Promise<Follow[]>{
    return this.getFollowsBy('idUser', idUser);
  }

  async follow(follow:Follow) {
    var _follow = {
      docId: follow.id,
      idUser: follow['idUser'],
      userFollowed: follow['userFollowed']
    };
    try {
      await this.firebase.createDocument('follows', _follow);  
    } catch (error) {
      console.log(error);
    }
  }

  async unfollowById(id?:string) {
    try {
      await this.firebase.deleteDocument('follows', id);  
    } catch (error) {
      console.log(error);
    }
  }

  getFollowedUsers(idUser?: string) {
    return this._followsList.filter(follow=>follow.idUser == idUser)
  }
  
}
