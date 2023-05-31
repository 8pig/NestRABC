import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize/serialize.interceptor';

interface IClassConstructor {
  new (...args: any[]): any;
}

export const Serialize = (dto: IClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};
