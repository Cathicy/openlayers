Util = {};
Util.getElement = function() {
    var elements = [];
    for (var i = 0, len = arguments.length; i < len; i++) {
        var element = arguments[i];
        if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        if (arguments.length == 1) {
            return element;
        }
        elements.push(element);
    }
    return elements;
};

Util.isElement = function(o) {
    return !!(o && o.nodeType === 1);
};

Util.extend = function(destination, source) {
    destination = destination || {};
    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }

        var sourceIsEvt = typeof window.Event == "function" && source instanceof window.Event;

        if (!sourceIsEvt && source.hasOwnProperty && source.hasOwnProperty('toString')) {
            destination.toString = source.toString;
        }
    }
    return destination;
};

Util.removeItem = function(array, item) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] == item) {
            array.splice(i, 1);
        }
    }
    return array;
};


Util.indexOf = function(array, obj) {

    if (typeof array.indexOf == "function") {
        return array.indexOf(obj);
    } else {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] == obj) {
                return i;
            }
        }
        return -1;
    }
};

Util.modifyDOMElement = function(element, id, px, sz, position, border, overflow, opacity) {

    if (id) {
        element.id = id;
    }
    if (px) {
        if (isNaN(px.x) || isNaN(px.y)) {
            return;
        }
        element.style.left = px.x + "px";
        element.style.top = px.y + "px";


    }
    if (sz) {
        element.style.width = sz.w + "px";
        element.style.height = sz.h + "px";
    }

    if (position) {
        element.style.position = position;
    }
    if (border) {
        element.style.border = border;
    }
    if (overflow) {
        element.style.overflow = overflow;
    }
    if (parseFloat(opacity) >= 0.0 && parseFloat(opacity) < 1.0) {
        element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
        element.style.opacity = opacity;
    } else if (parseFloat(opacity) == 1.0) {
        element.style.filter = '';
        element.style.opacity = '';
    }

};

Util.createDiv = function(id, px, sz, imgURL, position, border, overflow, opacity) {

    var dom = document.createElement('div');
    if (imgURL) {
        dom.style.backgroundImage = 'url(' + imgURL + ')';
    }
    if (!id) {
        id = Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "absolute";
    }
    Util.modifyDOMElement(dom, id, px, sz, position, border, overflow, opacity);

    return dom;
};

Util.createImage = function(id, px, sz, imgURL, position, border, opacity, delayDisplay) {

    var image = document.createElement("img");

    if (!id) {
        id = Util.createUniqueID("Pic");
    }
    if (!position) {
        position = "relative";
    }
    Util.modifyDOMElement(image, id, px, sz, position, border, null, opacity);

    image.style.alt = id;
    image.galleryImg = "no";
    if (imgURL) {
        image.src = imgURL;
    }
    return image;
};

Util.setOpacity = function(element, opacity) {
    Util.modifyDOMElement(element, null, null, null, null, null, null, opacity);
};

Util.alphaHackNeeded = null;

Util.alphaHack = function() {
    if (Util.alphaHackNeeded == null) {
        var arVersion = navigator.appVersion.split("MSIE");
        var version = parseFloat(arVersion[1]);
        var filter = false;

        try {
            filter = !!(document.body.filters);
        } catch (e) {}

        Util.alphaHackNeeded = (filter && (version >= 5.5) && (version < 7));
    }
    return Util.alphaHackNeeded;
};

Util.loadAlphaImageError = function() {
    var event = arguments[0] || window.event;
    var image = document.all ? event.srcElement : event.target;
    if (image) {
        if (image.attemptLoad <= 2) {
            image.attemptLoad++;
            pattern = /(conf)/g;
            if (pattern.test(image.src)) {
                image.src = "conf/transparent.png";
                image.src = "conf" + RegExp.rightContext;
            }

        }

    }

};
Util.modifyAlphaImageDiv = function(div, id, px, sz, imgURL, position, border, sizing, opacity, imagepx) {

    Util.modifyDOMElement(div, id, px, sz, position, null, "hidden", opacity);
    var img = div.childNodes[0];
    if (!img) return;
    var imgName = img.tagName.toUpperCase();

    if (imgName != "IMG") return;

    if (imgURL) {

        img.src = imgURL;
        img.setAttribute("unselectable", "on", 0);
        img.attemptLoad = 0;
        if (img.addEventListener) {
            img.addEventListener("error", Util.loadAlphaImageError, false);
        } else if (img.attachEvent) {

            img.attachEvent("onerror", Util.loadAlphaImageError);
        }

    }

    if (imagepx) {
        Util.modifyDOMElement(img, div.id, imagepx, null, "relative", border);

    } else
        Util.modifyDOMElement(img, div.id, null, sz, "relative", border);
};

Util.createAlphaImageDiv = function(id, px, sz, imgURL,
    position, border, sizing,
    opacity, delayDisplay) {

    var div = Util.createDiv();
    div.style.zoom = 1;
    var img = Util.createImage(null, null, null, null, null, null, null, false);
    div.appendChild(img);
    Util.modifyAlphaImageDiv(div, id, px, sz, imgURL, position, border, sizing, opacity);

    return div;
};

Util.upperCaseObject = function(object) {
    var uObject = {};
    for (var key in object) {
        uObject[key.toUpperCase()] = object[key];
    }
    return uObject;
};

Util.getParameterString = function(params) {
    var paramsArray = [];

    for (var key in params) {
        var value = params[key];
        if ((value != null) && (typeof value != 'function')) {
            var encodedValue;
            if (typeof value == 'object' && value.constructor == Array) {

                var encodedItemArray = [];
                var item;
                for (var itemIndex = 0, len = value.length; itemIndex < len; itemIndex++) {
                    item = value[itemIndex];
                    encodedItemArray.push(encodeURIComponent(
                        (item === null || item === undefined) ? "" : item));
                }
                encodedValue = encodedItemArray.join(",");
            } else {

                encodedValue = encodeURIComponent(value);
            }
            paramsArray.push(encodeURIComponent(key) + "=" + encodedValue);
        }
    }

    return paramsArray.join("&");
};

Util.urlAppend = function(url, paramStr) {
    var newUrl = url;
    if (paramStr) {
        var parts = (url + " ").split(/[?&]/);
        newUrl += (parts.pop() === " " ?
            paramStr :
            parts.length ? "&" + paramStr : "?" + paramStr);
    }
    return newUrl;
};

Util.Try = function() {
    var returnValue = null;

    for (var i = 0, len = arguments.length; i < len; i++) {
        var lambda = arguments[i];
        try {
            returnValue = lambda();
            break;
        } catch (e) {}
    }

    return returnValue;
};

Util.getNodes = function(p, tagName) {
    var nodes = Util.Try(
        function() {
            return Util._getNodes(p.documentElement.childNodes, tagName);
        },
        function() {
            return Util._getNodes(p.childNodes, tagName);
        }
    );
    return nodes;
};

Util._getNodes = function(nodes, tagName) {
    var retArray = [];
    for (var i = 0, len = nodes.length; i < len; i++) {
        if (nodes[i].nodeName == tagName) {
            retArray.push(nodes[i]);
        }
    }

    return retArray;
};

Util.getXmlNodeValue = function(node) {
    var val = null;
    Util.Try(
        function() {
            val = node.text;
            if (!val) {
                val = node.textContent;
            }
            if (!val) {
                val = node.firstChild.nodeValue;
            }
        },
        function() {
            val = node.textContent;
        });
    return val;
};

Util.DEFAULT_PRECISION = 14;

Util.toFloat = function(number, precision) {
    if (precision == null) {
        precision = Util.DEFAULT_PRECISION;
    }
    var number;
    if (precision == 0) {
        number = parseFloat(number);
    } else {
        number = parseFloat(parseFloat(number).toPrecision(precision));
    }
    return number;
};

Util.rad = function(x) {
    return x * Math.PI / 180;
};

Util.deg = function(x) {
    return x * 180 / Math.PI;
};


Util.VincentyConstants = {
    a: 6378137,
    b: 6356752.3142,
    f: 1 / 298.257223563
};

Util.distVincenty = function(p1, p2) {
    var ct = Util.VincentyConstants;
    var a = ct.a,
        b = ct.b,
        f = ct.f;

    var L = Util.rad(p2.lon - p1.lon);
    var U1 = Math.atan((1 - f) * Math.tan(Util.rad(p1.lat)));
    var U2 = Math.atan((1 - f) * Math.tan(Util.rad(p2.lat)));
    var sinU1 = Math.sin(U1),
        cosU1 = Math.cos(U1);
    var sinU2 = Math.sin(U2),
        cosU2 = Math.cos(U2);
    var lambda = L,
        lambdaP = 2 * Math.PI;
    var iterLimit = 20;
    while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0) {
        var sinLambda = Math.sin(lambda),
            cosLambda = Math.cos(lambda);
        var sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) +
            (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
        if (sinSigma == 0) {
            return 0;
        }
        var cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
        var sigma = Math.atan2(sinSigma, cosSigma);
        var alpha = Math.asin(cosU1 * cosU2 * sinLambda / sinSigma);
        var cosSqAlpha = Math.cos(alpha) * Math.cos(alpha);
        var cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
        var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
        lambdaP = lambda;
        lambda = L + (1 - C) * f * Math.sin(alpha) *
            (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    }
    if (iterLimit == 0) {
        return NaN;
    }
    var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
        B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    var s = b * A * (sigma - deltaSigma);
    var d = s.toFixed(3) / 1000;
    return d;
};


Util.lastSeqID = 0;

Util.createUniqueID = function(prefix) {
    if (prefix == null) {
        prefix = "id_";
    }
    Util.lastSeqID += 1;
    return prefix + Util.lastSeqID;
};

Util.normalizeScale = function(scale) {
    var normScale = (scale > 1.0) ? (1.0 / scale) : scale;
    return normScale;
};

Util.camelize = function(str) {
    var oStringList = str.split('-');
    var camelizedString = oStringList[0];
    for (var i = 1, len = oStringList.length; i < len; i++) {
        var s = oStringList[i];
        camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
    }
    return camelizedString;
};


Util.getStyle = function(element, style) {
    element = Util.getElement(element);

    var value = null;
    if (element && element.style) {
        value = element.style[Util.camelize(style)];
        if (!value) {
            if (document.defaultView &&
                document.defaultView.getComputedStyle) {

                var css = document.defaultView.getComputedStyle(element, null);
                value = css ? css.getPropertyValue(style) : null;
            } else if (element.currentStyle) {
                value = element.currentStyle[Util.camelize(style)];
            }
        }

        var positions = ['left', 'top', 'right', 'bottom'];
        if (window.opera &&
            (Util.indexOf(positions, style) != -1) &&
            (Util.getStyle(element, 'position') == 'static')) {
            value = 'auto';
        }
    }

    return value == 'auto' ? null : value;
};

Util.pagePosition = function(forElement) {
    var valueT = 0,
        valueL = 0;

    var element = forElement;
    var child = forElement;
    while (element) {

        if (element == document.body) {
            if (Util.getStyle(child, 'position') == 'absolute') {
                break;
            }
        }

        valueT += element.offsetTop || 0;
        valueL += element.offsetLeft || 0;

        child = element;
        try {
            element = element.offsetParent;
        } catch (e) {
            break;
        }
    }

    element = forElement;
    while (element) {
        valueT -= element.scrollTop || 0;
        valueL -= element.scrollLeft || 0;
        element = element.parentNode;
    }

    return [valueL, valueT];
};

Util.getBrowserName = function() {
    var browserName = "";

    var ua = navigator.userAgent.toLowerCase();

    if (ua.indexOf("opera") != -1) {
        browserName = "opera";
    } else if (ua.indexOf("msie") != -1) {
        browserName = "msie";
    } else if (ua.indexOf("safari") != -1) {
        browserName = "safari";
    } else if (ua.indexOf("mozilla") != -1) {
        if (ua.indexOf("firefox") != -1) {
            browserName = "firefox";
        } else {
            browserName = "mozilla";
        }
    }

    return browserName;
};


Util.Class = function() {
    var Class = function() {

        if (arguments && arguments[0] != Util.isPrototype) {
            this.initialize.apply(this, arguments);
        }
    };
    var extended = {};
    var parent, initialize, Type;
    for (var i = 0, len = arguments.length; i < len; ++i) {
        Type = arguments[i];
        if (typeof Type == "function") {

            if (i == 0 && len > 1) {
                initialize = Type.prototype.initialize;

                Type.prototype.initialize = function() {};

                extended = new Type();

                if (initialize === undefined) {
                    delete Type.prototype.initialize;
                } else {
                    Type.prototype.initialize = initialize;
                }
            }

            parent = Type.prototype;
        } else {

            parent = Type;
        }
        Util.extend(extended, parent);
    }
    Class.prototype = extended;
    return Class;
};


Util.isPrototype = function() {};


Util.create = function() {
    return function() {
        if (arguments && arguments[0] != Util.isPrototype) {
            this.initialize.apply(this, arguments);
        }
    };
};

Util.inherit = function() {
    var superClass = arguments[0];
    var proto = new superClass(OpenLayers.Class.isPrototype);
    for (var i = 1, len = arguments.length; i < len; i++) {
        if (typeof arguments[i] == "function") {
            var mixin = arguments[i];
            arguments[i] = new mixin(Util.isPrototype);
        }
        Util.extend(proto, arguments[i]);
    }
    return proto;
};
Util.bind = function(func, object) {

    var args = Array.prototype.slice.apply(arguments, [2]);
    return function() {
        var newArgs = args.concat(
            Array.prototype.slice.apply(arguments, [0])
        );
        return func.apply(object, newArgs);
    };
};


Util.bindAsEventListener = function(func, object) {
    return function(event) {
        return func.call(object, event || window.event);
    };
};

Util.isLeftClick = function(event) {
    return (((event.which) && (event.which == 1)) ||
        ((event.button) && (event.button == 1)));
};


Util.isRightClick = function(event) {

    return (((event.which) && (event.which == 3)) ||
        ((event.button) && (event.button == 2)));
};

Util.element = function(event) {
    return event.target || event.srcElement;
};

Util.getMousePosition = function(element, evt) {

    element.scrolls = null;
    element.lefttop = null;
    element.offsets = null;
    if (!element.scrolls) {
        element.scrolls = [
            (document.documentElement.scrollLeft || document.body.scrollLeft),
            (document.documentElement.scrollTop || document.body.scrollTop)
        ];
    }

    if (!element.lefttop) {


        element.lefttop = [
            (document.documentElement.clientLeft || 0),
            (document.documentElement.clientTop || 0)
        ];
    }


    if (!element.offsets) {
        element.offsets = Util.pagePosition(element);
        element.offsets[0] += element.scrolls[0];
        element.offsets[1] += element.scrolls[1];
    }

    return new Generic.Pixel(
        (evt.clientX + element.scrolls[0]) - element.offsets[0] - element.lefttop[0], (evt.clientY + element.scrolls[1]) - element.offsets[1] - element.lefttop[1]);


};
Util.GetLenBetween2Point = function(PointA, PointB) {
    var LatA, LatB;
    var LongA, LongB;
    var r = 6371110;
    var tt = 0.0;

    var factor = 360000;

    LongA = Math.PI * PointA.x / factor / 180;
    LatA = Math.PI * PointA.y / factor / 180;
    LongB = Math.PI * PointB.x / factor / 180;
    LatB = Math.PI * PointB.y / factor / 180;

    tt = LongB - LongA;
    tt = Math.sin(LatA) * Math.sin(LatB) + Math.cos(LatA) * Math.cos(LatB) * Math.cos(tt);
    tt = Math.acos(tt);


    if (isNaN(tt)) {
        return 100000;
    }
    var len = 0;
    len = r * tt;
    return len;
};
Util.addEventType = function(element, name, fun) {
    var bReturn = false;
    if (element.addEventListener) {

        bReturn = element.addEventListener(name, fun, false);
    } else if (element.attachEvent) {

        bReturn = element.attachEvent("on" + name, fun);
    }
    return bReturn;
};

Util.removeEvent = function(object, name, handler) {
    if (document.all)
        object.detachEvent("on" + name, handler);
    else
        object.removeEventListener(name, handler, false);
};
Util.getScroll = function()

{
    var t, l, w, h;
    if (document.documentElement && document.documentElement.scrollTop) {

        t = document.documentElement.scrollTop;
        l = document.documentElement.scrollLeft;
        w = document.documentElement.scrollWidth;
        h = document.documentElement.scrollHeight;

    } else if (document.body) {
        t = document.body.scrollTop;
        l = document.body.scrollLeft;
        w = document.body.scrollWidth;
        h = document.body.scrollHeight;
    }

    return {
        t: t,
        l: l,
        w: w,
        h: h
    };

};


Util.getGeodesicArea = function(components) {

    var area = 0.0;
    var len = components.length;
    if (len > 2) {
        var p1, p2;
        for (var i = 0; i < len - 1; i++) {
            p1 = components[i];
            p2 = components[i + 1];
            x1 = p1.x / 360000;
            x2 = p2.x / 360000;
            y1 = p1.y / 360000;
            y2 = p2.y / 360000;

            area += Util.rad(x2 - x1) *
                (2 + Math.sin(Util.rad(y1)) +
                    Math.sin(Util.rad(y2)));
        }
        area = area * 6378137.0 * 6378137.0 / 2.0;
    }
    return Math.abs(area);
};


Util.getStyle = function(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return document.defaultView.getComputedStyle(obj, null)[attr];
    }
};



Generic = {};
Generic.Size = Util.Class({

    w: 0.0,
    h: 0.0,

    initialize: function(w, h) {
        this.w = parseFloat(w);
        this.h = parseFloat(h);
    },
    toString: function() {
        return ("w=" + this.w + ",h=" + this.h);
    },

    clone: function() {
        return new Generic.Size(this.w, this.h);
    },
    equals: function(sz) {
        var equals = false;
        if (sz != null) {
            equals = ((this.w == sz.w && this.h == sz.h) ||
                (isNaN(this.w) && isNaN(this.h) && isNaN(sz.w) && isNaN(sz.h)));
        }
        return equals;
    },

    CLASS_NAME: "Generic.Size"
});

Generic.Pixel = Util.Class({

    x: 0.0,
    y: 0.0,
    initialize: function(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },
    toString: function() {
        return ("x=" + this.x + ",y=" + this.y);
    },

    clone: function() {
        return new Generic.Pixel(this.x, this.y);
    },

    equals: function(px) {
        var equals = false;
        if (px != null) {
            equals = ((this.x == px.x && this.y == px.y) ||
                (isNaN(this.x) && isNaN(this.y) && isNaN(px.x) && isNaN(px.y)));
        }
        return equals;
    },

    add: function(x, y) {
        if ((x == null) || (y == null)) {
            return null;
        }
        return new Generic.Pixel(this.x + x, this.y + y);
    },

    offset: function(px) {
        var newPx = this.clone();
        if (px) {
            newPx = this.add(px.x, px.y);
        }
        return newPx;
    },

    CLASS_NAME: "Generic.Pixel"
});

Generic.CPoint = Util.Class({

    x: 0,

    y: 0,
    initialize: function(x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
    },

    toString: function() {
        return ("lon=" + this.x + ",lat=" + this.y);
    },

    toShortString: function() {
        return (this.x + ", " + this.y);
    },


    clone: function() {
        return new Generic.CPoint(this.x, this.y);
    },

    add: function(x, y) {
        if ((x == null) || (y == null)) {
            return null;
        }
        return new Generic.CPoint(this.x + parseInt(x),
            this.y + parseInt(y));
    },

    equals: function(ll) {
        var equals = false;
        if (ll != null) {
            equals = ((this.x == ll.x && this.y == ll.y) ||
                (isNaN(this.x) && isNaN(this.y) && isNaN(ll.x) && isNaN(ll.y)));
        }
        return equals;
    },



    CLASS_NAME: "Generic.CPoint"
});


Generic.CPoint.fromString = function(str) {
    var pair = str.split(",");
    return new Generic.CPoint(pair[0], pair[1]);
};

Generic.Bounds = Util.Class({

    left: null,
    bottom: null,
    right: null,
    top: null,
    centerLonLat: null,

    initialize: function(left, bottom, right, top) {
        if (left != null) {
            this.left = Util.toFloat(left);
        }
        if (bottom != null) {
            this.bottom = Util.toFloat(bottom);
        }
        if (right != null) {
            this.right = Util.toFloat(right);
        }
        if (top != null) {
            this.top = Util.toFloat(top);
        }
    },

    clone: function() {
        return new Generic.Bounds(this.left, this.bottom,
            this.right, this.top);
    },

    equals: function(bounds) {
        var equals = false;
        if (bounds != null) {
            equals = ((this.left == bounds.left) &&
                (this.right == bounds.right) &&
                (this.top == bounds.top) &&
                (this.bottom == bounds.bottom));
        }
        return equals;
    },

    toString: function() {
        return ("left-bottom=(" + this.left + "," + this.bottom + ")" + " right-top=(" + this.right + "," + this.top + ")");
    },

    toArray: function(reverseAxisOrder) {
        if (reverseAxisOrder === true) {
            return [this.bottom, this.left, this.top, this.right];
        } else {
            return [this.left, this.bottom, this.right, this.top];
        }
    },

    getWidth: function() {
        return (this.right - this.left);
    },

    getHeight: function() {
        return (this.top - this.bottom);
    },

    getSize: function() {
        return new Generic.Size(this.getWidth(), this.getHeight());
    },

    getCenterPixel: function() {
        return new Generic.Pixel((this.left + this.right) / 2,
            (this.bottom + this.top) / 2);
    },

    getCenterLonLat: function() {
        if (!this.centerLonLat) {
            this.centerLonLat = new Generic.CPoint(
                (this.left + this.right) / 2, (this.bottom + this.top) / 2
            );
        }
        return this.centerLonLat;
    },

    scale: function(ratio, origin) {
        if (origin == null) {
            origin = this.getCenterLonLat();
        }

        var origx, origy;
        if (origin.CLASS_NAME == "Generic.LonLat") {
            origx = origin.lon;
            origy = origin.lat;
        } else {
            origx = origin.x;
            origy = origin.y;
        }

        var left = (this.left - origx) * ratio + origx;
        var bottom = (this.bottom - origy) * ratio + origy;
        var right = (this.right - origx) * ratio + origx;
        var top = (this.top - origy) * ratio + origy;

        return new Generic.Bounds(left, bottom, right, top);
    },


    add: function(x, y) {
        if ((x == null) || (y == null)) {

            return null;
        }
        return new Generic.Bounds(this.left + x, this.bottom + y,
            this.right + x, this.top + y);
    },

    containsLonLat: function(ll, inclusive) {
        return this.contains(ll.lon, ll.lat, inclusive);
    },

    containsPixel: function(px, inclusive) {
        return this.contains(px.x, px.y, inclusive);
    },


    contains: function(x, y, inclusive) {

        if (inclusive == null) {
            inclusive = true;
        }

        if (x == null || y == null) {
            return false;
        }

        x = Util.toFloat(x);
        y = Util.toFloat(y);

        var contains = false;
        if (inclusive) {
            contains = ((x >= this.left) && (x <= this.right) &&
                (y >= this.bottom) && (y <= this.top));
        } else {
            contains = ((x > this.left) && (x < this.right) &&
                (y > this.bottom) && (y < this.top));
        }
        return contains;
    },

    intersectsBounds: function(bounds, inclusive) {
        if (inclusive == null) {
            inclusive = true;
        }
        var intersects = false;
        var mightTouch = (
            this.left == bounds.right ||
            this.right == bounds.left ||
            this.top == bounds.bottom ||
            this.bottom == bounds.top
        );


        if (inclusive || !mightTouch) {

            var inBottom = (
                ((bounds.bottom >= this.bottom) && (bounds.bottom <= this.top)) ||
                ((this.bottom >= bounds.bottom) && (this.bottom <= bounds.top))
            );
            var inTop = (
                ((bounds.top >= this.bottom) && (bounds.top <= this.top)) ||
                ((this.top > bounds.bottom) && (this.top < bounds.top))
            );
            var inLeft = (
                ((bounds.left >= this.left) && (bounds.left <= this.right)) ||
                ((this.left >= bounds.left) && (this.left <= bounds.right))

            );
            var inRight = (
                ((bounds.right >= this.left) && (bounds.right <= this.right)) ||
                ((this.right >= bounds.left) && (this.right <= bounds.right))
            );
            intersects = ((inBottom || inTop) && (inLeft || inRight));
        }
        return intersects;
    },

    containsBounds: function(bounds, partial, inclusive) {
        if (partial == null) {
            partial = false;
        }
        if (inclusive == null) {
            inclusive = true;
        }
        var bottomLeft = this.contains(bounds.left, bounds.bottom, inclusive);
        var bottomRight = this.contains(bounds.right, bounds.bottom, inclusive);
        var topLeft = this.contains(bounds.left, bounds.top, inclusive);
        var topRight = this.contains(bounds.right, bounds.top, inclusive);

        return (partial) ? (bottomLeft || bottomRight || topLeft || topRight) : (bottomLeft && bottomRight && topLeft && topRight);
    },



    CLASS_NAME: "Generic.Bounds"
});

Generic.Bounds.fromString = function(str) {
    var bounds = str.split(",");
    return Generic.Bounds.fromArray(bounds);
};

Generic.Bounds.fromArray = function(bbox) {
    return new Generic.Bounds(parseFloat(bbox[0]),
        parseFloat(bbox[1]),
        parseFloat(bbox[2]),
        parseFloat(bbox[3]));
};

Generic.Bounds.fromSize = function(size) {
    return new Generic.Bounds(0,
        size.h,
        size.w,
        0);
};



Generic.VectorType = Util.Class({

    fillColor: null,
    strokeColor: null,
    strokeWidth: null,
    strokeOpacity: null,
    strokeLinecap: null,
    strokeDashstyle: null,
    pointRadius: null,
    graphicName: null,
    strokeLinecap: null,
    units: null,

    initialize: function(options) {
        Util.extend(this, options);
    },
    CLASS_NAME: "Generic.VectorType"
});

Generic.VectorDis = Util.Class({

    isFilled: null,
    isStroked: null,
    initialize: function(options) {
        Util.extend(this, options);
    },
    CLASS_NAME: "Generic.VectorDis"

});

Generic.Vector = Util.Class({

    type: null,
    index: null,
    id: null,
    name: null,
    pntList: null,
    style: null,
    fun: null,
    mouseoverIndex: null,
    scale: null,
    length: null,
    bEdit: null,
    code: null,
    initialize: function(options) {
        this.pntList = [];
    },
    CLASS_NAME: "Generic.Vector"

});
Generic.LayerDiv = Util.Class({

    layerDiv: null,
    requestImage: null,
    loadImageDelay: null,
    bound: null,
    maxScale: null,
    minScale: null,
    imageDir: "",
    mapNo: null,
    js: false,
    id: null,
    format: "png",
    opacity: 1,
    initialize: function(id, div, options) {
        this.layerDiv = div;
        Util.extend(this, options);
        this.requestImage = {};
        this.loadImageDelay = {};
        this.id = id;
    },
    CLASS_NAME: "Generic.LayerDiv"

});

