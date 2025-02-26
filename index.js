import {ProgramState} from "renkon-core";
export {ProgramState} from "renkon-core";

export function getFunctions(optFileNames) {
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

export function mergeFunctions(programState, ...functions) {
    programState.merge(...functions);
    Promise.resolve(programState).then(loop);
    return programState;
}

export function mergeFiles(programState, ...fileNames) {
    return getFunctions(fileNames).then((funcs) => {
        return mergeFunctions(programState, ...funcs);
    });
}

function loop(programState) {
    programState.noTickingEvaluator();
    return new Promise((resolve) => setTimeout(() => {
        resolve(true);
    }, 1000)).then((_v) => loop(programState));
}

/* globals process */
