package auth

import (
	"context"

	"github.com/guregu/dynamo"
	"github.com/satori/go.uuid"
	"github.com/traveloka/ecstatic/model"
)

type Auth struct {
	db        *dynamo.DB
	providers map[string]*provider
}

func New() *Auth {
	auth := &Auth{}
	auth.providers = make(map[string]*provider)

	auth.providers["google"] = newProvider(
		"https://accounts.google.com",
		"341264467714-gcpei8g0kleet3jqeu104lv62ku1fup8.apps.googleusercontent.com",
		"s1e2URdQkAuxTcJ0WBlSAbGg",
	)

	return auth
}

type Config struct {
	Provider     string
	Token        string
	AutoRegister bool
}

func (a *Auth) Authorize(ctx context.Context, conf Config) (*Info, error) {
	// if conf.Token == "" {
	// 	return &Info{}, nil
	// }

	idToken, err := a.providers[conf.Provider].verifier.Verify(ctx, conf.Token)
	if err != nil {
		return nil, err
	}

	id := conf.Provider + "#" + idToken.Subject
	found, err := model.LinkedAccountTable(a.db).
		Get("id", id).
		CountWithContext(ctx)

	var user model.User
	// success := false
	if found > 0 {
		var account model.LinkedAccount
		err = model.LinkedAccountTable(a.db).
			Get("id", id).
			OneWithContext(ctx, &account)
		if err != nil {
			return nil, err
		}

		err = model.UserTable(a.db).
			Get("id", account.UserID).
			OneWithContext(ctx, &user)
		if err != nil {
			return nil, err
		}

	} else if conf.AutoRegister {
		var claims struct {
			Name string
		}
		err = idToken.Claims(&claims)
		userID := uuid.NewV4().String()
		user = model.User{
			ID: userID,
		}
		account := &model.LinkedAccount{ID: id, UserID: userID}
		model.LinkedAccountTable(a.db).Put(account)
		model.UserTable(a.db).Put(&user)
	}

	return &Info{&user}, nil
}
