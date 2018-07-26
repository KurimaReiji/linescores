# Giantsの1点差試合の勝敗を調べる

7月6日時点で、「6勝15敗」ということでした。

各試合のLinescoreをまとめたJSONと、 node v8.11 を使って調べてみます。

## データの読み込み

スクリプトファイル名を study01.js とします。

```
const input = require("../../npb-games-2018.json");

const data = input;
const output = JSON.stringify(data,null,2);
console.log(output);
```

```
$ node study01.js
```

ずらずらとデータが表示されれば読み込めています。

## Giantsの試合に限定

このJSONファイルには、今季これまでに開催されたNPBの試合のデータが入っています。不要なデータをフィルタリングしていくことにします。

ここでは、roadとhomeをそれぞれ調べて、Giantsの試合のみに絞り込みます。

```
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
  ;
```

## 1点差試合に限定

roadとhomeの得点差の絶対値が1かどうかを調べます。得点は後ろから3番目の数字です。

```
const data = input
  .filter((game)=>{ // true if the game played by Giants
     ...
  })
  .filter((game)=>{ // true if the game decided by one run
    const road_runs = game.road.split(",").slice(-3,-2)[0];
    const home_runs = game.home.split(",").slice(-3,-2)[0];
    return Math.abs(Number(road_runs) - Number(home_runs)) == 1;
  })  
  ;
```

あとはこれを見ながら数え上げれば、ということになりますが、もう少しコンピュータに働いてもらいましょう。

## 整形

```
const data = input
  .filter((game)=>{ // true if the game played by Giants
     ...
  })
  .filter((game)=>{ // true if the game decided by one run
     ...
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

const win = data.filter((line)=>line.slice(0,1)=="W").length;
const loss = data.filter((line)=>line.slice(0,1)=="L").length;

console.log(`\n${win}-${loss}`);  
```

出力は以下のようになりました。

```
[
  "W  2018-04-01     Giants  3-2  Tigers",
  "W  2018-04-05    Dragons  2-3  Giants",
  "L  2018-04-10     Giants  3-4  Baystars",
  "L  2018-04-14     Giants  2-3  Carp",
  "L  2018-04-15     Giants  4-5  Carp",
  "W  2018-04-17   Baystars  2-3  Giants",
  "L  2018-05-03       Carp  3-2  Giants",
  "L  2018-05-15   Swallows  2-1  Giants",
  "L  2018-05-25     Tigers  1-0  Giants",
  "L  2018-05-26     Tigers  5-4  Giants",
  "W  2018-05-30     Giants  9-8  Fighters",
  "L  2018-06-02  Buffaloes  3-2  Giants",
  "L  2018-06-03  Buffaloes  3-2  Giants",
  "L  2018-06-07     Giants  4-5  Eagles",
  "L  2018-06-08     Giants  4-5  Lions",
  "W  2018-06-10     Giants  3-2  Lions",
  "L  2018-06-16    Marines  1-0  Giants",
  "L  2018-06-17    Marines  2-1  Giants",
  "L  2018-06-24     Giants  2-3  Swallows",
  "L  2018-06-29    Dragons  4-3  Giants",
  "W  2018-07-03     Giants  6-5  Baystars",
  "W  2018-07-16     Tigers  3-4  Giants",
  "L  2018-07-20       Carp 10-9  Giants"
]

7-16
```

7/20までのデータで数えると、7勝16敗になりました。7/6時点では6勝15敗であったことが確認できました。
