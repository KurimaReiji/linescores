# 全球団の1点差試合の勝敗を調べる

1点差試合でのGiantsの成績を確認することはできましたが、他の球団についてはどうなっているでしょうか。

## データをもっと扱いやすくする

### homeとroadに分割

homeとroadと両方を確認するのはちょっと面倒です。
対象とするチームが先行なのか後攻なのかは、この場合関係ありません。
ここでは各試合のデータを2つに分割することで扱いやすくしてみます。

```
const data = input
  .map((game)=>{ // split into road and home
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
  })
  .reduce((acc,val)=>acc.concat(val),[])
  ;
```

名前をつけます。

```
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

const data = input
  .map(game_splitter)
  .reduce((acc,val)=>acc.concat(val),[])
  ;
```

1点差試合かどうかを判別するFilterを定義します。

```
const isOneRunGame = (game)=>{
  return Math.abs(game.runs.road - game.runs.home) == 1;
};
```

Giantsの試合かどうかを判別するFilterを定義します。

```
const isGiants = (game)=>game.team=="Giants";
```

これらのFilterを適用します。

```
const data = input
  .map(game_splitter)
  .reduce((acc,val)=>acc.concat(val),[])
  .filter(isOneRunGame)
  .filter(isGiants)
  ;
```

出力結果は以下のようになりました。

```
[
  "W     Giants  3-2  Tigers",
  "W    Dragons  2-3  Giants",
  "L     Giants  3-4  Baystars",
  "L     Giants  2-3  Carp",
  "L     Giants  4-5  Carp",
  "W   Baystars  2-3  Giants",
  "L       Carp  3-2  Giants",
  "L   Swallows  2-1  Giants",
  "L     Tigers  1-0  Giants",
  "L     Tigers  5-4  Giants",
  "W     Giants  9-8  Fighters",
  "L  Buffaloes  3-2  Giants",
  "L  Buffaloes  3-2  Giants",
  "L     Giants  4-5  Eagles",
  "L     Giants  4-5  Lions",
  "W     Giants  3-2  Lions",
  "L    Marines  1-0  Giants",
  "L    Marines  2-1  Giants",
  "L     Giants  2-3  Swallows",
  "L    Dragons  4-3  Giants",
  "W     Giants  6-5  Baystars",
  "W     Tigers  3-4  Giants",
  "L       Carp 10-9  Giants",
  "L     Giants  5-6  Swallows",
  "L     Giants  1-2  Swallows"
]

7-18
```

### 勝敗の判別方法

先行チームが1点勝っているならば、後攻のチームは1点負けているわけなので、一度点差を計算すれば使いまわせることになります。これをleadとよぶことにします。

```
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
```

入力データは以下のようになっていました。

```
[
  {
    "playball": "2018-07-20T18:00:00+09:00",
    "road": "Giants,0,0,0,3,3,0,2,0,0,1,9,11,2",
    "home": "Carp,4,3,0,0,0,1,0,0,0,2x,10,10,2"
  }
]
```

この試合のデータがgame_splitterを通してマップすることで、次のようなオブジェクトになります。

```
[
  {
    "team": "Giants",
    "lead": [ -1 ],
    "home": "Carp",
    "road": "Giants",
    "runs": { "road": 9, "home": 10 }
  },
  {
    "team": "Carp",
    "lead": [ 1 ],
    "home": "Carp",
    "road": "Giants",
    "runs": { "road": 9, "home": 10 }
  }
]
```

Giantsの1点差試合の勝敗は以下のように計算できるようになりました。leadを配列にしているのは後の拡張のためです。

```
const data = input
  .map(game_splitter)
  .reduce((acc,val)=>acc.concat(val),[])
  .filter(isOneRunGame)
  .filter(isGiants)
  ;

const win  = data.filter((game)=>game.lead.slice(-1)[0]>0).length;
const loss = data.filter((game)=>game.lead.slice(-1)[0]<0).length;
console.log(`${win}-${loss}`);
```

isCarpを定義してisGiantsのかわりに適用すれば、Carpの結果が計算できます。

```
const isCarp = (game)=>game.team=="Carp";
```

全球団分のFilterを用意して、というのではなく、team_selectorという関数を用意します。

```
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

["Carp","Swallows","Giants","Baystars","Tigers","Dragons"
 "Lions","Fighters","Hawks","Buffaloes","Marines","Eagles"].forEach((name)=>{
  const oneRunGamesOfTheTeam = oneRunGames.filter(team_selector(name));
  const win  = oneRunGamesOfTheTeam.filter(isWin).length;
  const loss = oneRunGamesOfTheTeam.filter(isLoss).length;
  console.log(`${(" ".repeat(10)+name).slice(-10)} ${(" "+win).slice(-2)}-${loss}`);
})
```
出力は以下のようになりました。Giantsの成績がより際立ちます。

```
      Carp 13-8
  Swallows 13-11
    Giants  7-18
  Baystars 13-10
    Tigers 14-11
   Dragons 14-15
     Lions 12-6
  Fighters 13-12
     Hawks 10-14
 Buffaloes 12-10
   Marines 13-11
    Eagles  9-17
```

