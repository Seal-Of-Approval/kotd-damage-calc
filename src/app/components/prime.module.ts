import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { SidebarModule } from 'primeng/sidebar';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    InputNumberModule,
    InputTextModule,
    MultiSelectModule,
    SliderModule,
    SidebarModule,
    DataViewModule,
    RippleModule,
    TableModule,
  ],
  exports: [
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    MultiSelectModule,
    InputTextModule,
    InputNumberModule,
    SliderModule,
    SidebarModule,
    DataViewModule,
    RippleModule,
    TableModule,
  ],
})
export class PrimeModule {}
