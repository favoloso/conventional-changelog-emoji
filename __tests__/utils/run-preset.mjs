/**
 * Runs `conventional-changelog` and `conventional-recommended-bump` (ESM only)
 * with the preset in the current working directory, loading it by name like
 * real projects do, and prints changelog and bump recommendation as JSON.
 */
import { ConventionalChangelog } from "conventional-changelog";
import { Bumper } from "conventional-recommended-bump";

const cwd = process.cwd();

let changelog = "";
for await (const chunk of new ConventionalChangelog(cwd)
  .loadPreset("@favoloso/emoji")
  .readPackage()
  .write()) {
  changelog += chunk;
}

const { releaseType, reason } = await new Bumper(cwd)
  .loadPreset("@favoloso/emoji")
  .bump();

process.stdout.write(JSON.stringify({ changelog, releaseType, reason }));
