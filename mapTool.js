var map = null;
var mapno = 1;
var d_height = 0;

function initMap() {
	map = new Map("map", {
		scale: [5, 10, 20, 40, 80, 150, 300, 600, 1200, 2500, 5000, 10000, 20000, 45000, 100000],
		mapNo: 1,
		maxScale: 100000,
		minScale: 5,
		curScale: 100000
	});


	map.unitM = " 米";
	map.unitM2 = "平方米";
	map.unitKM = " 公里";
	map.unitKM2 = "平方公里";
	map.tipIconText = "口";
	map.dblclickOver = "双击结束";
	map.display.bTdtImage = true;
	var bound = new Generic.Bounds(-180 * 360000, -90 * 360000, 180 * 360000, 90 * 360000);
	map.setMapBound(bound);



	map.addRuler();
	map.addContrlBar(true);
	map.addVector();
	map.setBaseLayerPicDir("vec_c");
	map.addLayer("cva_c", {
		maxScale: 100000,
		minScale: 5,
		mapNo: 1,
		bound: bound.clone()
	});
	map.display.baseFormat = "png";

	point = new Generic.VectorType({
		pointRadius: 6,
		graphicName: "circle",
		fillColor: "red",
		fillOpacity: 0.3,
		strokeWidth: 0,
		strokeOpacity: 0,
		strokeColor: "#333333",
		units: "pixel"
	});

	point2 = new Generic.VectorType({
		pointRadius: 6,
		graphicName: "circle",
		fillColor: "yellow",
		fillOpacity: 0.6,
		strokeWidth: 0,
		strokeOpacity: 0,
		strokeColor: "#333333",
		units: "pixel"
	});

	point3 = new Generic.VectorType({
		pointRadius: 4,
		graphicName: "circle",
		fillColor: "#D9E6EA",
		fillOpacity: 0.5,
		strokeWidth: 1,
		strokeOpacity: 1,
		strokeColor: "#333333",
		units: "pixel"
	});

	line = new Generic.VectorType({
			strokeWidth: 2,
			strokeOpacity: 1,

			strokeColor: "#0000ff"
		}),
		line2 = new Generic.VectorType({
			strokeWidth: 2,
			strokeOpacity: 1,
			strokeColor: "red"
		}),
		polygon = new Generic.VectorType({
			strokeWidth: 1,
			strokeOpacity: 1,
			strokeColor: "#14342406",
			fillColor: "#14342406",
			fillOpacity: 0.3
		}),

		map.addType(1, point);
	map.addType(2, line);
	map.addType(3, polygon);
	map.addType(4, point2);
	map.addType(5, point3);
	map.addType(6, line2);
	map.addMouseUpEvent(getMouseUp);
	map.addSelectPoiMouseUpFun(selectPoiInfo);
	map.drawMap();

	// Util.addEventType(window,"resize",getHeight);
}

function getHeight(evt) {
	d_height2 = document.body.clientHeight;
	if (d_height != d_height2) {

		d_height = d_height2;
		if (d_height < 600)
			return;
		document.getElementById("map").style.height = (d_height - 125) + "px";
		hmap.bodyOnSize();

	}

}
//经纬，维度，状态（放大，缩小，平移等，弹起鼠标时候，是否移动过地图）
function getMouseUp(x, y, type, bMouseMove) {
	var imageDiv = Util.getElement("infoBox");
	if (imageDiv && !bMouseMove) {
		imageDiv.style.display = "none";
		map.delIcon("10000");
	}

}
//编号，名称，图幅，经度，维度，类型
function selectPoiInfo(id, name, mapno, lo, la, type) {

	map.addPopDiv("infoBox", lo, la, 300, 300, -16, 100, 0);
	map.addIcon('10000', 123, null, "conf/03.png", lo, la, 14, 23, 0, 0, null, null, -3, 13);

}
//编号，名称
function getPntInCity(id, city) {
	if (mapno == id)
		return;
	else {

		mapno = id;
	}
}



//移动
function setMove() {

	map.setMove();
}
//放大
function zoomin() {
	map.setZoomIn(3);
}
//缩小
function zoomout() {
	map.setZoomOut(3);
}
//测距
function mesDistance() {
	map.setMeasureDistance(2);
}
//测面
function mesArea() {
	map.setMeasureArea(3);
}

