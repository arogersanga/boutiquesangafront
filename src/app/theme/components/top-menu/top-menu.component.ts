import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '../../../app.service';
import { Settings, AppSettings } from '../../../app.settings';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html'
})
export class TopMenuComponent implements OnInit {
  public currencies = ['EUR', 'USD'];
  public currency: any;
  public  login = false;
  public settings: Settings;
  constructor(public appSettings: AppSettings, public appService: AppService, public translate: TranslateService) {
    this.settings = this.appSettings.settings;
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('fr');
  }

  ngOnInit() {
    this.currency = this.currencies[0];
  }
  openMegaMenu() {
    const pane = document.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, el => {
      if (el.children.length > 0) {
        if (el.children[0].classList.contains('mega-menu')) {
          el.classList.add('mega-menu-pane');
        }
      }
    });
  }

  public changeCurrency(currency) {
    this.currency = currency;
  }

  public changeLang(lang: string) {
    this.translate.use(lang);
  }

  public getLangText(lang) {
    if (lang === 'de') {
      return 'German';
    } else if (lang === 'fr') {
      return 'French';
    } else if (lang === 'ru') {
      return 'Russian';
    } else if (lang === 'tr') {
      return 'Turkish';
    } else {
      return 'English';
    }
  }

  loginClicked() {
    this.appService.loginClicked(true);
    // return this.login;
  }
}
