import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PagesModule } from '../pages';
import { CommonAppModule } from '../common';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PagesModule,
    CommonAppModule
  ],
  exports: [
    // Modules
    CommonModule,
    ReactiveFormsModule,
    PagesModule,
    CommonAppModule
  ]
})
export class SharedModule { }
