import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const req = context.switchToHttp().getRequest();
    console.log('拦截器之前');
    return next.handle().pipe(
      map((data) => {
        console.log('拦截器之后', data);
        return data;
      }),
    );
  }
}
