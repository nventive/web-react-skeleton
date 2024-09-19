import IIcon from "./IIcon";

export default function ExternalLinkOutlined({
  className,
  width = 16,
  height = 16,
  alt = "External Link Outlined",
}: IIcon) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{alt}</title>
      <path
        d="M2.66667 2C2.29848 2 2 2.29848 2 2.66667V13.3333C2 13.7015 2.29848 14 2.66667 14H13.3333C13.7015 14 14 13.7015 14 13.3333V11.6667C14 11.2985 13.7015 11 13.3333 11H13.1667C12.7985 11 12.5 11.2985 12.5 11.6667V12.5H3.5V3.5H4.33333C4.70152 3.5 5 3.20152 5 2.83333V2.66667C5 2.29848 4.70152 2 4.33333 2H2.66667ZM9.60948 2C9.01554 2 8.71809 2.71809 9.13807 3.13807L10.25 4.25L6.9714 7.5286C6.71105 7.78895 6.71105 8.21106 6.9714 8.4714L7.5286 9.0286C7.78895 9.28895 8.21106 9.28895 8.4714 9.0286L11.75 5.75L12.8619 6.86193C13.2819 7.28191 14 6.98446 14 6.39052V2.66667C14 2.29848 13.7015 2 13.3333 2H9.60948Z"
        sx={(theme) => ({
          fill: theme.palette.primary.main,
        })}
      />
    </svg>
  );
}
