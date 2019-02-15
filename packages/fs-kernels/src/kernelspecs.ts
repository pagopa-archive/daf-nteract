/**
 * @module fs-kernels
 */
import fs from "fs";
import path from "path";
import { promisify } from "util";
import jp from "./jupyter-paths";

interface KernelInfo {
  name: string;
  resourceDir: string;
}

export interface KernelSpec {
  display_name: string;
  argv: string[];
  language: string;
  env?: { [varialbe: string]: string };
}

interface KernelResource {
  name: string;
  files: string[];
  resources_dir: string;
  spec: KernelSpec;
}

export interface KernelResourceByName {
  [name: string]: KernelResource;
}

function flatten<T>(array: Array<T | ConcatArray<T>>): T[] {
  return ([] as T[]).concat(...array);
}

/**
 * Get a kernel resources object
 * @param kernelInfo              description of a kernel
 * @param kernelInfo.name         name of the kernel
 * @param kernelInfo.resourceDir  kernel's resources directory
 * @return Promise for a kernelResources object
 */
async function getKernelResources(
  kernelInfo: KernelInfo
): Promise<KernelResource> {
  const readdir = promisify(fs.readdir);
  const files: string[] = await readdir(kernelInfo.resourceDir);
  const kernelJSONIndex: number = files.indexOf("kernel.json");
  if (kernelJSONIndex === -1) {
    throw new Error("kernel.json not found");
  }
  const readFile = promisify(fs.readFile);
  const data: Buffer = await readFile(
    path.join(kernelInfo.resourceDir, "kernel.json")
  );
  return {
    files: files.map(x => path.join(kernelInfo.resourceDir, x)),
    name: kernelInfo.name,
    resources_dir: kernelInfo.resourceDir,
    spec:
      data instanceof Buffer ? JSON.parse(data.toString()) : JSON.parse(data)
  };
}

/**
 * Gets a list of kernelInfo objects for a given directory of kernels
 * @param directory path to a directory full of kernels
 * @param mustExist does the directory have to exist?
 * @return Promise for an array of kernelInfo objects
 */
async function getKernelInfos(
  directory: string,
  mustExist: boolean = false
): Promise<KernelInfo[]> {
  const readdir: (directory: string) => Promise<string[]> = promisify(
    fs.readdir
  );
  try {
    const files: string[] = await readdir(directory);
    return files.map(fileName => ({
      name: fileName,
      resourceDir: path.join(directory, fileName)
    }));
  } catch (error) {
    if (!mustExist && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * find a kernel by name
 * @param kernelName the kernel to locate
 * @return kernelResource object
 */
export async function find(kernelName: string): Promise<KernelResource> {
  const dirs: string[] = await jp.dataDirs({ withSysPrefix: true });
  const kernelInfos: KernelInfo[] = dirs.map(dir => ({
    name: kernelName,
    resourceDir: path.join(dir, "kernels", kernelName)
  }));
  const kernelResource: KernelResourceByName = await extractKernelResources(
    kernelInfos
  );
  return kernelResource[kernelName];
}

async function extractKernelResources(
  kernelInfos: KernelInfo[] | KernelInfo[][]
): Promise<KernelResourceByName> {
  try {
    const kernelResources: KernelResource[] = await Promise.all(
      ([] as KernelInfo[])
        .concat(...kernelInfos)
        .filter(Boolean) // remove null/undefined kernelInfo
        .reduce<KernelInfo[]>((a, b) => a.concat(b), []) // flatten the results into one array
        .map(getKernelResources)
    );
    return kernelResources
      .filter(Boolean) // remove null/undefined kernelResources
      .reduce<KernelResourceByName>((kernels, kernel) => {
        if (!kernels[kernel.name]) {
          kernels[kernel.name] = kernel;
        }
        return kernels;
      }, {});
  } catch (error) {
    throw error;
  }
}

/**
 * Get an array of kernelResources objects for the host environment
 * This matches the Jupyter notebook API for kernelspecs exactly
 * @return Promise for an array of kernelResources objects
 */
export async function findAll(): Promise<KernelResourceByName> {
  try {
    const dirs: string[] = await jp.dataDirs({ withSysPrefix: true });
    const kernelInfoPromises: Array<Promise<KernelInfo[]>> = flatten(
      dirs.map(async dir => await getKernelInfos(path.join(dir, "kernels")))
    );
    const kernelInfos: KernelInfo[][] = await Promise.all(kernelInfoPromises);
    return extractKernelResources(kernelInfos);
  } catch (error) {
    throw error;
  }
}
