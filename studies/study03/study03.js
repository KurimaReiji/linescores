// study03.js
// Expected won-loss record based on runs scored and runs allowed, using this formula: RS^1.82/((RS^1.82)+(RA^1.82)).

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

const team_selector = (name)=>{
  return (game)=>game.team==name;
}

const isWin  = (game)=>game.lead.slice(-1)[0]>0;
const isLoss = (game)=>game.lead.slice(-1)[0]<0;

const runs_scored_total = (acc,game)=>{
  const runs = game.team == game.home ? game.runs.home : game.runs.road;
  return acc + runs;
}

const runs_allowd_total = (acc,game)=>{
  const runs = game.team == game.home ? game.runs.road : game.runs.home;
  return acc + runs;
}

const x_wl = (scored,allowed,played)=>{
  const param = 1.82;
  const rs = Math.pow(scored, param);
  const ra = Math.pow(allowed, param);
  const ratio = rs/(rs+ra);
  const x_win = Math.round(played*ratio);
  const x_loss = played - x_win;
  return [x_win, x_loss];
}

const Games = input
  .map(game_splitter)
  .reduce((acc,val)=>acc.concat(val),[])
  ;

console.log(`${(" ".repeat(10)+"team").slice(-10)}  W-L    X_WL  RS  RA`);

["Carp","Swallows","Giants","Baystars","Tigers","Dragons",
 "Lions","Fighters","Marines","Hawks","Buffaloes","Eagles"].forEach((name)=>{
  const GamesOfTheTeam = Games.filter(team_selector(name));
  const played = GamesOfTheTeam.length;
  const win  = GamesOfTheTeam.filter(isWin).length;
  const loss = GamesOfTheTeam.filter(isLoss).length;
  const runs_scored = GamesOfTheTeam.reduce(runs_scored_total,0);
  const runs_allowed = GamesOfTheTeam.reduce(runs_allowd_total,0);
  const x_winloss = x_wl(runs_scored,runs_allowed,played);
  console.log(`${(" ".repeat(10)+name).slice(-10)} ${[win,loss].join("-")}  ${x_winloss.join("-")}  ${runs_scored} ${runs_allowed}`);
});
