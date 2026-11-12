create table if not exists public.tutors (
  id text primary key,
  name text not null,
  headline jsonb not null,
  avatar text not null default '',
  city_id text not null,
  subject_ids text[] not null default '{}',
  price_per_hour integer not null check (price_per_hour between 10 and 2000),
  rating numeric(2, 1) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  verified boolean not null default false,
  published boolean not null default true,
  modes text[] not null default '{}',
  experience_years integer not null default 0 check (experience_years >= 0),
  bio jsonb not null,
  qualifications jsonb not null default '[]'::jsonb,
  available_days integer[] not null default '{0,1,2,3,4,5,6}',
  slots text[] not null default '{}',
  phone text not null default '',
  reviews jsonb not null default '[]'::jsonb,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint tutors_modes_valid check (modes <@ array['online', 'in_person']::text[])
);

create table if not exists public.bookings (
  id text primary key,
  tutor_id text not null references public.tutors(id) on delete cascade,
  student_id text not null,
  student_user_id uuid references auth.users(id) on delete set null,
  student_name text not null,
  student_phone text not null,
  date date not null,
  time text not null,
  mode text not null check (mode in ('online', 'in_person')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists bookings_tutor_date_idx on public.bookings (tutor_id, date, time);
create index if not exists bookings_student_user_idx on public.bookings (student_user_id);
create index if not exists tutors_owner_id_idx on public.tutors (owner_id);

alter table public.tutors enable row level security;
alter table public.bookings enable row level security;

revoke all on public.tutors from anon, authenticated;
revoke all on public.bookings from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select (id, name, headline, avatar, city_id, subject_ids, price_per_hour, rating, review_count, verified, published, modes, experience_years, bio, qualifications, available_days, slots, reviews, created_at) on public.tutors to anon;
grant select (id, name, headline, avatar, city_id, subject_ids, price_per_hour, rating, review_count, verified, published, modes, experience_years, bio, qualifications, available_days, slots, reviews, owner_id, created_at) on public.tutors to authenticated;
grant insert (id, name, headline, avatar, city_id, subject_ids, price_per_hour, published, modes, experience_years, bio, qualifications, available_days, slots, phone, reviews) on public.tutors to anon;
grant insert (id, name, headline, avatar, city_id, subject_ids, price_per_hour, published, modes, experience_years, bio, qualifications, available_days, slots, phone, reviews, owner_id) on public.tutors to authenticated;
grant update on public.tutors to authenticated;
grant select, insert on public.bookings to authenticated;
grant insert (id, tutor_id, student_id, student_name, student_phone, date, time, mode) on public.bookings to anon;
grant insert (id, tutor_id, student_id, student_user_id, student_name, student_phone, date, time, mode) on public.bookings to authenticated;
grant update (status) on public.bookings to authenticated;

drop policy if exists tutors_public_read on public.tutors;
create policy tutors_public_read on public.tutors
  for select to anon, authenticated
  using (published or owner_id = (select auth.uid()));

drop policy if exists tutors_public_insert on public.tutors;
create policy tutors_public_insert on public.tutors
  for insert to anon, authenticated
  with check (
    not verified
    and rating = 0
    and review_count = 0
    and (owner_id is null or owner_id = (select auth.uid()))
  );

drop policy if exists tutors_owner_update on public.tutors;
create policy tutors_owner_update on public.tutors
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists bookings_participant_read on public.bookings;
create policy bookings_participant_read on public.bookings
  for select to authenticated
  using (
    student_user_id = (select auth.uid())
    or exists (
      select 1 from public.tutors t
      where t.id = bookings.tutor_id and t.owner_id = (select auth.uid())
    )
  );

drop policy if exists bookings_public_insert on public.bookings;
create policy bookings_public_insert on public.bookings
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and (
      ((select auth.uid()) is null and student_user_id is null)
      or student_user_id = (select auth.uid())
    )
  );

drop policy if exists bookings_participant_status_update on public.bookings;
create policy bookings_participant_status_update on public.bookings
  for update to authenticated
  using (
    status = 'pending'
    and (
      student_user_id = (select auth.uid())
      or exists (
        select 1 from public.tutors t
        where t.id = bookings.tutor_id and t.owner_id = (select auth.uid())
      )
    )
  )
  with check (
    (
      status = 'cancelled'
      and student_user_id = (select auth.uid())
    )
    or (
      status in ('accepted', 'declined')
      and exists (
        select 1 from public.tutors t
        where t.id = bookings.tutor_id and t.owner_id = (select auth.uid())
      )
    )
  );

insert into public.tutors (
  id, name, headline, avatar, city_id, subject_ids, price_per_hour, rating,
  review_count, verified, published, modes, experience_years, bio,
  qualifications, available_days, slots, phone, reviews
) values (
  'featured-el-houcine-miftah',
  'El Houcine Miftah (الحسين مفتاح)',
  '{"ar":"دراسات اللغة الإنجليزية ومحادثة الكبار A1–B2 والتحضير للاختبارات","fr":"Études anglaises, conversation adulte A1–B2 et préparation aux examens","en":"English Studies, A1–B2 adult conversation and exam prep"}'::jsonb,
  '',
  'casablanca',
  array['english'],
  150,
  5,
  0,
  true,
  true,
  array['online', 'in_person'],
  3,
  '{"ar":"مدرّس إنجليزية بخبرة تتجاوز 3 سنوات في مراكز لغات خاصة بالدار البيضاء. أختص في تواصل البالغين من A1 إلى B2، وبناء الثقة في التحدث العملي، والتدريب الفردي المخصص.","fr":"Formateur en anglais avec plus de 3 ans d’expérience dans des centres de langues privés à Casablanca. Spécialisé dans la communication pour adultes A1–B2, l’aisance à l’oral et le coaching individuel personnalisé.","en":"English tutor with 3+ years of experience at private language centers in Casablanca. I specialize in A1–B2 adult communication, practical speaking confidence, and personalized one-to-one coaching."}'::jsonb,
  '[]'::jsonb,
  array[0, 1, 2, 3, 4, 5, 6],
  array['10:00', '14:00', '17:00', '19:00'],
  '',
  '[]'::jsonb
)
on conflict (id) do nothing;

insert into public.tutors (
  id, name, headline, city_id, subject_ids, price_per_hour, rating,
  review_count, verified, published, modes, experience_years, bio
) values
  ('t1', 'Salma Berrada', jsonb_build_object('ar', 'رياضيات وفيزياء وتحضير للبكالوريا', 'fr', 'Mathématiques et physique, préparation au bac', 'en', 'Maths and physics, baccalaureate preparation'), 'casablanca', array['maths', 'physics'], 150, 4.9, 124, true, true, array['online', 'in_person'], 8, jsonb_build_object('ar', 'أستاذة رياضيات وفيزياء بخبرة تزيد على ثماني سنوات.', 'fr', 'Professeure de mathématiques et de physique avec plus de huit ans d’expérience.', 'en', 'Maths and physics tutor with over eight years of experience.')),
  ('t2', 'Youssef El Amrani', jsonb_build_object('ar', 'الإنجليزية والفرنسية والتحضير لاختبارات IELTS وTOEFL', 'fr', 'Anglais et français, préparation IELTS et TOEFL', 'en', 'English and French, IELTS and TOEFL preparation'), 'rabat', array['english', 'french'], 120, 4.8, 89, true, true, array['online'], 6, jsonb_build_object('ar', 'مدرّس لغة إنجليزية وفرنسية متخصص في IELTS وTOEFL.', 'fr', 'Formateur en anglais et en français, spécialisé dans la préparation IELTS et TOEFL.', 'en', 'English and French tutor specialising in IELTS and TOEFL preparation.')),
  ('t3', 'Imane Tazi', jsonb_build_object('ar', 'الكيمياء وعلوم الحياة والأرض للتعليم الثانوي', 'fr', 'Chimie et sciences de la vie et de la terre au lycée', 'en', 'High-school chemistry and life sciences'), 'marrakech', array['chemistry', 'biology'], 100, 4.7, 56, false, true, array['in_person'], 5, jsonb_build_object('ar', 'أستاذة كيمياء وعلوم الحياة والأرض للتعليم الثانوي.', 'fr', 'Professeure de chimie et de SVT au lycée.', 'en', 'High school chemistry and biology teacher.')),
  ('t4', 'Karim Idrissi', jsonb_build_object('ar', 'بايثون وتطوير المواقع وتحليل البيانات', 'fr', 'Python, développement web et analyse de données', 'en', 'Python, web development and data analysis'), 'casablanca', array['computer', 'maths'], 200, 4.9, 40, true, true, array['online'], 7, jsonb_build_object('ar', 'مهندس برمجيات يدرّس بايثون وتطوير المواقع وتحليل البيانات.', 'fr', 'Ingénieur logiciel, il enseigne Python, le développement web et l’analyse de données.', 'en', 'Software engineer teaching Python, web development and data analysis.')),
  ('t5', 'Nadia Chraibi', jsonb_build_object('ar', 'اللغة العربية والفرنسية للتعليم الابتدائي والإعدادي', 'fr', 'Arabe et français pour le primaire et le collège', 'en', 'Arabic and French for primary and middle school'), 'fes', array['arabic', 'french'], 80, 4.6, 33, false, true, array['online', 'in_person'], 4, jsonb_build_object('ar', 'أستاذة لغة عربية وفرنسية للتعليم الابتدائي والإعدادي.', 'fr', 'Professeure d’arabe et de français pour le primaire et le collège.', 'en', 'Arabic and French teacher for primary and middle school.')),
  ('t6', 'Othmane Bennani', jsonb_build_object('ar', 'الفيزياء والرياضيات بأسلوب عملي', 'fr', 'Physique et mathématiques avec une approche concrète', 'en', 'Physics and maths with a practical approach'), 'tangier', array['physics', 'maths'], 90, 4.5, 21, false, true, array['online', 'in_person'], 3, jsonb_build_object('ar', 'مهندس يدرّس الفيزياء والرياضيات للتعليم الثانوي.', 'fr', 'Ingénieur qui enseigne la physique et les maths au lycée.', 'en', 'Engineer teaching physics and maths in high school.')),
  ('t7', 'Hajar Filali', jsonb_build_object('ar', 'الإنجليزية للمبتدئين والطلاب', 'fr', 'Anglais pour débutants et élèves', 'en', 'English for beginners and school students'), 'agadir', array['english'], 70, 4.4, 18, false, true, array['in_person'], 2, jsonb_build_object('ar', 'أستاذة إنجليزية للمبتدئين والتلاميذ.', 'fr', 'Professeure d’anglais pour débutants et élèves.', 'en', 'English tutor for beginners and school students.')),
  ('t8', 'Mehdi Alaoui', jsonb_build_object('ar', 'الرياضيات والتحضير للمدارس الهندسية', 'fr', 'Mathématiques et préparation aux écoles d’ingénieurs', 'en', 'Maths and engineering school preparation'), 'rabat', array['maths'], 130, 4.8, 65, true, true, array['online', 'in_person'], 10, jsonb_build_object('ar', 'أستاذ رياضيات بخبرة عشر سنوات في الثانوي والتحضير للمدارس الهندسية.', 'fr', 'Professeur de mathématiques avec dix ans d’expérience au lycée et en classes préparatoires.', 'en', 'Maths teacher with ten years of experience in high school and engineering school preparation.'))
on conflict (id) do nothing;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tutors'
    ) then
      alter publication supabase_realtime add table public.tutors;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bookings'
    ) then
      alter publication supabase_realtime add table public.bookings;
    end if;
  end if;
end;
$$;
