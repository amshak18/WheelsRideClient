import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly jwtTokenKey: string = "jwtToken";

  /**
   * This is an interceptor where all the requests are intercepted
   * and if the user is logged in, it will add an authorization header
   * @param req the request object.
   * @param next the next function to be called.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem(this.jwtTokenKey);

    if (authToken) {
      const authorizedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
      return next.handle(authorizedReq);
    }
    return next.handle(req);
  }

}