Map = Util.Class({

    div: null,
    size: null,
    scale: null,
    center: null,
    curScale: 100,
    tileSize: null,
    maxScale: null,
    minScale: null,
    mapExttent: null,
    state: null,
    image: null,
    viewBound: null,
    mapNo: null,
    bMouseDown: false,
    border: 0,

    public: null,
    transform: null,
    display: null,
    lastPoint: null,
    btnDownPnt: null,

    viewPortDiv: null,
    dragContainDiv: null,
    tileContainDiv: null,
    tileSwitchDiv: null,
    annoDiv: null,
    editableDiv: null,
    rulerDiv: null,
    checkNumDiv: null,
    rulerScaleDiv: null,
    dynamicTipDiv: null,
    dynamicZoomDiv: null,
    OverviewMapDiv: null,
    zoomDivMin: 20,
    zoomDivMax: 80,
    curZoomDivWidth: 20,
    timeoutId: null,
    timeoutDragId: null,
    timeStamp: null,
    Vml: null,
    Svg: null,
    contrlBarDiv: null,
    bInitialize: false,
    bResizeOk: false,
    vectorList: null,
    mouseUpFun: null,
    selectPoiMouseUpFun: null,
    getPntInCityFun: null,
    bMouseMove: false,
    contrlBar: null,
    vectorTipName: null,
    bSelectPnt: false,
    layerSelectObj: null,
    bDrawTip: false,
    getDrawLineFun: null,
    getDrawPolygonFun: null,
    bGetImage: false,
    zIndexValue: 1,
    selectElementID: null,
    selectEditPntID: null,
    editPntIndex: null,
    bInVectorRange: false,
    bEditState: false,
    dragSegOffset: null,
    markerMouseState: null,
    selectVectorID: null,
    bMarkerMouseMove: null,
    contextMenuObj: null,
    rightClickPnt: null,
    version: null,
    moveTime: null,
    bMouseupGetImage: false,
    mapExtent: null,
    scaleBound: null,
    minLocateScale: 5,
    bJudgePoiInfo: true,
    mouseWheelWorldPnt: null,
    mouseWheelClientPnt: null,
    mouseWheelTime: 0,
    bMouseUpTime: 0,
    bCurScaleEqualTime: 0,
    bMouseInMap: false,
    locateBound: null,
    moveStepValue: 1.5,
    pntInCityZoom: 1200,
    inCityID: 1,
    dblclickOver: "double click over",
    unitM: " m",
    unitM2: " m" + "<sup>2</" + "sup>",
    unitKM: " km",
    unitKM2: " km" + "<sup>2</" + "sup>",
    tipIconText: "o",
    TOOLBAR_STATE: {
        MAP_MOVING: 10,
        MAP_ZOOMOUT: 20,
        MAP_ZOOMIN: 30,
        MAP_DISTANCE: 40,
        MAP_AREA: 50,
        MAP_ADDPOI: 60,
        MAP_EDIT: 70,
        MAP_CIRCLE: 80,
        MAP_RANGE: 90

    },
    MARKER_MOUSEUP: {

        BODY_UP: 10,
        MOUSE_UP: 20,
        MARKER_DOWN: 30,
        MARKER_UP: 40

    },

    EVENT_TYPES: ["mousewheel", "mouseover", "mouseout", "DOMMouseScroll", "mousedown", "mouseup", "mousemove", "dblclick", "rightclick", "dblrightclick", "resize", "firefoxmouseup", "contextmenu"],
    STATUS_TYPES: ["north", "west", "east", "south", "zoomin", "zoomworld", "zoomout"],
    initialize: function(div, options) {
        this.scale = [];
        this.vectorList = {};
        var arVersion = navigator.appVersion.split("MSIE");
        this.version = parseFloat(arVersion[1]);
        this.center = new Generic.CPoint(0, 0);
        this.rightClickPnt = new Generic.CPoint(0, 0);

        this.mouseWheelWorldPnt = new Generic.CPoint(0, 0);
        this.mouseWheelClientPnt = new Generic.CPoint(0, 0);

        Util.extend(this, options);
        this.div = Util.getElement(div);
        this.div.style.overflow = "hidden";
        this.div.style.position = "relative";
        this.locateBound = new Generic.Bounds(0, 0, 90000000, 90000000);

        if (!this.div) {
            alert("no div");
            return;
        }
        this.viewPortDiv = Util.createDiv("viewPortDiv", null, null, null,
            "absolute", null);
        this.viewPortDiv.style.width = "100%";
        this.viewPortDiv.style.height = "100%";
        this.viewPortDiv.style.left = "0px";
        this.viewPortDiv.style.top = "0px";
        this.viewPortDiv.style.zIndex = 0;
        this.viewPortDiv.style.overflow = "hidden";


        this.dragContainDiv = Util.createDiv("dragContainDiv", null, null, null,
            "absolute", null);
        this.dragContainDiv.style.overflow = "visible";
        this.dragContainDiv.style.left = "0px";
        this.dragContainDiv.style.top = "0px";
        this.dragContainDiv.style.zIndex = 0;

        this.tileContainDiv = Util.createDiv("tileContainDiv", null, null, null,
            "absolute", null);
        this.tileContainDiv.style.left = "0px";
        this.tileContainDiv.style.top = "0px";
        this.tileContainDiv.style.zIndex = 0;

        this.tileSwitchDiv = Util.createDiv("tileSwitchDiv", null, null, null,

            "absolute", null);
        this.tileSwitchDiv.style.left = "0px";
        this.tileSwitchDiv.style.top = "0px";
        this.tileSwitchDiv.style.zIndex = 0;
        this.tileSwitchDiv.style.backgroundColor = "transparent";
        this.editableDiv = Util.createDiv("editableDiv", null, null, null,
            "absolute", null);
        this.editableDiv.style.left = "0px";
        this.editableDiv.style.top = "0px";
        this.editableDiv.style.zIndex = 0;
        this.editableDiv.style.backgroundColor = "transparent";


        this.annoDiv = Util.createDiv("annoDiv", null, null, null,
            "absolute", null);
        this.annoDiv.style.left = "0px";
        this.annoDiv.style.top = "0px";
        this.annoDiv.style.zIndex = 0;
        this.annoDiv.style.backgroundColor = "transparent";

        this.dynamicTipDiv = Util.createDiv("dynamicTipDiv", null, null, null,
            "absolute", "1px solid red");
        this.dynamicTipDiv.style.left = "0px";
        this.dynamicTipDiv.style.top = "0px";
        this.dynamicTipDiv.style.zIndex = 1;
        this.dynamicTipDiv.style.backgroundColor = "#FFFFFF";
        this.dynamicTipDiv.style.display = "none";
        this.dynamicTipDiv.style.whiteSpace = "nowrap";
        this.dynamicTipDiv.style.fontSize = "12px";


        this.dynamicZoomDiv = Util.createDiv("dynamicZoomDiv", null, null, null,
            "absolute", null);
        this.dynamicZoomDiv.style.left = "0px";
        this.dynamicZoomDiv.style.top = "0px";
        this.dynamicZoomDiv.style.zIndex = 0;
        this.dynamicZoomDiv.style.width = this.zoomDivMax + "px";
        this.dynamicZoomDiv.style.height = this.zoomDivMax + "px";
        this.dynamicZoomDiv.style.display = "none";

        shadowHightDiv = Util.createDiv("shadowHightDiv", null, null, null,
            "absolute", null);
        shadowHightDiv.style.left = "0px";
        shadowHightDiv.style.top = "0px";
        shadowHightDiv.style.zIndex = 0;
        shadowHightDiv.style.width = "11px";
        shadowHightDiv.style.height = "100%";
        shadowHightDiv.style.backgroundImage = "url(conf/shad_v.png)"

        var leftTopDiv = Util.createDiv("leftTopDiv", null, null, null, "absolute", null);
        leftTopDiv.style.left = "0px";
        leftTopDiv.style.width = "6px";
        leftTopDiv.style.height = "6px";
        leftTopDiv.style.lineHeight = "1px";
        leftTopDiv.style.borderWidth = "0px 2px 2px 0px";
        leftTopDiv.style.borderStyle = "solid";
        leftTopDiv.style.borderColor = "red";

        var rightTopDiv = Util.createDiv("rightTopDiv", null, null, null, "absolute", null);
        rightTopDiv.style.right = "0px";
        rightTopDiv.style.width = "6px";
        rightTopDiv.style.height = "6px";
        rightTopDiv.style.lineHeight = "1px";
        rightTopDiv.style.borderWidth = "0px 0px 2px 2px";
        rightTopDiv.style.borderStyle = "solid";
        rightTopDiv.style.borderColor = "red";

        var rightBottomDiv = Util.createDiv("rightBottomDiv", null, null, null, "absolute", null);
        rightBottomDiv.style.right = "0px";
        rightBottomDiv.style.bottom = "-6px";
        rightBottomDiv.style.width = "6px";
        rightBottomDiv.style.height = "6px";
        rightBottomDiv.style.lineHeight = "1px";
        rightBottomDiv.style.borderWidth = "2px 0px 0px 2px";
        rightBottomDiv.style.borderStyle = "solid";
        rightBottomDiv.style.borderColor = "red";

        var leftBottomDiv = Util.createDiv("leftBottomDiv", null, null, null, "absolute", null);
        leftBottomDiv.style.left = "0px";
        leftBottomDiv.style.bottom = "-6px";
        leftBottomDiv.style.width = "6px";
        leftBottomDiv.style.height = "6px";
        leftBottomDiv.style.lineHeight = "1px";
        leftBottomDiv.style.borderWidth = "2px 2px 0px 0px";
        leftBottomDiv.style.borderStyle = "solid";
        leftBottomDiv.style.borderColor = "red";

        leftTopDiv.style.borderWidth = "2px 0px 0px 2px";
        rightTopDiv.style.borderWidth = "2px 2px 0px 0px";
        rightBottomDiv.style.borderWidth = "0px 2px 2px 0px";
        leftBottomDiv.style.borderWidth = "0px 0px 2px 2px";

        this.dynamicZoomDiv.appendChild(leftTopDiv);
        this.dynamicZoomDiv.appendChild(rightTopDiv);
        this.dynamicZoomDiv.appendChild(rightBottomDiv);
        this.dynamicZoomDiv.appendChild(leftBottomDiv);


        for (var i = 0, len = this.EVENT_TYPES.length; i < len; i++) {
            var eventHandler = Util.bindAsEventListener(this[this.EVENT_TYPES[i] + "Fun"], this);
            if (this.EVENT_TYPES[i] == "DOMMouseScroll") {
                Util.addEventType(window, this.EVENT_TYPES[i], eventHandler);
            } else if (this.EVENT_TYPES[i] == "mousewheel") {
                Util.addEventType(document, this.EVENT_TYPES[i], eventHandler);
            } else if (this.EVENT_TYPES[i] == "resize") {
                var eventHandler = Util.bindAsEventListener(this.bodyOnSize, this);
                Util.addEventType(window, "resize", eventHandler);

            } else if (this.EVENT_TYPES[i] == "firefoxmouseup") {
                eventHandler = Util.bindAsEventListener(this.bodyMouseUp, this);
                Util.addEventType(document, "mouseup", eventHandler);


            } else
                Util.addEventType(this.viewPortDiv, this.EVENT_TYPES[i], eventHandler);

        }

        var eventKeydown = Util.bindAsEventListener(this.keydown, this);
        Util.addEventType(document, "keydown", eventKeydown);
        this.initContextMenu();
        this.dragContainDiv.appendChild(this.tileSwitchDiv);
        this.dragContainDiv.appendChild(this.tileContainDiv);
        this.dragContainDiv.appendChild(this.editableDiv);
        this.dragContainDiv.appendChild(this.dynamicTipDiv);
        this.dragContainDiv.appendChild(this.annoDiv);

        this.viewPortDiv.appendChild(this.dragContainDiv);
        this.viewPortDiv.appendChild(this.dynamicZoomDiv);
        this.viewPortDiv.appendChild(shadowHightDiv);

        this.div.appendChild(this.viewPortDiv);
        if (this.contextMenuObj)
            this.div.appendChild(this.contextMenuObj);


        this.display = new Display(this.dragContainDiv, this.tileContainDiv, this.tileSwitchDiv, this.annoDiv, this.js);
        this.transform = new Transform();
        this.public = new Public(this, this.display, this.transform);
        this.display.setPublic(this.public);

        this.viewBound = this.getCurrentSize();

        if (this.viewBound.w > 0 && this.viewBound.h > 0)
            this.transform.setViewBound(this.viewBound.w, this.viewBound.h);


        this.lastPoint = new Generic.Pixel(0, 0);
        this.btnDownPnt = new Generic.Pixel(0, 0);
        if (this.minScale == null) {
            this.minScale = this.scale[0];
        }
        if (this.maxScale == null) {
            this.minScale = this.scale[this.scale.length - 1];
        }
        this.transform.setScale(this.curScale);

        this.initContextMenu();


        this.state = 10;
        this.bInitialize = true;

        this.timeStamp = new Date();
        this.border = parseInt(Util.getStyle(this.div, 'borderLeftWidth'));
        this.dragSegOffset = new Generic.Pixel(0, 0);
        this.moveTime = new Date();
        var popDiv = document.getElementById("pop");
        if (popDiv)
            popDiv.style.display = "none";
    },
    "contextmenuFun": function() {
        var event = arguments[0] || window.event;
        event.cancelBubble = true;
        event.returnValue = false;
        if (Util.getBrowserName() != "msie")
            event.preventDefault();
        return false;
    },

    highlightContextMenuItem: function() {

        this.className = 'contextMenuHighlighted';
    },

    deHighlightContextMenuItem: function() {
        this.className = '';
    },
    initContextMenu: function() {

        this.contextMenuObj = document.getElementById('contextMenu');

        if (this.contextMenuObj) {
            this.contextMenuObj.style.display = 'block';
            this.contextMenuObj.setAttribute("unselectable", "on", 0);
            this.contextMenuObj.onselectstart = function() {
                return false;
            };
            var menuItems = this.contextMenuObj.getElementsByTagName('LI');
            for (var no = 0; no < menuItems.length; no++) {
                menuItems[no].onmouseover = this.highlightContextMenuItem;
                menuItems[no].onmouseout = this.deHighlightContextMenuItem;
                menuItems[no].oncontextmenu = this.disableContextMenu;
            }
            this.contextMenuObj.style.display = 'none';
        }

    },

    disableContextMenu: function() {
        var event = arguments[0] || window.event;
        event.cancelBubble = true;
        event.returnValue = false;
        if (Util.getBrowserName() != "msie")
            event.preventDefault();
        return false;
    },
    bodyMouseUp: function() {

        this.selectEditPntID = null;
        this.markerMouseState = this.MARKER_MOUSEUP["BODY_UP"];
        if (this.bMouseupGetImage) {
            this.bMouseupGetImage = false;
            this.display.getDisplayImages();
        }

        var event = arguments[0] || window.event;
        if (Util.getBrowserName() == "msie")
            return;
        if (this.bMouseDown) {
            this.bMouseDown = false;
        }

    },
    bodyOnSize: function() {

        this.viewBound = this.getCurrentSize();
        this.transform.setViewBound(this.viewBound.w, this.viewBound.h);
        if (this.bInitialize) {

            this.display.getDisplayImages(true);
            this.display.drawLayers();
            var pos = new Generic.CPoint(0, 0);
            if (this.rulerDiv) {
                pos.x = 10;
                pos.y = this.viewBound.h - 33;
                Util.modifyAlphaImageDiv(this.rulerDiv, null, pos, null, null, "absolute");
            }


            if (this.checkNumDiv) {
                pos.x = 100;
                pos.y = this.viewBound.h - 20;
                Util.modifyAlphaImageDiv(this.checkNumDiv, null, pos, null, null, "absolute");
            }

            if (this.OverviewMapDiv) {
                var OverMapPos = new Generic.CPoint(0, 0);
                var contrlBarDiv = document.getElementById("markerOvermapDiv");

                if (contrlBarDiv && parseInt(contrlBarDiv.style.left) < 0) {
                    OverMapPos.x = this.viewBound.w - 15;
                    OverMapPos.y = this.viewBound.h - 15;


                } else {
                    OverMapPos.x = this.viewBound.w - 159;
                    OverMapPos.y = this.viewBound.h - 159;

                }

                Util.modifyDOMElement(this.OverviewMapDiv, null, OverMapPos, null, "absolute", null);
            }

        }
    },
    refreshBodySize: function() {
        viewBound = this.getCurrentSize();
        this.bMouseInMap = true;

        {
            if (!this.bResizeOk) {
                var viewBound = this.getCurrentSize();
                if (!viewBound.equals(this.viewBound)) {

                    this.viewBound = viewBound;
                    this.bResizeOk = true;
                    this.transform.setViewBound(this.viewBound.w, this.viewBound.h);
                    this.display.getDisplayImages();
                    var pos = new Generic.CPoint(0, 0);
                    if (this.rulerDiv) {

                        pos.x = 10;
                        pos.y = this.viewBound.h - 33;
                        Util.modifyAlphaImageDiv(this.rulerDiv, null, pos, null, null, "absolute");
                    }
                    if (this.checkNumDiv) {
                        pos.x = 100;
                        pos.y = this.viewBound.h - 20;
                        Util.modifyAlphaImageDiv(this.checkNumDiv, null, pos, null, null, "absolute");
                    }
                    if (this.OverviewMapDiv) {
                        var OverMapPos = new Generic.CPoint(0, 0);
                        var contrlBarDiv = document.getElementById("markerOvermapDiv");

                        if (contrlBarDiv && parseInt(contrlBarDiv.style.left) < 0) {
                            OverMapPos.x = this.viewBound.w - 15;
                            OverMapPos.y = this.viewBound.h - 15;


                        } else {
                            OverMapPos.x = this.viewBound.w - 159;
                            OverMapPos.y = this.viewBound.h - 159;

                        }

                        Util.modifyDOMElement(this.OverviewMapDiv, null, OverMapPos, null, "absolute", null);

                    }

                }

            }

        }
    },

    setMapBound: function(bound) {
        this.mapExtent = bound.clone();
        this.transform.setMapBound(bound);
    },

    setMapCenter: function(x, y, bFirst) {
        var x = parseInt(x);
        var y = parseInt(y);
        if (this.transform.setMapCenter(x, y)) {
            this.dragContainDiv.style.left = "0px";
            this.dragContainDiv.style.top = "0px";
            this.tileSwitchDiv.style.left = "0px";
            this.tileSwitchDiv.style.top = "0px";
            this.transform.setDragContainDivLeftTop(0, 0);
            this.display.getDisplayImages(true);
            this.display.drawLayers();
            this.display.drawVectorList();
            if (bFirst) {
                this.center.x = x;
                this.center.y = y;
            }

        }


    },
    moveToCenter: function(x, y, bLocate) {

        var viewCenterX = parseInt(this.viewBound.w / 2);
        var viewCenterY = parseInt(this.viewBound.h / 2);
        this.dynamicZoomDiv.style.display = "none";
        this.curZoomDivWidth = this.zoomDivMin;

        var Pos = this.transform.WorldToClient2(x, y);
        Pos.x -= this.transform.posViewleftTop.x;
        Pos.y -= this.transform.posViewleftTop.y;
        if (this.timeoutDragId)
            window.clearInterval(this.timeoutDragId);
        this.timeoutDragId = null;
        this.getPosInLine(Pos.x, Pos.y, viewCenterX, viewCenterY);
        if (bLocate) {

            this.timeoutDragId = window.setInterval(Util.bind(this.locatePoiInView, this), 70);
        } else
            this.timeoutDragId = window.setInterval(Util.bind(this.slipToCenter, this), 70);


    },

    slipToCenter: function() {

        this.curZoomDivWidth += 10;


        if (this.curZoomDivWidth >= this.zoomDivMax) {
            if (this.timeoutDragId)
                window.clearInterval(this.timeoutDragId);
            this.timeoutDragId = null;
            this.curZoomDivWidth = this.zoomDivMin;
            if (Util.getBrowserName() == "msie") {
                this.display.setEditVectorExtent();
                this.display.drawVectorLine();
            }
            this.display.drawLayers();
            this.bJudgePoiInfo = true;

        } else {

            this.scrollToPos(this.dragSegOffset.x, this.dragSegOffset.y);
        }

    },

    locatePoiInView: function() {
        var curScale = this.curScale;
        this.curZoomDivWidth += 10;
        var viewBound = new Generic.Bounds();
        if (this.curZoomDivWidth >= this.zoomDivMax) {

            if (this.timeoutDragId)
                window.clearInterval(this.timeoutDragId);
            this.timeoutDragId = null;
            this.curZoomDivWidth = this.zoomDivMin;

            var scale = this.minLocateScale;
            var nIndex = 0;
            while (scale != this.maxScale) {

                this.setCurrentScale(scale, false);
                this.transform.GetViewRect(viewBound);
                if (viewBound.contains(this.scaleBound.left, this.scaleBound.bottom) && viewBound.contains(this.scaleBound.right, this.scaleBound.top))
                    break;

                nIndex++;
                if (nIndex == 30) {
                    this.setCurrentScale(curScale, false);
                    break;
                }
                scale = this.getNextScale(scale, true);
            }
            this.display.getDisplayImages(true);
            this.display.drawLayers();


        } else {

            if (this.curZoomDivWidth + 10 >= this.zoomDivMax) {
                this.setMapCenter(this.scaleBound.getCenterLonLat().x, this.scaleBound.getCenterLonLat().y);
            } else
                this.scrollToPos(this.dragSegOffset.x, this.dragSegOffset.y);
        }

    },
    setCurrentScale: function(scale, bGetData) {
        if (this.curScale == scale)
            return false;
        this.curScale = scale;
        this.transform.setScale(scale);
        if (bGetData) {
            this.display.getDisplayImages(true);
            this.display.drawLayers();

        }
        if (this.contrlBar)
            this.contrlBar.setCurScale(this.curScale);

        var nLength = this.curScale * 5 + this.unitM;
        if (this.curScale * 5 >= 1000) {
            nLength = this.curScale * 5 / 1000 + this.unitKM;
        }
        while (this.rulerScaleDiv.hasChildNodes()) {
            this.rulerScaleDiv.removeChild(this.rulerScaleDiv.firstChild);
        }
        this.rulerScaleDiv.innerHTML = "<div style='FONT-SIZE: 9pt;color:red ;top:50px;'>" + nLength + "</div>  ";

        return true;
    },
    getMapNo: function() {
        return this.mapNo;
    },
    setMapNo: function(mapNo) {
        this.mapNo = mapNo;
    },
    "mouseoverFun": function() {
        this.bMouseInMap = true;
        var event = arguments[0] || window.event;
        var relTarg = event.relatedTarget || event.fromElement;
        if (!this.textMouseOut(relTarg)) {
            if (!this.bResizeOk) {
                var viewBound = this.getCurrentSize();
                if (!viewBound.equals(this.viewBound)) {

                    this.viewBound = viewBound;
                    this.bResizeOk = true;
                    this.transform.setViewBound(this.viewBound.w, this.viewBound.h);
                    this.display.getDisplayImages();
                    var pos = new Generic.CPoint(0, 0);
                    if (this.rulerDiv) {

                        pos.x = 10;
                        pos.y = this.viewBound.h - 33;
                        Util.modifyAlphaImageDiv(this.rulerDiv, null, pos, null, null, "absolute");
                    }
                    if (this.checkNumDiv) {
                        pos.x = 100;
                        pos.y = this.viewBound.h - 20;
                        Util.modifyAlphaImageDiv(this.checkNumDiv, null, pos, null, null, "absolute");
                    }
                    if (this.OverviewMapDiv) {
                        var OverMapPos = new Generic.CPoint(0, 0);
                        var contrlBarDiv = document.getElementById("markerOvermapDiv");

                        if (contrlBarDiv && parseInt(contrlBarDiv.style.left) < 0) {
                            OverMapPos.x = this.viewBound.w - 15;
                            OverMapPos.y = this.viewBound.h - 15;


                        } else {
                            OverMapPos.x = this.viewBound.w - 159;
                            OverMapPos.y = this.viewBound.h - 159;

                        }

                        Util.modifyDOMElement(this.OverviewMapDiv, null, OverMapPos, null, "absolute", null);

                    }

                }

            }

            if (Util.getBrowserName() == "msie") {

                if (!document.hasFocus()) {
                    document.body.focus();
                    this.div.focus();

                }
            }

        }

    },



    zoomInTime: function() {


        this.curZoomDivWidth += 10;
        if (this.curZoomDivWidth >= this.zoomDivMax) {
            if (this.timeoutId)
                window.clearInterval(this.timeoutId);
            this.timeoutId = null;
            this.curZoomDivWidth = this.zoomDivMin;
            this.dynamicZoomDiv.style.display = "none";
            if (this.bGetImage) {
                this.bGetImage = false;
                this.display.mouseWheelGetImages(true);

            }
            this.display.drawLayers();

        } else {

            var viewCenterX = this.mouseWheelClientPnt.x;
            var viewCenterY = this.mouseWheelClientPnt.y;
            this.dynamicZoomDiv.style.left = (viewCenterX - this.curZoomDivWidth / 2) + "px";
            this.dynamicZoomDiv.style.top = (viewCenterY - this.curZoomDivWidth / 2) + "px";
            this.dynamicZoomDiv.style.width = this.curZoomDivWidth + "px";
            this.dynamicZoomDiv.style.height = this.curZoomDivWidth + "px";
            this.dynamicZoomDiv.style.display = '';

        }



    },

    zoomOutTime: function() {

        this.curZoomDivWidth -= 10;
        if (this.curZoomDivWidth <= this.zoomDivMin) {
            if (this.timeoutId)
                window.clearInterval(this.timeoutId);
            this.timeoutId = null;
            this.curZoomDivWidth = this.zoomDivMax;
            this.dynamicZoomDiv.style.display = "none";
            if (this.bGetImage) {
                this.bGetImage = false;
                this.display.mouseWheelGetImages(true);

            }
            this.display.drawLayers();

        } else {

            var viewCenterX = this.mouseWheelClientPnt.x;
            var viewCenterY = this.mouseWheelClientPnt.y;
            this.dynamicZoomDiv.style.left = (viewCenterX - this.curZoomDivWidth / 2) + "px";
            this.dynamicZoomDiv.style.top = (viewCenterY - this.curZoomDivWidth / 2) + "px";
            this.dynamicZoomDiv.style.width = this.curZoomDivWidth + "px";
            this.dynamicZoomDiv.style.height = this.curZoomDivWidth + "px";
            this.dynamicZoomDiv.style.display = '';
        }



    },


    changeZoomDivStyle: function(nType) {


        var leftTopDiv = document.getElementById("leftTopDiv");
        var rightTopDiv = document.getElementById("rightTopDiv");
        var rightBottomDiv = document.getElementById("rightBottomDiv");
        var leftBottomDiv = document.getElementById("leftBottomDiv");

        if (nType == 1) {
            leftTopDiv.style.borderWidth = "0px 2px 2px 0px";
            rightTopDiv.style.borderWidth = "0px 0px 2px 2px";
            rightBottomDiv.style.borderWidth = "2px 0px 0px 2px";
            leftBottomDiv.style.borderWidth = "2px 2px 0px 0px";

        } else {

            leftTopDiv.style.borderWidth = "2px 0px 0px 2px";
            rightTopDiv.style.borderWidth = "2px 2px 0px 0px";
            rightBottomDiv.style.borderWidth = "0px 2px 2px 0px";
            leftBottomDiv.style.borderWidth = "0px 0px 2px 2px";

        }


    },

    "DOMMouseScrollFun": function() {
        if (this.timeoutDragId) {
            window.clearInterval(this.timeoutDragId);
            this.timeoutDragId = null;
        }
        this.bJudgePoiInfo = true;
        var event = arguments[0] || window.event;
        var relTarg = event.target;
        if (!this.textMouseOut(relTarg)) {
            return false;
        }
        this.drawTip(null, null, false);
        var Pos = Util.getMousePosition(this.div, event);
        Pos.x -= this.viewPortDiv.clientLeft;
        Pos.y -= this.viewPortDiv.clientTop;
        Pos.x -= this.border;
        Pos.y -= this.border;
        var Posworld = this.transform.ClientToWorld(Pos);

        this.mouseWheelClientPnt.x = Pos.x;
        this.mouseWheelClientPnt.y = Pos.y;
        this.mouseWheelWorldPnt.x = Posworld.x;
        this.mouseWheelWorldPnt.y = Posworld.y;

        var bValidScale = false;

        this.tileSwitchDiv.style.display = "";
        var curTimestamp = new Date();
        var tick = Math.abs(curTimestamp.getTime() - this.timeStamp.getTime());
        this.timeStamp = null;
        this.timeStamp = curTimestamp;
        this.bGetImage = true;
        if (tick <= 300) {

            if (event.detail == -3) {

                var scale = this.getNextScale(this.curScale, false);
                bValidScale = this.setCurrentScale(scale, false);
            } else if (event.detail == 3) {

                var scale = this.getNextScale(this.curScale, true);
                bValidScale = this.setCurrentScale(scale, false);
            }
            this.mouseWheelTime++;

            event.cancelBubble = true;
            var zoomPosworld = this.transform.WorldToClient2(Posworld.x, Posworld.y);
            zoomPosworld.x -= this.transform.posViewleftTop.x;
            zoomPosworld.y -= this.transform.posViewleftTop.y;

            if (bValidScale) {
                this.display.hideLayers();
                this.scrollToPos(Pos.x - zoomPosworld.x, Pos.y - zoomPosworld.y, true);
            }

            if (!this.timeoutId) {

                this.display.mouseWheelGetImages(true);
                this.display.drawLayers();
                this.bGetImage = false;


            } else {
                if (this.mouseWheelTime > 5) {

                    this.display.deleteTransitMap(true);
                } else {
                    this.tileContainDiv.style.visibility = "hidden";

                    this.display.drawMarkers();
                    this.display.drawVectorList();
                    this.display.transitMap();
                }


            }
            event.preventDefault();
            return false;

        }

        this.mouseWheelTime = 0;
        if (event.detail == -3) {
            this.dynamicZoomDiv.style.display = "none";
            if (this.timeoutId)
                window.clearInterval(this.timeoutId);
            this.timeoutId = null;

            if (this.curScale > this.minScale) {
                this.display.hideLayers();
                this.changeZoomDivStyle(2);
                this.dynamicZoomDiv.style.width = this.zoomDivMin + "px";
                this.dynamicZoomDiv.style.height = this.zoomDivMin + "px";
                this.curZoomDivWidth = this.zoomDivMin;
                this.timeoutId = window.setInterval(Util.bind(this.zoomInTime, this), 70);
                var scale = this.getNextScale(this.curScale, false);
                bValidScale = this.setCurrentScale(scale, false);

                if (bValidScale) {
                    var zoomPosworld = this.transform.WorldToClient2(Posworld.x, Posworld.y);
                    zoomPosworld.x -= this.transform.posViewleftTop.x;
                    zoomPosworld.y -= this.transform.posViewleftTop.y;

                    this.scrollToPos(Pos.x - zoomPosworld.x, Pos.y - zoomPosworld.y, true);
                    this.display.getDisplayImages(true);
                    this.bGetImage = false;

                }
            }


        } else if (event.detail == 3) {
            this.dynamicZoomDiv.style.display = "none";
            if (this.timeoutId)
                window.clearInterval(this.timeoutId);
            this.timeoutId = null;

            if (this.curScale < this.maxScale) {
                this.display.hideLayers();
                this.changeZoomDivStyle(1);
                this.dynamicZoomDiv.style.width = this.zoomDivMax + "px";
                this.dynamicZoomDiv.style.height = this.zoomDivMax + "px";
                this.curZoomDivWidth = this.zoomDivMax;
                this.timeoutId = window.setInterval(Util.bind(this.zoomOutTime, this), 70);
                var scale = this.getNextScale(this.curScale, true);
                bValidScale = this.setCurrentScale(scale, false);
                if (bValidScale) {
                    var zoomPosworld = this.transform.WorldToClient2(Posworld.x, Posworld.y);
                    zoomPosworld.x -= this.transform.posViewleftTop.x;
                    zoomPosworld.y -= this.transform.posViewleftTop.y;

                    this.scrollToPos(Pos.x - zoomPosworld.x, Pos.y - zoomPosworld.y, true);
                    this.display.getDisplayImages(true);
                    this.bGetImage = false;

                }
            }

        }


        event.preventDefault();
        return false;
    },

    "mousewheelFun": function() {

        if (this.timeoutDragId) {
            window.clearInterval(this.timeoutDragId);
            this.timeoutDragId = null;
        }
        this.bJudgePoiInfo = true;
        var event = arguments[0] || window.event;
        var relTarg = event.relatedTarget || event.srcElement;
        if (!this.textMouseOut(relTarg)) {
            return;
        }

        this.drawTip(null, null, false);
        var Pos = Util.getMousePosition(this.div, event);
        Pos.x -= this.viewPortDiv.clientLeft;
        Pos.y -= this.viewPortDiv.clientTop;
        Pos.x -= this.border;
        Pos.y -= this.border;
        var Posworld = this.transform.ClientToWorld(Pos);

        this.mouseWheelClientPnt.x = Pos.x;
        this.mouseWheelClientPnt.y = Pos.y;
        this.mouseWheelWorldPnt.x = Posworld.x;
        this.mouseWheelWorldPnt.y = Posworld.y;
        this.tileSwitchDiv.style.display = "";


        var bValidScale = false;
        var curTimestamp = new Date();
        var tick = Math.abs(curTimestamp.getTime() - this.timeStamp.getTime());
        this.timeStamp = null;
        this.timeStamp = curTimestamp;
        this.bGetImage = true;
        if (tick <= 300) {
            this.mouseWheelTime++;
            if (event.wheelDelta == 120) {

                var scale = this.getNextScale(this.curScale, false);
                bValidScale = this.setCurrentScale(scale, false);

            } else if (event.wheelDelta == -120) {

                var scale = this.getNextScale(this.curScale, true);
                bValidScale = this.setCurrentScale(scale, false);
            }

            var zoomPosworld = this.transform.WorldToClient2(Posworld.x, Posworld.y);
            zoomPosworld.x -= this.transform.posViewleftTop.x;
            zoomPosworld.y -= this.transform.posViewleftTop.y;

            if (bValidScale) {
                this.display.hideLayers();
                this.scrollToPos(Pos.x - zoomPosworld.x, Pos.y - zoomPosworld.y, true);
            }

            if (!this.timeoutId) {

                this.display.mouseWheelGetImages(true);
                this.display.drawLayers();
                this.bGetImage = false;

            } else {

                if (this.mouseWheelTime > 5) {
                    this.display.deleteTransitMap(true);

                } else {
                    this.tileContainDiv.style.visibility = "hidden";

                    this.display.drawMarkers();
                    this.display.drawVectorList();
                    this.display.transitMap();
                }


            }

            event.returnValue = false;
            return false;

        }

        this.mouseWheelTime = 0;
        if (event.wheelDelta == 120) {
            this.dynamicZoomDiv.style.display = "none";
            if (this.timeoutId)
                window.clearInterval(this.timeoutId);
            this.timeoutId = null;

            if (this.curScale > this.minScale) {
                this.display.hideLayers();
                this.changeZoomDivStyle(2);
                this.dynamicZoomDiv.style.width = this.zoomDivMin + "px";
                this.dynamicZoomDiv.style.height = this.zoomDivMin + "px";
                this.curZoomDivWidth = this.zoomDivMin;
                this.timeoutId = window.setInterval(Util.bind(this.zoomInTime, this), 70);
                var scale = this.getNextScale(this.curScale, false);
                bValidScale = this.setCurrentScale(scale, false);


                if (bValidScale) {
                    var zoomPosworld = this.transform.WorldToClient2(Posworld.x, Posworld.y);
                    zoomPosworld.x -= this.transform.posViewleftTop.x;
                    zoomPosworld.y -= this.transform.posViewleftTop.y;
                    this.scrollToPos(Pos.x - zoomPosworld.x, Pos.y - zoomPosworld.y, true);

                    this.display.getDisplayImages(true);
                    this.bGetImage = false;
                }

            }


        } else if (event.wheelDelta == -120) {
            this.dynamicZoomDiv.style.display = "none";
            if (this.timeoutId)
                window.clearInterval(this.timeoutId);
            this.timeoutId = null;

            if (this.curScale < this.maxScale) {
                this.display.hideLayers();
                this.changeZoomDivStyle(1);
                this.dynamicZoomDiv.style.width = this.zoomDivMax + "px";
                this.dynamicZoomDiv.style.height = this.zoomDivMax + "px";
                this.curZoomDivWidth = this.zoomDivMax;
                this.timeoutId = window.setInterval(Util.bind(this.zoomOutTime, this), 70);
                var scale = this.getNextScale(this.curScale, true);
                bValidScale = this.setCurrentScale(scale, false);

                if (bValidScale) {

                    var zoomPosworld = this.transform.WorldToClient2(Posworld.x, Posworld.y);
                    zoomPosworld.x -= this.transform.posViewleftTop.x;
                    zoomPosworld.y -= this.transform.posViewleftTop.y;
                    this.scrollToPos(Pos.x - zoomPosworld.x, Pos.y - zoomPosworld.y, true);
                    this.display.getDisplayImages(true);
                    this.bGetImage = false;
                }

            }

        }

        event.returnValue = false;
        return false;

    },


    getNextScale: function(nCurrentScale, bZoomIn) {
        var nCurrentIndex = 0;
        var nIndex = 0;

        nCurrentIndex = this.scale.length;

        for (var i = 0; i < nCurrentIndex; i++) {
            if (this.scale[i] == nCurrentScale) {
                nIndex = i;
                break;
            } else if (this.scale[i] > nCurrentScale) {
                nIndex = i;
                break;
            }
        }

        if (bZoomIn) {
            if (this.scale[nIndex] > nCurrentScale) {
                if (this.scale[nIndex] >= this.axScale) {
                    return this.maxScale;
                }
                return this.scale[nIndex];
            } else {
                nIndex++;
                var nTempScale = 0;
                if (nIndex > nCurrentIndex - 1)
                    nTempScale = this.scale[nCurrentIndex - 1];
                else nTempScale = this.scale[nIndex];

                if (nTempScale >= this.maxScale) {
                    return this.maxScale;
                }
                return nTempScale;
            }

        } else {

            if (this.scale[nIndex] < nCurrentScale) {

                if (this.scale[nIndex] <= this.minScale) {
                    return this.minScale;
                }

                return this.scale[nIndex];
            } else {
                var nTempScale = 0;
                nIndex--;
                if (nIndex < 0)
                    nTempScale = this.scale[0];
                else nTempScale = this.scale[nIndex];


                if (nTempScale <= this.minScale) {
                    return this.minScale;
                }
                return nTempScale;

            }

        }
    },

    textMouseOut: function(obj) {
        while (obj != null && typeof(obj.tagName) != "undefind") {
            if (obj == this.viewPortDiv)
                return true;
            obj = obj.parentNode;
        }
        return false;
    },

    "mouseoutFun": function() {
        var event = arguments[0] || window.event;
        var relTarg = document.all ? event.srcElement : event.target;
        this.bMouseInMap = false;

    },
    "mousedownFun": function() {

        var event = arguments[0] || window.event;
        if (this.viewPortDiv.setCapture)
            this.viewPortDiv.setCapture();
        if (Util.getBrowserName() != "msie")
            event.preventDefault();


        var Pos = Util.getMousePosition(this.div, event);
        Pos.x -= this.viewPortDiv.clientLeft;
        Pos.y -= this.viewPortDiv.clientTop;

        Pos.x -= this.border;
        Pos.y -= this.border;



        if (event.button == 2 || event.button == 0) {
            if (Util.getBrowserName() != "msie" && event.button == 0) {
                if (this.contextMenuObj)
                    this.contextMenuObj.style.display = 'none'
            } else {
                return;
            }
        } else if (this.contextMenuObj)
            this.contextMenuObj.style.display = 'none';

        if (this.timeoutDragId) {
            window.clearInterval(this.timeoutDragId);
            this.timeoutDragId = null;
            this.curZoomDivWidth = this.zoomDivMin;
        }
        if (Util.isLeftClick(event)) {
            this.bMouseDown = true;
            this.bMouseMove = false;
            if (this.markerMouseState != this.MARKER_MOUSEUP["MARKER_DOWN"]) {
                this.bInVectorRange = false;
                if (this.selectVectorID && !this.layerSelectObj) {
                    vector = this.vectorList[this.selectVectorID];

                    if (vector && vector.index && vector.mouseoverIndex && vector.index != vector.mouseoverIndex) {

                        var marker = document.getElementById(this.selectVectorID);
                        this.getVmlOrSvg().setStyle(marker, this.getVmlOrSvg().getTyple(vector.index));

                    }

                    this.selectVectorID = null;
                }

            } else {

            }

            this.lastPoint.x = Pos.x;
            this.lastPoint.y = Pos.y;
            this.btnDownPnt.x = Pos.x;
            this.btnDownPnt.y = Pos.y;

            this.timeStamp = null;
            this.timeStamp = new Date();;

            var vector, Posworld;
            if (this.judgeState('MAP_DISTANCE')) {
                if (this.selectEditPntID == null && this.selectElementID == null) {
                    vector = this.vectorList["distance"];
                    Posworld = this.transform.ClientToWorld(Pos);
                    vector.pntList.push(Posworld);
                }

            } else if (this.judgeState('MAP_ZOOMOUT')) {
                vector = this.vectorList["zoom"];
                Posworld = this.transform.ClientToWorld(Pos);
                vector.pntList.push(Posworld);
            } else if (this.judgeState('MAP_ZOOMIN')) {
                vector = this.vectorList["zoom"];
                Posworld = this.transform.ClientToWorld(Pos);
                vector.pntList.push(Posworld);
            } else if (this.judgeState('MAP_RANGE')) {
                if (this.selectEditPntID == null && this.selectElementID == null) {
                    vector = this.vectorList["zoom"];
                    Posworld = this.transform.ClientToWorld(Pos);
                    vector.pntList.push(Posworld);
                }

            } else if (this.judgeState('MAP_AREA')) {
                if (this.selectEditPntID == null && this.selectElementID == null) {
                    vector = this.vectorList["area"];
                    Posworld = this.transform.ClientToWorld(Pos);
                    vector.pntList.push(Posworld);
                }
            } else if (this.judgeState('MAP_MOVING')) {
                if (!this.bSelectPnt)
                    this.viewPortDiv.style.cursor = "move";
            }

        }

    },

    "mouseupFun": function() {


        this.bJudgePoiInfo = true;
        if (this.bMouseupGetImage)
            this.display.getDisplayImages();
        this.bMouseUpTime++;
        if (Util.getBrowserName() == "msie") {
            this.display.setEditVectorExtent();
            this.display.drawVectorLine();
        }
        if (this.bMouseMove) {
            if (this.bMouseUpTime >= 3) {
                this.tileSwitchDiv.style.display = "none";
                this.bMouseUpTime = 0;
            }
        }
        this.selectEditPntID = null;
        this.vectorTipName = null;
        this.markerMouseState = this.MARKER_MOUSEUP["MOUSE_UP"];;
        var event = arguments[0] || window.event;
        if (this.viewPortDiv.releaseCapture)
            this.viewPortDiv.releaseCapture();
        if (Util.getBrowserName() != "msie")
            event.preventDefault();
        var Pos = Util.getMousePosition(this.div, event);
        Pos.x -= this.viewPortDiv.clientLeft;
        Pos.y -= this.viewPortDiv.clientTop;
        Pos.x -= this.border;
        Pos.y -= this.border;

        if (event.button == 2 || event.button == 0) {
            if (!(Util.getBrowserName() != "msie" && event.button == 0)) {
                if (this.contextMenuObj) {
                    this.contextMenuObj.style.left = Pos.x + 10 + 'px';
                    this.contextMenuObj.style.top = Pos.y + 10 + 'px';
                    this.contextMenuObj.style.display = 'block';
                }
                return;
            }
        }

        if (this.bMouseDown) {

            this.bMouseDown = false;
            if (this.judgeState('MAP_ZOOMOUT') || this.judgeState('MAP_ZOOMIN') || this.judgeState('MAP_RANGE')) {
                var node = Util.getElement("zoom");
                if (node) {
                    var vector = this.vectorList["zoom"];
                    var numComponents = vector.pntList.length;

                    if (numComponents >= 2) {
                        var top = vector.pntList[0];
                        var bottom = vector.pntList[1];
                        var scale = this.curScale;

                        width = top.x + (bottom.x - top.x) / 2;
                        height = top.y + (bottom.y - top.y) / 2;
                        if (this.judgeState('MAP_ZOOMOUT')) {
                            scale = this.getNextScale(this.curScale, true);


                            this.setCurrentScale(scale, false);
                            this.moveToCenter(width, height);
                        } else if (this.judgeState('MAP_ZOOMIN')) {
                            scale = this.getNextScale(this.curScale, false);

                            this.setCurrentScale(scale, false);
                            this.moveToCenter(width, height);
                        } else if (this.getDrawPolygonFun) {
                            var strList = "";
                            var leftTop = top;
                            var rightBottom = bottom;
                            strList += leftTop.x + "," + leftTop.y + ";";
                            strList += rightBottom.x + "," + leftTop.y + ";";
                            strList += rightBottom.x + "," + rightBottom.y + ";";
                            strList += leftTop.x + "," + rightBottom.y;
                            this.getDrawPolygonFun(strList);
                        }


                    }
                    vector.pntList.length = 0;
                    this.getVmlOrSvg().drawRectangle(node, vector);
                }

            } else if (this.judgeState('MAP_ADDPOI') && !this.bMouseMove) {

                var vector = this.vectorList["addpoi"];
                var Posworld = this.transform.ClientToWorld(Pos);
                this.addPoint("addpoi", null, Posworld.x, Posworld.y);

                if (vector && vector.fun) {
                    vector.fun(Posworld.x, Posworld.y);

                }

            } else if (this.judgeState('MAP_MOVING')) {
                this.viewPortDiv.style.cursor = "auto";
            }

        }

        if (this.mouseUpFun) {
            var Posworld = this.transform.ClientToWorld(Pos);
            this.mouseUpFun(Posworld.x, Posworld.y, this.state, this.bMouseMove);

        }


        if (!this.bMouseMove) {
            if (this.layerSelectObj) {
                if (this.layerSelectObj.t == 272 || this.layerSelectObj.t == 273) {
                    this.setMapCenter(this.layerSelectObj.lo, this.layerSelectObj.la);
                    this.setCurrentScale(80, true);
                    this.drawTip(null, null, false);
                } else
                    this.selectPoiMouseUpFun(this.layerSelectObj.id, this.layerSelectObj.name, this.layerSelectObj.mapno, this.layerSelectObj.lo, this.layerSelectObj.la, this.layerSelectObj.t);


            } else if (this.selectVectorID) {

                var Posworld = this.transform.ClientToWorld(Pos);
                vector = this.vectorList[this.selectVectorID];
                if (vector && vector.fun)
                    vector.fun(vector.id, vector.code, Posworld.x, Posworld.y, vector.name);

            }

        } else {

            var curTimestamp = new Date();
            if (Math.abs(curTimestamp.getTime() - this.timeStamp.getTime()) < 250) {

                if (this.timeoutDragId)
                    window.clearInterval(this.timeoutDragId);
                this.timeoutDragId = null;
                if (this.timeoutId) {

                    window.clearInterval(this.timeoutId);
                    this.dynamicZoomDiv.style.display = "none";
                    this.timeoutId = null;

                }
                this.getPosInLine(this.btnDownPnt.x, this.btnDownPnt.y, this.lastPoint.x, this.lastPoint.y, 40);
                this.curZoomDivWidth = this.zoomDivMin;
                this.timeoutDragId = window.setInterval(Util.bind(this.mouseupDrag, this), 50);
                this.scrollToPos(this.dragSegOffset.x, this.dragSegOffset.y);
                if (this.timeoutDragId)
                    this.bJudgePoiInfo = false;
                this.moveStepValue = 1.5;

            } else {

                this.display.drawLayers();
            }

        }
        this.display.selectIconInfo();
        this.display.setSelectIconID();

        this.bMouseMove = false;

    },



    getScreenCenter: function() {
        return this.transform.posScreenCenter.clone();
    },
    mouseupDrag: function() {

        this.curZoomDivWidth += 5;


        if (this.curZoomDivWidth >= this.zoomDivMax) {
            this.moveStepValue = 1.5;
            if (this.timeoutDragId)
                window.clearInterval(this.timeoutDragId);
            this.timeoutDragId = null;
            this.curZoomDivWidth = this.zoomDivMin;
            if (Util.getBrowserName() == "msie") {
                this.display.setEditVectorExtent();
                this.display.drawVectorLine();
            }
            this.display.drawLayers();
            this.bJudgePoiInfo = true;


        } else {
            this.moveStepValue -= 0.1;
            if (this.moveStepValue > 0)
                this.scrollToPos(Math.floor(this.dragSegOffset.x * this.moveStepValue), Math.floor(this.dragSegOffset.y * this.moveStepValue));
        }

    },
    addMarker: function(id, type, url, x, y, fun, tip) {
        var x = parseInt(x);
        var y = parseInt(y);
        this.display.addMarker(String(id), type, url, x, y, fun, tip);
        this.locateBound.right = (x < this.locateBound.right) ? x : this.locateBound.right;
        this.locateBound.left = (x > this.locateBound.left) ? x : this.locateBound.left;
        this.locateBound.top = (y < this.locateBound.top) ? y : this.locateBound.top;
        this.locateBound.bottom = (y > this.locateBound.bottom) ? y : this.locateBound.bottom;


    },
    addMarkerLetter: function(id, type, url, x, y, fun, value, tip) {
        var x = parseInt(x);
        var y = parseInt(y);
        this.display.addMarkerLetter(String(id), type, url, x, y, fun, value, tip);
        this.locateBound.right = (x < this.locateBound.right) ? x : this.locateBound.right;
        this.locateBound.left = (x > this.locateBound.left) ? x : this.locateBound.left;
        this.locateBound.top = (y < this.locateBound.top) ? y : this.locateBound.top;
        this.locateBound.bottom = (y > this.locateBound.bottom) ? y : this.locateBound.bottom;


    },
    addIcon: function(id, type, name, url, x, y, w, h, imgOffsetX, imgOffsetY, fun, scale, divOffsetX, divOffsetY, canMove) {
        var x = parseInt(x);
        var y = parseInt(y);
        this.locateBound.right = (x < this.locateBound.right) ? x : this.locateBound.right;
        this.locateBound.left = (x > this.locateBound.left) ? x : this.locateBound.left;
        this.locateBound.top = (y < this.locateBound.top) ? y : this.locateBound.top;
        this.locateBound.bottom = (y > this.locateBound.bottom) ? y : this.locateBound.bottom;

        scale = scale ? scale : 100000;

        return this.display.addIcon(String(id), type, name, url, x, y, w, h, imgOffsetX, imgOffsetY, fun, scale, divOffsetX, divOffsetY, canMove, null);
    },

    addIcon1: function(id, type, name, url, x, y, w, h, imgOffsetX, imgOffsetY, fun, scale, divOffsetX, divOffsetY, canMove) {
        var x = parseInt(x);
        var y = parseInt(y);
        this.locateBound.right = (x < this.locateBound.right) ? x : this.locateBound.right;
        this.locateBound.left = (x > this.locateBound.left) ? x : this.locateBound.left;
        this.locateBound.top = (y < this.locateBound.top) ? y : this.locateBound.top;
        this.locateBound.bottom = (y > this.locateBound.bottom) ? y : this.locateBound.bottom;

        scale = scale ? scale : 100000;
        return this.display.addIcon(String(id), type, name, url, x, y, w, h, imgOffsetX, imgOffsetY, fun, scale, divOffsetX, divOffsetY, canMove, 1);
    },
    addIcon2: function(id, type, name, url, x, y, w, h, imgOffsetX, imgOffsetY, fun, scale, divOffsetX, divOffsetY, canMove) {
        var x = parseInt(x);
        var y = parseInt(y);
        this.locateBound.right = (x < this.locateBound.right) ? x : this.locateBound.right;
        this.locateBound.left = (x > this.locateBound.left) ? x : this.locateBound.left;
        this.locateBound.top = (y < this.locateBound.top) ? y : this.locateBound.top;
        this.locateBound.bottom = (y > this.locateBound.bottom) ? y : this.locateBound.bottom;

        scale = scale ? scale : 100000;
        return this.display.addIcon(String(id), type, name, url, x, y, w, h, imgOffsetX, imgOffsetY, fun, scale, divOffsetX, divOffsetY, canMove, 2);
    },
    addIcon3: function(id, type, name, url, x, y, w, h, imgOffsetX, imgOffsetY, fun, scale, divOffsetX, divOffsetY, canMove) {
        var x = parseInt(x);
        var y = parseInt(y);
        this.locateBound.right = (x < this.locateBound.right) ? x : this.locateBound.right;
        this.locateBound.left = (x > this.locateBound.left) ? x : this.locateBound.left;
        this.locateBound.top = (y < this.locateBound.top) ? y : this.locateBound.top;
        this.locateBound.bottom = (y > this.locateBound.bottom) ? y : this.locateBound.bottom;

        scale = scale ? scale : 100000;
        return this.display.addIcon(String(id), type, name, url, x, y, w, h, imgOffsetX, imgOffsetY, fun, scale, divOffsetX, divOffsetY, canMove, 3);
    },

    addTextDiv: function(id, type, name, x, y, divOffsetX, divOffsetY, backColor, penColor, fun, scale) {
        var x = parseInt(x);
        var y = parseInt(y);
        scale = scale ? scale : 100000;
        return this.display.addTextDiv(String(id), type, name, x, y, divOffsetX, divOffsetY, backColor, penColor, fun, scale);
    },

    addPopDiv: function(id, x, y, w, h, divOffsetX, divOffsetY, fun, contentHTML) {
        var x = parseInt(x);
        var y = parseInt(y);
        this.display.addPopDiv(String(id), x, y, w, h, divOffsetX, divOffsetY, fun, contentHTML);
    },


    drawmeasureDistanceTip: function(pntList) {

        var numComponents = pntList.length;
        var nLength = 0;

        if (numComponents > 1) {

            var comp = pntList[numComponents - 1]
            postop = this.transform.WorldToClient2(comp.x, comp.y);
            postop.x += 4;
            postop.y -= 20;
            if (!this.bDrawTip) {
                this.drawTip(this.dblclickOver, postop, true);
            } else {
                for (var i = 0; i < numComponents - 1; i++) {
                    nLength += Util.GetLenBetween2Point(pntList[i], pntList[i + 1]);
                }

                units = this.unitM;
                if (nLength >= 1000) {
                    nLength = nLength / 1000;
                    units = this.unitKM;
                }
                if (isNaN(nLength)) {

                    return;
                }
                nLength = parseFloat(nLength).toFixed(2) + units;
                this.drawTip(nLength, postop, true);
            }

        }

    },
    drawmeasureAreaTip: function(pntList) {

        var numComponents = pntList.length;
        var nLength = 0;

        if (numComponents > 2) {
            var parts = [];
            var comp = pntList[numComponents - 1];
            postop = this.transform.WorldToClient2(comp.x, comp.y);
            postop.x += 4;
            postop.y -= 20;
            if (!this.bDrawTip) {
                this.drawTip(this.dblclickOver, postop, true);
            } else {

                for (var i = 0; i < numComponents; i++) {
                    comp = vector.pntList[i];
                    parts.push(comp.clone());
                }
                comp = vector.pntList[0];
                parts.push(comp.clone());

                nLength = Util.getGeodesicArea(parts);
                if (nLength == 0) {
                    this.drawTip(null, null, false);

                }
                units = this.unitM2;
                if (nLength >= 1000000) {
                    nLength = nLength / 1000000;
                    units = this.unitKM2;
                }

                nLength = parseFloat(nLength).toFixed(2) + units;
                this.drawTip(nLength, postop, true);
            }


        } else
            this.drawTip(null, null, false);

    },
    delMarkerLetter: function(id) {
        this.display.delMarkerLetter(id);

    },
    delMarker: function(id) {
        this.display.delMarker(id);

    },
    delIcon: function(id) {
        this.display.delIcon(id);

    },
    delIcon1: function(id) {
        this.display.delIcon1(id);

    },
    delIcon2: function(id) {
        this.display.delIcon2(id);

    },
    delIcon3: function(id) {
        this.display.delIcon3(id);

    },
    delDiv: function(id) {
        this.display.delDiv(id);

    },
    delTextDiv: function(id) {
        this.display.delTextDiv(id);

    },
    addMouseUpEvent: function(callFun) {
        this.mouseUpFun = callFun;
    },
    addSelectPoiMouseUpFun: function(callFun) {
        this.selectPoiMouseUpFun = callFun;
    },

    delVector: function(id) {
        if (id) {
            id = String(id);
            var node = Util.getElement(id);
            if (node)
                node.parentNode.removeChild(node);
            if (this.vectorList[id]) {
                this.vectorList[id].pntList.length = 0;
                delete this.vectorList[id];
            }

        } else {
            var delList = [];
            for (key in this.vectorList) {
                if (key == "distance" || key == "area")
                    continue;

                this.vectorList[key].pntList.length = 0;
                delList.push(key);

            }
            for (var i = 0; i < delList.length; i++) {

                var delkey = delList[i];
                var node = Util.getElement(delkey);
                if (node) {
                    node.parentNode.removeChild(node);
                }
                delete this.vectorList[delkey];
            }


        }


    },
    "mousemoveFun": function() {

        var event = arguments[0] || window.event;
        var Pos = Util.getMousePosition(this.div, event);
        Pos.x -= this.viewPortDiv.clientLeft;
        Pos.y -= this.viewPortDiv.clientTop;
        Pos.x -= this.border;
        Pos.y -= this.border;

        var Posworld = this.transform.ClientToWorld(Pos);

        if (this.judgeState('MAP_DISTANCE')) {
            if (this.selectEditPntID == null && this.selectElementID == null) {
                var node = Util.getElement("distance");
                vector = this.vectorList["distance"];

                if (vector) {


                    vector.pntList.pop();
                    vector.pntList.push(Posworld);
                    this.getVmlOrSvg().drawLine(node, vector);
                    this.drawmeasureDistanceTip(vector.pntList);
                }
            }

        } else if (this.judgeState('MAP_ZOOMOUT')) {
            var node = Util.getElement("zoom");
            vector = this.vectorList["zoom"];
            vector.pntList.pop();
            vector.pntList.push(Posworld);
            this.getVmlOrSvg().drawRectangle(node, vector);

            return;
        } else if (this.judgeState('MAP_ZOOMIN')) {
            var node = Util.getElement("zoom");
            vector = this.vectorList["zoom"];
            vector.pntList.pop();
            vector.pntList.push(Posworld);
            this.getVmlOrSvg().drawRectangle(node, vector);
            return;
        } else if (this.judgeState('MAP_RANGE')) {

            if (this.selectEditPntID == null && this.selectElementID == null) {
                var node = Util.getElement("zoom");
                vector = this.vectorList["zoom"];
                vector.pntList.pop();
                vector.pntList.push(Posworld);
                this.getVmlOrSvg().drawRectangle(node, vector);
                return;
            }


        } else if (this.judgeState('MAP_AREA')) {
            if (this.selectEditPntID == null && this.selectElementID == null) {
                var node = Util.getElement("area");
                vector = this.vectorList["area"];
                vector.pntList.pop();
                vector.pntList.push(Posworld);
                this.getVmlOrSvg().drawPolygon(node, vector);
                this.drawmeasureAreaTip(vector.pntList);
            }


        }

        if (Math.abs(Pos.x + Pos.y - this.lastPoint.x - this.lastPoint.y) > 2 && this.bMouseDown) {

            var moveX = Pos.x - this.lastPoint.x;
            var moveY = Pos.y - this.lastPoint.y;
            this.bJudgePoiInfo = true;
            var curTimestamp = new Date();
            var bGetImage = true;
            this.bMouseupGetImage = true;
            var spanTime = 70;
            if (Boolean(this.version) && (this.version >= 5.5 && this.version < 7.0)) {
                spanTime = 100;
            }

            if (Math.abs(curTimestamp.getTime() - this.moveTime.getTime()) > spanTime) {
                this.moveTime = null;
                this.moveTime = curTimestamp;
                bGetImage = false;
                this.bMouseupGetImage = false;
            }

            if (this.bEditState) {
                if (this.markerMouseState == this.MARKER_MOUSEUP["MARKER_UP"])
                    this.bInVectorRange = true;
                if (this.bInVectorRange) {
                    if (this.selectEditPntID) {
                        this.moveElement(this.selectEditPntID, Posworld.x, Posworld.y, false);
                    } else if (this.selectElementID) {

                        this.moveElement(this.selectElementID, moveX, moveY, true);
                    }
                } else if (this.selectEditPntID) {
                    this.moveElement(this.selectEditPntID, Posworld.x, Posworld.y, false);
                } else if (this.markerMouseState == this.MARKER_MOUSEUP["MARKER_DOWN"]) {
                    if (this.selectElementID) {
                        this.moveElement(this.selectElementID, moveX, moveY, true);
                    } else
                        this.scrollToPos(moveX, moveY, bGetImage);
                } else {
                    this.scrollToPos(moveX, moveY, bGetImage);
                }

            } else {
                if (this.display.getSelectIconID()) {
                    this.display.markerMouseMoveTo(Posworld);
                } else {

                    this.scrollToPos(moveX, moveY, bGetImage);
                }
            }


            this.lastPoint.x = Pos.x;
            this.lastPoint.y = Pos.y;
            this.bMouseMove = true;
            this.bMarkerMouseMove = true;

        } else if (!this.bMouseDown && this.judgeState('MAP_MOVING')) {
            if (this.bJudgePoiInfo) {
                if (this.vectorTipName) {
                    var postop = this.public.transform.WorldToClient2(Posworld.x, Posworld.y);
                    postop.x += 14;
                    postop.y -= 10;
                    this.drawTip(this.vectorTipName, postop, true);
                }

                var bannoDiv = true;
                var beditableDiv = true;
                var markerEvent = document.all ? event.srcElement : event.target;
                while (markerEvent != null && typeof(markerEvent.tagName) != "undefind") {
                    if (markerEvent.id == "annoDiv") {
                        this.viewPortDiv.style.cursor = "auto";
                        this.bSelectPnt = false;
                        this.drawTip(null, null, false);
                        bannoDiv = false;
                        break;
                    }
                    if (markerEvent.id == "editableDiv") {

                        beditableDiv = false;
                    }
                    markerEvent = markerEvent.parentNode;
                }

            }


        } else
            this.bSelectPnt = false;


    },

    moveElement: function(selectEditPntID, moveX, moveY, bElement) {
        var vector = this.vectorList[this.selectElementID];
        if (vector) {
            if (bElement) {

                var curX = this.transform.calcScale * moveX;
                var curY = this.transform.calcScale * moveY;
                for (var pos in vector.pntList) {
                    vector.pntList[pos].x += curX;
                    vector.pntList[pos].y -= curY;

                }

                for (var i = 0; i < this.editPntIndex; i++) {
                    var pntID = this.selectElementID + "_" + i;
                    var pntVector = this.vectorList[pntID];
                    if (pntVector) {
                        for (var pos in pntVector.pntList) {
                            pntVector.pntList[pos].x = vector.pntList[i].x;
                            pntVector.pntList[pos].y = vector.pntList[i].y;

                            this.addPoint(pntID, "", pntVector.pntList[pos].x, pntVector.pntList[pos].y);
                        }


                    }
                }

            } else if (!bElement) {

                var pointList = selectEditPntID.split('_');
                if (vector.style == "polygon" || vector.style == "polyline") {
                    if (pointList && pointList[1]) {
                        var nIndex = parseInt(pointList[1]);
                        vector.pntList[nIndex].x = moveX;
                        vector.pntList[nIndex].y = moveY;
                    }
                    this.addPoint(selectEditPntID, "", vector.pntList[nIndex].x, vector.pntList[nIndex].y, 1000, 1001, this.getEditPntInfo, null);
                } else {

                    if (pointList && pointList[1]) {
                        var nIndex = parseInt(pointList[1]);
                        vector.pntList[nIndex].x = moveX;
                        vector.pntList[nIndex].y = moveY;
                    }
                    this.addPoint(selectEditPntID, "", vector.pntList[nIndex].x, vector.pntList[nIndex].y, 1000, 1001, this.getEditPntInfo, null);

                    if (pointList[1] == 1 || pointList[1] == 3) {
                        var nextIndex = (parseInt(pointList[1]) + 1) % 4;
                        vector.pntList[nextIndex].x = moveX;
                        this.addPoint(pointList[0] + "_" + nextIndex, "", vector.pntList[nextIndex].x, vector.pntList[nextIndex].y, 1000, 1001, this.getEditPntInfo, null);

                        nextIndex = (parseInt(pointList[1]) + 3) % 4;
                        vector.pntList[nextIndex].y = moveY;
                        this.addPoint(pointList[0] + "_" + nextIndex, "", vector.pntList[nextIndex].x, vector.pntList[nextIndex].y, 1000, 1001, this.getEditPntInfo, null);
                    } else {
                        var nextIndex = (parseInt(pointList[1]) + 1) % 4;
                        vector.pntList[nextIndex].y = moveY;
                        this.addPoint(pointList[0] + "_" + nextIndex, "", vector.pntList[nextIndex].x, vector.pntList[nextIndex].y, 1000, 1001, this.getEditPntInfo, null);

                        nextIndex = (parseInt(pointList[1]) + 3) % 4;
                        vector.pntList[nextIndex].x = moveX;
                        this.addPoint(pointList[0] + "_" + nextIndex, "", vector.pntList[nextIndex].x, vector.pntList[nextIndex].y, 1000, 1001, this.getEditPntInfo, null);
                    }

                }
            }

            var node = Util.getElement(this.selectElementID);
            if (node) {
                if (vector.style == "polyline")
                    this.getVmlOrSvg().drawLine(node, vector);
                else
                    this.getVmlOrSvg().drawPolygon(node, vector);

            }


        } else
            return;

    },

    setNextScale: function() {
        var scale = this.getNextScale(this.curScale, false);
        this.setCurrentScale(scale, true);
    },
    setPreviousScale: function() {
        var scale = this.getNextScale(this.curScale, true);
        this.setCurrentScale(scale, true);
    },

    scrollToPos: function(left, top, bGetImage) {

        var bInRect = this.transform.scrollToPos(parseInt(left), parseInt(top));

        if (bInRect) {
            this.dragContainDiv.style.left = (parseInt(this.dragContainDiv.style.left) + parseInt(left)) + "px";
            this.dragContainDiv.style.top = (parseInt(this.dragContainDiv.style.top) + parseInt(top)) + "px";
            this.transform.setDragContainDivLeftTop(parseInt(this.dragContainDiv.style.left) * -1, (parseInt(this.dragContainDiv.style.top)) * -1);
            this.lastPoint.x = -left;
            this.lastPoint.y = -top;
            if (!bGetImage) {
                this.display.getDisplayImages();

                if (Util.getBrowserName() == "msie") {
                    this.display.setEditVectorExtent();
                    this.display.drawVectorLine();
                }
            }
            return true;
        } else
            return false;


    },
    "clickFun": function() {

    },
    "dblclickFun": function() {


        var event = arguments[0] || window.event;
        this.bMouseDown = false;
        if (this.judgeState('MAP_DISTANCE')) {
            var vector = null;
            var node = Util.getElement("distance");
            if (node)
                vector = this.vectorList["distance"];
            if (vector && this.getDrawLineFun) {
                var strList = "";
                if (vector.pntList.length >= 2) {
                    for (var i = 0; i < vector.pntList.length; i++) {
                        if (i == vector.pntList.length - 1) {
                            if (vector.pntList[i].x != vector.pntList[i - 1].x || vector.pntList[i].y != vector.pntList[i - 1].y)
                                strList += vector.pntList[i].x + "," + vector.pntList[i].y;
                        } else
                            strList += vector.pntList[i].x + "," + vector.pntList[i].y + ";";

                    }
                    this.getDrawLineFun(strList);
                }


            }
            this.clearTempVector();

        } else if (this.judgeState('MAP_AREA')) {
            var vector = null;
            var node = Util.getElement("area");
            if (node)
                vector = this.vectorList["area"];

            if (vector && this.getDrawPolygonFun) {
                var strList = "";
                if (vector.pntList.length >= 3) {
                    for (var i = 0; i < vector.pntList.length; i++) {
                        if (i == vector.pntList.length - 1) {
                            if (vector.pntList[i].x != vector.pntList[i - 1].x || vector.pntList[i].y != vector.pntList[i - 1].y)
                                strList += vector.pntList[i].x + "," + vector.pntList[i].y;
                        } else
                            strList += vector.pntList[i].x + "," + vector.pntList[i].y + ";";

                    }
                    this.getDrawPolygonFun(strList);
                }

            }
            this.clearTempVector();

        } else if (this.judgeState('MAP_MOVING')) {

            var viewCenterX = parseInt(this.viewBound.w / 2);
            var viewCenterY = parseInt(this.viewBound.h / 2);
            this.dynamicZoomDiv.style.display = "none";

            this.curZoomDivWidth = this.zoomDivMin;
            var Pos = Util.getMousePosition(this.div, event);
            Pos.x -= this.viewPortDiv.clientLeft;
            Pos.y -= this.viewPortDiv.clientTop;
            Pos.x -= this.border;
            Pos.y -= this.border;
            if (this.timeoutDragId)
                window.clearInterval(this.timeoutDragId);
            this.timeoutDragId = null;
            this.getPosInLine(Pos.x, Pos.y, viewCenterX, viewCenterY);
            this.timeoutDragId = window.setInterval(Util.bind(this.zoomInDrag, this), 70);

        }

    },


    adjustScaleWithBound: function(left, bottom, right, top) {

        this.scaleBound = new Generic.Bounds(left, bottom, right, top);
        if (!(this.mapExtent.containsBounds(this.scaleBound))) {
            return;

        }

        this.moveToCenter(this.scaleBound.getCenterLonLat().x, this.scaleBound.getCenterLonLat().y, true);

    },
    setMinLocateScale: function(scale) {
        this.minLocateScale = scale;
    },
    getPosInLine: function(startX, startY, endX, endY, bLength) {
        var dSegDistance = 0;
        if (bLength)
            dSegDistance = bLength;
        else
            dSegDistance = Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY));

        if (dSegDistance == 0.0) {
            dSegDistance = 0.000001;
        }

        var dValueSin = Math.abs(endY - startY) / dSegDistance;
        var dValueCos = Math.abs(endX - startX) / dSegDistance;

        if (dValueSin < 0.000001) {
            dValueSin = 0.000001;
        } else if (dValueCos < 0.000001) {
            dValueCos = 0.000001;
        }

        var oneSeg = dSegDistance / (this.zoomDivMax / this.zoomDivMin + 1);

        var nTempX = Math.abs(oneSeg * dValueCos);
        var nTempY = Math.abs(oneSeg * dValueSin);
        this.dragSegOffset.x = Math.floor(nTempX);
        this.dragSegOffset.y = Math.floor(nTempY);

        if (startX >= endX) {
            this.dragSegOffset.x = -this.dragSegOffset.x;
        }
        if (startY >= endY) {
            this.dragSegOffset.y = -this.dragSegOffset.y;
        }

    },

    movePopDivPos: function(imageDiv, pos) {


        pos.x -= this.transform.posViewleftTop.x;
        pos.y -= this.transform.posViewleftTop.y;

        var imageDivWidth = parseInt(Util.getStyle(imageDiv, 'width'));
        var imageDivHeight = parseInt(Util.getStyle(imageDiv, 'height'));
        var dragContainDivleft = parseInt(Util.getStyle(this.dragContainDiv, 'left'));
        var dragContainDivTop = parseInt(Util.getStyle(this.dragContainDiv, 'top'));
        var endX = pos.x;
        var endY = pos.y;

        if (pos.x + imageDivWidth > this.public.transform.mapViewWidth)
            endX = this.public.transform.mapViewWidth - imageDivWidth - 30;

        if (pos.y + imageDivHeight / 2 > this.public.transform.mapViewHeight)
            endY = this.public.transform.mapViewHeight - imageDivHeight / 2 - 30;

        if (pos.y - imageDivHeight / 2 < 0)
            endY = imageDivHeight / 2;

        if (pos.x < 10)
            endX = pos.x + (0 - pos.x) + 30;


        this.getPosInLine(pos.x, pos.y, endX, endY);

        if (this.timeoutDragId) {
            window.clearInterval(this.timeoutDragId);
            this.timeoutDragId = null;

        }
        this.curZoomDivWidth = this.zoomDivMin;
        if (endX != pos.x || endY != pos.y)
            this.timeoutDragId = window.setInterval(Util.bind(this.tipDivDrag, this), 80);

    },
    tipDivDrag: function() {

        this.curZoomDivWidth += 10;

        if (this.curZoomDivWidth >= this.zoomDivMax) {
            if (this.timeoutDragId)
                window.clearInterval(this.timeoutDragId);
            this.timeoutDragId = null;
            this.curZoomDivWidth = this.zoomDivMin;
        } else {

            this.scrollToPos(this.dragSegOffset.x, this.dragSegOffset.y);
        }

    },
    zoomInDrag: function() {

        this.curZoomDivWidth += 10;

        if (this.curZoomDivWidth >= this.zoomDivMax) {

            scale = this.getNextScale(this.curScale, false);
            this.setCurrentScale(scale, true);
            if (this.timeoutDragId)
                window.clearInterval(this.timeoutDragId);
            this.timeoutDragId = null;
            this.display.drawLayers();

        } else {
            this.scrollToPos(this.dragSegOffset.x, this.dragSegOffset.y);
        }

    },

    "rightclickFun": function() {

        return false;
    },
    "dblrightclickFun": function() {

    },

    "resizeFun": function() {
        if (this.bInitialize) {
            this.viewBound = this.getCurrentSize();
            this.transform.setViewBound(this.viewBound.w, this.viewBound.h);
            this.display.getDisplayImages(true);
            this.display.drawLayers();
            var pos = new Generic.CPoint(0, 0);
            if (this.rulerDiv) {

                pos.x = 10;
                pos.y = this.viewBound.h - 33;
                Util.modifyAlphaImageDiv(this.rulerDiv, null, pos, null, null, "absolute");
            }
            if (this.checkNumDiv) {
                pos.x = 100;
                pos.y = this.viewBound.h - 20;
                Util.modifyAlphaImageDiv(this.checkNumDiv, null, pos, null, null, "absolute");
            }
            if (this.OverviewMapDiv) {
                var OverMapPos = new Generic.CPoint(0, 0);
                var contrlBarDiv = document.getElementById("markerOvermapDiv");

                if (contrlBarDiv && parseInt(contrlBarDiv.style.left) < 0) {
                    OverMapPos.x = this.viewBound.w - 15;
                    OverMapPos.y = this.viewBound.h - 15;


                } else {
                    OverMapPos.x = this.viewBound.w - 159;
                    OverMapPos.y = this.viewBound.h - 159;

                }

                Util.modifyDOMElement(this.OverviewMapDiv, null, OverMapPos, null, "absolute", null);

            }
        }

    },
    drawMap: function() {
        this.display.getDisplayImages(true);
        this.display.drawLayers();
    },
    getCurrentSize: function() {

        var size = new Generic.Size(this.div.clientWidth,
            this.div.clientHeight);

        if (size.w == 0 && size.h == 0 || isNaN(size.w) && isNaN(size.h)) {
            size.w = this.div.offsetWidth;
            size.h = this.div.offsetHeight;
        }
        if (size.w == 0 && size.h == 0 || isNaN(size.w) && isNaN(size.h)) {
            size.w = parseInt(this.div.style.width);
            size.h = parseInt(this.div.style.height);
        }
        return size;
    },
    setMove: function() {
        this.deleteEditPnt();
        this.bEditState = false;
        this.viewPortDiv.style.cursor = "auto";
        this.state = this.TOOLBAR_STATE['MAP_MOVING'];
        this.clearTempVector();
    },
    setZoomIn: function(index) {

        this.viewPortDiv.style.cursor = "url( 'conf/cur_zoomin.cur ')";
        this.state = this.TOOLBAR_STATE['MAP_ZOOMIN'];
        this.clearTempVector();
        var node = Util.getElement("zoom");
        if (!node) {
            vector = new Generic.Vector();
            vector.index = index;
            vector.type = "v:shape";
            vector.pntList.length = 0;
            vector.id = "zoom";
            vector.name = "";
            vector.style = "rectangle";
            this.vectorList["zoom"] = vector;

            if (Util.getBrowserName() != "msie")
                vector.type = "polyline";

            this.getVmlOrSvg().addFeature(vector);

        }

    },
    setZoomOut: function(index) {

        this.viewPortDiv.style.cursor = "url( 'conf/cur_zoomout.cur ')";
        this.state = this.TOOLBAR_STATE['MAP_ZOOMOUT'];
        this.clearTempVector();
        var node = Util.getElement("zoom");
        if (!node) {
            vector = new Generic.Vector();
            this.vectorList["zoom"] = vector;
            vector.index = index;
            vector.type = "v:shape";
            vector.pntList.length = 0;
            vector.id = "zoom";
            vector.name = "";
            vector.style = "rectangle";
            if (Util.getBrowserName() != "msie")
                vector.type = "polyline";
            this.getVmlOrSvg().addFeature(vector);

        }

    },

    setMeasureDistance: function(index) {
        this.deleteEditPnt();
        this.bEditState = false;
        this.bDrawTip = true;
        this.getDrawLineFun = null;
        this.getDrawPolygonFun = null;
        this.state = this.TOOLBAR_STATE['MAP_DISTANCE'];
        this.viewPortDiv.style.cursor = "auto";
        var node = Util.getElement("distance");
        this.clearTempVector();
        if (!node) {
            vector = new Generic.Vector();
            this.vectorList["distance"] = vector;
            vector.index = index;
            vector.type = "v:shape";
            vector.pntList.length = 0;
            vector.id = "distance";
            vector.name = "";
            vector.style = "polyline";
            if (Util.getBrowserName() != "msie")
                vector.type = "polyline";

            this.getVmlOrSvg().addFeature(vector);
        }

    },
    setMeasureArea: function(index) {

        this.deleteEditPnt();
        this.bEditState = false;
        this.bDrawTip = true;
        this.getDrawLineFun = null;
        this.getDrawPolygonFun = null;
        this.state = this.TOOLBAR_STATE['MAP_AREA'];
        this.viewPortDiv.style.cursor = "auto";
        var node = Util.getElement("area");
        this.clearTempVector();
        if (!node) {
            vector = new Generic.Vector();
            this.vectorList["area"] = vector;
            vector.index = index;
            vector.type = "v:shape";
            vector.pntList.length = 0;
            vector.id = "area";
            vector.name = "";
            vector.style = "polygon";
            if (Util.getBrowserName() != "msie")
                vector.type = "polyline";

            this.getVmlOrSvg().addFeature(vector);
        }

    },


    setAddPoi: function(index, fun) {

        this.state = this.TOOLBAR_STATE['MAP_ADDPOI'];
        this.viewPortDiv.style.cursor = "auto";
        var node = Util.getElement("addpoi");
        if (!node) {
            this.addPoint("addpoi", null, 0, 0, index, index, fun);
        }

    },


    addVector: function() {


        if (Util.getBrowserName() != "msie") {
            this.Svg = new Svg(this.editableDiv);
            this.Svg.setPublic(this.public);
            this.display.setVmlOrSvg(this.Svg);
        } else {
            this.Vml = new Vml(this.editableDiv);
            this.Vml.setPublic(this.public);
            this.display.setVmlOrSvg(this.Vml);
        }
    },

    getVmlOrSvg: function() {
        if (Util.getBrowserName() != "msie") {
            return this.Svg;
        } else {
            return this.Vml;
        }

    },

    addType: function(id, type) {
        this.getVmlOrSvg().addType(id, type);
    },
    clearTempVector: function() {

        var node = Util.getElement("distance");
        if (node) {
            vector = this.vectorList["distance"];
            if (vector) {
                vector.pntList.length = 0;
                this.getVmlOrSvg().drawLine(node, vector);
            }

        }
        node = Util.getElement("area");
        if (node) {
            vector = this.vectorList["area"];
            vector.pntList.length = 0;
            this.getVmlOrSvg().drawPolygon(node, vector);
        }
        node = Util.getElement("zoom");
        if (node) {
            vector = this.vectorList["zoom"];
            vector.pntList.length = 0;
            this.getVmlOrSvg().drawRectangle(node, vector);
        }
        node = Util.getElement("addpoi");
        if (node) {
            vector = this.vectorList["addpoi"];
            vector.pntList.length = 0;
            this.getVmlOrSvg().drawCircle(node, vector);
        }
        this.drawTip(null, null, false);

    },

    addRuler: function() {
        var size = new Generic.Size(75, 27);
        var pos = new Generic.CPoint(0, 0);
        var viewBound = this.getCurrentSize();
        pos.x = 10;
        pos.y = viewBound.h - 33;

        this.rulerDiv = Util.createAlphaImageDiv("ruler");

        Util.modifyAlphaImageDiv(this.rulerDiv,
            null,
            pos,
            size,
            "conf/ruler.png",
            "absolute");

        this.rulerScaleDiv = Util.createDiv("rulerScaleDiv", null, null, null,
            "absolute", null);

        this.rulerScaleDiv.style.left = "4px";
        this.rulerScaleDiv.style.top = "6px";
        nLength = this.curScale * 5 + this.unitM;
        if (this.curScale * 5 >= 1000) {
            nLength = this.curScale * 5 / 1000 + this.unitKM;
        }


        this.rulerScaleDiv.innerHTML = "<div style='FONT-SIZE: 9pt;color:red ;top:50px;'>" + nLength + "</div>  ";

        this.rulerDiv.childNodes[0].style.MozUserSelect = "none";
        this.rulerDiv.appendChild(this.rulerScaleDiv);

        this.viewPortDiv.appendChild(this.rulerDiv);

    },
    addCheckNumber: function(number) {
        var size = new Generic.Size(75, 27);
        var pos = new Generic.CPoint(0, 0);
        var viewBound = this.getCurrentSize();
        pos.x = 100;
        pos.y = viewBound.h - 20;

        this.checkNumDiv = Util.createDiv("checkNumDiv", null, null, null, "absolute", null);
        this.checkNumDiv.style.backgroundColor = "transparent";
        this.checkNumDiv.style.left = pos.x + "px";
        this.checkNumDiv.style.top = pos.y + "px";
        this.checkNumDiv.innerHTML = "<div style='FONT-SIZE: 9pt;color:#006699 ;'>" + number + "</div>  ";

        this.viewPortDiv.appendChild(this.checkNumDiv);

    },



    addOverviewMap: function() {
        var size = new Generic.Size(15, 15);
        var pos = new Generic.CPoint(0, 0);
        var viewBound = this.getCurrentSize();
        pos.x = viewBound.w - 15;
        pos.y = viewBound.h - 15;

        this.OverviewMapDiv = Util.createDiv("OverviewMap", null, null, null, "absolute", null);
        this.OverviewMapDiv.style.left = pos.x + "px";
        this.OverviewMapDiv.style.top = pos.y + "px";
        this.OverviewMapDiv.style.width = "160px";
        this.OverviewMapDiv.style.height = "160px";
        this.OverviewMapDiv.style.border = "1px solid RGB(151,151,151)";

        emdOverviewMap = Util.createDiv("emdOverviewMap", null, null, null, "absolute", null);
        emdOverviewMap.style.left = "3px";
        emdOverviewMap.style.top = "3px";
        emdOverviewMap.style.width = "157px";
        emdOverviewMap.style.height = "157px";
        emdOverviewMap.style.border = "1px solid RGB(151,151,151)";
        emdOverviewMap.style.backgroundImage = "url(conf/sample.jpg)"



        this.OverviewMapDiv.setAttribute("unselectable", "on", 0);
        this.OverviewMapDiv.onselectstart = function() {
            return false;
        };
        this.OverviewMapDiv.style.border = "1px solid RGB(151,151,151)";
        this.OverviewMapDiv.style.backgroundColor = "white";

        pos.x = -5;
        pos.y = -5;
        markerOvermapDiv = Util.createAlphaImageDiv("markerOvermapDiv");
        Util.modifyAlphaImageDiv(markerOvermapDiv, null, pos, size, "conf/up.png", "absolute");

        var eventHandleDown = Util.bindAsEventListener(this.overMapDown, this);
        var eventHandlerUp = Util.bindAsEventListener(this.overMapUp, this);
        var eventHandlerdbClick = Util.bindAsEventListener(this.overMapdbclick, this);

        var eventHandleMousewheel = Util.bindAsEventListener(this.overMapMousewheel, this);

        Util.addEventType(this.OverviewMapDiv, "mousedown", eventHandleDown);
        Util.addEventType(this.OverviewMapDiv, "mouseup", eventHandlerUp);
        Util.addEventType(this.OverviewMapDiv, "dblclick", eventHandlerdbClick);
        Util.addEventType(this.OverviewMapDiv, "mousemove", eventHandleDown);
        Util.addEventType(this.OverviewMapDiv, "mousewheel", eventHandleMousewheel);
        Util.addEventType(this.OverviewMapDiv, "DOMMouseScroll", eventHandleMousewheel);

        emdOverviewMap.appendChild(markerOvermapDiv);

        this.OverviewMapDiv.appendChild(emdOverviewMap);
        this.viewPortDiv.appendChild(this.OverviewMapDiv);


    },


    overMapMousewheel: function() {
        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;

        if (Util.getBrowserName() != "msie")
            event.preventDefault();
        event.cancelBubble = true;

        event.returnValue = false;
        return false;
    },
    overMapdbclick: function() {
        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;

        if (Util.getBrowserName() != "msie")
            event.preventDefault();
        event.cancelBubble = true;
    },

    overMapDown: function() {
        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;

        if (Util.getBrowserName() != "msie")
            event.preventDefault();
        event.cancelBubble = true;
    },


    overMapUp: function() {


        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;

        var size = new Generic.Size(15, 15);
        var OverMapPos = new Generic.CPoint(0, 0);
        var emdMapPos = new Generic.CPoint(0, 0);
        var viewBound = this.getCurrentSize();
        var imageSrc = null;

        if (markerEvent.parentNode && markerEvent.parentNode.id == "markerOvermapDiv") {
            if (parseInt(markerEvent.parentNode.style.left) < 0) {
                OverMapPos.x = viewBound.w - 159;
                OverMapPos.y = viewBound.h - 159;
                emdMapPos.x = 156 - 15;
                emdMapPos.y = 156 - 15;
                imageSrc = "conf/down.png";
            } else {
                OverMapPos.x = viewBound.w - 15;
                OverMapPos.y = viewBound.h - 15;
                emdMapPos.x = -5;
                emdMapPos.y = -5;
                imageSrc = "conf/up.png";

            }

            Util.modifyDOMElement(this.OverviewMapDiv, null, OverMapPos, null, "absolute", null);
            Util.modifyAlphaImageDiv(markerEvent.parentNode, null, emdMapPos, size, imageSrc, "absolute");
        }

        if (Util.getBrowserName() != "msie")
            event.preventDefault();
        event.cancelBubble = true;
    },


    addContrlBar: function(bShowScaleBar) {


        this.contrlBarDiv = Util.createDiv("contrlBarDiv", null, null, null,
            "absolute", null);

        this.contrlBarDiv.style.left = "0px";
        this.contrlBarDiv.style.top = "0px";
        this.viewPortDiv.appendChild(this.contrlBarDiv);
        this.contrlBar = new Contrl(this.contrlBarDiv, bShowScaleBar, this.public);
    },


    delContrlBar: function() {

        var contrlBarDiv = document.getElementById("contrlBarDiv");
        if (contrlBarDiv) {
            this.viewPortDiv.removeChild(contrlBarDiv);
        }

    },

    setStatusType: function(type) {
        if (Util.indexOf(this.STATUS_TYPES, type) >= 0) {
            if (type == "north") {
                this.scrollToPos(0, 50);
            } else if (type == "west") {
                this.scrollToPos(50, 0);
            } else if (type == "east") {
                this.scrollToPos(-50, 0);
            } else if (type == "south") {
                this.scrollToPos(0, -50);
            } else if (type == "zoomin") {

                scale = this.getNextScale(this.curScale, false);
                this.setCurrentScale(scale, true);

            } else if (type == "zoomworld") {
                this.setCurrentScale(this.maxScale, false);
                this.setMapCenter(this.center.x, this.center.y);

            } else if (type == "zoomout") {
                scale = this.getNextScale(this.curScale, true);
                this.setCurrentScale(scale, true);

            }
        }

    },
    getEditElementPnts: function(id, strList, style) {

        if (this.selectElementID) {
            var node = Util.getElement(this.selectElementID);
            if (node) {
                var vector = this.vectorList[this.selectElementID];
                if (vector) {
                    var strList = "";
                    if (vector.pntList.length >= 2) {
                        for (var i = 0; i < vector.pntList.length; i++) {
                            if (i == vector.pntList.length - 1) {
                                if (vector.pntList[i].x != vector.pntList[i - 1].x || vector.pntList[i].y != vector.pntList[i - 1].y)
                                    strList += vector.pntList[i].x + "," + vector.pntList[i].y;
                            } else
                                strList += vector.pntList[i].x + "," + vector.pntList[i].y + ";";

                        }
                        id = this.selectElementID;
                        style = vector.style;


                        return [id, strList, style];
                    }


                }

            }

        }

        return null;

    },


    addPolygon: function(id, type, name, arrayList, index, mouseoverIndex, fun, style, bEdit, scale) {
        if (arrayList.length < 3)
            return;

        var id = String(id);
        var vector = this.vectorList[id];
        if (!vector) {
            vector = new Generic.Vector();
            this.vectorList[id] = vector;
        }
        vector.pntList.length = 0;
        this.deleteEditPnt();
        for (pos in arrayList) {
            vector.pntList.push(arrayList[pos]);
        }
        vector.code = type;
        vector.id = id;
        if (name)
            vector.name = name;
        if (fun)
            vector.fun = fun;
        if (bEdit)
            vector.bEdit = bEdit;
        if (!style) style = "polygon";
        if (index) {
            vector.style = style;
            vector.type = "v:shape";
            if (Util.getBrowserName() != "msie")
                vector.type = "polyline";
            vector.index = index;
            vector.mouseoverIndex = mouseoverIndex;

            vector.scale = scale ? scale : 0;
            vector.length = 0;
        }

        var node = Util.getElement(id);
        if (!node) {
            this.getVmlOrSvg().addFeature(vector);
            node = Util.getElement(id);

        }
        if (vector.fun || bEdit) {
            this.addEventType(node);
        }

        this.getVmlOrSvg().drawPolygon(node, vector);


    },


    addEventType: function(node) {

        var eventHandlerOut = Util.bindAsEventListener(this.markerMouseOut, this);
        var eventHandlerOver = Util.bindAsEventListener(this.markerMouseOver, this);
        var eventHandleDown = Util.bindAsEventListener(this.markerMouseDown, this);
        var eventHandlerUp = Util.bindAsEventListener(this.markerMouseUp, this);
        var eventHandlerMove = Util.bindAsEventListener(this.markerMouseMove, this);
        Util.addEventType(node, "mouseout", eventHandlerOut)
        Util.addEventType(node, "mouseover", eventHandlerOver);
        Util.addEventType(node, "mousedown", eventHandleDown);
        Util.addEventType(node, "mouseup", eventHandlerUp);
        Util.addEventType(node, "mousemove", eventHandlerMove);
    },

    changeLineColor: function(id, index, mouseoverIndex) {
        id = String(id);
        vector = this.vectorList[id];
        if (vector) {
            var marker = document.getElementById(id);
            vector.index = index;
            vector.mouseoverIndex = mouseoverIndex;
            if (marker) {
                this.getVmlOrSvg().setStyle(marker, this.getVmlOrSvg().getTyple(vector.index));
            }
        }

    },

    changePolygonColor: function(id, index, mouseoverIndex) {
        id = String(id);
        vector = this.vectorList[id];
        if (vector) {
            var marker = document.getElementById(id);
            vector.index = index;
            vector.mouseoverIndex = mouseoverIndex;
            if (marker) {
                this.getVmlOrSvg().setStyle(marker, this.getVmlOrSvg().getTyple(vector.index));
            }
        }

    },

    addLine: function(id, type, name, arrayList, index, mouseoverIndex, fun, bEdit, scale) {


        if (arrayList.length < 2)
            return;

        var id = String(id);
        var vector = this.vectorList[id];
        if (!vector) {
            vector = new Generic.Vector();
            this.vectorList[id] = vector;
        }
        vector.pntList.length = 0;
        this.deleteEditPnt();
        for (pos in arrayList) {
            vector.pntList.push(arrayList[pos]);
        }
        vector.code = type;
        vector.id = id;
        if (name)
            vector.name = name;
        if (fun)
            vector.fun = fun;
        if (bEdit)
            vector.bEdit = bEdit;
        if (index) {

            vector.style = "polyline";
            vector.type = "v:shape";
            if (Util.getBrowserName() != "msie")
                vector.type = "polyline";
            vector.index = index;
            vector.mouseoverIndex = mouseoverIndex;

            vector.scale = scale ? scale : 0;
            vector.length = 0;
        }

        var node = Util.getElement(id);
        if (!node) {
            this.getVmlOrSvg().addFeature(vector);
            node = Util.getElement(id);
        }
        if (vector.fun || bEdit) {
            this.addEventType(node);
        }

        this.getVmlOrSvg().drawLine(node, vector);

    },
    addPoint: function(id, name, x, y, index, mouseoverIndex, fun, bEdit, scale, length) {
        var id = String(id);
        var vector = this.vectorList[id];
        if (!vector) {
            vector = new Generic.Vector();
            this.vectorList[id] = vector;
        }
        pos = new Generic.CPoint(x, y);
        vector.pntList.length = 0;
        vector.pntList.push(pos);
        vector.id = id;
        vector.code = 0;
        if (name)
            vector.name = name;
        if (fun)
            vector.fun = fun;
        if (bEdit)
            vector.bEdit = bEdit;
        if (index) {
            var pointType = this.getVmlOrSvg().getTyple(index);
            vector.index = index;
            if (pointType.graphicName == "circle")
                vector.type = "v:oval";
            else
                vector.type = "v:oval";
            vector.style = pointType.graphicName;

            vector.mouseoverIndex = mouseoverIndex;
            if (Util.getBrowserName() != "msie")
                vector.type = "circle";

            vector.scale = scale ? scale : 0;
            vector.length = length;
        }

        var node = Util.getElement(id);
        if (!node) {
            this.getVmlOrSvg().addFeature(vector);
            node = Util.getElement(id);

        }
        if (vector.fun) {
            this.addEventType(node);
        }

        this.getVmlOrSvg().drawCircle(node, vector);

    },

    markerMouseUp: function() {
        this.markerMouseState = this.MARKER_MOUSEUP["MARKER_UP"];
        this.selectEditPntID = null;
        if (!this.judgeState('MAP_MOVING'))
            return;
        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;
        if (!markerEvent.id) return;
        var marker = document.getElementById(markerEvent.id);
        vector = this.vectorList[marker.id];
        if (vector) {
            var Pos = Util.getMousePosition(this.div, event);
            Pos.x -= this.viewPortDiv.clientLeft;
            Pos.y -= this.viewPortDiv.clientTop;
            Pos.x -= this.border;
            Pos.y -= this.border;

            Posworld = this.public.transform.ClientToWorld(Pos);

        }


    },
    markerMouseMove: function() {
        return;

    },
    markerMouseDown: function() {

        this.markerMouseState = this.MARKER_MOUSEUP["MARKER_DOWN"];

        if (!(this.judgeState('MAP_MOVING'))) return;
        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;
        if (!markerEvent.id) return;
        var marker = document.getElementById(markerEvent.id);
        vector = this.vectorList[marker.id];
        if (vector) {

        }


    },
    markerMouseOut: function() {

        if (this.markerMouseState != this.MARKER_MOUSEUP["MARKER_DOWN"]) {
            this.selectEditPntID = null;
            this.bInVectorRange = false;

        }
        if (!(this.judgeState('MAP_MOVING') || this.bEditState))
            return;

        var event = arguments[0] || window.event;

        this.vectorTipName = null;
        this.drawTip(null, null, false);
        var markerEvent = document.all ? event.srcElement : event.target;
        if (!markerEvent.id) return;
        var marker = document.getElementById(markerEvent.id);
        if (marker) {
            marker.style.cursor = "auto";
            vector = this.vectorList[markerEvent.id];
            if (vector) {
                if (vector.index && vector.mouseoverIndex && vector.index != vector.mouseoverIndex) {

                }

            }

        }
    },
    markerMouseOver: function() {

        if (!(this.judgeState('MAP_MOVING') || this.bEditState))
            return;
        this.bInVectorRange = true;
        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;
        if (!markerEvent.id) return;
        var marker = document.getElementById(markerEvent.id);
        if (marker) {
            if (Util.getBrowserName() != "msie")
                marker.style.cursor = "pointer";
            else
                marker.style.cursor = "hand";
            vector = this.vectorList[markerEvent.id];

            if (vector) {
                if (this.selectVectorID && this.selectVectorID != markerEvent.id) {
                    var vectorOld = this.vectorList[this.selectVectorID];
                    if (vectorOld && vectorOld.index && vectorOld.mouseoverIndex && vectorOld.index != vectorOld.mouseoverIndex) {

                        var markerOld = document.getElementById(this.selectVectorID);
                        this.getVmlOrSvg().setStyle(markerOld, this.getVmlOrSvg().getTyple(vectorOld.index))

                    }

                }

                this.selectVectorID = markerEvent.id;
                if (vector.index && vector.mouseoverIndex && vector.index != vector.mouseoverIndex) {
                    this.getVmlOrSvg().setStyle(marker, this.getVmlOrSvg().getTyple(vector.mouseoverIndex));

                }

                if (this.bEditState && vector.bEdit) {
                    if (vector.style == "polyline" || vector.style == "polygon" || vector.style == "rectangle") {
                        if (this.selectElementID == null) {
                            this.selectElementID = markerEvent.id;
                            this.addEditPnt(this.selectElementID);
                        } else if (this.selectElementID != markerEvent.id) {
                            this.deleteEditPnt();
                            this.selectElementID = markerEvent.id;
                            this.addEditPnt(this.selectElementID);

                        } else if (!this.editPntIndex) {
                            this.selectElementID = markerEvent.id;
                            this.addEditPnt(this.selectElementID);
                        }
                    } else {

                        this.selectEditPntID = markerEvent.id;
                    }
                }
                if (vector.name) {
                    var pointType = this.getVmlOrSvg().getTyple(vector.index);
                    this.vectorTipName = vector.name;

                }
            }

        }

    },

    reDraw: function() {

        var curScale = this.curScale;
        var nCurrentIndex = this.scale.length;

        if (curScale < this.scale[0]) {
            curScale = this.scale[0];
        } else if (curScale > this.scale[nCurrentIndex - 1]) {
            curScale = this.scale[nCurrentIndex - 1];
        } else {
            var nIndex = 0;
            for (var i = 0; i < nCurrentIndex; i++) {
                if (this.scale[i] >= this.curScale) {
                    curScale = this.scale[i];
                    nIndex = i;
                    break;
                }

            }
            if (nIndex > 0) {
                if (this.scale[i] - this.curScale > this.curScale - this.scale[nIndex - 1])
                    curScale = this.scale[nIndex - 1];
                else
                    curScale = this.scale[nIndex];
            }

        }
        this.display.deleteBaseMap();
        this.display.deleteTransitMap(true);

        if (!this.setCurrentScale(curScale, true)) {
            this.transform.setScale(curScale);
        }
        this.drawMap();

    },

    setRestrictedExtent: function(rect) {
        this.transform.setRestrictedExtent(rect);
    },
    getEditPntInfo: function(id, x, y, value, bMoveTo) {},
    addEditPnt: function(id) {
        var type = this.getVmlOrSvg().getTyple(1000);
        if (!type) {
            pointDis = new Generic.VectorType({
                pointRadius: 5,
                graphicName: "circle",
                fillColor: "yellow",
                fillOpacity: 1,
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#333333",
                units: "pixel"
            });

            pointSelect = new Generic.VectorType({
                pointRadius: 5,
                graphicName: "circle",
                fillColor: "red",
                fillOpacity: 1,
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#333333",
                units: "pixel"
            });
            this.addType(1000, pointDis);
            this.addType(1001, pointSelect);

        }


        var vector = this.vectorList[id];
        if (vector) {
            this.editPntIndex = 0;
            for (pos in vector.pntList) {
                var pntID = this.selectElementID + "_" + this.editPntIndex++;
                this.addPoint(pntID, "", vector.pntList[pos].x, vector.pntList[pos].y, 1000, 1001, this.getEditPntInfo, true, null);

            }
        }


    },

    deleteEditPnt: function(id) {
        for (var i = 0; i < this.editPntIndex; i++) {
            var pntID = this.selectElementID + "_" + i;
            this.delVector(pntID);
        }

        this.editPntIndex = 0;
        this.selectEditPntID = null;
        this.selectElementID = null;

    },

    drawTip: function(text, pos, show, bNull) {

        if (bNull) {

            this.dynamicTipDiv.style.border = "0px";
            this.dynamicTipDiv.style.backgroundColor = "transparent";
            this.dynamicTipDiv.innerHTML = "<span style='FONT-SIZE: 10pt;color:red ;'>" + text + "</span>  ";
            this.dynamicTipDiv.style.display = "";
            pos.y -= 2;
            Util.modifyDOMElement(this.dynamicTipDiv, null, pos, null, "absolute", null);

        } else {

            if (show) {

                this.dynamicTipDiv.style.whiteSpace = "nowrap";
                this.dynamicTipDiv.style.border = "1px solid #BC3B3A";
                this.dynamicTipDiv.style.color = "white";
                this.dynamicTipDiv.style.height = "18px";
                this.dynamicTipDiv.style.padding = "0px";
                this.dynamicTipDiv.style.lineHeight = "18px";
                this.dynamicTipDiv.style.border = "1px solid gray";
                this.dynamicTipDiv.style.backgroundColor = "#FFFFFF";
                this.dynamicTipDiv.innerHTML = "<span style='FONT-SIZE: 10pt;color:red ;'>" + text + "</span>  ";
                this.dynamicTipDiv.style.display = "";
                Util.modifyDOMElement(this.dynamicTipDiv, null, pos, null, "absolute", null);
            } else {
                this.dynamicTipDiv.style.display = "none";
            }
        }

    },
    judgeState: function(state) {

        return this.state == this.TOOLBAR_STATE[state];
    },
    setBaseLayerPicDir: function(dir) {
        this.display.setBaseLayerPicDir(dir);
    },

    addLayer: function(id, options, bFront) {
        id = String(id);
        var div = Util.getElement(id);
        if (div) return;
        layerDiv = Util.createDiv(id, null, null, null, "absolute", null);
        layerDiv.style.left = "0px";
        layerDiv.style.top = "0px";
        layerDiv.style.zIndex = 0;
        if (bFront) {
            this.dragContainDiv.insertBefore(layerDiv, this.tileContainDiv);
        } else {
            this.dragContainDiv.insertBefore(layerDiv, this.editableDiv);
        }


        this.display.addLayer(id, layerDiv, options);
        this.display.drawLayers();
    },

    delLayer: function(id) {
        this.display.delLayer(String(id));
    },

    beginDrawLine: function(nIndex, fun) {
        this.setMeasureDistance(nIndex);
        this.bDrawTip = false;

        this.getDrawLineFun = fun;
        this.bEditState = true;
    },
    beginDrawPolygon: function(nIndex, fun) {
        this.setMeasureArea(nIndex);
        this.bDrawTip = false;
        this.getDrawPolygonFun = fun;
        this.bEditState = true;
    },
    beginDrawRange: function(nIndex, fun) {
        this.deleteEditPnt();
        this.viewPortDiv.style.cursor = "auto";
        this.state = this.TOOLBAR_STATE['MAP_RANGE'];
        this.clearTempVector();
        this.bEditState = true;
        var node = Util.getElement("zoom");
        if (!node) {
            vector = new Generic.Vector();
            vector.index = nIndex;
            vector.type = "v:shape";
            vector.pntList.length = 0;
            vector.id = "zoom";
            vector.name = "";
            vector.style = "rectangle";
            this.vectorList["zoom"] = vector;

            if (Util.getBrowserName() != "msie")
                vector.type = "polyline";
            this.getVmlOrSvg().addFeature(vector);

        }
        this.bDrawTip = false;
        this.getDrawPolygonFun = fun;
    },

    setMapClipRowCol: function(nRow, nCol) {
        this.display.setMapClipRowCol(nRow, nCol);
    },
    preventDefaultEvent: function(evt) {
        evt.cancelBubble = true;
        evt.returnValue = false;
        if (Util.getBrowserName() != "msie")
            evt.preventDefault();
    },
    keydown: function(e) {
        if (!this.bMouseInMap) {
            return;
        }
        var keyName = null;
        var e = e || event;
        var currKey = e.keyCode || e.which || e.charCode;
        if ((currKey > 7 && currKey < 14) || (currKey > 31 && currKey < 47)) {
            switch (currKey) {
                case 37:
                    {

                        this.setStatusType("west");
                        this.preventDefaultEvent(e);

                    }
                    break;
                case 38:
                    {

                        this.setStatusType("north");
                        this.preventDefaultEvent(e);

                    }
                    break;
                case 39:
                    {

                        this.setStatusType("east");
                        this.preventDefaultEvent(e);
                    }
                    break;
                case 40:
                    {

                        this.setStatusType("south");
                        this.preventDefaultEvent(e);
                    }
                    break;
                default:
                    keyName = "";
                    break;
            }

        }


    },
    changeMarkPic: function(id, src) {
        this.display.changeMarkPic(id, src);
    },


    beginLocation: function() {
        this.locateBound.left = 0;
        this.locateBound.bottom = 0;
        this.locateBound.right = 90000000;
        this.locateBound.top = 90000000;

    },

    setPntInCityFun: function(fun) {
        this.getPntInCityFun = fun;

    },

    EndLocation: function() {
        this.adjustScaleWithBound(this.locateBound.left, this.locateBound.top, this.locateBound.right, this.locateBound.bottom);



    },
    getMapCenter: function() {
        return this.transform.posScreenCenter.clone();
    },
    displayLayers: function(id, display) {
        this.display.displayLayers(id, display);
    },

    CLASS_NAME: "Map"
});

