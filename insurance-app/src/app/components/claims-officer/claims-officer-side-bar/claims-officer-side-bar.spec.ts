import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsOfficerSideBar } from './claims-officer-side-bar';

describe('ClaimsOfficerSideBar', () => {
  let component: ClaimsOfficerSideBar;
  let fixture: ComponentFixture<ClaimsOfficerSideBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsOfficerSideBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsOfficerSideBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
