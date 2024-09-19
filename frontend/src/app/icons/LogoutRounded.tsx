import IIcon from "./IIcon";

export default function LogoutRounded({
  className,
  width = 24,
  height = 24,
  alt = "Logout Rounded",
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
        d="M5 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H11C11.55 21 12 20.55 12 20C12 19.45 11.55 19 11 19H5V5Z"
        sx={(theme) => ({
          fill: theme.palette.common.white,
        })}
      />
      <path
        d="M20.65 11.65L17.86 8.86003C17.54 8.54003 17 8.76003 17 9.21003V11H10C9.45 11 9 11.45 9 12C9 12.55 9.45 13 10 13H17V14.79C17 15.24 17.54 15.46 17.85 15.14L20.64 12.35C20.84 12.16 20.84 11.84 20.65 11.65Z"
        sx={(theme) => ({
          fill: theme.palette.common.white,
        })}
      />
    </svg>
  );
}
