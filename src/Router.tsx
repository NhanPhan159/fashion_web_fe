import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { PageNotFound } from "./errors";
import { hasPermission, i18n } from "./utils";
import { useGlobalStore } from "./store";
import { useErrorHandler } from "./hooks";
import { AppError } from "./types";
import { Role } from "./enums";
import { Path } from "./constants";
import { Admin, Login, Register, ShowcasePage } from "./modules";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

const parseJwt = (accessToken: string) => {
  try {
    return JSON.parse(atob(accessToken.split(".")[1]));
  } catch (e) {
    return <></>;
  }
};

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  //   const {
  //     value: { currentUser },
  //     actions: { clearStore, fetchCurrentUser },
  //   } = useGlobalStore();
  const currentUser = null;
  const fetchCurrentUser = () => {};
  const clearStore = () => {};

  const location = useLocation();
  const { handleError } = useErrorHandler();
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [isAccessTokenExpired, setIsAccessTokenExpired] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [fetchingCurrentUser, setFetchingCurrentUser] = useState(true);

  useEffect(() => {
    if (document.cookie) {
      localStorage.setItem("accessToken", document.cookie.split("=")[1]);
      console.log("local", document.cookie);
      setAccessToken(document.cookie.split("=")[1]);
    }
  }, [document.cookie]);

  useEffect(() => {
    const decodedJwt = parseJwt(accessToken);

    if (!decodedJwt || decodedJwt.exp * 1000 < Date.now()) {
      setIsAccessTokenExpired(true);
    }
  }, [accessToken, location]);

  useEffect(() => {
    (async () => {
      if (accessToken && !currentUser) {
        try {
          await fetchCurrentUser();
        } catch (error) {
          setError(error as AppError);
        } finally {
          setFetchingCurrentUser(false);
        }
      } else {
        setFetchingCurrentUser(false);
      }
    })();
  }, [accessToken, currentUser]);

  useEffect(() => {
    (async () => {
      if (isAccessTokenExpired) {
        localStorage.removeItem("accessToken");
        clearStore();
      }
    })();
  }, [isAccessTokenExpired]);

  if (fetchingCurrentUser) {
    return <div>Loading</div>;
  }

  if (error) {
    handleError(error);

    return <Navigate to={Path["Login"]} replace />;
  }

  if (!currentUser && !accessToken) {
    return <Navigate to={Path["Public"]} replace />;
  }

  return children;
};

const UnauthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    return <Navigate to={Path["Root"]} replace />;
  }

  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

const AuthorizedRoute = ({ children }: { children: React.ReactNode }) => {
  //   const {
  //     value: { currentUser },
  //   } = useGlobalStore();
  const currentUser = null;

  if (!currentUser) {
    return <Navigate to={Path["Login"]} replace />;
  }

  // if (!hasPermission([currentUser.role as Role], [Role.Admin])) {
  //   return <Navigate to={Path["PermissionDenied"]} replace />;
  // }

  return children;
};

function Router() {
  // useEffect(() => {
  //   const loadLanguage = async () => {
  //     await i18n.changeLanguage("en-US");
  //   };

  //   loadLanguage();
  // }, []);

  return (
    <div>
      <Routes>
        <Route
          path={Path["Root"]}
          element={
            <UnauthenticatedRoute>
              <ShowcasePage />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path={Path["Register"]}
          element={
            <UnauthenticatedRoute>
              <Register />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path={Path["Admin"].index}
          element={
            <AuthenticatedRoute>
              <AuthorizedRoute>
                <Admin />
              </AuthorizedRoute>
            </AuthenticatedRoute>
          }
        >
          <Route index element={<div />} />
          <Route path={Path.Admin.children.dashBoard} element={<div />} />
        </Route>
        <Route path={Path["PageNotFound"]} element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default Router;
