import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import credentials from "../resources/credentials.json";
import api from "../resources/api.json";
import {GeocodeResponse} from "../models/mapquest/response/geocodeResponse";
import {Location} from "../models/mapquest/request/location";
import {Address} from '../models/mapquest/request/address';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly mapQuestApiKey: string = credentials.mapQuest.apiKey;
  private readonly lookupEndpoint: string = api.services.mapquest.lookup;
  private readonly latLongLookupEndpoint: string = api.services.mapquest.address;

  constructor(private http: HttpClient) {
  }

  /**
   * This is used to get the current lotitude and longitude by making use fo navigator.
   */
  getCurrentLocation(): Observable<any> {
    return new Observable((observer) => {
      let watchId: number;
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition((position: GeolocationPosition) => {
          observer.next(position);
        }, (error: GeolocationPositionError) => {
          observer.error({
            success: false,
            message: error.message
          });
        })
      } else {
        observer.error({
          success: false,
          message: 'Geolocation not available'
        })
      }

      return {
        unsubscribe() {
          navigator.geolocation.clearWatch(watchId);
        }
      }
    });
  }

  /**
   * this method is used to get the location name by lat, long positions.
   * @param lat the latitude
   * @param long the longitude
   */
  lookupLocationName(lat: number, long: number): Observable<GeocodeResponse> {
    let requestBody: Location = new Location();
    requestBody.location.latLng.lat = lat;
    requestBody.location.latLng.lng = long;
    return this.http.post<GeocodeResponse>(this.lookupEndpoint, requestBody, {
      params: {
        key: this.mapQuestApiKey
      }
    });
  }

  /**
   * This method is used to get the latitude and longitude positions based on the name of the place.
   * @param place the place name,
   */
  lookupLatLong(place: string): Observable<GeocodeResponse> {
    let requestBody: Address = new Address();
    requestBody.location = place;
    return this.http.post<GeocodeResponse>(this.latLongLookupEndpoint, requestBody, {
      params: {
        key: this.mapQuestApiKey
      }
    });
  }

}
