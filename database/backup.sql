--
-- PostgreSQL database dump
--

\restrict RQE9FNFwqhydThRR3pJ09hhywSMHwYf1rdNPspufkPUjEjVjspwcKA6W03dkqJA

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-28 13:46:52

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 270 (class 1255 OID 17374)
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 267 (class 1259 OID 24807)
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    activity_id integer NOT NULL,
    activity character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 24806)
-- Name: activities_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activities_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activities_activity_id_seq OWNER TO postgres;

--
-- TOC entry 5365 (class 0 OID 0)
-- Dependencies: 266
-- Name: activities_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activities_activity_id_seq OWNED BY public.activities.activity_id;


--
-- TOC entry 224 (class 1259 OID 16981)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    admin_id integer NOT NULL,
    user_id integer NOT NULL,
    designation character varying(100),
    office_phone character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16980)
-- Name: admins_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_admin_id_seq OWNER TO postgres;

--
-- TOC entry 5366 (class 0 OID 0)
-- Dependencies: 223
-- Name: admins_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_admin_id_seq OWNED BY public.admins.admin_id;


--
-- TOC entry 252 (class 1259 OID 17277)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    audit_id integer NOT NULL,
    user_id integer,
    action character varying(255),
    description text,
    ip_address character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 17276)
-- Name: audit_logs_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_audit_id_seq OWNER TO postgres;

--
-- TOC entry 5367 (class 0 OID 0)
-- Dependencies: 251
-- Name: audit_logs_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_audit_id_seq OWNED BY public.audit_logs.audit_id;


--
-- TOC entry 236 (class 1259 OID 17093)
-- Name: candidate_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidate_applications (
    application_id integer NOT NULL,
    candidate_id integer NOT NULL,
    election_id integer NOT NULL,
    position_id integer NOT NULL,
    constituency character varying(100),
    application_status character varying(30) DEFAULT 'Submitted'::character varying,
    remarks text,
    applied_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.candidate_applications OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17092)
-- Name: candidate_applications_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidate_applications_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidate_applications_application_id_seq OWNER TO postgres;

--
-- TOC entry 5368 (class 0 OID 0)
-- Dependencies: 235
-- Name: candidate_applications_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidate_applications_application_id_seq OWNED BY public.candidate_applications.application_id;


--
-- TOC entry 238 (class 1259 OID 17123)
-- Name: candidate_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidate_documents (
    document_id integer NOT NULL,
    application_id integer NOT NULL,
    document_type character varying(100),
    document_path character varying(255),
    verification_status character varying(30) DEFAULT 'Pending'::character varying,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.candidate_documents OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 17122)
-- Name: candidate_documents_document_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidate_documents_document_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidate_documents_document_id_seq OWNER TO postgres;

--
-- TOC entry 5369 (class 0 OID 0)
-- Dependencies: 237
-- Name: candidate_documents_document_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidate_documents_document_id_seq OWNED BY public.candidate_documents.document_id;


--
-- TOC entry 240 (class 1259 OID 17139)
-- Name: candidate_symbols; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidate_symbols (
    symbol_id integer NOT NULL,
    application_id integer NOT NULL,
    symbol_name character varying(100),
    symbol_image character varying(255),
    assigned_by integer,
    assigned_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.candidate_symbols OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 17138)
-- Name: candidate_symbols_symbol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidate_symbols_symbol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidate_symbols_symbol_id_seq OWNER TO postgres;

--
-- TOC entry 5370 (class 0 OID 0)
-- Dependencies: 239
-- Name: candidate_symbols_symbol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidate_symbols_symbol_id_seq OWNED BY public.candidate_symbols.symbol_id;


--
-- TOC entry 230 (class 1259 OID 17036)
-- Name: candidates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidates (
    candidate_id integer NOT NULL,
    user_id integer NOT NULL,
    biography text,
    profile_photo character varying(255),
    signature character varying(255),
    status character varying(30) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    election_id integer,
    position_id integer,
    profile_completed boolean DEFAULT false,
    verification_status character varying(20) DEFAULT 'Not Completed'::character varying,
    gender character varying(20),
    dob date,
    address text,
    qualification text,
    experience text,
    party_name character varying(100),
    manifesto text,
    photo character varying(255),
    id_proof character varying(255),
    nomination_form character varying(255),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    symbol character varying(255)
);


ALTER TABLE public.candidates OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17035)
-- Name: candidates_candidate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidates_candidate_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidates_candidate_id_seq OWNER TO postgres;

--
-- TOC entry 5371 (class 0 OID 0)
-- Dependencies: 229
-- Name: candidates_candidate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidates_candidate_id_seq OWNED BY public.candidates.candidate_id;


--
-- TOC entry 226 (class 1259 OID 16998)
-- Name: election_officers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.election_officers (
    officer_id integer NOT NULL,
    user_id integer NOT NULL,
    employee_id character varying(50),
    department character varying(100),
    designation character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.election_officers OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16997)
-- Name: election_officers_officer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.election_officers_officer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.election_officers_officer_id_seq OWNER TO postgres;

--
-- TOC entry 5372 (class 0 OID 0)
-- Dependencies: 225
-- Name: election_officers_officer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.election_officers_officer_id_seq OWNED BY public.election_officers.officer_id;


--
-- TOC entry 248 (class 1259 OID 17235)
-- Name: election_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.election_results (
    result_id integer NOT NULL,
    election_id integer,
    position_id integer,
    candidate_id integer,
    total_votes integer DEFAULT 0,
    percentage numeric(5,2),
    winner boolean DEFAULT false,
    published_at timestamp without time zone
);


ALTER TABLE public.election_results OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 17234)
-- Name: election_results_result_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.election_results_result_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.election_results_result_id_seq OWNER TO postgres;

--
-- TOC entry 5373 (class 0 OID 0)
-- Dependencies: 247
-- Name: election_results_result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.election_results_result_id_seq OWNED BY public.election_results.result_id;


