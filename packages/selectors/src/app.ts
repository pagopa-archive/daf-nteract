import { AppState } from "@nteract/types";

/**
 * Returns the version of the nteract application.
 */
export const appVersion = (state: AppState) => state.app.version;

/**
 * Returns the notification system currently configured on the nteract application.
 * This can be used to display informational or error-related alerts to the user.
 */
export const notificationSystem = (state: AppState) =>
  state.app.get("notificationSystem");
