import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquiposAsesores } from './equipos-asesores';

describe('EquiposAsesores', () => {
  let component: EquiposAsesores;
  let fixture: ComponentFixture<EquiposAsesores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquiposAsesores],
    }).compileComponents();

    fixture = TestBed.createComponent(EquiposAsesores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
