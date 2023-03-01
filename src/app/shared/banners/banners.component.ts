import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from 'src/app/alert-service.service';
import { Banners, Product, Image } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {
  @Input() banners: Array<Banners>;
  public products: Array<Product> = [];
  images: Array<Image> = [];
  imageURL: string = '';
  image: Image;
  constructor(public appService: AppService, private alertService: AlertService) { }

  ngOnInit() { 
    this.getAllImages();
    this.getAllProducts();
  }

  public getAllProducts() {
    this.products = [];
    this.appService.getAllProducts().subscribe(next => {
      if (next) {
        this.products = next._embedded.products;
      }
      });
  }

  public getAllImages() {
    this.images = [];
    this.appService.getAllImages().subscribe(next => {
      if (next) {
        this.images = next._embedded.images;
      }
      });
  }

  public getBanner(index): Banners{
    return this.banners[index];
  }

  public getBgImage(index){
    let product : Product;
    this.products.forEach(prod => {
      if (prod.id === this.banners[index].productId){
         product = prod;
      }
    });
    // let bgImage = {
    //   'background-image': index != null ? "url(" + this.getImageURLById(product.imagesIds[0]) + ")" : "url(https://via.placeholder.com/600x400/ff0000/fff/)"
    // };
     return product;
  } 

  public getImageURLById(idImage: number): string{
    this.image = new Image(0, '', '');
    this.appService.getImagesById(idImage).subscribe(next => {
      if (next) {
        this.image = next;
      }
      });
    this.imageURL = this.image.value1.concat(this.image.value2);
    return this.imageURL;
  }
}
