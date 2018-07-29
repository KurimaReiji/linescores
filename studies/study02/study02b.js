// study02b.js
// Won-loss record in games decided by one run.

const input = require("../../npb-games-2018.json");

const game_splitter = (game)=>{
  const road_team = game.road.split(",")[0];
  const home_team = game.home.split(",")[0];
  const road_runs = Number(game.road.split(",").slice(-3,-2)[0]);
  const home_runs = Number(game.home.split(",").slice(-3,-2)[0]);
  const lead = [ road_runs - home_runs ];
  const common = {
    home: home_team,
    road: road_team,
    runs: { road: road_runs, home: home_runs }
  }
  const road = Object.assign({
    team: road_team,
    lead: lead
  }, common);
  const home = Object.assign({
    team: home_team,
    lead: lead.map((i)=>-1*i)
  }, common);
  return [road, home];
};

const isOneRunGame = (game)=>Math.abs(game.lead.slice(-1)[0])==1;

const team_selector = (name)=>{
  return (game)=>game.team==name;
}

const data = input
  .map(game_splitter)
  .reduce((acc,val)=>acc.concat(val),[])
  .filter(isOneRunGame)
  ;

const oneRunGames = data;
const isWin  = (game)=>game.lead.slice(-1)[0]>0;
const isLoss = (game)=>game.lead.slice(-1)[0]<0;

["Carp","Swallows","Giants","Baystars","Tigers","Dragons",
 "Lions","Fighters","Hawks","Buffaloes","Marines","Eagles"].forEach((name)=>{
  const oneRunGamesOfTheTeam = oneRunGames.filter(team_selector(name));
  const win  = oneRunGamesOfTheTeam.filter(isWin).length;
  const loss = oneRunGamesOfTheTeam.filter(isLoss).length;
  console.log(`${(" ".repeat(10)+name).slice(-10)} ${(" "+win).slice(-2)}-${loss}`);
})

