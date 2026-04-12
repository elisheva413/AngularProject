import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCard } from './gift-card';

describe('GiftCard', () => {
  let component: GiftCard;
  let fixture: ComponentFixture<GiftCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
