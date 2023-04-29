import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { AppService } from '../app.service';
import { AppSettings, Settings } from '../app.settings';
import { Category, Product } from '../app.models';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SidenavMenuService } from '../theme/components/sidenav-menu/sidenav-menu.service';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [SidenavMenuService]
})
export class PagesComponent implements OnInit, OnChanges, AfterViewInit {

  public loginClicked = false;
  public showBackToTop = false;
  public categories: Category[] = [];
  public category: Category;
  loginClickedSubscrition: Subscription;
  public sidenavMenuItems: Array<any>;
  public produits: Array<Product> = [];
  public products: any;
  public datas: Array<Product> = [];
  @ViewChild('sidenav', { static: true }) sidenav: any;
  @ViewChild('login') login: any;
  labelSearch: string;

  public settings: Settings;
  responseProductsFiltered: Product[] = [];
  responseProduct: Product;
product: any;
  constructor(public appSettings: AppSettings,
    public appService: AppService,
    public sidenavMenuService: SidenavMenuService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: object) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.getCategories();
    this.getAllProducts();
    this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
    setTimeout(() => {
      this.settings.theme = 'green';
    });

    this.loginClickedSubscrition = this.appService.loginSubject.subscribe(loginClicked => {
      this.loginClicked = loginClicked;
    });
  }

  public getProduitsParCategories(categorieName: string) {
    this.datas = [];
    let categorie = this.categories?.filter(item => item.name.includes(categorieName))[0];
    if (categorie) {
      this.datas = this.produits?.filter(item => item.categoryId == categorie.id);
    }
    if (!categorie) {
      this.datas = this.produits;
    }
    this.appService.setProductsList(this.datas);
  }

  addCategoryName(activatedRouteName: string) {
    this.getProduitsParCategories(activatedRouteName);
  }

  public getAllProducts() {
    this.produits = [];
    this.appService.getAllProducts().subscribe(next => {
      if (next) {
        this.produits = next._embedded.products;
        this.appService.productsList = this.produits;
      }
    });
  }

  ngOnChanges() {
    ////  console.log(this.activatedRoute.snapshot.params['name'] + ' activatedroute 1');
    // if (this.activatedRoute.snapshot.params['name']) {
    //   this.getProduitsParCategories(this.activatedRoute.snapshot.params['name']);      
    // }
  }

  public getCategories() {
    this.appService.getCategories().subscribe(next => {
      if (next) {
        this.categories = next._embedded.categories;
        this.category = this.categories[0];
        this.appService.Data.categories = this.categories;
      }
    });
  }

  public changeCategory(event) {
    if (event.target) {
      this.category = this.categories.filter(category => category.name === event.target.innerText)[0];
    }
    if (window.innerWidth < 960) {
      this.stopClickPropagate(event);
    }
  }

  public remove(product) {
    const index: number = this.appService.Data.cartList.indexOf(product);
    if (index !== -1) {
      this.appService.Data.cartList.splice(index, 1);
      this.appService.Data.totalPrice = this.appService.Data.totalPrice - product.newPrice * product.cartCount;
      this.appService.Data.totalCartCount = this.appService.Data.totalCartCount - product.cartCount;
      this.appService.resetProductCartCount(product);
    }
  }

  public clear() {
    this.appService.Data.cartList.forEach(product => {
      this.appService.resetProductCartCount(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }


  public changeTheme(theme) {
    this.settings.theme = theme;
  }

  public stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  public filter() {
    if (typeof this.labelSearch === 'string') {
      this.responseProductsFiltered = this.produits.filter(
        response => {
        const regex = new RegExp('^.*(' + this.labelSearch.toLowerCase() + ').*$');
        return regex.test(response.name.toLowerCase());
      });
    }
  }

  public onProductNameChanged(product: Product) {
    this.appService.getProductsByLikeName(product.name).subscribe(products => {
      if (products) {
        this.responseProductsFiltered = products;
        this.router.navigate(['/products/prods/productsListByLikeName/', product.name]);
      }
    });
  }

  public filterProducts(labelSearch: String) {
    this.appService.getProductsByLikeName(labelSearch).subscribe(products => {
      if (products) {
        this.responseProductsFiltered = products;
        this.router.navigate(['/products/prods/productsListByLikeName/', labelSearch]);
      }
    });
  }

  displayFn(product?: Product): string | undefined {
    return product ? product.name : undefined;
  }

  public scrollToTop() {
    const scrollDuration = 200;
    const scrollStep = -window.pageYOffset / (scrollDuration / 20);
    const scrollInterval = setInterval(() => {
      if (window.pageYOffset !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 10);
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      });
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    ($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;
  }


  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sidenav.close();
      }
    });
    this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());

  }

  public closeSubMenus() {
    if (window.innerWidth < 960) {
      this.sidenavMenuService.closeAllSubMenus();
    }
  }

  addClicked($event: boolean) {
    this.loginClicked = $event;
  }
}
