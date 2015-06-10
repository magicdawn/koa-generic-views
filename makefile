bin = ./node_modules/.bin

test:
	@$(bin)/mocha

test-cover:
	@$(bin)/istanbul cover ./node_modules/mocha/bin/_mocha \
		-- -u exports

.PHONY: test test-cover
