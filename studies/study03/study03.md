# X_WL: Expected won-loss record

> Expected won-loss record based on runs score and runs allowed, using this formula: RS^1.82/((RS^1.82)+(RA^1.82))

1.82が適切かどうかは議論があるようですが、MLB.comにならってこの式を計算してみたいと思います。

得点と失点の合計を計算する必要があります。

以下のようなreduce関数を定義します。

```
const runs_scored_total = (acc,game)=>{
  const runs = game.team == game.home ? game.runs.home : game.runs.road;
  return acc + runs;
}

const runs_allowd_total = (acc,game)=>{
  const runs = game.team == game.home ? game.runs.road : game.runs.home;
  return acc + runs;
}
```

これらを用いると以下のように集計できます。

```
  const runs_scored = GamesOfTheTeam.reduce(runs_scored_total,0);
  const runs_allowed = GamesOfTheTeam.reduce(runs_allowd_total,0);
```

X_WLの計算に必要なのは、得点の合計と失点の合計、試合数です。

```
const x_wl = (scored,allowed,played)=>{
  const param = 1.82;
  const rs = Math.pow(scored, param);
  const ra = Math.pow(allowed, param);
  const ratio = rs/(rs+ra);
  const x_win = Math.round(played*ratio);
  const x_loss = played - x_win;
  return [x_win, x_loss];
}
```

試合数に計算された勝率をかけて勝利数を計算し、残りを負けとしました。

球団ごとに計算します。

```
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
```

出力は以下のようになりました。

```
      team  W-L    X_WL  RS  RA
      Carp 51-35  50-37  440 377
  Swallows 43-43  42-45  391 409
    Giants 44-48  50-43  418 382
  Baystars 41-46  40-49  354 400
    Tigers 38-45  37-47  321 368
   Dragons 40-51  41-51  370 422
     Lions 51-35  49-38  483 415
  Fighters 50-38  49-40  391 349
   Marines 43-42  44-44  358 358
     Hawks 42-43  43-43  381 382
 Buffaloes 41-46  43-48  337 356
    Eagles 38-50  41-48  336 362
```

Swallowsの勝率がちょうど5割なのですが、得点よりも失点の方が多いため計算結果は5割以下になります。勝負強いとかうまく勝っているといえそうです。

Giantsは計算結果が50勝ですが実際には44勝という結果です。1点差試合の成績がきいていると考えられます。


