-----------------------------------------------
-- Drop tables in dependency order (children first)
-----------------------------------------------

DROP TABLE IF EXISTS public.project_category CASCADE;
DROP TABLE IF EXISTS public.project CASCADE;
DROP TABLE IF EXISTS public.organization CASCADE;
DROP TABLE IF EXISTS public.category CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

DROP SEQUENCE IF EXISTS organization_id_seq CASCADE;
DROP SEQUENCE IF EXISTS project_id_seq CASCADE;
DROP SEQUENCE IF EXISTS category_id_seq CASCADE;
DROP SEQUENCE IF EXISTS role_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_id_seq CASCADE;

-----------------------------------------------
-- Organization
-----------------------------------------------

CREATE SEQUENCE organization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.organization
(
    organization_id integer                                             NOT NULL DEFAULT nextval('organization_id_seq'::regclass),
    name            character varying(150) COLLATE pg_catalog."default" NOT NULL,
    description     text COLLATE pg_catalog."default"                   NOT NULL,
    contact_email   character varying(255) COLLATE pg_catalog."default" NOT NULL,
    logo_filename   character varying(255) COLLATE pg_catalog."default" NOT NULL,
    PRIMARY KEY (organization_id)
);

-----------------------------------------------
-- Category
-----------------------------------------------

CREATE SEQUENCE category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.category
(
    category_id integer                NOT NULL DEFAULT nextval('category_id_seq'::regclass),
    name        character varying(150) NOT NULL,
    description character varying(255),
    PRIMARY KEY (category_id)
);

-----------------------------------------------
-- Project
-----------------------------------------------

CREATE SEQUENCE project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.project
(
    project_id      integer                NOT NULL DEFAULT nextval('project_id_seq'::regclass),
    organization_id integer                NOT NULL REFERENCES public.organization (organization_id),
    title           character varying(255) NOT NULL,
    description     character varying(255),
    location        character varying(255),
    start_date      date,
    PRIMARY KEY (project_id)
);

-----------------------------------------------
-- Project_Category (join table for many-to-many)
-----------------------------------------------

CREATE TABLE public.project_category
(
    project_id  integer NOT NULL,
    category_id integer NOT NULL,
    PRIMARY KEY (project_id, category_id)
);

-----------------------------------------------
-- Roles (for user authentication/authorization)
-----------------------------------------------
CREATE SEQUENCE role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.roles
(
    role_id          integer                       NOT NULL DEFAULT nextval('role_id_seq'::regclass),
    role_name        character varying(150) UNIQUE NOT NULL,
    role_description character varying(255),
    PRIMARY KEY (role_id)
);

-----------------------------------------------
-- Users (for user authentication/authorization)
-----------------------------------------------

CREATE SEQUENCE user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.users
(
    user_id       integer                       NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    name          character varying(150) UNIQUE NOT NULL,
    password_hash character varying(255)        NOT NULL,
    email         character varying(255) UNIQUE NOT NULL,
    role_id       integer                       NOT NULL REFERENCES public.roles (role_id),
    created_at    timestamp without time zone   NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id)
);

-----------------------------------------------
-- Foreign Keys
-----------------------------------------------

ALTER TABLE public.project_category
    ADD FOREIGN KEY (project_id)
        REFERENCES public.project (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

ALTER TABLE public.project_category
    ADD FOREIGN KEY (category_id)
        REFERENCES public.category (category_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

ALTER TABLE public.users
    ADD FOREIGN KEY (role_id)
        REFERENCES public.roles (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

-----------------------------------------------
-- Data
-----------------------------------------------

INSERT INTO public.organization (name, description, contact_email, logo_filename)
VALUES ('BrightFuture Builders',
        'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
        'info@brightfuturebuilders.org', 'brightfuture-logo.png');

INSERT INTO public.organization (name, description, contact_email, logo_filename)
VALUES ('GreenHarvest Growers',
        'An urban farming collective promoting food sustainability and education in local neighborhoods.',
        'contact@greenharvest.org',
        'greenharvest-logo.png');

INSERT INTO public.organization (name, description, contact_email, logo_filename)
VALUES ('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.',
        'hello@unityserve.org',
        'unityserve-logo.png');

INSERT INTO public.category (category_id, name, description)
VALUES (DEFAULT, 'Environmental', 'Park cleanups, tree planting, trail maintenance, recycling drives');

INSERT INTO public.category (category_id, name, description)
VALUES (DEFAULT, 'Hunger & Food Security', 'Food bank sorting, meal preparation, community garden work');

INSERT INTO public.category (category_id, name, description)
VALUES (DEFAULT, 'Housing & Shelter',
        'Habitat for Humanity builds, homeless shelter volunteering, home repair for elderly residents');

INSERT INTO public.category (category_id, name, description)
VALUES (DEFAULT, 'Education & Literacy', 'Tutoring, school supply drives, library volunteering, reading programs');

INSERT INTO public.category (category_id, name, description)
VALUES (DEFAULT, 'Health & Wellness',
        'Blood drives, hospital volunteering, mental health awareness campaigns, free clinic support');

INSERT INTO public.category (category_id, name, description)
VALUES (DEFAULT, 'Animal Welfare', 'Shelter volunteering, fostering, pet supply drives, wildlife habitat restoration');

INSERT INTO public.category (category_id, name, description)
VALUES (DEFAULT, 'Elder Care',
        'Nursing home visits, errand assistance, technology tutoring for seniors, companionship programs');

INSERT INTO public.category (category_id, name, description)
VALUES (DEFAULT, 'Youth & Mentoring', 'After-school programs, Big Brothers/Big Sisters, coaching, career mentoring');

INSERT INTO public.category (category_id, name, description)
VALUES (DEFAULT, 'Disaster Relief',
        'Emergency supply collection, rebuilding efforts, first aid training, preparedness kits');

INSERT INTO public.category (category_id, name, description)
VALUES (DEFAULT, 'Community Development',
        'Neighborhood beautification, civic engagement drives, clothing drives, free legal or tax prep clinics');

INSERT INTO public.project (project_id, organization_id, title, description, location, start_date)
VALUES (DEFAULT, 1, 'Park Cleanup Day',
        'Join us for a day of cleaning and beautifying our local park. We will be picking up trash, planting flowers, and making our community space more enjoyable for everyone.',
        'Central Park', '2024-07-15');

INSERT INTO public.project (project_id, organization_id, title, description, location, start_date)
VALUES (DEFAULT, 2, 'Food Bank Sorting',
        'Help us sort and organize donations at the local food bank. Your efforts will directly support families in need by ensuring they receive the food they require.',
        'City Food Bank', '2024-07-20');

INSERT INTO public.project (project_id, organization_id, title, description, location, start_date)
VALUES (DEFAULT, 3, 'Habitat for Humanity Build',
        'Join us for a weekend of community building and rehabilitation. We will be working with local volunteers to create a sustainable community space for our neighbors.',
        'Habitat for Humanity', '2024-07-25');

INSERT INTO public.project_category (project_id, category_id)
VALUES (1, 1);

INSERT INTO public.project_category (project_id, category_id)
VALUES (1, 3);

INSERT INTO public.project_category (project_id, category_id)
VALUES (2, 2);

INSERT INTO public.project_category (project_id, category_id)
VALUES (3, 3);

INSERT INTO public.roles (role_id, role_name, role_description)
VALUES (DEFAULT, 'admin', 'Administrator with full system access');

INSERT INTO public.roles (role_id, role_name, role_description)
VALUES (DEFAULT, 'user', 'Standard user with basic access');
