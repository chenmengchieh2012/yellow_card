const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const request = require("request");

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

console.log("this is the main thread")

let myWorker1 = startWorker(__dirname + '/worker.js', (err, result) => {
  if(err) return console.error(err);
  console.log("[[Heavy computation function finished]]")
  console.log("First value is: ", result.val);
  console.log("Took: ", (result.timeDiff / 1000), " seconds");
})


let myWorker2 = startWorker(__dirname + '/worker.js', (err, result) => {
  if(err) return console.error(err);
  console.log("[[Heavy computation function finished]]")
  console.log("First value is: ", result.val);
  console.log("Took: ", (result.timeDiff / 1000), " seconds");
})

const start = Date.now();
request.get('http://www.google.com', (err, resp) => {
  if(err) {
    return console.error(err);
  }
  console.log("Total bytes received: ", resp.body.length);
  myWorker1.postMessage({finished: true, timeDiff: Date.now() - start}); //you could send messages to your workers like this
}) 