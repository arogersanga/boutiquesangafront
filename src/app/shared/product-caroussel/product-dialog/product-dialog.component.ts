import {Component, ViewEncapsulation, OnInit, Inject, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AppService } from '../../../app.service';
import { Category, Product, Image } from '../../../app.models';
import { AlertService } from 'src/app/alert-service.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductDialogComponent implements OnInit, AfterViewInit {
  public categories: Category[] = [];
  public config: SwiperConfigInterface = {};
  public images: Array<Image>;
  constructor(public appService: AppService,
              public dialogRef: MatDialogRef<ProductDialogComponent>,
              private alertService: AlertService,
              @Inject(MAT_DIALOG_DATA) public product: Product) { }

  ngOnInit() {
    this.getCategories();
    this.getImages();
   }

  ngAfterViewInit() {
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      }
    };
  }

  public close(): void {
    this.dialogRef.close();
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

  public getCategories() {
    this.appService.getCategories()
    .subscribe(next => {
          if (next) {
            this.categories = next._embedded.categories;
          }
        });
  }

  handleError(error): void {
    this.alertService.error(error.message);
  }

}
