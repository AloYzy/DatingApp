import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl: string = 'https://localhost:5001/api/';
  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  login(model: any) {
    return this.httpClient.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.currentUserSource.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }

  logout() {
    this.currentUserSource.next(null);
    localStorage.removeItem('user');
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }
}
