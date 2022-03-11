import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import  * as mapboxgl  from 'mapbox-gl';

interface marcadorColor{
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [

    `.mapa-container {
      width: 100%;
      height: 100%;
    }
    
    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
    }

    li{
      cursor: pointer;
    }
    `

  ]
})
export class MarcadoresComponent implements AfterViewInit{

  mapa!: mapboxgl.Map;
  @ViewChild('mapa') divMapa!: ElementRef; //el mapa que figura aqui es el del HTML #mapa

  zoomLevel: number = 15;
  centerMapa : [number,number] = [-75.921029433568 , 45.28719674822362];

  //arreglo de marcadores
  marcadores: marcadorColor[] = [];


  constructor() { }


  ngAfterViewInit(): void {


    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ -75.921029433568 , 45.28719674822362 ],
      zoom: 15
      });


      this.leerLocalStorage();


      /*
    const maker = new mapboxgl.Marker()
      .setLngLat(this.centerMapa)
      .addTo(this.mapa)
      */
  }


  agregarMarcador(){

    const colorAleatorio = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16)); //color aleatorio

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color: colorAleatorio
    })
      .setLngLat(this.centerMapa)
      .addTo(this.mapa)

    this.marcadores.push({
      color: colorAleatorio,
      marker: nuevoMarcador
    })

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () =>{
      this.guardarMarcadoresLocalStorage(); //actualiza el localstorage luego de que el marcador fue desplazado
    })
  }



  irMarcador(marcador: marcadorColor){
    
    this.mapa.flyTo({
      center: marcador.marker!.getLngLat()
    })

  }


  guardarMarcadoresLocalStorage(){

    const lngLatArray: marcadorColor[] = [];


    this.marcadores.forEach(m => {
      const colorMarcador = m.color;
      const {lng, lat} = m.marker!.getLngLat();

      lngLatArray.push({
        color: colorMarcador,
        centro: [lng,lat]
      })

    })

    localStorage.setItem('marcadores', JSON.stringify(lngLatArray) );
  }

  leerLocalStorage(){
    if(!localStorage.getItem('marcadores')){
      return;
    }

    const lngLatArray: marcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArray.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
      .setLngLat(m.centro!)
      .addTo(this.mapa)

      this.marcadores.push({
        marker: newMarker,
        color: m.color
      })
      
      newMarker.on('dragend', () =>{
        this.guardarMarcadoresLocalStorage(); //actualiza el localstorage luego de que el marcador fue desplazado
      })
    })

  }


  borrarMarcador(i: number){
    this.marcadores[i].marker?.remove(); //borra el marcador del mapa
    this.marcadores.splice(i, 1); //borra el marcador del arreglo de marcadores
    this.guardarMarcadoresLocalStorage(); //actualiza el localstorage luego de borrarse
  }

}
