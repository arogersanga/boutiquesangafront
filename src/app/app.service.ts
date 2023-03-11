import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Affichage, AffichagesParProduit, Banners, CategoriesParProduit, Category, Product, Slides, Image, ImagesParProduits, ImagesProduits} from './app.models';
import {environment, filesEnvironment} from 'src/environments/environment';
import {AngularFirestore} from '@angular/fire/firestore';
import {reject} from 'q';
import firebase from 'firebase';
import {AngularFireStorage} from '@angular/fire/storage';
import { AlertService } from './alert-service.service';

export class Data {
  constructor(public categories: Category[],
              public compareList: Product[],
              public wishList: Product[],
              public cartList: Product[],
              public affichageList: Affichage[],
              public totalPrice: number,
              public totalCartCount: number) {
  }
}

@Injectable()
export class AppService {
  imagesIds: number[] = [];
  slidesSubject = new Subject<Slides[]>();
  imagesSubject = new Subject<Image[]>();
  imagesParProduitSubject = new Subject<ImagesParProduits[]>();
  loginSubject = new Subject<boolean>();
  productsListSubject = new Subject<Product[]>();
  productsList: Product[] = [];
  datas: Product[] = [];
  affichagesList: Affichage[] = [];
  imagesList: Image[] = [];
  productsListMap: Map<number, Product> = new Map();
  affichagesParProduit = new AffichagesParProduit(0, [0], 0);
  categoriesParProduit = new CategoriesParProduit(0, 0, 0);
  imagesParProduit = new ImagesParProduits(0, [0], 0);
  imagesDunProduit = new ImagesProduits(0, [''], 0);
  product: Product  =  new Product(0, '', [0], 0, 0, 0, 0
  , 0, '', 0, 0, [''], [''], 0, 0, [0]);
  i: number = 0; 
  public categories: Category[] = [];
affichageRecherche: any;
  public Data = new Data(
    [], // categories
    [], // compareList
    [],  // wishList
    [],  // cartList
    [], // affichageList
    null, // totalPrice,
    0 // totalCartCount
  );
  public slides: Slides[] = [];
  public login = false;
  public url = environment.url;
  public urlREST = environment.urlREST;
  public urlFiles = filesEnvironment.urlFiles;
  image: Image;

  constructor(public http: HttpClient, public snackBar: MatSnackBar, private alertService: AlertService, public storage: AngularFireStorage, public fs: AngularFirestore) {
  }

  emitLoginSubject() {
    if (this.login) {
      this.loginSubject.next(this.login);
    }
  } 
  
  emitSlidesSubject() {
    if (this.slides) {
      this.slidesSubject.next(Array.from(this.slides));
    }
  }

 
  emitImagesSubject() {
    if (this.imagesList) {
      this.imagesSubject.next(Array.from(this.imagesList));
    }
  }

  emitProductsListSubject() {
    console.log('je passe dans productSubject ' + this.productsList);
    if (this.productsList) {
      this.productsListSubject.next(this.productsList);
    }
  }

  public loginClicked(login: boolean) {
    this.login = login;
    this.emitLoginSubject();
    // console.log(this.login);
  }

  public setProductsList(prods: Product[]): void {
    this.productsList = prods;
    this.emitProductsListSubject();
  }


  public setProductsListMap(prodsMap: Map<number, Product>): void {
    this.productsListMap = prodsMap;
  }

  public getProductsList() {
    return this.productsList;
  }

  public getAffichagesList(): Affichage[] {
    return this.affichagesList;
  }

  public getProductsListMap(): Map<number, Product> {
    return this.productsListMap;
  }

  getAffichages(): Observable<any> {
      return this.http
        .get<any>(this.urlREST + 'affichages');
  }

  getImages(): Observable<any> {
    return this.http
      .get<any>(this.urlREST + 'images');
}

  getAffichageById(affichageId: number): Observable<Affichage> {
    return this.http.get<Affichage>(this.urlREST + 'affichages/' + affichageId);
  }

