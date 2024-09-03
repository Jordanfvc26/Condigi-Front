import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterNewCompanyComponent } from './register-new-company.component';

describe('RegisterNewCompanyComponent', () => {
  let component: RegisterNewCompanyComponent;
  let fixture: ComponentFixture<RegisterNewCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterNewCompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterNewCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
