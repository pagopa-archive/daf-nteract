import fs from "fs";

import { findAll } from "../src/kernelspecs";
import { launch } from "../src/spawnteract";

function cleanup(connectionFile) {
  // cleanup after our test, fail silently if the test failed
  try {
    fs.unlinkSync(connectionFile);
  } catch (e) {
    return;
  }
}

describe.skip("launch", () => {
  let spawnResult;
  let spawnResultNoCleanup;
  let kernelName;
  beforeAll(() => {
    // give CI some extra time for these launch kernel tests
    jest.setTimeout(10000);
  });

  afterAll(() => {
    // 5000 is the normal jest timeout limit
    jest.setTimeout(5000);
  });

  it("spawns a kernel", done => {
    findAll()
      .then(kernels => {
        const kernel = kernels.python2 || kernels.python3;
        kernelName = kernel.name;
        return launch(kernelName);
      })
      .then(c => {
        spawnResult = c;
        expect(c).not.toBeNull();
        expect(c.spawn).not.toBeNull();
        expect(fs.existsSync(c.connectionFile)).toBeTruthy();
        c.spawn.kill();
        return launch(kernelName, { cleanupConnectionFile: false });
      })
      .then(c => {
        spawnResultNoCleanup = c;
        spawnResultNoCleanup.spawn.kill();
        done();
      });
  });

  it("cleans up connection files", done => {
    const { connectionFile } = spawnResult;
    setTimeout(() => {
      expect(fs.existsSync(connectionFile)).toBeFalsy();
      done();
    }, 100);
  });

  it("won't clean up connection file if opt out", done => {
    const { connectionFile } = spawnResultNoCleanup;
    setTimeout(() => {
      expect(fs.existsSync(connectionFile)).toBeTruthy();
      cleanup(connectionFile);
      done();
    }, 100);
  });
});
