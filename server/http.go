package server

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	graphql "github.com/graph-gophers/graphql-go"
)

func ServeHTTP(schema *graphql.Schema) {
	var (
		addr              = ":8000"
		readHeaderTimeout = 1 * time.Second
		writeTimeout      = 10 * time.Second
		idleTimeout       = 90 * time.Second
		maxHeaderBytes    = http.DefaultMaxHeaderBytes
	)
	h := &httpHandler{schema}

	mux := http.NewServeMux()

	fileServer := http.FileServer(http.Dir("ui/dist/"))
	mux.Handle("/", fileServer)
	// indexHTML, _ := ioutil.ReadFile("ui/index.html")
	// mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	// 	w.Write(indexHTML)
	// })

	mux.HandleFunc("/graphiql", func(w http.ResponseWriter, r *http.Request) {
		w.Write(graphiql)
	})
	mux.HandleFunc("/graphql/schema", func(w http.ResponseWriter, r *http.Request) {
		schemaJSON, _ := schema.ToJSON()
		w.Header().Set("content-type", "application/json")
		w.Write(schemaJSON)
	})
	mux.Handle("/graphql/", h)
	mux.Handle("/graphql", h) // Register without a trailing slash to avoid redirect.

	s := &http.Server{
		Addr:              addr,
		Handler:           mux,
		ReadHeaderTimeout: readHeaderTimeout,
		WriteTimeout:      writeTimeout,
		IdleTimeout:       idleTimeout,
		MaxHeaderBytes:    maxHeaderBytes,
	}

	// Begin listeing for requests.
	log.Printf("Listening for requests on %s", s.Addr)

	if err := s.ListenAndServe(); err != nil {
		log.Println("server.ListenAndServe:", err)
	}

	// TODO: intercept shutdown signals for cleanup of connections.
	log.Println("Shut down.")
}

type httpHandler struct {
	Schema *graphql.Schema
}

func (h httpHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Validate the request.
	// if ok := isSupported(r.Method); !ok {
	// 	respond(w, errorJSON("only POST or GET requests are supported"), http.StatusMethodNotAllowed)
	// 	return
	// }

	req, err := parseHttp(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	n := len(req.queries)
	if n == 0 {
		http.Error(w, "no queries to execute", http.StatusBadRequest)
		return
	}

	responses, err := execute(r.Context(), h.Schema, req)
	if err != nil {
		http.Error(w, "server error", http.StatusInternalServerError)
		return
	}

	var resp []byte
	if req.isBatch {
		resp, err = json.Marshal(responses)
	} else if len(responses) > 0 {
		resp, err = json.Marshal(responses[0])
	}
	w.Header().Set("content-type", "application/json")
	w.Write(resp)
	// respond(w, resp, http.StatusOK)
}

var graphiql = []byte(`
	<!DOCTYPE html>
	<html>
		<head>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/graphiql/0.11.11/graphiql.css"/>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js"></script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/umd/react.production.min.js"></script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.2.0/umd/react-dom.production.min.js"></script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/graphiql/0.11.11/graphiql.min.js"></script>
		</head>
		<body style="width: 100%; height: 100%; margin: 0; overflow: hidden;">
			<div id="graphiql" style="height: 100vh;">Loading...</div>
			<script>
				function fetchGQL(params) {
					return fetch("/graphql", {
						method: "post",
						body: JSON.stringify(params),
						credentials: "include",
					}).then(function (resp) {
						return resp.text();
					}).then(function (body) {
						try {
							return JSON.parse(body);
						} catch (error) {
							return body;
						}
					});
				}
				ReactDOM.render(
					React.createElement(GraphiQL, {fetcher: fetchGQL}),
					document.getElementById("graphiql")
				)
			</script>
		</body>
	</html>
	`)
