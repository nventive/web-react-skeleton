# React Standards

## Code Formatting

- Use Prettier to format all TypeScript code.
- Configure your editor to format on save using Prettier (the VSCode settings provided in this template support this behavior).

## Designs

- Follow UI designs as closely as possible. If it's not feasible or too costly to match the design, the designer and developer should plan a meeting to discuss options.
- Most design tools have ways to inspect the design for values like colors and spacing. Currently, we use Figma, which has an Inspector tab on the right that provides this functionality.
- Sometimes an element may not be selectable with the inspector due to being hidden under another element. To access the element underneath, use the panel on the left to find your element.

## Functions

- Only use functions when necessary. For example:

> ```ts
> const showButton = (): boolean => {
>   return providerId === client.providerId;
> };
> ```

- Should be a constant variable: `const showButton = providerId === client.providerId;`
- Name callbacks after the event. For example, an `onClick` callback function should always start with "onClick": `onClick={onClickAmountOption}`
- Functions that aren't React components should be camel case: `onChange` not `OnChange`.
- Use arrow functions.
- Use normal functions for React components. (The benefit of lexical scope of `this` is not present for components.)

## Interfaces and Types

- Avoid `any` or `unknown` as much as possible.
- Use both `interfaces` and `types`, depending on the situation.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = { id: 1, name: "John Doe", email: "john.doe@gmail.com" };
```

- Use an `interface` to extend another `interface`:

```ts
interface Admin extends User {
  canDeleteUsers: boolean;
}

const adminUser: Admin = {
  id: 2,
  name: "Jane Doe",
  email: "jane.doe@gmail.com",
  canDeleteUsers: true,
};
```

- Use `type` when defining a complex type:

```ts
type ID = number | string;
type UserResponse = User | null;
type Dictionary<T> = { [key: string]: T };
```

- Use `type` when you want a simple `enum` using a string union. This results in easier type inference and can simplify usage for API endpoint return objects:

```ts
type Status = "success" | "info" | "warning" | "error";
```

## Labels

- Always pass labels between components as the translated value.
- Avoid code like the following where a property is being translated: `<Button>{t(props.label)}</Button>`
- The translate function should be called in the parent component, and the child should just render the property as is: `<Button>{props.label}</Button>`
- Use the built-in [interpolation functionality](https://www.i18next.com/translation-function/interpolation) instead of `.replace()`. For example:

```ts
t("Plan_coMemberFee_label", {
  CoMemberFee: formatCurrency(amount),
  CoMemberFeeType: feeTypeLabel,
});
```

## Plurals

- Manage translations with plurals as follows. [Reference](https://www.i18next.com/translation-function/plurals)

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

- Do not do this in your `component.tsx`:

```ts
{
  assets.length === 1
    ? t("asset__share_modal_title")
    : t("asset__share_modal_title_other");
}
```

## State

- When using `useState`, the set function should always be named `set[NameOfVariable]`:

```ts
const [hasModification, setHasModification] = useState<boolean>(false);
```

## Skeletons

[MUI Skeleton](https://mui.com/components/skeleton)

- Skeletons should match the content about to be rendered as closely as possible.
- Where possible, use the same container elements for the skeletons as the content being rendered.

Example:
Good

```tsx
<div className="my-container">
  {isFetchingData ? <Skeleton animation="wave" /> : <CustomImage src="..." />}
</div>
```

Wrong

```tsx
{
  isFetchingData ? (
    <div className="my-container">
      <Skeleton animation="wave" />
    </div>
  ) : (
    <div className="my-container">
      <CustomImage src="..." />
    </div>
  );
}
```

## Files

- The `tsx` extension should only be used when needed. If the file doesn't use the React syntax, it should be a `.ts` file.
- File names and cases should match their default export. For example, a file that has a default export of:
  - A component called `AccessCard` should be called `AccessCard.tsx`.
  - A hook called `useCustomerInfo` should be called `useCustomerInfo.ts`.

## Order

- Try to keep the order of content between similar files consistent where possible.
- Basic order of React component file contents:
  - Imports
  - Interfaces, types, and enums
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
- Within the groups, use alphabetical sorting when possible.

## Miscellaneous

- Never use `dangerouslySetInnerHTML`.
- Only use functional components.
- Business logic should be in the API instead of the client when possible.