function addMarker() {
	//经度，维度 例如：1123.422555*360000
	map.setMove();
	map.setMapCenter(40924457, 12521062);
	//id,图标地址，经度，维度，点击返回函数，提示
	map.addMarker('232', 135, "conf/red-1.png", 40924457, 12521062, getMarkerInfo, "大学");


	map.addPopDiv("infoBox", 40924457, 12521062, 300, 300, -18, 120, 0);
	map.addIcon('10000', 123, null, "conf/03.png", 40924457, 12521062, 14, 23, 0, 0, null, null, -6, 25);
}

function changeMarkerColor() {
	map.setMove();
	map.changeMarkPic("232");
}
//id,经度，维度，提示，是否移动到图标上
function getMarkerInfo(id, type, x, y, value, bMoveTo) {

	if (bMoveTo) {
		//添加自己的函数

		return;
	}

	map.addPopDiv("infoBox", x, y, 300, 300, -18, 120, 0);
	map.addIcon('10000', 123, null, "conf/03.png", x, y, 14, 23, 0, 0, null, null, -6, 25);

}

function addCircle(meter) {
	map.setMapCenter(40904907, 12507305);
	map.addPoint("1", "", 40904907, 12507305, 5, 5, null, null, null, meter);
	//设置比例尺
	map.setCurrentScale(300, true);
	map.setMove();
}

function annoWord() {
	map.addMarkerLetter('2322', 456, "url(conf/marker-green.png)", 40922907, 12507305, getMarkerInfo, "郑", "郑姓");
	//滑动定位
	map.moveToCenter(40924907, 12507305);
	map.setMove();
}

function annoText() {
	map.addTextDiv(299, 455, "轻工业学院", 40944907, 12507305, 20, 29, "#FFFFFF", "red", getMarkerInfo);
	map.addIcon('277', 455, "轻工业学院", "conf/spotmkrs.png", 40944907, 12507305, 18, 18, -213, 0, getMarkerInfo);
	map.setMapCenter(40944907, 12507305);
	map.setMove();
}

function addMoveIcon() {
	map.setMove();
	map.addIcon('287', 666, "起点", "conf/sp.png", 40925907, 12507305, 25, 33, 0, 0, getMarkerInfo, null, 12, 33, true);
	map.moveToCenter(40924947, 12507305);
}

function multiAnnoCenter() {
	map.setMove();
	map.beginLocation();
	map.addMarkerLetter('1322', 333, "url(conf/marker-green.png)", 40902907, 12507305, getMarkerInfo, "B", "农业大学");
	map.addMarkerLetter('1321', 333, "url(conf/marker-green.png)", 40934907, 12520305, getMarkerInfo, "C", "财经学院");
	map.addMarkerLetter('2122', 333, "url(conf/marker-green.png)", 40922907, 12507305, getMarkerInfo, "D", "农业大学");
	map.addMarkerLetter('2311', 333, "url(conf/marker-green.png)", 40944907, 12517305, getMarkerInfo, "E", "财经学院");
	map.addMarkerLetter('23133', 333, "url(conf/marker-green.png)", 40954907, 12500305, getMarkerInfo, "F", "财经学院");
	map.addMarker('232', 135, "conf/red-1.png", 40904907, 12507305, getMarkerInfo, "大学");
	map.EndLocation();

}

function addPoiFromMap() {
	map.setAddPoi(5, getClickPoi);


}

function getClickPoi(x, y) {
	map.addIcon('2885', 457, "", "conf/marker.png", x, y, 21, 25, 0, 0, getMarkerInfo, null, 10, 25, true);

}


function addLine() {
	var points = new Array(new Generic.CPoint(40934907, 12507305), new Generic.CPoint(40931907, 12507305), new Generic.CPoint(40934907, 12519305), new Generic.CPoint(40934907, 12529905));
	map.addLine("88", 222, "大兴路", points, 2, 6, getMarkerInfo);

	map.addIcon1('200', 1, "点一", "conf/spotmkrs.png", 40934907, 12507305, 18, 18, -228, -161, getMarkerInfo);
	map.addIcon1('201', 1, "点二", "conf/spotmkrs.png", 40931907, 12507305, 18, 18, -246, 0, getMarkerInfo);
	map.addIcon1('202', 1, "点三", "conf/spotmkrs.png", 40934907, 12519305, 18, 18, -246, 0, getMarkerInfo);
	map.addIcon1('203', 1, "点四", "conf/spotmkrs.png", 40934907, 12529905, 18, 18, -228, -161, getMarkerInfo);

	map.addIcon3('2044', 1, "点一", "conf/center.gif", 40934907, 12507305, 25, 25, 0, 0, getMarkerInfo);

	map.moveToCenter(40934907, 12507305);
	map.setMove();
}

