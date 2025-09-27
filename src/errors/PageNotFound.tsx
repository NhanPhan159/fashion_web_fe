import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";



export const PageNotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const prevRoutePathname = location.state?.prevRoute?.pathname;

  if (prevRoutePathname) {
    window.history.replaceState(
      {},
      "Page Not Found",
      location.state.prevRoute.pathname,
    );
  }

  return (
    <div>Page not found</div>
  );
};