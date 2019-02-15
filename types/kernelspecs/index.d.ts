declare module "kernelspecs" {
  export function findAll(): Promise<any>;
  export function find(kernelName: string): Promise<any>;
}
