import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Boss, User } from '../../models';
import { CompletedBossService, LocaleService, UserService } from '../../services';

@Component({
  selector: 'app-user-completed-bosses',
  templateUrl: './user-completed-bosses.component.html',
  styleUrls: ['./user-completed-bosses.component.scss'],
})
export class UserCompletedBossesComponent implements OnInit {

  @Input() user: User | undefined;
  @Input() boss: Boss | undefined;

  constructor(
    private userData: UserService,
    private completedbData: CompletedBossService,
    public locale:LocaleService,
    public modal: ModalController
  ) { }

  ngOnInit() {}

  getCompletedBosses() {
    return this.completedbData.completedBoss$
  }

  onDismiss(result: any){
    this.modal.dismiss(null, 'cancel');
  }
}
