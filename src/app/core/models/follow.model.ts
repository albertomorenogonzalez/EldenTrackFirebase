import { User } from "./user.model";

export interface Follow {
  id:number,
  docId:string,
  idUser:string,
  userFollowed:User
}
