select b.id,
       b.nm,
       trunc(sum(st_area(b.geom)::numeric), 3) /
       (select trunc(sum(st_area(b.geom)::numeric), 3) from "biomes" b) percentage
from "biomes" b
group by b.id, b.nm
order by percentage;

select agro00,
       agro10,
       agro20,
       agro30,
       agro40,
       agro50,
       forreg30,
       forreg40,
       forreg50,
       natveg00,
       natveg10,
       natveg20,
       natveg30,
       natveg40,
       natveg50,
       pltfor00,
       pltfor10,
       pltfor20,
       pltfor30,
       pltfor40,
       pltfor50
from "output_brazilsforestcode_brazil_idc2_dd";

-- fazer a nivel de codigo
-- natveg00: 595576.572
with b as (select b.id,
                  b.nm,
                  trunc(sum(st_area(b.geom)::numeric), 3) /
                  (select trunc(sum(st_area(b.geom)::numeric), 3) from "biomes" b) percentage
           from "biomes" b
           group by b.id, b.nm
           order by percentage)
select b.nm, b.percentage * 595576.572 -- natveg00
from b;

-- soma deveria ser: 595576.572
-- soma é: 595574.895
-- somar os 4 menores e jogar o restante para o ultimo (5)
-- Amazonia = 595576.572 - 306643.614 = 288932.958
