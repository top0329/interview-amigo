"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";
import { useAuth } from "@clerk/nextjs";
import supabaseClient from "@/utils/supabase/supabaseClient";

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  const [supabase, setSupabase] = useState();

  const { isSignedIn } = useAuth();
  const container =
    typeof window !== "undefined" ? window?.Clerk?.session : null;

  const initializeSupabase = () => {
    setSupabase(supabaseClient);
  };

  const handleSupabaseSignOut = async () => {
    if (!isSignedIn) {
      await supabase?.auth.signOut();
      setSupabase(null);
    }
  };

  useEffect(() => {
    handleSupabaseSignOut();
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn && container) {
      initializeSupabase();
    }
  }, [supabaseClient, container]);

  const value = useMemo(() => ({ supabase }), [supabase]);

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

const useSupabase = () => {
  const { supabase } = useContext(SupabaseContext);

  // if (supabase === undefined) {
  //   // TODO error handling
  //   throw new Error("Supabase connection failed.");
  // }

  return supabase;
};

export default useSupabase;
