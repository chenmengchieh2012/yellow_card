# yellow_card

## 規則

---

![規則圖片](https://pic.pimg.tw/punchboardgame/1530764674-610327665_n.jpg)

* 遊戲玩家數：4-10人

* 起手排數：13張

* 對家做法：自身數字+4

* 卡牌種類：題目，詞語卡

---

## URL

### joinGame  and createRoom json format 

join api: /joinroom, createroom api: /createroom

```json
{
	"event": "join",
	"msg":{
		"playerid": {playerid}
	}
}
```

---

## RoomTag 機制

使用 cookie 並設定 roomtag 作為房間識別機制。



