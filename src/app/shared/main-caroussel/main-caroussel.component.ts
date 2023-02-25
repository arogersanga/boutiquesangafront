import {Component, OnInit, Input, AfterViewInit, Output} from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/alert-service.service';
import { Product, Slides } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-main-caroussel',
  templateUrl: './main-caroussel.component.html',
  styleUrls: ['./main-caroussel.component.scss']
})
export class MainCarousselComponent implements OnInit, AfterViewInit {
  slidesSubscription: Subscription;
  @Input() slides: Array<Slides>;
  public products: Array<Product> = [];

  public config: SwiperConfigInterface = {};

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };

  constructor(public appService: AppService, private alertService: AlertService) { }

  ngOnInit() {
   this.getAllProducts();
  }

  ngAfterViewInit(){
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,         
      keyboard: true,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,        
      loop: false,
      preloadImages: false,
      lazy: true,     
      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      },
      speed: 500,
      effect: "slide"
    }
  }

  public getAllProducts() {
    this.products = [];
    this.appService.getAllProducts().subscribe(next => {
      if (next) {
        this.products = next._embedded.products;
      }
      });
  }

}
