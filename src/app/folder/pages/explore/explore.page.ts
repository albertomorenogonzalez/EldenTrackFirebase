import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/app/core';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

  constructor(
    public userData: UserService,
    private userSvc: UserService,
    private alert: AlertController,
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  getUserList() {
    return this.userSvc._user$;
  }

  async onDeleteAlert(user: User){
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
            this.userSvc.deleteUser(user);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  

  onDeleteUser(user: User){
    if (this.getCurrentUser()?.admin) {
      this.onDeleteAlert(user);
    } else {
      this.onUserNotAdmin();
    }
     
  } 
  
  getCurrentUser(){
    return this.userSvc.currentUser;
  }

  getItemDisplay(currentUserEmail: string, userEmail: string): string {
    var display = 'inline';
    if (userEmail === currentUserEmail) {
      display = 'none';
    } else {
      display = 'inline';
    }

    return display;
  }

  async onUserNotAdmin(){
    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get('alerts.accessDenied')),
      message: await lastValueFrom(this.translate.get('alerts.accessDeniedMessage')),
      buttons: [
        {
          text: await 'Cerrar',
          role: 'close',
          handler: () => {
           
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  

}
