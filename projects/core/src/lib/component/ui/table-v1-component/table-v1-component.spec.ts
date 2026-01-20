import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableV1Component } from './table-v1-component';

describe('TableV1Component', () => {
  let component: TableV1Component;
  let fixture: ComponentFixture<TableV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableV1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableV1Component);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
