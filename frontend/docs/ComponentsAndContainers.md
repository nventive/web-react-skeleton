# How to choose between Component or Container

## Component

- Manages how things look
- Has no dependencies on the rest of the app
- Doesn't specify how data is loaded or mutated
- Receives data and callbacks exclusively via props
- Rarely has own state (when it does, it’s UI state rather than data)
- Easy examples: Button, Table, Spinner, etc...

## Container

- Is often stateful, as it tends to serve as data sources.
- Is concerned with how things work
- May contain both presentational and container components inside but usually don’t have any DOM markup of their own except for some wrapping divs, and never have any styles.
- Provides the data and behavior to presentational or other container components.
- Examples: UserInfo, ShoppingCart, etc...

> Don’t take the component VS container separation as a dogma. Sometimes it doesn’t matter or it’s hard to draw the line. If you feel unsure about whether a specific element should be a component or a container, it might be too early to decide. Don’t sweat it!
