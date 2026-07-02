{/*
  UiKit block snippet — paste inside the <div className="flex-column mt-lg gap-md">
  container in frontend/src/app/pages/uikit/UiKit.tsx, after the existing sibling
  <UikitBlock> nodes.

  - id: stable lowercase slug (no spaces). Used as the DOM anchor and side-nav target.
  - title: matches the component file name including extension (e.g. "Chip.tsx").
  - codeBlock: smallest useful usage as a template literal. Omit only when the
    component isn't reasonably code-demonstrable.

  Add multiple <UikitBlock> siblings (or group inside one block) to show
  meaningful variants: empty / with data / disabled / error / colored. See how
  FieldHelperText demonstrates both empty and error states in UiKit.tsx.

  Remember to add the wrapper import at the top of UiKit.tsx using the alias:
    import __Name__ from "@components/__name__/__Name__";
*/}

<UikitBlock
  id="__name__"
  title="__Name__.tsx"
  codeBlock={`<__Name__ />`}
>
  <__Name__ />
</UikitBlock>
