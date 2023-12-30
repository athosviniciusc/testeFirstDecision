import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from "@angular/core";
import { Service } from 'assets/model/service-model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServiceListService {
  apiPath: string


  constructor(
    private http: HttpClient
  ) {
    this.apiPath = 'http://localhost:3000/'
  }


  getAll(url): Observable<Service> {
    return this.http.get(this.apiPath + url).pipe(
      catchError(this.handleError),
    );
  }

  getById(id, url): Observable<any> {
    const request = `${this.apiPath + url}/${id}`;
    return this.http.get(request).pipe(
      catchError(this.handleError),
    )
  }
  update(resource: Service, url): Observable<Service> {
    const request = `${this.apiPath + url}/${resource.id}`;
    return this.http.put(request, resource).pipe(
      map(() => resource),
      catchError(this.handleError),
    )
  }
  protected handleError(error: any) {
    console.log('Error na requisão => ', error);
    return throwError(error.status);
  }
}
