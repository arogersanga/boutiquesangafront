import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/alert-service.service';
import { Affichage, Product, Slides } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { AppSettings, Settings } from 'src/app/app.settings';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { SlideDetailComponentComponent } from './slide-detail-component/slide-detail-component.component';


@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss']
})
export class SlidesComponent implements OnInit {
  slide: Slides = new Slides(0, '', '', 0, 0);
  slides: Slides[] = [];
  affichages: Array<Affichage> = [];
  products: Array<Product> = [];
  slidesMap: Map<number, Slides> = new Map();
  public page: any;
  public count = 6;
  public settings: Settings;
  constructor(public appService: AppService, private alertService: AlertService, public dialog: MatDialog, public appSettings: AppSettings) {
    this.settings = this.appSettings.settings;
   }

  ngOnInit(): void {
    this.getAffichages();
    this.getAllProducts();
    this.getSlides();
  }
  public getSlides() {
      this.appService.getAllSlides();
    }
  
    public getAffichages() {
      this.appService.getAffichages()
        .subscribe(next => {
     
          if (next) {
            this.affichages = next._embedded.affichages;
          }
          console.log(this.affichages + ' affichages after assignment');
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
  
    public openSlideDialog(data: any) {
      const dialogRef = this.dialog.open(SlideDetailComponentComponent, {
        data: {
          slide: data,
          slides: this.slides
        },
        panelClass: ['theme-detail'],
        autoFocus: false,
        direction: (this.settings.rtl) ? 'rtl' : 'ltr'
      });
      dialogRef.afterClosed().subscribe(slide => {
        if (slide) {
          const index: number = this.slides.findIndex(x => x.id === slide.id);
          if (index != -1) {
            this.slides[index] = slide;
            this.slidesMap.set(slide.id, slide);
            this.appService.updateSlide(slide);
          } else {
            this.slide = new Slides(0, '', '', 0, 0);
            this.slide.id = slide.id;
            this.slide.affichageId = slide.affichageId;
            this.slide.productId = slide.productId;
            this.slide.subtitle = slide.subtitle;
            this.slide.title = slide.title;
            console.log(this.slide.productId + '  mon slide ');
            this.slides.unshift(this.slide);
            this.appService.addSlides(this.slide);
            
          }
        }
      });
    }
  
    public getLastIdSlide(): number {
      let greatestId = 0;
      this.slidesMap.forEach(slide => {
        if (Number(slide.id) >= Number(greatestId)) {
          greatestId = slide.id;
        }
      });
      return greatestId;
    }
  
    public remove(slide: any) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Action',
          message: 'Are you sure you want remove this Slide?'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          const index: number = this.slides.indexOf(slide);
          if (index !== -1) {
            this.slidesMap.delete(slide.id);
            this.appService.removeSlides(slide);
            this.slides.splice(index, 1);
          }
        }
      });
    }
  
    handleError(error): void {
      this.alertService.error(error.message);
    }
  
    ngOnDestroy(): void {
      this.slides = [];
    }
}
