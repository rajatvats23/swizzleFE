import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor(private http: HttpClient) {

    }

    // get<T>(path: string, queryParams?: QueryParams): Observable<T> {
    //     return this.http.get<T>(`${this.apiUrl}${path}`, { params: this.createParams(queryParams) })
    //       .pipe(
    //         catchError(this.handleError)
    //       );
    //   }
}