create table orders (
    id bigserial not null,
    user_id bigint not null,
    cart_id bigint not null,
    order_detail text,
    order_status text,
    payment_amount bigint not null,
    payment_status text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    constraint orders_pkey primary key (id)
) with (OIDS = FALSE);