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

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    InputNumberModule,
    MultiSelectModule,
    SliderModule,
    SidebarModule,
    DataViewModule,
    TableModule,
  ],
  exports: [
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    MultiSelectModule,
    InputNumberModule,
    SliderModule,
    SidebarModule,
    DataViewModule,
    TableModule,
  ],
})
export class PrimeModule {}
