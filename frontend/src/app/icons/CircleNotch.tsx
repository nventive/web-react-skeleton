import style from "@styles/style.module.scss";
import IIcon from "./IIcon";

export default function CircleNotch({
  className,
  color = style["primary-main"],
  width = 32,
  height = 32,
  alt = "Add Rounded",
}: IIcon) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{alt}</title>
      <path
        d="M13.9187 2.00625C14.2312 3.0625 13.6312 4.18125 12.575 4.49375C7.6125 5.975 4 10.5688 4 16C4 22.625 9.375 28 16 28C22.625 28 28 22.625 28 16C28 10.5688 24.3875 5.975 19.4312 4.49375C18.375 4.18125 17.7687 3.0625 18.0875 2.00625C18.4062 0.950001 19.5188 0.343751 20.575 0.662501C27.1813 2.63125 32 8.75 32 16C32 24.8375 24.8375 32 16 32C7.1625 32 0 24.8375 0 16C0 8.75 4.81875 2.63125 11.4312 0.662501C12.4875 0.350001 13.6062 0.950001 13.9187 2.00625Z"
        fill={color}
      />
    </svg>
  );
}
