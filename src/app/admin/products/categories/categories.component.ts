import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from 'src/app/app.models';
import {AppService} from 'src/app/app.service';
import {CategoryDialogComponent} from './category-dialog/category-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import {AppSettings, Settings} from 'src/app/app.settings';
import {AlertService} from '../../../alert-service.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  category: Category = new Category(0, '', false, 0);
  categories: Category[] = [];
  categoriesMap: Map<number, Category> = new Map();
  public page: any;
  public count = 6;
  public settings: Settings;

  constructor(public appService: AppService, private alertService: AlertService, public dialog: MatDialog, public appSettings: AppSettings) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.getCategories();
  }

  public getCategories() {
   this.appService.getCategories()
      .subscribe(next => {
            const categories = next;
            if (next) {
              this.categories = next._embedded.categories;
            }
        },
        error => {
          this.handleError(error);
        });
   }

  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }

  public openCategoryDialog(data: any) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: {
        category: data,
        categories: this.categories
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(category => {
      if (category) {
       //  console.log(category.parentId + '0');
        this.category.parentId = Number(category.parentId);
        if (category._links) {
          const index: number = this.categories.findIndex(x => x.id === category.id);
          this.categories[index] = category;
         //  console.log(category + '1');
          this.categoriesMap.set(category.id, category);
          this.appService.updateCategory(category);
        } else {
      
        //  const cat = category;
        // this.category.id = category.id;
        this.category.name = String(category.name);
        this.category.hasSubCategory = Boolean(category.hasSubCategory);
        this.category.parentId = Number(category.parentId);
          // category.id = + this.getLastIdCategory() + 1;
          this.categories.unshift(category);
          //this.categoriesMap.set(category.id, category);
         //  console.log(this.category.parentId + '2');
          this.appService.addCategory(this.category);
         //  console.log(this.category);
        }
      }
    });
  }

  public getLastIdCategory(): number {
    let greatestId = 0;
    this.categoriesMap.forEach(categ => {
      if (Number(categ.id) >= Number(greatestId)) {
        greatestId = categ.id;
      }
    });
    return greatestId;
  }

  public remove(category: Category) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want remove this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.categories.indexOf(category);
        if (index !== -1) {
          this.category.name = category.name
         //  console.log(category.name + ' : category a supprimer dans le composant');
         //  console.log(index + ' : index category a supprimer dans le composant');
          this.categoriesMap.delete(category.id);
          this.appService.removeCategory(category);
          this.categories.splice(index, 1);
        }
      }
    });
  }

  handleError(error): void {
    this.alertService.error(error.message);
  }

  ngOnDestroy(): void {
    // this.categories = [];
  }
}
