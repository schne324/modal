# Unreleased (`head`)

- Adding IE8 support via [stephenmathieson/event](https://github.com/stephenmathieson/event) rather than [component/event](https://github.com/component/event)
- Replaced `<p />` with a `<label />` (WCAG)
- Fixed duplicate DOM event listeners
- Emptying the `<input />`'s value on `confirm`
- Fixed modal close on `ENTER` in the `<input />`

# 0.1.2

- Fix duplicate IDs 

# 0.1.1

- `options.insertInto` may now be an HTMLElement or a selector
- removed debugging `console.log`

# 0.1.0

- Added "closed", "show", and "hide" events
- Added `Modal#hide` method
- Added `Modal#show` method
- Added support for multiple modals on a single page