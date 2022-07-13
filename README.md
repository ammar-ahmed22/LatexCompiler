
# LatexCompiler

As I like to write assignments and reports in LaTeX, I decided to write my own CLI style compiler
using [Deno](https://deno.land/). This includes project creation using my own pre-defined template
as well as pdf compiling and preview with `latexmk` which comes installed with [MacTeX](http://tug.org/mactex/) (OSX) and 
[MiKTeX](https://miktex.org/) (Windows). 


## Installation

1. Install `deno` globally as described here: [https://deno.land/#installation](https://deno.land/#installation)
2. Install `denon` globally with:
```bash
deno install -qAf --unstable https://deno.land/x/denon/denon.ts
```
> `denon` is used to support script calls with `deno`


    
## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd LatexCompiler
```

### Create a project

```bash
  denon create TestProject
```

> Creates a directory named `TestProject` with template source files. 

### Compile project
Go to new project directory
```bash
  cd TestProject
```
Compile LaTeX
```bash
  denon compile outputFileName
```
> Creates a file named `outputFileName.pdf`. If no argument passed, default to: `output.pdf`

### Preview project
Go to new project directory
```bash
  cd TestProject
```
Preview LaTeX and watch for changes. 
```bash
  denon preview
```
> Creates a file named `preview.pdf` and opens it. 