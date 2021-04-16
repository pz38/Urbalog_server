
var express = require('express');
var router = express.Router();
var pg = require('pg');
var credentials = require('./database');

var myClient = new pg.Client(credentials.connectionString);
var pool = new pg.Pool(credentials.poolConfig);


//Connect to the database with one client specific to each user 
myClient.connect(function(err){
    if (err){
        return console.error('could not connect to postgres', err);
    }
    else console.log('connection successfull');
});


insertHistory = function(res, h) {
    console.log('Begin: insertHistory');
    console.log('history id='+h.id);

    var sql = "INSERT INTO urbalog.bet_history(id,game_id,game_key," +
     "player_id, mise_politique, mise_sociale, mise_eco, building," + 
     "created_at" + " )";

    // Check if game is already urbalog database
    pool.query("SELECT id, game_key FROM urbalog.bet_history" + 
               " WHERE id='" + h.id + "'" +
               " and game_key = '" + h.game_key + "'",
       function (err, result) {
            if (err) {
               res.end("error - query bet_history");
               console.log('error - query bet_history');
               console.log(err);
            }
            else {
              console.log('history id=' + h.id + ', game_key=' + h.game_key +
                          ', rows count='+result.rows.length);
              if ( result.rows.length == 0 ) {
                console.log('insert history id=' + h.id + ', game_key=' + h.game_key);
                var values = [];

                values.push("('"+h.id+"'",
                "'"+h.game_id+"'",
                "'"+h.game_key+"'",
                "'"+h.player_id+"'",
                "'"+h.mise_politique+"'",
                "'"+h.mise_social+"'",
                "'"+h.mise_eco+"'",
                "'"+h.building+"'",
                "'"+h.created_at+"')");

            //Insert values
            myClient.query(sql + "values " + values.toString(),
              function(err, result){
                if(err){
                  res.end("error: insert");
                  console.log('error with sql function ' + sql +
                              " values "+values.toString());
                  console.log(err);
               }
               else {
                res.end("success");
               }
            });
              }
            }     
         });
    console.log('End: insertHistory');
}

insertPlayer = function(res, p) {
    console.log('Begin: insertPlayer');
    console.log('player id='+p.id);

    var sql = "INSERT INTO urbalog.players(id,game_id,game_key," +
     "nom, prenom, sexe, age, residence, statut_activite, job," +
     "secteur_activite, entreprise," +
     "mise_politique, mise_sociale, mise_economique, score, role," + 
     "created_at" + " )";

    if ( ! 'job' in p ) p.job = undefined;

    // Check if game is already urbalog database
    pool.query("SELECT id, game_key FROM urbalog.players" + 
               " WHERE id='" + p.id + "'" +
               " and game_key = '" + p.game_key + "'",
       function (err, result) {
            if (err) {
               res.end("error - query players");
               console.log('error - query players');
               console.log(err);
            }
            else {
              console.log('player id=' + p.id + ', game_key=' + p.game_key +
                          ', rows count='+result.rows.length);
              if ( result.rows.length == 0 ) {
                console.log('insert player id=' + p.id + ', game_key=' + p.game_key);
                var values = [];

                values.push("('"+p.id+"'",
                "'"+p.game_id+"'",
                "'"+p.game_key+"'",
                "'"+p.nom+"'",
                "'"+p.prénom+"'",
                "'"+p.sexe+"'",
                "'"+p.age+"'",
                "'"+p.residence+"'",
                "'"+p.statut_activité+"'",
                "'"+p.job+"'",
                "'"+p.secteur_activité+"'",
                "'"+p.entreprise+"'",
                "'"+p.mise_politique+"'",
                "'"+p.mise_sociale+"'",
                "'"+p.mise_economique+"'",
                "'"+p.score+"'",
                "'"+p.role+"'",
                "'"+p.created_at+"')");

            //Insert values
            myClient.query(sql + "values " + values.toString(),
              function(err, result){
                if(err){
                  res.end("error: insert");
                  console.log('error with sql function ' + sql +
                              " values "+values.toString());
                  console.log(err);
               }
               else {
                res.end("success");
               }
            });
              }
            }     
         });
    console.log('End: insertPlayer');
}

