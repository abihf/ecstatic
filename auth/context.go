package auth

import (
	"context"

	"github.com/traveloka/ecstatic/model"
)

// Info store authentication info
type Info struct {
	User *model.User
}

var key Info

// NewContext returns a new Context that carries value u.
func NewContext(ctx context.Context, u *Info) context.Context {
	return context.WithValue(ctx, key, u)
}

// FromContext returns the User value stored in ctx, if any.
func FromContext(ctx context.Context) (*Info, bool) {
	u, ok := ctx.Value(key).(*Info)
	return u, ok
}
