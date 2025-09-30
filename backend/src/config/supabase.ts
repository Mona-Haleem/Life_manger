import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "./environment.js";
console.log('Environment Variables in supab:', config??'No config loaded');

console.log("Supabase Config:", {
  url: config.supabase.url,
  serviceRoleKey: config.supabase.serviceRoleKey ? "****" : null, // Hide actual key
});
export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey
);
// class SupabaseConfig {
//   private static instance: SupabaseClient;

//   public static getInstance(): SupabaseClient {
//     if (!SupabaseConfig.instance) {
//       SupabaseConfig.instance = createClient(
//         config.supabase.url,
//         config.supabase.serviceRoleKey
//       );
//     }
//     return SupabaseConfig.instance;
//   }

//   public static getClientInstance(token: string): SupabaseClient {
//     return createClient(config.supabase.url, config.supabase.anonKey, {
//       global: {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     });
//   }
// }
// export const supabase = SupabaseConfig.getInstance();
// export default SupabaseConfig;
