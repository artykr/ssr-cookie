import type { Location } from "@remix-run/router";

export const parseLocationHash = (location: Location) => {
  const result: { [parameter: string]: string } = {};

  if (location.hash && location.hash[0] === "#") {
    try {
      const hashSearchParams = new URLSearchParams(location.hash.substring(1));
      hashSearchParams.forEach((value, key) => {
        result[key] = value;
      });
    } catch (e: any) {
      // hash is not a query string
    }
  }

  return result;
};
