const versionUtils = require("../src/version-utils");

describe("version utils", () => {
  it("should recognize initial versions (semver)", () => {
    expect(versionUtils.isInitialDevelopment("v0.0.1")).toBe(true);
    expect(versionUtils.isInitialDevelopment("v0.1.0")).toBe(true);
  });

  it("should recognize production releases", () => {
    expect(versionUtils.isInitialDevelopment("v1.0.0")).toBe(false);
  });

  it("should allows = prefix or omitting prefixes at all", () => {
    expect(versionUtils.isInitialDevelopment("=v0.0.1")).toBe(true);
    expect(versionUtils.isInitialDevelopment("0.0.1")).toBe(true);
    expect(versionUtils.isInitialDevelopment("1.0.0")).toBe(false);
    expect(versionUtils.isInitialDevelopment("=v1.0.0")).toBe(false);
  });
});
