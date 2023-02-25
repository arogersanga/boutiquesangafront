import { isPlatformBrowser } from '@angular/common';
import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from './app.settings';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  // loading = false;
  public settings: Settings;
  constructor(public appSettings: AppSettings,
              public router: Router,
              @Inject(PLATFORM_ID) private platformId: object,
              // tslint:disable-next-line:one-line
              public translate: TranslateService){
    this.settings = this.appSettings.settings;
    translate.addLangs(['en' , 'de' , 'fr']);
    translate.setDefaultLang('fr');
    translate.use('fr');
  }


  ngOnInit() {
    // this.router.navigate(['/home']);  // redirect other pages to homepage on browser refresh
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      }
    });
  }
}
