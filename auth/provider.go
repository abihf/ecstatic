package auth

import (
	"context"

	oidc "github.com/coreos/go-oidc"
	"golang.org/x/oauth2"
)

type provider struct {
	verifier *oidc.IDTokenVerifier
	config   *oauth2.Config
}

func newProvider(url, clientID, secret string) *provider {
	prof, err := oidc.NewProvider(context.Background(), url)
	if err != nil {
		// handle error
	}

	// Configure an OpenID Connect aware OAuth2 client.
	config := oauth2.Config{
		ClientID:     clientID,
		ClientSecret: secret,
		RedirectURL:  "/",

		// Discovery returns the OAuth2 endpoints.
		Endpoint: prof.Endpoint(),

		// "openid" is a required scope for OpenID Connect flows.
		Scopes: []string{oidc.ScopeOpenID, "profile", "email"},
	}

	verifier := prof.Verifier(&oidc.Config{ClientID: clientID})

	return &provider{
		verifier: verifier,
		config:   &config,
	}
}
