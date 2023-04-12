import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    console.log('123');
    console.log(exception);
    const ctx = host.switchToHttp();
    // 响应 请求对象
    const response = ctx.getResponse();
    let code = 500;

    if (exception instanceof QueryFailedError) {
      code = exception.driverError.errno;
    }

    response.status(500).json({
      code,
      timestamp: new Date().toISOString(),
      // path: request.url,
      // method: request.method,
      message: exception.message,
    });
  }
}
