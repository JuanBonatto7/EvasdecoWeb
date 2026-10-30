-- Productos de ejemplo para probar el catálogo y el panel.
-- Se pueden borrar desde el panel admin o con: delete from public.products where slug in (...);

insert into public.products (slug, nombre, categoria, talle, estado, precio, descripcion, status, destacado)
values
  ('campera-de-jean', 'Campera de jean', 'Ropa', 'L', 'Muy buen estado', 28000,
   'Campera de jean clásica, lavado medio. Sin detalles, lista para usar.', 'disponible', true),
  ('zapatillas-adidas', 'Zapatillas adidas', 'Calzado', '38', 'Muy buen estado', 35000,
   'Zapatillas adidas originales. Poco uso, sin detalles. Talle 38.', 'disponible', true),
  ('mochila-negra', 'Mochila negra', 'Mochilas', null, 'Buen estado', 18000,
   'Mochila negra de uso diario, con un bolsillo frontal y cierre sin fallas.', 'disponible', false),
  ('sweater-verde', 'Sweater verde', 'Ropa', 'M', 'Buen estado', 16000,
   'Sweater de punto verde musgo, muy abrigado.', 'disponible', false),
  ('remera-rayada', 'Remera rayada', 'Ropa', 'M', 'Como nuevo', 12000,
   'Remera de algodón a rayas, casi sin uso.', 'reservado', false),
  ('cartera-negra', 'Cartera negra', 'Accesorios', null, 'Muy buen estado', 14000,
   'Cartera negra de cuero sintético con correa larga.', 'disponible', false)
on conflict (slug) do nothing;
