-- ============================================================
-- MeatHub V4 — Seed Data
-- Run AFTER schema_v4.sql
-- ============================================================

-- Wipe all data (order: children first)
truncate order_items, group_participants, orders, group_products, groups cascade;
truncate products cascade;
truncate branches cascade;
truncate importers cascade;

-- ============================================================
-- IMPORTERS (8)
-- ============================================================
insert into importers (slug, name, origin, origin_en, rating, company_id, contact_info, address)
values
  ('imp_lachovitz', 'נחמיה לחוביץ',    'ישראל', 'Israel', 4.9, '510001111', 'orders@lachovitz.co.il', 'חולון, המלאכה 10'),
  ('imp_ben_bakar', 'בן בקר',           'ישראל', 'Israel', 4.8, '510002222', 'sales@benbakar.co.il',   'חיפה, אזור תעשייה מפרץ'),
  ('imp_feldman',   'פלדמן',            'ישראל', 'Israel', 4.7, '510003333', 'import@feldman.co.il',   'אשדוד, העורף הרשמי 2'),
  ('imp_eit_ran',   'עת רן',            'ישראל', 'Israel', 4.6, '510004444', 'orders@eitran.co.il',    'פתח תקווה, היצירה 5'),
  ('imp_neto',      'נטו מלינדה',       'ישראל', 'Israel', 4.5, '510005555', 'imports@neto.co.il',     'קרית מלאכי, אזור תעשייה'),
  ('imp_baladi',    'בלדי',             'ישראל', 'Israel', 4.6, '510006666', 'b2b@baladi.co.il',       'עמק חפר, פארק תעשיות'),
  ('imp_dabbah',    'סאלח דבאח ובניו', 'ישראל', 'Israel', 4.8, '510007777', 'meat@dabbah.co.il',      'דיר אל אסד'),
  ('imp_marindo',   'מרינדו',           'ישראל', 'Israel', 4.9, '510008888', 'sales@marindo.co.il',    'עין גב, רמת הגולן')
on conflict (slug) do update set
  name         = excluded.name,
  rating       = excluded.rating,
  contact_info = excluded.contact_info,
  address      = excluded.address;

-- ============================================================
-- BRANCHES (8)
-- ============================================================
insert into branches (name, city, region, address, opening_hours, phone)
values
  -- מרכז/גוש דן
  ('דוכן שוק הכרמל',    'תל אביב',      'מרכז/גוש דן', 'שוק הכרמל 23',       'ו'': 08:00-15:00', '050-1112233'),
  ('מתחם שרונה',         'תל אביב',      'מרכז/גוש דן', 'קלמן מגן 3',          'ה'': 10:00-20:00', '050-2223344'),
  ('אזור תעשייה חדש',   'ראשון לציון',  'מרכז/גוש דן', 'משה לוי 10',          'ו'': 09:00-14:00', '052-3334455'),
  -- שרון
  ('אזור תעשייה פיתוח', 'הרצליה',       'שרון',        'שד'' בן גוריון 12',   'ה'': 16:00-20:00', '054-5556677'),
  ('מתחם פולג',          'נתניה',        'שרון',        'גיבורי ישראל 5',      'ו'': 08:00-13:00', '053-7778899'),
  -- צפון
  ('העיר התחתית',        'חיפה',         'צפון',        'דרך העצמאות 40',      'ה'': 15:00-19:00', '050-9990011'),
  -- ירושלים
  ('שוק מחנה יהודה',    'ירושלים',      'ירושלים',     'עץ חיים 15',          'ו'': 08:00-14:00', '052-2223344'),
  -- דרום
  ('העיר העתיקה',        'באר שבע',      'דרום',        'קק"ל 30',             'ה'': 16:00-20:00', '054-4445566');

-- ============================================================
-- PRODUCTS (70 cuts)
-- ============================================================

