import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { SyncComponent } from './sync.component';
import {ApiService, MockEnvironment} from 'sartography-workflow-lib';
import {APP_BASE_HREF} from '@angular/common';
import {MdDialogMock} from '../workflow-spec-list/workflow-spec-list.component.spec';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('SyncComponent', () => {
  let component: SyncComponent;
  let fixture: ComponentFixture<SyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyncComponent ],
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
        {
          provide: MatDialogRef, useClass: MdDialogMock,
        },
        {provide: MAT_DIALOG_DATA, useValue: []},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
