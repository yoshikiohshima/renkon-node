import {ProgramState} from "renkon";

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

export function setupFromFunctions(...functions) {
    const programState = new ProgramState(Date.now(), null, true);
    programState.merge(...functions);
    return Promise.resolve(programState);
}


export function renkonify(main, app) {
    const programState = new ProgramState(Date.now(), app, true);
    programState.merge(main);
    return Promise.resolve(programState).then(loop);
}

export function loop(programState) {
    programState.noTickingEvaluator();
    return new Promise((resolve) => setTimeout(() => {
        resolve(true);
    }, 1000)).then((_v) => loop(programState));
}

export function mergeFunctions(...functions) {
    return setupFromFunctions(...functions).then(loop);
}

export function mergeFiles(...fileNames) {
    return getFunctions(fileNames).then(mergeFunctions);
}

/* globals process */
