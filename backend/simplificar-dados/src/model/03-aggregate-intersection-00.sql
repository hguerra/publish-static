-- soma de todos os poligonos é o valor de brazil
select trunc(sum(st_area(b.geom)::numeric), 3) area
from "brazil" b;
-- 710.63 area
select trunc(sum(st_area(b.geom)::numeric), 3) area
from "biomes" b;

-- soma de um atributo: 595576.572
-- 595576.572 --> 710.63 area
select trunc(sum("natveg00"), 3)
from "brazilsforestcode_idc2_dd";


-- soma total area para 1 bioma: 166.753
select trunc(sum(st_area(b.geom)::numeric), 3) area
from "biomes" b
where b.id = 3;

-- analise
-- 710.63  --> 595576.572
-- 166.753 --> X
-- X = (595576.572 * 166.753)/710.63
-- X = 13975.118
--
-- 166.753 / 710.63 = 0.234655165
-- 0.234655165 * 595576.572 = 139755.118
select b.id,
       b.nm,
       trunc(sum(st_area(b.geom)::numeric), 3) /
       (select trunc(sum(st_area(b.geom)::numeric), 3) from "biomes" b) percentage
from "biomes" b
group by b.id, b.nm
order by percentage;
