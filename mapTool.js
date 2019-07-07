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


	map.unitM = " ��";
	map.unitM2 = "ƽ����";
	map.unitKM = " ����";
	map.unitKM2 = "ƽ������";
	map.tipIconText = "��";
	map.dblclickOver = "˫������";
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
//��γ��ά�ȣ�״̬���Ŵ���С��ƽ�Ƶȣ��������ʱ���Ƿ��ƶ�����ͼ��
function getMouseUp(x, y, type, bMouseMove) {
	var imageDiv = Util.getElement("infoBox");
	if (imageDiv && !bMouseMove) {
		imageDiv.style.display = "none";
		map.delIcon("10000");
	}

}
//��ţ����ƣ�ͼ�������ȣ�ά�ȣ�����
function selectPoiInfo(id, name, mapno, lo, la, type) {

	map.addPopDiv("infoBox", lo, la, 300, 300, -16, 100, 0);
	map.addIcon('10000', 123, null, "conf/03.png", lo, la, 14, 23, 0, 0, null, null, -3, 13);

}
//��ţ�����
function getPntInCity(id, city) {
	if (mapno == id)
		return;
	else {

		mapno = id;
	}
}



//�ƶ�
function setMove() {

	map.setMove();
}
//�Ŵ�
function zoomin() {
	map.setZoomIn(3);
}
//��С
function zoomout() {
	map.setZoomOut(3);
}
//���
function mesDistance() {
	map.setMeasureDistance(2);
}
//����
function mesArea() {
	map.setMeasureArea(3);
}

function addMarker() {
	//���ȣ�ά�� ���磺1123.422555*360000
	map.setMove();
	map.setMapCenter(40924457, 12521062);
	//id,ͼ���ַ�����ȣ�ά�ȣ�������غ�������ʾ
	map.addMarker('232', 135, "conf/red-1.png", 40924457, 12521062, getMarkerInfo, "��ѧ");


	map.addPopDiv("infoBox", 40924457, 12521062, 300, 300, -18, 120, 0);
	map.addIcon('10000', 123, null, "conf/03.png", 40924457, 12521062, 14, 23, 0, 0, null, null, -6, 25);
}

function changeMarkerColor() {
	map.setMove();
	map.changeMarkPic("232");
}
//id,���ȣ�ά�ȣ���ʾ���Ƿ��ƶ���ͼ����
function getMarkerInfo(id, type, x, y, value, bMoveTo) {

	if (bMoveTo) {
		//����Լ��ĺ���

		return;
	}

	map.addPopDiv("infoBox", x, y, 300, 300, -18, 120, 0);
	map.addIcon('10000', 123, null, "conf/03.png", x, y, 14, 23, 0, 0, null, null, -6, 25);

}

function addCircle(meter) {
	map.setMapCenter(40904907, 12507305);
	map.addPoint("1", "", 40904907, 12507305, 5, 5, null, null, null, meter);
	//���ñ�����
	map.setCurrentScale(300, true);
	map.setMove();
}

function annoWord() {
	map.addMarkerLetter('2322', 456, "url(conf/marker-green.png)", 40922907, 12507305, getMarkerInfo, "֣", "֣��");
	//������λ
	map.moveToCenter(40924907, 12507305);
	map.setMove();
}

function annoText() {
	map.addTextDiv(299, 455, "�ṤҵѧԺ", 40944907, 12507305, 20, 29, "#FFFFFF", "red", getMarkerInfo);
	map.addIcon('277', 455, "�ṤҵѧԺ", "conf/spotmkrs.png", 40944907, 12507305, 18, 18, -213, 0, getMarkerInfo);
	map.setMapCenter(40944907, 12507305);
	map.setMove();
}

function addMoveIcon() {
	map.setMove();
	map.addIcon('287', 666, "���", "conf/sp.png", 40925907, 12507305, 25, 33, 0, 0, getMarkerInfo, null, 12, 33, true);
	map.moveToCenter(40924947, 12507305);
}

function multiAnnoCenter() {
	map.setMove();
	map.beginLocation();
	map.addMarkerLetter('1322', 333, "url(conf/marker-green.png)", 40902907, 12507305, getMarkerInfo, "B", "ũҵ��ѧ");
	map.addMarkerLetter('1321', 333, "url(conf/marker-green.png)", 40934907, 12520305, getMarkerInfo, "C", "�ƾ�ѧԺ");
	map.addMarkerLetter('2122', 333, "url(conf/marker-green.png)", 40922907, 12507305, getMarkerInfo, "D", "ũҵ��ѧ");
	map.addMarkerLetter('2311', 333, "url(conf/marker-green.png)", 40944907, 12517305, getMarkerInfo, "E", "�ƾ�ѧԺ");
	map.addMarkerLetter('23133', 333, "url(conf/marker-green.png)", 40954907, 12500305, getMarkerInfo, "F", "�ƾ�ѧԺ");
	map.addMarker('232', 135, "conf/red-1.png", 40904907, 12507305, getMarkerInfo, "��ѧ");
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
	map.addLine("88", 222, "����·", points, 2, 6, getMarkerInfo);

	map.addIcon1('200', 1, "��һ", "conf/spotmkrs.png", 40934907, 12507305, 18, 18, -228, -161, getMarkerInfo);
	map.addIcon1('201', 1, "���", "conf/spotmkrs.png", 40931907, 12507305, 18, 18, -246, 0, getMarkerInfo);
	map.addIcon1('202', 1, "����", "conf/spotmkrs.png", 40934907, 12519305, 18, 18, -246, 0, getMarkerInfo);
	map.addIcon1('203', 1, "����", "conf/spotmkrs.png", 40934907, 12529905, 18, 18, -228, -161, getMarkerInfo);

	map.addIcon3('2044', 1, "��һ", "conf/center.gif", 40934907, 12507305, 25, 25, 0, 0, getMarkerInfo);

	map.moveToCenter(40934907, 12507305);
	map.setMove();
}

function addPolygon() {
	map.setMove();
	var points = new Array(new Generic.CPoint(40924907, 12507305), new Generic.CPoint(40915007, 12503305), new Generic.CPoint(40910007, 12507305), new Generic.CPoint(40911007, 12517305), new Generic.CPoint(40923007, 12519305), new Generic.CPoint(40928007, 12516005));
	map.addPolygon(99, 1, "������", points, 1, 4, getMarkerInfo, null, true);
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
	map.addLine(1111, 2, "�Զ�����·", points, 2, 6, getMarkerInfo, true);

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
	map.addPolygon(1112, 3, "�Զ�����", points, 3, 3, getMarkerInfo, null, true);
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

	map.addPolygon("1113", 3, "�Զ�����", points, 3, 3, getMarkerInfo, "rectangle", true);


}