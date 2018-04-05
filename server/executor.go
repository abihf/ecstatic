package server

import (
	"context"
	"sync"

	graphql "github.com/graph-gophers/graphql-go"
)

type request struct {
	queries []query
	isBatch bool
}

// A query represents a single GraphQL query.
type query struct {
	OpName    string                 `json:"operationName"`
	Query     string                 `json:"query"`
	Variables map[string]interface{} `json:"variables"`
}

func execute(ctx context.Context, schema *graphql.Schema, req request) ([]*graphql.Response, error) {
	var (
		responses = make([]*graphql.Response, len(req.queries)) // Allocate a slice large enough for all responses.
		wg        sync.WaitGroup                                // Use the WaitGroup to wait for all executions to finish.
	)

	wg.Add(len(req.queries))

	for i, q := range req.queries {
		// Loop through the parsed queries from the request.
		// These queries are executed in separate goroutines so they process in parallel.
		go func(i int, q query) {
			res := schema.Exec(ctx, q.Query, q.OpName, q.Variables)

			// We have to do some work here to expand errors when it is possible for a resolver to return
			// more than one error (for example, a list resolver).
			// res.Errors = errors.Expand(res.Errors)

			responses[i] = res
			wg.Done()
		}(i, q)
	}

	wg.Wait()

	return responses, nil
}
