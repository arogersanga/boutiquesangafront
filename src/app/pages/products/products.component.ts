import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  AfterViewInit,
  Input
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../../app.service';
import { Product, Category, Affichage, Image } from '../../app.models';
import { Settings, AppSettings } from 'src/app/app.settings';
import { isPlatformBrowser } from '@angular/common';
import { ProductDialogComponent } from '../../shared/product-caroussel/product-dialog/product-dialog.component';
import { AlertService } from '../../alert-service.service';
import { Subscription } from 'rxjs';
import { ProductZoomComponent } from './product/product-zoom/product-zoom.component';
import { ProductDetailComponent } from 'src/app/admin/products/product-detail/product-detail.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']

})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public productsSubscription: Subscription;
  categoryName: any;
  public activatedRouteName: string;
  public sidenavOpen = true;
  public product: Product;
  public viewType = 'grid';
  public viewCol = 25;
  public counts = [12, 24, 36];
  public count: any;
  public sortings = ['Sort by Default', 'Best match', 'Lowest first', 'Highest first'];
  public sort: any;
  public products: Product[] = [];
  public images: Image[];
  public affichages: Affichage[] = [];
  public categories: Category[] = [];
  public brands = [];
  public priceFrom = 5;
  public priceTo = 100;
  public sub: any;
  public colors = [
    { name: '#5C6BC0', selected: false },
    { name: '#66BB6A', selected: false },
    { name: '#EF5350', selected: false },
    { name: '#BA68C8', selected: false },
    { name: '#FF4081', selected: false },
    { name: '#9575CD', selected: false },
    { name: '#90CAF9', selected: false },
    { name: '#B2DFDB', selected: false },
    { name: '#DCE775', selected: false },
    { name: '#FFD740', selected: false },
    { name: '#00E676', selected: false },
    { name: '#FBC02D', selected: false },
    { name: '#FF7043', selected: false },
    { name: '#F5F5F5', selected: false },
    { name: '#696969', selected: false }
  ];
  public sizes = [
    { name: 'S', selected: false },
    { name: 'M', selected: false },
    { name: 'L', selected: false },
    { name: 'XL', selected: false },
    { name: '2XL', selected: false },
    { name: '32', selected: false },
    { name: '36', selected: false },
    { name: '38', selected: false },
    { name: '46', selected: false },
    { name: '52', selected: false },
    { name: '13.3"', selected: false },
    { name: '15.4"', selected: false },
    { name: '17"', selected: false },
    { name: '21"', selected: false },
    { name: '23.4"', selected: false }
  ];
  public page: any;
  public settings: Settings;
  datas: any;
  categoryRecherche: Category;

  constructor(public appSettings: AppSettings,
    private activatedRoute: ActivatedRoute,
    public appService: AppService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.count = this.counts[0];
    this.sort = this.sortings[0];

    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    }
    if (window.innerWidth < 1280) {
      this.viewCol = 33.3;
    }
    
    this.activatedRoute.url.subscribe(url => {
      console.log(url.toString() + 'dans products.ts 2222 categoryRoute');
      if (url.toString()) {
        this.getProductsByActivatedRoute(url.toString());
      }
    });
    this.getCategories();
    this.getAllProducts();
    this.getImages();
  }

  public getAllProducts() {
    this.appService.getAllProducts().subscribe(next => {
      if (next) {
        this.products = next._embedded.products;
      }
      console.log(this.products + ' dans getAllProds productsComponent')
    });

  }

  public getCategories() {
    this.appService.getCategories().subscribe(next => {
      if (next) {
        this.categories = next._embedded.categories;
        console.log(this.categories + ' dans getAllCategories productsComponent')
      }
    });
  }

  getProductsByActivatedRoute(url: string): Product[] {
    this.products = [];
    this.appService.getProductsByCategoryName(url).subscribe(next => {
      if (next){
        this.products = next;
        console.log(this.products + ' dans onInit 4444 productsComponent10222222');
      }      
    });
    return this.products;
  }

  ngAfterViewInit() {
    /* console.log(this.activatedRoute.url.toString() + 'dans products.ts 2222::::::: categoryRoute');
    this.getAllProducts();
    this.activatedRoute.url.subscribe(url => {
      console.log(url.toString() + 'dans ngafter products.ts 222211111 categoryRoute');
      if (url.toString()) {
        this.getProductsByActivatedRoute(url.toString());
      } 
    });
     */
    this.getImages();
  }
8
  public getImages() {
    this.appService.getImages()
      .subscribe(next => {

        if (next) {
          this.images = next._embedded.images;
          // console.log(this.images + 'images list');
        }
      },
        error => {
          this.handleError(error);
        });
  }

  public getAffichages() {
    this.appService.getAffichages()
      .subscribe(next => {

        if (next) {
          this.affichages = next._embedded.affichages;
          // console.log(this.affichages + 'affich list');
        }
      },
        error => {
          this.handleError(error);
        });
    this.appService.Data.affichageList = this.affichages;
  }

  public getBrands() {
    this.brands = this.appService.getBrands();
    this.brands.forEach(brand => { brand.selected = false });
  }

  ngOnDestroy() {
    // this.products = [];
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }

  public changeCount(count) {
    this.count = count;
    // this.getAllProducts();
  }

  public changeSorting(sort) {
    this.sort = sort;
  }

  public changeViewType(viewType, viewCol) {
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public openProductDialog(product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: product,
      panelClass: 'product-dialog',
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(produc => {
      if (product) {
        this.router.navigate(['/products/', produc.id]);
      }
    });
  }

  public onPageChanged(event) {
    this.page = event;
    // this.getAllProducts();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  public onChangeCategory(event) {
    if (event.target) {
      this.router.navigate(['/products', event.target.innerText.toLowerCase()]);
    }
  }

  handleError(error): void {
    this.alertService.error(error.message);
  }
}
