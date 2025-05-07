import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LassaComponent } from './lassa.component';

describe('LassaComponent', () => {
  let component: LassaComponent;
  let fixture: ComponentFixture<LassaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LassaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LassaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
