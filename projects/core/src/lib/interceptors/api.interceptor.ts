import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('[Core] Intercepting request:', req.url);
  
  // Clone request to add auth header if needed
  const authReq = req.clone({
    setHeaders: {
      'X-App-Version': '1.0.0'
    }
  });

  return next(authReq);
};