--
-- TOC entry 232 (class 1259 OID 17056)
-- Name: elections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.elections (
    election_id integer NOT NULL,
    election_name character varying(200) NOT NULL,
    description text,
    election_category character varying(100),
    election_type character varying(100),
    election_year integer,
    start_date date,
    end_date date,
    start_time time without time zone,
    end_time time without time zone,
    status character varying(30) DEFAULT 'Upcoming'::character varying,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.elections OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17055)
-- Name: elections_election_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.elections_election_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.elections_election_id_seq OWNER TO postgres;

--
-- TOC entry 5374 (class 0 OID 0)
-- Dependencies: 231
-- Name: elections_election_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.elections_election_id_seq OWNED BY public.elections.election_id;


--
-- TOC entry 246 (class 1259 OID 17216)
-- Name: encrypted_votes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encrypted_votes (
    encrypted_vote_id integer NOT NULL,
    vote_id integer,
    encrypted_data text NOT NULL,
    encryption_algorithm character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.encrypted_votes OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 17215)
-- Name: encrypted_votes_encrypted_vote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.encrypted_votes_encrypted_vote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.encrypted_votes_encrypted_vote_id_seq OWNER TO postgres;

--
-- TOC entry 5375 (class 0 OID 0)
-- Dependencies: 245
-- Name: encrypted_votes_encrypted_vote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.encrypted_votes_encrypted_vote_id_seq OWNED BY public.encrypted_votes.encrypted_vote_id;


--
-- TOC entry 254 (class 1259 OID 17293)
-- Name: login_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_logs (
    login_log_id integer NOT NULL,
    user_id integer,
    login_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    logout_time timestamp without time zone,
    ip_address character varying(50),
    login_status character varying(50)
);


ALTER TABLE public.login_logs OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 17292)
-- Name: login_logs_login_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_logs_login_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_logs_login_log_id_seq OWNER TO postgres;

--
-- TOC entry 5376 (class 0 OID 0)
-- Dependencies: 253
-- Name: login_logs_login_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_logs_login_log_id_seq OWNED BY public.login_logs.login_log_id;


--
-- TOC entry 242 (class 1259 OID 17161)
-- Name: manifestos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manifestos (
    manifesto_id integer NOT NULL,
    application_id integer NOT NULL,
    vision text,
    mission text,
    goals text,
    plans text,
    why_vote text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.manifestos OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 17160)
-- Name: manifestos_manifesto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manifestos_manifesto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.manifestos_manifesto_id_seq OWNER TO postgres;

--
-- TOC entry 5377 (class 0 OID 0)
-- Dependencies: 241
-- Name: manifestos_manifesto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manifestos_manifesto_id_seq OWNED BY public.manifestos.manifesto_id;


--
-- TOC entry 250 (class 1259 OID 17260)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    user_id integer,
    title character varying(200),
    message text,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 17259)
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_notification_id_seq OWNER TO postgres;

--
-- TOC entry 5378 (class 0 OID 0)
-- Dependencies: 249
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- TOC entry 260 (class 1259 OID 17336)
-- Name: otp_verifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otp_verifications (
    otp_id integer NOT NULL,
    user_id integer NOT NULL,
    email character varying(150) NOT NULL,
    otp_code character varying(6) NOT NULL,
    purpose character varying(50) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_used boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.otp_verifications OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 17335)
-- Name: otp_verifications_otp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.otp_verifications_otp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.otp_verifications_otp_id_seq OWNER TO postgres;

--
-- TOC entry 5379 (class 0 OID 0)
-- Dependencies: 259
-- Name: otp_verifications_otp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.otp_verifications_otp_id_seq OWNED BY public.otp_verifications.otp_id;


--
-- TOC entry 264 (class 1259 OID 24792)
-- Name: password_reset_otp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_otp (
    otp_id integer NOT NULL,
    email character varying(100) NOT NULL,
    otp character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_verified boolean DEFAULT false
);


ALTER TABLE public.password_reset_otp OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 24791)
-- Name: password_reset_otp_otp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_otp_otp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_otp_otp_id_seq OWNER TO postgres;

--
-- TOC entry 5380 (class 0 OID 0)
-- Dependencies: 263
-- Name: password_reset_otp_otp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_otp_otp_id_seq OWNED BY public.password_reset_otp.otp_id;


--
-- TOC entry 234 (class 1259 OID 17074)
-- Name: positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.positions (
    position_id integer NOT NULL,
    election_id integer NOT NULL,
    position_name character varying(100) NOT NULL,
    description text,
    max_candidates integer DEFAULT 1,
    eligibility text,
    status character varying(30) DEFAULT 'Active'::character varying
);


ALTER TABLE public.positions OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17073)
-- Name: positions_position_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.positions_position_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.positions_position_id_seq OWNER TO postgres;

--
-- TOC entry 5381 (class 0 OID 0)
-- Dependencies: 233
-- Name: positions_position_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.positions_position_id_seq OWNED BY public.positions.position_id;


--
-- TOC entry 262 (class 1259 OID 17356)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    token_id integer NOT NULL,
    user_id integer NOT NULL,
    refresh_token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 17355)
-- Name: refresh_tokens_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_tokens_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_token_id_seq OWNER TO postgres;

--
-- TOC entry 5382 (class 0 OID 0)
-- Dependencies: 261
-- Name: refresh_tokens_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_tokens_token_id_seq OWNED BY public.refresh_tokens.token_id;


--
-- TOC entry 256 (class 1259 OID 17307)
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    report_id integer NOT NULL,
    report_name character varying(200),
    report_type character varying(100),
    generated_by integer,
    generated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    file_path character varying(255)
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 17306)
-- Name: reports_report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reports_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_report_id_seq OWNER TO postgres;

--
-- TOC entry 5383 (class 0 OID 0)
-- Dependencies: 255
-- Name: reports_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reports_report_id_seq OWNED BY public.reports.report_id;


