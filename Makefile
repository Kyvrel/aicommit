.PHONY: help build release latest-release

help:
	@echo "Available targets:"
	@echo "  make build                 - Build the CLI with pnpm"
	@echo "  make release VERSION=vX.Y.Z - Create and push a version tag release"
	@echo "  make latest-release        - Push main to trigger the rolling latest release"

build:
	pnpm build

release:
ifndef VERSION
	$(error VERSION is not set. Usage: make release VERSION=vX.Y.Z)
endif
	git tag $(VERSION)
	git push origin $(VERSION)

latest-release:
	git push origin main
