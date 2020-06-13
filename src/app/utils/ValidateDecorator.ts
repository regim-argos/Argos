/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ValidateDecorator(
  dataPos: number,
  validateFunctionName: string
) {
  return (_: any, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function Before(...args: any[]) {
      args[dataPos] = await this.validator[validateFunctionName](args[dataPos]);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