--
-- TOC entry 269 (class 1259 OID 59653)
-- Name: results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.results (
    result_id integer NOT NULL,
    election_id integer NOT NULL,
    position_id integer NOT NULL,
    candidate_id integer NOT NULL,
    total_votes integer DEFAULT 0,
    vote_percentage numeric(5,2) DEFAULT 0,
    rank integer,
    is_winner boolean DEFAULT false,
    published_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.results OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 59652)
-- Name: results_result_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.results_result_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.results_result_id_seq OWNER TO postgres;

--
-- TOC entry 5384 (class 0 OID 0)
-- Dependencies: 268
-- Name: results_result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.results_result_id_seq OWNED BY public.results.result_id;


--
-- TOC entry 220 (class 1259 OID 16937)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16936)
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_role_id_seq OWNER TO postgres;

--
-- TOC entry 5385 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- TOC entry 258 (class 1259 OID 17323)
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    setting_id integer NOT NULL,
    setting_key character varying(100),
    setting_value text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 17322)
-- Name: settings_setting_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.settings_setting_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.settings_setting_id_seq OWNER TO postgres;

--
-- TOC entry 5386 (class 0 OID 0)
-- Dependencies: 257
-- Name: settings_setting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.settings_setting_id_seq OWNED BY public.settings.setting_id;


--
-- TOC entry 222 (class 1259 OID 16948)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    full_name character varying(150) NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(20),
    password character varying(255) NOT NULL,
    voter_id character varying(30) NOT NULL,
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    profile_image text,
    profile_photo character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16947)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5387 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 265 (class 1259 OID 24805)
-- Name: users_voter_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_voter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_voter_id_seq OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 17017)
-- Name: voters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.voters (
    voter_pk integer NOT NULL,
    user_id integer NOT NULL,
    department character varying(100),
    course character varying(100),
    academic_year character varying(30),
    section character varying(20),
    semester character varying(20),
    roll_number character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.voters OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17016)
-- Name: voters_voter_pk_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.voters_voter_pk_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.voters_voter_pk_seq OWNER TO postgres;

--
-- TOC entry 5388 (class 0 OID 0)
-- Dependencies: 227
-- Name: voters_voter_pk_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.voters_voter_pk_seq OWNED BY public.voters.voter_pk;


--
-- TOC entry 244 (class 1259 OID 17181)
-- Name: votes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.votes (
    vote_id integer NOT NULL,
    election_id integer NOT NULL,
    position_id integer NOT NULL,
    voter_id integer NOT NULL,
    candidate_id integer NOT NULL,
    voted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.votes OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 17180)
-- Name: votes_vote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.votes_vote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.votes_vote_id_seq OWNER TO postgres;

--
-- TOC entry 5389 (class 0 OID 0)
-- Dependencies: 243
-- Name: votes_vote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.votes_vote_id_seq OWNED BY public.votes.vote_id;


--
-- TOC entry 5038 (class 2604 OID 24810)
-- Name: activities activity_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities ALTER COLUMN activity_id SET DEFAULT nextval('public.activities_activity_id_seq'::regclass);


--
-- TOC entry 4984 (class 2604 OID 16984)
-- Name: admins admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN admin_id SET DEFAULT nextval('public.admins_admin_id_seq'::regclass);


--
-- TOC entry 5022 (class 2604 OID 17280)
-- Name: audit_logs audit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN audit_id SET DEFAULT nextval('public.audit_logs_audit_id_seq'::regclass);


--
-- TOC entry 5002 (class 2604 OID 17096)
-- Name: candidate_applications application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_applications ALTER COLUMN application_id SET DEFAULT nextval('public.candidate_applications_application_id_seq'::regclass);


--
-- TOC entry 5005 (class 2604 OID 17126)
-- Name: candidate_documents document_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_documents ALTER COLUMN document_id SET DEFAULT nextval('public.candidate_documents_document_id_seq'::regclass);


--
-- TOC entry 5008 (class 2604 OID 17142)
-- Name: candidate_symbols symbol_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_symbols ALTER COLUMN symbol_id SET DEFAULT nextval('public.candidate_symbols_symbol_id_seq'::regclass);


--
-- TOC entry 4990 (class 2604 OID 17039)
-- Name: candidates candidate_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates ALTER COLUMN candidate_id SET DEFAULT nextval('public.candidates_candidate_id_seq'::regclass);


--
-- TOC entry 4986 (class 2604 OID 17001)
-- Name: election_officers officer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.election_officers ALTER COLUMN officer_id SET DEFAULT nextval('public.election_officers_officer_id_seq'::regclass);


--
-- TOC entry 5016 (class 2604 OID 17238)
-- Name: election_results result_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.election_results ALTER COLUMN result_id SET DEFAULT nextval('public.election_results_result_id_seq'::regclass);


--
-- TOC entry 4996 (class 2604 OID 17059)
-- Name: elections election_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elections ALTER COLUMN election_id SET DEFAULT nextval('public.elections_election_id_seq'::regclass);


--
-- TOC entry 5014 (class 2604 OID 17219)
-- Name: encrypted_votes encrypted_vote_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encrypted_votes ALTER COLUMN encrypted_vote_id SET DEFAULT nextval('public.encrypted_votes_encrypted_vote_id_seq'::regclass);


--
-- TOC entry 5024 (class 2604 OID 17296)
-- Name: login_logs login_log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs ALTER COLUMN login_log_id SET DEFAULT nextval('public.login_logs_login_log_id_seq'::regclass);


--
-- TOC entry 5010 (class 2604 OID 17164)
-- Name: manifestos manifesto_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manifestos ALTER COLUMN manifesto_id SET DEFAULT nextval('public.manifestos_manifesto_id_seq'::regclass);


