--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0 (Debian 16.0-1.pgdg120+1)
-- Dumped by pg_dump version 16.0 (Debian 16.0-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.customer (
    id uuid NOT NULL,
    firstname text NOT NULL,
    lastname text NOT NULL
);


ALTER TABLE public.customer OWNER TO admin;

--
-- Name: customer_license_contract; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.customer_license_contract (
    customer_id uuid NOT NULL,
    license_contract_id uuid NOT NULL
);


ALTER TABLE public.customer_license_contract OWNER TO admin;

--
-- Name: food_history; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.food_history (
    id uuid NOT NULL,
    food_name text,
    meal_id uuid,
    amount numeric,
    unit uuid
);


ALTER TABLE public.food_history OWNER TO admin;

--
-- Name: food_history_nutrient; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.food_history_nutrient (
    foodhistory_id uuid NOT NULL,
    nutrient_id uuid NOT NULL
);


ALTER TABLE public.food_history_nutrient OWNER TO admin;

--
-- Name: food_plan; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.food_plan (
    id uuid NOT NULL,
    food_name text,
    meal_id uuid
);


ALTER TABLE public.food_plan OWNER TO admin;

--
-- Name: license; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.license (
    id uuid NOT NULL,
    license_name text,
    duration time without time zone,
    price money,
    active boolean
);


ALTER TABLE public.license OWNER TO admin;

--
-- Name: meal_food_history; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.meal_food_history (
    meal_history_id uuid NOT NULL,
    food_id uuid NOT NULL,
    amount double precision,
    unit_id uuid
);


ALTER TABLE public.meal_food_history OWNER TO admin;

--
-- Name: meal_history; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.meal_history (
    id uuid NOT NULL,
    recordedby text NOT NULL,
    patient_id uuid NOT NULL,
    recordeddate date
);


ALTER TABLE public.meal_history OWNER TO admin;

--
-- Name: meal_recipe_history; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.meal_recipe_history (
    recipe_history_id uuid NOT NULL,
    meal_history_id uuid NOT NULL,
    unit_id uuid
);


ALTER TABLE public.meal_recipe_history OWNER TO admin;

--
-- Name: module; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.module (
    id uuid NOT NULL,
    module_name text NOT NULL,
    description text
);


ALTER TABLE public.module OWNER TO admin;

--
-- Name: nutrient; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.nutrient (
    id uuid NOT NULL,
    nutrient_name text NOT NULL,
    preferred_unit text
);


ALTER TABLE public.nutrient OWNER TO admin;

--
-- Name: patient; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.patient (
    id uuid NOT NULL,
    firstname text NOT NULL,
    lastname text,
    customer_id uuid
);


ALTER TABLE public.patient OWNER TO admin;

--
-- Name: patient_module; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.patient_module (
    patient_id uuid NOT NULL,
    module_id uuid NOT NULL
);


ALTER TABLE public.patient_module OWNER TO admin;

--
-- Name: recipe_food; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.recipe_food (
    food_id uuid NOT NULL,
    recipe_id uuid NOT NULL,
    amount numeric,
    unit_id uuid
);


ALTER TABLE public.recipe_food OWNER TO admin;

--
-- Name: recipe_food_history; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.recipe_food_history (
    food_id uuid NOT NULL,
    recipe_id uuid NOT NULL,
    amount numeric,
    unit_id uuid
);


ALTER TABLE public.recipe_food_history OWNER TO admin;

--
-- Name: recipe_history; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.recipe_history (
    id uuid NOT NULL,
    recipe_name text,
    tags text,
    notes text
);


ALTER TABLE public.recipe_history OWNER TO admin;

--
-- Name: recipe_plan; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.recipe_plan (
    id uuid NOT NULL,
    recipe_name text,
    tags text,
    notes text
);


ALTER TABLE public.recipe_plan OWNER TO admin;

--
-- Name: reported_issues; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.reported_issues (
    id uuid NOT NULL,
    subject text,
    description text,
    customer_id uuid
);


ALTER TABLE public.reported_issues OWNER TO admin;

--
-- Name: unit; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.unit (
    id uuid NOT NULL,
    unit_name text,
    type text
);


ALTER TABLE public.unit OWNER TO admin;

--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.customer (id, firstname, lastname) FROM stdin;
\.


--
-- Data for Name: customer_license_contract; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.customer_license_contract (customer_id, license_contract_id) FROM stdin;
\.


--
-- Data for Name: food_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.food_history (id, food_name, meal_id, amount, unit) FROM stdin;
\.


--
-- Data for Name: food_history_nutrient; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.food_history_nutrient (foodhistory_id, nutrient_id) FROM stdin;
\.


--
-- Data for Name: food_plan; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.food_plan (id, food_name, meal_id) FROM stdin;
\.


--
-- Data for Name: license; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.license (id, license_name, duration, price, active) FROM stdin;
\.


--
-- Data for Name: meal_food_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.meal_food_history (meal_history_id, food_id, amount, unit_id) FROM stdin;
\.


--
-- Data for Name: meal_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.meal_history (id, recordedby, patient_id, recordeddate) FROM stdin;
\.


--
-- Data for Name: meal_recipe_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.meal_recipe_history (recipe_history_id, meal_history_id, unit_id) FROM stdin;
\.


--
-- Data for Name: module; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.module (id, module_name, description) FROM stdin;
\.


--
-- Data for Name: nutrient; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.nutrient (id, nutrient_name, preferred_unit) FROM stdin;
\.


--
-- Data for Name: patient; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.patient (id, firstname, lastname, customer_id) FROM stdin;
\.


--
-- Data for Name: patient_module; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.patient_module (patient_id, module_id) FROM stdin;
\.


--
-- Data for Name: recipe_food; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.recipe_food (food_id, recipe_id, amount, unit_id) FROM stdin;
\.


--
-- Data for Name: recipe_food_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.recipe_food_history (food_id, recipe_id, amount, unit_id) FROM stdin;
\.


--
-- Data for Name: recipe_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.recipe_history (id, recipe_name, tags, notes) FROM stdin;
\.


--
-- Data for Name: recipe_plan; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.recipe_plan (id, recipe_name, tags, notes) FROM stdin;
\.


--
-- Data for Name: reported_issues; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.reported_issues (id, subject, description, customer_id) FROM stdin;
\.


--
-- Data for Name: unit; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.unit (id, unit_name, type) FROM stdin;
\.


--
-- Name: customer_license_contract customer_license_contract_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.customer_license_contract
    ADD CONSTRAINT customer_license_contract_pkey PRIMARY KEY (customer_id, license_contract_id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: food_history_nutrient food_history_nutrient_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food_history_nutrient
    ADD CONSTRAINT food_history_nutrient_pkey PRIMARY KEY (foodhistory_id, nutrient_id);


--
-- Name: food_history food_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food_history
    ADD CONSTRAINT food_history_pkey PRIMARY KEY (id);


--
-- Name: food_plan food_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food_plan
    ADD CONSTRAINT food_plan_pkey PRIMARY KEY (id);


--
-- Name: license license_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.license
    ADD CONSTRAINT license_pkey PRIMARY KEY (id);


--
-- Name: meal_food_history meal_food_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.meal_food_history
    ADD CONSTRAINT meal_food_history_pkey PRIMARY KEY (meal_history_id, food_id);


--
-- Name: meal_history meal_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.meal_history
    ADD CONSTRAINT meal_history_pkey PRIMARY KEY (id);


--
-- Name: meal_recipe_history meal_recipe_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.meal_recipe_history
    ADD CONSTRAINT meal_recipe_history_pkey PRIMARY KEY (recipe_history_id, meal_history_id);


--
-- Name: module module_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_pkey PRIMARY KEY (id);


--
-- Name: nutrient nutrient_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.nutrient
    ADD CONSTRAINT nutrient_pkey PRIMARY KEY (id);


--
-- Name: patient_module patient_module_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.patient_module
    ADD CONSTRAINT patient_module_pkey PRIMARY KEY (patient_id, module_id);


--
-- Name: patient patient_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_pkey PRIMARY KEY (id);


--
-- Name: recipe_food_history recipe_food_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.recipe_food_history
    ADD CONSTRAINT recipe_food_history_pkey PRIMARY KEY (food_id, recipe_id);


--
-- Name: recipe_food recipe_food_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.recipe_food
    ADD CONSTRAINT recipe_food_pkey PRIMARY KEY (food_id, recipe_id);


--
-- Name: recipe_history recipe_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.recipe_history
    ADD CONSTRAINT recipe_history_pkey PRIMARY KEY (id);


--
-- Name: recipe_plan recipe_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.recipe_plan
    ADD CONSTRAINT recipe_plan_pkey PRIMARY KEY (id);


--
-- Name: reported_issues reported_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reported_issues
    ADD CONSTRAINT reported_issues_pkey PRIMARY KEY (id);


--
-- Name: unit unit_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT unit_pkey PRIMARY KEY (id);


--
-- Name: customer_license_contract customer_license_contract_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.customer_license_contract
    ADD CONSTRAINT customer_license_contract_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- Name: food_history food_history_meal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food_history
    ADD CONSTRAINT food_history_meal_id_fkey FOREIGN KEY (meal_id) REFERENCES public.meal_history(id);


--
-- Name: food_history_nutrient food_history_nutrient_foodhistory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food_history_nutrient
    ADD CONSTRAINT food_history_nutrient_foodhistory_id_fkey FOREIGN KEY (foodhistory_id) REFERENCES public.food_history(id);


--
-- Name: food_history_nutrient food_history_nutrient_nutrient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food_history_nutrient
    ADD CONSTRAINT food_history_nutrient_nutrient_id_fkey FOREIGN KEY (nutrient_id) REFERENCES public.nutrient(id);


--
-- Name: food_history food_history_unit_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food_history
    ADD CONSTRAINT food_history_unit_fkey FOREIGN KEY (unit) REFERENCES public.unit(id);


--
-- Name: meal_food_history meal_food_history_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.meal_food_history
    ADD CONSTRAINT meal_food_history_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food_history(id);


--
-- Name: meal_food_history meal_food_history_meal_history_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.meal_food_history
    ADD CONSTRAINT meal_food_history_meal_history_id_fkey FOREIGN KEY (meal_history_id) REFERENCES public.meal_history(id);


--
-- Name: meal_food_history meal_food_history_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.meal_food_history
    ADD CONSTRAINT meal_food_history_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.unit(id);


--
-- Name: meal_history meal_history_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.meal_history
    ADD CONSTRAINT meal_history_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(id);


--
-- Name: meal_recipe_history meal_recipe_history_meal_history_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.meal_recipe_history
    ADD CONSTRAINT meal_recipe_history_meal_history_id_fkey FOREIGN KEY (meal_history_id) REFERENCES public.meal_history(id);


--
-- Name: meal_recipe_history meal_recipe_history_recipe_history_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.meal_recipe_history
    ADD CONSTRAINT meal_recipe_history_recipe_history_id_fkey FOREIGN KEY (recipe_history_id) REFERENCES public.recipe_history(id);


--
-- Name: meal_recipe_history meal_recipe_history_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.meal_recipe_history
    ADD CONSTRAINT meal_recipe_history_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.unit(id);


--
-- Name: patient patient_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- Name: patient_module patient_module_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.patient_module
    ADD CONSTRAINT patient_module_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.module(id);


--
-- Name: patient_module patient_module_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.patient_module
    ADD CONSTRAINT patient_module_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(id);


--
-- Name: recipe_food recipe_food_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.recipe_food
    ADD CONSTRAINT recipe_food_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food_history(id);


--
-- Name: recipe_food_history recipe_food_history_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.recipe_food_history
    ADD CONSTRAINT recipe_food_history_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food_history(id);


--
-- Name: recipe_food_history recipe_food_history_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.recipe_food_history
    ADD CONSTRAINT recipe_food_history_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipe_history(id);


--
-- Name: recipe_food_history recipe_food_history_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.recipe_food_history
    ADD CONSTRAINT recipe_food_history_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.unit(id);


--
-- Name: recipe_food recipe_food_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.recipe_food
    ADD CONSTRAINT recipe_food_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipe_plan(id);


--
-- Name: recipe_food recipe_food_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.recipe_food
    ADD CONSTRAINT recipe_food_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.unit(id);


--
-- Name: reported_issues reported_issues_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reported_issues
    ADD CONSTRAINT reported_issues_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- PostgreSQL database dump complete
--

