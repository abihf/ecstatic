package main

import (
	"flag"

	graphql "github.com/graph-gophers/graphql-go"
	"github.com/traveloka/ecstatic/resolver"
	"github.com/traveloka/ecstatic/schema"
	"github.com/traveloka/ecstatic/server"
)

func main() {
	schema := graphql.MustParseSchema(schema.String(), &resolver.Resolver{})

	var usingHTTP = flag.Bool("http", false, "Serve http instead of lambda handler")
	flag.Parse()

	if *usingHTTP {
		server.ServeHTTP(schema)
	} else {
		server.ServeLambda(schema)
	}
}