--
-- TOC entry 5019 (class 2604 OID 17263)
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- TOC entry 5030 (class 2604 OID 17339)
-- Name: otp_verifications otp_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_verifications ALTER COLUMN otp_id SET DEFAULT nextval('public.otp_verifications_otp_id_seq'::regclass);


--
-- TOC entry 5035 (class 2604 OID 24795)
-- Name: password_reset_otp otp_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_otp ALTER COLUMN otp_id SET DEFAULT nextval('public.password_reset_otp_otp_id_seq'::regclass);


--
-- TOC entry 4999 (class 2604 OID 17077)
-- Name: positions position_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions ALTER COLUMN position_id SET DEFAULT nextval('public.positions_position_id_seq'::regclass);


--
-- TOC entry 5033 (class 2604 OID 17359)
-- Name: refresh_tokens token_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN token_id SET DEFAULT nextval('public.refresh_tokens_token_id_seq'::regclass);


--
-- TOC entry 5026 (class 2604 OID 17310)
-- Name: reports report_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports ALTER COLUMN report_id SET DEFAULT nextval('public.reports_report_id_seq'::regclass);


--
-- TOC entry 5040 (class 2604 OID 59656)
-- Name: results result_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results ALTER COLUMN result_id SET DEFAULT nextval('public.results_result_id_seq'::regclass);


--
-- TOC entry 4978 (class 2604 OID 16940)
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- TOC entry 5028 (class 2604 OID 17326)
-- Name: settings setting_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings ALTER COLUMN setting_id SET DEFAULT nextval('public.settings_setting_id_seq'::regclass);


--
-- TOC entry 4979 (class 2604 OID 16951)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4988 (class 2604 OID 17020)
-- Name: voters voter_pk; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voters ALTER COLUMN voter_pk SET DEFAULT nextval('public.voters_voter_pk_seq'::regclass);


--
-- TOC entry 5012 (class 2604 OID 17184)
-- Name: votes vote_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes ALTER COLUMN vote_id SET DEFAULT nextval('public.votes_vote_id_seq'::regclass);


--
-- TOC entry 5357 (class 0 OID 24807)
-- Dependencies: 267
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activities (activity_id, activity, created_at, user_id) FROM stdin;
59	Deactivated Officer : officer1	2026-09-28 00:41:30.535573	45
60	Activated Officer : officer1	2026-09-28 00:41:33.316948	45
61	Deactivated Officer : officer1	2026-09-28 12:41:36.218511	45
62	Activated Officer : officer1	2026-09-28 12:41:36.919129	45
\.


--
-- TOC entry 5314 (class 0 OID 16981)
-- Dependencies: 224
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (admin_id, user_id, designation, office_phone, created_at) FROM stdin;
\.


--
-- TOC entry 5342 (class 0 OID 17277)
-- Dependencies: 252
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (audit_id, user_id, action, description, ip_address, created_at) FROM stdin;
\.


--
-- TOC entry 5326 (class 0 OID 17093)
-- Dependencies: 236
-- Data for Name: candidate_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidate_applications (application_id, candidate_id, election_id, position_id, constituency, application_status, remarks, applied_at) FROM stdin;
5	2	6	2	Computer Science Department	Approved	Approved by Election Officer	2026-09-27 19:20:23.506218
\.


--
-- TOC entry 5328 (class 0 OID 17123)
-- Dependencies: 238
-- Data for Name: candidate_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidate_documents (document_id, application_id, document_type, document_path, verification_status, uploaded_at) FROM stdin;
\.


--
-- TOC entry 5330 (class 0 OID 17139)
-- Dependencies: 240
-- Data for Name: candidate_symbols; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidate_symbols (symbol_id, application_id, symbol_name, symbol_image, assigned_by, assigned_date) FROM stdin;
\.


--
-- TOC entry 5320 (class 0 OID 17036)
-- Dependencies: 230
-- Data for Name: candidates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidates (candidate_id, user_id, biography, profile_photo, signature, status, created_at, election_id, position_id, profile_completed, verification_status, gender, dob, address, qualification, experience, party_name, manifesto, photo, id_proof, nomination_form, updated_at, symbol) FROM stdin;
1	36	\N	\N	\N	Approved	2026-09-16 23:43:12.177913	5	2	f	Not Completed	\N	\N	\N	\N	\N	\N	I will improve the campus, organize more events, and enhance student facilities.	\N	\N	\N	2026-09-16 23:43:12.177913	lotus.png
2	49		\N	\N	Approved	2026-09-27 19:19:56.915772	\N	\N	f	Not Completed	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-09-27 19:19:56.915772	car
\.


--
-- TOC entry 5316 (class 0 OID 16998)
-- Dependencies: 226
-- Data for Name: election_officers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.election_officers (officer_id, user_id, employee_id, department, designation, created_at) FROM stdin;
10	45	EMP1	IT	\N	2026-09-02 02:25:05.475337
\.


--
-- TOC entry 5338 (class 0 OID 17235)
-- Dependencies: 248
-- Data for Name: election_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.election_results (result_id, election_id, position_id, candidate_id, total_votes, percentage, winner, published_at) FROM stdin;
\.


--
-- TOC entry 5322 (class 0 OID 17056)
-- Dependencies: 232
-- Data for Name: elections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.elections (election_id, election_name, description, election_category, election_type, election_year, start_date, end_date, start_time, end_time, status, created_by, created_at) FROM stdin;
6	student election1		\N	\N	\N	2026-09-27	2026-09-28	17:40:00	05:40:00	Completed	\N	2026-09-27 17:41:05.684746
5	student election	student	\N	\N	\N	2026-09-16	2026-09-17	22:03:00	22:03:00	Completed	\N	2026-09-16 22:03:33.561817
\.


--
-- TOC entry 5336 (class 0 OID 17216)
-- Dependencies: 246
-- Data for Name: encrypted_votes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.encrypted_votes (encrypted_vote_id, vote_id, encrypted_data, encryption_algorithm, created_at) FROM stdin;
\.


