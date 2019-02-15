declare module "spawnteract" {
  import { ChildProcess, SpawnOptions } from "child_process";

  export interface JupyterConnectionInfo {
    version: number;
    iopub_port: number;
    shell_port: number;
    stdin_port: number;
    control_port: number;
    signature_scheme: "hmac-sha256";
    hb_port: number;
    ip: string;
    key: string;
    transport: "tcp" | "ipc";
  }

  // NOTE: There are other definitions, feel free to add more as we need them
  //       until we switch to @nteract/fs-kernels
  export function launchSpec(
    kernelspec: object,
    spawnOptions: SpawnOptions
  ): Promise<{
    spawn: ChildProcess;
    connectionFile: string;
    config: JupyterConnectionInfo;
    kernelspec: object;
  }>;
}