insertGame = function(res, g) {
    console.log('Begin: insertGame');
    console.log('game_key='+g.game_key);

    var sql = "INSERT INTO urbalog.games(id,game_key,nb_player,nb_building," +
     "score_fluidite,score_attractivite,score_environmental," + 
     "score_logistique,nb_turn,created_at" + " )";

    // Check if game is already urbalog database
    pool.query("SELECT game_key FROM urbalog.games" + 
                                 " WHERE game_key = '" + g.game_key + "'",
       function (err, result) {
            if (err) {
               res.end("error - query games");
               console.log('error - query games');
               console.log(err);
            }
            else {
              console.log('CUR game_key=' + g.game_key);
              for (var j in result.rows){
                  console.log('row game_key=' + result.rows[j].game_key);
              };
              console.log('game_key=' + g.game_key +
                          ', rows count='+result.rows.length);
              if ( result.rows.length == 0 ) {
                console.log('insert data game_key=' + g.game_key);
                var values = [];

                values.push("('"+g.id+"'",
                "'"+g.game_key+"'",
                "'"+g.nb_player+"'",
                "'"+g.nb_building+"'",
                "'"+g.score_fluidité+"'",
                "'"+g.score_attractivité+"'",
                "'"+g.score_environmental+"'",
                "'"+g.score_logistique+"'",
                "'"+g.nb_turn+"'",
                "'"+g.created_at+"')");

            //Insert values
            myClient.query(sql + "values " + values.toString(),
              function(err, result){
                if(err){
                  res.end("error: insert");
                  console.log('error with sql function ' + sql +
                              " values "+values.toString());
                  console.log(err);
               }
               else {
                res.end("success");
               }
            });
              }
            }     
         });
    console.log('End: insertGame');
}


/**
 * Insert games in urbalog database
 */

router.post('/addGames', function(req, res) {

    console.log('Begin: /addGames');
    var data =  JSON.parse(req.body.games_data);
    var games = data.Urbalog.games;
    var players = data.Urbalog.players;
    var bet_history = data.Urbalog.bet_history;


    console.log('total games='+ games.length);
    for (var i=0; i<games.length; i++){
        var game = games[i];
        console.log('i='+i+', game_key=' + game.game_key)
        insertGame(res, game);
    };

    console.log('total players='+ players.length);
    for (var i=0; i<players.length; i++){
        var player = players[i];
        insertPlayer(res, player);
    };

    console.log('total bet_history='+ bet_history.length);
    for (var i=0; i<bet_history.length; i++){
        var histo = bet_history[i];
        insertHistory(res, histo);
    };

    res.end("success");

    console.log('End: /addGames');
});

/**
  * Get data for a game by game_key
  */

router.post('/getGameData',  function(req, res) {
  console.log('Begin: /getGameData');

  console.log('Req:' + req.body.game_key);

  var data =  JSON.parse(req.body.game_key);

  var sql = "SELECT * from urbalog.games where game_key='" + data[0] + "'";
  if (data.length>0) {
    pool.query(sql, function(err,result) {
      if (err) {
       console.log('error with sql function ' + sql);
       console.log(err);
       res.end("error: query sql");
      } else {
        buffer = JSON.stringify(result.rows);
        res.end(buffer);
      }
    });
  }
  else res.end("error: no game_key");
  console.log('End: /getGameData');
});


/* *********************************************** */
/*            URBALOG V2                           */
/* *********************************************** */


