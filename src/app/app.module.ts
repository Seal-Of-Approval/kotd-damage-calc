import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { PrimeModule } from './components/prime.module';
import { ItemRecommendationComponent } from './components/item-recommendation/item-recommendation.component';
import { LoadoutComponent } from './components/loadout/loadout.component';
import { BossComponent } from './components/boss/boss.component';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule, PrimeModule],
  declarations: [AppComponent, ItemRecommendationComponent, LoadoutComponent, BossComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
