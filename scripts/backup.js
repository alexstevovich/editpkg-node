import {commitChanges} from 'gitcmds'

const isAuto = process.argv.includes("--auto"); // Detect if --auto was passed
console.log(isAuto)

commitChanges()
console.log("test2")