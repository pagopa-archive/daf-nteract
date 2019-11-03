import { Status } from "pidusage";
import { Kernel, launchKernel } from "../src/kernel";

jest.unmock("process");

describe.skip("Kernel", () => {
  it("can launch a kernel given a name", async done => {
    const kernel = await launchKernel("python3");
    expect(kernel.process).toBeDefined();
    await kernel.shutdown();
    done();
  });
  it("can shutdown a kernel", async done => {
    const kernel = await launchKernel("python3");
    const originalKill = process.kill;
    process.kill = jest.fn();
    expect(kernel.process).toBeDefined();
    await kernel.shutdown(500);
    expect(process.kill).toBeCalledWith(kernel.process.pid);
    expect(process.kill).toBeCalledTimes(1);
    process.kill = originalKill;
    await kernel.shutdown(500);
    done();
  });
  it("creates a valid shutdown epic", async done => {
    const originalKill = process.kill;
    process.kill = jest.fn(pid => {});
    const kernel = await launchKernel("python3");
    const shutdown$ = await kernel.shutdownEpic().toPromise();
    expect(shutdown$.subscribe).toBeTruthy();
    expect(shutdown$.value).toHaveProperty("status");
    process.kill = originalKill;
    kernel.process.kill();
    done();
  });
  it("can get usage metrics on a kernel", async done => {
    const kernel: Kernel = await launchKernel("python3");
    const stats: Status = await kernel.getUsage();
    expect(stats.memory).toBeDefined();
    expect(stats.pid).toEqual(kernel.process.pid);
    await kernel.shutdown();
    done();
  });
});
