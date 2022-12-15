import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { PrimeModule } from './components/prime.module';
import { ItemRecommendationComponent } from './components/item-recommendation/item-recommendation.component';
import { LoadoutComponent } from './components/loadout/loadout.component';
import { BossComponent } from './components/boss/boss.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api';
import { RepeatPipe } from './pipes/repeat.pipe';
import { FloorPipe } from './pipes/floor.pipe';

@NgModule({
  imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    HttpClientModule, 
    FormsModule, 
    PrimeModule,
    ToastModule,
  ],
  declarations: [
    AppComponent, 
    ItemRecommendationComponent, 
    LoadoutComponent, 
    BossComponent,
    RepeatPipe,
    FloorPipe,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
