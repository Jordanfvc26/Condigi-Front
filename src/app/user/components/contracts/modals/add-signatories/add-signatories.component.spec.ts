import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSignatoriesComponent } from './add-signatories.component';

describe('AddSignatoriesComponent', () => {
  let component: AddSignatoriesComponent;
  let fixture: ComponentFixture<AddSignatoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSignatoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSignatoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
