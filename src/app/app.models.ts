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
              public categoryId: number,
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

export class Image {
  constructor(public id: number,
              public value1: string,
              public value2: string) { }

}

export class ImagesParProduits {
  constructor(public id: number,
              public imageIds: Array<number>,
              public productId: number) { }

}

export class ImagesProduits {
  constructor(public id: number,
              public images: Array<any>,
              public productId: number) { }

}

export class Product {
  constructor(public id: number,
              public name: string,
              public imagesIds: Array<any>,
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
              public categoryId: number,
              public affichageIds: Array<number>
  ) { }
}
