--liquibase formatted sql

--changeset heitor.carneiro:20201123135100-01
create table if not exists ponto_parada_processamento
(
    cd_ponto_parada_processamento serial,
    dt_criado                     timestamp default now(),
    dt_modificado                 timestamp default now(),
    st_status                     varchar(255) not null,
    dc_processamento              varchar(255),
    cd_diretoria                  integer,
    cd_dne                        integer,
    constraint ponto_parada_processamento_pkey primary key (cd_ponto_parada_processamento)
);
--rollback drop table if exists ponto_parada_processamento;

--changeset heitor.carneiro:20201123135100-02
create index if not exists ponto_parada_processamento_st_status_idx on ponto_parada_processamento (st_status);
--rollback drop index if exists ponto_parada_processamento_st_status_idx;

--changeset heitor.carneiro:20201123135100-03
alter table ponto_parada_matriz_distancia
    drop column if exists cd_grupo;

--changeset heitor.carneiro:20201123135100-04
alter table ponto_parada_matriz_distancia
    add column if not exists cd_ponto_parada_processamento integer;

--changeset heitor.carneiro:20201123135100-05
ALTER TABLE ponto_parada_matriz_distancia
    ADD CONSTRAINT fk_ponto_parada_matriz_distancia_cd_ponto_parada_processamento
        FOREIGN KEY (cd_ponto_parada_processamento)
            REFERENCES ponto_parada_processamento (cd_ponto_parada_processamento);

-- rollback ALTER TABLE ponto_parada_matriz_distancia DROP CONSTRAINT IF EXISTS fk_ponto_parada_matriz_distancia_cd_ponto_parada_processamento;
