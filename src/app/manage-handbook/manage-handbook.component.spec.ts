import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHandbookComponent } from './manage-handbook.component';

describe('ManageHandbookComponent', () => {
  let component: ManageHandbookComponent;
  let fixture: ComponentFixture<ManageHandbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageHandbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHandbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