-- ── imp_lachovitz → Las Piedras, אורוגוואי (10 cuts) ─────────
insert into products (slug, cut_number, name, producer, origin_country, marbling_score, category, price_retail, price_group, importer_id)
values
  ('p_entrecote_las_piedras', 1,  'אנטריקוט / ורד הצלע',    'Las Piedras', 'אורוגוואי', '8', 'סטייקים',      240, 160, (select id from importers where slug='imp_lachovitz')),
  ('p_chuck_las_piedras',     2,  'אונטריב / עורף',          'Las Piedras', 'אורוגוואי', '6', 'בישול ארוך',   110,  65, (select id from importers where slug='imp_lachovitz')),
  ('p_brisket_las_piedras',   3,  'חזה / בריסקט',            'Las Piedras', 'אורוגוואי', '6', 'עישון',        130,  75, (select id from importers where slug='imp_lachovitz')),
  ('p_shoulder_las_piedras',  4,  'כתף מרכזי',               'Las Piedras', 'אורוגוואי', '4', 'בישול ארוך',   120,  70, (select id from importers where slug='imp_lachovitz')),
  ('p_roast_las_piedras',     5,  'צלי כתף',                 'Las Piedras', 'אורוגוואי', '5', 'קדירה',        140,  85, (select id from importers where slug='imp_lachovitz')),
  ('p_ossubuco_las_piedras',  8,  'שריר קדמי / אוסובוקו',   'Las Piedras', 'אורוגוואי', '5', 'קדירה',         90,  55, (select id from importers where slug='imp_lachovitz')),
  ('p_asado_las_piedras',     9,  'שפונדרה / אסאדו',         'Las Piedras', 'אורוגוואי', '8', 'צלייה ארוכה',  145,  80, (select id from importers where slug='imp_lachovitz')),
  ('p_striploin_las_piedras', 11, 'סינטה / מותן',            'Las Piedras', 'אורוגוואי', '7', 'סטייקים',      210, 135, (select id from importers where slug='imp_lachovitz')),
  ('p_filet_las_piedras',     12, 'פילה בקר',                'Las Piedras', 'אורוגוואי', '5', 'סטייקים',      320, 220, (select id from importers where slug='imp_lachovitz')),
  ('p_picanha_las_piedras',   19, 'פיקאניה / שפיץ צ''אך',   'Las Piedras', 'אורוגוואי', '8', 'צלייה מהירה',  200, 125, (select id from importers where slug='imp_lachovitz'));

-- ── imp_ben_bakar → Frigorífico Pico, ארגנטינה (10 cuts) ────
insert into products (slug, cut_number, name, producer, origin_country, marbling_score, category, price_retail, price_group, importer_id)
values
  ('p_entrecote_pico',  1,  'אנטריקוט / ורד הצלע',    'Frigorífico Pico', 'ארגנטינה', '7', 'סטייקים',      220, 145, (select id from importers where slug='imp_ben_bakar')),
  ('p_brisket_pico',    3,  'חזה / בריסקט',            'Frigorífico Pico', 'ארגנטינה', '6', 'עישון',        125,  70, (select id from importers where slug='imp_ben_bakar')),
  ('p_roast_pico',      5,  'צלי כתף',                 'Frigorífico Pico', 'ארגנטינה', '5', 'קדירה',        135,  80, (select id from importers where slug='imp_ben_bakar')),
  ('p_false_filet_pico',6,  'פילה מדומה',              'Frigorífico Pico', 'ארגנטינה', '4', 'בישול ארוך',   130,  75, (select id from importers where slug='imp_ben_bakar')),
  ('p_ossubuco_pico',   8,  'שריר קדמי / אוסובוקו',   'Frigorífico Pico', 'ארגנטינה', '5', 'קדירה',         85,  50, (select id from importers where slug='imp_ben_bakar')),
  ('p_asado_pico',      9,  'שפונדרה / אסאדו',         'Frigorífico Pico', 'ארגנטינה', '9', 'צלייה ארוכה',  150,  85, (select id from importers where slug='imp_ben_bakar')),
  ('p_striploin_pico',  11, 'סינטה / מותן',            'Frigorífico Pico', 'ארגנטינה', '6', 'סטייקים',      200, 130, (select id from importers where slug='imp_ben_bakar')),
  ('p_filet_pico',      12, 'פילה בקר',                'Frigorífico Pico', 'ארגנטינה', '4', 'סטייקים',      300, 210, (select id from importers where slug='imp_ben_bakar')),
  ('p_rump_pico',       13, 'שייטל / כנף העוקץ',      'Frigorífico Pico', 'ארגנטינה', '5', 'צלייה מהירה',  180, 110, (select id from importers where slug='imp_ben_bakar')),
  ('p_picanha_pico',    19, 'פיקאניה / שפיץ צ''אך',   'Frigorífico Pico', 'ארגנטינה', '7', 'צלייה מהירה',  190, 120, (select id from importers where slug='imp_ben_bakar'));

