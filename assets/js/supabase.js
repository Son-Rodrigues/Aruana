// Configuração pública do Supabase.
// A chave publishable/anon pode aparecer no frontend.
// A segurança real deve ser feita com RLS e políticas no Supabase.

const SUPABASE_URL = "https://uyednawaykwiqotsnirw.supabase.co";
const SUPABASE_KEY = "sb_publishable_DoLcx_-J3eJ7c1yVeIByIQ_ve4b3QT4";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
