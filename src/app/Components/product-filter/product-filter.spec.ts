import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilter } from './product-filter';

describe('ProductFilter', () => {
  let component: ProductFilter;
  let fixture: ComponentFixture<ProductFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
