import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AppService} from 'src/app/app.service';
import {Affichage, Category, Product} from 'src/app/app.models';
import {ActivatedRoute} from '@angular/router';
import {SwiperConfigInterface, SwiperDirective} from 'ngx-swiper-wrapper';
import { AlertService } from 'src/app/alert-service.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {
  @ViewChild('zoomViewer') zoomViewer;
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};
  public form: FormGroup;
  public colors = ['#5C6BC0', '#66BB6A', '#EF5350', '#BA68C8', '#FF4081', '#9575CD', '#90CAF9', '#B2DFDB',
    '#DCE775', '#FFD740', '#00E676', '#FBC02D', '#FF7043', '#F5F5F5', '#696969'];
  public sizes = ['S', 'M', 'L', 'XL', '2XL', '32', '36', '38', '46', '52', '13.3"', '15.4"', '17"', '21"', '23.4"'];
  public selectedColors: string;
  public productsMap: Map<number, Product> = new Map();
  public products: Product[] = [];
  public categories: Category[] = [];
  public affichages: Affichage[] = [];
  public images: any[] = [];
  private sub: any;
  public id: any;
  public product: Product =  new Product(0, '', [0], 0, 0, 0, 0
  , 0, '', 0, 0, [''], [''], 0, 0, [0]); 

  constructor(public appService: AppService, 
    public formBuilder: FormBuilder, 
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      images: null,
      oldPrice: null,
      newPrice: [null, Validators.required],
      discount: null,
      description: null,
      availibilityCount: null,
      color: null,
      size: null,
      weight: null,
      categoryId: [null, Validators.required],
      affichageIds: [null, Validators.required],
      id: null
    });
    this.getCategories();
    this.getAffichages();
    this.sub = this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.id = params.id;
        this.getProductById();
      }
    });
    this.productsMap = this.appService.getProductsListMap();
    this.products = this.appService.getProductsList();
  }
  handleError(error): void {
    this.alertService.error(error.message);
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
       //  console.log(next);
        const affichages = next;
        if (next) {
          this.affichages = next._embedded.affichages;
        }
       //  console.log(this.affichages);
        },
        error => {
          this.handleError(error);
        });
    this.appService.Data.affichageList = this.affichages;
  }

  public getLastIdProduct(): number {
    let greatestId = 0;
    this.productsMap.forEach(produ => {
      if (Number(produ.id) >= Number(greatestId)) {
        greatestId = produ.id;
      }
    });
   //  console.log(greatestId + 'id le plus grand');
    return greatestId;
  }

  public getProductById() {
    this.appService.getProductById(this.id).subscribe(myObjectFound => {
      const product: Product =  new Product(0, '', [0], 0, 0, 0, 0
      , 0, '', 0, 0, [''], [''], 0, 0, [0]); 
      product.name = myObjectFound.name;
      product.id = myObjectFound.id;
      if (myObjectFound.imagesIds.arrayValue) {
        product.imagesIds[0] = myObjectFound.imagesIds[0];
       //  console.log(product.imagesIds[0] + ' lien premier image');
      } else {
        product.imagesIds = myObjectFound.imagesIds;
      }
      product.imagesIds = myObjectFound.imagesIds;
      product.oldPrice = myObjectFound.oldPrice;
      product.newPrice = myObjectFound.newPrice;
      product.discount = myObjectFound.discount;
      // product.ratingsCount = myObjectFound.ratingsCount;
      // product.ratingsValue = myObjectFound.ratingsValue;
      product.description = myObjectFound.description;
      product.availibilityCount = myObjectFound.availibilityCount;
      // product.color = myObjectFound.color.arrayValue;
      // product.size = myObjectFound.size.arrayValue;
      product.weight = myObjectFound.weight;
      product.categoryId = myObjectFound.categoryId;
      product.affichageIds= myObjectFound.affichageId;
      product.id = myObjectFound.id;
      this.form.patchValue(product);
      this.selectedColors = myObjectFound.color[0];
      if (myObjectFound.imagesIds.arrayValue) {
        for (let i = 0; i < myObjectFound.images.length; i++) {
          this.product.imagesIds[i] = myObjectFound.imagesIds[i];
        }
      }
      if (myObjectFound.color.arrayValue) {
        for (let j = 0; j < myObjectFound.images.length; j++) {
          this.product.color[j] = myObjectFound.color[j];
        }
      }
      if (myObjectFound.size.arrayValue) {
        for (let k = 0; k < myObjectFound.size.length; k++) {
          this.product.size[k] = myObjectFound.size[k];
        }
      }
     //  console.log(this.product + ' à la fin de get');
      this.form.controls.images.setValue(this.product.imagesIds);
    });
  }

  public onSubmit() {
   //  console.log(this.product + ' product value');
    if (this.form.valid) {
      this.product = this.form.value;
      this.images = this.form.value.images;
      if (this.product) {
        const index: number = this.products.findIndex(x => x.id === this.product.id);
        if (index === -1) {
         //  console.log(this.product);
          this.appService.addProduct(this.product, this.images);
        }
      }
    }
  }


  public onColorSelectionChange(event: any) {
    if (event.value) {
      this.selectedColors = event.value.join();
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