--
-- TOC entry 5344 (class 0 OID 17293)
-- Dependencies: 254
-- Data for Name: login_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_logs (login_log_id, user_id, login_time, logout_time, ip_address, login_status) FROM stdin;
\.


--
-- TOC entry 5332 (class 0 OID 17161)
-- Dependencies: 242
-- Data for Name: manifestos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manifestos (manifesto_id, application_id, vision, mission, goals, plans, why_vote, created_at) FROM stdin;
\.


--
-- TOC entry 5340 (class 0 OID 17260)
-- Dependencies: 250
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (notification_id, user_id, title, message, is_read, created_at) FROM stdin;
\.


--
-- TOC entry 5350 (class 0 OID 17336)
-- Dependencies: 260
-- Data for Name: otp_verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otp_verifications (otp_id, user_id, email, otp_code, purpose, expires_at, is_used, created_at) FROM stdin;
\.


--
-- TOC entry 5354 (class 0 OID 24792)
-- Dependencies: 264
-- Data for Name: password_reset_otp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_otp (otp_id, email, otp, expires_at, created_at, is_verified) FROM stdin;
8	deekshithreddykunta01@gmail.com	198810	2026-09-16 19:26:49.994	2026-09-16 19:21:50.05742	t
\.


--
-- TOC entry 5324 (class 0 OID 17074)
-- Dependencies: 234
-- Data for Name: positions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.positions (position_id, election_id, position_name, description, max_candidates, eligibility, status) FROM stdin;
2	6	President	president	5		Active
\.


--
-- TOC entry 5352 (class 0 OID 17356)
-- Dependencies: 262
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (token_id, user_id, refresh_token, expires_at, created_at) FROM stdin;
\.


--
-- TOC entry 5346 (class 0 OID 17307)
-- Dependencies: 256
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (report_id, report_name, report_type, generated_by, generated_at, file_path) FROM stdin;
\.


--
-- TOC entry 5359 (class 0 OID 59653)
-- Dependencies: 269
-- Data for Name: results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.results (result_id, election_id, position_id, candidate_id, total_votes, vote_percentage, rank, is_winner, published_at) FROM stdin;
1	5	2	1	1	100.00	1	t	2026-09-28 05:16:33.795046
\.


--
-- TOC entry 5310 (class 0 OID 16937)
-- Dependencies: 220
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (role_id, role_name) FROM stdin;
1	Admin
2	Election Officer
3	Candidate
4	Voter
\.


--
-- TOC entry 5348 (class 0 OID 17323)
-- Dependencies: 258
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (setting_id, setting_key, setting_value, updated_at) FROM stdin;
\.


--
-- TOC entry 5312 (class 0 OID 16948)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, role_id, full_name, username, email, phone, password, voter_id, is_verified, is_active, created_at, updated_at, profile_image, profile_photo) FROM stdin;
25	4	hanuman	hanuman	hanuman@gmail.com	837425147111	$2b$10$hwITsXc0su6koFQVc7Wz6uj/uTUVtQvwFe5Y3zumVEytZRZyU7fn.	VOT202600012	f	t	2026-08-29 23:49:20.298221	2026-09-17 08:56:38.177977	\N	\N
3	4	Deekshith reddy	chinna	xyz@gmail.com	8374251476	$2b$10$2ihwqigFyj590yjHVnLEtu.nGXYjsAQ3GeA5QA129XbCt.2FXVk.a	VOT202600003	f	t	2026-08-25 03:46:03.309147	2026-08-25 03:46:03.309147	\N	\N
26	4	hanuman	 hanuman	hanumann@gmail.com	83742515211	$2b$10$51i8iR.Ux82byFNwZlu9B.Kqd2ZV8GGAEes5GBTTQq/WXzoLSOEbO	VOT202600013	t	t	2026-08-30 00:04:02.714979	2026-09-28 04:34:50.611425	\N	\N
1	4	Deekshith	deekshith	deekshithreddykunta01@gmail.com	8374251521	$2b$10$ncpA8I3X5IMexAch58M.IuV8FTFmeJguAqSaaSmNyrYtZp5UgjEWC	VOT202600001	t	t	2026-08-25 00:56:25.743863	2026-09-28 04:35:01.803716	\N	\N
34	4	Deekshith	my	my@gmail.com	6754321077	$2b$10$Tv//3Bj3pjZpFt3POZ9RXOV/m.bz0uckBSbOKFH/U2/ypJRrEz1wC	VOT202600014	t	t	2026-08-30 03:08:20.945707	2026-09-28 12:33:40.664661	\N	1789598095045.jpg
36	3	Deekshith	deekshit	abc@gmail.com	8374250470	$2b$10$8eB1vYUCmuv4c66QUxfviO2XIjsCaw6C5cxlSL8fk8rO6DKUA.P66	VOT202600016	f	t	2026-08-30 13:32:17.512437	2026-09-17 09:13:37.658359	\N	\N
49	3	deekshith	candidate	candidate@gmail.com	878888888788	$2b$10$t2oUb34FaW.dwuOSE5sOueH76pg.grX1ajKpxilLVyo1lqLk0r2rW	VOT202600019	f	t	2026-09-17 11:35:32.266249	2026-09-28 12:34:34.054618	\N	\N
40	2	officer1	officer11	officer11@gmail.com	63742514712	$2b$10$jkfcW9lxYjcFxfxnyRAjT.92TW1u6lpMxCmenPoikLdXdYkhxQ9JG	VOT202600017	f	t	2026-08-30 23:33:30.982832	2026-08-30 23:33:30.982832	\N	\N
45	2	officer1	officer1	officer1@gmail.com	633425147121	$2b$10$qb88v08RINSh7ereR0/PsenuTxK3oHimBOcfUxXP5mBHCe08psQCO	VOT202600018	f	t	2026-09-02 02:25:05.460196	2026-09-28 12:41:36.894354	\N	\N
23	4	Deekshith reddyy	deek	123@gmail.com	012345678	$2b$10$Vx.NJUxIt74Ci3Izcyik6uy4WL3qdCLeoguGmYb6tDnc7MDtNtlba	VOT202600010	f	t	2026-08-29 23:19:43.143754	2026-08-30 01:20:28.75948	\N	\N
13	1	Deekshith reddy	admin	admin@gmail.com	9999999999	$2b$10$iLYPRTM/8XyQVZzaLMuO8erxsUAAc24S0acAH/YUB3QxFiW79yDQC	ADMIN00001	f	t	2026-08-26 06:02:31.600279	2026-09-28 12:49:18.404564	\N	\N
22	4	chotu	chotu	chotu@gmail.com	9903094562	$2b$10$1M6pr4.3nvI7wRRV6Q3TYulYePI2bH99rYaDAQXr4uNKqG.FYiP5.	VOT202600009	f	t	2026-08-27 02:44:08.616163	2026-08-27 02:44:08.616163	\N	\N
\.


