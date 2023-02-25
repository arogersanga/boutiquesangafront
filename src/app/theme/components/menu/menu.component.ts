import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../../app.service';
import { Category, Product } from 'src/app/app.models';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Output() activatedRouteName =new EventEmitter<string>();
  public products: Product[] = [];
  public categories: Category[] = [];

  constructor(
    public router: Router,
    public translate: TranslateService,
    public appService: AppService,
    private activatedRoute: ActivatedRoute
  ) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('fr');
  }

  ngOnInit() { }

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
  addCategoryRoute(categoryName: string){
    this.activatedRouteName.emit(categoryName);
  }
}
