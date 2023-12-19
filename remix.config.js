/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
  postcss: true,
  serverDependenciesToBundle: [
    "remix-utils/locales/server",
    "remix-utils/locales/react",
  ],
  browserNodeBuiltinsPolyfill: { modules: { crypto: true } },
  tailwind: true,
  serverModuleFormat: "cjs",
};
