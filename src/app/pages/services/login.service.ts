import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLoggedIn = false;

  constructor(public firebaseAuth: AngularFireAuth) { }

  // se connecter
  async signin(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res => {
      this.isLoggedIn = true;
      // tslint:disable-next-line:semicolon
      // tslint:disable-next-line:whitespace
      localStorage.setItem('user',JSON.stringify(res.user));
    // tslint:disable-next-line:semicolon
    })
  }
// s'enregister
  async signup(email: string, password: string) {
    // tslint:disable-next-line:whitespace
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password).then(res=> {
      this.isLoggedIn = true;
      // tslint:disable-next-line:whitespace
      localStorage.setItem('user',JSON.stringify(res.user));
    });
  }
// se deconnecter
  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }
}
