import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Queue } from '../Queue';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private apiUrl = 'http://localhost:8080/queue'
  constructor(private http: HttpClient) { }

  getQueues(): Observable<Queue[]> {
    return this.http.get<Queue[]>(this.apiUrl);
  }

  saveQueue(queue: Queue): Observable<Queue> {
    return this.http.post<Queue>(this.apiUrl, queue);
  }

  flush(): Observable<String>{
    return this.http.delete<String>(this.apiUrl);
  }

}
