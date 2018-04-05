package resolver

import (
	"github.com/graph-gophers/graphql-go"
	"github.com/traveloka/ecstatic/model"
)

type userResolver struct {
	user *model.User
}

type linkedAccountResolver struct {
	account *model.LinkedAccount
}

func (u *userResolver) ID() graphql.ID {
	return graphql.ID("user:" + u.user.ID)
}

func (u *userResolver) UserID() string {
	return u.user.ID
}

func (u *userResolver) FullName() string {
	return u.user.Name
}

func (u *userResolver) LinkedAccounts() []*linkedAccountResolver {
	result := make([]*linkedAccountResolver, 0)
	// for i, account := range u.user.LinkedAccounts {
	// 	result[i] = &linkedAccountResolver{account}
	// }
	return result
}

func (acc *linkedAccountResolver) Provider() string {
	return acc.account.ID
}

func (acc *linkedAccountResolver) Subject() string {
	return acc.account.UserID
}