insertTurnHistV2 = function(res, h) {
    console.log('Begin: insertTurnHistV2');
    console.log('turn_history id='+h.id);

    var sql = "INSERT INTO urbalog_v2.turn_history(id,game_key,turn_number," +
     "building_market_1,building_market_2,building_market_3,building_market_4,building_market_5," + 
	 "building_completed_1,building_completed_2,building_completed_3,building_completed_4,building_completed_5," +
     "created_at" + " )";
	
    // Check if game is already urbalog_v2 database
    pool.query("SELECT id, game_key FROM urbalog_v2.turn_history" + 
               " WHERE id='" + h.id + "'" +
               " and game_key = '" + h.game_key + "'",
       function (err, result) {
            if (err) {
               res.end("error - query turn_history");
               console.log('error - query turn_history');
               console.log(err);
            }
            else {
              console.log('turn_history id=' + h.id + ', game_key=' + h.game_key +
                          ', rows count='+result.rows.length);
              if ( result.rows.length == 0 ) {
                console.log('insert turn_history id=' + h.id + ', game_key=' + h.game_key);
                var values = [];

                values.push("('"+h.id+"'",
                "'"+h.game_key+"'",
                "'"+h.turn_number+"'",
                "'"+h.building_market_1+"'",
                "'"+h.building_market_2+"'",
                "'"+h.building_market_3+"'",
                "'"+h.building_market_4+"'",
                "'"+h.building_market_5+"'",
                "'"+h.building_completed_1+"'",
                "'"+h.building_completed_2+"'",
                "'"+h.building_completed_3+"'",
                "'"+h.building_completed_4+"'",
                "'"+h.building_completed_5+"'",
                "'"+h.created_at+"')");

            //Insert values
            myClient.query(sql + "values " + values.toString(),
              function(err, result){
                if(err){
                  res.end("error: insert");
                  console.log('error with sql function ' + sql +
                              " values "+values.toString());
                  console.log(err);
               }
               else {
                res.end("success");
               }
            });
              }
            }     
         });
    console.log('End: insertTurnHistV2');
}

insertRoleV2 = function(res, r) {
    console.log('Begin: insertRoleV2');
    console.log('role id='+r.id);

    var sql = "INSERT INTO urbalog_v2.roles(id,game_key," +
     "name,social_tokens,economical_tokens,political_tokens,hold,improve," + 
     "created_at" + " )";
	
    // Check if game is already urbalog_v2 database
    pool.query("SELECT id, game_key FROM urbalog_v2.roles" + 
               " WHERE id='" + r.id + "'" +
               " and game_key = '" + r.game_key + "'",
       function (err, result) {
            if (err) {
               res.end("error - query roles");
               console.log('error - query roles');
               console.log(err);
            }
            else {
              console.log('role id=' + r.id + ', game_key=' + r.game_key +
                          ', rows count='+result.rows.length);
              if ( result.rows.length == 0 ) {
                console.log('insert role id=' + r.id + ', game_key=' + r.game_key);
                var values = [];

                values.push("('"+r.id+"'",
                "'"+r.game_key+"'",
                "'"+r.name+"'",
                "'"+r.social_tokens+"'",
                "'"+r.economical_tokens+"'",
                "'"+r.political_tokens+"'",
                "'"+r.hold+"'",
                "'"+r.improve+"'",
                "'"+r.created_at+"')");

            //Insert values
            myClient.query(sql + "values " + values.toString(),
              function(err, result){
                if(err){
                  res.end("error: insert");
                  console.log('error with sql function ' + sql +
                              " values "+values.toString());
                  console.log(err);
               }
               else {
                res.end("success");
               }
            });
              }
            }     
         });
    console.log('End: insertRoleV2');
}

insertPlayerV2 = function(res, p) {
    console.log('Begin: insertPlayerV2');
    console.log('player id='+p.id);

    var sql = "INSERT INTO urbalog_v2.players(id,game_keys,game_id," +
     "nom, firstname, sexe, age, residence, statut_activite, job," +
     "secteur_activite, entreprise,role_player," +
     "created_at" + " )";

    // Check if game is already urbalog database
    pool.query("SELECT id, game_keys FROM urbalog_v2.players" + 
               " WHERE id='" + p.id + "'" +
               " and game_keys = '" + p.game_keys + "'",
       function (err, result) {
            if (err) {
               res.end("error - query players");
               console.log('error - query players');
               console.log(err);
            }
            else {
              console.log('player id=' + p.id + ', game_keys=' + p.game_keys +
                          ', rows count='+result.rows.length);
              if ( result.rows.length == 0 ) {
                console.log('insert player id=' + p.id + ', game_keys=' + p.game_keys);
                var values = [];

                values.push("('"+p.id+"'",
                "'"+p.game_keys+"'",
                "'"+p.game_id+"'",
                "'"+p.nom+"'",
                "'"+p.firstname+"'",
                "'"+p.sexe+"'",
                "'"+p.age+"'",
                "'"+p.residence+"'",
                "'"+p.statut_activite+"'",
                "'"+p.job+"'",
                "'"+p.secteur_activite+"'",
                "'"+p.entreprise+"'",
                "'"+p.role_player+"'",
                "'"+p.created_at+"')");

            //Insert values
            myClient.query(sql + "values " + values.toString(),
              function(err, result){
                if(err){
                  res.end("error: insert");
                  console.log('error with sql function ' + sql +
                              " values "+values.toString());
                  console.log(err);
               }
               else {
                res.end("success");
               }
            });
              }
            }     
         });
    console.log('End: insertPlayerV2');
}

