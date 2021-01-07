import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((errorResponse) => {
        if (errorResponse) {
          switch (errorResponse.status) {
            case 400:
              if (errorResponse.error.errors) {
                const modalStateError = [];
                for (const key in errorResponse.error.errors) {
                  if (errorResponse.error.errors[key]) {
                    modalStateError.push(errorResponse.error.errors[key]);
                  }
                }
                throw modalStateError.flat();
              } else {
                this.toastr.error(
                  'Request is not correct',
                  errorResponse.status
                );
              }
              break;
            case 401:
              this.toastr.error('Unauthorized', errorResponse.status);
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: errorResponse.error },
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastr.error('Something went wrong');
              console.log(errorResponse);
              break;
          }
        }
        return throwError(errorResponse);
      })
    );
  }
}
