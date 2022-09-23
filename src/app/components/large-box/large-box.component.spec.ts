import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeBoxComponent } from './large-box.component';

describe('LargeBoxComponent', () => {
  let component: LargeBoxComponent;
  let fixture: ComponentFixture<LargeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LargeBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LargeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
