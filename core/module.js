var fs = require("fs");
var file = "./card.db";

//import sqlite3
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

function cb_getcard(id,text){
  console.log("cardid: "+ id +", text: " + text);
}

function cb_getronumber(count){
  console.log("total in table: " + count);
}


module.exports = {
  db,
  initDB: function(){
    db.serialize(function() {
      //db.run 如果 Staff 資料表不存在，那就建立 Staff 資料表
      db.run("CREATE TABLE IF NOT EXISTS "+ QUESTION_CARD_TABLE +"( \
        _id INTEGER PRIMARY KEY AUTOINCREMENT, \
        cardcontext TEXT NOT NULL \
        )");
      db.run("CREATE TABLE IF NOT EXISTS  "+ TEXTN_CARD_TABLE +"( \
        _id INTEGER PRIMARY KEY   AUTOINCREMENT, \
        cardcontext TEXT NOT NULL \
        )");

    });
  },

  addCard: function(tablename,cardtext){
    let stmt = this.db.prepare("INSERT INTO "+tablename+" (cardcontext) VALUES (?)");
    stmt.run(cardtext);
    stmt.finalize(); //operater finish
  },

  getCard: function(tablename,index,callback){
    let sql = 'SELECT _id,cardcontext FROM '+tablename+' WHERE _id = ?'; 
    this.db.get(sql, [index], (err, row) => {
        callback(row._id,row.cardcontext)
    });
    
  },

  getRowNumbers: function(tablename,callback){
    let sql = 'SELECT COUNT(*) as \'count\' FROM '+tablename;
    let size;
    this.db.get(sql, [], (err, row) => {
        console.log("total row size in table: " +row.count);
        callback(row.count);
    });
  }


}




