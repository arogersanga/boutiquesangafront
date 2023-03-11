import {AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { AppService } from '../../../app.service';
import {Affichage, Category, Product, Image} from '../../../app.models';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { ProductListComponent } from 'src/app/admin/products/product-list/product-list.component';
import { AlertService } from 'src/app/alert-service.service';
import { ProductDialogComponent } from 'src/app/shared/product-caroussel/product-dialog/product-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  @ViewChild('zoomViewer', { static: true }) zoomViewer;
  @ViewChild(SwiperDirective, { static: true }) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};
  public product: Product;
  public image: any;
  public images: Array<Image>;
  public zoomImage: any;
  private sub: any;
  public form: FormGroup;
  public relatedProducts: Array<Product>;
  private emailValidator: any;
  public affichagesMap: Map<string, Affichage> = new Map();
  public categoriesMap: Map<string, Category> = new Map();
  public affichages: Affichage[] = [];
  public categories: Category[] = [];
  public activatedRouteName: string;

  constructor(public appService: AppService, private alertService: AlertService, private activatedRoute: ActivatedRoute, public dialog: MatDialog, public formBuilder: FormBuilder) {  }

  ngOnInit() {
    this.activatedRouteName = this.activatedRoute.snapshot.paramMap.get('name');
    let activatedRouteId = Number.parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.activatedRouteName) {
      this.getProductByName(this.activatedRouteName);
    }

    if (activatedRouteId) {
      this.getProductById(activatedRouteId);
    }

    this.form = this.formBuilder.group({
      review: [null, Validators.required],
      name: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      email: [null, Validators.compose([Validators.required, this.emailValidator])]
    });
    this.getRelatedProducts();
    this.getCategories();
    this.getAffichages();
    this.getImages();
  }

  ngAfterViewInit() {
    this.config = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 10,
      keyboard: true,
      navigation: true,
      pagination: false,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        }
      }
    };
    this.getImages();
  }

  public getProductByName(name: string) {
    this.appService.getProductByName(name).subscribe(next => {
      if (next) {
        this.product = next;
      }
      
    });
    return this.product;
  }

  public getProductById(id: number) {
    this.appService.getProductById(id).subscribe(next => {
      if (next) {
        this.product = next;
      }
      
    });
    return this.product;
  }

  public getCategories() {
    this.appService.getCategories()
    .subscribe(next => {
          if (next) {
            this.categories = next._embedded.categories;
          }
      },
      error => {
        this.handleError(error);
      });
  }

  
  public getImages() {
    this.appService.getImages()
    .subscribe(next => {
          if (next) {
            this.images = next._embedded.images;
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
        }
        },
        error => {
          this.handleError(error);
        });
    this.appService.Data.affichageList = this.affichages;
  }
  public getRelatedProducts() {
    this.appService.getProducts('related').subscribe(data => {
      this.relatedProducts = data;
    });
  }

  public selectImage(image) {
    this.image = image;
    this.zoomImage = image;
  }

  public onMouseMove(e) {
    if (window.innerWidth >= 1280) {
      let image, offsetX, offsetY, x, y, zoomer;
      image = e.currentTarget;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      x = offsetX / image.offsetWidth * 100;
      y = offsetY / image.offsetHeight * 100;
      zoomer = this.zoomViewer.nativeElement.children[0];
      if (zoomer) {
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
        zoomer.style.display = 'block';
        zoomer.style.height = image.height + 'px';
        zoomer.style.width = image.width + 'px';
      }
    }
  }

  ngDoCheck() {
    this.activatedRouteName = this.activatedRoute.snapshot.paramMap.get('name');
    if (this.activatedRouteName) {
      if (!this.categories) {
        this.getCategories();
      }
    }
  }

  public onMouseLeave(event) {
    this.zoomViewer.nativeElement.children[0].style.display = 'none';
  }

  public openZoomViewer() {
    this.dialog.open(ProductZoomComponent, {
      data: this.zoomImage,
      panelClass: 'zoom-dialog'
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
  handleError(error): void {
    this.alertService.error(error.message);
  }

}
