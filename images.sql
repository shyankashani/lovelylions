DROP TABLE artist CASCADE;
DROP TABLE head CASCADE;
DROP TABLE torso CASCADE;
DROP TABLE legs CASCADE;
DROP TABLE final_image CASCADE;

CREATE TABLE artist(
   id   SERIAL PRIMARY KEY,
   username    VARCHAR(255) NOT NULL,
   email    VARCHAR(255) NOT NULL,
   facebookId  VARCHAR(255) NOT NULL,
   token VARCHAR(255) NOT NULL,
   name VARCHAR(255) NOT NULL
);

CREATE TABLE head (
    id      SERIAL PRIMARY KEY,
    _path    TEXT NOT NULL,
    user_id  INTEGER references artist(id)
);

CREATE TABLE torso (
    id      SERIAL PRIMARY KEY,
    _path    TEXT NOT NULL,
    user_id  INTEGER references artist(id)
);

CREATE TABLE legs (
    id      SERIAL PRIMARY KEY,
    _path    TEXT NOT NULL,
    user_id  INTEGER references artist(id)
);

CREATE TABLE final_image (
    id      SERIAL PRIMARY KEY,
    head_id     INTEGER references head(id),
    torso_id     INTEGER references torso(id),
    legs_id     INTEGER references legs(id),
    user_id     INTEGER references artist(id)
);


insert into artist (username, email, facebookId, token, name) values ('Harry Prissypizzle', 'dummyemail@test.com', 'dummyuser', 'NA', 'Harry Prissypizzle');
insert into torso (_path, user_id )  values ( 'images?path=71b9ab679e89a4360fe9c0bbae972bedc2330255442a2f174cad63914111d327.png', 1 );
insert into torso (_path, user_id ) values ( 'images?path=0ebab7ebf82861ec8e0253ac25c3a67382dc94c767ffe9bd99b0af58e36ee775.png', 1 );
insert into head (_path, user_id ) values ( 'images?path=0fc212ccfb9429f2c833c292a5edf8d6cf5c4e7c5ab945f9f1ad620960b14672.png', 1);
insert into head (_path, user_id ) values ( 'images?path=0fc44d05c568713bef56673c1ce81202b5026c973a62515a7581bc8ad565402c.png', 1);
insert into head (_path, user_id ) values ( 'images?path=2721c2c80c05dd02f71b357f5b682d118870c5721fd396338a8c8517bba979d3.png', 1);
insert into head (_path, user_id ) values ('images?path=28b78de3b9e4ef228af786f77be7daeb6590dc913f56f9a07c7a3d1653c0248a.png', 1);
insert into head (_path, user_id ) values ('images?path=2a784af4c4096f67e6f6d27e3c71603a31bccb096c3a5e040d3f76fea80ccef2.png', 1);
insert into torso (_path, user_id ) values ('images?path=392dc1bdb882d51b514ce1f8c8e2ec0cc2ca0300fd1381e5382b40633d97d84d.png', 1);
insert into torso (_path, user_id ) values ('images?path=45fe704a4b49254f5676680a20e55e135b7a9727b8e0064184c07e1cd45e8932.png', 1);
insert into head (_path, user_id ) values ('images?path=4cb5d5f2e0f6bc62aad30705487c35082cf5b100ed5b658205b3a8fcdac18d8d.png', 1);
insert into legs (_path, user_id ) values ('images?path=4aa5935db2cc2bfc29d75e46135efcbaae35a73178feed81f28dd1868bb3193c.png', 1);
insert into torso (_path, user_id ) values ('images?path=4e208d378db47ca3811db29e25d6f226b079037ac8e9e3a64fd41dc01c50491f.png', 1);
insert into torso (_path, user_id ) values ('images?path=53a4d11f01e28c46094a914bf811ed3f7ec91aa9e782a6a5652bbee9c66086e9.png', 1);
insert into torso (_path, user_id ) values ('images?path=5a7b0c11fd425ce227d22dab638c5f644d019bf2beda0347bb58f388998f4302.png', 1);
insert into torso (_path, user_id ) values ('images?path=62254c0d0df58aaecfac2355bf3608a321ae4d7a31d6266b8cd7d7ae23174cd9.png', 1);
insert into head (_path, user_id ) values ('images?path=7058e57b8f67dd36c1dc2c78f2bf6520ea368bc3c883332590a9c3ab70055cff.png', 1);
insert into legs (_path, user_id )  values ( 'images?path=90b094c46d20ab7e730cf3f3c06f2719da37277e3fec4a604697a93f104662d5.png', 1 );
insert into head (_path, user_id ) values ('images?path=7efa5a4f30ef896da89f1d7b8d7a49f2f1d9265f87cc75eec080860b54de69fd.png', 1);
insert into head (_path, user_id ) values ('images?path=84190090ed8a0bb403da1f7a9359e68361c8ea5784cacff5aacff4b0752bc1d2.png', 1);
insert into legs (_path, user_id ) values ('images?path=859e15932fbf933f85b5ba89ee5ed49cd42df837ab78c71f64d2811e0eb9c825.png', 1);
insert into torso (_path, user_id ) values ('images?path=964d479cc223ea25653a2edc1e6fc08cfee7216db818c0447720934b6f9c9768.png', 1);
insert into legs (_path, user_id ) values ('images?path=a69f0cc5881b3f0eb200d0b2fab861c105ba048c60efc120f1be14b9a8d6eff4.png', 1);
insert into legs (_path, user_id ) values ('images?path=d70ca14d9f0898c116ecb67b28f628728a90547f32e2fe05d1c0a794a5f9b99e.png', 1);
insert into head (_path, user_id ) values ('images?path=d08f122e05a5c4414c8ad03e4b9dd230e8b49266319bc17fbf3dd7128fc4cad1.png', 1);
insert into head (_path, user_id ) values ('images?path=dc52c924f93054a34ac0ea3d1aa82c2dfb0a996814c7485fffcbafe651290bd2.png', 1);
insert into head (_path, user_id ) values ('images?path=f6d525f9638acb5e8a1ba51e8fe421edb01014acfcb50c443a28c91b1bd092e4.png', 1);
insert into head (_path, user_id ) values ( 'images?path=84190090ed8a0bb403da1f7a9359e68361c8ea5784cacff5aacff4b0752bc1d2.png', 1 );
insert into final_image (head_id, torso_id, legs_id, user_id) values (1, 2, 1, 1);