-- ── imp_feldman → BPU Meat, אורוגוואי (10 cuts) ─────────────
insert into products (slug, cut_number, name, producer, origin_country, marbling_score, category, price_retail, price_group, importer_id)
values
  ('p_entrecote_bpu',  1,  'אנטריקוט / ורד הצלע',    'BPU Meat', 'אורוגוואי', '7', 'סטייקים',      230, 150, (select id from importers where slug='imp_feldman')),
  ('p_chuck_bpu',      2,  'אונטריב / עורף',          'BPU Meat', 'אורוגוואי', '5', 'בישול ארוך',   115,  68, (select id from importers where slug='imp_feldman')),
  ('p_shoulder_bpu',   4,  'כתף מרכזי',               'BPU Meat', 'אורוגוואי', '4', 'בישול ארוך',   125,  72, (select id from importers where slug='imp_feldman')),
  ('p_rib_cover_bpu',  7,  'מכסה הצלע',               'BPU Meat', 'אורוגוואי', '6', 'קדירה וטחינה', 100,  60, (select id from importers where slug='imp_feldman')),
  ('p_asado_bpu',      9,  'שפונדרה / אסאדו',         'BPU Meat', 'אורוגוואי', '8', 'צלייה ארוכה',  148,  82, (select id from importers where slug='imp_feldman')),
  ('p_striploin_bpu',  11, 'סינטה / מותן',            'BPU Meat', 'אורוגוואי', '7', 'סטייקים',      215, 138, (select id from importers where slug='imp_feldman')),
  ('p_filet_bpu',      12, 'פילה בקר',                'BPU Meat', 'אורוגוואי', '5', 'סטייקים',      310, 215, (select id from importers where slug='imp_feldman')),
  ('p_goose_bpu',      14, 'אווזית',                  'BPU Meat', 'אורוגוואי', '4', 'תנור וקדירה',  140,  85, (select id from importers where slug='imp_feldman')),
  ('p_kaf_bpu',        16, 'כף',                      'BPU Meat', 'אורוגוואי', '3', 'צלייה איטית',  135,  80, (select id from importers where slug='imp_feldman')),
  ('p_picanha_bpu',    19, 'פיקאניה / שפיץ צ''אך',   'BPU Meat', 'אורוגוואי', '8', 'צלייה מהירה',  195, 122, (select id from importers where slug='imp_feldman'));

-- ── imp_eit_ran → Biernat, פולין (10 cuts) ──────────────────
insert into products (slug, cut_number, name, producer, origin_country, marbling_score, category, price_retail, price_group, importer_id)
values
  ('p_entrecote_biernat', 1,  'אנטריקוט / ורד הצלע',    'Biernat', 'פולין', '5', 'סטייקים',      190, 115, (select id from importers where slug='imp_eit_ran')),
  ('p_chuck_biernat',     2,  'אונטריב / עורף',          'Biernat', 'פולין', '4', 'בישול ארוך',    90,  55, (select id from importers where slug='imp_eit_ran')),
  ('p_brisket_biernat',   3,  'חזה / בריסקט',            'Biernat', 'פולין', '4', 'עישון',         100,  60, (select id from importers where slug='imp_eit_ran')),
  ('p_roast_biernat',     5,  'צלי כתף',                 'Biernat', 'פולין', '4', 'קדירה',         110,  65, (select id from importers where slug='imp_eit_ran')),
  ('p_ossubuco_biernat',  8,  'שריר קדמי / אוסובוקו',   'Biernat', 'פולין', '4', 'קדירה',          75,  45, (select id from importers where slug='imp_eit_ran')),
  ('p_asado_biernat',     9,  'שפונדרה / אסאדו',         'Biernat', 'פולין', '6', 'צלייה ארוכה',   120,  70, (select id from importers where slug='imp_eit_ran')),
  ('p_neck_biernat',      10, 'צוואר',                   'Biernat', 'פולין', '5', 'קדירה וטחינה',   85,  50, (select id from importers where slug='imp_eit_ran')),
  ('p_striploin_biernat', 11, 'סינטה / מותן',            'Biernat', 'פולין', '5', 'סטייקים',       170, 100, (select id from importers where slug='imp_eit_ran')),
  ('p_filet_biernat',     12, 'פילה בקר',                'Biernat', 'פולין', '4', 'סטייקים',       260, 160, (select id from importers where slug='imp_eit_ran')),
  ('p_picanha_biernat',   19, 'פיקאניה / שפיץ צ''אך',   'Biernat', 'פולין', '5', 'צלייה מהירה',   150,  90, (select id from importers where slug='imp_eit_ran'));

