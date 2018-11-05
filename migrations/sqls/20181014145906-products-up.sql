create table products (
    id bigserial not null,
    name text not null,
    description text null,
    image_url text null,
    category text null,
    price bigint not null,
    discounted_price bigint not null,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    constraint products_pkey primary key (id)
) with (OIDS = FALSE);

create index IF NOT EXISTS products_id on products(id);

insert into
    products (
        name,
        description,
        image_url,
        category,
        price,
        discounted_price
    )
values
    (
        'Macbook Pro 2016',
        'Choose your MacBook from Rose Gold, Silver, Gold, or Space Gray, and configure it the way you want.',
        'https://store.storeimages.cdn-apple.com/4981/as-images.apple.com/is/image/AppleInc/aos/published/images/m/bp/mbp13/space/mbp13-space-select-201807?wid=904&hei=840&fmt=jpeg&qlt=95&.v=1529520054457',
        'laptop',
        10000,
        5000
    ),
    (
        'Lenovo Thinkpad X1',
        'The new ThinkPad X1 Carbon is a premium, ultralight business laptop featuring up to 15 hours battery life, Intel processing & RapidCharge technology.',
        'https://www.lenovo.com/medias/lenovo-thinkpad-x10-carbon-hero.png?context=bWFzdGVyfHJvb3R8MTY0NTkwfGltYWdlL3BuZ3xoMWUvaDE1Lzk2NDg3MjgxNDU5NTAucG5nfDA2MWNjZjU5NTBiN2ZmMWJkMzQwNDg2MWYxZmFhM2Q2MzBjMjZmNzRiMzYzOTc5ZDNkMjA4MmYxMDVkNWVmYWI',
        'laptop',
        10000,
        5000
    ),
    (
        'ASUS ROG STRIX',
        'ROG Strix Hero Edition is built from the ground up for fearless Multiplayer Online Battle Arena heroes. Optimized to deliver a competitive MOBA edge.',
        'https://www.excaliberpc.com/images/661022_1/large.jpg',
        'laptop',
        10000,
        5000
    );