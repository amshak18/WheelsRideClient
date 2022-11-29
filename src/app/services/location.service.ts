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
