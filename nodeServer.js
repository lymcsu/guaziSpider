var http = require("http");
var mysql = require('mysql');
var html = '<!DOCTYPE html><html><head><title>瓜子二手车-长沙爬虫数据</title>'+
''+'<link rel="stylesheet" type="text/css" href=""></head><body><div class="car-list"><ul>'

http.createServer(function(req, res) {
	var client = mysql.createConnection({
		user: 'root',
		password: '123456',
	});

	client.connect();
	client.query("use guazi");

	client.query(
		"SELECT name,price,ontime,distance,img,href FROM cars",
		function selectCb(err, results, fields) {
			var newHtml = "";
			if (err) {
				throw err;
			}
			if (results) {
				for (var i = 0; i < results.length; i++) {
					newHtml += '<li class="car-list-items">' +
						'<img src="' + results[i].img + '">' +
						'<div class="info">' +
						'<p class="title">' + results[i].name + '</p>' +
						'<p class="price">' + results[i].price + '</p>' +
						'<p class="on-time">' + results[i].ontime + '</p>' +
						'<p class="distance">' + results[i].distance + '</p>' +
						'</div>' +
						'</li>';
				}
				html += newHtml;
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});
				res.write(html);
				res.end('</ul></div></body></html>');
			}
			client.end();
		}
	);

}).listen(3000);