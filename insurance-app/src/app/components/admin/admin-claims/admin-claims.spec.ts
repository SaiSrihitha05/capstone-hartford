import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClaims } from './admin-claims';

describe('AdminClaims', () => {
  let component: AdminClaims;
  let fixture: ComponentFixture<AdminClaims>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClaims]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClaims);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
