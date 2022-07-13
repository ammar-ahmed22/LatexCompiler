import { latexmk } from "../latexmk.ts";

let outputPath = Deno.args[0];


const pdf = await latexmk({ main: "./main.tex", packages: "./assignment.sty" });

if (!outputPath){
    outputPath = "./output.pdf"
}


await Deno.writeFile(outputPath, pdf);





