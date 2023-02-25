import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCarousselComponent } from './main-caroussel.component';

describe('MainCarousselComponent', () => {
  let component: MainCarousselComponent;
  let fixture: ComponentFixture<MainCarousselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainCarousselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCarousselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
