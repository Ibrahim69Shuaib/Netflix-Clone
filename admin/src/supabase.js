import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "supabaseURL";
const supabaseKey = "supabaseAPI_Key";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
