import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { User } from '../../models';
import { PasswordValidation } from '../../utils';

@Component({
  selector: 'app-update-user-form',
  templateUrl: './update-user-form.component.html',
  styleUrls: ['./update-user-form.component.scss'],
})
export class UpdateUserFormComponent implements OnInit {

  form:FormGroup;
  mode:"New" | "Edit" = "New";
  @Input('user') set user(user:User) {
    if(user) {
      this.form.controls['id'].setValue(user.id);
      this.form.controls['docId'].setValue(user.docId);
      this.form.controls['admin'].setValue(user.admin);
      this.form.controls['name'].setValue(user.name);
      this.form.controls['surname'].setValue(user.surname);
      this.form.controls['email'].setValue(user.email)
      this.form.controls['birthdate'].setValue(user.birthdate);
      this.form.controls['username'].setValue(user.username);
      this.form.controls['profilePick'].setValue(user.profilePick);
      this.mode = "Edit";
    }
  }

  constructor(
    private fb:FormBuilder,
    private modal:ModalController,
    private toastController: ToastController,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      id:[null],
      docId:[""],
      admin:[false],
      name:["", [Validators.required]],
      surname:["", [Validators.required]],
      email:[""],
      birthdate:["", [Validators.required]],
      username:["", [Validators.required]],
      profilePick:[""]
    });
  }

  ngOnInit() {
    this.form.controls['profilePick'].setValue(this.user.profilePick);
  }

  onSubmit(){
    this.modal.dismiss({user: this.form.value, mode:this.mode}, 'ok');
  }

  hasFormError(error){
    return this.form?.errors && Object.keys(this.form.errors).filter(e=>e==error).length==1;
  }
  
  errorsToArray(errors){
   
    if(errors && !('required' in errors))
      return [Object.keys(errors)[0]];
    else
      return [];
  } 


  formatDate(date:moment.Moment){
    return date.format('YYYY-MM-DDT');
  }

  onDismiss(){
    this.modal.dismiss(null, 'cancel');
  }


  async presentToastAdd() {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translate.get('toasts.userAdded')),
      duration: 1500,
      position: 'top',
      color: 'success'
    });

    await toast.present();
  }


  @ViewChild('passwordEyeRegister', { read: ElementRef }) passwordEye: ElementRef;

  passwordTypeInput  =  'password';

  togglePasswordMode() {
          
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
      
      const nativeEl = this.passwordEye.nativeElement.querySelector('input');
      
      const inputSelection = nativeEl.selectionStart;
      
      nativeEl.focus();
      
      setTimeout(() => {
        nativeEl.setSelectionRange(inputSelection, inputSelection);
      }, 1);

  }

}
