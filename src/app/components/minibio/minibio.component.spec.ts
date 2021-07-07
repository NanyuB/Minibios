import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinibioComponent } from './minibio.component';

describe('MinibioComponent', () => {
  let component: MinibioComponent;
  let fixture: ComponentFixture<MinibioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MinibioComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinibioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
