import { Component, OnInit } from '@angular/core';
import { Settings } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/alert-service.service';
import { Banners, Affichage, Product } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { AppSettings } from 'src/app/app.settings';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { BannersDetailsComponent } from './banners-details/banners-details.component';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {

  banner: Banners = new Banners(0, '', '', 0, 0);
  banners: Banners[] = [];
  affichages: Array<Affichage> = [];
  products: Array<Product> = [];
  bannersMap: Map<number, Banners> = new Map();
  public page: any;
  public count = 6;
  public settings: Settings;
  constructor(public appService: AppService, private alertService: AlertService, public dialog: MatDialog, public appSettings: AppSettings) {
//    this.settings = this.appSettings.settings;
   }

  ngOnInit(): void {
    this.getAffichages();
    this.getAllProducts();
    this.getBanners();
  }
  public getBanners() {
    this.appService.getAllBanners()
        .subscribe(next => {
          console.log(next + ' banners');

          if (next) {
            this.banners = next._embedded.bannerses;
          }
          // console.log(this.banners + ' banners after assignment');
          },
          error => {
            this.handleError(error);
          });
    }
  
    public getAffichages() {
      this.affichages = [];
      this.appService.getAffichages()
        .subscribe(next => {
     
          if (next) {
            this.affichages = next._embedded.affichages;
          }
          // console.log(this.affichages + ' affichages after assignment');
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
   
    public onPageChanged(event) {
      this.page = event;
      window.scrollTo(0, 0);
    }
  
    public openBannerDialog(data: any) {
      const dialogRef = this.dialog.open(BannersDetailsComponent, {
        data: {
          banner: data,
          banners: this.banners
        },
        panelClass: ['theme-detail'],
        autoFocus: false,
        direction: (this.appSettings.settings.rtl) ? 'rtl' : 'ltr'
      });
      dialogRef.afterClosed().subscribe(banner => {
        if (banner) {
          const index: number = this.banners.findIndex(x => x.id === banner.id);
          if (index != -1) {
            this.banners[index] = banner;
            this.bannersMap.set(banner.id, banner);
            this.appService.updatebanner(banner);
          } else {
            this.banner = new Banners(0, '', '', 0, 0);
            this.banner.id = banner.id;
            this.banner.affichageId = banner.affichageId;
            this.banner.productId = banner.productId;
            this.banner.subtitle = banner.subtitle;
            this.banner.title = banner.title;
            // console.log(this.banner.productId + '  mon banner ');
            this.banners.unshift(this.banner);
            this.appService.addBanners(this.banner);
            
          }
        }
      });
    }
  
    public getLastIdbanner(): number {
      let greatestId = 0;
      this.bannersMap.forEach(banner => {
        if (Number(banner.id) >= Number(greatestId)) {
          greatestId = banner.id;
        }
      });
      return greatestId;
    }
  
    public remove(banner: any) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Action',
          message: 'Are you sure you want remove this banner?'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          const index: number = this.banners.indexOf(banner);
          if (index !== -1) {
            this.bannersMap.delete(banner.id);
            this.appService.removeBanners(banner);
            this.banners.splice(index, 1);
          }
        }
      });
    }
  
    handleError(error): void {
      this.alertService.error(error.message);
    }
  
    ngOnDestroy(): void {
      this.banners = [];
    }
}
