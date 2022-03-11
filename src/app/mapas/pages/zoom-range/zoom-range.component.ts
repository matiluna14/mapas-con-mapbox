import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import  * as mapboxgl  from 'mapbox-gl';


@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .row {
      background-color: white;
      bottom: 50px;
      border-radius: 5px;
      position: fixed;
      left:50px;
      padding: 10px;
      width: 400px;


      z-index: 99999;
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  mapa!: mapboxgl.Map;
  @ViewChild('mapa') divMapa!: ElementRef; //el mapa que figura aqui es el del HTML #mapa

  zoomLevel: number = 10;
  centerMapa : number[] = [-75.921029433568 , 45.28719674822362];


  constructor() { }

  // destroy de eventListeners
  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {} );
    this.mapa.off('zoomend', () => {} );
    this.mapa.off('move', () => {} );
  }

  ngAfterViewInit(): void {


    this.mapa = new mapboxgl.Map({
    container: this.divMapa.nativeElement,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [ -75.921029433568 , 45.28719674822362 ],
    zoom: 10
    });


    //eventListener para obtener el zoom
    this.mapa.on('zoom', (evento) => {
      const zoomActual= this.mapa.getZoom();
      console.log(zoomActual);
    })

    //eventListener para obtener el zoomEnd
    this.mapa.on('zoomend', (evento) => {
      if( this.mapa.getZoom() > 18 ) {
        this.mapa.zoomTo(18);
      }
    })

    //eventListener para obtener la longitud y la latitud
    this.mapa.on('move', (evento) => {
      const target = evento.target;
      const {lng, lat} = target.getCenter();
      this.centerMapa = [lng ,lat];
    })
  }





  zoomOut(){
    this.mapa.zoomOut();

    this.zoomLevel = this.mapa.getZoom();
  }


  zoomIn(){
    this.mapa.zoomIn();

    this.zoomLevel = this.mapa.getZoom();
  }

}
