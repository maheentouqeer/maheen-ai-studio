import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSupabaseData<T = any>(table: string, columns: string = "*") {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: result, error } = await (supabase.from as any)(table).select(columns);
        if (error) throw error;
        setData(result || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, columns]);

  return { data, loading, error };
}