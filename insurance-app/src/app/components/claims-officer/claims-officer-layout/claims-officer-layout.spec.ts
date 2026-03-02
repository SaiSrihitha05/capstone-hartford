import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsOfficerLayout } from './claims-officer-layout';

describe('ClaimsOfficerLayout', () => {
  let component: ClaimsOfficerLayout;
  let fixture: ComponentFixture<ClaimsOfficerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsOfficerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsOfficerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