--
-- TOC entry 5318 (class 0 OID 17017)
-- Dependencies: 228
-- Data for Name: voters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.voters (voter_pk, user_id, department, course, academic_year, section, semester, roll_number, created_at) FROM stdin;
1	3	\N	\N	\N	\N	\N	\N	2026-09-17 00:30:00.085746
2	25	\N	\N	\N	\N	\N	\N	2026-09-17 00:30:00.085746
3	1	\N	\N	\N	\N	\N	\N	2026-09-17 00:30:00.085746
4	34	\N	\N	\N	\N	\N	\N	2026-09-17 00:30:00.085746
6	26	\N	\N	\N	\N	\N	\N	2026-09-17 00:30:00.085746
7	23	\N	\N	\N	\N	\N	\N	2026-09-17 00:30:00.085746
8	22	\N	\N	\N	\N	\N	\N	2026-09-17 00:30:00.085746
\.


--
-- TOC entry 5334 (class 0 OID 17181)
-- Dependencies: 244
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.votes (vote_id, election_id, position_id, voter_id, candidate_id, voted_at) FROM stdin;
4	5	2	4	1	2026-09-17 00:52:25.210923
\.


--
-- TOC entry 5390 (class 0 OID 0)
-- Dependencies: 266
-- Name: activities_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activities_activity_id_seq', 62, true);


--
-- TOC entry 5391 (class 0 OID 0)
-- Dependencies: 223
-- Name: admins_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_admin_id_seq', 1, false);


--
-- TOC entry 5392 (class 0 OID 0)
-- Dependencies: 251
-- Name: audit_logs_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_audit_id_seq', 1, false);


--
-- TOC entry 5393 (class 0 OID 0)
-- Dependencies: 235
-- Name: candidate_applications_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidate_applications_application_id_seq', 5, true);


--
-- TOC entry 5394 (class 0 OID 0)
-- Dependencies: 237
-- Name: candidate_documents_document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidate_documents_document_id_seq', 1, false);


--
-- TOC entry 5395 (class 0 OID 0)
-- Dependencies: 239
-- Name: candidate_symbols_symbol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidate_symbols_symbol_id_seq', 1, false);


--
-- TOC entry 5396 (class 0 OID 0)
-- Dependencies: 229
-- Name: candidates_candidate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidates_candidate_id_seq', 2, true);


--
-- TOC entry 5397 (class 0 OID 0)
-- Dependencies: 225
-- Name: election_officers_officer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.election_officers_officer_id_seq', 11, true);


--
-- TOC entry 5398 (class 0 OID 0)
-- Dependencies: 247
-- Name: election_results_result_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.election_results_result_id_seq', 1, false);


--
-- TOC entry 5399 (class 0 OID 0)
-- Dependencies: 231
-- Name: elections_election_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.elections_election_id_seq', 9, true);


--
-- TOC entry 5400 (class 0 OID 0)
-- Dependencies: 245
-- Name: encrypted_votes_encrypted_vote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.encrypted_votes_encrypted_vote_id_seq', 1, false);


--
-- TOC entry 5401 (class 0 OID 0)
-- Dependencies: 253
-- Name: login_logs_login_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_logs_login_log_id_seq', 1, false);


--
-- TOC entry 5402 (class 0 OID 0)
-- Dependencies: 241
-- Name: manifestos_manifesto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manifestos_manifesto_id_seq', 1, false);


--
-- TOC entry 5403 (class 0 OID 0)
-- Dependencies: 249
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 1, false);


--
-- TOC entry 5404 (class 0 OID 0)
-- Dependencies: 259
-- Name: otp_verifications_otp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.otp_verifications_otp_id_seq', 1, false);


--
-- TOC entry 5405 (class 0 OID 0)
-- Dependencies: 263
-- Name: password_reset_otp_otp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_otp_otp_id_seq', 8, true);


--
-- TOC entry 5406 (class 0 OID 0)
-- Dependencies: 233
-- Name: positions_position_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.positions_position_id_seq', 3, true);


--
-- TOC entry 5407 (class 0 OID 0)
-- Dependencies: 261
-- Name: refresh_tokens_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_tokens_token_id_seq', 1, false);


--
-- TOC entry 5408 (class 0 OID 0)
-- Dependencies: 255
-- Name: reports_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reports_report_id_seq', 1, false);


--
-- TOC entry 5409 (class 0 OID 0)
-- Dependencies: 268
-- Name: results_result_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.results_result_id_seq', 1, true);


--
-- TOC entry 5410 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 4, true);


--
-- TOC entry 5411 (class 0 OID 0)
-- Dependencies: 257
-- Name: settings_setting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.settings_setting_id_seq', 1, false);


--
-- TOC entry 5412 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 49, true);


--
-- TOC entry 5413 (class 0 OID 0)
-- Dependencies: 265
-- Name: users_voter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_voter_id_seq', 1, false);


