package resolver

import (
	"context"
	"errors"

	"github.com/traveloka/ecstatic/auth"
)

// Resolver main object
type Resolver struct{}

// Viewer return Query.viewer resolver
func (r *Resolver) Viewer(ctx context.Context) (*viewerResolver, error) {
	authInfo, ok := auth.FromContext(ctx)
	if !ok {
		return nil, errors.New("Invalid context")
	}
	return &viewerResolver{authInfo.User}, nil
}
