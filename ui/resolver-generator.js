const gql = require("graphql-tag");
const fs = require("fs");

function generate(schemaFile, dir, package) {
  const schemaText = fs.readFileSync(schemaFile, { encoding: "utf-8" });
  const ast = gql(schemaText);

  let
}
