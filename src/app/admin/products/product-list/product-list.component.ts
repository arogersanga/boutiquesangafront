import {Component, OnInit, HostListener, DoCheck, AfterViewInit} from '@angular/core';
import {AppService} from 'src/app/app.service';
import {Affichage, Category, Product} from 'src/app/app.models';
import {ConfirmDialogComponent} from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../../../alert-service.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, DoCheck, AfterViewInit {
  public products: Array<Product> = [];
  public productsMap: Map<number, Product> = new Map();
  public affichagesMap: Map<number, Affichage> = new Map();
  public categoriesMap: Map<number, Category> = new Map();
  public viewCol = 25;
  public page: any;
  public count = 12;
  public categories: Array<Category> = [];
  public affichages: Array<Affichage> = [];

  constructor(public appService: AppService, private alertService: AlertService, private router: Router, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (window.innerWidth < 1280) {
      this.viewCol = 33.3;
    }

    this.getCategories();
    this.getAffichages();
    this.getAllProducts();
  }

  handleError(error): void {
    this.alertService.error(error.message);
  }

  public getCategories() {
    this.appService.getCategories()
    .subscribe(next => {
          if (next) {
            this.categories = next._embedded.categories;
            console.log(this.categories + 'categories list');
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
          console.log(this.affichages + 'affich list');
        }
        },
        error => {
          this.handleError(error);
        });
    this.appService.Data.affichageList = this.affichages;
  }


  public getAllProducts() {
    this.products = [];
    this.appService.getAllProducts().subscribe(next => {
      if (next) {
        this.products = next._embedded.products;
        
      }
      });
   
  }

  ngDoCheck() {
    
  }

  ngAfterViewInit() {
    
  }

  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }


  public remove(product: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirmer :',
        message: 'Voulez vous vraiment supprimer ce produit?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.products.indexOf(product);
        if (index !== -1) {
          this.appService.removeProduct(product);
          this.products.splice(index, 1);
        }
      }
    });
  }
}
