import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannersDetailsComponent } from './banners-details.component';

describe('BannersDetailsComponent', () => {
  let component: BannersDetailsComponent;
  let fixture: ComponentFixture<BannersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannersDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
