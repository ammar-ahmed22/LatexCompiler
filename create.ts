
import { copy } from "https://deno.land/std@0.147.0/fs/copy.ts";
const name = Deno.args[0];

await copy("./src", `./${name}`);



