'use strict'

let modPromise;

async function getProgramState() {
    if (modPromise) {return (await modPromise).ProgramState;}
    modPromise = import("renkon");
    return (await modPromise).ProgramState;
}
    
function getFunctions(optFileNames) {
    let fileNames = optFileNames;
    if (!fileNames) {
        const index = process.argv.lastIndexOf("--");
        if (index >= 0) {
            fileNames = process.argv.slice(index + 1);
        }
    }
    if (!fileNames || fileNames.length === 0) {
        console.log("no renkon module specified");
        return [];
    }

    return Promise.all(fileNames.map((f) => import(f))).then((modules) => {
        const funcs = [];
 
        modules.forEach((module) => {
            const keys = Object.keys(module);
            for (const key of keys) {
                if (typeof module[key] === "function") {
                    funcs.push(module[keys]);
                }
            }
        });
        return funcs;
    });
}

async function setupFromFunctions(...functions) {
    const ProgramState = await getProgramState();
    const programState = new ProgramState(Date.now(), null, true);
    programState.merge(...functions);
    return programState;
}

async function renkonify(main, app) {
    const ProgramState = await getProgramState();
    const programState = new ProgramState(Date.now(), app, true);
    programState.merge(main);
    Promise.resolve(programState).then(loop);
    return programState;
}

function loop(programState) {
    programState.noTickingEvaluator();
    return new Promise((resolve) => setTimeout(() => {
        resolve(true);
    }, 1000)).then((_v) => loop(programState));
}

function mergeFunctions(...functions) {
    return setupFromFunctions(...functions).then(loop);
}

function mergeFiles(...fileNames) {
    return getFunctions(fileNames).then(mergeFunctions);
}

Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgramState = getProgramState;
exports.getFunctions = getFunctions;
exports.setupFromFunctions = setupFromFunctions;
exports.renkonify = renkonify;
exports.mergeFunctions = mergeFunctions;
exports.mergeFiles = mergeFiles;

/* globals process exports */
