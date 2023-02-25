import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductZoomComponent } from './product-detail/product-zoom/product-zoom.component';
import { AddProductComponent } from './add-product/add-product.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDialogComponent } from './categories/category-dialog/category-dialog.component';
import { AffichageComponent } from './affichage/affichage.component';
import {AffichageDetailComponent} from './affichage/affichage-detail/affichage-detail.component';
import { BannersComponent } from './banners/banners.component';
import { SlidesComponent } from './slides/slides.component';
import { SlideDetailComponentComponent } from './slides/slide-detail-component/slide-detail-component.component';
import { BannersDetailsComponent } from './banners/banners-details/banners-details.component';

export const routes = [
  { path: '', redirectTo: 'product-list', pathMatch: 'full'},
  { path: 'categories', component: CategoriesComponent, data: { breadcrumb: 'Categories' } },
  { path: 'affichage', component: AffichageComponent, data: { breadcrumb: 'Affichage' } },
  { path: 'slides', component: SlidesComponent, data: { breadcrumb: 'Slides' } },
  { path: 'banners', component: BannersComponent, data: { breadcrumb: 'Banners' } },
  { path: 'product-list', component: ProductListComponent, data: { breadcrumb: 'Product List' } },
  { path: 'product-detail', component: ProductDetailComponent, data: { breadcrumb: 'Product Detail' } },
  { path: 'product-detail/:id', component: ProductDetailComponent, data: { breadcrumb: 'Product Detail' } },
  { path: 'add-product', component: AddProductComponent, data: { breadcrumb: 'Add Product' } },
  { path: 'add-product/:id', component: AddProductComponent, data: { breadcrumb: 'Edit Product' } },
];

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductZoomComponent,
    AddProductComponent,
    CategoriesComponent,
    CategoryDialogComponent,
    AffichageComponent,
    AffichageDetailComponent,
    BannersComponent,
    SlidesComponent,
    SlideDetailComponentComponent,
    BannersDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    SwiperModule,
    InputFileModule
  ]
})
export class ProductsModule { }
