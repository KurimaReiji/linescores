# linescores

## はじめに

[巨人・高橋由伸監督がオーナーに前半戦の報告を行ったという記事](https://headlines.yahoo.co.jp/hl?a=20180707-00000033-sph-base)に以下のような記述がありました。

> 今季は１点差試合で６勝１５敗。接戦を勝ち切る重要性も話し合われたと
> みられ、老川オーナーは「１点勝負で勝っていれば、とっくに首位になっ
> ていてもおかしくないくらい。何とか克服しないといけない」と話した。

１点差試合における成績は、[MLB.comのStandings](http://mlb.mlb.com/mlb/standings/index.jsp)であれば、"1-RUN"という項目があり、いつでも参照することができます。しかし、[NPB.jpの
順位表](http://npb.jp/bis/2018/stats/std_c.html)や[スポーツナビ](https://baseball.yahoo.co.jp/npb/standings/)、[日刊スポーツ](https://www.nikkansports.com/baseball/professional/data/standings/)などには掲載されていません。

記事で言及されなくても知りたい、ならば自分で数えてしまえということで、やってみることにします。

## データ

野球はデータの充実したスポーツのひとつです。多種多様なものすべてを個人で集めるわけにもいかないので、Linescoreを集めてみることにしました。

```
       1 2 3  4 5 6  7 8 9  10   R  H E
Giants 0 0 0  3 3 0  2 0 0  1    9 11 2
Carp   4 3 0  0 0 1  0 0 0  2x  10 10 2
```

この試合のデータは以下のようなJSON形式で保存することにして、いろいろと操作してみようと思います。

```
[
  {
    "playball": "2018-07-20T18:00:00+09:00",
    "road": "Giants,0,0,0,3,3,0,2,0,0,1,9,11,2",
    "home": "Carp,4,3,0,0,0,1,0,0,0,2x,10,10,2"
  }
]
```

## Studies

- [one run games for Giants](studies/study01/study01.md)
- [one run games for all Teams](studies/study02/study02.md)
- [X_WL: Expected won-loss record](studies/study03/study03.md)
