// study01.js one run games for Giants

const input = require("../../npb-games-2018.json");

const data = input
  .filter((game)=>{ // true if the game played by Giants
    const road_team = game.road.split(",")[0];
    const home_team = game.home.split(",")[0];
    if(road_team == "Giants" || home_team == "Giants"){
      return true;
    }else{
      return false;
    }
  })
  .filter((game)=>{ // true if the game decided by one run
    const road_runs = game.road.split(",").slice(-3,-2)[0];
    const home_runs = game.home.split(",").slice(-3,-2)[0];
    return Math.abs(Number(road_runs) - Number(home_runs)) == 1;
  })
  .map((game)=>{ // single line format
    const date = game.playball.slice(0,10);
    const road_team = game.road.split(",")[0];
    const home_team = game.home.split(",")[0];
    const road_runs = game.road.split(",").slice(-3,-2)[0];
    const home_runs = game.home.split(",").slice(-3,-2)[0];

    let isWin;
    if(road_team=="Giants" && Number(road_runs)>Number(home_runs)){
      isWin = "W";
    }else if(home_team=="Giants" && Number(home_runs)>Number(road_runs)){
      isWin = "W";
    }else{
      isWin = "L";
    }
    
    return `${isWin}  ${date} ${(" ".repeat(10)+home_team).slice(-10)} ${(" "+home_runs).slice(-2)}-${(road_runs+" ").slice(0,2)} ${road_team}`
  })
  ;
const output = JSON.stringify(data,null,2);
console.log(output);

const win = data.filter((line)=>line.slice(0,1)=="W").length;
const loss = data.filter((line)=>line.slice(0,1)=="L").length;

console.log(`\n${win}-${loss}`);
