import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertshowComponent } from './alertshow.component';

describe('AlertshowComponent', () => {
  let component: AlertshowComponent;
  let fixture: ComponentFixture<AlertshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertshowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
