import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CitaService } from '../services/cita.service';

@Component({
  selector: 'app-citas-del-dia',
  templateUrl: './citas-del-dia.page.html',
  styleUrls: ['./citas-del-dia.page.scss'],
})
export class CitasDelDiaPage implements OnInit {
  citas: any[] = [];
  fechaSeleccionada: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private citaService: CitaService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.fechaSeleccionada = params['fecha'] || null;
      if (this.fechaSeleccionada) {
        this.obtenerCitasPorFecha(this.fechaSeleccionada);
      }
    });
  }

  obtenerCitasPorFecha(fecha: string) {
    this.citaService.getCitasPorFecha(fecha).subscribe(
      (data) => {
        this.citas = data;
        console.log('Citas obtenidas:', this.citas);
      },
      (error) => {
        console.error('Error al obtener las citas:', error);
        this.citas = [];
      }
    );
  }

  getCitasPorEserlekuaOrdenadas(eserlekua: number) {
    return this.citas
      .filter(cita => cita.eserlekua === eserlekua)
      .sort((a, b) => (a.hasiera_ordua < b.hasiera_ordua ? -1 : 1));
  }

  irACitas() {
    if (this.fechaSeleccionada) {
      this.router.navigate(['/citas'], { queryParams: { fecha: this.fechaSeleccionada } });
    }
  }
}
