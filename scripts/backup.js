import { merge,  switchBranch, addAndCommitChanges, pushToAllRemotes } from "gitcmds";


// Check if --auto flag is present
const isAuto = process.argv.includes("--auto");
const toMain = process.argv.includes("--main");

// Construct commit message only if auto mode is enabled
const commitMessage = isAuto 
    ? `Auto backup: ${new Date().toISOString()}`  // Custom auto-generated message
    : null; // Null means it will prompt user for input

await switchBranch('dev')
await addAndCommitChanges(commitMessage);
await pushToAllRemotes('dev');

console.log("TEST")
console.log("✅ Backup process complete.");


if(toMain)
{
await switchBranch('main')
await merge("dev");
await pushToAllRemotes('dev');
}