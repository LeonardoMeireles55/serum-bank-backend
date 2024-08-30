import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HateoasInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();
        const protocol = request.protocol;
        const host = request.get('host');
        const baseUrl = `${protocol}://${host}${request.baseUrl}`;
        const routePath = request.route.path;

        if (Array.isArray(data.response)) {
          const paginatedResponse = data as any;
          if (paginatedResponse.response) {
            paginatedResponse.response = paginatedResponse.response.map(
              (item) => {
                const itemPath = this.getPath(routePath, item);
                const id = item.id;
                return {
                  ...item,
                  _links: {
                    self: { href: `${baseUrl}${itemPath}/${id}` },
                  },
                };
              },
            );
          }
          paginatedResponse._links = {
            self: { href: `${baseUrl}${routePath}` },
            ...(paginatedResponse._links || {}),
          };
          return paginatedResponse;
        } else {
          const itemPath = this.getPath(routePath, data);
          if (data.serumBankCode) {
            return {
              ...data,
              _links: {
                self: { href: `${baseUrl}${itemPath}/${data.serumBankCode}` },
              },
            };
          }
          return {
            ...data,
            _links: {
              self: { href: `${baseUrl}${itemPath}` },
            },
          };
        }
      }),
    );
  }

  private getPath(routePath: string, item: any): string {
    let path = routePath;

    if (path.includes(':code') && item.serumBankCode) {
      path = path.replace(':code', encodeURIComponent(item.serumBankCode));
    }
    if (path.includes(':id') && item.id) {
      path = path.replace(':id', item.id.toString());
    }

    return path;
  }
}
