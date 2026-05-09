-- PROYECTO: APP_TASK
-- ESQUEMA SQL PARA SUPABASE

-- 1. Tabla de Perfiles (profiles)
-- Esta tabla se vincula automáticamente con la tabla auth.users de Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Tabla de Tareas (todos)
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  evidence_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Seguridad para Profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5. Políticas de Seguridad para Todos
CREATE POLICY "Users can view their own tasks" ON public.todos
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own tasks" ON public.todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON public.todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.todos
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Función y Trigger para crear perfil automáticamente al registrarse
-- Nota: Asegúrate de pasar 'username' en los metadatos del registro (options.data)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Storage: Bucket para avatares
-- Nota: Esto usualmente se hace desde el dashboard de Supabase, 
-- pero aquí están las políticas para el bucket 'avatars' (debe existir)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar." ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar." ON storage.objects
  FOR UPDATE USING (auth.uid() = owner);

-- 8. Storage: Bucket para evidencia de tareas
-- Nota: Crear el bucket desde el dashboard de Supabase
-- INSERT INTO storage.buckets (id, name, public) VALUES ('task-evidence', 'task-evidence', true);

CREATE POLICY "Evidence images are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'task-evidence');

CREATE POLICY "Users can upload evidence." ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'task-evidence');

CREATE POLICY "Users can update their own evidence." ON storage.objects
  FOR UPDATE USING (auth.uid() = owner);
