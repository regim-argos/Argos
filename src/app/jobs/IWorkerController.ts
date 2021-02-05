export interface IWorkerController {
  handle(message: any): Promise<any>;
}
