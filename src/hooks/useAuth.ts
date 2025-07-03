import { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";

export function useAuth() {
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