function addPolygon() {
	map.setMove();
	var points = new Array(new Generic.CPoint(40924907, 12507305), new Generic.CPoint(40915007, 12503305), new Generic.CPoint(40910007, 12507305), new Generic.CPoint(40911007, 12517305), new Generic.CPoint(40923007, 12519305), new Generic.CPoint(40928007, 12516005));
	map.addPolygon(99, 1, "城阳区", points, 1, 4, getMarkerInfo, null, true);
}

function satelliteImages() {
	if (map.display.imageDir == "img_c")
		return;
	var bound = new Generic.Bounds(-180 * 360000, -90 * 360000, 180 * 360000, 90 * 360000);
	map.setMapBound(bound);
	map.delLayer("cva_c");

	map.setBaseLayerPicDir("img_c");
	map.addLayer("cia_c", {
		maxScale: 100000,
		minScale: 5,
		mapNo: 1,
		bound: bound.clone()
	});
	map.display.baseFormat = "png";


	map.reDraw();

}

function vectorMap() {
	if (map.display.imageDir == "vec_c")
		return;
	var bound = new Generic.Bounds(-180 * 360000, -90 * 360000, 180 * 360000, 90 * 360000);
	map.setMapBound(bound);

	map.delLayer("cia_c");

	map.setBaseLayerPicDir("vec_c");
	map.addLayer("cva_c", {
		maxScale: 100000,
		minScale: 5,
		mapNo: 1,
		bound: bound.clone()
	});
	map.display.baseFormat = "png";


	map.reDraw();

}

function del() {
	map.delMarkerLetter();
	map.delMarker();

	map.delVector();
	map.delIcon();
	map.delIcon1();
	map.delIcon2();
	map.delIcon3();
	map.delLayer("1000");
	map.delLayer("270");
	map.delTextDiv();
	map.clearTempVector();

	map.setMove();
}

function menuZoominNext() {
	map.contextMenuObj.style.display = 'none';
	map.setNextScale();
}

function menuZoomoutPre() {
	map.contextMenuObj.style.display = 'none';
	map.setPreviousScale();
}

function menuMove() {
	map.contextMenuObj.style.display = 'none';
	map.setMove();
}

function layerXSXG() {

	var layerBound = new Generic.Bounds(39727434, 11298405, 41992210, 13091900);
	map.addLayer("1000", {
		maxScale: 20000,
		minScale: 5000,
		mapNo: 1,
		bound: layerBound,
		imageDir: "data/province",
		js: true,
		format: "png"
	});
	map.addLayer("270", {
		maxScale: 10000,
		minScale: 300,
		mapNo: 1,
		bound: layerBound,
		imageDir: "data/xsxg",
		js: true,
		format: "png"
	});
	map.setCurrentScale(20000, true);

}

function drawLine() {

	map.beginDrawLine(2, GetLinePos);
}

function GetLinePos(strPntList) {

	var points = [];
	var pointList = strPntList.split(';');

	for (var i = 0; i < pointList.length; i++) {

		var pointXY = pointList[i].split(',');
		if (pointXY.length == 2) {
			poi = new Generic.CPoint(pointXY[0], pointXY[1]);
			points.push(poi);
		}
	}
	map.addLine(1111, 2, "自定义线路", points, 2, 6, getMarkerInfo, true);

}

function drawPolygon() {
	map.beginDrawPolygon(3, GetPolygonPos);

}

function GetPolygonPos(strPntList) {

	var points = [];
	var pointList = strPntList.split(';');

	for (var i = 0; i < pointList.length; i++) {

		var pointXY = pointList[i].split(',');
		if (pointXY.length == 2) {
			poi = new Generic.CPoint(pointXY[0], pointXY[1]);
			points.push(poi);
		}
	}
	map.addPolygon(1112, 3, "自定义区", points, 3, 3, getMarkerInfo, null, true);
}

function drawRange() {
	map.beginDrawRange(3, GetRangePos);

}

function GetRangePos(strPntList) {

	var points = [];
	var pointList = strPntList.split(';');

	for (var i = 0; i < pointList.length; i++) {

		var pointXY = pointList[i].split(',');
		if (pointXY.length == 2) {
			poi = new Generic.CPoint(pointXY[0], pointXY[1]);
			points.push(poi);
		}
	}

	map.addPolygon("1113", 3, "自定义区", points, 3, 3, getMarkerInfo, "rectangle", true);


}