import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { snakeCase } from 'lodash';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.toSnakeCase(data);
      }),
    );
  }

  private toSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((v) => this.toSnakeCase(v));
    } else if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj).reduce((result, key) => {
        result[snakeCase(key)] = this.toSnakeCase(obj[key]);
        return result;
      }, {});
    }
    return obj;
  }
}
