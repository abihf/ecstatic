package server

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/graph-gophers/graphql-go"
)

func ServeLambda(schema *graphql.Schema) {
	lambda.Start(lambdaHandler)
}

func lambdaHandler(ctx context.Context, event events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	fmt.Printf("Request = %v", event.Body)

	res := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       "{\"status\": \"OK\"}",

		Headers: map[string]string{
			"content-type": "application/json",
		},
	}
	return res, nil
}
