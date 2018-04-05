import {
  DocumentNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  Location,
  OperationTypeNode,
  SchemaDefinitionNode,
  TypeNameMetaFieldDef,
  TypeNode,
} from "graphql";

import gql from "graphql-tag";

generate(
  `
schema {
  query: Query
  mutation: Mutation
}
type Query {
  me: User
  user(id: ID!): User
}
type User {
  id: ID!
  full_name: String!
  roles: [String!]!
}
input CreateUserInput {
  full_name: String!
}
type Mutation {
  createUser(user: CreateUserInput!): User
}
`,
  "lala",
  "resolver",
);

function generate(schemaString: string, dir: string, packageName = "resolver") {
  const ast: DocumentNode = gql(schemaString);
  const schemaInfo = getSchemaInfo(ast);
  const operationTypes = Object.keys(schemaInfo).map(key => schemaInfo[key as keyof (ISchemaInfo)]);

  const typeMap = ast.definitions.reduce(
    (res, definition) => {
      if (definition.kind === "ObjectTypeDefinition") {
        let typeName = definition.name.value;
        if (operationTypes.includes(typeName)) {
          typeName = "-";
        }
        res[typeName] = (res[typeName] || []).concat(definition.fields);
      }
      return res;
    },
    {} as { [name: string]: FieldDefinitionNode[] },
  );

  const headers = `package ${packageName}

import (
  "github.com/graph-gophers/graphql-go"
  "golang.org/x/net/context"
)

`;

  const generatedTypes = Object.entries(typeMap).map(([name, fields]) => headers + generateType(name, fields));
  // tslint:disable-next-line
  console.log(generatedTypes.join("\n\n"));
}

interface ISchemaInfo {
  query?: string;
  mutation?: string;
  subscription?: string;
}

function getSchemaInfo(ast: DocumentNode): ISchemaInfo {
  const result: ISchemaInfo = {};

  const schemaDefinition = ast.definitions.find(definition => {
    return definition.kind === "SchemaDefinition";
  }) as SchemaDefinitionNode;

  schemaDefinition.operationTypes.forEach(operation => {
    result[operation.operation] = operation.type.name.value;
  });

  return result;
}

function generateType(typeName: string, fields: FieldDefinitionNode[]): string {
  const resolverName = getResolverName(typeName);
  let result = `// ${resolverName} struct\ntype ${resolverName} struct {}\n`;
  const abbreviation = resolverName[0].toLocaleLowerCase();

  fields.forEach(field => {
    const fieldName = normalizeName(field.name.value);
    const fieldType = convertType(field.type);
    const args = field.arguments.length > 0 ? ", " + generateFieldArguments(field.arguments) : "";
    result += `\n// ${fieldName} returns ${field.name.value} of ${resolverName}\n`;
    result += `func (${abbreviation} *${resolverName}) ${fieldName}(ctx context.Context${args}) (${fieldType}, error) {\n  // impl\n}\n`;
  });

  return result;
}

function getResolverName(typeName: string): string {
  if (typeName === "-") {
    return "Resolver";
  } else {
    return typeName + "Resolver";
  }
}

function normalizeName(fieldName: string): string {
  // mejik
  return fieldName.length <= 3
    ? fieldName.toUpperCase()
    : fieldName.replace(/(^|_)([a-z])/g, ($0, $1, $2) => $2.toUpperCase());
}

function generateFieldArguments(args: InputValueDefinitionNode[]) {
  const lines = args.map(arg => {
    const argName = normalizeName(arg.name.value);
    const argType = convertType(arg.type);
    const description = arg.description ? " // " + arg.description.value : "";
    return `\t${argName} ${argType}${description}`;
  });
  return `args struct {\n${lines.join("\n")}\n}`;
}

function convertType(type: TypeNode, nullable = true): string {
  switch (type.kind) {
    case "NamedType":
      return (nullable ? "*" : "") + gqlTypeToNativeGo(type.name.value);

    case "ListType":
      return (nullable ? "*" : "") + "[]" + convertType(type.type);

    case "NonNullType":
      return convertType(type.type, false);
  }
}

function gqlTypeToNativeGo(gqlType: string): string {
  switch (gqlType) {
    case "String":
      return "string";
    case "ID":
      return "graphql.ID";

    default:
      return getResolverName(gqlType);
  }
}

class GqlError extends Error {
  public loc: Location;

  constructor(msg: string, loc: Location) {
    super(`${msg} @${loc.start}:${loc.end}`);
    this.loc = loc;
  }
}
