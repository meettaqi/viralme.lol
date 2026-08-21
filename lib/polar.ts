import { Polar } from "@polar-sh/sdk";

let _polar: Polar | null = null;

export function getPolar(): Polar {
  if (_polar) return _polar;
  const token = process.env.POLAR_ACCESS_TOKEN;
  if (!token) throw new Error("Missing POLAR_ACCESS_TOKEN environment variable");
  _polar = new Polar({ accessToken: token });
  return _polar;
}
