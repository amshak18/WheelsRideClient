import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {finalize, tap} from 'rxjs/operators';

export class LoggingInterceptor implements HttpInterceptor {
  constructor() {
  }

  /**
   * This is a logger.
   * Everytime a request is sent, it will add a log message to the console
   * that will have the request method, status of the request.
   * @param req the request object
   * @param next the next function to be called.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    let ok: string;

    return next.handle(req)
      .pipe(tap({
          next: (event) => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
          error: (error) => (ok = 'failed')
        }),
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} ${req.urlWithParams} ${ok} in ${elapsed} ms.`;
          console.log(msg);
        })
      );
  }

}
