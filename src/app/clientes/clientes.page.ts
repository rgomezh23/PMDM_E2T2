import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import {IonContent} from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ClientesService} from '../services/clientes.service';
import { HostListener } from '@angular/core';
import { IBezero } from '../interfaces/IEBezero';
import { IData } from '../interfaces/IData';
 
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['../productos/productos.page.scss'],
})
export class ClientesPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;

  editandoFicha: boolean = false;
  clienteConInformacionSeleccionada: boolean = false;
  fichaSeleccionada: IBezero | any = {};
  fichaSeleccionadaAnterior: IBezero | null = null;
  fichas: IBezero[] = [];
  fichasFiltradas: IBezero[] = [];
  mobilaDa: boolean = false;
  ordenActual: { columna: keyof IBezero, ascendente: boolean } = { columna: 'id', ascendente: true };
  FichasPorPagina = 10;
  paginaActual = 1;
  paginacionMaxima = 0;
  Math: any;

  constructor(private alertController: AlertController, private ClientesService: ClientesService) {}

  ngOnInit() {
    this.mobilbista();
    this.cargarProductos();
  }

   @HostListener('window:resize', ['$event'])
   onResize() {
     this.mobilbista();
   }
 
   mobilbista() {
     this.mobilaDa = window.innerWidth <= 768;
   }
 
   async cargarProductos() {
    try {
      const data: IBezero[] = await firstValueFrom(this.ClientesService.getFichas());
      this.fichas = data;
      this.fichasFiltradas = [...this.fichas];
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  }
  
 
   cambiarPagina(pagina: number) {
     if (pagina < 1) {
       this.paginaActual = 1;
     } else if (pagina > Math.ceil(this.fichasFiltradas.length / this.FichasPorPagina)) {
       this.paginaActual = Math.ceil(this.fichasFiltradas.length / this.FichasPorPagina);
     } else {
       this.paginaActual = pagina;
     }
     this.moverVistaAlaPrimeraFicha();
   }
   
   moverVistaAlaPrimeraFicha() {
     if (this.content) {
       this.content.scrollToTop(500); 
     }
   }
 
   hacerPaginacion() {
     this.paginacionMaxima = Math.ceil(this.fichasFiltradas.length / this.FichasPorPagina);
     let paginacion = [];
     for (let i = 1; i <= this.paginacionMaxima; i++) {
       paginacion.push(i);
     }
     return paginacion;
   }
   eliminarFicha(ficha : any){
    
   }
 
   cerrarModal() {
     this.clienteConInformacionSeleccionada = false;
   }
 
   editarProducto(ficha: IBezero) {
    this.fichaSeleccionadaAnterior = { ...this.fichaSeleccionada }; 
    this.editandoFicha = true;
    this.fichaSeleccionada = { ...ficha };
  
    this.moverVistaAlaPrimeraFicha();
  }
  
 
   async confirmarEdicion() {
     const alert = await this.alertController.create({
       header: '¿Estás seguro?',
       message: 'Se actualizarán los valores de la ficha.',
       buttons: [
         {
           text: 'Cancelar',
           role: 'cancel',
         },
         {
           text: 'Confirmar',
           handler: async () => {
             const now = new Date().toISOString();
             this.fichaSeleccionada.data = this.fichaSeleccionada.data || {};
             this.fichaSeleccionada.data.eguneratze_data = now;
 
             try {
               await firstValueFrom(this.ClientesService.actualizarFicha(this.fichaSeleccionada));
               const index = this.fichas.findIndex(ficha => ficha.id === this.fichaSeleccionada.id);
               if (index !== -1) {
                 this.fichas[index] = { ...this.fichaSeleccionada };
                 this.aplicarFiltro({ target: { value: '' } });
               }
               this.editandoFicha = false;
             } catch (error) {
               console.error('Error al actualizar ficha:', error);
             }
           },
         },
       ],
     });
 
     await alert.present();
   }
 
   cancelarEdicion() {

     this.fichaSeleccionada = { ...this.fichaSeleccionadaAnterior };
     this.editandoFicha = false;
 
     if (this.content && this.fichaSeleccionada.id) {
       const fichaIndex = this.fichas.findIndex(p => p.id === this.fichaSeleccionada.id);
       if (fichaIndex !== -1) {
    
         const fichaElemento = document.getElementById(`ficha-${this.fichaSeleccionada.id}`);
         if (fichaElemento) {
     
           const isMobile = window.innerWidth <= 768;
   
           if (isMobile) {
             fichaElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
   
             setTimeout(() => {
               window.requestAnimationFrame(() => {
                 window.scrollBy(0, 300); 
               });
             }, 300); 
           } else {
             fichaElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }
         }
       }
     }
   }
   
   aplicarFiltro(event: any) {
    const texto = event.target.value.toLowerCase();
  
    if (texto.trim() === '') {
      this.fichasFiltradas = [...this.fichas];
    } else {
      this.fichasFiltradas = this.fichas.filter((ficha: IBezero) => {
        const coincideIzena = ficha.izena.toLowerCase().includes(texto);
        const coincideAbizena = ficha.abizena.toLowerCase().includes(texto);
        const coincideId = ficha.id.toString().includes(texto);
        const coincideTelefonoa = ficha.telefonoa.toString().includes(texto);
        const coincideAzala = ficha.azal_sentikorra.toString().includes(texto);
        const coincideFecha = ficha.data && this.compararFechas(ficha.data, texto);
  
        return coincideIzena || coincideAbizena || coincideId || coincideTelefonoa || coincideAzala || coincideFecha;
      });
    }
  }
  
   
  compararFechas(fecha: any, texto: string): boolean {
    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
      const fechaNormalizada = fecha.toISOString().toLowerCase();
      return fechaNormalizada.includes(texto.toLowerCase());
    } else {
      return false;
    }
  }
 
  ordenarPor(columna: keyof IBezero, columnaData: keyof IData) {
    if (this.ordenActual.columna === columna) {
      this.ordenActual.ascendente = !this.ordenActual.ascendente;
    } else {
      this.ordenActual.columna = columna;
      this.ordenActual.ascendente = true;
    }
  
    this.fichasFiltradas.sort((a, b) => {
      let valorA = (a as any)[columna];
      let valorB = (b as any)[columna];
  
      // Check if 'columna' refers to a date field within 'IData'
      if (columnaData === 'sortze_data' || columnaData === 'eguneratze_data') {
        valorA = valorA ? new Date(valorA) : null;
        valorB = valorB ? new Date(valorB) : null;
      }
  
      if (valorA < valorB || valorA === null) {
        return this.ordenActual.ascendente ? -1 : 1;
      } else if (valorA > valorB || valorB === null) {
        return this.ordenActual.ascendente ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
  
 
   getOrdenClass(columna: string): string {
     if (this.ordenActual.columna === columna) {
       return this.ordenActual.ascendente ? 'orden-asc' : 'orden-desc';
     }
     return '';
   }
}  
