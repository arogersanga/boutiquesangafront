import {AfterViewInit, Component, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {AppService} from '../../app.service';
import {NavigationEnd, Router} from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: any;
  password: any;
  isSignedIn = false;
  // returnUrl: string;
  // @ViewChild('login') login: any;
  @Output() loginClicked = new EventEmitter<boolean>();

  constructor( public router: Router,
               public appService: AppService,
               public FirebaseAuth: LoginService) { }

  ngOnInit(): void {
    /* if (localStorage.getItem('user') !== null ) {
      this.isSignedIn = true;
      }
    // tslint:disable-next-line:one-line
    else {
      this.isSignedIn = false;
    }
    this.returnUrl = this.router.navigate(); */
  }

  async onSignup(email: string, password: string) {
    await this.FirebaseAuth.signup(this.email, this.password);
    if (this.FirebaseAuth.isLoggedIn) {
      this.isSignedIn = true;
     //  console.log(this.email);
      // alert('Compte crée avec succès.');
    }
  }

  async onSignin(email: string, password: string) {
    await this.FirebaseAuth.signin(email, password);
    if (this.FirebaseAuth.isLoggedIn) {
      this.isSignedIn = true;
    }
  }

  addLoginClicked(value: boolean) {
    this.loginClicked.emit(value);
  }
}
