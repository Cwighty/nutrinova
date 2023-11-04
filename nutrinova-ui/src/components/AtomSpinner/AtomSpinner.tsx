"use client";
import styles from "./AtomSpinner.module.scss";
import { Box } from "@mui/material";
import { useTheme } from "@/context/ThemeContext";

export const AtomSpinner = () => {
  const { theme } = useTheme();
  const themeClass = theme === "dark" ? styles.darkTheme : styles.lightTheme;

  return (
    <Box className={`${styles.atomSpinner} ${themeClass}`}>
      <Box className={styles.spinnerInner}>
        <Box className={styles.spinnerLine} />
        <Box className={styles.spinnerLine} />
        <Box className={styles.spinnerLine} />
        <Box
          className={styles.spinnerCircle}
          component="img"
          src={
            theme === "dark"
              ? "/atomic-berries-white.svg"
              : "/atomic-berries-black.svg"
          }
        />
      </Box>
    </Box>
  );
};
