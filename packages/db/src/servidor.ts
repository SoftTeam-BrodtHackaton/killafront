import { createServerClient } from "@supabase/ssr";

type Cookies = {
  getAll: () => { name: string; value: string }[];
  setAll: (c: { name: string; value: string; options?: object }[]) => void;
};

/** El caller pasa el store de cookies de Next para no acoplar el paquete al framework
 *  (Expo lo usará con un adaptador distinto). */
export function clienteServidor(cookies: Cookies) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies },
  );
}
