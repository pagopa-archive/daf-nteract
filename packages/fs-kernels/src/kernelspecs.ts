import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);

interface ParsedKernelSpecs {
  [name: string]: {
    resource_dir: string;
    spec: KernelSpec;
  };
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
  resource_dir: string;
  spec: KernelSpec;
}

export interface KernelResourceByName {
  [name: string]: KernelResource;
}

async function mapToKernelResources(
  kernelSpecs: ParsedKernelSpecs
): Promise<KernelResourceByName> {
  const resources: KernelResourceByName = {};

  for (const name of Object.keys(kernelSpecs)) {
    const kernelSpec = kernelSpecs[name];
    const files = await readdir(kernelSpec.resource_dir);
    resources[name] = {
      name,
      files: files.map(file => path.join(kernelSpec.resource_dir, file)),
      resource_dir: kernelSpec.resource_dir,
      spec: kernelSpec.spec
    };
  }

  return resources;
}

/**
 * find a kernel by name
 * @param kernelName the kernel to locate
 * @return kernelResource object
 */
export async function find(kernelName: string): Promise<KernelResource> {
  return (await findAll())[kernelName];
}

/**
 * Get an array of kernelResources objects for the host environment
 * This matches the Jupyter notebook API for kernelspecs exactly
 * @return Promise for an array of kernelResources objects
 */
export async function findAll(): Promise<KernelResourceByName> {
  return new Promise((resolve, reject) => {
    exec("python3 -m jupyter kernelspec list --json", async (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        const kernelSpecs: ParsedKernelSpecs = JSON.parse(stdout).kernelspecs;
        const resources = await mapToKernelResources(kernelSpecs);
        resolve(resources);
      }
    });
  });
}
