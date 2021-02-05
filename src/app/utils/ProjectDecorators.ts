/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectService from '@app/Services/ProjectService';

export function verifyIsOwnerMember(userIdPos: number, projectIdPos: number) {
  return (_: any, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function Before(...args: any[]) {
      await ProjectService.verifyIsOwnerMember(
        args[userIdPos],
        args[projectIdPos]
      );
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

export function verifyIsProjectMember(userIdPos: number, projectIdPos: number) {
  return (_: any, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function Before(...args: any[]) {
      if (args[userIdPos] !== 'ADMIN') {
        await ProjectService.verifyIsProjectMember(
          args[userIdPos],
          args[projectIdPos]
        );
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
