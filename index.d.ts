import {ProgramState} from "renkon";

export class RenkonNode {
    setupFromFunctions(...functions:Array<Function>):Promise<ProgramState>
    renkonify(main:Function, app?:any):Promise<ProgramState>
    loop(programstate: ProgramState):void
    mergeFunctions(...functions:Array<Function>):Promise<ProgramState>
    mergeFiles(...fileNames:Array<string>):Promise<ProgramState>
    getProgramState():Promise<ProgramState>
}
