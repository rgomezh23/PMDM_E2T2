import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventarioPageRoutingModule } from './inventario-routing.module';

import { InventarioPage } from './inventario.page';
import { NireKonponenteakModule } from "../nire-konponenteak/nire-konponenteak.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventarioPageRoutingModule,
    NireKonponenteakModule
],
  declarations: [InventarioPage]
})
export class InventarioPageModule {}
