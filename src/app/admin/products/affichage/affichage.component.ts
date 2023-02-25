import {Component, OnDestroy, OnInit} from '@angular/core';
import {Affichage} from 'src/app/app.models';
import {AppService} from 'src/app/app.service';
import {AffichageDetailComponent} from './affichage-detail/affichage-detail.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import {AppSettings, Settings} from 'src/app/app.settings';
import {AlertService} from '../../../alert-service.service';

@Component({
  selector: 'app-affichage',
  templateUrl: './affichage.component.html',
  styleUrls: ['./affichage.component.scss']
})
export class AffichageComponent implements OnInit, OnDestroy {
  affichage: Affichage = new Affichage(0, '');
  affichages: Affichage[] = [];
  affichagesMap: Map<number, Affichage> = new Map();
  public page: any;
  public count = 6;
  public settings: Settings;

  constructor(public appService: AppService, private alertService: AlertService, public dialog: MatDialog, public appSettings: AppSettings) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.getAffichages();
  }

  public getAffichages() {
  this.appService.getAffichages()
      .subscribe(next => {
        console.log(next);
        const affichages = next;
        if (next) {
          this.affichages = next._embedded.affichages;
        }
        console.log(this.affichages);
        },
        error => {
          this.handleError(error);
        });
  }

  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }

  public openAffichageDialog(data: any) {
    const dialogRef = this.dialog.open(AffichageDetailComponent, {
      data: {
        affichage: data,
        affichages: this.affichages
      },
      panelClass: ['theme-detail'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(affichage => {
      if (affichage) {
        const index: number = this.affichages.findIndex(x => x.id === affichage.id);
        if (affichage._links) {
          this.affichages[index] = affichage;
          this.affichagesMap.set(affichage.id, affichage);
          this.appService.updateAffichage(affichage);
        } else {
          this.affichage.id = affichage.id;
          this.affichage.name = affichage.name;
          this.affichages.unshift(this.affichage);
          this.appService.addAffichage(this.affichage);
          console.log(this.affichage);
        }
      }
    });
  }

  public getLastIdAffichage(): number {
    let greatestId = 0;
    this.affichagesMap.forEach(affich => {
      if (Number(affich.id) >= Number(greatestId)) {
        greatestId = affich.id;
      }
    });
    return greatestId;
  }

  public remove(affichage: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want remove this affichage?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.affichages.indexOf(affichage);
        if (index !== -1) {
          this.affichagesMap.delete(affichage.id);
          this.appService.removeAffichage(affichage);
          this.affichages.splice(index, 1);
        }
      }
    });
  }

  handleError(error): void {
    this.alertService.error(error.message);
  }

  ngOnDestroy(): void {
    // this.affichages = [];
  }
}
