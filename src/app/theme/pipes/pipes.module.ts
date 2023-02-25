import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterByIdPipe } from './filter-by-id.pipe';
import { FilterBrandsPipe } from './filter-brands.pipe';
import { BrandSearchPipe } from './brand-search.pipe';
import { ProfilePicturePipe } from './profilePicture.pipe';
import { UserSearchPipe } from './user-search.pipe';
import { TranslatePipe } from './translate.pipe';

@NgModule({
    imports: [ 
        CommonModule 
    ],
    declarations: [
        FilterByIdPipe,
        FilterBrandsPipe,
        BrandSearchPipe,
        ProfilePicturePipe,
        UserSearchPipe,
        TranslatePipe
    ],
    exports: [
        FilterByIdPipe,
        FilterBrandsPipe,
        BrandSearchPipe,
        ProfilePicturePipe,
        UserSearchPipe,
        TranslatePipe
    ]
})
export class PipesModule { }
