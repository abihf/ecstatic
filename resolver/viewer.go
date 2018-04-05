package resolver

import "github.com/traveloka/ecstatic/model"

type viewerResolver struct {
	user *model.User
}

func (v *viewerResolver) Me() *userResolver {
	return &userResolver{v.user}
}
