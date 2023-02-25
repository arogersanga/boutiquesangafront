import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichageDetailComponent } from './affichage-detail.component';

describe('AffichageDetailComponent', () => {
  let component: AffichageDetailComponent;
  let fixture: ComponentFixture<AffichageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffichageDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffichageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
