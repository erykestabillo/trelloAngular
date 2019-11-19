import { Injectable } from '@angular/core';
import {HttpEvent,
        HttpInterceptor,
        HttpHandler,
        HttpRequest, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class Interceptor implements HttpInterceptor {

    constructor(private cookieService: CookieService) {}

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

            return next.handle(request);
            }

        }



}



