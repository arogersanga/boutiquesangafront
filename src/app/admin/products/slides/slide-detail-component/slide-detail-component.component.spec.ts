import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideDetailComponentComponent } from './slide-detail-component.component';

describe('SlideDetailComponentComponent', () => {
  let component: SlideDetailComponentComponent;
  let fixture: ComponentFixture<SlideDetailComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideDetailComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
