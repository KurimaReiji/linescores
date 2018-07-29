// study02.js
// one run games for Giants

const input = require("../../npb-games-2018.json");

const game_splitter = (game)=>{
  const road_team = game.road.split(",")[0];
  const home_team = game.home.split(",")[0];
  const road_runs = Number(game.road.split(",").slice(-3,-2)[0]);
  const home_runs = Number(game.home.split(",").slice(-3,-2)[0]);
  const road = {
    team: road_team,
    home: home_team,
    road: road_team,
    runs: { road: road_runs, home: home_runs }
  };
  const home = {
    team: home_team,
    home: home_team,
    road: road_team,
    runs: { road: road_runs, home: home_runs }
  };
  return [road, home];
};

const isOneRunGame = (game)=>{
  return Math.abs(game.runs.road - game.runs.home) == 1;
};

const isGiants = (game)=>game.team=="Giants";

const data = input
  .map(game_splitter)
  .reduce((acc,val)=>acc.concat(val),[])
  .filter(isOneRunGame)
  .filter(isGiants)
  .map((game)=>{
    let isWin;
    if(game.road==game.team && game.runs.road>game.runs.home){
      isWin = "W";
    }else if(game.home==game.team && game.runs.home>game.runs.road){
      isWin = "W";
    }else{
      isWin = "L";
    }
    
    return `${isWin} ${(" ".repeat(10)+game.home).slice(-10)} ${(" "+game.runs.home).slice(-2)}-${(game.runs.road+" ").slice(0,2)} ${game.road}`

  })
  ;

const output = JSON.stringify(data,null,2);
console.log(output);

const win = data.filter((line)=>line.slice(0,1)=="W").length;
const loss = data.filter((line)=>line.slice(0,1)=="L").length;

console.log(`\n${win}-${loss}`);
