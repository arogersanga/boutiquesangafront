import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { AppService } from '../../app.service';
import { Image, Product } from '../../app.models';
import { Settings, AppSettings } from 'src/app/app.settings';


@Component({
  selector: 'app-product-caroussel',
  templateUrl: './product-caroussel.component.html',
  styleUrls: ['./product-caroussel.component.scss']
})
export class ProductCarousselComponent implements OnInit, AfterViewInit {

  public images: Array<Image> = [];
 
  @Input('products') products: Array<Product> = [];
  public config: SwiperConfigInterface = {};
  public settings: Settings;
  constructor(public appSettings:AppSettings, public appService:AppService, public dialog: MatDialog, private router: Router) { 
    this.settings = this.appSettings.settings;
  }

  ngOnInit() { 
    this.getAllImages();
  }
  
  ngAfterViewInit(){
    this.config = {
      observer: true,
      slidesPerView: 1,
      spaceBetween: 16,       
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,        
      loop: false,
      preloadImages: false,
      lazy: true,  
      breakpoints: {
        480: {
          slidesPerView: 1
        },
        740: {
          slidesPerView: 2
        },
        960: {
          slidesPerView: 3
        },
        1280: {
          slidesPerView: 4
        },
        1500: {
          slidesPerView: 5
        }
      }
    }
  }
  public getAllImages() {
    this.images = [];
    this.appService.getAllImages().subscribe(next => {
      if (next) {
        this.images = next._embedded.images;
      }
      });
  }

  public openProductDialog(product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: product,
      panelClass: 'product-dialog',
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(produc => {
      if (produc) {
        this.router.navigate(['/products', produc.id, produc.name]);
      }
    });
  }

}












