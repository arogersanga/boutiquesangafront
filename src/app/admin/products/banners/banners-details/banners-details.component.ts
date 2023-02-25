import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/alert-service.service';
import { Affichage, Product } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-banners-details',
  templateUrl: './banners-details.component.html',
  styleUrls: ['./banners-details.component.scss']
})
export class BannersDetailsComponent implements OnInit {

  affichages: Array<Affichage> = [];
  products: Array<Product> = [];
  public form: FormGroup;
  constructor(public dialogRef: MatDialogRef<BannersDetailsComponent>,
              public appService: AppService, 
              private alertService: AlertService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: 0,
      title: [null, Validators.required],
      subtitle: [null, Validators.required],
      affichageId: [null, Validators.required],
      productId: [null, Validators.required],
    });
    this.getAffichages();
    this.getAllProducts();

    if (this.data.slide) {
      this.form.patchValue(this.data.slide);
    }
  }
 
  public getAffichages() {
    this.appService.getAffichages()
      .subscribe(next => {
   
        if (next) {
          this.affichages = next._embedded.affichages;
          console.log(this.affichages + 'affich list');
        }
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
  
  handleError(error): void {
    this.alertService.error(error.message);
  }

  public onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