Map.TILE_WIDTH = 256;
Map.TILE_HEIGHT = 256;
Map.IMAGE_WIDTH = 1024;
Map.IMAGE_HEIGHT = 1024;
Map.IMAGE_SUM = 4;

Public = Util.Class({

    div: null,

    map: null,
    display: null,
    transform: null,
    initialize: function(map, display, transform) {
        this.map = map;
        this.display = display;
        this.transform = transform;


    },

    CLASS_NAME: "Public"
});

Transform = Util.Class({

    posMapCenter: null,
    posScreenCenter: null,
    initPos: null,
    calcScale: 0.0,
    currentScale: 100,
    mapViewWidth: 500,
    mapViewHeight: 500,
    mapExtent: null,
    oldScale: null,

    posViewleftTop: null,
    tdtScale: null,
    restrictedExtent: null,

    initialize: function() {
        this.posMapCenter = new Generic.CPoint(40909938, 12495136);
        this.posScreenCenter = new Generic.CPoint(113.63801 * 360000, 34.75494 * 360000);

        this.initPos = new Generic.CPoint(0, 0);
        this.posViewleftTop = new Generic.CPoint(0, 0);
        this.tdtScale = {
            5: 5.36441802978515E-06,
            10: 1.07288360595703E-05,
            20: 2.1457672119140625E-05,
            40: 4.29153442382814E-05,
            80: 8.58306884765629E-05,
            150: 0.000171661376953125,
            300: 0.00034332275390625,
            600: 0.0006866455078125,
            1200: 0.001373291015625,
            2500: 0.00274658203125,
            5000: 0.0054931640625,
            10000: 0.010986328125,
            20000: 0.02197265625,
            45000: 0.0439453125,
            100000: 0.087890625
        };



        this.mapExtent = new Generic.Bounds(39727434, 11298405, 41992210, 13091900);
    },

    setDragContainDivLeftTop: function(x, y) {
        this.posViewleftTop.x = x;
        this.posViewleftTop.y = y;

    },


    getScale: function() {
        return this.currentScale;
    },
    setScale: function(nScale) {


        oldScale = this.currentScale;
        this.currentScale = nScale;
        var LatA, LatB;
        var LongA;

        this.calcScale = this.tdtScale[nScale] * 360000;

        this.initPos = new Generic.CPoint(this.posScreenCenter.x - (this.mapViewWidth / 2) * this.calcScale, this.posScreenCenter.y + (this.mapViewHeight / 2) * this.calcScale);

        return oldScale;
    },

    WorldToClient: function(pos) {
        var posResult = new Generic.CPoint();

        posResult.x = Math.floor((pos.x - this.initPos.x) / this.calcScale + this.posViewleftTop.x);
        posResult.y = Math.floor((this.initPos.y - pos.y) / this.calcScale + this.posViewleftTop.y);

        return posResult;
    },
    ClientToWorld: function(pos) {

        var posResult = new Generic.CPoint();

        posResult.x = Math.floor(pos.x * this.calcScale + this.initPos.x);
        posResult.y = Math.floor(this.initPos.y - pos.y * this.calcScale);

        return posResult;

    },

    WorldToClient2: function(x, y) {
        var posResult = new Generic.CPoint();

        posResult.x = Math.floor((x - this.initPos.x) / this.calcScale + this.posViewleftTop.x);
        posResult.y = Math.floor((this.initPos.y - y) / this.calcScale + this.posViewleftTop.y);

        return posResult;
    },

    getWorldWidth: function(nWidth) {
        return ((nWidth * this.calcScale));
    },

    getWorldWidth2: function(nWidth) {

        var r = 6371110;
        var factor = 360000;

        LongA = Math.PI * this.posMapCenter.x / factor / 180;
        LatA = Math.PI * this.posMapCenter.y / factor / 180;
        LatB = Math.PI * this.posMapCenter.y / factor / 180;

        var dLen = Math.acos((Math.cos(this.currentScale / r) - Math.sin(LatA) * Math.sin(LatB)) / (Math.cos(LatA) * Math.cos(LatB)));

        dLen = dLen * 360000 * 180 / Math.PI;

        this.calcScale = dLen / 10;

        return (nWidth * this.calcScale);
    },


    scrollToPos: function(cx, cy) {


        var curPosX = this.posScreenCenter.x - cx * this.calcScale;
        var curPosY = this.posScreenCenter.y + cy * this.calcScale;

        var mapBoundRect = null;
        if (this.restrictedExtent)
            mapBoundRect = this.restrictedExtent;
        else if (this.mapExtent)
            mapBoundRect = this.mapExtent;


        if (mapBoundRect.contains(curPosX, curPosY)) {

            this.posScreenCenter.x = curPosX;
            this.posScreenCenter.y = curPosY;
            this.initPos.x = this.posScreenCenter.x - (this.mapViewWidth / 2) * this.calcScale;
            this.initPos.y = this.posScreenCenter.y + (this.mapViewHeight / 2) * this.calcScale;
            return true;

        } else {
            return false;
        }


    },

    setMapCenter: function(x, y) {
        var mapBoundRect = null;
        if (this.restrictedExtent)
            mapBoundRect = this.restrictedExtent;
        else if (this.mapExtent)
            mapBoundRect = this.mapExtent;

        if (mapBoundRect) {
            if (mapBoundRect.contains(x, y)) {


                this.posScreenCenter.x = x;
                this.posScreenCenter.y = y;
                this.initPos.x = this.posScreenCenter.x - (this.mapViewWidth / 2) * this.calcScale;
                this.initPos.y = this.posScreenCenter.y + (this.mapViewHeight / 2) * this.calcScale;
                return true;
            } else
                return false;

        } else
            return false;


    },
    setMapBound: function(rect) {
        this.mapExtent = rect.clone();

    },

    setRestrictedExtent: function(rect) {
        this.restrictedExtent = rect.clone();
    },

    GetViewRect: function(rect) {

        rect.left = this.initPos.x;
        rect.bottom = this.initPos.y - this.mapViewHeight * this.calcScale;
        rect.right = this.initPos.x + this.mapViewWidth * this.calcScale;
        rect.top = this.initPos.y;

    },
    setViewBound: function(width, height) {
        this.mapViewWidth = width;
        this.mapViewHeight = height;
        this.initPos.x = this.posScreenCenter.x - (this.mapViewWidth / 2) * this.calcScale;
        this.initPos.y = this.posScreenCenter.y + (this.mapViewHeight / 2) * this.calcScale;


    },
    getPixelWidth: function(length) {
        var nRange = Math.floor(10 * length / this.currentScale);
        if (nRange < 0) nRange = 0;
        return nRange;

    },

    CLASS_NAME: "transform"
});

