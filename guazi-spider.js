var https = require("https");
var cheerio = require("cheerio");
var mysql = require("mysql")
var url = "https://www.guazi.com/cs/buy/o";
var i = 11;
while (i <= 12) {
	https.get(url + i, function(res) {
		var html = '';
		res.on("data", function(data) {
			html += data;
		});
		res.on("end", function() {
			var carsData = getInfo(html);
			printOut(carsData);
		});
	}).on("error", function() {
		console.log("爬取失败");
	});
	i++;
}

function getInfo(html) {
	var $ = cheerio.load(html);
	var carsList = $(".list-bigimg").children('li');
	var carsData = [];
	carsList.each(function(item) {
		var car = $(this);
		var id = car.find("a.imgtype").attr("href").split("cs/")[1];
		var img = car.find("a.imgtype").children('img').attr("src");
		var title = car.find("a.imgtype").children('img').attr("alt");
		var time = car.find(".fc-gray span").text();
		var distance = car.find(".fc-gray").text().split("|")[1].trim();
		var price = car.find("i.priType").text().trim();
		var carInfo = {
			id: id,
			img: img,
			title: title,
			time: time,
			distance: distance,
			price: price
		};
		carsData.push(carInfo);
	});
	return carsData;
};

function printOut(data) {
	data.forEach(function(item) {
		var client = mysql.createConnection({
			user: 'root',
			password: '123456',
		});
		client.connect();
		client.query("use guazi");
		client.query(
			"INSERT INTO cars(name,price,ontime,distance,img,href) VALUES('"+ item.title +"', '"+ item.price +
			"', '"+ item.time +"', '"+ item.distance +"', '"+ item.img +"', '"+ item.id +"')",
			function selectCb(err, results, fields) {
				if (err) {
					throw err;
				}

				if (results) {
					console.log(results)
				}
				client.end();
			}
		);
	});
};