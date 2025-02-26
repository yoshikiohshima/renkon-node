# Renkon-Node: A Node.js application framework based on FRP

## Introduction

Renkon Node is a Node.js framework built upon FRP (Functional Reactive Programming). Refer to [Renkon-Core](https://github.com/yoshikiohshima/renkon-core) for the core language references.

To start a Renkon-Node application, write a .js file that looks like:

```JavaScript
import {ProgramState, mergeFunctions} from "renkon-node";

function foo(a) {
    const b = a + 1;
    return [b];
}

function main() {
    const componentFunc = Renkon.component(Renkon.app.foo);
    const component = componentFunc({a: Events.timer(100)});
    console.log("b", component.b);
    return [];
}

let programState = new ProgramState(0, {foo}, true);

mergeFunctions(programState, main);

```

You instantiate a ProgramState instance with the initial logical time, an object that you would use to store some data, and the noTicking flag. Then, `merge` the `main' function into the programState, which by side effects starts the slower evaluation loop.

In this example, the code in `main` function happens to refer to the "foo" function. It is accessed via the "app" argument (the second argument) for the ProgramState constructor.
