import { Injectable } from '@angular/core';
import {HttpEvent,
        HttpInterceptor,
        HttpHandler,
        HttpRequest,
        HttpErrorResponse, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class Interceptor implements HttpInterceptor {
    
    constructor(private cookieService: CookieService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable <HttpEvent <any>> {
        const token = localStorage.getItem('Authorization');
        if ( token == null ) {
            request = request.clone({
                headers: request.headers.set('X-CSRFToken', this.cookieService.get('csrftoken'))
            });
            return next.handle(request);

        } else {
            request = request.clone({
                withCredentials: true,
                setHeaders: {'X-CSRFToken': this.cookieService.get('csrftoken'),
                            'Authorization': 'Token ' + localStorage.getItem('Authorization')
                            }
            });

            return next.handle(request).pipe(catchError(err => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 404) {
                        console.log('No permission!', err.status);
                        this.router.navigate(['error']);
                    } else if (err.status === 400) {
                        console.log('link already used', err.status);
                    }
                    return new Observable<HttpEvent<any>>();
                }

            }));

        }



}


}
