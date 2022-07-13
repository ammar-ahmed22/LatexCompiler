import * as Colors from "https://deno.land/std@0.147.0/fmt/colors.ts";
import { join } from "https://deno.land/x/std@0.147.0/path/mod.ts";
import { readLines } from "https://deno.land/std@0.148.0/io/mod.ts";

const stringToUint8Array = (data: string) : Uint8Array => {
    return new TextEncoder().encode(data);
}



export interface latexmkParams{
    main: string,
    packages?: string | string[],
    errorLogsPath?: string
}

export const latexmk = async (params : latexmkParams ): Promise<Uint8Array> => {
    const { main, packages } = params;
    const errorLogsPath : string = params.errorLogsPath ? params.errorLogsPath : "./error.logs";

    // Create temporary directory
    const tempDir : string = await Deno.makeTempDir();

    // Create temporary .tex and .sty files
    const tempMain : string = await Deno.makeTempFile({ dir: tempDir, suffix: ".tex"});
    const tempPackages : string[] = [];
    if (packages){
        if (packages instanceof Array){
            // do something
            for (let i = 0; i < packages.length; i++){
                const tempPackage : string = await Deno.makeTempFile({ dir: tempDir, suffix: ".sty"});
                tempPackages.push(tempPackage);
            }
        }else{
            // do something else
            const tempPackage : string = await Deno.makeTempFile({ dir: tempDir, suffix: ".sty"});
            tempPackages.push(tempPackage);
        }
    }
    // const tempPackage = await Deno.makeTempFile({ dir: tempDir, suffix: ".sty"});

    // Copy src files into temporary directory
    await Deno.copyFile(main, tempMain);
    for (let i = 0; i < tempPackages.length; i++){
        if (packages){
            if (packages instanceof Array){
                await Deno.copyFile(packages[i], tempPackages[i]);
            }else{
                await Deno.copyFile(packages, tempPackages[i]);
            }
            
        }
    }
    

    if (packages){
        
        if (packages instanceof Array){
            const tempMainText : string = await Deno.readTextFile(tempMain);
            let updated : string = tempMainText;
            for (let i = 0; i < tempPackages.length; i++){

                const texPath : string = packages[i].substring(0, packages[0].length - 4);

                const texTempPath : string = tempPackages[i].substring(0, tempPackages[i].length - 4);

                // Read temp .tex file and replace \usepackage{package} with \\usepackage{path-to-temp}
                updated = updated.replace(`\\usepackage{${texPath}}`, `\\usepackage{${texTempPath}}`);
                

            }

            await Deno.writeFile(tempMain, stringToUint8Array(updated));

        }else{
            // package path in tex
            const texPath : string = packages.substring(0, packages.length - 4);
            // package path in temp dir
            const texTempPath : string = tempPackages[0].substring(0, tempPackages[0].length - 4);

            // Read temp .tex file and replace \usepackage{package} with \\usepackage{path-to-temp}
            const updated : string = ( await Deno.readTextFile(tempMain) ).replace(`\\usepackage{${texPath}}`, `\\usepackage{${texTempPath}}`);

            // Update temp .tex
            await Deno.writeFile(tempMain, stringToUint8Array(updated));
        }
        
    }
   

    
    const jobname = "latexmk";
    
    const process : Deno.Process = Deno.run({
        cmd: ['latexmk', '-pdf', "-g", `-jobname=${jobname}`],
        cwd: tempDir,
        stdout: "piped",
        stderr: "piped",
        stdin: "piped"
    })

    console.log(`Compiling: ${Colors.cyan(main)}`);
    
    if (process.stdout){

        for await (const line of readLines(process.stdout)){
            Deno.writeFile(errorLogsPath, stringToUint8Array(line + "\n"), { append: true, create: true })

            if (line.includes("LaTeX Error")){
                Deno.writeFile(errorLogsPath, stringToUint8Array(line + "\n"), { append: true, create: true })
                throw new Error(`Unable to compile (Error logs available at ${errorLogsPath})`)
            }
        }
    }
    
   

    const status : Deno.ProcessStatus = await process.status();

    // console.log({ status });
    

    // console.log({ status, stdout, stderr });

    if (!status.success){
        await Deno.remove( tempDir, { recursive: true });

        throw new Error("Unable to compile")
    }

    await Deno.remove(errorLogsPath, { recursive: true })
    //console.log(new TextDecoder().decode(output));
    const outputPath : string = join(tempDir, `${jobname}.pdf`);

    const pdf : Uint8Array = await Deno.readFile(outputPath);


    await Deno.remove(tempDir, { recursive: true });

    console.log(Colors.bold("Sucessfully compiled."));

    return pdf;
    
}