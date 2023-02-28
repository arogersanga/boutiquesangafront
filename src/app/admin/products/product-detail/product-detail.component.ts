import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppService} from 'src/app/app.service';
import {SwiperDirective, SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {Affichage, Category, Product, Image} from 'src/app/app.models';
import {ProductZoomComponent} from './product-zoom/product-zoom.component';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {emailValidator} from 'src/app/theme/utils/app-validators';
import { AlertService } from 'src/app/alert-service.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('zoomViewer') zoomViewer;
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};
  public product: Product =  new Product(0, '', [0], 0, 0, 0, 0
  , 0, '', 0, 0, [''], [''], 0, [0], [0]); 
  public image: any;
  public zoomImage: any;
  public form: FormGroup;
  public categories: Array<Category> = [];
  public affichages: Array<Affichage> = [];
  images: Array<Image> = [];
  constructor(public alertService: AlertService, public appService: AppService, private activatedRoute: ActivatedRoute, public dialog: MatDialog, public formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.getProductById(this.activatedRoute.snapshot.paramMap.get('id'));
    this.form = this.formBuilder.group({
      review: [null, Validators.required],
      name: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      email: [null, Validators.compose([Validators.required, emailValidator])]
    });
    this.getCategories();
    this.getAffichages();
    this.getImages();
  }

  handleError(error): void {
    this.alertService.error(error.message);
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
  }

  public getProductById(id: any) {
    this.appService.getProductById(id).subscribe(next=> {
      let product: Product =  new Product(0, '', [0], 0, 0, 0, 0
      , 0, '', 0, 0, [''], [''], 0, [0], [0]); 
      if (next) {
        product = next;
        console.log(product.imagesIds.toString() + 'produits dans product detail');
      
      
        //     console.log(product + 'premiers produits');
    
        // console.log(next + 'chaque produit');
       
        //product.name = next.name;
        // product.id = next.id;
         if (next.images) {
           product.imagesIds = next.imagesIds;
         }
        // product.oldPrice = next.oldPrice;
        // product.newPrice = next.newPrice;
        // product.discount = next.discount;
        // product.ratingsCount = next.ratingsCount;
        // product.ratingsValue = next.ratingsValue;
        // product.description = next.description;
        // product.availibilityCount = next.availibilityCount;
        // product.cartCount = next.cartCount;
        // product.color = next.color;
        // product.size = next.size;
        // product.weight = next.weight;
        // product.categoryId = next.categoryId;
        // product.affichageIds= next.affichageId;
        // product.id = next.id;
        this.product = product;
 
      }
     
      });   
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

  public selectImage(image) {
    this.image = image.medium;
    this.zoomImage = image.big;
  }

  public onMouseMove(e) {
    if (window.innerWidth >= 1280) {
      let image; let offsetX; let offsetY; let x; let y; let zoomer;
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
    // this.sub.unsubscribe();
  }

  public onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

}
