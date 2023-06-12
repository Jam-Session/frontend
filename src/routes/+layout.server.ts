import type { LayoutServerLoad } from "./$types";
import { name, version } from '../../package.json';

export const load: LayoutServerLoad = () => {
  return {
    title: `${name}@${version}`
  };
};