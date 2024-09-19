import IIcon from "./IIcon";

export default function CloseIcon({
  className,
  width = 24,
  height = 24,
  alt = "Close Icon",
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
        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        sx={(theme) => ({
          fill: theme.palette.grey[800],
        })}
      />
    </svg>
  );
}
