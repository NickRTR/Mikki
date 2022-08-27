import { execSync } from "child_process";
import { writeFileSync } from "fs";

var local_commit_sha = execSync("git rev-parse HEAD").toString().replace("\n", "");
console.log("local_commit_sha: " + local_commit_sha);

writeFileSync("static/commit.js", "window.commit_sha = '" + local_commit_sha + "';");
