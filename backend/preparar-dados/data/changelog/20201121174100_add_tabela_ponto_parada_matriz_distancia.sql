--liquibase formatted sql

--changeset heitor.carneiro:20201121174100-01
create extension if not exists "uuid-ossp";
--rollback drop extension if exists "uuid-ossp";

--changeset heitor.carneiro:20201121174100-02
create table if not exists ponto_parada_matriz_distancia
(
    cd_ponto_parada_matriz_distancia serial constraint ponto_parada_matriz_distancia_pkey primary key,
    cd_grupo uuid,
    cd_ponto_parada integer,
    distancias integer[]
);
--rollback drop table if exists ponto_parada_matriz_distancia;

--changeset heitor.carneiro:20201121174100-03
create index if not exists ponto_parada_matriz_distancia_cd_ponto_parada on ponto_parada_matriz_distancia(cd_ponto_parada);
--rollback drop index if exists ponto_parada_matriz_distancia_cd_ponto_parada;