insertBuildingV2 = function(res, b) {
    console.log('Begin: insertBuildingV2');
    console.log('building id='+b.id);

    var sql = "INSERT INTO urbalog_v2.buildings(id,game_key," +
     "name,description,political_cost,social_cost,economical_cost,attract_score," + 
     "fluid_score,envi_score,logi_score,logi_description,created_at" + " )";

    // Check if game is already urbalog_v2 database
    pool.query("SELECT id, game_key FROM urbalog_v2.buildings" + 
               " WHERE id='" + b.id + "'" +
               " and game_key = '" + b.game_key + "'",
       function (err, result) {
            if (err) {
               res.end("error - query buildings");
               console.log('error - query buildings');
               console.log(err);
            }
            else {
              console.log('building id=' + b.id + ', game_key=' + b.game_key +
                          ', rows count='+result.rows.length);
              if ( result.rows.length == 0 ) {
                console.log('insert building id=' + b.id + ', game_key=' + b.game_key);
                var values = [];

                values.push("('"+b.id+"'",
                "'"+b.game_key+"'",
                "'"+b.name+"'",
                "'"+b.description+"'",
                "'"+b.political_cost+"'",
                "'"+b.social_cost+"'",
                "'"+b.economical_cost+"'",
                "'"+b.attract_score+"'",
                "'"+b.fluid_score+"'",
                "'"+b.envi_score+"'",
                "'"+b.logi_score+"'",
                "'"+b.logi_description+"'",				
                "'"+b.created_at+"')");

            //Insert values
            myClient.query(sql + "values " + values.toString(),
              function(err, result){
                if(err){
                  res.end("error: insert");
                  console.log('error with sql function ' + sql +
                              " values "+values.toString());
                  console.log(err);
               }
               else {
                res.end("success");
               }
            });
              }
            }     
         });
    console.log('End: insertBuildingV2');
}

insertHistoryV2 = function(res, h) {
    console.log('Begin: insertHistoryV2');
    console.log('history id='+h.id);

    var sql = "INSERT INTO urbalog_v2.bet_history(id,game_key," +
     "player_id,political_bet,social_bet,economical_bet,turn,building," + 
     "created_at" + " )";

    // Check if game is already urbalog_v2 database
    pool.query("SELECT id, game_key FROM urbalog_v2.bet_history" + 
               " WHERE id='" + h.id + "'" +
               " and game_key = '" + h.game_key + "'",
       function (err, result) {
            if (err) {
               res.end("error - query bet_history");
               console.log('error - query bet_history');
               console.log(err);
            }
            else {
              console.log('history id=' + h.id + ', game_key=' + h.game_key +
                          ', rows count='+result.rows.length);
              if ( result.rows.length == 0 ) {
                console.log('insert history id=' + h.id + ', game_key=' + h.game_key);
                var values = [];

                values.push("('"+h.id+"'",
                "'"+h.game_key+"'",
                "'"+h.player_id+"'",
                "'"+h.political_bet+"'",
                "'"+h.social_bet+"'",
                "'"+h.economical_bet+"'",
                "'"+h.turn+"'",
                "'"+h.building+"'",
                "'"+h.created_at+"')");

            //Insert values
            myClient.query(sql + "values " + values.toString(),
              function(err, result){
                if(err){
                  res.end("error: insert");
                  console.log('error with sql function ' + sql +
                              " values "+values.toString());
                  console.log(err);
               }
               else {
                res.end("success");
               }
            });
              }
            }     
         });
    console.log('End: insertHistoryV2');
}

