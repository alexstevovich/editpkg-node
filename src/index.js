import { promises as fs } from 'fs';
import path from 'path';

/**
 * Load package.json from the given directory.
 */
export async function load(dir = process.cwd()) {
    try {
        const packagePath = path.join(dir, 'package.json');
        const packageData = await fs.readFile(packagePath, 'utf-8');
        return JSON.parse(packageData);
    } catch (error) {
        console.error(`editPkg: Error loading package.json in ${dir}:`, error.message);
        return null;
    }
}

/**
 * Write package.json back to the given directory.
 */
export async function write(dir = process.cwd(), content = {}) {
    try {
        const packagePath = path.join(dir, 'package.json');
        const packageData = JSON.stringify(content, null, 2);
        await fs.writeFile(packagePath, packageData, 'utf-8');
        console.log(`editPkg: Successfully updated package.json in ${dir}`);
    } catch (error) {
        console.error(`editPkg: Error writing package.json in ${dir}:`, error.message);
    }
}

/**
 * Set repository URL in package.json.
 */
export function setRepo(pkg, url) {
    return { ...pkg, repository: { type: 'git', url } };
}

/**
 * Create a deep copy of the package object.
 */
export function copy(pkg) {
    return JSON.parse(JSON.stringify(pkg)); // Deep clone to avoid mutations
}

/**
 * Save a proof of the given data to a JSON file.
 * Used for debugging or verification purposes.
 * 
 * @param {Object} data - The object to write.
 * @param {string} path - The file path to save the proof (default: "./package.proof.json").
 */
export async function proof(data, path = "./package.proof.json") {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(path, jsonData, 'utf-8');
        console.log(`Proof saved to ${path}`);
    } catch (error) {
        console.error(`Error writing proof file ${path}:`, error.message);
    }
}

/**
 * Save a backup of the given data to a JSON file.
 * Used to ensure a recoverable state before making changes.
 * 
 * @param {Object} data - The object to write.
 * @param {string} path - The file path to save the backup (default: "./package.backup.json").
 */
export async function backup(data, path = "./package.backup.json") {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(path, jsonData, 'utf-8');
        console.log(`Backup saved to ${path}`);
    } catch (error) {
        console.error(`Error writing backup file ${path}:`, error.message);
    }
}



/**
 * Applies the "publish" overrides to package.json data before publishing.
 *
 * @param {Object} pkg - The package.json object.
 * @returns {Object} - The modified package.json object.
 */
export async function applyPublish(pkg) {
    if (!pkg || typeof pkg !== 'object') {
        throw new Error("Invalid package.json data.");
    }

    if (pkg.publish) {
        Object.assign(pkg, pkg.publish);
        delete pkg.publish; // Remove the "publish" key after applying it
    }

    return pkg;
}


/**
 * Cleans a package.json object for final launch by removing development-related fields.
 * 
 * @param {Object} pkg - The package.json object.
 * @returns {Object} - The cleaned package.json object.
 */
export function pruneForPublish(pkg) {
    if (!pkg || typeof pkg !== 'object') return pkg;

    const cleanedPkg = { ...pkg };

    // Remove fields not needed for production
    const fieldsToRemove = [
        'scripts', 'devDependencies', 'lint-staged', 'husky', 'jest',
        'mocha', 'ava', 'vitest', 'nodemonConfig', 'babel', 'eslintConfig',
        'prettier', 'stylelint', 'workspaces', 'tsconfig', 'rollup',
        'webpack', '_moduleAliases', 'pnpm'
    ];

    fieldsToRemove.forEach(field => delete cleanedPkg[field]);

    return cleanedPkg;
}

export default {load,write,setRepo,copy,backup,proof,applyPublish,pruneForPublish};
