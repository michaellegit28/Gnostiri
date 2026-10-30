// tsconfig-paths shim: the repo tsconfig declares "paths" without "baseUrl"
// (Next resolves it itself), and tsconfig-paths refuses to run without one.
// Registering the same mapping explicitly lets ts-node scripts import "@/lib/...".
const path = require("node:path");
require("tsconfig-paths").register({
  baseUrl: path.join(__dirname, ".."),
  paths: { "@/*": ["./src/*"] },
});
