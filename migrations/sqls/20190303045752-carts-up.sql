create table carts (
    id bigserial not null,
    user_id bigint not null,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    constraint carts_pkey primary key (id)
) with (OIDS = FALSE);