-- ── imp_neto → Minerva, אורוגוואי (10 cuts) ─────────────────
insert into products (slug, cut_number, name, producer, origin_country, marbling_score, category, price_retail, price_group, importer_id)
values
  ('p_entrecote_minerva',   1,  'אנטריקוט / ורד הצלע',    'Minerva', 'אורוגוואי', '7', 'סטייקים',      225, 145, (select id from importers where slug='imp_neto')),
  ('p_brisket_minerva',     3,  'חזה / בריסקט',            'Minerva', 'אורוגוואי', '6', 'עישון',         125,  75, (select id from importers where slug='imp_neto')),
  ('p_shoulder_minerva',    4,  'כתף מרכזי',               'Minerva', 'אורוגוואי', '4', 'בישול ארוך',    120,  70, (select id from importers where slug='imp_neto')),
  ('p_false_filet_minerva', 6,  'פילה מדומה',              'Minerva', 'אורוגוואי', '4', 'בישול ארוך',    135,  80, (select id from importers where slug='imp_neto')),
  ('p_ossubuco_minerva',    8,  'שריר קדמי / אוסובוקו',   'Minerva', 'אורוגוואי', '5', 'קדירה',          85,  50, (select id from importers where slug='imp_neto')),
  ('p_asado_minerva',       9,  'שפונדרה / אסאדו',         'Minerva', 'אורוגוואי', '8', 'צלייה ארוכה',   145,  82, (select id from importers where slug='imp_neto')),
  ('p_striploin_minerva',   11, 'סינטה / מותן',            'Minerva', 'אורוגוואי', '6', 'סטייקים',       205, 132, (select id from importers where slug='imp_neto')),
  ('p_filet_minerva',       12, 'פילה בקר',                'Minerva', 'אורוגוואי', '4', 'סטייקים',       305, 212, (select id from importers where slug='imp_neto')),
  ('p_thigh_minerva',       15, 'ירכה',                    'Minerva', 'אורוגוואי', '3', 'קדירה וצלי',    130,  75, (select id from importers where slug='imp_neto')),
  ('p_picanha_minerva',     19, 'פיקאניה / שפיץ צ''אך',   'Minerva', 'אורוגוואי', '7', 'צלייה מהירה',   190, 120, (select id from importers where slug='imp_neto'));

