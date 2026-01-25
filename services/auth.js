import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [session, setSession] = useState(null);
  const [event, setEvent] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const checkSession = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      setSession(activeSession ?? null);
      setUser(activeSession?.user ?? null);
      setLoading(false);
    };

    checkSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
      setEvent(event ?? null);
      setLoading(false);
      //console.log(session);
      //console.log(session?.user);

      if (event === "SIGNED_OUT") {
        console.log("SIGNED_OUT", session);
        // clear local and session storage
        [localStorage, sessionStorage].forEach((storage) => {
          if (storage?.length > 0) {
            Object.entries(storage).forEach(([key]) => {
              storage.removeItem(key);
            });
          }
        });
      }
    });

    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);

  // Will be passed down to Signup, Login and Dashboard components
  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    updateUser: (data) => supabase.auth.updateUser(data),
    user,
    session,
    event,
    authLoading: loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
