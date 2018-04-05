package model

import (
	"time"

	"github.com/guregu/dynamo"
)

// User comment here
type User struct {
	ID   string    // Hash key, a.k.a. partition key
	Time time.Time // Range key, a.k.a. sort key

	Name  string              `dynamo:"name"`
	Roles []string            `dynamo:",set"`
	Set   map[string]struct{} `dynamo:",set"` // Map sets, too!
}

func UserTable(db *dynamo.DB) dynamo.Table {
	return db.Table("web-ecstatic-User")
}
