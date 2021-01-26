import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidinfoComponent } from './covidinfo.component';

describe('CovidinfoComponent', () => {
  let component: CovidinfoComponent;
  let fixture: ComponentFixture<CovidinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovidinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
