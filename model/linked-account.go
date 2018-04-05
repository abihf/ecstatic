package model

import (
	"github.com/guregu/dynamo"
)

type LinkedAccount struct {
	ID     string
	UserID string
}

func LinkedAccountTable(db *dynamo.DB) dynamo.Table {
	return db.Table("web-ecstatic-LinkedAccount")
}
