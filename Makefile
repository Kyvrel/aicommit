.PHONY: help build release

help:
	@echo "Available targets:"
	@echo "  make build                 - Build the CLI with pnpm"
	@echo "  make release VERSION=vX.Y.Z - Create and push a git tag to trigger a GitHub release"

build:
	pnpm build

release:
ifndef VERSION
	$(error VERSION is not set. Usage: make release VERSION=vX.Y.Z)
endif
	git tag $(VERSION)
	git push origin $(VERSION)
