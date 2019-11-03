import { findAll } from "../src/kernelspecs";

describe.skip("findAll", () => {
  it("retrieves a collection of kernel specs", done => {
    return findAll().then(kernelspecs => {
      expect(kernelspecs).toHaveProperty("python3");

      const defaultKernel = kernelspecs.python3;

      expect(defaultKernel).toHaveProperty("spec");
      expect(defaultKernel).toHaveProperty("resource_dir");

      const spec = defaultKernel.spec;

      expect(spec).toHaveProperty("display_name");
      expect(spec).toHaveProperty("argv");
      done();
    });
  });
});
