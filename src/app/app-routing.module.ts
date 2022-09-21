import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { OrdersComponent } from './orders/orders.component';
import { FlightsComponent } from './flights/flights.component';

const routes: Routes = [
  {path: 'flights', component: FlightsComponent},
  {path: 'orders', component: OrdersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [OrdersComponent,FlightsComponent]