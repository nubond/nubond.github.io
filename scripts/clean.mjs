// Removes the directories given as arguments (relative to the package root).
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

for (const directory of process.argv.slice(2)) {
    rmSync(resolve(directory), { recursive: true, force: true });
}
