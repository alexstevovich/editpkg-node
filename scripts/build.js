import editpkg from 'editpkg'


let srcPkg = await editpkg.load()
editpkg.backup(srcPkg)
let distPkg = editpkg.pruneForPublish(srcPkg)
distPkg = editpkg.applyPublish(distPkg)
editpkg.proof(distPkg)
editpkg.write(distPkg)
//publish
srcPkg.lastPublish = new Date().toISOString()
editpkg.write(srcPkg)