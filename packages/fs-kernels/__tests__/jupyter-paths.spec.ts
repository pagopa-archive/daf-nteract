import fs from "fs";
import jp from "../src/jupyter-paths";

import { execSync } from "child_process";

const actual = JSON.parse(
  execSync("python3 -m jupyter --paths --json").toString()
);

// case-insensitive comparisons
actual.data = actual.data.filter(fs.existsSync).map(path => {
  return path.toLowerCase();
});
actual.config = actual.config.filter(fs.existsSync).map(path => {
  return path.toLowerCase();
});

describe.skip("dataDirs", () => {
  it("returns a promise that resolves to a list of directories that exist", done => {
    return jp.dataDirs({ withSysPrefix: true }).then(dirs => {
      dirs = dirs.map(dir => {
        return dir.toLowerCase();
      });
      expect(Array.isArray(dirs)).toBe(true);
      dirs.forEach(el => {
        expect(typeof el).toBe("string");
      });
      expect(dirs).toStrictEqual(actual.data);
      done();
    });
  });
  it("works even in the absence of python", done => {
    jp.guessSysPrefix = jest.fn(() => null);

    const result = jp.dataDirs({ withSysPrefix: true }).then(dirs => {
      dirs = dirs.map(dir => {
        return dir.toLowerCase();
      });
      expect(Array.isArray(dirs)).toBe(true);
      dirs.forEach(el => {
        expect(typeof el).toBe("string");
      });
      expect(actual.data).toEqual(dirs);
      expect(actual.data.length).not.toBeLessThan(dirs.length);
      done();
    });

    jp.guessSysPrefix.mockRestore();
    return result;
  });
  it("returns a promise that resolves to a list of directories that exist", done => {
    return jp.dataDirs({ askJupyter: () => new Promise(actual) }).then(dirs => {
      dirs = dirs.map(dir => {
        return dir.toLowerCase();
      });
      expect(Array.isArray(dirs)).toBe(true);
      dirs.forEach(el => {
        expect(typeof el).toBe("string");
      });
      expect(dirs).toStrictEqual(actual.data);
      done();
    });
  });
  it("returns immediately with a guess by default", async done => {
    let dirs = await jp.dataDirs();
    dirs = dirs.map(dir => {
      return dir.toLowerCase();
    });
    expect(Array.isArray(dirs)).toBe(true);
    dirs.forEach(el => {
      expect(typeof el).toBe("string");
    });
    expect(dirs).toStrictEqual(actual.data);
    done();
  });
});

describe.skip("runtimeDir", () => {
  it("returns the directory where runtime data is stored", async done => {
    expect(await jp.runtimeDir()).toEqual(actual.runtime[0]);
    done();
  });
});

describe.skip("configDirs", () => {
  it("returns a promise that resolves to a list of directories that exist", done => {
    return jp.configDirs({ withSysPrefix: true }).then(dirs => {
      dirs = dirs.map(dir => {
        return dir.toLowerCase();
      });
      expect(Array.isArray(dirs)).toBe(true);
      dirs.forEach(el => {
        expect(typeof el).toBe("string");
      });
      expect(dirs).toStrictEqual(actual.config);
      done();
    });
  });
  it("returns a promise that resolves to a list of directories that exist", done => {
    return jp
      .configDirs({ askJupyter: () => new Promise(actual) })
      .then(dirs => {
        dirs = dirs.map(dir => {
          return dir.toLowerCase();
        });
        expect(Array.isArray(dirs)).toBe(true);
        dirs.forEach(el => {
          expect(typeof el).toBe("string");
        });
        expect(dirs).toStrictEqual(actual.config);
        done();
      });
  });
  it("returns immediately with a guess by default", async done => {
    let dirs = await jp.configDirs();
    dirs = dirs.map(dir => {
      return dir.toLowerCase();
    });
    expect(Array.isArray(dirs)).toBe(true);
    dirs.forEach(el => {
      expect(typeof el).toBe("string");
    });
    expect(dirs).toStrictEqual(actual.config);
    done();
  });
});
