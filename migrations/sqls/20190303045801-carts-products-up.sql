create table carts_products (
    cart_id bigserial not null,
    product_id bigint not null,
    quantity int not null,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
) with (OIDS = FALSE);