Display = Util.Class({

    dragContainDiv: null,
    tileContainDiv: null,
    switchDiv: null,
    annoDiv: null,
    images: null,
    markers: null,
    markers1: null,
    markers2: null,
    markers3: null,
    markers4: null,
    markers5: null,
    popDivs: null,
    public: null,
    bound: null,
    size: null,
    curScale: null,
    piexSize: null,
    Vml: null,
    Svg: null,
    imageDir: "image",
    layerDivs: null,
    haveJs: false,
    selectIconID: null,
    nMapRow: null,
    nMapCol: null,
    version: null,
    requestImage: null,
    preRequestImage: null,
    loadImageDelay: null,
    zIndexValue: 1,
    divMouseMoveIn: false,
    baseFormat: "png",
    bottomLevelIndex: 20,
    topTileFromX: -180,
    topTileFromY: 90,
    topTileToX: 180,
    topTileToY: -270,
    tdtTileBound: null,
    initialize: function(dragContainDiv, tileContainDiv, switchDiv, annoDiv, haveJs) {
        this.images = {},
            this.markers = {},
            this.markers1 = {},
            this.markers2 = {},
            this.markers3 = {},
            this.markers4 = {},
            this.markers5 = {},
            this.popDivs = {},
            this.layerDivs = {},
            this.requestImage = {},
            this.preRequestImage = {},
            this.bound = new Generic.Bounds();
        this.dragContainDiv = dragContainDiv;
        this.tileContainDiv = tileContainDiv;
        this.switchDiv = switchDiv;
        this.annoDiv = annoDiv;
        var img = new Image(256, 256);
        img.src = "conf/transparent.png";
        this.size = new Generic.Size(256, 256);
        this.piexSize = new Generic.Size(1, 1);
        this.haveJs = haveJs;
        var arVersion = navigator.appVersion.split("MSIE");
        this.version = parseFloat(arVersion[1]);
        this.loadImageDelay = {};
        this.tdtTileBound = new Generic.Bounds();


    },
    setMapClipRowCol: function(nRow, nCol) {
        this.nMapRow = nRow;
        this.nMapCol = nCol;
    },
    setVmlOrSvg: function(Vml) {
        if (Util.getBrowserName() != "msie") {
            this.Svg = Vml;
            this.setSvgExtent();
        } else {
            this.Vml = Vml;
        }


    },

    setBaseLayerPicDir: function(dir) {
        this.imageDir = dir;
    },
    drawMap: function() {
        this.public.transform.getSize();
    },
    setPublic: function(public) {
        this.public = public;

    },
    imageEvent: function() {

        return false;
    },
    deleteBaseMap: function() {

        for (var delayImage in this.loadImageDelay) {

            this.loadImageDelay[delayImage].onload = null;
            this.loadImageDelay[delayImage].onerror = null;
            delete this.loadImageDelay[delayImage];

        }

        for (var baseImage in this.requestImage) {
            this.requestImage[baseImage] = null;
            delete this.requestImage[baseImage];

        }

        while (this.tileContainDiv.hasChildNodes()) {
            var deleteImage = this.tileContainDiv.firstChild;
            if (deleteImage.jsID) {
                var delPoiInfo = window[deleteImage.jsID];
                if (Boolean(delPoiInfo)) {

                    for (var delJs in delPoiInfo) {
                        delete delPoiInfo[delJs];
                    }
                    window[deleteImage.jsID].length = 0;
                    window[deleteImage.jsID] = null;

                }

            }

            this.tileContainDiv.removeChild(this.tileContainDiv.firstChild);
            deleteImage = null;
        }


    },
    deleteTransitMap: function() {
        while (this.switchDiv.hasChildNodes()) {
            this.switchDiv.removeChild(this.switchDiv.firstChild);
        }

        for (var baseImage in this.preRequestImage) {
            this.preRequestImage[baseImage] = null;
            delete this.preRequestImage[baseImage];

        }
    },
    transparentImages: function(image) {

        if (Boolean(this.version) && (this.version >= 5.5 && this.version < 7.0)) {

            var imgName = image.src.toUpperCase();
            if (imgName.indexOf(".PNG") > 0 && imgName.indexOf("IMAGE") <= 0) {
                var width = Map.TILE_WIDTH;
                var height = Map.TILE_HEIGHT;
                var sizingMethod = (image.className.toLowerCase().indexOf("scale") >= 0) ? "scale" : "image";
                image.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + image.src.replace('%23', '%2523').replace("'", "%27") + "', sizingMethod='" + sizingMethod + "')";
                image.src = "conf/blank.gif";
                image.width = Map.TILE_WIDTH;
                image.height = Map.TILE_HEIGHT;
            }

        }

    },


    onLoad: function() {

        var event = arguments[0] || window.event;
        var image = document.all ? event.srcElement : event.target;
        if (image) {
            image.onload = null;
            image.existLoad = 1;
            image.style.display = "";


            if (image.src.search("transparent.png") != -1) return;
            if (image.js && image.jsDir) {}
            this.transparentImages(image);

        }
    },
    onerror: function() {
        var event = arguments[0] || window.event;
        var image = document.all ? event.srcElement : event.target;
        if (image) {
            if (image.attemptLoad <= 1) {

                image.onerror = null;
                image.attemptLoad++;
                pattern = new RegExp(this.imageDir, "g");
                if (pattern.test(image.src)) {

                    image.src = this.imageDir + RegExp.rightContext;

                } else {

                    image.style.display = "none";
                }

            } else
                image.style.display = "none";
        }
    },

    getURL: function(bounds, curScale, poiType, nRequestIndex) {


        var level = 0;
        var nCurrentIndex = this.public.map.scale.length;
        for (var i = 0; i < nCurrentIndex; i++) {
            if (this.public.map.scale[i] == curScale) {
                level = nCurrentIndex + (18 - nCurrentIndex) - i;
                break;
            }
        }

        var strServerNum = String(level % 8);
        var coef = this.public.transform.tdtScale[curScale] * 256;

        var x_num = Math.round((bounds.left - this.topTileFromX) / coef);
        var y_num = Math.round((this.topTileFromY - bounds.top) / coef);

        var server = null;
        if (poiType == "vec_c") {
            server = "http://t" + strServerNum + ".tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&";

        } else if (poiType == "img_c") {
            server = "http://t" + strServerNum + ".tianditu.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&";

        } else if (poiType == "cva_c") {
            server = "http://t" + strServerNum + ".tianditu.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&";

        } else if (poiType == "cia_c") {
            server = "http://t" + strServerNum + ".tianditu.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&";


        }

        var tileUrl = server + "TILEMATRIX=" + String(level) + "&" + "TILEROW=" + String(y_num) + "&" + "TILECOL=" + String(x_num) + "&FORMAT=tiles";



        return tileUrl;
    },



    drawImages: function(disDiv, mapBound, maxScale, minScale, mapNo, imageDir, haveJS, poiType, requestImage, loadImageDelay, format, opacity) {


        if (!format) format = "png";

        var scale = this.public.transform.getScale();

        for (var delayImage in loadImageDelay) {


            loadImageDelay[delayImage].onload = null;
            loadImageDelay[delayImage].onerror = null;
            delete loadImageDelay[delayImage];

        }

        for (var baseImage in requestImage) {
            requestImage[baseImage] = null;
            delete requestImage[baseImage];

        }

        if (maxScale && minScale) {
            if (!(scale >= minScale && scale <= maxScale)) {
                disDiv.style.visibility = "hidden";
                return;
            } else {
                disDiv.style.visibility = "";
            }
        }
        this.curScale = scale;
        this.public.transform.GetViewRect(this.bound);

        if (!mapNo)
            mapNo = this.public.map.getMapNo();

        if (!imageDir)
            imageDir = "";



        if (!mapBound) {
            mapBound = this.public.transform.mapExtent;
        }


        var distance = this.public.transform.getWorldWidth(Map.TILE_WIDTH);
        var mapGridDistance = (this.public.transform.getWorldWidth(Map.IMAGE_WIDTH));


        var nStartRow = Math.floor((mapBound.top - this.bound.top) / distance);
        var nStartCol = Math.floor((this.bound.left - mapBound.left) / distance);
        var nEndRow = Math.floor((mapBound.top - this.bound.bottom) / distance);
        var nEndCol = Math.floor((this.bound.right - mapBound.left) / distance);
        nStartRow = nStartRow > 0 ? nStartRow : 0;
        nStartCol = nStartCol > 0 ? nStartCol : 0;
        nEndRow = nEndRow > 0 ? nEndRow : 0;
        nEndCol = nEndCol > 0 ? nEndCol : 0;

        var strJsDir = null;
        var clipRow = 0;
        var clipCol = 0;
        var surplusRow = 0;
        var surplusCol = 0;
        var ClipRowAndCol = null;
        var requestJs = {};
        var nRequestIndex = 0;


        for (var nRow = nStartRow; nRow <= nEndRow; nRow++) {

            for (var nCol = nStartCol; nCol <= nEndCol; nCol++) {

                var nLeft = (nCol * distance + mapBound.left);
                var nTop = (mapBound.top - (nRow * distance));
                var nRight = ((nCol + 1) * distance + mapBound.left);
                var nBottom = (mapBound.top - (nRow + 1) * distance);

                var src = null;
                var strJsDir = null;
                var imageName = null;

                if (mapBound.contains(nLeft, nTop) || mapBound.contains(nRight, nBottom) || mapBound.contains(nLeft, nBottom) || mapBound.contains(nRight, nTop)) {

                    this.tdtTileBound.left = nLeft / 360000.0;
                    this.tdtTileBound.right = nRight / 360000.0;
                    this.tdtTileBound.top = nTop / 360000.0;
                    this.tdtTileBound.bottom = nBottom / 360000.0;


                    haveJS = false;
                    if (poiType == "full")
                        src = this.getURL(this.tdtTileBound, scale, imageDir, nRequestIndex);
                    else
                        src = this.getURL(this.tdtTileBound, scale, poiType, nRequestIndex);


                    nRequestIndex++;

                    var srclength = src.indexOf("1.0.0");
                    var tdtID = src.substr(srclength + 6, src.length - srclength - 19);


                    var objName = null;
                    strJsDir = null;

                    var tile = new Tile(tdtID, nLeft, nTop, nRight, nBottom, null, null, strJsDir, src, objName);
                    requestImage[tdtID] = tile;



                }

            }

        }

        var Images = disDiv.getElementsByTagName('img');
        var nSize = Images.length;
        var deleteDivs = [];

        for (var i = 0; i < nSize; i++) {

            if (Boolean(requestImage[disDiv.childNodes[i].id]) == false) {
                deleteDivs.push(disDiv.childNodes[i]);
            }

        }
        for (var i = 0; i < deleteDivs.length; i++) {
            var deleteImage = deleteDivs[i];
            if (!deleteImage.complete) {
                deleteImage.src = "conf/transparent.png";
            }
            disDiv.removeChild(deleteImage);
            deleteImage = null;
        }

        deleteDivs.length = 0;
        for (var delRequestJs in requestJs) {
            delete requestJs[delRequestJs];
        }
        deleteDivs = null;
        requestJs = null;



        for (var disImage in requestImage) {
            var tile = requestImage[disImage];
            var pos = this.public.transform.WorldToClient2(tile.left, tile.top);
            tile.clientLeft = pos.x;
            tile.clientTop = pos.y;
            if (isNaN(pos.x)) continue;

            var postImage = document.getElementById(tile.id);
            if (!postImage) {

                var image = Util.createImage(tile.id, pos, null, null, "absolute", null, null);

                image.style.visibility = "hidden";
                image.style.border = "none";
                image.style.padding = "0px";
                image.style.margin = "0px";
                image.style.MozUserSelect = "none";
                image.imageDir = imageDir;
                image.existLoad = 0;
                image.attemptLoad = 0;
                image.js = haveJS;
                image.jsDir = tile.jsDir;
                image.urlInfo = tile.id;
                image.jsID = tile.jsID;
                image.version = this.version;



                image.onerror = function() {
                    if (this && this.src) {


                        this.onerror = null;
                        this.src = "conf/background.jpg";
                        this.jsDir = null;
                    }


                }

                image.src = tile.fileDir;
                disDiv.appendChild(image);

                if (image.complete) {

                    image.existLoad = 1;
                    image.style.visibility = "";
                    this.transparentImages(image);


                } else {

                    image.onload = function() {
                        if (this && this.src) {

                            this.onload = null;
                            this.onerror = null;
                            if (Boolean(requestImage[this.urlInfo])) {

                                this.existLoad = 1;
                                this.style.visibility = "";
                                var existImage = document.getElementById(this.id);
                                if (existImage) {
                                    if (Boolean(this.version) && (this.version >= 5.5 && this.version < 7.0)) {

                                        var imgName = this.src.toUpperCase();
                                        if (imgName.indexOf(".PNG") > 0 && imgName.indexOf("IMAGE") <= 0) {

                                            var width = Map.TILE_WIDTH;
                                            var height = Map.TILE_HEIGHT;
                                            var sizingMethod = (this.className.toLowerCase().indexOf("scale") >= 0) ? "scale" : "image";
                                            this.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.src.replace('%23', '%2523').replace("'", "%27") + "', sizingMethod='" + sizingMethod + "')";
                                            this.src = "conf/blank.gif";
                                            this.width = Map.TILE_WIDTH;
                                            this.height = Map.TILE_HEIGHT;
                                        }

                                    }


                                }


                            }


                        }


                    }

                };

            } else {

                if (Math.abs(parseInt(postImage.style.left) - pos.x) > 1 || Math.abs(parseInt(postImage.style.top) - pos.y) > 1) {

                    Util.modifyDOMElement(postImage, null, pos, this.size, "absolute", null);
                    postImage.style.visibility = "";
                }

            }

        }


    },

    setSvgExtent: function() {
        if (this.Svg) {
            this.Svg.setExtent();
        }

    },

    hideTileContainDivImages: function(bshow) {
        var Images = this.tileContainDiv.getElementsByTagName('img');
        var nSize = Images.length;
        var nExsitImage = 0;
        for (var i = 0; i < nSize; i++) {
            if (bshow)
                this.tileContainDiv.childNodes[i].style.display = "";
            else
                this.tileContainDiv.childNodes[i].style.display = "none";
        }


    },


    mouseWheelGetImages: function(bDrawVector) {

        this.setSvgExtent();
        var scale = this.public.transform.getScale();
        if (this.curScale != scale) {


            this.drawImages(this.tileContainDiv, null, null, null, null, this.imageDir, this.haveJs, "full", this.requestImage, this.loadImageDelay, this.baseFormat);
            this.drawVectorList();
            this.drawMarkers();
        }

        this.transitMap();
        this.curScale = scale;
        this.tileContainDiv.style.visibility = "";



    },


    getDisplayImages: function(bDrawVector) {

        this.setSvgExtent();
        var scale = this.public.transform.getScale();
        if (this.curScale != scale) {

            this.zoomMap(scale);
            this.drawVectorList();
        } else {
            this.drawImages(this.tileContainDiv, null, null, null, null, this.imageDir, this.haveJs, "full", this.requestImage, this.loadImageDelay, this.baseFormat);
        }

        if (bDrawVector) {
            this.drawMarkers();
            if (this.curScale == scale)
                this.drawVectorList();

        }

        this.curScale = scale;
        this.tileContainDiv.style.visibility = "";
        var mapBound = this.public.transform.mapExtent;
        if (!(mapBound.containsBounds(this.bound))) {
            this.transitMap();

        }


    },


    transitMap: function(scale) {
        var size = new Generic.Size(0, 0);
        for (var transimage in this.preRequestImage) {
            var image = document.getElementById(transimage);
            var tile = this.preRequestImage[transimage];
            if (image && tile) {

                var posLeft = this.public.transform.WorldToClient2(tile.left, tile.top);
                var posRight = this.public.transform.WorldToClient2(tile.right, tile.bottom);
                size.w = Math.abs(posLeft.x - posRight.x);
                size.h = Math.abs(posLeft.y - posRight.y);

                if (size.w > 2560 || size.h > 2560) {
                    size.w = 2560;
                    size.h = 2560;
                }
                Util.modifyDOMElement(image, null, posLeft, size, "absolute", null);
            }

        }

    },


    zoomMap: function(scale) {
        this.drawLayers();
        var size = new Generic.Size(0, 0);
        var Images = this.tileContainDiv.getElementsByTagName('img');
        var nSize = Images.length;
        var nExsitImage = 0;
        for (var i = 0; i < nSize; i++) {

            if (this.tileContainDiv.childNodes[i].existLoad == 1)
                nExsitImage++;
        }
        if (nExsitImage < 2) {
            for (var transimage in this.preRequestImage) {
                var image = document.getElementById(transimage);
                var tile = this.preRequestImage[transimage];
                if (image && tile) {

                    var posLeft = this.public.transform.WorldToClient2(tile.left, tile.top);
                    var posRight = this.public.transform.WorldToClient2(tile.right, tile.bottom);
                    size.w = Math.abs(posLeft.x - posRight.x);
                    size.h = Math.abs(posLeft.y - posRight.y);
                    Util.modifyDOMElement(image, null, posLeft, size, "absolute", null);
                }

            }

            this.drawImages(this.tileContainDiv, null, null, null, null, this.imageDir, this.haveJs, "full", this.requestImage, this.loadImageDelay, this.baseFormat);
            return;

        }

        while (this.switchDiv.hasChildNodes()) {
            this.switchDiv.removeChild(this.switchDiv.firstChild);
        }

        for (var baseImage in this.preRequestImage) {
            this.preRequestImage[baseImage] = null;
            delete this.preRequestImage[baseImage];

        }

        for (var transimage in this.requestImage) {
            var image = document.getElementById(transimage);
            if (!(image && image.existLoad == 1)) {
                continue;
            }

            var tile = this.requestImage[transimage];
            if (!Boolean(tile)) continue;
            transimage = transimage + "-trans";
            this.preRequestImage[transimage] = tile;
            this.public.transform.GetViewRect(this.bound);
            if (this.bound.contains(tile.left, tile.top) || this.bound.contains(tile.right, tile.bottom) || this.bound.contains(tile.left, tile.bottom) || this.bound.contains(tile.right, tile.top))

            {

                var posLeft = this.public.transform.WorldToClient2(tile.left, tile.top);
                var posRight = this.public.transform.WorldToClient2(tile.right, tile.bottom);
                size.w = Math.abs(posLeft.x - posRight.x);
                size.h = Math.abs(posLeft.y - posRight.y);

                transitiveImage = Util.createImage(transimage, posLeft, size, null, "absolute", null);
                transitiveImage.style.border = "none";
                transitiveImage.style.padding = "0px";
                transitiveImage.style.margin = "0px";
                transitiveImage.style.MozUserSelect = "none";
                transitiveImage.src = image.src;
                this.switchDiv.appendChild(transitiveImage);


            }

        }
        this.drawImages(this.tileContainDiv, null, null, null, null, this.imageDir, this.haveJs, "full", this.requestImage, this.loadImageDelay, this.baseFormat);

    },


    getMarksByID: function(id) {
        if (Boolean(this.markers[id])) {
            return this.markers;
        } else if (Boolean(this.markers1[id])) {
            return this.markers1;
        } else if (Boolean(this.markers2[id])) {
            return this.markers2;
        } else if (Boolean(this.markers3[id])) {
            return this.markers3;
        } else if (Boolean(this.markers4[id])) {
            return this.markers4;
        } else if (Boolean(this.markers5[id])) {
            return this.markers5;
        } else
            return null;

    },
    drawMarkers: function() {

        var markers = this.annoDiv.getElementsByTagName('div');
        if (markers.length > 0) {
            this.public.transform.GetViewRect(this.bound);
            for (var i = 0; i < markers.length; i++) {
                var tipDiv = this.annoDiv.childNodes[i];

                if (!Boolean(tipDiv) || !(tipDiv.parentNode && tipDiv.parentNode.id == "annoDiv")) {

                    continue;
                }

                var curMarkers = this.getMarksByID(this.annoDiv.childNodes[i].id);

                if (curMarkers) {
                    var icon = curMarkers[this.annoDiv.childNodes[i].id];
                    var size = icon.size;
                    var offset = icon.offset;
                    var pos = this.public.transform.WorldToClient2(icon.x, icon.y);
                    if (icon.style == "icon") {
                        pos.x -= icon.divOffset.x;
                        pos.y -= icon.divOffset.y;

                        if (this.public.transform.getScale() <= icon.scale) {
                            tipDiv.style.display = "";
                        } else
                            tipDiv.style.display = "none";
                    } else if (icon.style == "div") {
                        pos.x -= icon.divOffset.x;
                        pos.y -= icon.divOffset.y;
                        Util.modifyDOMElement(tipDiv, null, pos, null, "absolute");
                        continue;
                    } else if (icon.style == "text") {
                        pos.x -= icon.divOffset.x;
                        pos.y -= icon.divOffset.y;
                        Util.modifyDOMElement(tipDiv, null, pos, null, "absolute");
                        if (this.public.transform.getScale() <= icon.scale) {
                            tipDiv.style.display = "";
                        } else
                            tipDiv.style.display = "none";
                        continue;
                    } else {
                        pos.x -= size.w / 2;
                        pos.y -= size.h;
                    }

                    if (Math.abs(parseInt(tipDiv.style.left) - pos.x) > 2 || Math.abs(parseInt(tipDiv.style.top) - pos.y) > 2) {

                        Util.modifyAlphaImageDiv(tipDiv, null, pos, size, null, "absolute", null, "crop", null, offset);

                    }


                }


            }

        }


    },
    markerMouseDown: function() {

        if (!this.public.map.judgeState('MAP_MOVING'))
            return;
        var event = arguments[0] || window.event;

        var markerEvent = document.all ? event.srcElement : event.target;
        if (!markerEvent.id) return;
        var marker = document.getElementById(markerEvent.id);

        var curMarkers = this.getMarksByID(marker.id);
        if (curMarkers) {
            var icon = curMarkers[marker.id];

            if (!icon.canMove) {
                if (Util.getBrowserName() != "msie")
                    event.preventDefault();
                event.cancelBubble = true;
            } else {
                this.selectIconID = marker.id;
            }

        }

    },
    setSelectIconID: function() {
        this.selectIconID = null;
    },
    markerMouseUp: function() {
        if (this.public.map.bMouseDown) {
            return;
        }
        if (!this.public.map.judgeState('MAP_MOVING'))
            return;

        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;
        if (!markerEvent.id) return;
        var marker = document.getElementById(markerEvent.id);
        var curMarkers = this.getMarksByID(marker.id);
        if (curMarkers) {
            var icon = curMarkers[marker.id];
            if (icon.fun)
                icon.fun(marker.id, icon.type, icon.x, icon.y, icon.name, false);
            if (!icon.canMove) {

                if (Util.getBrowserName() != "msie")
                    event.preventDefault();
                event.cancelBubble = true;


            }

        }

    },
    markerMouseMove: function() {

        if (!this.public.map.judgeState('MAP_MOVING'))
            return;
        var event = arguments[0] || window.event;
        if (Util.getBrowserName() != "msie")
            event.preventDefault();
        event.cancelBubble = true;

    },
    selectIconInfo: function() {

        if (this.selectIconID) {
            var curMarkers = this.getMarksByID(this.selectIconID);
            if (curMarkers) {
                var icon = curMarkers[this.selectIconID];
                if (icon.fun)
                    icon.fun(this.selectIconID, icon.type, icon.x, icon.y, icon.name, false);
            }
        }
    },
    markerMouseMoveTo: function(pos) {

        var curMarkers = this.getMarksByID(this.selectIconID);
        if (curMarkers) {
            var icon = curMarkers[this.selectIconID];
            if (icon && icon.canMove) {
                var marker = document.getElementById(icon.id);
                var size = icon.size;

                var offset = icon.offset;
                var clientPos = this.public.transform.WorldToClient2(pos.x, pos.y);
                if (marker) {
                    this.public.map.drawTip(null, null, false);
                    clientPos.x -= icon.divOffset.x;
                    clientPos.y -= icon.divOffset.y;
                    Util.modifyAlphaImageDiv(marker, null, clientPos, icon.size, null, "absolute", null, null, null, offset);
                }

                icon.x = pos.x;
                icon.y = pos.y;

            }

        }

    },
    markerMouseOut: function() {

        if (!this.public.map.judgeState('MAP_MOVING'))
            return;

        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;
        if (!markerEvent.id) return;
        var marker = document.getElementById(markerEvent.id);
        if (marker) {
            marker.style.cursor = "auto";
            var curMarkers = this.getMarksByID(marker.id);
            if (curMarkers) {
                var icon = curMarkers[marker.id];
                if (icon.style == "text") {
                    marker.style.border = "1px solid gray";
                    return;
                }

                var redRegex = /(red-)/g;
                var bluRegex = /(yel-)/g;
                var changePic = null;

                if (marker.childNodes[0] && redRegex.test(marker.childNodes[0].src)) {
                    changePic = marker.childNodes[0].src.replace(redRegex, "yel-");

                } else if (marker.childNodes[0] && bluRegex.test(marker.childNodes[0].src)) {
                    changePic = marker.childNodes[0].src.replace(bluRegex, "red-");

                }

                if (changePic) {

                    Util.modifyAlphaImageDiv(marker, null, null, null, changePic);
                }

                if (marker.childNodes[0] && marker.type && marker.type == "word") {
                    marker.childNodes[0].style.backgroundImage = "url(conf/marker-green.png)";
                }

            }

            this.public.map.drawTip(null, null, false);
        }
    },

    markerMouseOver: function() {


        if (!this.public.map.judgeState('MAP_MOVING'))
            return;
        if (this.public.map.bMouseDown) {
            return;
        }
        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;
        if (!markerEvent.id) return;
        var marker = document.getElementById(markerEvent.id);

        if (marker) {

            var curMarkers = this.getMarksByID(marker.id);
            if (curMarkers) {

                var icon = curMarkers[marker.id];
                marker.style.zIndex = this.zIndexValue++;
                if (icon.style == "text") {
                    marker.style.border = "2px solid blue";
                } else {

                    if (icon.name) {
                        var pos = this.public.transform.WorldToClient2(icon.x, icon.y);
                        var postop = new Generic.CPoint(pos.x + 10, pos.y - 10);
                        this.public.map.drawTip(icon.name, postop, true);
                    }
                    var redRegex = /(red-)/g;
                    var bluRegex = /(yel-)/g;

                    var changePic = null;

                    if (marker.childNodes[0] && redRegex.test(marker.childNodes[0].src)) {
                        changePic = marker.childNodes[0].src.replace(redRegex, "yel-");

                    } else if (marker.childNodes[0] && bluRegex.test(marker.childNodes[0].src)) {
                        changePic = marker.childNodes[0].src.replace(bluRegex, "red-");

                    }
                    if (changePic) {
                        Util.modifyAlphaImageDiv(marker, null, null, null, changePic);

                    }
                    if (marker.childNodes[0] && marker.type && marker.type == "word") {
                        marker.childNodes[0].style.backgroundImage = "url(conf/marker-gold.png)";
                    }
                }
                if (icon.fun) {
                    if (Util.getBrowserName() != "msie")
                        marker.style.cursor = "pointer";
                    else
                        marker.style.cursor = "hand";

                    icon.fun(marker.id, icon.type, icon.x, icon.y, icon.name, true);
                }

            }
        }

    },

    changeMarkPic: function(id, src) {
        if (!id) return;
        var id = String(id);
        var marker = document.getElementById(id);
        if (marker) {

            var curMarkers = this.getMarksByID(id);
            if (curMarkers) {
                var icon = curMarkers[id];
                marker.style.zIndex = this.zIndexValue++;


                var redRegex = /(red-)/g;
                var bluRegex = /(yel-)/g;


                var changePic = null;

                if (marker.childNodes[0] && redRegex.test(marker.childNodes[0].src)) {
                    changePic = marker.childNodes[0].src.replace(redRegex, "yel-");

                } else if (marker.childNodes[0] && bluRegex.test(marker.childNodes[0].src)) {
                    changePic = marker.childNodes[0].src.replace(bluRegex, "red-");

                }

                if (changePic) {

                    Util.modifyAlphaImageDiv(marker, null, null, null, changePic);
                }

            }

        }

    },
    delMarker: function(id) {
        this.delAddPic(id, "marker");

    },
    delIcon: function(id) {
        this.delAddPic(id, "icon");

    },
    delIcon1: function(id) {
        this.delAddPic(id, "icon", 1);

    },
    delIcon2: function(id) {
        this.delAddPic(id, "icon", 2);

    },
    delIcon3: function(id) {
        this.delAddPic(id, "icon", 3);

    },


    delDiv: function(id) {
        var popDiv = document.getElementById(String(id));
        if (popDiv) {
            if (popDiv.exist)
                popDiv.style.display = "none";
            else {
                if (Boolean(this.markers[popDiv.id])) {
                    delete this.markers[popDiv.id];
                    this.annoDiv.removeChild(popDiv);
                }


            }

        }
    },
    delTextDiv: function(id) {
        this.delAddPic(id, "text", 5);

    },
    getSelectIconID: function() {
        return this.selectIconID;
    },
    delAddPic: function(id, markerText, nIndex) {
        var curMarker = {};
        if (nIndex == 1) {
            curMarker = this.markers1;
        } else if (nIndex == 2) {
            curMarker = this.markers2;
        } else if (nIndex == 3) {
            curMarker = this.markers3;
        } else if (nIndex == 4) {
            curMarker = this.markers4;
        } else if (nIndex == 5) {
            curMarker = this.markers5;
        } else
            curMarker = this.markers;

        if (id) {
            var marker = document.getElementById(String(id));
            if (marker) {

                Util.modifyAlphaImageDiv(marker, null, null, null, "conf/transparent.png");
                if (Boolean(curMarker[marker.id])) {
                    delete curMarker[marker.id];
                }
                this.annoDiv.removeChild(marker);

            }
        } else {
            if (this.zIndexValue > 10000000)
                this.zIndexValue = 1;

            var deleteDivs = [];
            var delType = null;

            for (var p in curMarker) {
                var icon = curMarker[p];
                if (icon.style == markerText)
                    deleteDivs.push(p);
            }
            for (var i = 0; i < deleteDivs.length; i++) {
                deleteImage = deleteDivs[i];
                delete curMarker[deleteImage];

                var node = document.getElementById(deleteImage);
                if (node)
                    this.annoDiv.removeChild(node);
            }
            deleteDivs.length = 0;

        }
    },

    addTextDiv: function(id, type, name, x, y, divOffsetX, divOffsetY, backColor, penColor, fun, scale) {
        id = String(id);
        var divOffset = new Generic.Pixel(divOffsetX, divOffsetY);
        var icon = new Icon(type, null, null, null, x, y, id, fun, "text", name, scale, divOffset, backColor, penColor);
        var pos = this.public.transform.WorldToClient2(x, y);
        pos.x -= divOffsetX;
        pos.y -= divOffsetY;
        var imageDiv = Util.getElement(id);
        if (!imageDiv) {
            imageDiv = Util.createDiv(id, null, null, null, "absolute", null);

            this.annoDiv.appendChild(imageDiv);
            if (fun) {
                this.addEventType(imageDiv);
            }
        }


        if (this.public.transform.getScale() <= scale) {
            imageDiv.style.display = "";
        } else
            imageDiv.style.display = "none";

        imageDiv.style.backgroundColor = "#FFFFFF";
        if (backColor)
            imageDiv.style.backgroundColor = backColor;
        if (!penColor) penColor = "red";
        imageDiv.style.left = "0px";
        imageDiv.style.top = "0px";
        imageDiv.style.zIndex = 0;
        imageDiv.style.whiteSpace = "nowrap";
        imageDiv.style.fontSize = "1px";
        imageDiv.style.border = "1px solid gray";
        imageDiv.setAttribute("unselectable", "on", 0);
        imageDiv.style.padding = "1px";

        imageDiv.onselectstart = function() {
            return false;
        };

        imageDiv.innerHTML = "<span id=" + id + " style='FONT-SIZE: 10pt;-moz-user-select: none;color:" + penColor + ";'>" + name + "</span>  ";
        var spans = imageDiv.getElementsByTagName('span');
        var nSize = spans.length;
        for (i = 0; i < nSize; i++) {
            textSpan = spans[i];
            if (textSpan) {
                textSpan.setAttribute("unselectable", "on", 0);
                textSpan.onselectstart = function() {
                    return false;
                };
            }
        }
        Util.modifyDOMElement(imageDiv, null, pos, null, "absolute", null);
        this.markers5[id] = icon;
        return imageDiv;


    },

    addIcon: function(id, type, name, url, x, y, w, h, imgOffsetX, imgOffsetY, fun, scale, divOffsetX, divOffsetY, canMove, bMarker) {
        id = String(id);
        var size = new Generic.Size(w, h);
        if (!imgOffsetX)
            imgOffsetX = imgOffsetY = 0;

        if (!divOffsetX) {
            divOffsetX = size.w / 2;
            divOffsetY = size.h / 2;
        }
        var imgOffset = new Generic.Pixel(imgOffsetX, imgOffsetY);
        var divOffset = new Generic.Pixel(divOffsetX, divOffsetY);

        var icon = new Icon(type, url, size, imgOffset, x, y, id, fun, "icon", name, scale, divOffset, null, null, canMove);
        var pos = this.public.transform.WorldToClient2(x, y);

        pos.x -= divOffsetX;
        pos.y -= divOffsetY;

        var imageDiv = Util.getElement(id);
        if (!imageDiv) {
            imageDiv = Util.createAlphaImageDiv(id);

            this.annoDiv.appendChild(imageDiv);
            if (fun) {
                this.addEventType(imageDiv);
            }
        }

        Util.modifyAlphaImageDiv(imageDiv, null, pos, size, url, "absolute", null, "crop", null, imgOffset);


        if (id == "10000") {
            imageDiv.style.zIndex = 9999999;
        } else
            imageDiv.style.zIndex = this.zIndexValue++;

        imageDiv.style.backgroundColor = "transparent";

        if (this.public.transform.getScale() <= scale) {
            imageDiv.style.display = "";
        } else
            imageDiv.style.display = "none";



        if (bMarker == 1) {
            this.markers1[id] = icon;
        } else if (bMarker == 2) {
            this.markers2[id] = icon;
        } else if (bMarker == 3) {
            this.markers3[id] = icon;
        } else {
            this.markers[id] = icon;
        }
        return imageDiv;
    },


    addMarker: function(id, type, url, x, y, fun, tip) {
        id = String(id);
        var size = new Generic.Size(19, 28);
        var offset = new Generic.Pixel(0, 0);
        var icon = new Icon(type, url, size, offset, x, y, id, fun, "marker", tip);
        var pos = this.public.transform.WorldToClient2(x, y);
        pos.x -= size.w / 2;
        pos.y -= size.h;
        var imageDiv = Util.getElement(id);

        if (!imageDiv) {
            imageDiv = Util.createAlphaImageDiv(id);
            this.annoDiv.appendChild(imageDiv);

        }
        Util.modifyAlphaImageDiv(imageDiv,
            null,
            pos,
            size,
            url,
            "absolute", null, null, null, offset);
        imageDiv.style.backgroundColor = "transparent";
        imageDiv.style.zIndex = this.zIndexValue++;
        if (fun) {
            this.addEventType(imageDiv);
        }
        this.markers[id] = icon;
    },


    addEventType: function(imageDiv) {

        var eventHandlerOut = Util.bindAsEventListener(this.markerMouseOut, this);
        var eventHandlerOver = Util.bindAsEventListener(this.markerMouseOver, this);
        var eventHandleDown = Util.bindAsEventListener(this.markerMouseDown, this);
        var eventHandlerUp = Util.bindAsEventListener(this.markerMouseUp, this);
        var eventHandlerMove = Util.bindAsEventListener(this.markerMouseMove, this);
        var eventHandlerdbClick = Util.bindAsEventListener(this.markerMousedbClick, this);
        Util.addEventType(imageDiv, "mouseout", eventHandlerOut)
        Util.addEventType(imageDiv, "mouseover", eventHandlerOver);
        Util.addEventType(imageDiv, "mousedown", eventHandleDown);
        Util.addEventType(imageDiv, "mouseup", eventHandlerUp);
        Util.addEventType(imageDiv, "mousemove", eventHandlerMove);
        Util.addEventType(imageDiv, "dblclick", eventHandlerdbClick);
    },


    markerMousedbClick: function() {

        if (!this.public.map.judgeState('MAP_MOVING'))
            return;
        var event = arguments[0] || window.event;
        if (Util.getBrowserName() != "msie")
            event.preventDefault();
        event.cancelBubble = true;

    },
    delMarkerLetter: function(id) {
        this.delAddPic(id, "marker", 4);

    },

    addMarkerLetter: function(id, type, url, x, y, fun, value, tip) {
        id = String(id);
        var size = new Generic.Size(20, 26);
        var offset = new Generic.Pixel(0, 0);
        var icon = new Icon(type, url, size, offset, x, y, id, fun, "marker", tip);
        var pos = this.public.transform.WorldToClient2(x, y);
        pos.x -= size.w / 2;
        pos.y -= size.h;
        var imageDiv = Util.getElement(id);
        if (!imageDiv) {
            imageDiv = Util.createAlphaImageDiv(id);
            this.annoDiv.appendChild(imageDiv);
            imageDiv.innerHTML = "<div id=" + id + " style='width:20px;height:26px;position:relative;FONT-SIZE: 12px;color:red ;font-weight:normal;TEXT-ALIGN: center;line-height:24px;background-image:" + url + "  '>" + value + "</div>  ";
            imageDiv.type = "word";
            if (fun) {
                this.addEventType(imageDiv);
            }
        }
        Util.modifyAlphaImageDiv(imageDiv,
            null,
            pos,
            size,
            "marker-green.png",
            "absolute", null, null, null, offset);

        this.markers4[id] = icon;
        var div = imageDiv.getElementsByTagName('div');
        var nSize = div.length;
        for (var i = 0; i < nSize; i++) {
            var textDiv = div[i];
            if (textDiv) {
                textDiv.setAttribute("unselectable", "on", 0);
                textDiv.onselectstart = function() {
                    return false;
                };
            }
        }



    },
    getVmlOrSvg: function() {
        if (Util.getBrowserName() != "msie") {
            return this.Svg;
        } else {
            return this.Vml;
        }

    },
    drawVectorList: function() {
        var vectorList = this.public.map.vectorList;

        for (var p in vectorList) {
            var vector = vectorList[p];
            var node = Util.getElement(vector.id);
            if (node) {

                if (vector.style == "circle") {
                    var numComponents = vector.pntList.length;
                    if (numComponents == 1) {
                        comp = vector.pntList[0];
                        if (this.public.transform.getScale() >= vector.scale) {
                            node.style.display = "";
                        } else {
                            node.style.display = "none";
                        }
                    }

                    this.getVmlOrSvg().drawCircle(node, vector);

                } else if (vector.style == "polyline") {
                    if (this.public.transform.getScale() >= vector.scale) {
                        node.style.display = "";
                    } else {
                        node.style.display = "none";
                    }
                    this.getVmlOrSvg().drawLine(node, vector, false);
                } else if (vector.style == "polygon" || vector.style == "rectangle") {
                    if (this.public.transform.getScale() >= vector.scale) {
                        node.style.display = "";
                    } else {

                        node.style.display = "none";
                    }
                    this.getVmlOrSvg().drawPolygon(node, vector);

                }


            }



        }


    },
    drawVectorLine: function() {
        var vectorList = this.public.map.vectorList;

        for (var p in vectorList) {

            var vector = vectorList[p];
            var node = Util.getElement(vector.id);
            if (node) {

                if (vector.style == "polyline") {
                    if (this.public.transform.getScale() >= vector.scale) {
                        node.style.display = "";
                    } else {
                        node.style.display = "none";
                    }
                    this.getVmlOrSvg().drawLine(node, vector, false);
                }



            }

        }

    },

    setEditVectorExtent: function() {
        var vectorList = this.public.map.vectorList;

        for (var p in vectorList) {
            var vector = vectorList[p];
            if (vector.style == "polygon" || vector.style == "rectangle" || vector.style == "polyline") {
                var node = Util.getElement(vector.id);
                if (node) {
                    this.getVmlOrSvg().setNodeDimension2(node);
                    this.getVmlOrSvg().setNodeDimension(node);
                }
            }

        }
    },

    addPopDiv: function(id, x, y, w, h, offsetX, offsetY, fun, contentHTML) {
        id = String(id);
        var imageDiv = Util.getElement(id);
        var size = new Generic.Size(w, h);
        if (!imageDiv) {

            imageDiv = Util.createDiv(id, null, size, null,
                "absolute", null);
            imageDiv.style.backgroundColor = "#FFFFFF";
            imageDiv.style.border = "1px solid gray";
            imageDiv.exist = false;
            imageDiv.innerHTML = contentHTML;

        } else
            imageDiv.exist = true;

        var divOffset = new Generic.Pixel(offsetX, offsetY);
        var icon = new Icon(null, null, size, null, x, y, id, fun, "div", null, null, divOffset, null);
        var pos = this.public.transform.WorldToClient2(x, y);
        pos.x -= offsetX;
        pos.y -= offsetY;

        imageDiv.style.zIndex = 99999;
        imageDiv.style.display = "block";

        imageDiv.setAttribute("unselectable", "on", 0);
        imageDiv.onselectstart = function() {
            return false;
        };

        var divMouseOut = Util.bindAsEventListener(this.divMouseOut, this);
        var divMouseOver = Util.bindAsEventListener(this.divMouseOver, this);
        var divMouseDown = Util.bindAsEventListener(this.divMouseDown, this);
        var divMouseUp = Util.bindAsEventListener(this.divMouseUp, this);
        var divMouseMove = Util.bindAsEventListener(this.divMouseMove, this);

        Util.addEventType(imageDiv, "dblclick", divMouseDown);
        Util.addEventType(imageDiv, "mousedown", divMouseDown);
        Util.addEventType(imageDiv, "mouseup", divMouseUp);

        Util.modifyDOMElement(imageDiv, null, pos, null, "absolute", null);

        this.markers[id] = icon;

        if (imageDiv.parentNode && imageDiv.parentNode.id == "annoDiv") {
            imageDiv.style.display = "block";

        } else
            this.annoDiv.appendChild(imageDiv);

        pos.x += offsetX;
        pos.y += offsetY;

        this.public.map.movePopDivPos(imageDiv, pos);
    },
    divMouseMove: function() {
        this.divMouseMoveIn = true;

    },
    divMouseOut: function() {
        if (!this.public.map.judgeState('MAP_MOVING'))
            return;

        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;
        if (!markerEvent.id) return;
        var marker = document.getElementById(markerEvent.id);

        if (marker) {
            var curMarkers = this.getMarksByID(marker.id);
            if (curMarkers) {
                this.divMouseMoveIn = false;
            }
        }

    },
    divMouseOver: function() {


    },
    divMouseDown: function() {

        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;
        if (Util.getBrowserName() != "msie")
            event.preventDefault();
        event.cancelBubble = true;
    },
    divMouseUp: function() {

        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;
        if (Util.getBrowserName() != "msie")
            event.preventDefault();
        event.cancelBubble = true;
    },

    addLayer: function(id, div, options) {
        var layer = new Generic.LayerDiv(id, div, options);

        if (this.layerDivs[id])
            return;

        this.layerDivs[id] = layer;

    },

    drawLayers: function() {
        for (var layer in this.layerDivs) {
            layerObi = this.layerDivs[layer];
            layerObi.layerDiv.style.visibility = "";
            if (layerObi.layerDiv.style.display != "none")
                this.drawImages(layerObi.layerDiv, layerObi.bound, layerObi.maxScale, layerObi.minScale, layerObi.mapNo, layerObi.imageDir, layerObi.js, layerObi.id, layerObi.requestImage, layerObi.loadImageDelay, layerObi.format);

        }
    },

    hideLayers: function() {
        for (var layer in this.layerDivs) {
            layerObi = this.layerDivs[layer];
            layerObi.layerDiv.style.visibility = "hidden";
        }
    },

    displayLayers: function(id, display) {
        for (var layer in this.layerDivs) {
            layerObi = this.layerDivs[layer];
            if (layerObi.id == id)
                layerObi.layerDiv.style.display = display;
        }
    },
    delLayer: function(id) {
        if (Boolean(id)) {
            if (Boolean(this.layerDivs[id])) {
                var layerObi = this.layerDivs[id];
                while (layerObi.layerDiv.hasChildNodes()) {
                    layerObi.layerDiv.firstChild.src = "conf/transparent.png";
                    layerObi.layerDiv.removeChild(layerObi.layerDiv.firstChild);
                }
                for (var image in layerObi.requestImage) {
                    delete layerObi.requestImage[image];
                }
                for (var delay in layerObi.loadImageDelay) {
                    delete layerObi.loadImageDelay[delay];
                }
                if (Boolean(layerObi.layerDiv.parentNode.id))
                    this.dragContainDiv.removeChild(layerObi.layerDiv);

                delete this.layerDivs[id];

            }
        } else {
            for (var layer in this.layerDivs) {

                var layerObi = this.layerDivs[layer];

                while (layerObi.layerDiv.hasChildNodes()) {
                    layerObi.layerDiv.firstChild.src = "conf/transparent.png";
                    layerObi.layerDiv.removeChild(layerObi.layerDiv.firstChild);
                }
                for (var image in layerObi.requestImage) {
                    delete layerObi.requestImage[image];
                }
                for (var delay in layerObi.loadImageDelay) {
                    delete layerObi.loadImageDelay[delay];
                }
                if (Boolean(layerObi.layerDiv.parentNode.id))
                    this.dragContainDiv.removeChild(layerObi.layerDiv);

                delete this.layerDivs[layer];


            }

        }

    },

    CLASS_NAME: "Display"
});

