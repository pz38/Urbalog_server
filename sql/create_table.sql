CREATE SCHEMA IF NOT EXISTS urbalog;

CREATE TABLE IF NOT EXISTS urbalog.games
(
  id integer NOT NULL,
  game_key text NOT NULL,
  nb_player integer,
  nb_building  integer,
  score_fluidite  integer,
  score_attractivite integer,
  score_environmental integer,
  score_logistique integer,
  nb_turn integer,
  created_at text
);

-- alter table urbalog.games add xxxx  text;

CREATE TABLE IF NOT EXISTS urbalog.players
(
  id integer NOT NULL,
  game_id integer NOT NULL,
  game_key text,
  nom text,
  prenom text,
  sexe text,
  age text,
  residence text,
  statut_activite text,
  job text,
  secteur_activite text,
  entreprise text,
  mise_politique integer,
  mise_sociale integer,
  mise_economique integer,
  score integer,
  role text,
  created_at text
);

CREATE TABLE IF NOT EXISTS urbalog.bet_history
(
  id integer NOT NULL,
  game_id integer NOT NULL,
  game_key text,
  player_id integer,
  mise_politique integer,
  mise_sociale integer,
  mise_eco integer,
  building text,
  created_at text
);