-- ── imp_baladi → Marfrig, ארגנטינה (10 cuts) ─────────────────
insert into products (slug, cut_number, name, producer, origin_country, marbling_score, category, price_retail, price_group, importer_id)
values
  ('p_entrecote_marfrig', 1,  'אנטריקוט / ורד הצלע',    'Marfrig', 'ארגנטינה', '8', 'סטייקים',      235, 155, (select id from importers where slug='imp_baladi')),
  ('p_chuck_marfrig',     2,  'אונטריב / עורף',          'Marfrig', 'ארגנטינה', '6', 'בישול ארוך',    115,  68, (select id from importers where slug='imp_baladi')),
  ('p_roast_marfrig',     5,  'צלי כתף',                 'Marfrig', 'ארגנטינה', '6', 'קדירה',         140,  85, (select id from importers where slug='imp_baladi')),
  ('p_ossubuco_marfrig',  8,  'שריר קדמי / אוסובוקו',   'Marfrig', 'ארגנטינה', '6', 'קדירה',          90,  55, (select id from importers where slug='imp_baladi')),
  ('p_asado_marfrig',     9,  'שפונדרה / אסאדו',         'Marfrig', 'ארגנטינה', '9', 'צלייה ארוכה',   155,  88, (select id from importers where slug='imp_baladi')),
  ('p_neck_marfrig',      10, 'צוואר',                   'Marfrig', 'ארגנטינה', '6', 'קדירה וטחינה',   95,  58, (select id from importers where slug='imp_baladi')),
  ('p_striploin_marfrig', 11, 'סינטה / מותן',            'Marfrig', 'ארגנטינה', '7', 'סטייקים',       215, 138, (select id from importers where slug='imp_baladi')),
  ('p_filet_marfrig',     12, 'פילה בקר',                'Marfrig', 'ארגנטינה', '5', 'סטייקים',       315, 218, (select id from importers where slug='imp_baladi')),
  ('p_rump_marfrig',      13, 'שייטל / כנף העוקץ',      'Marfrig', 'ארגנטינה', '6', 'צלייה מהירה',   185, 115, (select id from importers where slug='imp_baladi')),
  ('p_picanha_marfrig',   19, 'פיקאניה / שפיץ צ''אך',   'Marfrig', 'ארגנטינה', '8', 'צלייה מהירה',   195, 125, (select id from importers where slug='imp_baladi'));

-- ── imp_dabbah → מפעלי דבאח, ישראל (6 cuts) ─────────────────
insert into products (slug, cut_number, name, producer, origin_country, marbling_score, category, price_retail, price_group, importer_id)
values
  ('p_entrecote_dabbah', 1,  'אנטריקוט / ורד הצלע',    'מפעלי דבאח', 'ישראל', '5', 'סטייקים',      210, 130, (select id from importers where slug='imp_dabbah')),
  ('p_brisket_dabbah',   3,  'חזה / בריסקט',            'מפעלי דבאח', 'ישראל', '4', 'עישון',         110,  65, (select id from importers where slug='imp_dabbah')),
  ('p_ossubuco_dabbah',  8,  'שריר קדמי / אוסובוקו',   'מפעלי דבאח', 'ישראל', '4', 'קדירה',          80,  48, (select id from importers where slug='imp_dabbah')),
  ('p_asado_dabbah',     9,  'שפונדרה / אסאדו',         'מפעלי דבאח', 'ישראל', '6', 'צלייה ארוכה',   130,  75, (select id from importers where slug='imp_dabbah')),
  ('p_striploin_dabbah', 11, 'סינטה / מותן',            'מפעלי דבאח', 'ישראל', '5', 'סטייקים',       190, 115, (select id from importers where slug='imp_dabbah')),
  ('p_filet_dabbah',     12, 'פילה בקר',                'מפעלי דבאח', 'ישראל', '4', 'סטייקים',       280, 190, (select id from importers where slug='imp_dabbah'));

-- ── imp_marindo → חוות מרינדו, ישראל (4 cuts) ───────────────
-- Note: p_picanha_marindo prices inferred from table average (220/145)
insert into products (slug, cut_number, name, producer, origin_country, marbling_score, category, price_retail, price_group, importer_id)
values
  ('p_entrecote_marindo', 1,  'אנטריקוט / ורד הצלע',    'חוות מרינדו', 'ישראל', '6', 'סטייקים',      250, 165, (select id from importers where slug='imp_marindo')),
  ('p_asado_marindo',     9,  'שפונדרה / אסאדו',         'חוות מרינדו', 'ישראל', '7', 'צלייה ארוכה',   160,  95, (select id from importers where slug='imp_marindo')),
  ('p_striploin_marindo', 11, 'סינטה / מותן',            'חוות מרינדו', 'ישראל', '6', 'סטייקים',       230, 145, (select id from importers where slug='imp_marindo')),
  ('p_picanha_marindo',   19, 'פיקאניה / שפיץ צ''אך',   'חוות מרינדו', 'ישראל', '7', 'צלייה מהירה',   220, 145, (select id from importers where slug='imp_marindo'));

