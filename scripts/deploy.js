import epkg from 'editpkg'
import {packTo} from 'moduleops'

const dryRun = process.argv.includes("--dry");

console.log("-----------------------------")
console.log("deploy.js\n\n")
console.log("Dry Run: "+dryRun)

let srcPkg = await epkg.load()
await epkg.backup(srcPkg)
let distPkg = epkg.pruneForPublish(srcPkg)
distPkg = epkg.applyPublish(distPkg)
await epkg.proof(distPkg)
await epkg.write(distPkg)
await packTo("./releases")
srcPkg.lastPublish = new Date().toISOString()
await epkg.write(srcPkg)