insertGameV2 = function(res, g) {
    console.log('Begin: insertGameV2');
    console.log('game_key='+g.game_key);

    var sql = "INSERT INTO urbalog_v2.games(id,game_key,nb_players,nb_buildings," +
     "nb_buildings_per_turn,game_timer,turn_timer,score_fuild,score_attract," + 
     "score_envi,score_logi,nb_turn,created_at" + " )";
 
    // Check if game is already urbalog_v2 database
    pool.query("SELECT game_key FROM urbalog_v2.games" + 
                                 " WHERE game_key = '" + g.game_key + "'",
       function (err, result) {
            if (err) {
               res.end("error - query games");
               console.log('error - query games');
               console.log(err);
            }
            else {
              console.log('game_key=' + g.game_key +
                          ', rows count='+result.rows.length);
              if ( result.rows.length == 0 ) {
                console.log('insert data game_key=' + g.game_key);
                var values = [];

                values.push("('"+g.id+"'",
                "'"+g.game_key+"'",
                "'"+g.nb_players+"'",
                "'"+g.nb_buildings+"'",
                "'"+g.nb_buildings_per_turn+"'",
                "'"+g.game_timer+"'",
                "'"+g.turn_timer+"'",
                "'"+g.score_fuild+"'",
                "'"+g.score_attract+"'",
                "'"+g.score_envi+"'",
                "'"+g.score_logi+"'",
                "'"+g.nb_turn+"'",
                "'"+g.created_at+"')");

            //Insert values
            myClient.query(sql + "values " + values.toString(),
              function(err, result){
                if(err){
                  res.end("error: insert");
                  console.log('error with sql function ' + sql +
                              " values "+values.toString());
                  console.log(err);
               }
               else {
                res.end("success");
               }
            });
              }
            }     
         });
    console.log('End: insertGameV2');
}


router.post('/addGamesV2', function(req, res) {

    console.log('Begin: /addGamesV2');
    var data =  JSON.parse(req.body.games_data);
    var bet_history = data.bet_history;
    var buildings = data.games;
    var games = data.games;
    var players = data.players;
    var roles = data.roles;
    var turn_history = data.turn_history;

    if (bet_history == undefined) bet_history = [];
    if (buildings == undefined) buildings = [];
    if (games == undefined) games = [];
    if (players == undefined) players = [];
    if (roles == undefined) roles = [];
    if (turn_history == undefined) turn_history = [];

    console.log('total games='+ games.length);
    for (var i=0; i<games.length; i++){
        var game = games[i];
        console.log('i='+i+', game_key=' + game.game_key)
        insertGameV2(res, game);
    };
	
    console.log('total bet_history='+ bet_history.length);
    for (var i=0; i<bet_history.length; i++){
        var histo = bet_history[i];
        insertHistoryV2(res, histo);
    };
	
    console.log('total buildings='+ buildings.length);
    for (var i=0; i<buildings.length; i++){
        var building = buildings[i];
        insertBuildingV2(res, building);
    };

    console.log('total players='+ players.length);
    for (var i=0; i<players.length; i++){
        var player = players[i];
        insertPlayerV2(res, player);
    };

    console.log('total roles='+ roles.length);
    for (var i=0; i<roles.length; i++){
        var role = roles[i];
        insertRoleV2(res, role);
    };

    console.log('total turn_history='+ turn_history.length);
    for (var i=0; i<turn_history.length; i++){
        var turn_h = turn_history[i];
        insertTurnHistV2(res, turn_h);
    };

    res.end("success");

    console.log('End: /addGamesV2');
});

router.post('/getGameDataV2',  function(req, res) {
  console.log('Begin: /getGameDataV2');

  var game_key =  req.body.game_key;
  var table_name =  req.body.table_name;
  var game_key_attr = "game_key";
  if (table_name == undefined ) table_name="games";
  if (table_name == "players") game_key_attr= "game_keys";

  var sql = "SELECT * from urbalog_v2." + table_name + 
            " where " + game_key_attr + "='" + game_key + "'";
  console.log('Query: ' + sql);
  if (game_key != undefined && table_name != undefined ) {
    pool.query(sql, function(err,result) {
      if (err) {
       console.log('error with sql function ' + sql);
       console.log(err);
       res.end("error: query sql");
      } else {
        buffer = JSON.stringify(result.rows);
        res.end(buffer);
      }
    });
  }
  else res.end("error: no game_key");
  console.log('End: /getGameDataV2');
});


router.post('/echo',  function(req, res) {
  console.log('Begin: /echo');
  res.send("urbalog status ok");
  console.log('End: /echo');
});


module.exports = router;
module.exports.client = myClient;
module.exports.pool = pool;

