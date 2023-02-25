export class Slides {
  constructor(public id: number,
              public title: string,
              public subtitle: string,          
              public affichageId: number,
              public productId: number) { }
}

export class AffichagesParProduit {
  constructor(public id: number,
              public affichageIds: Array<number>,
              public productId: number) { }
}

export class CategoriesParProduit {
  constructor(public id: number,
              public categoryIds: Array<number>,
              public productId: number) { }
}
export class Banners {
  constructor(public id: number,
              public title: string,
              public subtitle: string,
              public affichageId: number,
              public productId: number) { }
}
export class Category {
  constructor(public id: number,
              public name: string,
              public hasSubCategory: boolean,
              public parentId: number) { }

}

export class Affichage {
  constructor(public id: number,
              public name: string) { }

}

export class Product {
  constructor(public id: number,
              public name: string,
              public images: Array<any>,
              public oldPrice: number,
              public newPrice: number,
              public discount: number,
              public ratingsCount: number,
              public ratingsValue: number,
              public description: string,
              public availibilityCount: number,
              public cartCount: number,
              public color: Array<string>,
              public size: Array<any>,
              public weight: number,
              public categoryIds: Array<number>,
              public affichageIds: Array<number>
  ) { }
}
