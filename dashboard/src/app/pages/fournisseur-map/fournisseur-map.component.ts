import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { FournisseurService } from 'src/app/core/services/fournisseur.service';

@Component({
  selector: 'app-fournisseur-map',
  templateUrl: './fournisseur-map.component.html',
  styleUrls: ['./fournisseur-map.component.scss']
})
export class FournisseurMapComponent {
  id!: number;
    fournisseur!: any;
    userLat: number;
    userLng: number;
    map: L.Map;
    routingControl: L.Routing.Control; 
  
    constructor(private http: HttpClient, private actR: ActivatedRoute, private fournisseurService: FournisseurService) { }
    getParam() {
      //this.id=Number(this.actR.snapshot.paramMap.get('id'));
      this.actR.paramMap.subscribe(data => this.id = Number(data.get('id')));
    }
    ngOnInit() {
      this.getParam();
      this.detectUserLocation();
      this.fournisseurService.getFournisseurById(this.id).subscribe((data) => {
        this.fournisseur = data;
        this.geocodeAddress();
      });
    }
  
    detectUserLocation(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
          this.createMap().then(() => {
            this.routingControl = L.Routing.control({
              waypoints: [
                L.latLng(this.userLat, this.userLng),
              ]
            }).addTo(this.map);
          });
        });
      } else {
        console.error('La géolocalisation n\'est pas prise en charge par ce navigateur.');
      }
    }
    
  
    geocodeAddress(): void {
      this.http.get<any>('https://nominatim.openstreetmap.org/search', {
        params: {
          q: this.fournisseur.adresse,
          format: 'json',
          limit: '1'
        }
      }).subscribe(response => {
        if (response && response.length > 0) {
          const lat = parseFloat(response[0].lat);
          const lon = parseFloat(response[0].lon);
          this.fournisseur.adresse = response[0].display_name;
          console.log(this.fournisseur.adresse)
  
          // Afficher la distance dans la popup
          const popupContent = 'Adresse Fournisseur : ' + this.fournisseur.adresse;
          this.addSupplierMarker(lat, lon, popupContent);
          this.routingControl = L.Routing.control({
            waypoints: [
              L.latLng(this.userLat, this.userLng),
              L.latLng(lat, lon),
              // Ajoutez d'autres waypoints ici si nécessaire
            ]
          }).addTo(this.map);
        } else {
          console.error('Adresse non trouvée');
        }
      });
    }
  
    createMap(): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        this.map = L.map('map').setView([this.userLat, this.userLng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        resolve();
      });
    }
    
  
    addUserMarker(): void {
      const customIcon = L.icon({
        iconUrl: '/assets/images/marker.jpg', // Chemin vers votre icône personnalisée
        iconSize: [32, 32], // Taille de l'icône [largeur, hauteur]
        iconAnchor: [16, 32], // Point d'ancrage de l'icône [position_x, position_y]
        popupAnchor: [0, -32] // Point d'ancrage de la fenêtre contextuelle par rapport à l'icône [position_x, position_y]
      });
  
      L.marker([this.userLat, this.userLng], { icon: customIcon }).addTo(this.map)
        .bindPopup('My position')
        .openPopup();
    }
  
  
    addSupplierMarker(lat: number, lng: number, popupContent: string): void {
      const customIcon = L.icon({
        iconUrl: '/assets/images/marker.jpg', // Chemin vers votre icône personnalisée pour le fournisseur
        iconSize: [32, 32], // Taille de l'icône [largeur, hauteur]
        iconAnchor: [16, 32], // Point d'ancrage de l'icône [position_x, position_y]
        popupAnchor: [0, -32] // Point d'ancrage de la fenêtre contextuelle par rapport à l'icône [position_x, position_y]
      });
  
      L.marker([lat, lng], { icon: customIcon }).addTo(this.map)
        .bindPopup(popupContent)
        .openPopup();
    }

}
