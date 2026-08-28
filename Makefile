.PHONY: help firmware flash firmware-console test serve

help: ## show available targets
	@grep -hE '^[a-zA-Z0-9_-]+:.*##' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

firmware: ## build the micro:bit firmware (pxt build)
	$(MAKE) -C firmware build

flash: ## flash the firmware to the micro:bit over USB
	$(MAKE) -C firmware deploy

firmware-console: ## open the pxt serial console
	$(MAKE) -C firmware console

test: ## run pxt firmware tests
	$(MAKE) -C firmware test

serve: debug/node_modules/.bin/serve ## serve the BLE debug tester on tcp://0.0.0.0:3000
	./debug/node_modules/.bin/serve debug -l tcp://0.0.0.0:3000

debug/node_modules/.bin/serve:
	cd debug && npm install --no-audit --no-fund
