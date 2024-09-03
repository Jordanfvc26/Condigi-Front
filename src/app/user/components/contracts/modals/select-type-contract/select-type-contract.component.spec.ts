import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTypeContractComponent } from './select-type-contract.component';

describe('SelectTypeContractComponent', () => {
  let component: SelectTypeContractComponent;
  let fixture: ComponentFixture<SelectTypeContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTypeContractComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectTypeContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
