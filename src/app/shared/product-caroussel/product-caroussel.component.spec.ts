import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCarousselComponent } from './product-caroussel.component';

describe('ProductCarousselComponent', () => {
  let component: ProductCarousselComponent;
  let fixture: ComponentFixture<ProductCarousselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCarousselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCarousselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