--
-- TOC entry 5414 (class 0 OID 0)
-- Dependencies: 227
-- Name: voters_voter_pk_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.voters_voter_pk_seq', 8, true);


--
-- TOC entry 5415 (class 0 OID 0)
-- Dependencies: 243
-- Name: votes_vote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.votes_vote_id_seq', 5, true);


--
-- TOC entry 5126 (class 2606 OID 24814)
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (activity_id);


--
-- TOC entry 5060 (class 2606 OID 16989)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);


--
-- TOC entry 5062 (class 2606 OID 16991)
-- Name: admins admins_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);


--
-- TOC entry 5110 (class 2606 OID 17286)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (audit_id);


--
-- TOC entry 5084 (class 2606 OID 17106)
-- Name: candidate_applications candidate_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_applications
    ADD CONSTRAINT candidate_applications_pkey PRIMARY KEY (application_id);


--
-- TOC entry 5088 (class 2606 OID 17132)
-- Name: candidate_documents candidate_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_documents
    ADD CONSTRAINT candidate_documents_pkey PRIMARY KEY (document_id);


--
-- TOC entry 5090 (class 2606 OID 17149)
-- Name: candidate_symbols candidate_symbols_application_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_symbols
    ADD CONSTRAINT candidate_symbols_application_id_key UNIQUE (application_id);


--
-- TOC entry 5092 (class 2606 OID 17147)
-- Name: candidate_symbols candidate_symbols_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_symbols
    ADD CONSTRAINT candidate_symbols_pkey PRIMARY KEY (symbol_id);


--
-- TOC entry 5076 (class 2606 OID 17047)
-- Name: candidates candidates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_pkey PRIMARY KEY (candidate_id);


--
-- TOC entry 5078 (class 2606 OID 17049)
-- Name: candidates candidates_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_user_id_key UNIQUE (user_id);


--
-- TOC entry 5064 (class 2606 OID 17010)
-- Name: election_officers election_officers_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.election_officers
    ADD CONSTRAINT election_officers_employee_id_key UNIQUE (employee_id);


--
-- TOC entry 5066 (class 2606 OID 17006)
-- Name: election_officers election_officers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.election_officers
    ADD CONSTRAINT election_officers_pkey PRIMARY KEY (officer_id);


--
-- TOC entry 5068 (class 2606 OID 17008)
-- Name: election_officers election_officers_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.election_officers
    ADD CONSTRAINT election_officers_user_id_key UNIQUE (user_id);


--
-- TOC entry 5106 (class 2606 OID 17243)
-- Name: election_results election_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.election_results
    ADD CONSTRAINT election_results_pkey PRIMARY KEY (result_id);


--
-- TOC entry 5080 (class 2606 OID 17067)
-- Name: elections elections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elections
    ADD CONSTRAINT elections_pkey PRIMARY KEY (election_id);


--
-- TOC entry 5102 (class 2606 OID 17226)
-- Name: encrypted_votes encrypted_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encrypted_votes
    ADD CONSTRAINT encrypted_votes_pkey PRIMARY KEY (encrypted_vote_id);


--
-- TOC entry 5104 (class 2606 OID 17228)
-- Name: encrypted_votes encrypted_votes_vote_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encrypted_votes
    ADD CONSTRAINT encrypted_votes_vote_id_key UNIQUE (vote_id);


--
-- TOC entry 5112 (class 2606 OID 17300)
-- Name: login_logs login_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT login_logs_pkey PRIMARY KEY (login_log_id);


--
-- TOC entry 5094 (class 2606 OID 17173)
-- Name: manifestos manifestos_application_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manifestos
    ADD CONSTRAINT manifestos_application_id_key UNIQUE (application_id);


--
-- TOC entry 5096 (class 2606 OID 17171)
-- Name: manifestos manifestos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manifestos
    ADD CONSTRAINT manifestos_pkey PRIMARY KEY (manifesto_id);


--
-- TOC entry 5108 (class 2606 OID 17270)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- TOC entry 5120 (class 2606 OID 17349)
-- Name: otp_verifications otp_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_verifications
    ADD CONSTRAINT otp_verifications_pkey PRIMARY KEY (otp_id);


--
-- TOC entry 5124 (class 2606 OID 24802)
-- Name: password_reset_otp password_reset_otp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_otp
    ADD CONSTRAINT password_reset_otp_pkey PRIMARY KEY (otp_id);


--
-- TOC entry 5082 (class 2606 OID 17086)
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (position_id);


--
-- TOC entry 5122 (class 2606 OID 17368)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (token_id);


--
-- TOC entry 5114 (class 2606 OID 17316)
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (report_id);


--
-- TOC entry 5128 (class 2606 OID 59666)
-- Name: results results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_pkey PRIMARY KEY (result_id);


--
-- TOC entry 5046 (class 2606 OID 16944)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- TOC entry 5048 (class 2606 OID 16946)
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- TOC entry 5116 (class 2606 OID 17332)
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (setting_id);


--
-- TOC entry 5118 (class 2606 OID 17334)
-- Name: settings settings_setting_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_setting_key_key UNIQUE (setting_key);


--
-- TOC entry 5086 (class 2606 OID 59689)
-- Name: candidate_applications unique_candidate_position; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_applications
    ADD CONSTRAINT unique_candidate_position UNIQUE (candidate_id, election_id, position_id);


--
-- TOC entry 5098 (class 2606 OID 17194)
-- Name: votes unique_vote; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT unique_vote UNIQUE (election_id, position_id, voter_id);


--
-- TOC entry 5050 (class 2606 OID 16970)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5052 (class 2606 OID 16972)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 5054 (class 2606 OID 16966)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5056 (class 2606 OID 16968)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 5058 (class 2606 OID 16974)
-- Name: users users_voter_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_voter_id_key UNIQUE (voter_id);


