import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { PageNotFound } from "./errors";
import { useErrorHandler } from "./hooks";
import { AppError } from "./types";
import { Path } from "./constants";
import { Admin, Login, Register, ShowcasePage } from "./modules";
import { Footer, Header } from "./layouts";
import { authService } from '@/services/auth';
import { User } from '@supabase/supabase-js';
import Clothes from "./modules/clothes/Clothes";

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const { handleError } = useErrorHandler();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userSession = await authService.getSession();
        setSession(userSession);
      } catch (err) {
        setError(err as AppError);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [location]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error || !session) {
    handleError(error || { message: 'Authentication failed' } as AppError);
    return <Navigate to={Path["Login"]} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

const UnauthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userSession = await authService.getSession();
        setSession(userSession);
      } catch {
        // No session
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="hide-scrollbar overflow-y-auto">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

const AuthorizedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userSession = await authService.getSession();
        setSession(userSession);
      } catch {
        // No session
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return <Navigate to={Path["Login"]} replace />;
  }

  const userRole = session.user_metadata?.role as string || '';
  if (userRole !== 'admin') {
    authService.signOut().catch(console.error);
    return <Navigate to={Path["Login"]} replace state={{ error: 'Access denied. Admin role required.' }} />;
  }

  return <>{children}</>;
};

function Router() {
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
          path={Path["Login"]}
          element={
            <UnauthenticatedRoute>
              <Login />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path={Path["Clothes"]}
          element={
            <UnauthenticatedRoute>
              <Clothes />
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
    </div>
  );
}

export default Router;