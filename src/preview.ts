// import * as Colors from "https://deno.land/std@0.147.0/fmt/colors.ts";
import { latexmk } from "../latexmk.ts";
// import { signal } from "https://deno.land/std@0.148.0/signal/mod.ts"

const watcher = Deno.watchFs(["./main.tex", "./assignment.sty"]);

const pdf = await latexmk({ main: "./main.tex", packages: "./assignment.sty"});

await Deno.writeFile("preview.pdf", pdf);

const openProcess = Deno.run({
    cmd: ['open', "preview.pdf"]
})

const status = await openProcess.status();

if (!status.success){
    Deno.exit(0);
}

openProcess.close();



Deno.addSignalListener("SIGINT", () => {
    Deno.removeSync("./preview.pdf", { recursive: true })
})


for await (const event of watcher){
    
    if (event.kind === "modify"){
        console.clear();
        const pdf = await latexmk({ main: "./main.tex", packages: "./assignment.sty"});

        await Deno.writeFile("preview.pdf", pdf);
        
    }
}



