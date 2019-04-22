const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

var workers = {};

function startWorker(path, cb) {
  let w = new Worker(path, {workerData: null});
  w.on('message', (msg) => {
    cb(null, msg)
  })
  w.on('error', cb);
  w.on('exit', (code) => {
    if(code != 0)
          console.error(new Error(`Worker stopped with exit code ${code}`))
   });
  return w;
}

exports.addWorker = function(hashvalue){
  workers[hashvalue] = startWorker(__dirname + '/worker.js', (err, result) => { //get from parentPort
    if(err) return console.error(err);
    else{
      console.log(result);
    }
  })
}

exports.postMessage = function(hashvalue,body){
  console.log("[main] postMessage:",hashvalue, JSON.stringify(body));
  console.log("[main] workers",workers);
  let worker = workers[hashvalue];
  worker.postMessage(body);
}
