import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaiableRequestsComponent } from './avaiable-requests.component';

describe('AvaiableRequestsComponent', () => {
  let component: AvaiableRequestsComponent;
  let fixture: ComponentFixture<AvaiableRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvaiableRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvaiableRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