  getImagesById(imageId: number): Observable<Image> {
    return this.http.get<Image>(this.urlREST + 'images/' + imageId);
  }
 
  getAffichageByName(name: String): Observable<Affichage> {
    return this.http.get<Affichage>(this.urlREST + 'affichages' + '?name=' + name);
  }

  public getProductsByAffichage(affichageNme: String): Product[]{
     let affichage = this.Data.affichageList?.filter(item=>item.name == affichageNme)[0];
    let produitsParAffichage: Product[] = [];
    if (affichage) {
       produitsParAffichage = this.productsList?.filter(item=>item.affichageIds.includes(affichage.id));
    }
    
    return produitsParAffichage;
  }

  public getProductsByAffichageName(affichageName: String): Observable<Product[]> {
    this.affichageRecherche = this.getAffichageByName(affichageName);
    return this.http.get<Product[]>(this.urlREST + 'products' + '?affichageId=' + this.affichageRecherche.id);
  }

  public getProducts(affichageName: String): Observable<Product[]> {
    this.affichageRecherche = this.getAffichageByName(affichageName);
    return this.http.get<Product[]>(this.urlREST + 'products' + '?affichageId=' + this.affichageRecherche.id);
  }
  
  public getProductsByCategoryName(categoryName: String): Observable<any> {
    return this.http.get<any>(this.urlREST + 'products/productsByCategoryName/' + categoryName);
  }

  public getAllProducts(): Observable<any>{     
    return this.http.get<any>(this.urlREST + 'products');
  }

  public getAllImages(): Observable<any>{        
    return this.http.get<any>(this.urlREST + 'images');
  }
  
  public getCategories(): Observable<any>{
    return this.http.get<any>(this.urlREST + 'categories');
  }
  
  public getAllSlides(){
     this.http.get<any>(this.urlREST + 'slideses') .subscribe(next => {
       if (next) {
        const slides = next._embedded.slideses;
        if (this.slides.length == 0) {
          slides.forEach(slide => {
            const slid = new Slides(0, '', '', 0, 0);
            slid.id = slide.id;
            slid.title = slide.title;
            slid.subtitle = slide.subtitle;
            slid.affichageId = slide.affichageId;
            slid.productId = slide.productId;
            console.log(slid + ' dans le service les slides');
            this.slides.unshift(slid);
          });  
        }
        this.emitSlidesSubject();
      }
      console.log(this.slides + ' slides after assignment');
      },
      error => {
        this.handleError(error);
      });
  }
  handleError(error): void {
    this.alertService.error(error.message);
  }
  removeSlides(slide: Slides) {
      // console.log(slide.id + ' : slide a suprimer');
      this.http.delete<Slides>(this.urlREST + 'slideses/' + slide.id).subscribe(
        next => {
        });  
  }

  public getInitialiseProducts(type): Observable<Product[]>{        
    return this.http.get<Product[]>(this.url + type + '-products.json');
}
  updateSlide(slide: any) {
    throw new Error('Method not implemented.');
  }
  

  addSlides(slide: Slides) {
    this.http.post<Slides>(this.urlREST + 'slideses', slide).subscribe(slide =>{
    });
  }
  
  addImage(image: Image): Observable<any> {
    return this.http.post<Image>(this.urlREST + 'images', image);
  }

  public getAllBanners(): Observable<any>{
    return this.http.get<any>(this.urlREST + 'bannerses');
  }

  removeBanners(banner: any) {
    console.log(banner.id + ' : banner a suprimer');
    this.http.delete<Banners>(this.urlREST + 'bannerses/' + banner.id).subscribe(
      next => {
        // console.log(' banner a été suprimé');
    
      });  
  }
  updatebanner(banner: any) {
    throw new Error('Method not implemented.');
  }
  addBanners(banner: Banners) {
    this.http.post<Banners>(this.urlREST + 'bannerses', banner).subscribe(banner =>{
      // console.log(banner + ' ajouté dans le service');
    });
  }
  public getAllCategoriesParProduit(): Observable<any>{
    return this.http.get<any>(this.urlREST + 'categoriesParProduits');
  }

