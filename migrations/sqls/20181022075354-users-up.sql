create table users (
    id bigserial not null,
    username text not null,
    firstname text not null,
    lastname text not null,
    email text not null,
    role text not null,
    access_token text null,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    constraint users_pkey primary key (id)
) with (OIDS = FALSE);

create index IF NOT EXISTS users_id on users(id);
create index IF NOT EXISTS users_email_index on users(email);
create index IF NOT EXISTS users_username_index on users(username);

insert into
    users (
        username,
        firstname,
        lastname,
        email,
        role
    )
values
    (
        'kemalelmizan',
        'Kemal',
        'Elmizan',
        'kemalelmizan@gmail.com',
        'admin'
    ),
    (
        'seller01',
        'Seller',
        '01',
        'seller01@gmail.com',
        'seller'
    ),
    (
        'buyer01',
        'Buyer',
        '01',
        'buyer01@gmail.com',
        'buyer'
    );