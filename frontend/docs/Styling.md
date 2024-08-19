# Styling

There is multiple ways to go about styling in a react project.
This will explain to you the standard we propose to your project.

> If any of this does not fit the team working on the project, please feel free to change it and to update this file to reflect the standard in the project

## .scss files

The main way you will be styling your components, will be by creating a new `.scss` file in the same directory as your component.
For example, if you have an `Admin.tsx` component, you would create an `admin.scss` file and import it in your `.tsx`
Here is a short code snippet showing how it would look like:

> Please follow the [BEM standards](https://getbem.com/naming/) for you class naming convention

```tsx
import "./admin.scss";

export const Admin = () => {
  return <div className="admin">...</div>;
};
```

```scss
.admin {
  display: flex;
  flex-direction: column;
  gap: get-spacing(xs);
  background-color: get-color(primary, main);
}
```

We also created a couple of utility `.scss` classes that you would be able to use.
They are mainly meant to be used as spacing classes.
See them in the `/frontend/src/styles` directory.

Here is the example from above but using the utility classes

```tsx
import "./admin.scss";

export const Admin = () => {
  return <div className="admin flex-col gap-xs">...</div>;
};
```

```scss
.admin {
  background-color: get-color(primary, main);
}
```

> You are not forced to use any of the spacing classes, but with our experience, we find it usefull to be able to quickly align items using these

## Styled components (MUI)

When you want to change a component coming from MUI, we recommend that you create a styled component of it inside the components folder.
You should go look at the `Button.tsx` component to see an example.

This allows us to have the same styling for every button in the app, without messing with MUI theme.
You can still go and change components everywhere by changing it in `createTheme`, but we found that in most cases, when the app grows, it can cause a lot of annoying bugs.

## SX (MUI)

You have probably done something similar in the past

```tsx
export const Example = () => {
  return <Box sx={{display: flex, flex-direction: "column", etc...}}>...</div>;
};
```

We do not recommend you using that, and would point you toward using a simple div and style it with our utility classes.