-- ============================================================
-- GROUPS — 6 אירועי משלוח פעילים
-- ============================================================
insert into groups (slug, title, title_en, branch_id, ends_at, status)
values
  ('ev1',
   'שוק הכרמל — Las Piedras & BPU',
   'Carmel Market — Las Piedras & BPU',
   (select id from branches where name='דוכן שוק הכרמל'),
   now() + interval '4 days', 'active'),

  ('ev2',
   'שרונה — Pico & Marfrig',
   'Sarona — Pico & Marfrig',
   (select id from branches where name='מתחם שרונה'),
   now() + interval '6 days', 'active'),

  ('ev3',
   'ראשון לציון — Biernat & Minerva',
   'Rishon LeZion — Biernat & Minerva',
   (select id from branches where name='אזור תעשייה חדש'),
   now() + interval '3 days', 'active'),

  ('ev4',
   'הרצליה — Las Piedras & Minerva',
   'Herzliya — Las Piedras & Minerva',
   (select id from branches where name='אזור תעשייה פיתוח'),
   now() + interval '7 days', 'active'),

  ('ev5',
   'חיפה — Marfrig & דבאח',
   'Haifa — Marfrig & Dabbah',
   (select id from branches where name='העיר התחתית'),
   now() + interval '2 days', 'active'),

  ('ev6',
   'ירושלים — BPU & Pico',
   'Jerusalem — BPU & Pico',
   (select id from branches where name='שוק מחנה יהודה'),
   now() + interval '5 days', 'active');

-- ============================================================
-- GROUP_PRODUCTS — נתחים לכל אירוע
-- ============================================================

-- ev1 · שוק הכרמל: Las Piedras (אנטריקוט, אסאדו, פיקאניה, פילה)
--                  BPU Meat   (סינטה, חזה, כתף)
insert into group_products (group_id, product_id, target_kg, filled_kg)
values
  ((select id from groups where slug='ev1'),(select id from products where slug='p_entrecote_las_piedras'), 30, 18),
  ((select id from groups where slug='ev1'),(select id from products where slug='p_asado_las_piedras'),     40, 22),
  ((select id from groups where slug='ev1'),(select id from products where slug='p_picanha_las_piedras'),   25, 10),
  ((select id from groups where slug='ev1'),(select id from products where slug='p_filet_las_piedras'),     15,  6),
  ((select id from groups where slug='ev1'),(select id from products where slug='p_striploin_bpu'),         25, 14),
  ((select id from groups where slug='ev1'),(select id from products where slug='p_brisket_las_piedras'),   35, 20),
  ((select id from groups where slug='ev1'),(select id from products where slug='p_shoulder_bpu'),          30, 12);

-- ev2 · שרונה: Frigorífico Pico (אנטריקוט, אסאדו, פיקאניה, שייטל, סינטה)
--             Marfrig          (חזה, צוואר, אווזית)
insert into group_products (group_id, product_id, target_kg, filled_kg)
values
  ((select id from groups where slug='ev2'),(select id from products where slug='p_entrecote_pico'),   30, 12),
  ((select id from groups where slug='ev2'),(select id from products where slug='p_asado_pico'),       40, 25),
  ((select id from groups where slug='ev2'),(select id from products where slug='p_picanha_pico'),     20,  8),
  ((select id from groups where slug='ev2'),(select id from products where slug='p_rump_pico'),        20, 11),
  ((select id from groups where slug='ev2'),(select id from products where slug='p_striploin_pico'),   25, 16),
  ((select id from groups where slug='ev2'),(select id from products where slug='p_roast_marfrig'),    30, 19),
  ((select id from groups where slug='ev2'),(select id from products where slug='p_neck_marfrig'),     20,  7),
  ((select id from groups where slug='ev2'),(select id from products where slug='p_ossubuco_marfrig'), 20, 13);

