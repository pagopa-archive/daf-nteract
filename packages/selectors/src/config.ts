import { AppState } from "@nteract/types";

/**
 * Returns the theme of the notebook. Returns "light" if no theme is defined.
 *
 * @param   state   The state of the nteract application
 *
 * @returns         The theme of the nteract application
 */
export const userTheme = (state: AppState): string =>
  state.config.get("theme", "light");

/**
 * Returns the theme of the notebook. Returns "light" if no theme is defined.
 * This is an alias for the `userTheme` selector.
 *
 * @param   state   The state of the nteract application
 *
 * @returns         The theme of the nteract application
 */
export const currentTheme = userTheme;

/**
 * Returns the auto-save interval to be used in the notebook. Returns an
 * interval around the two minute range if one is not provided in the config.
 */
export const autoSaveInterval = (state: AppState): number => {
  const DEFAULT_AUTOSAVE_INTERVAL_MS = 120000;
  return state.config.get("autoSaveInterval", DEFAULT_AUTOSAVE_INTERVAL_MS);
};
