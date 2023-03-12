import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Boss, User } from '../../models';
import { CompletedBoss } from '../../models/completed-boss.model';
import { UserService } from '../../services';

@Component({
  selector: 'app-completed-boss-form',
  templateUrl: './completed-boss-form.component.html',
  styleUrls: ['./completed-boss-form.component.scss'],
})
export class CompletedBossFormComponent implements OnInit {

  form:FormGroup;
  mode:"New" | "Edit" = "New";
  @Input() boss: Boss;
  @Input('CompletedBoss') set completedb(completedb:CompletedBoss){
    if(completedb){
      this.form.controls['id'].setValue(completedb.id);
      this.form.controls['docId'].setValue(completedb.docId);
      this.form.controls['idBoss'].setValue(completedb.idBoss);
      this.form.controls['idUser'].setValue(completedb.idUser);
      this.form.controls['startDate'].setValue(completedb.startDate);
      this.form.controls['finishDate'].setValue(completedb.finishDate);
      this.form.controls['notes'].setValue(completedb.notes);
      this.mode = "Edit";
    }
  }

  constructor(
    private fb:FormBuilder,
    private modal:ModalController,
    private userData: UserService
  ) { 
    this.form = this.fb.group({
      id:[0],
      docId:[''],
      idBoss:['', [Validators.min(1)]],
      idUser:[this.getUserActive().docId, [Validators.min(1)]],
      startDate:["", [Validators.required]],
      finishDate:["", [Validators.required]],
      notes:[""]
    });
  }

  ngOnInit() {
    this.form.controls['idBoss'].setValue(this.boss.docId)
  }

  formatDate(date:moment.Moment){
    return date.format('YYYY-MM-DDT');
  }

  onSubmit(){
    this.modal.dismiss({completedb: this.form.value, mode:this.mode}, 'ok');
  }

  onDismiss(){
    this.modal.dismiss(null, 'cancel');
  }

  getUserActive():User {
    return this.userData.currentUser;
  }
 


}
