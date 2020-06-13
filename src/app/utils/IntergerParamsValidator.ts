/* eslint-disable @typescript-eslint/no-explicit-any */
import BadRequestError from '@app/Error/BadRequestError';

export default function IntergerParamsValidator(paramsName: string) {
  return (_: any, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function Before(...args: any[]) {
      const id = parseInt(args[0].params[paramsName], 10);

      if (!id) throw new BadRequestError(`Invalid ${paramsName}`);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
