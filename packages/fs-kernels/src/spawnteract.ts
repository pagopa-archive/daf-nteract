/**
 * This module contains methods that allow you to launch ("spawn") Jupyter
 * kernels.  You can spawn kernels either by name, by a `kernelSpec` or
 * by a `kernelSpec` and its connection information.
 *
 * Usage example:
 * ```js
 * // Spawn a kernel by name
 * var spawnResults = require('spawnteract').launch('python3');
 *
 * // Print the ip address and port for the shell channel
 * console.log(spawnResults.config.ip + ':' + spawnResults.config.shell_port);
 * ```
 *
 * You'll need to close `spawnResults.spawn` yourself as well as delete
 * `spawnResults.connectionFile` from disk when finished.
 *
 */

/* eslint camelcase: 0 */
// ^--- #justjupyterthings
// tslint:disable:object-literal-sort-keys
// ^--- let keys for ports be in port id order
/**
 *
 */
import fs from "fs";
import path from "path";

import util from "util";

import { getPorts as _getPorts } from "portfinder";
import uuid from "uuid";

import execa, { Options } from "execa";
import mkdirp from "mkdirp";

import { Subject } from "rxjs";

import jp from "./jupyter-paths";
import { findAll, KernelResourceByName, KernelSpec } from "./kernelspecs";

import { Channels, JupyterMessage, MessageType } from "@nteract/messaging";
import {
  createMainChannel,
  JupyterConnectionInfo
} from "enchannel-zmq-backend";

export function cleanup(connectionFile: fs.PathLike): void {
  try {
    fs.unlinkSync(connectionFile);
  } catch (e) {
    return;
  }
}

/**
 * Creates a JupyterConnectionInfo object for a kernel given an array of comm
 * channel ports
 *
 * @private
 * @param  ports array of comm channel ports to use for the connection,
 *               [hb_port, control_port, shell_port, stdin_port, iopub_port]
 * @return JupyterConnectionInfo object
 */
function createConnectionInfo(ports: number[]): JupyterConnectionInfo {
  return {
    version: 5,
    key: uuid.v4(),
    signature_scheme: "hmac-sha256",
    transport: "tcp",
    ip: "127.0.0.1",
    hb_port: ports[0],
    control_port: ports[1],
    shell_port: ports[2],
    stdin_port: ports[3],
    iopub_port: ports[4]
  };
}

export interface PortFinderOptions {
  host: string;
  port: number;
}

/**
 * Write a connection file
 * @public
 * @param [portFinderOptions] connection options
 *                            see {@link https://github.com/indexzero/node-portfinder/blob/master/lib/portfinder.js }
 * @param [portFinderOptions.port]
 * @param [portFinderOptions.host]
 * @return configResults
 * @return configResults.config          connection info
 * @return configResults.connectionFile  path to the connection file
 */
async function writeConnectionFile(
  portFinderOptions: PortFinderOptions = {
    host: "127.0.0.1",
    port: 9000
  }
): Promise<{
  config: JupyterConnectionInfo;
  connectionFile: string;
}> {
  const writeFile = util.promisify(fs.writeFile);
  const getPorts = util.promisify(_getPorts);

  try {
    const ports: number[] = await getPorts(5, portFinderOptions);
    const runtimeDir: string = await jp.runtimeDir();
    mkdirp(runtimeDir, error => {
      if (error) {
        throw error;
      }
    });

    // Write the kernel connection file.
    const config: JupyterConnectionInfo = createConnectionInfo(ports);
    const connectionFile: string = path.join(
      await jp.runtimeDir(),
      `kernel-${uuid.v4()}.json`
    );
    await writeFile(connectionFile, config);
    return {
      config,
      connectionFile
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Launch a kernel for a given kernelSpec
 * @public
 * @param  kernelSpec      describes a specific kernel
 * @param  [spawnOptions] `child_process`-like {@link https://github.com/sindresorhus/execa#options options for execa}
 *                         use `{ cleanupConnectionFile: false }` to disable automatic connection file cleanup
 */
export async function launchSpec(
  kernelSpec: KernelSpec,
  spawnOptions?: Options
): Promise<LaunchedKernel> {
  const info: {
    config: JupyterConnectionInfo;
    connectionFile: string;
  } = await writeConnectionFile();
  return launchSpecFromConnectionInfo(
    kernelSpec,
    info.config,
    info.connectionFile,
    spawnOptions
  );
}

export interface LaunchedKernel {
  spawn: execa.ExecaChildProcess;
  connectionFile: string;
  config: JupyterConnectionInfo;
  kernelSpec: KernelSpec;
  channels: Channels;
}

/**
 * Launch a kernel for a given kernelSpec and connection info
 * @public
 * @param kernelSpec describes a specific kernel, see the npm package
 *                   `kernelspecs`
 * @param config connection config
 * @param connectionFile path to the config file
 * @param [spawnOptions] `child_process`-like options for
 *                  [execa]{@link https://github.com/sindresorhus/execa#options}
 *                       use `{ cleanupConnectionFile: false }` to disable
 *                       automatic connection file cleanup
 *
 * @return spawnResults
 * @return spawnResults.spawn           spawned process
 * @return spawnResults.connectionFile  connection file path
 * @return spawnResults.config          connection info
 *
 */
export async function launchSpecFromConnectionInfo(
  kernelSpec: KernelSpec,
  config: JupyterConnectionInfo,
  connectionFile: string,
  spawnOptions?: Options
): Promise<LaunchedKernel> {
  const argv: string[] = kernelSpec.argv.map((x: string) =>
    x === "{connection_file}" ? connectionFile : x
  );

  const defaultSpawnOptions: {
    cleanupConnectionFile: boolean;
    stdio: string;
  } = {
    cleanupConnectionFile: true,
    stdio: "ignore"
  };
  const env: NodeJS.ProcessEnv & {
    [varialbe: string]: string;
  } = Object.assign({}, process.env, kernelSpec.env);
  const fullSpawnOptions = Object.assign(
    {},
    defaultSpawnOptions,
    // TODO: see if this interferes with what execa assigns to the env option
    { env },
    spawnOptions
  );

  const runningKernel: execa.ExecaChildProcess = execa(
    argv[0],
    argv.slice(1),
    fullSpawnOptions
  );

  if (fullSpawnOptions.cleanupConnectionFile !== false) {
    runningKernel.on("exit", (code, signal) => cleanup(connectionFile));
    runningKernel.on("error", error => cleanup(connectionFile));
  }

  const channels: Subject<
    JupyterMessage<MessageType, any>
  > = await createMainChannel(config);

  return {
    channels,
    config,
    connectionFile,
    kernelSpec,
    spawn: runningKernel
  };
}

/**
 * Launch a kernel by name
 * @public
 * @param kernelName
 * @param [specs]        array of kernelSpec objects to look through.
 *                       See the npm package `kernelspecs`
 * @param [spawnOptions] `child_process`-like options for
 *                  [execa]{@link https://github.com/sindresorhus/execa#options}
 *                       use `{ cleanupConnectionFile: false }` to disable
 *                       automatic connection file cleanup
 */
export async function launch(
  kernelName: string,
  spawnOptions?: Options,
  specs?: KernelResourceByName
): Promise<LaunchedKernel> {
  // Let them pass in a cached specs file
  if (!specs) {
    const sp: KernelResourceByName = await findAll();
    return launch(kernelName, spawnOptions, sp);
  }
  if (!specs[kernelName]) {
    return Promise.reject(new Error(`No spec available for ${kernelName}`));
  }
  const spec: KernelSpec = specs[kernelName].spec;
  return launchSpec(spec, spawnOptions);
}
