import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { log } from 'winston';

@Injectable()
export class CreateUserPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(1111111, value);
    console.log(222, metadata);
    return value;
  }
}
