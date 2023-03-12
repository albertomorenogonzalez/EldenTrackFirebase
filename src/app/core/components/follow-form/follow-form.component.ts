import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Follow, User } from '../../models';
import { FollowService, UserService } from '../../services';

@Component({
  selector: 'app-follow-form',
  templateUrl: './follow-form.component.html',
  styleUrls: ['./follow-form.component.scss'],
})
export class FollowFormComponent implements OnInit {

  form:FormGroup;
  @Input() user: User;
  @Input() followedUser: User;

  constructor(
    private userData: UserService,
    private fb:FormBuilder,
    private modal:ModalController,
    private toastController: ToastController,
    private translate: TranslateService
  ) { 
    this.form = this.fb.group({
      id:[0],
      docId:[''],
      idUser:['', [Validators.required]],
      userFollowed:[this.followedUser, [Validators.required]]
    });
  }

  ngOnInit() {
    this.form.controls['idUser'].setValue(this.user.docId)
    this.form.controls['userFollowed'].setValue(this.followedUser)
  }
  

  onSubmit(){
    this.modal.dismiss({follow: this.form.value}, 'ok');
    this.presentToastFollow();
  }

  onDismiss(){
    this.modal.dismiss(null, 'cancel');
  }

  async getUserById() {
    return this.userData.getUserById(this.followedUser.docId);
  }

  async presentToastFollow() {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translate.get('toasts.startedFollow')) + (await this.getUserById()).username + '!',
      duration: 1500,
      position: 'top',
      color: 'success'
    });

    await toast.present();
    
  }

}


