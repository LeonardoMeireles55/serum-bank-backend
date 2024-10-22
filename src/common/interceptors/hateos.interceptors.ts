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
        const baseUrl = this.getBaseUrl(request);
        const routePath = request.route.path;

        if (Array.isArray(data.response)) {
          return this.buildPaginatedResponse(baseUrl, routePath, data);
        } else {
          return this.buildSingleItemResponse(baseUrl, routePath, data);
        }
      }),
    );
  }

  private getBaseUrl(request: any): string {
    const protocol = request.protocol;
    const host = request.get('host');
    return `${protocol}://${host}${request.baseUrl}`;
  }

  private getPath(routePath: string, item: any): string {
    return routePath
      .replace(':code', encodeURIComponent(item.serumBankCode || ''))
      .replace(':id', item.id?.toString() || '');
  }

  private buildSelfLink(baseUrl: string, path: string, identifier?: string): { href: string } {
    return { href: identifier ? `${baseUrl}${path}/${identifier}` : `${baseUrl}${path}` };
  }

  private buildPaginatedResponse(baseUrl: string, routePath: string, paginatedData: any) {
    paginatedData.response = paginatedData.response.map((item: any) => {
      const itemPath = this.getPath(routePath, item);
      return {
        ...item,
        _links: {
          self: this.buildSelfLink(baseUrl, itemPath, item.id),
        },
      };
    });

    return {
      ...paginatedData,
      _links: {
        self: this.buildSelfLink(baseUrl, routePath),
        ...(paginatedData._links || {}),
      },
    };
  }

  private buildSingleItemResponse(baseUrl: string, routePath: string, data: any) {
    const itemPath = this.getPath(routePath, data);
    const identifier = data.serumBankCode || data.id?.toString();

    return {
      ...data,
      _links: {
        self: this.buildSelfLink(baseUrl, itemPath, identifier),
      },
    };
  }
}
