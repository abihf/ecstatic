default: build

dist: lambda.zip ui.zip

build: build/ecstatic

run: build/ecstatic
	./build/ecstatic --http

build/ecstatic: schema
	go build -o build/ecstatic

schema/bindata.go: schema/schema.gql
	go generate ./schema

schema: schema/bindata.go

lambda.zip: ecstatic
	zip lambda.zip ecstatic

VENDOR_DEF = \
	ui/node_modules/react/umd/react.development.js \
	ui/node_modules/react-dom/umd/react-dom.development.js


ui/dist/vendor.js: ${VENDOR_DEF}
	cat ${VENDOR_DEF} > ui/dist/vendor.js

ui-vendor-dev: ui/dist/vendor.js

ui-dev: ui-vendor-dev
	cd ui; yarn webpack --mode development

build/ui.zip:
	cd ui; zip -r ../build/ui.zip index.html dist/

.PHONY: run dist build schema ui-dev ui-vendor-dev
