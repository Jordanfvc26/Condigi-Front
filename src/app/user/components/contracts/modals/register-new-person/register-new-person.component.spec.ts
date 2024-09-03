import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterNewPersonComponent } from './register-new-person.component';

describe('RegisterNewPersonComponent', () => {
  let component: RegisterNewPersonComponent;
  let fixture: ComponentFixture<RegisterNewPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterNewPersonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterNewPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
