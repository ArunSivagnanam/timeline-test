import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app-routing.module';

import { AppComponent } from './app.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule,AppRoutingModule ],
  declarations: [ routingComponents, AppComponent  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
