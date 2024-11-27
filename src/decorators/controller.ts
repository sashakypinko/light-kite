import { injectable } from "inversify";

const Controller = (path: string = ''): ClassDecorator => {
  return function (target: any) {
    injectable()(target);
    Reflect.defineMetadata('controller', path, target);
  };
};

export default Controller;
