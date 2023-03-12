import {Component, Input, Output, EventEmitter, DoCheck, OnInit} from '@angular/core';
import { AppService } from 'src/app/app.service';
import {Category} from '../../app.models';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements DoCheck, OnInit {

  @Input() categories;
  @Input() categoryParentId;
  @Output() change: EventEmitter<any> = new EventEmitter();
  mainCategories: Category[];
  cats: Category[] = [];
  constructor(public appService: AppService) {}

  public ngOnInit() {
    this.getCategories();
    
    console.log("les categories sont : " + this.categories)
  }
  public ngDoCheck() {
   
  }

  public stopClickPropagate(event: any) {
    if (window.innerWidth < 960) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  public changeCategory(event) {
    this.change.emit(event);
  }
  public getCategories() {
    this.appService.getCategories().subscribe(next => {
      if (next) {
        let categs = next._embedded.categories;
          categs.forEach( category => {
            if (category.parentId == 0) {
               this.cats.unshift(category);
               console.log(this.cats + ' les cats');
             }
          });
        
        console.log(this.cats + ' dans getAllCategories categorylistComponent')
      }
    });
  }
}