-- ev3 · ראשון לציון: Biernat  (אנטריקוט, חזה, אסאדו, צוואר)
--                   Minerva   (פילה, סינטה, פיקאניה)
insert into group_products (group_id, product_id, target_kg, filled_kg)
values
  ((select id from groups where slug='ev3'),(select id from products where slug='p_entrecote_biernat'), 25,  9),
  ((select id from groups where slug='ev3'),(select id from products where slug='p_brisket_biernat'),   30, 18),
  ((select id from groups where slug='ev3'),(select id from products where slug='p_asado_biernat'),     35, 21),
  ((select id from groups where slug='ev3'),(select id from products where slug='p_neck_biernat'),      20,  5),
  ((select id from groups where slug='ev3'),(select id from products where slug='p_filet_minerva'),     15,  7),
  ((select id from groups where slug='ev3'),(select id from products where slug='p_striploin_minerva'), 25, 14),
  ((select id from groups where slug='ev3'),(select id from products where slug='p_picanha_minerva'),   20, 10);

-- ev4 · הרצליה: Las Piedras (עורף, כתף, שריר, סינטה)
--               Minerva     (אנטריקוט, אסאדו, ירכה)
insert into group_products (group_id, product_id, target_kg, filled_kg)
values
  ((select id from groups where slug='ev4'),(select id from products where slug='p_chuck_las_piedras'),    25,  8),
  ((select id from groups where slug='ev4'),(select id from products where slug='p_shoulder_las_piedras'), 30, 11),
  ((select id from groups where slug='ev4'),(select id from products where slug='p_ossubuco_las_piedras'), 20,  6),
  ((select id from groups where slug='ev4'),(select id from products where slug='p_striploin_las_piedras'),25, 15),
  ((select id from groups where slug='ev4'),(select id from products where slug='p_entrecote_minerva'),    30, 17),
  ((select id from groups where slug='ev4'),(select id from products where slug='p_asado_minerva'),        40, 28),
  ((select id from groups where slug='ev4'),(select id from products where slug='p_thigh_minerva'),        20,  9);

-- ev5 · חיפה: Marfrig  (אנטריקוט, אסאדו, פיקאניה, שייטל)
--             דבאח      (אנטריקוט, חזה, אסאדו)
insert into group_products (group_id, product_id, target_kg, filled_kg)
values
  ((select id from groups where slug='ev5'),(select id from products where slug='p_entrecote_marfrig'), 25,  4),
  ((select id from groups where slug='ev5'),(select id from products where slug='p_asado_marfrig'),     35, 12),
  ((select id from groups where slug='ev5'),(select id from products where slug='p_picanha_marfrig'),   20,  3),
  ((select id from groups where slug='ev5'),(select id from products where slug='p_rump_marfrig'),      20,  7),
  ((select id from groups where slug='ev5'),(select id from products where slug='p_entrecote_dabbah'),  25, 10),
  ((select id from groups where slug='ev5'),(select id from products where slug='p_brisket_dabbah'),    30, 16),
  ((select id from groups where slug='ev5'),(select id from products where slug='p_asado_dabbah'),      35, 20);

-- ev6 · ירושלים: BPU Meat         (אנטריקוט, אסאדו, פיקאניה, מכסה הצלע, כף)
--                Frigorífico Pico  (פילה, סינטה, פילה מדומה)
insert into group_products (group_id, product_id, target_kg, filled_kg)
values
  ((select id from groups where slug='ev6'),(select id from products where slug='p_entrecote_bpu'),    30, 20),
  ((select id from groups where slug='ev6'),(select id from products where slug='p_asado_bpu'),        40, 30),
  ((select id from groups where slug='ev6'),(select id from products where slug='p_picanha_bpu'),      20, 12),
  ((select id from groups where slug='ev6'),(select id from products where slug='p_rib_cover_bpu'),    20,  8),
  ((select id from groups where slug='ev6'),(select id from products where slug='p_kaf_bpu'),          15,  5),
  ((select id from groups where slug='ev6'),(select id from products where slug='p_filet_pico'),       15,  9),
  ((select id from groups where slug='ev6'),(select id from products where slug='p_striploin_pico'),   25, 17),
  ((select id from groups where slug='ev6'),(select id from products where slug='p_false_filet_pico'), 20, 11);
