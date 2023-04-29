import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-affichage-detail',
  templateUrl: './affichage-detail.component.html',
  styleUrls: ['./affichage-detail.component.scss']
})
export class AffichageDetailComponent implements OnInit {
  public form: FormGroup;
  constructor(public dialogRef: MatDialogRef<AffichageDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: 0,
      name: [null, Validators.required],
    });

    // if (this.data.category) {
    //   this.form.patchValue(this.data.category);
    // }
  }

  public onSubmit() {
   //  console.log(this.form.value);
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

}
