import { Component, OnInit, AfterViewInit, DoCheck, OnChanges } from '@angular/core';
import { AppService } from '../../app.service';
import { Affichage, Category, Product, AffichagesParProduit, CategoriesParProduit, Slides, Banners } from '../../app.models';
import { AlertService } from 'src/app/alert-service.service';
import { Subscription } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  public activatedRouteName = '';
  public affichagesParProduits: Array<AffichagesParProduit> = [];
  public produitsParCategories: Array<Product> = [];
  public brands = [];
  public banners: Banners[] = [{ id:0, title: 'The biggest sale', subtitle: 'Special for today', affichageId:0, productId:0},
  {id:0,  title: 'Summer collection', subtitle: 'New Arrivals On Sale', affichageId:0, productId:0 },
  { id:0, title: 'The biggest sale', subtitle: 'Special for today', affichageId:0, productId:0 },
  { id:0, title: 'Summer collection', subtitle: 'New Arrivals On Sale', affichageId:0, productId:0 },
  { id:0, title: 'The biggest sale', subtitle: 'Special for today', affichageId:0, productId:0 }];
  public featuredProducts: Array<Product> = [];
  public onSaleProducts: Array<Product> = [];
  public topRatedProducts: Array<Product> = [];
  public newArrivalsProducts: Array<Product> = [];
  public anewArrivalsProductsffichages: Array<Affichage> = [];
  public categories: Array<Category> = [];
  public products: Array<Product> = [];
  public slides: Slides[] = [];
  slidesSubscription: Subscription;
  featuredProductsSubscription: Subscription;
  newArrivalsProductsSubscription: Subscription;
  onSaleProductsSubscription: Subscription;
  topRatedProductsSubscription: Subscription;
  affichages : Affichage[] = [];
  datas: Product[] = [];
  constructor(public appService: AppService, private alertService: AlertService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.getAffichages();
    this.getAllProducts();
    this.appService.getAllSlides();
    this.getAllBanners();
    this.slidesSubscription = this.appService.slidesSubject.subscribe(
      (slides: Slides[]) => {
        this.slides = slides;
     // console.log(this.slides + ' dans oninit')      
      }
    );  
  }

  public onLinkClick(e) {
    this.getProduitsParAffichages(e.tab.textLabel);
  }

  public getAllProducts() {
    this.products = [];
    this.appService.getAllProducts().subscribe(next => {
        if (next) {
          this.products = next._embedded.products;
        }
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

  public getIdAffichageName(name: string): number {
    let id = -1;
    this.affichages.forEach(affichage => {

      if (affichage.name.trim().toLowerCase() === name.trim().toLowerCase()) {
        id = affichage.id;
      }
    });
 return id;
    
  }
 

  public getProduitsParAffichages(typeAffichage: string) {
    let data: Product[] = [];
     this.appService.getAffichageByName(typeAffichage).subscribe(affichage => {
      if (affichage) {
        data = this.products?.filter(item=>item.affichageIds.includes(affichage.id));
         if (typeAffichage === "Featured") { 
           this.featuredProducts = data;
       }
       if (typeAffichage === "On Sale") {
         this.onSaleProducts = data;
       }
       if (typeAffichage === "Top Rated") {
           this.topRatedProducts = data;
       }
       if (typeAffichage === "New Arrivals") {
         this.newArrivalsProducts = data;
       }         
      }
    });
  
  }

  public getCategories() {
    this.appService.getCategories().subscribe(next => {
      if (next) {
        this.categories = next._embedded.categories;
      }
    });
    this.appService.Data.categories = this.categories;
  }
  public getProduitsParCategories(categorieName: string) {
    this.datas = [];
    let categorie = this.categories?.filter(item=>item.name.includes(categorieName))[0];
    if (categorie) {
       this.datas = this.products?.filter(item=>item.categoryId == categorie.id);
    }
    if (!categorie) {
        this.datas = this.products;
      }
      this.appService.setProductsList(this.datas);
  }

  addCategoryName(activatedRouteName: string){
      this.getProduitsParCategories(activatedRouteName);
  }
  public getAllBanners() {
    this.appService.getAllBanners().subscribe(data=>{
      this.banners = data._embedded.bannerses;
   // console.log(this.banners[2].productId + ' banners dans home.ts');
    });
  }

  handleError(error): void {
    this.alertService.error(error.message);
  }
}