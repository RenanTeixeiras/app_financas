insert into public.categories (user_id, name, type, color, icon, is_archived, is_system)
values
  (null, 'Salário',       'income',  '#34d399', 'wallet',          false, true),
  (null, 'Freelance',     'income',  '#60a5fa', 'briefcase',       false, true),
  (null, 'Investimentos', 'income',  '#a78bfa', 'chart-column',    false, true),
  (null, 'Presentes',     'income',  '#f59e0b', 'gift',            false, true),
  (null, 'Reembolsos',    'income',  '#22c55e', 'receipt',         false, true),
  (null, 'Outros',        'income',  '#94a3b8', 'circle-ellipsis', false, true),
  (null, 'Moradia',       'expense', '#fb7185', 'house',           false, true),
  (null, 'Alimentação',   'expense', '#f97316', 'utensils',        false, true),
  (null, 'Transporte',    'expense', '#38bdf8', 'car',             false, true),
  (null, 'Saúde',         'expense', '#ef4444', 'heart-pulse',     false, true),
  (null, 'Lazer',         'expense', '#8b5cf6', 'popcorn',         false, true),
  (null, 'Educação',      'expense', '#eab308', 'graduation-cap',  false, true),
  (null, 'Assinaturas',   'expense', '#6366f1', 'repeat',          false, true),
  (null, 'Contas',        'expense', '#06b6d4', 'file-text',       false, true),
  (null, 'Compras',       'expense', '#ec4899', 'shopping-bag',    false, true),
  (null, 'Impostos',      'expense', '#f43f5e', 'badge-percent',   false, true),
  (null, 'Outros',        'expense', '#94a3b8', 'circle-ellipsis', false, true)
on conflict do nothing;
