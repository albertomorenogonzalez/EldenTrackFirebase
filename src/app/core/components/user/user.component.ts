import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { FollowFormComponent } from '..';
import { Boss, Follow } from '../../models';
import { User } from '../../models/user.model';
import { FollowService, UserService } from '../../services';
import { LocaleService } from '../../services/locale.service';
import { UserCompletedBossesComponent } from '../user-completed-bosses/user-completed-bosses.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() user: User;
  @Input() boss: Boss;
  
  constructor(
    private userData: UserService,
    private followData: FollowService,
    public locale:LocaleService,
    private toastController: ToastController,
    private modal:ModalController,
    private alert:AlertController,
    private translate: TranslateService
  ) { }

  ngOnInit() {}

  isFollowPage() {
    return this.followData.followPage;
  }

  onEditClick(){
    this.onEdit.emit(this.user);
  }

  onDeleteClick(){
    this.onDelete.emit(this.user);
  }

  userIsFollowed(idFollowed: string) {
    return false//this.followData.getFollowsByIdFollowed(idFollowed);
  }

  getCurrentUser() {
    return this.userData.currentUser;
  }

  async presentFollowForm(follow?:Follow){
    const modal = await this.modal.create({
      component:FollowFormComponent,
      componentProps:{
        follow:follow,
        user:this.getCurrentUser(),
        followedUser:this.user
      },
      cssClass:'follow'
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        this.followData.follow(result.data.follow);
      }
    });
  }

  onFollowUser(idUser: string) {
    this.presentFollowForm();
  }

  showCompletedBosses(user: User, boss: Boss) {
    this.userInformation(user, boss);
  }

  async userInformation(user: User, boss: Boss) {
    const modal = await this.modal.create({
      component:UserCompletedBossesComponent,
      componentProps:{
        user:user, boss:boss
      }
      
    });
    modal.present();
  }


  async onUnfollowAlert(follow?: Follow){
    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get('alerts.warning')),
      message: await lastValueFrom(this.translate.get('alerts.unfollow')),
      buttons: [
        {
          text: await lastValueFrom(this.translate.get('home.cancel')),
          role: 'cancel',
          handler: () => {
            console.log("Operacion cancelada");
          },
        },
        {
          text: await lastValueFrom(this.translate.get('home.unfollow')),
          role: 'confirm',
          handler: () => {
            this.followData.unfollowById(follow?.docId);
            this.presentToastUnfollow();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }


  async presentToastUnfollow() {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translate.get('toasts.unfollow')) + this.user?.username,
      duration: 1500,
      position: 'top',
      color: 'danger'
    });

    await toast.present();
    
  }
}
