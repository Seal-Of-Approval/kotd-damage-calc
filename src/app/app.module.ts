import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { PrimeModule } from './prime.module';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule, PrimeModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
