import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProduct } from './single-product';

describe('SingleProduct', () => {
  let component: SingleProduct;
  let fixture: ComponentFixture<SingleProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
