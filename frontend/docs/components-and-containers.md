# How to Choose Between a Component or a Container

## Component

- Manages how things look.
- Has no dependencies on the rest of the app.
- Doesn't specify how data is loaded or mutated.
- Receives data and callbacks exclusively via props.
- Rarely has its own state (when it does, it’s UI state rather than data).
- Easy examples: Button, Table, Spinner, etc.

## Container

- Is often stateful, as it tends to serve as a data source.
- Is concerned with how things work.
- May contain both presentational and container components inside but usually doesn’t have any DOM markup of its own except for some wrapping divs, and never has any styles.
- Provides the data and behavior to presentational or other container components.
- Examples: UserInfo, ShoppingCart, etc.

> Don’t take the component vs. container separation as a dogma. Sometimes it doesn’t matter or it’s hard to draw the line. If you feel unsure about whether a specific element should be a component or a container, it might be too early to decide. Don’t sweat it!
