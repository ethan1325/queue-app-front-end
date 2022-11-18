import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  findQueue(id: number): Observable<Queue> {
    return this.http.get<Queue>(this.apiUrl + '/' + id);
  }

  saveQueue(queue: Queue): Observable<Queue> {
    return this.http.post<Queue>(this.apiUrl, queue);
  }

  updateQueue(queue: Queue): Observable<Queue>{
    return this.http.post<Queue>(this.apiUrl + '/update', queue);
  }

  deleteQueue(id: number): Observable<String> {
    var headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.delete<String>(this.apiUrl + '/' + id, { headers, responseType: 'text' as 'json' });
  }

  flush(): Observable<String>{
    return this.http.delete<String>(this.apiUrl);
  }

}
