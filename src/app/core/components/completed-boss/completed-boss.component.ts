import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Boss, User } from '../../models';
import { CompletedBoss } from '../../models/completed-boss.model';
import { BossService, LocaleService, UserService } from '../../services';

@Component({
  selector: 'app-completed-boss',
  templateUrl: './completed-boss.component.html',
  styleUrls: ['./completed-boss.component.scss'],
})
export class CompletedBossComponent implements OnInit {

  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input('completedBoss') set completedb(completdb:CompletedBoss){
    this._completedb = completdb;
    this.loadBossAndUser(completdb);
   
  }
  private async loadBossAndUser(completedb:CompletedBoss){
    this._boss.next(await this.bossSvc.getBossById(completedb.idBoss));
    this._user.next(await this.userSvc.getUserById(completedb.idUser));
  }
  get completedBoss():CompletedBoss{
    return this._completedb;
  }

  private _boss:BehaviorSubject<Boss> = new BehaviorSubject<Boss>(null);
  boss$:Observable<Boss> = this._boss.asObservable();

  private _user:BehaviorSubject<User> = new BehaviorSubject<User>(null);
  user$:Observable<User> = this._user.asObservable();

  constructor(
    public user: UserService,
    private userSvc: UserService,
    private bossSvc: BossService,
    public locale:LocaleService
  ) { }

  private _completedb:CompletedBoss;

  ngOnInit() {}

  onEditClick(){
    this.onEdit.emit(this.completedb);
  }

  onDeleteClick(){
    this.onDelete.emit(this.completedb);
  }

}
