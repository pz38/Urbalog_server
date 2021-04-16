CREATE SCHEMA IF NOT EXISTS urbalog_v2;

CREATE TABLE IF NOT EXISTS urbalog_v2.bet_history
(
  id integer NOT NULL,
  game_key varchar(255),
  player_id varchar(255),
  political_bet varchar(255),
  social_bet varchar(255),
  economical_bet varchar(255),
  turn varchar(255),
  building varchar(255),
  created_at text
);

-- alter table urbalog_v2.bet_history add xxxx  text;

CREATE TABLE IF NOT EXISTS urbalog_v2.buildings
(
  id integer NOT NULL,
  game_key varchar(255),  
  name varchar(255),
  description text,
  political_cost varchar(255),
  social_cost varchar(255),
  economical_cost varchar(255),
  attract_score varchar(255),
  fluid_score varchar(255),
  envi_score varchar(255),
  logi_score varchar(255),
  logi_description text,
  created_at text
);

CREATE TABLE IF NOT EXISTS urbalog_v2.games
(
  id integer NOT NULL,
  game_key varchar(255),
  nb_players varchar(255),
  nb_buildings varchar(255),
  nb_buildings_per_turn varchar(255),
  game_timer varchar(255),
  turn_timer varchar(255),
  score_fuild varchar(255),
  score_attract varchar(255),
  score_envi varchar(255),
  score_logi varchar(255),
  nb_turn varchar(255),
  created_at text
);

CREATE TABLE IF NOT EXISTS urbalog_v2.players
(
  id integer NOT NULL,
  game_keys varchar(255),
  game_id varchar(255),
  nom varchar(255),
  firstname varchar(255),
  sexe varchar(255),
  age varchar(255),
  residence varchar(255),
  statut_activite varchar(255),
  job varchar(255),
  secteur_activite varchar(255),
  entreprise varchar(255),
  role_player varchar(255),
  created_at text
);

CREATE TABLE IF NOT EXISTS urbalog_v2.roles
(
  id integer NOT NULL,
  game_key varchar(255),
  name varchar(255),
  social_tokens integer,
  economical_tokens integer,
  political_tokens integer,
  hold varchar(255),
  improve varchar(255),
  created_at text
);

CREATE TABLE IF NOT EXISTS urbalog_v2.turn_history
(
  id integer NOT NULL,
  game_key varchar(255),
  turn_number integer,
  building_market_1 varchar(255),
  building_market_2 varchar(255),
  building_market_3 varchar(255),
  building_market_4 varchar(255),
  building_market_5 varchar(255),
  building_completed_1 varchar(255),
  building_completed_2 varchar(255),
  building_completed_3 varchar(255),
  building_completed_4 varchar(255),
  building_completed_5 varchar(255),
  created_at text
);