Tile = Util.Class({

    left: null,
    top: null,
    right: null,
    bottom: null,

    clientLeft: null,
    clientTop: null,
    id: null,
    jsDir: null,
    fileDir: null,
    jsID: null,
    initialize: function(id, left, top, right, bottom, clientLeft, clientTop, jsDir, fileDir, jsID) {

        this.id = id;
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.clientLeft = clientLeft;
        this.clientTop = clientTop;
        this.jsDir = jsDir;
        this.fileDir = fileDir;
        this.jsID = jsID;
    },
    clone: function() {
        return new Tile(this.id, this.left, this.top, this.right, this.bottom, this.clientLeft, this.clientTop, this.jsDir, this.fileDir, this.jsID);
    },
    CLASS_NAME: "Tile"
});

Icon = Util.Class({

    style: null,
    url: null,
    size: null,
    offset: null,
    id: null,
    x: null,
    y: null,
    fun: null,
    name: null,
    scale: null,
    divOffset: null,
    backColor: null,
    penColor: null,
    canMove: false,
    type: null,
    initialize: function(type, url, size, offset, x, y, id, fun, style, name, scale, divOffset, backColor, penColor, canMove) {
        this.type = type;
        this.url = url;
        this.size = (size) ? size : new Generic.Size(20, 20);
        this.offset = offset ? offset : new Generic.Pixel(-(this.size.w / 2), -(this.size.h / 2));
        this.id = id;
        this.x = parseInt(x);
        this.y = parseInt(y);
        this.fun = fun;
        this.style = style;
        this.name = name;
        this.scale = scale;
        this.divOffset = divOffset;
        this.backColor = backColor;
        this.penColor = penColor;
        this.canMove = canMove;
    },
    destroy: function() {

    },

    clone: function() {


        return new OpenLayers.Icon(this.type,
            this.url,
            this.size,
            this.offset.clone(),
            this.id,
            this.x,
            this.y,
            this.fun,
            this.style,
            this.name,
            this.scale,
            this.divOffset.clone(),
            this.backColor,
            this.penColor,
            this.canMove
        );
    },

    setSize: function(size) {
        if (size != null) {
            this.size = size;
        }

    },

    setUrl: function(url) {
        if (url != null) {
            this.url = url;
        }
    },

    CLASS_NAME: "Icon"
});

