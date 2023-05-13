import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  constructor(private db: AngularFirestore) { }

  getAllDbEntries() {
    return new Promise<any>((resolve)=> {
      this.db.collection('records').valueChanges({ idField: 'id' }).subscribe(records => resolve(records));
    })
  }
}
