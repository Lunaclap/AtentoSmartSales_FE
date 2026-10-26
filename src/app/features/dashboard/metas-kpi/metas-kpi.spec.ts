import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetasKpi } from './metas-kpi';

describe('MetasKpi', () => {
  let component: MetasKpi;
  let fixture: ComponentFixture<MetasKpi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetasKpi],
    }).compileComponents();

    fixture = TestBed.createComponent(MetasKpi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
