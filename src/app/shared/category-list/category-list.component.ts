import {Component, Input, Output, EventEmitter, DoCheck, OnInit} from '@angular/core';
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
  constructor() {}

  public ngOnInit() {
    this.cats = this.categories
  }
  public ngDoCheck() {
    if (this.cats && !this.mainCategories) {
      this.cats.forEach( category => {
        if ((category as Category).parentId.toString().match(this.categoryParentId)) {
           this.mainCategories.unshift((category as Category));
           console.log((category as Category) + ' les maincategories 5');
         }
      });
    }
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

}