Contrl = Util.Class({

    div: null,
    public: null,
    scaleSum: null,
    barGirdWidth: 8,
    barHeight: 75,
    curScaleLevel: 6,
    scaleBarDiv: null,
    sliderBarDiv: null,
    bSliderMouseDown: false,
    scalesMap: null,
    bScaleBarShow: false,
    curScale: null,
    bSiderSelect: false,
    countryScale: 12,
    provinceScale: 11,
    cityScale: 6,
    streetScale: 2,
    timeoutTipId: null,
    initialize: function(div, bScaleBarShow, public) {
        this.div = div;
        this.scalesMap = {};
        this.bScaleBarShow = bScaleBarShow;
        this.public = public;
        this.curScale = this.public.map.curScale;
        nScaleIndex = this.public.map.scale.length;
        nIndex = 0;
        bFindMinScale = false;
        for (i = 0; i < nScaleIndex; i++) {
            if (this.public.map.scale[i] == this.public.map.minScale) {
                bFindMinScale = true;
            }


            if (this.public.map.scale[i] == this.curScale) {
                this.curScaleLevel = nIndex;
            }
            if (bFindMinScale) {
                this.scalesMap[nIndex++] = this.public.map.scale[i];

            }
            if (this.public.map.scale[i] == this.public.map.maxScale) {
                break;
            }
        }

        this.scaleSum = nIndex;
        scaleBarHeight = 0;
        this.addMarker("circle", "conf/circle.png", 5, 5, 59, 60, 0, 0, this.setNULL, this.div);
        this.addMarker("north", "conf/north-min.png", 27, 10, 15, 17, 0, 0, this.setNorth, this.div);
        this.addMarker("west", "conf/west-min.png", 9, 29, 18, 12, 0, 0, this.setWest, this.div);
        this.addMarker("zoomworld", "conf/zoom-world-min.png", 25, 27, 17, 16, 0, 0, this.SetWorld, this.div);
        this.addMarker("east", "conf/east-min.png", 40, 29, 18, 12, 0, 0, this.setEast, this.div);
        this.addMarker("south", "conf/south-min.png", 27, 42, 15, 17, 0, 0, this.setSouth, this.div);
        this.addMarker("zoomin", "conf/zoom-plus-min.png", 19, 65, 31, 18, 0, 0, this.setZoomIn, this.div);

        if (bScaleBarShow) {
            scaleBarHeight = this.barGirdWidth * this.scaleSum - 3;
            this.scaleBarDiv = this.addMarker("scalebar", "conf/zoombar.png", 19, 83, 31, scaleBarHeight, 0, 0, this.scaleBarMouseClick, this.div);
            this.sliderBarDiv = this.addMarker("slider", "conf/slider.png", 8, this.barGirdWidth * this.curScaleLevel + 1, 14, 6, 0, 0, this.sliderBarDivClick, this.scaleBarDiv);
            this.sliderBarDiv.style.zIndex = 1;

        } else
            this.scaleSum = 100;

        this.addMarker("zoomout", "conf/zoom-minus-min.png", 19, 83 + scaleBarHeight, 31, 19, 0, 0, this.seZoomOut, this.div);

        if (this.scaleSum > 10) {
            if (this.scaleSum >= 15)
                this.addMarker("tocountry", "conf/country.png", 45, this.barGirdWidth * (this.countryScale + 1) + 70, 26, 17, 0, 0, this.seZoomCountry, this.div);
            this.addMarker("toprovince", "conf/province.png", 45, this.barGirdWidth * (this.provinceScale + 1) + 70, 26, 17, 0, 0, this.seZoomProvince, this.div);
            this.addMarker("tocity", "conf/city.png", 45, this.barGirdWidth * (this.cityScale + 1) + 70, 26, 17, 0, 0, this.seZoomCity, this.div);
            this.addMarker("tostreet", "conf/street.png", 45, this.barGirdWidth * (this.streetScale + 1) + 70, 26, 17, 0, 0, this.seZoomStreet, this.div);
        }
    },



    seZoomCountry: function() {
        if (this.public.map.bMouseDown)
            return;
        this.setCurScale(this.scalesMap[this.countryScale]);
        this.public.map.setCurrentScale(this.curScale, true);
        var event = arguments[0] || window.event;
        this.preventTransfer(event);

    },
    seZoomProvince: function() {
        if (this.public.map.bMouseDown)
            return;
        this.setCurScale(this.scalesMap[this.provinceScale]);
        this.public.map.setCurrentScale(this.curScale, true);
        var event = arguments[0] || window.event;
        this.preventTransfer(event);
    },
    seZoomCity: function() {
        if (this.public.map.bMouseDown)
            return;
        this.setCurScale(this.scalesMap[this.cityScale]);
        this.public.map.setCurrentScale(this.curScale, true);
        var event = arguments[0] || window.event;
        this.preventTransfer(event);
    },
    seZoomStreet: function() {
        if (this.public.map.bMouseDown)
            return;
        this.setCurScale(this.scalesMap[this.streetScale]);
        this.public.map.setCurrentScale(this.curScale, true);
        var event = arguments[0] || window.event;
        this.preventTransfer(event);
    },
    sliderBarDivClick: function() {
        this.bSiderSelect = false;
        var event = arguments[0] || window.event;
        if (this.scaleBarDiv.releaseCapture)
            this.scaleBarDiv.releaseCapture();
        this.preventTransfer(event);
    },
    setNorth: function() {
        if (this.public.map.bMouseDown) {
            return;
        }
        this.public.map.setStatusType("north");
        var event = arguments[0] || window.event;
        this.preventTransfer(event);
    },

    setNULL: function() {

        if (this.public.map.bMouseDown) {
            return;
        }
        var event = arguments[0] || window.event;
        this.preventTransfer(event);
    },


    setWest: function() {
        if (this.public.map.bMouseDown) {
            return;
        }
        this.public.map.setStatusType("west");
        var event = arguments[0] || window.event;
        this.preventTransfer(event);
    },
    setEast: function() {
        if (this.public.map.bMouseDown) {
            return;
        }
        this.public.map.setStatusType("east");
        var event = arguments[0] || window.event;
        this.preventTransfer(event);
    },
    setSouth: function() {
        if (this.public.map.bMouseDown) {
            return;
        }
        this.public.map.setStatusType("south");
        var event = arguments[0] || window.event;
        this.preventTransfer(event);
    },
    setZoomIn: function() {
        if (this.public.map.bMouseDown) {
            return;
        }
        var event = arguments[0] || window.event;
        this.preventTransfer(event);
        if (this.public.map.bMouseDown) {
            return;
        }
        if (this.curScaleLevel > 0) {
            this.public.map.setStatusType("zoomin");
        }

    },
    SetWorld: function() {
        if (this.public.map.bMouseDown) {
            return;
        }
        this.public.map.setStatusType("zoomworld");
        var event = arguments[0] || window.event;
        this.preventTransfer(event);

    },

    seZoomOut: function() {
        if (this.public.map.bMouseDown) {
            return;
        }
        if (this.curScaleLevel < this.scaleSum - 1) {
            this.public.map.setStatusType("zoomout");
        }
        var event = arguments[0] || window.event;
        this.preventTransfer(event);
    },
    scaleBarMouseClick: function() {
        if (this.public.map.bMouseDown) {
            return;
        }
        if (this.scaleBarDiv.releaseCapture)
            this.scaleBarDiv.releaseCapture();

        this.bSiderSelect = false;
        var event = arguments[0] || window.event;
        var Pos = Util.getMousePosition(this.scaleBarDiv, event);
        Pos.x = 8;
        interval = parseInt(Pos.y / this.barGirdWidth - 0.5);
        if (interval == this.curScaleLevel)
            return;
        else {
            if (interval <= 0)
                interval = 0;
            if (interval >= this.scaleSum - 1)
                interval = this.scaleSum - 1;
            Pos.y = this.barGirdWidth * interval + 1;
            Util.modifyAlphaImageDiv(this.sliderBarDiv, null, Pos, null, null, "absolute");
            this.curScaleLevel = interval;
            if (Boolean(this.scalesMap[this.curScaleLevel])) {
                this.curScale = this.scalesMap[this.curScaleLevel];
                this.public.map.setCurrentScale(this.curScale, true);

            }
        }


        this.preventTransfer(event);
    },

    markerMouseDown: function() {
        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;

        if (markerEvent.id == "slider")
            this.bSiderSelect = true;
        else
            this.bSiderSelect = false;


        if (markerEvent.id == "slider") {

            if (this.scaleBarDiv.setCapture)
                this.scaleBarDiv.setCapture();
        }

        this.preventTransfer(event);
    },
    markerMousedbClick: function() {

        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;
        this.bSiderSelect = false;
        this.preventTransfer(event);
    },
    addMarker: function(id, url, x, y, w, h, imgOffsetX, imgOffsetY, fun, div) {
        var size = new Generic.Size(w, h);
        var pos = new Generic.CPoint(x, y);
        var offset = new Generic.Pixel(imgOffsetX, imgOffsetY);

        var imageDiv = Util.createAlphaImageDiv(id);
        Util.modifyAlphaImageDiv(imageDiv, null, pos, size, url, "absolute", null, null, null, offset);
        imageDiv.style.backgroundColor = "transparent";

        if (Boolean(this.public.display.version) && (this.public.display.version >= 5.5 && this.public.display.version < 7.0)) {

            var imgPng = imageDiv.childNodes[0];
            if (imgPng) {
                var width = w;
                var height = h;
                var sizingMethod = (imgPng.className.toLowerCase().indexOf("scale") >= 0) ? "scale" : "image";
                imgPng.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgPng.src.replace('%23', '%2523').replace("'", "%27") + "', sizingMethod='" + sizingMethod + "')";
                imgPng.src = "conf/blank.gif";
                imgPng.width = w;
                imgPng.height = h;

            }
        }
        div.appendChild(imageDiv);


        if (id == "tocountry" || id == "toprovince" || id == "tocity" || id == "tostreet") {
            imageDiv.style.display = "none";

        }

        var eventHandlerOut = Util.bindAsEventListener(this.markerMouseOut, this);
        var eventHandlerOver = Util.bindAsEventListener(this.markerMouseOver, this);
        var eventHandlerDown = Util.bindAsEventListener(this.markerMouseDown, this);
        var eventHandlerdbClick = Util.bindAsEventListener(this.markerMousedbClick, this);
        var eventHandlerFun = Util.bindAsEventListener(fun, this);

        Util.addEventType(imageDiv, "mouseout", eventHandlerOut);
        Util.addEventType(imageDiv, "mouseover", eventHandlerOver);
        Util.addEventType(imageDiv, "mousedown", eventHandlerDown);
        Util.addEventType(imageDiv, "dblclick", eventHandlerdbClick);
        Util.addEventType(imageDiv, "mouseup", eventHandlerFun);

        if (id == "scalebar") {
            var eventHandlerMove = Util.bindAsEventListener(this.markerMouseMove, this);
            Util.addEventType(imageDiv, "mousemove", eventHandlerMove);
        }



        return imageDiv;
    },
    setPublic: function(public) {
        this.public = public;
    },

    markerMouseOut: function() {
        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;
        if (markerEvent.id == "scalebar" || markerEvent.id == "tocountry" || markerEvent.id == "toprovince" || markerEvent.id == "tocity" || markerEvent.id == "tostreet") {
            if (!this.timeoutTipId)
                this.timeoutTipId = window.setTimeout(Util.bind(this.hideTipBar, this), 1000);

        }

    },
    hideTipBar: function() {
        this.displayTipBar('none');
        this.timeoutTipId = null;
    },
    setSliderSelect: function(bSelect) {
        this.bSiderSelect = bSelect;
    },
    markerMouseMove: function() {

        if (this.public.map.bMouseDown || !this.bSiderSelect) {
            return;
        }
        var event = arguments[0] || window.event;
        var Pos = Util.getMousePosition(this.scaleBarDiv, event);
        Pos.x = 8;
        interval = parseInt(Pos.y / this.barGirdWidth - 0.5);
        if (interval == this.curScaleLevel)
            return;
        else {
            if (interval <= 0)
                interval = 0;
            if (interval >= this.scaleSum - 1)
                interval = this.scaleSum - 1;

            Pos.y = this.barGirdWidth * interval + 1;
            Util.modifyAlphaImageDiv(this.sliderBarDiv, null, Pos, null, null, "absolute");
            this.curScaleLevel = interval;
            if (Boolean(this.scalesMap[this.curScaleLevel])) {
                this.curScale = this.scalesMap[this.curScaleLevel];
                this.public.map.setCurrentScale(this.curScale, true);

            }
        }

        this.preventTransfer(event);

    },

    markerMouseOver: function() {
        if (this.public.map.bMouseDown) {
            return;
        }


        var event = arguments[0] || window.event;
        var markerEvent = document.all ? event.srcElement : event.target;
        if (markerEvent.id) {

            var marker = document.getElementById(markerEvent.id);
            if (marker) {
                if (Util.getBrowserName() == "msie")
                    marker.style.cursor = "hand";
                else {
                    marker.style.cursor = "pointer";
                }
            }
            if (markerEvent.id == "scalebar" || markerEvent.id == "tocountry" || markerEvent.id == "toprovince" || markerEvent.id == "tocity" || markerEvent.id == "tostreet") {

                this.displayTipBar("");
                window.clearTimeout(this.timeoutTipId);
                this.timeoutTipId = null;

            }
        } else {
            this.bSiderSelect = false;
        }



    },

    displayTipBar: function(bShow) {

        var country = document.getElementById("tocountry");
        if (country)
            country.style.display = bShow;

        var province = document.getElementById("toprovince");
        if (province)
            province.style.display = bShow;

        var city = document.getElementById("tocity");
        if (city)
            city.style.display = bShow;

        var street = document.getElementById("tostreet");
        if (street)
            street.style.display = bShow;

    },


    setCurScale: function(curScale) {
        if (this.curScale == curScale || !this.bScaleBarShow)
            return;

        for (var p in this.scalesMap) {
            scale = this.scalesMap[p];
            if (scale == curScale) {

                var Pos = new Generic.Pixel(8, 0);
                Pos.y = parseInt(this.barGirdWidth * (p)) + 1;
                Util.modifyAlphaImageDiv(this.sliderBarDiv, null, Pos, null, null, "absolute");
                this.curScaleLevel = parseInt(p);
                this.curScale = curScale;
                break;
            }

        }

    },

    preventTransfer: function(ev) {
        if (Util.getBrowserName() != "msie")
            ev.preventDefault();
        ev.cancelBubble = true;

    },
    CLASS_NAME: "Contrl"
});