  public getAllAffichagesParProduit(): Observable<any>{
    return this.http.get<any>(this.urlREST + 'affichagesParProduits');
  }

  public addProduct(product: Product, images: any[]): void {
    this.imagesIds = [];
    this.assignProduct(product);
    this.i = images.length;
    images.forEach(img => {
          this.uploadFile(this.product, img.file, this.i).then(() => {
        });
    });
  }


  public assignProduct(product: Product){
  this.product.id = product.id;
  this.product.name = product.name;
  this.product.imagesIds = [];
  this.product.oldPrice = product.oldPrice;
  this.product.newPrice = product.newPrice;
  this.product.discount = product.discount;
  this.product.description = product.description;
  this.product.availibilityCount = product.availibilityCount;
  this.product.color = product.color;
  this.product.size = product.size;
  this.product.weight = product.weight;
  this.product.categoryId = product.categoryId;
  this.product.affichageIds= product.affichageIds;
  }

  public addProductAfterUpload(product: Product, imagesIds: number[]) {
    //product.images = [];
    product.imagesIds = imagesIds;
    
    console.log('2. Les ids images sont : '+ this.imagesIds.toString());
    // console.log(product.images.length + '! test length dans add product apres upload');
    this.http.post<Product>(this.urlREST + 'products', product).subscribe(prod => {
      this.affichagesParProduit.affichageIds = prod.affichageIds;
      this.affichagesParProduit.productId = prod.id;
      this.http.post<AffichagesParProduit>(this.urlREST + 'affichagesParProduits', this.affichagesParProduit)
      .subscribe(affichagesParProduit => {
         console.log('affich par produits : ' + affichagesParProduit);
      });
      this.categoriesParProduit.categoryId = prod.categoryId;
      this.categoriesParProduit.productId = prod.id;
      this.http.post<CategoriesParProduit>(this.urlREST + 'categoriesParProduits', this.categoriesParProduit)
      .subscribe(categoriesParProduit => {
        // console.log(categoriesParProduit);
      });
      this.productsList.push(prod);
      this.productsListMap.set(prod.id, prod);
    });
  }

  public addAffichage(affichage: Affichage): void {
    this.http.post<Affichage>(this.urlREST + 'affichages', affichage).subscribe(aff=>{
      // console.log(aff + 'dans le service');
    });
  }
  public addCategory(category: Category): void {
    this.http.post<Category>(this.urlREST + 'categories', category).subscribe(cat=>{
      // console.log(cat + 'dans le service');
    });
  }

