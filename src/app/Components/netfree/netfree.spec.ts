import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Netfree } from './netfree';

describe('Netfree', () => {
  let component: Netfree;
  let fixture: ComponentFixture<Netfree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Netfree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Netfree);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
