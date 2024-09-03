import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateContractsIAComponent } from './generate-contracts-ia.component';

describe('GenerateContractsIAComponent', () => {
  let component: GenerateContractsIAComponent;
  let fixture: ComponentFixture<GenerateContractsIAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateContractsIAComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateContractsIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
