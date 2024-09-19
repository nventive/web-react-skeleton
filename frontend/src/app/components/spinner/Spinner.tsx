import classes from "./spinner.module.css";

export default function Spinner() {
  return (
    <span
      sx={(theme) => ({
        backgroundImage: `linear-gradient(${theme.palette.primary.main} 16px,transparent 0),
          linear-gradient(${theme.palette.primary.main} 16px, transparent 0),
          linear-gradient(${theme.palette.primary.main} 16px, transparent 0),
          linear-gradient(${theme.palette.primary.dark} 16px, transparent 0)`,
      })}
      className={classes["spinner"]}
    />
  );
}
