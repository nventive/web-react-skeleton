# React Standards

## Code formatting

- Prettier is used to format all TypeScript code
- You should set your editor of choice to format on save using prettier. This will prevent code changes on formatting

## Designs

- UI designs should be followed as closely as possible. If it's not possible or costly to match the design, the designer and the developer need to plan a meeting to discuss options.
- Most design viewing tools have ways to inspect the design to see values like colors & spacing. Currently we use Figma which has an Inspector tab on the right which provides this functionality
- Sometimes a element may not be selectable with the inspector due to it being hidden under a different element, to access the element underneath use the panel on the left to find your element

## Functions

- Only use functions when needed.

  - For example:

```ts
function showButton(): boolean {
  return providerId === client.providerId;
}
```

- Should be a constant variable
  `const showButton = providerId === client.providerId;`

- Callbacks should be named after the event
- For example a `onClick` callback function name should always start with "onClick"
  `onClick={onClickAmountOption}`

- Functions that aren't React components should be camel case: `onChange` not `OnChange`

## Labels

- Labels should always be passed between components as the translated value

- You should never see code like below where a property is being translated:
  `<Button>{t(props.label)}</Button>`

- The translate function should be called in the parent component and the child just renders the property as is:
  `<Button>{props.label}</Button>`

- Use the built in [interpolation functionality](https://www.i18next.com/translation-function/interpolation) instead of `.replace()` for example:

```ts
t("Plan_coMemberFee_label", {
  CoMemberFee: formatCurrency(amount),
  CoMemberFeeType: feeTypeLabel,
});
```

## Plurals

- Here is how you should manage translations with plurals. [Reference](https://www.i18next.com/translation-function/plurals)

`component.tsx`

```ts
t("asset__share_modal_title", {
  count: assets.length,
});
```

`en.json`

```json
{
  "asset__share_modal_title": "Share asset",
  "asset__share_modal_title_other": "Share assets"
}
```

- Do not do this in your `component.tsx`

```ts
{
  assets.length === 1
    ? t("asset__share_modal_title")
    : t("asset__share_modal_title_other");
}
```

## State

- When using useState, the set function should always be named `set[NameOfVariable]`

```ts
const [hasModification, setHasModification] = useState<boolean>(false);
```

## Skeletons

[Mui Skeleton](https://mui.com/components/skeleton)

- Skeletons should match the content about to be rendered as closely as possible
- Where possible use the same container elements for the skeletons as the content being rendered

## Styles

- All styling that affects basic MUI components should be in the theme
- Styling for specific component or specific container should be in proper styled component or proper `.scss` file
- Avoid inline styles on components at all costs
- All colors should be in theme.palette
- Use the MaterialUI Typography component for re-usable font styles which are defined in the theme
- Avoid `!important` at all costs, if it must be used, it must have a comment explaining why
- All media queries should be below the other styles of the same level, separated by a blank line
- Avoid using selectors for internal Material UI elements as they can change on upgrades, try to find other properties on the elements that reference those elements instead
- All style names must be in camel case format starting with a lowercase letter, ex: `listItem: { display: block; }`

## Responsiveness

- Always test using different screen sizes to check for layout issues
- The MaterialUI layout components have properties built for responsiveness, see their [official documentation](https://mui.com/material-ui/guides/responsive-ui/)
- `useMediaQuery` should only be used when css media queries would be significantly more work, since `useMediaQuery` is less efficient (it uses JavaScript and requires the component to re-render)

## Files

- The `tsx` extension should only be used when needed, if the file doesn't use the React syntax, it should be a ts file
- File name & case should match their default export For example a file that has a default export of:
  - A component called `AccessCard` should be called `AccessCard.tsx`
  - A hook called `useCustomerInfo` should be called `useCustomerInfo.ts`

## Order

- Try to keep the order of content between similar files consistent where possible
- Basic order of React component file contents:
  - Imports
  - Interfaces, types & enums
  - Variables
  - Functions
  - Styles
  - Private components
  - Public/exported components (typically only one)
- Basic order of React component content:
  - Hooks
  - Variables
  - Functions
  - Effects
  - Return
- Within the groups use alphabetical sorting when possible

## Misc

- Never use `dangerouslySetInnerHTML`
- Only use functionnal components.
- Business logic should be in the API instead of the client when possible