  postFile(produit: Product, fileToUpload: File,  i: number): Observable<any> {
    
    // Create form data
    const formData = new FormData(); 
    const almostUniqueFileName = Date.now().toString();
    const name = `${almostUniqueFileName + i + fileToUpload.name}`;
    // Store form name as "file" with file data
    formData.append('file', fileToUpload, name);
    //this.product.images[i] = 'http://94.23.247.20:8002/assets/images/img/' + name;
   // let headers = new HttpHeaders();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        "Access-Control-Allow-Origin": "*",
        
      } ),responseType: 'text' as 'json'
    };
    return this.http.post(`src/assets/images/products/`, formData, httpOptions);
  }
  
  uploadFile(produit: Product, file: File, i: number) {
    return new Promise(
      (resolve) => {
        const almostUniqueFileName = Date.now().toString();
        console.log(file , produit + ' avant');
        const upload = firebase.storage().ref()
          .child('images/' + `${almostUniqueFileName + file.name }`).put(file);
          console.log(file + ' apres');
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL().then(promise => {
              // console.log(promise.toString + 'this is download url');
              // this.product.imagesIds[i] = promise.toString();
              this.i = i;
              console.log('i = ' + this.i);
              let imageDownloadURLValue = promise.toString();
              let imageDownloadURLValues : Array<string> = [];
              imageDownloadURLValues = imageDownloadURLValue.split('images%');
              this.image = new Image(0, '', '');
              this.image.value1 = imageDownloadURLValues[0] + 'images%';
              this.image.value2 = imageDownloadURLValues[1];
              this.addImage(this.image).subscribe(image =>{
                this.imagesIds[this.i - 1] = image.id;
              
                if( this.i - 1 === 0){
                 this.addProductAfterUpload(this.product, this.imagesIds);
                }
                this.i--
            });
             }));
          });
      }
    );
  }
  public getProductById(productId: number): Observable<any> {
    return this.http.get<any>(this.urlREST + 'products/' + productId);
  }

  public getProductByName(name: string): Observable<any> {
    return this.http.get<any>(this.urlREST + 'products/productsByProductName/' + name);
  }

  public getBanners(index: number): Observable<any> {
    return this.http.get<any>(this.urlREST + 'slideses/'+ index);
  }

  public addToCompare(product: Product) {
    // tslint:disable-next-line:one-variable-per-declaration
    let message, status;
    if (this.Data.compareList.filter(item => item.id === product.id)[0]) {
      message = 'The product ' + product.name + ' already added to comparison list.';
      status = 'error';
    } else {
      this.Data.compareList.push(product);
      message = 'The product ' + product.name + ' has been added to comparison list.';
      status = 'success';
    }
    this.snackBar.open(message, '×', {panelClass: [status], verticalPosition: 'top', duration: 3000});
  }

  public addToWishList(product: Product) {
    // tslint:disable-next-line:one-variable-per-declaration
    let message, status;
    if (this.Data.wishList.filter(item => item.id === product.id)[0]) {
      message = 'The product ' + product.name + ' already added to wish list.';
      status = 'error';
    } else {
      this.Data.wishList.push(product);
      message = 'The product ' + product.name + ' has been added to wish list.';
      status = 'success';
    }
    this.snackBar.open(message, '×', {panelClass: [status], verticalPosition: 'top', duration: 3000});
  }

  public addToCart(product: Product) {
    let message;
    let status;

    this.Data.totalPrice = null;
    this.Data.totalCartCount = null;

    if (this.Data.cartList.filter(item => item.id === product.id)[0]) {
      const item = this.Data.cartList.filter(ite => ite.id === product.id)[0];
      item.cartCount = product.cartCount;
    } else {
      this.Data.cartList.push(product);
    }
    this.Data.cartList.forEach(produc => {
      this.Data.totalPrice = this.Data.totalPrice + (produc.cartCount * produc.newPrice);
      this.Data.totalCartCount = this.Data.totalCartCount + produc.cartCount;
    });

    message = 'The product ' + product.name + ' has been added to cart.';
    status = 'success';
    this.snackBar.open(message, '×', {panelClass: [status], verticalPosition: 'top', duration: 3000});
  }

  public resetProductCartCount(product: Product) {
    product.cartCount = 0;
    // tslint:disable-next-line:triple-equals
    const compareProduct = this.Data.compareList.filter(item => item.id == product.id)[0];
    if (compareProduct) {
      compareProduct.cartCount = 0;
    }
    // tslint:disable-next-line:triple-equals
    const wishProduct = this.Data.wishList.filter(item => item.id == product.id)[0];
    if (wishProduct) {
      wishProduct.cartCount = 0;
    }
  }

  public updateCategory(category: Category): void {
  }

  public removeCategory(category: Category): void {
    // console.log(category.id + ' : category a suprimer');
    this.http.delete<Category>(this.urlREST + 'categories/' + category.id).subscribe(
      next => {
        // console.log('category a été suprimé');
    
      });
  }

  updateAffichage(affichage: Affichage) {
  }

  removeAffichage(affichage: any) {
    // console.log(affichage.id + ' : affichage a suprimer');
    this.http.delete<Affichage>(this.urlREST + 'affichages/' + affichage.id).subscribe(
      next => {
        // console.log('affichage a été suprimé');
    
      });
  }

  getProductsClickedList(produitChoisiId: string) {
    // const productRef = this.fs.collection('products');
    // return productRef.ref.where('categoryId', '==', categoryChoisiId).get();
  }

  public updateProduct(product: Product): void {
    // this.fs.collection('products')
    //   .doc(product.id)
    //   .set(product)
    //   .then(res => {
    //     console.log('data updated');
    //   }, err => reject(err));
  }

  public removeProduct(product: Product): void {
    this.http.delete<Product>(this.urlREST + 'products/' + product.id).subscribe(
      next => {
        // console.log('produit a été suprimé');
    
      });
  }

  public getBrands() {
    return [
      {name: 'aloha', image: 'assets/images/brands/aloha.png'},
      {name: 'dream', image: 'assets/images/brands/dream.png'},
      {name: 'congrats', image: 'assets/images/brands/congrats.png'},
      {name: 'best', image: 'assets/images/brands/best.png'},
      {name: 'original', image: 'assets/images/brands/original.png'},
      {name: 'retro', image: 'assets/images/brands/retro.png'},
      {name: 'king', image: 'assets/images/brands/king.png'},
      {name: 'love', image: 'assets/images/brands/love.png'},
      {name: 'the', image: 'assets/images/brands/the.png'},
      {name: 'easter', image: 'assets/images/brands/easter.png'},
      {name: 'with', image: 'assets/images/brands/with.png'},
      {name: 'special', image: 'assets/images/brands/special.png'},
      {name: 'bravo', image: 'assets/images/brands/bravo.png'}
    ];
  }

  public getCountries() {
    return [
      {name: 'Afghanistan', code: 'AF'},
      {name: 'Aland Islands', code: 'AX'},
      {name: 'Albania', code: 'AL'},
      {name: 'Algeria', code: 'DZ'},
      {name: 'American Samoa', code: 'AS'},
      {name: 'AndorrA', code: 'AD'},
      {name: 'Angola', code: 'AO'},
      {name: 'Anguilla', code: 'AI'},
      {name: 'Antarctica', code: 'AQ'},
      {name: 'Antigua and Barbuda', code: 'AG'},
      {name: 'Argentina', code: 'AR'},
      {name: 'Armenia', code: 'AM'},
      {name: 'Aruba', code: 'AW'},
      {name: 'Australia', code: 'AU'},
      {name: 'Austria', code: 'AT'},
      {name: 'Azerbaijan', code: 'AZ'},
      {name: 'Bahamas', code: 'BS'},
      {name: 'Bahrain', code: 'BH'},
      {name: 'Bangladesh', code: 'BD'},
      {name: 'Barbados', code: 'BB'},
      {name: 'Belarus', code: 'BY'},
      {name: 'Belgium', code: 'BE'},
      {name: 'Belize', code: 'BZ'},
      {name: 'Benin', code: 'BJ'},
      {name: 'Bermuda', code: 'BM'},
      {name: 'Bhutan', code: 'BT'},
      {name: 'Bolivia', code: 'BO'},
      {name: 'Bosnia and Herzegovina', code: 'BA'},
      {name: 'Botswana', code: 'BW'},
      {name: 'Bouvet Island', code: 'BV'},
      {name: 'Brazil', code: 'BR'},
      {name: 'British Indian Ocean Territory', code: 'IO'},
      {name: 'Brunei Darussalam', code: 'BN'},
      {name: 'Bulgaria', code: 'BG'},
      {name: 'Burkina Faso', code: 'BF'},
      {name: 'Burundi', code: 'BI'},
      {name: 'Cambodia', code: 'KH'},
      {name: 'Cameroon', code: 'CM'},
      {name: 'Canada', code: 'CA'},
      {name: 'Cape Verde', code: 'CV'},
      {name: 'Cayman Islands', code: 'KY'},
      {name: 'Central African Republic', code: 'CF'},
      {name: 'Chad', code: 'TD'},
      {name: 'Chile', code: 'CL'},
      {name: 'China', code: 'CN'},
      {name: 'Christmas Island', code: 'CX'},
      {name: 'Cocos (Keeling) Islands', code: 'CC'},
      {name: 'Colombia', code: 'CO'},
      {name: 'Comoros', code: 'KM'},
      {name: 'Congo', code: 'CG'},
      {name: 'Congo, The Democratic Republic of the', code: 'CD'},
      {name: 'Cook Islands', code: 'CK'},
      {name: 'Costa Rica', code: 'CR'},
      {name: 'Cote D\'Ivoire', code: 'CI'},
      {name: 'Croatia', code: 'HR'},
      {name: 'Cuba', code: 'CU'},
      {name: 'Cyprus', code: 'CY'},
      {name: 'Czech Republic', code: 'CZ'},
      {name: 'Denmark', code: 'DK'},
      {name: 'Djibouti', code: 'DJ'},
      {name: 'Dominica', code: 'DM'},
      {name: 'Dominican Republic', code: 'DO'},
      {name: 'Ecuador', code: 'EC'},
      {name: 'Egypt', code: 'EG'},
      {name: 'El Salvador', code: 'SV'},
      {name: 'Equatorial Guinea', code: 'GQ'},
      {name: 'Eritrea', code: 'ER'},
      {name: 'Estonia', code: 'EE'},
      {name: 'Ethiopia', code: 'ET'},
      {name: 'Falkland Islands (Malvinas)', code: 'FK'},
      {name: 'Faroe Islands', code: 'FO'},
      {name: 'Fiji', code: 'FJ'},
      {name: 'Finland', code: 'FI'},
      {name: 'France', code: 'FR'},
      {name: 'French Guiana', code: 'GF'},
      {name: 'French Polynesia', code: 'PF'},
      {name: 'French Southern Territories', code: 'TF'},
      {name: 'Gabon', code: 'GA'},
      {name: 'Gambia', code: 'GM'},
      {name: 'Georgia', code: 'GE'},
      {name: 'Germany', code: 'DE'},
      {name: 'Ghana', code: 'GH'},
      {name: 'Gibraltar', code: 'GI'},
      {name: 'Greece', code: 'GR'},
      {name: 'Greenland', code: 'GL'},
      {name: 'Grenada', code: 'GD'},
      {name: 'Guadeloupe', code: 'GP'},
      {name: 'Guam', code: 'GU'},
      {name: 'Guatemala', code: 'GT'},
      {name: 'Guernsey', code: 'GG'},
      {name: 'Guinea', code: 'GN'},
      {name: 'Guinea-Bissau', code: 'GW'},
      {name: 'Guyana', code: 'GY'},
      {name: 'Haiti', code: 'HT'},
      {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
      {name: 'Holy See (Vatican City State)', code: 'VA'},
      {name: 'Honduras', code: 'HN'},
      {name: 'Hong Kong', code: 'HK'},
      {name: 'Hungary', code: 'HU'},
      {name: 'Iceland', code: 'IS'},
      {name: 'India', code: 'IN'},
      {name: 'Indonesia', code: 'ID'},
      {name: 'Iran, Islamic Republic Of', code: 'IR'},
      {name: 'Iraq', code: 'IQ'},
      {name: 'Ireland', code: 'IE'},
      {name: 'Isle of Man', code: 'IM'},
      {name: 'Israel', code: 'IL'},
      {name: 'Italy', code: 'IT'},
      {name: 'Jamaica', code: 'JM'},
      {name: 'Japan', code: 'JP'},
      {name: 'Jersey', code: 'JE'},
      {name: 'Jordan', code: 'JO'},
      {name: 'Kazakhstan', code: 'KZ'},
      {name: 'Kenya', code: 'KE'},
      {name: 'Kiribati', code: 'KI'},
      {name: 'Korea, Democratic People\'S Republic of', code: 'KP'},
      {name: 'Korea, Republic of', code: 'KR'},
      {name: 'Kuwait', code: 'KW'},
      {name: 'Kyrgyzstan', code: 'KG'},
      {name: 'Lao People\'S Democratic Republic', code: 'LA'},
      {name: 'Latvia', code: 'LV'},
      {name: 'Lebanon', code: 'LB'},
      {name: 'Lesotho', code: 'LS'},
      {name: 'Liberia', code: 'LR'},
      {name: 'Libyan Arab Jamahiriya', code: 'LY'},
      {name: 'Liechtenstein', code: 'LI'},
      {name: 'Lithuania', code: 'LT'},
      {name: 'Luxembourg', code: 'LU'},
      {name: 'Macao', code: 'MO'},
      {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
      {name: 'Madagascar', code: 'MG'},
      {name: 'Malawi', code: 'MW'},
      {name: 'Malaysia', code: 'MY'},
      {name: 'Maldives', code: 'MV'},
      {name: 'Mali', code: 'ML'},
      {name: 'Malta', code: 'MT'},
      {name: 'Marshall Islands', code: 'MH'},
      {name: 'Martinique', code: 'MQ'},
      {name: 'Mauritania', code: 'MR'},
      {name: 'Mauritius', code: 'MU'},
      {name: 'Mayotte', code: 'YT'},
      {name: 'Mexico', code: 'MX'},
      {name: 'Micronesia, Federated States of', code: 'FM'},
      {name: 'Moldova, Republic of', code: 'MD'},
      {name: 'Monaco', code: 'MC'},
      {name: 'Mongolia', code: 'MN'},
      {name: 'Montserrat', code: 'MS'},
      {name: 'Morocco', code: 'MA'},
      {name: 'Mozambique', code: 'MZ'},
      {name: 'Myanmar', code: 'MM'},
      {name: 'Namibia', code: 'NA'},
      {name: 'Nauru', code: 'NR'},
      {name: 'Nepal', code: 'NP'},
      {name: 'Netherlands', code: 'NL'},
      {name: 'Netherlands Antilles', code: 'AN'},
      {name: 'New Caledonia', code: 'NC'},
      {name: 'New Zealand', code: 'NZ'},
      {name: 'Nicaragua', code: 'NI'},
      {name: 'Niger', code: 'NE'},
      {name: 'Nigeria', code: 'NG'},
      {name: 'Niue', code: 'NU'},
      {name: 'Norfolk Island', code: 'NF'},
      {name: 'Northern Mariana Islands', code: 'MP'},
      {name: 'Norway', code: 'NO'},
      {name: 'Oman', code: 'OM'},
      {name: 'Pakistan', code: 'PK'},
      {name: 'Palau', code: 'PW'},
      {name: 'Palestinian Territory, Occupied', code: 'PS'},
      {name: 'Panama', code: 'PA'},
      {name: 'Papua New Guinea', code: 'PG'},
      {name: 'Paraguay', code: 'PY'},
      {name: 'Peru', code: 'PE'},
      {name: 'Philippines', code: 'PH'},
      {name: 'Pitcairn', code: 'PN'},
      {name: 'Poland', code: 'PL'},
      {name: 'Portugal', code: 'PT'},
      {name: 'Puerto Rico', code: 'PR'},
      {name: 'Qatar', code: 'QA'},
      {name: 'Reunion', code: 'RE'},
      {name: 'Romania', code: 'RO'},
      {name: 'Russian Federation', code: 'RU'},
      {name: 'RWANDA', code: 'RW'},
      {name: 'Saint Helena', code: 'SH'},
      {name: 'Saint Kitts and Nevis', code: 'KN'},
      {name: 'Saint Lucia', code: 'LC'},
      {name: 'Saint Pierre and Miquelon', code: 'PM'},
      {name: 'Saint Vincent and the Grenadines', code: 'VC'},
      {name: 'Samoa', code: 'WS'},
      {name: 'San Marino', code: 'SM'},
      {name: 'Sao Tome and Principe', code: 'ST'},
      {name: 'Saudi Arabia', code: 'SA'},
      {name: 'Senegal', code: 'SN'},
      {name: 'Serbia and Montenegro', code: 'CS'},
      {name: 'Seychelles', code: 'SC'},
      {name: 'Sierra Leone', code: 'SL'},
      {name: 'Singapore', code: 'SG'},
      {name: 'Slovakia', code: 'SK'},
      {name: 'Slovenia', code: 'SI'},
      {name: 'Solomon Islands', code: 'SB'},
      {name: 'Somalia', code: 'SO'},
      {name: 'South Africa', code: 'ZA'},
      {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
      {name: 'Spain', code: 'ES'},
      {name: 'Sri Lanka', code: 'LK'},
      {name: 'Sudan', code: 'SD'},
      {name: 'Suriname', code: 'SR'},
      {name: 'Svalbard and Jan Mayen', code: 'SJ'},
      {name: 'Swaziland', code: 'SZ'},
      {name: 'Sweden', code: 'SE'},
      {name: 'Switzerland', code: 'CH'},
      {name: 'Syrian Arab Republic', code: 'SY'},
      {name: 'Taiwan, Province of China', code: 'TW'},
      {name: 'Tajikistan', code: 'TJ'},
      {name: 'Tanzania, United Republic of', code: 'TZ'},
      {name: 'Thailand', code: 'TH'},
      {name: 'Timor-Leste', code: 'TL'},
      {name: 'Togo', code: 'TG'},
      {name: 'Tokelau', code: 'TK'},
      {name: 'Tonga', code: 'TO'},
      {name: 'Trinidad and Tobago', code: 'TT'},
      {name: 'Tunisia', code: 'TN'},
      {name: 'Turkey', code: 'TR'},
      {name: 'Turkmenistan', code: 'TM'},
      {name: 'Turks and Caicos Islands', code: 'TC'},
      {name: 'Tuvalu', code: 'TV'},
      {name: 'Uganda', code: 'UG'},
      {name: 'Ukraine', code: 'UA'},
      {name: 'United Arab Emirates', code: 'AE'},
      {name: 'United Kingdom', code: 'GB'},
      {name: 'United States', code: 'US'},
      {name: 'United States Minor Outlying Islands', code: 'UM'},
      {name: 'Uruguay', code: 'UY'},
      {name: 'Uzbekistan', code: 'UZ'},
      {name: 'Vanuatu', code: 'VU'},
      {name: 'Venezuela', code: 'VE'},
      {name: 'Viet Nam', code: 'VN'},
      {name: 'Virgin Islands, British', code: 'VG'},
      {name: 'Virgin Islands, U.S.', code: 'VI'},
      {name: 'Wallis and Futuna', code: 'WF'},
      {name: 'Western Sahara', code: 'EH'},
      {name: 'Yemen', code: 'YE'},
      {name: 'Zambia', code: 'ZM'},
      {name: 'Zimbabwe', code: 'ZW'}
    ];
  }

  public getMonths() {
    return [
      {value: '01', name: 'January'},
      {value: '02', name: 'February'},
      {value: '03', name: 'March'},
      {value: '04', name: 'April'},
      {value: '05', name: 'May'},
      {value: '06', name: 'June'},
      {value: '07', name: 'July'},
      {value: '08', name: 'August'},
      {value: '09', name: 'September'},
      {value: '10', name: 'October'},
      {value: '11', name: 'November'},
      {value: '12', name: 'December'}
    ];
  }

  public getYears() {
    return ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
  }

  public getDeliveryMethods() {
    return [
      {value: 'free', name: 'Free Delivery', desc: '$0.00 / Delivery in 7 to 14 business Days'},
      {value: 'standard', name: 'Standard Delivery', desc: '$7.99 / Delivery in 5 to 7 business Days'},
      {value: 'express', name: 'Express Delivery', desc: '$29.99 / Delivery in 1 business Days'}
    ];
  }
}
