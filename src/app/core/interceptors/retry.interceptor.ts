import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, throwError, timer } from 'rxjs';

const RETRYABLE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const MAX_RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1000;

export const retryInterceptor: HttpInterceptorFn = (request, next) => {
  if (!RETRYABLE_METHODS.has(request.method.toUpperCase())) {
    return next(request);
  }

  return next(request).pipe(
    retry({
      count: MAX_RETRY_ATTEMPTS,
      delay: (error, retryCount) => {
        if (!(error instanceof HttpErrorResponse) || !shouldRetryRequest(error)) {
          return throwError(() => error);
        }

        return timer(RETRY_DELAY_MS * retryCount);
      },
    })
  );
};

function shouldRetryRequest(error: HttpErrorResponse): boolean {
  return error.status === 0 || error.status >= 500;
}
