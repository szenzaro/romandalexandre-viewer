import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsFilterComponent } from './words-filter.component';

describe('WordsFilterComponent', () => {
  let component: WordsFilterComponent;
  let fixture: ComponentFixture<WordsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
