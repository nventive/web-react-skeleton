import i18next from "@shared/i18n";
import { useUserStore } from "@stores/userStore";
import { createSearchParams, redirectDocument } from "react-router";

export const clientLoaderAuthGuard = (
  includeRedirectPath?: boolean,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { user } = useUserStore.getState();

    if (user) {
      resolve();
      return;
    }

    if (!includeRedirectPath) {
      reject(redirectDocument(`/${i18next.language}/login`));
      return;
    }

    if (includeRedirectPath) {
      // adds redirect search param to the url so, once logged in, user is redirected to the page they were trying to access
      const url = new URL(window.location.href);
      const redirectUrl = url.pathname + url.search;
      const parsedRedirectUrl = createSearchParams({ redirect: redirectUrl });
      const loginUrlWithRedirect = `/${i18next.language}/login?${parsedRedirectUrl.toString()}`;

      reject(redirectDocument(loginUrlWithRedirect));
    }
  });
};