Vml = Util.Class({

    xmlns: "urn:schemas-microsoft-com:vml",
    vectorDiv: null,
    public: null,
    vectorType: null,
    u1: 0.0,
    u2: 1.0,

    initialize: function(containerID) {

        var style = document.createStyleSheet();
        var shapes = ['shape', 'rect', 'oval', 'fill', 'stroke', 'imagedata', 'group', 'textbox'];
        for (var i = 0, len = shapes.length; i < len; i++) {
            style.addRule('v\\:' + shapes[i], "behavior: url(#default#VML); " + " position: absolute; display: inline-block;");
        }
        this.vectorDiv = containerID;
        this.vectorType = {};

    },
    addType: function(id, type) {
        this.vectorType[id] = type;
    },
    setPublic: function(public) {
        this.public = public;
    },
    createNode: function(type, id) {

        var node = document.createElement(type);
        if (id) {
            node.id = id;
        }
        node.unselectable = 'on';
        node.onselectstart = "return false";

        return node;
    },
    nodeFactory: function(id, type) {

        var node = Util.getElement(id);

        if (node) {

            if (!this.nodeTypeCompare(node, type)) {
                node.parentNode.removeChild(node);
                node = this.nodeFactory(id, type);
            }
        } else {
            node = this.createNode(type, id);
        }
        return node;
    },

    nodeTypeCompare: function(node, type) {
        var subType = type;
        var splitIndex = subType.indexOf(":");
        if (splitIndex != -1) {
            subType = subType.substr(splitIndex + 1);
        }
        var nodeName = node.nodeName;
        splitIndex = nodeName.indexOf(":");
        if (splitIndex != -1) {
            nodeName = nodeName.substr(splitIndex + 1);
        }

        return (subType == nodeName);
    },

    getNodeType: function(CLASS_NAME) {
        var nodeType = null;
        switch (CLASS_NAME) {
            case "Point":
                nodeType = "v:oval";
                break;
            case "Rectangle":
                nodeType = "v:rect";
                break;
            case "LineString":
            case "LinearRing":
            case "Line":
                nodeType = "v:shape ";
                break;
            default:
                break;
        }
        return nodeType;
    },
    setNodeDimension: function(node) {

        transform = this.public.transform;

        var left = transform.posViewleftTop.x;
        var top = transform.posViewleftTop.y;

        node.style.position = "absolute";
        node.style.left = left + "px";

        node.style.top = top + "px";

        node.style.width = transform.mapViewWidth + "px";
        node.style.height = transform.mapViewHeight + "px";

        node.coordorigin = transform.posViewleftTop.x + " " + transform.posViewleftTop.y;
        node.coordsize = transform.mapViewWidth + " " + transform.mapViewHeight;

    },
    setNodeDimension2: function(node) {


        var left = -10000;
        var top = -10000;
        node.style.position = "absolute";
        node.style.left = left + "px";
        node.style.top = top + "px";
        node.style.width = 0 + "px";
        node.style.height = 0 + "px";
        node.coordorigin = "-10000" + " " + "-10000";
        node.coordsize = "0" + " " + "0";

    },
    drawLine2: function(node, vector, closeLine) {

        this.setNodeDimension(node);
        var numComponents = vector.pntList.length;
        if (numComponents > 1) {
            var parts = new Array(numComponents);

            var comp, x, y;
            for (var i = 0; i < numComponents; i++) {
                comp = vector.pntList[i];
                pos = this.public.transform.WorldToClient2(comp.x, comp.y);
                x = pos.x;
                y = pos.y;

                parts[i] = " " + x + "," + y + " l ";

            }
            var end = (closeLine) ? " x e" : " e";
            node.path = "m" + parts.join("") + end;

            return node;
        } else {
            var end = (closeLine) ? " x e" : " e";
            node.path = "m 0,0 l 0,0" + end;
            return node;
        }

    },
    drawLine: function(node, vector, closeLine) {

        this.setNodeDimension(node);
        var viewBound = this.public.display.bound;

        var numComponents = vector.pntList.length;
        if (numComponents > 1) {
            var parts = new Array(numComponents);

            var comp, x, y;
            var nIndex = 0;
            for (var i = 0; i < numComponents - 1; i++) {
                comp = vector.pntList[i];

                var x1 = comp.x;
                var y1 = comp.y;
                var x2 = vector.pntList[i + 1].x;
                var y2 = vector.pntList[i + 1].y;

                var resultSets = this.clipLine(viewBound.left, viewBound.bottom, viewBound.right, viewBound.top, x1, y1, x2, y2);
                if (resultSets) {
                    pos = this.public.transform.WorldToClient2(resultSets[0], resultSets[1]);
                    x = pos.x;
                    y = pos.y;


                    parts[nIndex++] = " " + x + "," + y + " l ";


                    pos = this.public.transform.WorldToClient2(resultSets[2], resultSets[3]);
                    x = pos.x;
                    y = pos.y;

                    parts[nIndex++] = " " + x + "," + y + " l ";

                    resultSets.length = 0;
                }


            }

            var end = (closeLine) ? " x e" : " e";
            node.path = "m" + parts.join("") + end;
            return node;
        } else {
            var end = (closeLine) ? " x e" : " e";
            node.path = "m 0,0 l 0,0" + end;
            return node;
        }

    },
    drawPolygon: function(node, vector) {

        this.setNodeDimension(node);
        var numComponents = vector.pntList.length;
        if (numComponents > 1) {
            var parts = new Array(numComponents);

            var comp, x, y;
            for (var i = 0; i < numComponents; i++) {
                comp = vector.pntList[i];
                pos = this.public.transform.WorldToClient2(comp.x, comp.y);
                x = pos.x;
                y = pos.y;

                parts[i] = " " + x + "," + y + " l ";

            }
            var end = " x e";
            node.path = "m" + parts.join("") + end;
            return node;
        } else {
            var end = " x e";
            node.path = "m 0,0 l 0,0" + end;
            return node;
        }

    },
    addFeature: function(option) {

        var node = Util.getElement(option.id);

        if (node) {

            if (!this.nodeTypeCompare(node, option.type)) {
                node.parentNode.removeChild(node);
                node = this.nodeFactory(option.id, option.type);
            }
        } else {
            node = this.createNode(option.type, option.id);
            isFill = false;
            if (option.style == "polyline")
                isFill = false;
            else
                isFill = true;

            options = new Generic.VectorDis({
                isFilled: isFill,
                isStroked: true
            });

            this.setStyle(node, this.vectorType[option.index], options);
            this.vectorDiv.appendChild(node);

        }
    },

    drawCircle: function(node, vector) {

        var numComponents = vector.pntList.length;
        if (numComponents == 1) {

            comp = vector.pntList[0];
            pos = this.public.transform.WorldToClient2(comp.x, comp.y);
            var pointType = this.getTyple(vector.index);
            if (pointType.units == "pixel")

            {

                var radius = pointType.pointRadius;

                if (vector.length) {
                    radius = this.public.transform.getPixelWidth(vector.length);

                }

                node.style.left = pos.x - radius + "px";
                node.style.top = pos.y - radius + "px";
                var diameter = radius * 2;
                node.style.width = diameter + "px";
                node.style.height = diameter + "px";
                if (vector.scale) {

                    if (this.public.transform.getScale() <= vector.scale) {
                        node.style.display = "";
                    } else
                        node.style.display = "none";
                }
            }


        } else {
            node.style.left = 0 + "px";
            node.style.top = 0 + "px";
            node.style.width = 0 + "px";
            node.style.height = 0 + "px";
        }


        return node;

    },

    setStyle: function(node, style, options) {

        style = style || node._style;
        options = options || node._options;
        node._options = options;
        node._style = style;
        var fillColor = style.fillColor;
        if (options.isFilled) {
            node.fillcolor = fillColor;
        } else {
            node.filled = "false";
        }
        var fills = node.getElementsByTagName("fill");
        var fill = (fills.length == 0) ? null : fills[0];
        if (!options.isFilled) {
            if (fill) {
                node.removeChild(fill);
            }
        } else {
            if (!fill) {
                fill = this.createNode('v:fill', node.id + "_fill");
            }
            fill.opacity = style.fillOpacity;

            if (fill.parentNode != node) {
                node.appendChild(fill);
            }
        }
        var strokes = node.getElementsByTagName("stroke");
        var stroke = (strokes.length == 0) ? null : strokes[0];
        if (!options.isStroked) {
            node.stroked = false;
            if (stroke) {
                stroke.on = false;
            }
        } else {
            if (!stroke) {
                stroke = this.createNode('v:stroke', node.id + "_stroke");
                node.appendChild(stroke);

            }
            stroke.on = true;
            stroke.color = style.strokeColor;
            stroke.weight = style.strokeWidth + "px";
            stroke.opacity = style.strokeOpacity;
            stroke.endcap = style.strokeLinecap == 'butt' ? 'flat' :
                (style.strokeLinecap || 'round');
            if (style.strokeDashstyle) {
                stroke.dashstyle = this.dashStyle(style);
            }
        }

        if (style.cursor != "inherit" && style.cursor != null) {
            node.style.cursor = style.cursor;
        }

        return node;
    },

    dashStyle: function(style) {
        var dash = style.strokeDashstyle;
        switch (dash) {
            case 'solid':
            case 'dot':
            case 'dash':
            case 'dashdot':
            case 'longdash':
            case 'longdashdot':
                return dash;
            default:
                var parts = dash.split(/[ ,]/);
                if (parts.length == 2) {
                    if (1 * parts[0] >= 2 * parts[1]) {
                        return "longdash";
                    }
                    return (parts[0] == 1 || parts[1] == 1) ? "dot" : "dash";
                } else if (parts.length == 4) {
                    return (1 * parts[0] >= 2 * parts[1]) ? "longdashdot" :
                        "dashdot";
                }
                return "solid";
        }
    },

    postDraw: function(node) {
        node.style.visibility = "visible";
        var fillColor = node._style.fillColor;
        var strokeColor = node._style.strokeColor;
        if (fillColor == "none" &&
            node.fillcolor != fillColor) {
            node.fillcolor = fillColor;
        }
        if (strokeColor == "none" &&
            node.strokecolor != strokeColor) {
            node.strokecolor = strokeColor;
        }
    },
    drawRectangle2: function(node, vector) {

        var numComponents = vector.pntList.length;

        if (numComponents >= 2) {
            var comp, x, y;
            comp = vector.pntList[0];
            postop = this.public.transform.WorldToClient2(comp.x, comp.y);

            comp = vector.pntList[1];
            posbottom = this.public.transform.WorldToClient2(comp.x, comp.y);

            node.style.left = postop.x + "px";
            node.style.top = postop.y + "px";
            width = Math.abs(postop.x - posbottom.x);
            node.style.width = width + "px";
            height = Math.abs(postop.y - posbottom.y);
            node.style.height = height + "px";

        } else {
            node.style.left = 0 + "px";
            node.style.top = 0 + "px";
            node.style.width = "0px";
            node.style.height = "0px";
        }

        return node;
    },

    getTyple: function(index) {
        return this.vectorType[index];
    },
    drawRectangle: function(node, vector) {

        var numComponents = vector.pntList.length;
        if (numComponents >= 2) {
            tempPnt = new Generic.CPoint(0, 0);
            tempvector = new Generic.Vector();

            var comp, x, y;
            leftTop = vector.pntList[0];
            rightBottom = vector.pntList[1];
            tempvector.pntList.push(leftTop.clone());
            tempPnt.x = rightBottom.x;
            tempPnt.y = leftTop.y;
            tempvector.pntList.push(tempPnt.clone());
            tempvector.pntList.push(rightBottom.clone());
            tempPnt.x = leftTop.x;
            tempPnt.y = rightBottom.y;
            tempvector.pntList.push(tempPnt.clone());
            this.drawLine(node, tempvector, true);


        } else
            this.drawLine(node, vector, false);

        return node;
    },

    clipTest: function(p, q) {
        var flag = 1;
        var r;

        if (p < 0.0) {
            r = q / p;
            if (r > this.u2) {
                flag = 0;
            } else if (r > this.u1) {
                this.u1 = r;
            }

        } else if (p > 0.0) {
            r = q / p;
            if (r < this.u1) {
                flag = 0;
            } else if (r < this.u2) {
                this.u2 = r;
            }

        } else if (q < 0.0) {
            flag = 0;
        }

        return (flag);
    },
    clipLine: function(xwmin, ywmin, xwmax, ywmax, x1, y1, x2, y2) {
        this.u1 = 0.0;
        this.u2 = 1.0;
        var dx = x2 - x1;
        var dy = 0.0;

        if (this.clipTest(-dx, x1 - xwmin, this.u1, this.u2)) {
            if (this.clipTest(dx, xwmax - x1, this.u1, this.u2)) {
                dy = y2 - y1;
                if (this.clipTest(-dy, y1 - ywmin, this.u1, this.u2)) {
                    if (this.clipTest(dy, ywmax - y1, this.u1, this.u2)) {
                        if (this.u2 < 1.0) {
                            x2 = x1 + this.u2 * dx;
                            y2 = y1 + this.u2 * dy;
                        }
                        if (this.u1 > 0.0) {
                            x1 = x1 + this.u1 * dx;
                            y1 = y1 + this.u1 * dy;
                        }

                        return [x1, y1, x2, y2];

                    }

                }

            }

        }
        return false;

    },

    CLASS_NAME: "Vml"
});

