# Styling

There are multiple ways to go about styling in a React project.  
This will explain the standard we propose for your project.

> If any of this does not fit the team working on the project, please feel free to change it and update this file to reflect the standard in the project.

## .module.css files

We recommend using CSS modules as much as possible. CSS modules help in:

- **Scoping**: CSS modules automatically scope CSS by generating unique class names. This prevents styles from leaking into other components and avoids naming conflicts.
- **Maintainability**: With scoped styles, it's easier to maintain and update styles without worrying about affecting other parts of the application.
- **Modularity**: CSS modules promote modularity, making it easier to reason about and manage styles for individual components.

## Styles

- All styling that affects basic MUI components should be in the theme.
- Styling for specific components or specific containers should be in proper styled components or proper `.module.css` files.
- Avoid inline styles on components at all costs.
- All colors should be in `theme.palette`.
- Use the MaterialUI Typography component for reusable font styles defined in the theme.
- Avoid `!important` at all costs. If it must be used, it must have a comment explaining why.
- All media queries should be below the other styles of the same level, separated by a blank line.
- MUI has been configured to expose its properties as CSS variables. Use them as much as possible.

## Responsiveness

- Always test using different screen sizes to check for layout issues.
- The MaterialUI layout components have properties built for responsiveness. See their [official documentation](https://mui.com/material-ui/guides/responsive-ui/).
- `useMediaQuery` should only be used when CSS media queries would be significantly more work, as `useMediaQuery` is less efficient (it uses JavaScript and requires the component to re-render).

## Styled Components (MUI)

When you want to change a component coming from MUI, we recommend that you create a styled component of it inside the components folder.
You should look at the `Button.tsx` component to see an example.

This allows us to have the same styling for every button in the app, without messing with the MUI theme.
You can still change components everywhere by modifying them in `createTheme`, but we found that in most cases, when the app grows, it can cause a lot of annoying bugs.
