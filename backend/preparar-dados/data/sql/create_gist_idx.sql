-----------------------------------------------------------------------------------------------------------------
-- Spatial Indexing

-- Indexing
CREATE INDEX aluno_gix ON aluno USING GIST (geom);

-- Vacuuming
VACUUM ANALYZE aluno;

-- Clustering
CLUSTER aluno USING aluno_gix;
ANALYZE aluno;
