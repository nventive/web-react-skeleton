import IIcon from "./IIcon";

export default function CaretIcon({
  className,
  width = 24,
  height = 24,
  alt = "Caret Icon",
}: IIcon) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{alt}</title>
      <path
        d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z"
        sx={(theme) => ({
          fill: theme.palette.grey[800],
        })}
      />
    </svg>
  );
}
