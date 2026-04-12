import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInfo } from './edit-info';

describe('EditInfo', () => {
  let component: EditInfo;
  let fixture: ComponentFixture<EditInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