Svg = Util.Class({

    xmlns: "http://www.w3.org/2000/svg",
    xlinkns: "http://www.w3.org/1999/xlink",
    MAX_PIXEL: 15000,
    translationParameters: null,
    symbolMetrics: null,
    isGecko: null,
    supportUse: null,
    vectorDiv: null,
    public: null,
    vectorType: null,
    rendererRoot: null,
    root: null,
    vectorRoot: null,
    textRoot: null,

    initialize: function(containerID) {
        if (!this.supported()) {

            return;
        }
        this.vectorDiv = containerID;
        this.translationParameters = {
            x: 0,
            y: 0
        };
        this.supportUse = (navigator.userAgent.toLowerCase().indexOf("applewebkit/5") == -1);
        this.isGecko = (navigator.userAgent.toLowerCase().indexOf("gecko/") != -1);

        this.rendererRoot = this.createRenderRoot();
        this.root = this.createRoot("_root");
        this.vectorRoot = this.createRoot("_vroot");
        this.textRoot = this.createRoot("_troot");

        this.root.appendChild(this.vectorRoot);
        this.root.appendChild(this.textRoot);

        this.rendererRoot.appendChild(this.root);
        this.vectorDiv.appendChild(this.rendererRoot);
        this.vectorType = {};
    },

    createRenderRoot: function() {
        return this.nodeFactory(this.vectorDiv.id + "_svgRoot", "svg");
    },
    addType: function(id, type) {
        this.vectorType[id] = type;
    },
    setPublic: function(public) {
        this.public = public;
    },

    supported: function() {
        var svgFeature = "http://www.w3.org/TR/SVG11/feature#";
        return (document.implementation &&
            (document.implementation.hasFeature("org.w3c.svg", "1.0") ||
                document.implementation.hasFeature(svgFeature + "SVG", "1.1") ||
                document.implementation.hasFeature(svgFeature + "BasicStructure", "1.1")));
    },


    inValidRange: function(x, y, xyOnly) {
        var left = x + (xyOnly ? 0 : this.translationParameters.x);
        var top = y + (xyOnly ? 0 : this.translationParameters.y);
        return (left >= -this.MAX_PIXEL && left <= this.MAX_PIXEL &&
            top >= -this.MAX_PIXEL && top <= this.MAX_PIXEL);
    },

    createRoot: function(suffix) {
        return this.nodeFactory(this.vectorDiv.id + suffix, "g");
    },

    setNodeDimension: function(node) {
        return true;
    },
    setNodeDimension2: function(node) {
        return true;
    },
    setExtent: function(node) {
        transform = this.public.transform;

        var extentString = transform.posViewleftTop.x + " " + transform.posViewleftTop.y + " " + transform.mapViewWidth + " " + transform.mapViewHeight;

        this.rendererRoot.style.position = "absolute";
        this.rendererRoot.style.top = transform.posViewleftTop.y + "px";
        this.rendererRoot.style.left = transform.posViewleftTop.x + "px";
        this.rendererRoot.style.width = transform.mapViewWidth + "px";
        this.rendererRoot.style.height = transform.mapViewHeight + "px";

        this.rendererRoot.setAttributeNS(null, "x", transform.mapViewWidth);
        this.rendererRoot.setAttributeNS(null, "y", transform.mapViewHeight);

        this.rendererRoot.setAttributeNS(null, "viewBox", extentString);
        return true;

    },
    getNodeType: function(geometry, style) {
        var nodeType = null;
        switch (CLASS_NAME) {
            case "Point":
                nodeType = "circle";
                break;
            case "Rectangle":
                nodeType = "rect";
                break;
            case "LineString":
                nodeType = "polyline";
                break;
            case "LinearRing":
                nodeType = "polygon";
                break;
            case "Polygon":
            case "Curve":
            case "Surface":
                nodeType = "path";
                break;
            default:
                break;
        }
        return nodeType;
    },


    setStyle: function(node, style, options) {

        style = style || node._style;
        options = options || node._options;
        node._options = options;
        node._style = style;
        var r = parseFloat(node.getAttributeNS(null, "r"));
        var widthFactor = 1;
        var pos;
        if (node._geometryClass == "Point" && r) {
            node.style.visibility = "";
            if (style.graphic === false) {
                node.style.visibility = "hidden";
            } else {
                node.setAttributeNS(null, "r", style.pointRadius);
            }
        }

        if (options.isFilled) {
            node.setAttributeNS(null, "fill", style.fillColor);
            node.setAttributeNS(null, "fill-opacity", style.fillOpacity);
        } else {
            node.setAttributeNS(null, "fill", "none");
        }

        if (options.isStroked) {
            node.setAttributeNS(null, "stroke", style.strokeColor);
            node.setAttributeNS(null, "stroke-opacity", style.strokeOpacity);
            node.setAttributeNS(null, "stroke-width", style.strokeWidth * widthFactor);
            node.setAttributeNS(null, "stroke-linecap", style.strokeLinecap || "round");
            node.setAttributeNS(null, "stroke-linejoin", "round");
            style.strokeDashstyle && node.setAttributeNS(null,
                "stroke-dasharray", this.dashStyle(style, widthFactor));
        } else {
            node.setAttributeNS(null, "stroke", "none");
        }

        if (style.pointerEvents) {
            node.setAttributeNS(null, "pointer-events", style.pointerEvents);
        }

        if (style.cursor != null) {
            node.setAttributeNS(null, "cursor", style.cursor);
        }

        return node;
    },

    dashStyle: function(style, widthFactor) {
        var w = style.strokeWidth * widthFactor;
        var str = style.strokeDashstyle;
        switch (str) {
            case 'solid':
                return 'none';
            case 'dot':
                return [1, 4 * w].join();
            case 'dash':
                return [4 * w, 4 * w].join();
            case 'dashdot':
                return [4 * w, 4 * w, 1, 4 * w].join();
            case 'longdash':
                return [8 * w, 4 * w].join();
            case 'longdashdot':
                return [8 * w, 4 * w, 1, 4 * w].join();
            default:
                return OpenLayers.String.trim(str).replace(/\s+/g, ",");
        }
    },

    createNode: function(type, id) {
        var node = document.createElementNS(this.xmlns, type);
        if (id) {
            node.setAttributeNS(null, "id", id);
        }
        return node;
    },


    nodeTypeCompare: function(node, type) {
        return (type == node.nodeName);
    },

    getComponentsString: function(components, separator, bArea) {
        var renderCmp = [];
        var complete = true;
        var len = components.length;
        var strings = [];
        var str, component;
        if (len == 0)
            return {
                path: "0,0",
                complete: complete
            }
        else {
            for (var i = 0; i < len; i++) {
                component = components[i];
                renderCmp.push(component);
                str = this.getShortString(component);
                if (str) {
                    strings.push(str);
                }
            }
            if (bArea) {
                component = components[0];
                str = this.getShortString(component);
                if (str) {
                    strings.push(str);
                }

            }

            return {
                path: strings.join(separator || ","),
                complete: complete
            };
        }

    },

    drawCircle: function(node, vector) {


        var numComponents = vector.pntList.length;

        if (numComponents == 1) {

            comp = vector.pntList[0];
            pos = this.public.transform.WorldToClient2(comp.x, comp.y);
            var pointType = this.getTyple(vector.index);
            if (pointType.units == "pixel")

            {
                var radius = pointType.pointRadius;

                if (vector.length) {
                    radius = this.public.transform.getPixelWidth(vector.length);
                }
                var x = pos.x + "px";
                var y = pos.y + "px";
                var diameter = radius;
                node.setAttributeNS(null, "cx", x);
                node.setAttributeNS(null, "cy", y);
                node.setAttributeNS(null, "r", diameter);

            }

        } else {
            node.setAttributeNS(null, "cx", 0);
            node.setAttributeNS(null, "cy", 0);
            node.setAttributeNS(null, "r", 0);
        }
        return node;

    },

    drawLine: function(node, vector) {

        var componentsResult = this.getComponentsString(vector.pntList);
        if (componentsResult.path) {
            node.setAttributeNS(null, "points", componentsResult.path);
            return (componentsResult.complete ? node : null);
        } else {
            return false;
        }
    },
    drawPolygon: function(node, vector) {

        var componentsResult = this.getComponentsString(vector.pntList, null, true);
        if (componentsResult.path) {
            node.setAttributeNS(null, "points", componentsResult.path);
            return (componentsResult.complete ? node : null);
        } else {
            return false;
        }
    },

    drawLinearRing: function(node, vector) {
        var componentsResult = this.getComponentsString(vector.pntList);
        if (componentsResult.path) {
            node.setAttributeNS(null, "points", componentsResult.path);
            return (componentsResult.complete ? node : null);
        } else {
            return false;
        }
    },


    drawRectangle2: function(node, vector) {

        var numComponents = vector.pntList.length;

        if (numComponents >= 2) {

            var comp, x, y;
            comp = vector.pntList[0];
            postop = this.public.transform.WorldToClient2(comp.x, comp.y);

            comp = vector.pntList[1];
            posbottom = this.public.transform.WorldToClient2(comp.x, comp.y);

            width = Math.abs(postop.x - posbottom.x);
            height = Math.abs(postop.y - posbottom.y);

            node.setAttributeNS(null, "x", postop.x);
            node.setAttributeNS(null, "y", postop.y);
            node.setAttributeNS(null, "width", width);
            node.setAttributeNS(null, "height", height);

            return node;
        } else {
            node.setAttributeNS(null, "x", 0);
            node.setAttributeNS(null, "y", 0);
            node.setAttributeNS(null, "width", 0);
            node.setAttributeNS(null, "height", 0);
        }

        return node;

    },
    drawRectangle: function(node, vector) {

        var numComponents = vector.pntList.length;
        if (numComponents >= 2) {

            var comp, x, y;
            leftTop = vector.pntList[0];
            rightBottom = vector.pntList[1];

            tempPnt = new Generic.CPoint(0, 0);
            tempvector = new Generic.Vector();

            var comp, x, y;
            leftTop = vector.pntList[0];
            rightBottom = vector.pntList[1];
            tempvector.pntList.push(leftTop.clone());
            tempPnt.x = rightBottom.x;
            tempPnt.y = leftTop.y;
            tempvector.pntList.push(tempPnt.clone());
            tempvector.pntList.push(rightBottom.clone());
            tempPnt.x = leftTop.x;
            tempPnt.y = rightBottom.y;
            tempvector.pntList.push(tempPnt.clone());
            tempvector.pntList.push(leftTop.clone());

            this.drawLine(node, tempvector);
        } else
            this.drawLine(node, vector);

        return node;

    },

    addFeature: function(option) {
        var node = Util.getElement(option.id);

        if (node) {

            if (!this.nodeTypeCompare(node, option.type)) {
                node.parentNode.removeChild(node);
                node = this.nodeFactory(option.id, option.type);
            }
        } else {

            node = this.createNode(option.type, option.id);
            isFill = false;
            node.name = option.name;
            if (option.style == "polyline")
                isFill = false;
            else
                isFill = true;

            options = new Generic.VectorDis({
                isFilled: isFill,
                isStroked: true
            });
            this.setStyle(node, this.vectorType[option.index], options);
            this.root.appendChild(node);

        }
    },



    nodeFactory: function(id, type) {

        var node = Util.getElement(id);

        if (node) {

            if (!this.nodeTypeCompare(node, type)) {
                node.parentNode.removeChild(node);
                node = this.nodeFactory(id, type);
            }
        } else {
            node = this.createNode(type, id);
        }
        return node;
    },


    clipLine: function(badComponent, goodComponent) {
        if (goodComponent.equals(badComponent)) {
            return "";
        }
        var resolution = this.getResolution();
        var maxX = this.MAX_PIXEL - this.translationParameters.x;
        var maxY = this.MAX_PIXEL - this.translationParameters.y;

        pos1 = this.public.transform.WorldToClient2(goodComponent.x, goodComponent.y);
        var x1 = pos1.x;
        var y1 = pos1.y;
        pos2 = this.public.transform.WorldToClient2(badComponent.x, badComponent.y);
        var x2 = pos2.x;
        var y2 = pos2.y;
        var k;
        if (x2 < -maxX || x2 > maxX) {
            k = (y2 - y1) / (x2 - x1);
            x2 = x2 < 0 ? -maxX : maxX;
            y2 = y1 + (x2 - x1) * k;
        }
        if (y2 < -maxY || y2 > maxY) {
            k = (x2 - x1) / (y2 - y1);
            y2 = y2 < 0 ? -maxY : maxY;
            x2 = x1 + (y2 - y1) * k;
        }
        return x2 + "," + y2;
    },


    getShortString: function(point) {
        pos = this.public.transform.WorldToClient2(point.x, point.y);
        x = pos.x;
        y = pos.y;
        return x + "," + y;

    },

    getPosition: function(node) {
        return ({
            x: parseFloat(node.getAttributeNS(null, "cx")),
            y: parseFloat(node.getAttributeNS(null, "cy"))
        });
    },


    getFeatureIdFromEvent: function(evt) {


    },
    getTyple: function(index) {
        return this.vectorType[index];
    },

    CLASS_NAME: "SVG"
});


Svg.LABEL_ALIGN = {
    "l": "start",
    "r": "end",
    "b": "bottom",
    "t": "hanging"
};


Svg.LABEL_VSHIFT = {

    "t": "-70%",
    "b": "0"
};