--
-- TOC entry 5070 (class 2606 OID 17025)
-- Name: voters voters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voters
    ADD CONSTRAINT voters_pkey PRIMARY KEY (voter_pk);


--
-- TOC entry 5072 (class 2606 OID 17029)
-- Name: voters voters_roll_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voters
    ADD CONSTRAINT voters_roll_number_key UNIQUE (roll_number);


--
-- TOC entry 5074 (class 2606 OID 17027)
-- Name: voters voters_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voters
    ADD CONSTRAINT voters_user_id_key UNIQUE (user_id);


--
-- TOC entry 5100 (class 2606 OID 17192)
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (vote_id);


--
-- TOC entry 5161 (class 2620 OID 17375)
-- Name: users users_updated_at_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER users_updated_at_trigger BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 5157 (class 2606 OID 24815)
-- Name: activities activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 5130 (class 2606 OID 16992)
-- Name: admins admins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 5152 (class 2606 OID 17287)
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 5136 (class 2606 OID 17107)
-- Name: candidate_applications candidate_applications_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_applications
    ADD CONSTRAINT candidate_applications_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(candidate_id) ON DELETE CASCADE;


--
-- TOC entry 5137 (class 2606 OID 17112)
-- Name: candidate_applications candidate_applications_election_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_applications
    ADD CONSTRAINT candidate_applications_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(election_id) ON DELETE CASCADE;


--
-- TOC entry 5138 (class 2606 OID 17117)
-- Name: candidate_applications candidate_applications_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_applications
    ADD CONSTRAINT candidate_applications_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(position_id) ON DELETE CASCADE;


--
-- TOC entry 5139 (class 2606 OID 17133)
-- Name: candidate_documents candidate_documents_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_documents
    ADD CONSTRAINT candidate_documents_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.candidate_applications(application_id) ON DELETE CASCADE;


--
-- TOC entry 5140 (class 2606 OID 17150)
-- Name: candidate_symbols candidate_symbols_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_symbols
    ADD CONSTRAINT candidate_symbols_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.candidate_applications(application_id) ON DELETE CASCADE;


--
-- TOC entry 5141 (class 2606 OID 17155)
-- Name: candidate_symbols candidate_symbols_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_symbols
    ADD CONSTRAINT candidate_symbols_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.election_officers(officer_id) ON DELETE SET NULL;


--
-- TOC entry 5133 (class 2606 OID 17050)
-- Name: candidates candidates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 5131 (class 2606 OID 17011)
-- Name: election_officers election_officers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.election_officers
    ADD CONSTRAINT election_officers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 5148 (class 2606 OID 17254)
-- Name: election_results election_results_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.election_results
    ADD CONSTRAINT election_results_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(candidate_id);


--
-- TOC entry 5149 (class 2606 OID 17244)
-- Name: election_results election_results_election_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.election_results
    ADD CONSTRAINT election_results_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(election_id);


--
-- TOC entry 5150 (class 2606 OID 17249)
-- Name: election_results election_results_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.election_results
    ADD CONSTRAINT election_results_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(position_id);


--
-- TOC entry 5134 (class 2606 OID 17068)
-- Name: elections elections_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elections
    ADD CONSTRAINT elections_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.election_officers(officer_id) ON DELETE SET NULL;


--
-- TOC entry 5147 (class 2606 OID 17229)
-- Name: encrypted_votes encrypted_votes_vote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encrypted_votes
    ADD CONSTRAINT encrypted_votes_vote_id_fkey FOREIGN KEY (vote_id) REFERENCES public.votes(vote_id) ON DELETE CASCADE;


--
-- TOC entry 5129 (class 2606 OID 16975)
-- Name: users fk_user_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE RESTRICT;


--
-- TOC entry 5153 (class 2606 OID 17301)
-- Name: login_logs login_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT login_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 5142 (class 2606 OID 17174)
-- Name: manifestos manifestos_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manifestos
    ADD CONSTRAINT manifestos_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.candidate_applications(application_id) ON DELETE CASCADE;


--
-- TOC entry 5151 (class 2606 OID 17271)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 5155 (class 2606 OID 17350)
-- Name: otp_verifications otp_verifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_verifications
    ADD CONSTRAINT otp_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 5135 (class 2606 OID 17087)
-- Name: positions positions_election_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(election_id) ON DELETE CASCADE;


--
-- TOC entry 5156 (class 2606 OID 17369)
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 5154 (class 2606 OID 17317)
-- Name: reports reports_generated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_generated_by_fkey FOREIGN KEY (generated_by) REFERENCES public.users(user_id);


--
-- TOC entry 5158 (class 2606 OID 59677)
-- Name: results results_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.users(user_id);


--
-- TOC entry 5159 (class 2606 OID 59667)
-- Name: results results_election_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(election_id);


--
-- TOC entry 5160 (class 2606 OID 59672)
-- Name: results results_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(position_id);


--
-- TOC entry 5132 (class 2606 OID 17030)
-- Name: voters voters_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voters
    ADD CONSTRAINT voters_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 5143 (class 2606 OID 17210)
-- Name: votes votes_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(candidate_id) ON DELETE CASCADE;


--
-- TOC entry 5144 (class 2606 OID 17195)
-- Name: votes votes_election_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(election_id) ON DELETE CASCADE;


--
-- TOC entry 5145 (class 2606 OID 17200)
-- Name: votes votes_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(position_id) ON DELETE CASCADE;


--
-- TOC entry 5146 (class 2606 OID 17205)
-- Name: votes votes_voter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_voter_id_fkey FOREIGN KEY (voter_id) REFERENCES public.voters(voter_pk) ON DELETE CASCADE;


-- Completed on 2026-09-28 13:46:53

--
-- PostgreSQL database dump complete
--

\unrestrict RQE9FNFwqhydThRR3pJ09hhywSMHwYf1rdNPspufkPUjEjVjspwcKA6W03dkqJA

