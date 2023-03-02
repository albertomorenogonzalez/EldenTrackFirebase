import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Boss } from '../../models/boss.model';
import { PhotoItem, PhotoService } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-boss-form',
  templateUrl: './boss-form.component.html',
  styleUrls: ['./boss-form.component.scss'],
})
export class BossFormComponent implements OnInit {

  form:FormGroup;
  mode:"New" | "Edit" = "New";
  currentImage = new BehaviorSubject<string>("");
  currentImage$ = this.currentImage.asObservable();
  @Input('boss') set boss(boss:Boss){
    if(boss){
      this.form.controls['id'].setValue(boss.id);
      this.form.controls['docId'].setValue(boss.docId)
      this.form.controls['name'].setValue(boss.name);
      this.form.controls['area'].setValue(boss.area);
      this.form.controls['location'].setValue(boss.location);
      this.form.controls['description'].setValue(boss.description);
      this.form.controls['lifePoints'].setValue(boss.lifePoints);
      this.form.controls['image'].setValue(boss.image);
      if(boss.image)
        this.currentImage.next(boss.image);
      this.mode = "Edit";
    }
  }

  constructor(
    public platform:PlatformService,
    private fb:FormBuilder,
    private modal:ModalController,
    private photoSvc:PhotoService,
    private cdr:ChangeDetectorRef,
  ) { 
    this.form = this.fb.group({
      id:[null],
      docId:[''],
      name:["", [Validators.required]],
      area:["", [Validators.required]],
      location:["", [Validators.required]],
      description:["", [Validators.required]],
      lifePoints:["", [Validators.required]],
      image:[""],
      pictureFile:[null]
    });
  }

  ngOnInit() {
  }


  onSubmit(){
    
    this.modal.dismiss({boss: this.form.value, mode:this.mode}, 'ok');
  }

  onDismiss(){
    this.modal.dismiss(null, 'cancel');
  }

  async changePic(fileLoader:HTMLInputElement, mode:'library' | 'camera' | 'file'){
    var item:PhotoItem = await this.photoSvc.getPicture(mode, fileLoader);
    this.currentImage.next(item.base64);
    this.cdr.detectChanges();
    this.form.controls['pictureFile'].setValue(item.blob);
  }
}
