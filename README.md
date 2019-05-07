# yellow_card

# **使用者相關**

1. 登入資訊: 使用者 ID
2. 創建房間 -> 生成流水號
3. 房間退出 ( 更新玩家狀態 -> 更新房長 )
4. 遊戲開始
5. 聊天室

---

功能:

1. 點擊圖片可更換頭貼
2. 創建房間不需房間流水號
3. 加入房間需要流水號 ( 已做防呆 )

![index](/readme_img/index.png)

---

功能:

1. 聊天室輸入文字聊天 ( Enter 鍵或發送按鈕 )
2. 滑鼠移至聊天室內的頭貼可顯示該玩家名稱
3. 滑鼠點擊聊天內容可顯示訊息時間
4. 房間流水號可透過複製按鈕複製到剪貼簿
5. 玩家列表顯示上限與離線 (離線逾 30 秒則刪除該玩家)

![index](/readme_img/waitingRoom.png)

---

**Socket.io APIs:**

[client] listen on

1. playerState: 

   ```javascript
   return ({
   	playerID: playerID,
   	playerName: playerName,
   	avatarIndex: avatarIndex,
   	state: (state = "online" or "offline")
   });
   ```

2. startGame:

   ```javascript
   return ({
       playground: gameRoom.html
   });
   ```

   

3. chatMsg:

   ```javascript
   return ({
   	playerIndex: playerIndex,
       playerName: playerName,
       msg: msg
   });
   ```

---

**Functions (包含功能):**

- [x] 玩家頭像選擇 (選項清單)
- [x] 玩家 ID (預設: 時間雜湊)
- [x] 玩家列表 (包含狀態)
- [x] 聊天收送
- [x] 創建遊戲
- [x] 加入遊戲
- [ ] 退出遊戲
- [ ] 遊戲開始
- [x] (optional: 分享遊戲房間連結的按鈕 (複製 URL))

**APIs:** 

- [x] 使用者資訊封包 (包含: 頭像、ID)
- [ ] 玩家列表 (數量、ID、狀態)
- [ ] 聊天收送
- [x] 創建遊戲
- [x] 加入遊戲
- [ ] 退出遊戲 (使用者資訊)
- [ ] 遊戲開始

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

---

## 測試流程

1. 使用postman 打 URL http://localhost:3000/createroom![test_step1](./readme_img/test_step1.png)
2. 利用 https://amritb.github.io/socketio-client-tool/#url=aHR0cDovL2xvY2FsaG9zdDozMDAw&opt=&events=test，並設定以下參數，發送加入 房間 的程序![test_step2](/readme_img/test_step2.png)

---

## Protocol

### From web to server

- SocketIO:

  - JOINGAME_EVENT -> return JOINGAME_EVENT 

  - SETSOCKET_EVENT -> return SETSOCKET_EVENT 

  - GET_QUESTIONCARD_EVENT -> return GET_QUESTIONCARD_EVENT

  - CHOOSE_TEXTCARD_EVENT -> return GET_TEXTCARD_EVENT

  - CHOOSE_QUESTIONCARD_EVENT -> return CHOOSE_QUESTIONCARD_EVENT

  - READY_EVENT -> return GET_TEXTCARD_EVENT or NULL

### the structure from web to server.
envelope :

* flow:
  * sendMessagetoWorker =>  create envelope:{"req":req,"socket_id":socket_id}

```json
{
    "req":{
        "event": "join",
        "hashtag" "tag", //get from web
        "msg":{
            "playerid": "String"
        }
    },
	"socket_id":socket_id,
	"res":{
        
    }
}
```