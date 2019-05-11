var env = require('./env.js');
var iconv = require('iconv-lite');
var exec = require('child_process').exec;

var wifi_data = {};

var getRSSI = function(signal){
	var rssi = (parseFloat(signal) / 2) - 100;
	return rssi;
};

var wifi_info = function(cb){
	var cmd = "netsh wlan show interfaces";
	exec(cmd, env, function(err, stdout){
		if(err)
			throw err;
		else{
			cb(stdout);
		}
	});
};

var info_parser = function(){
	var self = {
		ssid:"default",
		signal:0,
		mac:"default",
		state: false
	};

	self.parse = function(data){
		if(self.state){
			self.state = false;
			var lines = data.split('\r\n');
			// console.log(lines);
			var lines_ssid = lines[8];
			var lines_signal = lines[18];
			var lines_mac = lines[6];
			self.ssid = lines_ssid.match(/.*\: (.*)/)[1];
			self.signal = lines_signal.match(/.*\: (.*)/)[1];
			self.mac = lines_mac.match(/.*\: (.*)/)[1];

			// console.log(self);
			/* return obj
			{ 
				ssid: 'BUFFALO-C1E3C4',
			  	signal: '100% ',
			  	mac: '40:e2:30:b7:3b:9f',
			  	state: false,
			  	parse: [Function] 
			}
			*/
		}
		return self;
	}
	return self;
};
var pack = info_parser();

var wifiScanning_Factory = function(){
	wifi_info(function(data){
		wifi_data = data;
		pack.state = true;
	});

 	var self = pack.parse(wifi_data);
 	var rssi = getRSSI(self.signal);
 	if(rssi != -100){
 		self.rssi = rssi;
 		// console.log("RSSI: " + rssi + " dB");
 		return self;
 	}
};

setInterval(function(){
	var self = wifiScanning_Factory();
	console.log(self);
}, 1000);