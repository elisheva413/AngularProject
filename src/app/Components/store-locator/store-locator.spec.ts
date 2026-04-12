import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreLocator } from './store-locator';

describe('StoreLocator', () => {
  let component: StoreLocator;
  let fixture: ComponentFixture<StoreLocator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreLocator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreLocator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
