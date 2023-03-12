import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Boss, BossService, RegisterFormComponent, UpdateUserFormComponent } from 'src/app/core';
import { CompletedBossFormComponent } from 'src/app/core/components/completed-boss-form/completed-boss-form.component';
import { CompletedBoss } from 'src/app/core/models/completed-boss.model';
import { User } from 'src/app/core/models/user.model';
import { CompletedBossService } from 'src/app/core/services/completed-boss.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    public user: UserService,
    private userData: UserService,
    private bossData: BossService,
    private completedBossData: CompletedBossService,
    private alert: AlertController,
    private modal: ModalController,
    private toastController: ToastController,
    private translate: TranslateService
  ) { 

  }

  ngOnInit() {
  }

  getUserActive():User {
    return this.userData.currentUser;
  }

  getCompletedBosses() {
    return this.completedBossData.completedBoss$;
  }

  async presentCompletedBossForm(completedb?:CompletedBoss){
    const modal = await this.modal.create({
      component:CompletedBossFormComponent,
      componentProps:{
        completedb:completedb,
        boss: await this.bossData.getBossById(completedb.idBoss)
      }
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        switch(result.data.mode){
          case 'Edit':
            this.completedBossData.updateCompletedBoss(result.data.completedb);
            this.presentToastUpdate();
            break;
          default:
        }
      }
    });
  }

  onEditCompletedBoss(completedb: CompletedBoss){
    this.presentCompletedBossForm(completedb);
  }

  async presentUserForm(user?:User){
    const modal = await this.modal.create({
      component:UpdateUserFormComponent,
      componentProps:{
        user:user
      }
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        switch(result.data.mode){
          case 'Edit':
            this.userData.updateUser(result.data.user);
            this.presentToastUpdate();
            break;
          default:
        }
      }
    });
  }

  onEditProfile(user: User) {
    this.presentUserForm(user);
  }

  async onDeleteCompletedBossAlert(completedb: CompletedBoss){
    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get('alerts.warning')),
      message: await lastValueFrom(this.translate.get('alerts.deleteCompletedBoss')),
      buttons: [
        {
          text: await lastValueFrom(this.translate.get('home.cancel')),
          role: 'cancel',
          handler: () => {
            console.log("Operacion cancelada");
          },
        },
        {
          text: await lastValueFrom(this.translate.get('home.delete')),
          role: 'confirm',
          handler: () => {
            this.completedBossData.deleteCompletedBoss(completedb);
            this.presentToastDelete();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async onDeleteUserAlert(user: User){
    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get('alerts.warning')),
      message: await lastValueFrom(this.translate.get('alerts.deleteUser')),
      buttons: [
        {
          text: await lastValueFrom(this.translate.get('home.cancel')),
          role: 'cancel',
          handler: () => {
            console.log("Operacion cancelada");
          },
        },
        {
          text: await lastValueFrom(this.translate.get('home.delete')),
          role: 'confirm',
          handler: () => {
            this.userData.deleteUser(user);
            this.userData.signOut();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  onDeleteUser(user: User){
    this.onDeleteUserAlert(user);
  } 

  

  onDeleteCompletedBoss(completedb: CompletedBoss){
    this.onDeleteCompletedBossAlert(completedb);
  } 
  
  getItemDisplay(completdb: CompletedBoss) {
    var display = 'inline';

    if (this.bossData.getBossById(completdb.idBoss)==null) {
      display = 'none';
    } else {
      display = 'inline';
    }

    return display;
  }

  async presentToastUpdate() {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translate.get('toasts.update')),
      duration: 1500,
      position: 'top',
      color: 'success'
    });

    await toast.present();
    
  }

  async presentToastDelete() {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translate.get('toasts.deleteCompletedBoss')),
      duration: 1500,
      position: 'top',
      color: 'danger'
    });

    await toast.present();
    
  }

  async onExport(){
    this.bossData.writeToFile();
  }
}
