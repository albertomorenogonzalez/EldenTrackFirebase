import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentData } from '@firebase/firestore';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { User, UserLogin, UserRegister } from '../models/user.model';
import { BossService } from './boss.service';
import { CompletedBossService } from './completed-boss.service';
import { FileUploaded, FirebaseService } from './firebase/firebase-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _userLogged:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public userLogged$ = this._userLogged.asObservable();

  private _user:BehaviorSubject<User> = new BehaviorSubject(null);
  public user$ = this._user.asObservable();

  private _userSubject:BehaviorSubject<User[]> = new BehaviorSubject([]);
  public _user$ = this._userSubject.asObservable();

  public currentUser: User;

  unsubscr;
  constructor(
    private firebase:FirebaseService,
    private router:Router,
    private bossData: BossService,
    private completedbData: CompletedBossService,
    private toastController: ToastController,
    private translate: TranslateService
  ) {
    this.init();
    this.unsubscr = this.firebase.subscribeToCollection('users',this._userSubject, this.mapUser);
  }

  gOnDestroy(): void {
    this.unsubscr();
  }

  private mapUser(doc:DocumentData){
    return {
      id:0,
      docId:doc['id'],
      admin: doc['data']().admin,
      name: doc['data']().name,
      surname: doc['data']().surname,
      birthdate: doc['data']().birthdate,
      email: doc['data']().email,
      username: doc['data']().username,
      password: doc['data']().password,
      profilePick: doc['data']().profilePick
    };
  }

  private async init(){
    this.firebase.isLogged$.subscribe(async (logged)=>{
      if(logged){
        this._user.next((await this.firebase.getDocument('users', this.firebase.getUser().uid)).data as User);
        this.currentUser = await this.getUserById(this.firebase.getUser().uid);
        this.router.navigate(['folder/home']);
        this.presentToastLoggedUser();
      }
      this._userLogged.next(logged);
    });
    
  }

  public login(credentials:UserLogin):Promise<string>{
    return new Promise<string>(async (resolve, reject)=>{
      if(!this._userLogged.value){
        try {
          await this.firebase.connectUserWithEmailAndPassword(credentials.email, credentials.password);
          this.presentToastLoggedUser();
        } catch (error) {
          this.presentToastIncorrectUserOrPassword();
          reject(error);
        }
      }
      else{
        reject('already connected');
      }
    });
    
  }

  signOut(){
    this.firebase.signOut();
    this.router.navigate(['login']);
  }
  
  public async register(data: UserRegister){
    try {
      if (!this._userLogged.value) {
        const user = await this.firebase.createUserWithEmailAndPassword(data.email, data.password);
        const userData = {
          docId: user.user.uid,
          admin: false,
          username: data.username, 
          profilePick: data.profilePick,
          email: data.email,
          provider: "firebase",
          token: await user.user.getIdToken(),
          name: data.name,
          surname: data.surname,
          birthdate: data.birthdate,
          
        };
        await this.firebase.createDocumentWithId('users', userData, user.user.uid);
        await this.firebase.connectUserWithEmailAndPassword(data.email, data.password);
      } else {
        throw new Error('Already connected');
      } 
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getUserList(){
    return this._userSubject.value;
  }

  getUserById(id:string):Promise<User>{
    return new Promise<User>(async (resolve, reject)=>{
      try {
        var user = (await this.firebase.getDocument('users', id));
        resolve({
          id:0,
          docId: user.id,
          admin: user.data['admin'],
          name:user.data['name'],
          surname: user.data['surname'],
          birthdate: user.data['birthdate'],
          email: user.data['email'],
          username: user.data['username'],
          password: user.data['password'],
          profilePick: user.data['profilePick'] 
        });  
      } catch (error) {
        reject(error);
      }
    });
  }


  async addUser(user:User){
    var _user = {
      docId: user.id,
      admin: user['admin'],
      name:user['name'],
      surname: user['surname'],
      birthdate: user['birthdate'],
      email: user['email'],
      username: user['username'],
      password: user['password']
    };
    if(user['pictureFile']){
      var response = await this.uploadImage(user['pictureFile']);
      _user['profilePick'] = response.image;
    }
    try {
      await this.firebase.createDocument('users', _user);  
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


  async updateUser(user:User){
    var _user = {
      docId: user.id,
      admin: user['admin'],
      name:user['name'],
      surname: user['surname'],
      birthdate: user['birthdate'],
      email: user['email'],
      username: user['username'],
      password: user['password']
    };
    if(user['pictureFile']){
      var response:FileUploaded = await this.uploadImage(user['profilePick']);
      _user['profilePick'] = response.file;
    }
    try {
      await this.firebase.updateDocument('users', user.docId, _user);  
    } catch (error) {
      console.log(error);
    }
      
  }

  async deleteUser(user:User){
    try {
      await this.firebase.deleteUser();
      await this.firebase.deleteDocument('users', user.docId);
      await window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }


  numberOfBossesCompleted(user: User):number {
    return this.completedbData.getCompletedBossesByUserId(user.docId).length
  }

  numberOfTotalBosses(): number {
    return this.bossData.getBossList().length
  }

  progress(user: User) {
    return this.numberOfBossesCompleted(user)/this.numberOfTotalBosses();
  }


  async presentToastLoggedUser() {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translate.get('toasts.logged')) + this.currentUser?.username + '!',
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  async presentToastIncorrectUserOrPassword() {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translate.get('toasts.incorrectUserOrPassword')),
      duration: 1500,
      position: 'top',
      color: 'danger'
    });

    await toast.present();
  }
}
