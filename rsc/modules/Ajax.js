/**
 * @module Ajax
 * @description AJAX module for AJAX stuff
 * @version 1.0
 * @since 1.1
 * @license MIT
 * @author Maximilian Berkmann <maxieberkmann@gmail.com>
 * @copyright Maximilian Berkmann 2016
 * @requires module:essence
 * @type {Module}
 * @exports Ajax
 */
var Ajax = new Module("Ajax", "AJAX stuff");

/**
 * @description XHR manipulation callback
 * @callback XhrCallback
 * @param {XMLHttpRequest} XHR object
 */

/**
 * @description HTTP GET request, it retrieves data. Equivalent to:
 * var val;
 * parseURL(<code>name</code>, function (x) {val = x}); //as using return x won't return anything
 * @param {string} name Name of the key
 * @returns {string} Value of the key
 * @since 1.0
 * @func
 */
function GET (name) {
    //noinspection JSValidateTypes
    if ((new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)").exec(location.search))) return decodeURIComponent((new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)").exec(location.search))[1]);
}

/**
 * @description HTTP POST request. Create data..<br />
 * Source: Stackoverflow
 * @param {string} path Path of the file to post to
 * @param {Object} params Parameters
 * @returns {undefined}
 * @since 1.0
 * @func
 */
function POST (path, params) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", path);

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);
            form.appendChild(hiddenField);
        }
    }
    document.body.appendChild(form);
    form.submit()
}

/**
 * @description HTTP PUT request. Update/replace data.
 * @returns {undefined}
 * @todo Fill it
 * @since 1.0
 * @func
 */
function PUT () {

}

/**
 * @description HTTP DELETE request. Delete data
 * @returns {undefined}
 * @todo Fill it
 * @since 1.0
 * @func
 */
function DELETE () {

}

/* eslint no-undef: 0 */
/**
 * @description Load a document/file using AJAX
 * @param {string} url URL
 * @param {XhrCallback} cb What to do when the document/file is loaded
 * @returns {undefined}
 * @since 1.0
 * @func
 * @example
 * function showLogs () {
 *   load("logs.log", function (xhr) {
 *      $e("#logView").write(xhr.responseText);
 *   }
 * }
 */
function load (url, cb) {
    var xhr = new XHR(url, "get", true, cb);
    xhr.init();
}

/**
 * @description Load a JSON file
 * @param {string} [file="data"] Filename (without the '.json' bit)
 * @func
 * @since 1.1
 * @returns {*} JSON data
 * @example
 * loadJSON("package"); //Loads the package.json file which content can be found in $G["json"] if not returned
 * //Equivalent of doing that
 * var package = {};
 * load("package.json", function (xhr) {
 *  package = JSON.parse(xhr.response); //Returning that won't do anything so we need to store it in a variable
 * });
 */
function loadJSON (file) {
    var xhr = window.XMLHttpRequest? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");
    xhr.overrideMimeType("application/json");
    xhr.open("GET", (file || "data") + ".json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) (function () {
            $G["json"] = JSON.parse(xhr.responseText);
            return JSON.parse(xhr.responseText) || $G["json"];
        })();
    };
    xhr.send(null);
    //console.log("res=", xhr.response, "\nresTxt=", xhr.responseText, "\nresXML=", xhr.responseXML, "\nresT=", xhr.responseType);
    try {
        return JSON.parse(xhr.response);
    } catch (e) {
        return $G["json"];
    }
}

/**
 * @description XML HTTP Request
 * @param {string} [url=location.href] URL
 * @param {string} [method="GET"] HTTP Method
 * @param {boolean} [async=false] Asynchronicity
 * @param {XhrCallback} [success] Success handler
 * @param {XhrCallback} [fail] Failure handler
 * @param {XhrCallback} [progress] Loading/progress handler
 * @param {string[]} [creds=["", ""]] Credentials (username, password)
 * @param {string} [mime] MIME type
 * @param {string} [body] Body of the request
 * @returns {XHR} XHR object
 * @since 1.1
 * @constructor
 * @property {string} XHR.url URL
 * @property {string} XHR.method Method
 * @property {*} XHR.response Response
 * @property {string[]} XHR.credentials Credentials
 * @property {boolean} XHR.async Asynchronousness
 * @property {XMLHttpRequest|ActiveXObject} XHR.req XHR/AXO request
 * @property {boolean} XHR.forIE Is the request only for MS IE
 * @property {string} XHR.state State (message of the ready-stateness of the request)
 * @property {number} XHR.status HTTP status
 * @property {Function} XHR.req.onreadystatechange State change handler
 * @property {Function} XHR.onChange State change handler
 * @property {function((XMLHttpRequest|ActiveXObject))} XHR.onSuccess Success handler
 * @property {function((XMLHttpRequest|ActiveXObject))} XHR.onFailure Failure handler
 * @property {function((XMLHttpRequest|ActiveXObject))} XHR.onLoad Progress handler
 * @property {Function} XHR.handleResponse Response listener
 * @property {function(?Array[])} XHR.init XHR initialiser
 * @property {function(...?string): *} XHR.header Header manager
 * @property {function(): string} XHR.toString String representation
 * @property {string} XHR.body Body of the request
 * @property {function(?string)} XHR.viewResponse Interpret the (X)HTML response
 * @this {XHR}
 */
function XHR (url, method, async, success, fail, progress, body, creds, mime) {
    this.url = url || location.href;
    this.method = method || "GET";
    this.response = null;
    this.credentials = creds || ["", ""]; //Username, password
    this.async = async || false;
    this.req = window.XMLHttpRequest? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");
    this.forIE = !window.XMLHttpRequest;
    this.state = getXHRMsg(0);
    this.status = this.req.status;
    this.body = body || "";
    var self = this;
    /**
     * @listens XHR.req.readyState
     */
    this.req.onreadystatechange = function () {
        self.state = getXHRMsg(self.req.readyState);
        self.handleResponse();
        /** @this {XMLHttpRequest} */
        if (self.status != this.status) self.status = this.status;
        if (this.readyState === 4 && (this.status === 200 || this.status === 204)) self.onSuccess(this);
        else if (this.readyState === 3) self.onLoad(this);
        else if (this.status >= 400 && this.status <= 505) self.onFailure(this);
    };
    this.onChange = this.req.onreadystatechange;
    this.onSuccess = success || function () {
        /** @this {XHR} */
        this.handleResponse();
        console.log("%c[XHR] %s%c:\n%s", "color: #0f0", this.status + " " + getHTTPMsg(this.status), "color: #000;", this.response);
    };
    this.onFailure = fail || function () {
        /** @this {XHR} */
        this.handleResponse();
        console.log("%c[XHR] %s%c:\n%s", "color: #f00", this.status + " " + getHTTPMsg(this.status), "color: #000;", this.response);
    };
    this.onLoad = progress || function () {
        /** @this {XHR} */
        this.handleResponse();
        console.log("%c[XHR] %s%c:\n%s", "color: #666", this.state, "color: #000;", this.status + " " + getHTTPMsg(this.status));
    };
    this.req.onload = function () {
        /** @this {XMLHttpRequest} */
        console.info("%c[XHR]%c Loading the %s request to %s", "color: #666;", "color: #000;", self.method, self.url);
    };
    this.req.onerror = function () {
        console.error("%c[XHR]%c There was an error in the request !", "color: #f00", "color: #000");
    };
    /**
     * @listens XHR.req.responseType
     */
    this.handleResponse = function () {
        switch (this.req.responseType) {
            case "":
            case "text": this.response = this.req.responseText;
                break;
            case "json": this.response = this.req.responseXML; break;
            default: this.response = this.req.response; //arrayBuffer and document
        }
    };
    this.init = function (reqHeaders) {
        if (mime) this.req.overrideMimeType(mime);
        this.req.open(this.method, this.url, this.async, this.credentials[0], this.credentials[1]);
        this.header("Access-Control-Allow-Origin", getDirectoryPath(this.url) + ", " + getDirectoryPath());
        var methods = [this.method];
        if (this.method != "GET") methods.push("GET");
        if (this.method != "POST") methods.push("POST");
        this.header("Access-Control-Allow-Methods", methods.toStr(true));
        //this.header("Access-Control-Expose-Headers", ", , "); //Already exposed: Cache-Control, Content-Language, Content-Type, Expires, Last-Modified, Pragma
        this.header("Access-Control-Allow-Max-Age", "1728000");
        if (this.credentials[0] != "" && this.credentials[1] != "") {
            this.req.withCredentials = true;
            this.header("Access-Control-Allow-Credentials", "true");
        }
        if (this.method === "POST" || this.method === "DELETE") this.header("Body", this.body);
        this.onChange();
        if (reqHeaders) reqHeaders.map(function (i) {
            self.header(i[0], i[1]);
        });

        this.req.send(isNon(this.body)? this.response: this.body);
    };
    this.header = function (name, val) {
        if (!val) return name? this.req.getResponseHeader(name): this.req.getAllResponseHeaders();
        else this.req.setRequestHeader(name, val);
    };

    this.toString = function () {
        return "XHR(url='" + this.url + "', method='" + this.method + "', response='" + this.response + "', credentials=" + this.credentials + ", async=" + this.async + ", state='" + this.state + "', status=" + this.status + ", forIE=" + this.forIE + ", body='" + this.body + "')";
    };

    this.viewResponse = function (id) {
        this.handleResponse();
        $e(id? "#" + id: "body").write(this.response, true);
    };

    return this;
}

/**
 * @description Cross Origin Resource Sharing request
 * @param {string} [url=getDirectoryPath()] URL
 * @param {string} [method="GET"] HTTP Method
 * @param {boolean} [async=true] Asynchronicity
 * @param {XhrCallback} [success] Success handler
 * @param {XhrCallback} [fail] Failure handler
 * @param {XhrCallback} [progress] Loading/progress handler
 * @param {string[]} [creds=["", ""]] Credentials (username, password)
 * @param {string} [mime] MIME type
 * @param {string} [body] Body of the request
 * @returns {CORS} CORS object
 * @since 1.1
 * @inheritdoc
 * @see module:Ajax~XHR
 * @constructor
 * @property {string} CORS.url URL
 * @property {string} CORS.method Method
 * @property {*} CORS.response Response
 * @property {XHR} CORS.xhr XH/AXO request
 * @property {boolean} CORS.forIE Is the request only for MS IE
 * @property {Function} CORS.init CORS initializer
 * @property {function(): string} CORS.toString String representation
 * @property {Function} CORS.update Update the object's fields
 * @property {Function} CORS.silence Ignore all XHR's request errors
 * @this {CORS}
 */
function CORS (url, method, async, success, fail, progress, body, creds, mime) {
    var self = this;
    this.xhr = new XHR(url, method, async || true, success || function () {
            /** @this {XHR} */
            this.handleResponse();
            self.update();
            console.log("%c[CORS] %s%c:\n%s", "color: #0f0", this.status + " " + getHTTPMsg(this.status), "color: #000;", this.response);
        }, fail || function () {
            /** @this {XHR} */
            this.handleResponse();
            self.update();
            console.log("%c[CORS] %s%c:\n%s", "color: #f00", this.status + " " + getHTTPMsg(this.status), "color: #000;", this.response);
        }, progress || function () {
            /** @this {XHR} */
            this.handleResponse();
            self.update();
            console.log("%c[CORS] %s%c:\n%s", "color: #666", this.status + " " + getHTTPMsg(this.status), "color: #000;", this.response);
        }, body, creds, mime);
    try {
        //noinspection JSUnresolvedVariable
        if (!("withCredentials" in this.xhr.req) && typeof XDomainRequest != "undefined") this.xhr.req = new XDomainRequest();
    } catch (e) {}
    this.init = function () {
        this.xhr.init([["Access-Control-Request-Headers", "X-Custom-Header"],
            ["Access-Control-Allow-Headers", "Cache-Control, Content-Language, Content-Type, Expires, Last-Modified, Pragma, Body, Origin, X-Custom-Headers, X-PINGOTHER"],
            ["Access-Control-Expose-Headers", "X-Custom-Header"]
        ]);
        this.update();
    };
    this.response = this.xhr.response;
    this.url = this.xhr.url;
    this.method = this.xhr.method;
    this.body = body || "";
    //noinspection JSUnresolvedVariable
    this.forIE = typeof XDomainRequest != "undefined";
    this.toString = function () {
        return "CORS(url="+ this.url + ", method=" + this.method + ", body=" + this.body + ", forIE=" + this.forIE + ", response=" + this.response + ", xhr=" + this.xhr.toString() + ")";
    };
    this.update = function () {
        this.xhr.handleResponse();
        this.response = this.xhr.response;
        this.url = this.xhr.url;
        this.method = this.xhr.method;
        if (isNon(this.body)) this.body = this.xhr.body;
    };
    this.silence = function () {
        this.xhr.req.onerror = $f;
    };

    return this;
}

/**
 * @description AJAX post
 * @param {*} data Data to send
 * @param {string} to Receiving URL
 * @param {boolean} xml XML/Text flag
 * @returns {Code} Response
 * @since 1.0
 * @func
 */
function AJAXpost (data, to, xml) {
    var xhr = window.XMLHttpRequest? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP"), res = "";
    xhr.onreadystatechange = function () {
        //Request complete and HTTP OK response
        if (xhr.readyState === 4 && xhr.status === 200) res = xml? xhr.responseXML: xhr.responseText;
    };
    xhr.open("POST", to, true);
    if (xml) {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(data);
    } else {
        xhr.setRequestHeader("Content-Type", "text/plain");
        xhr.send(data);
    }
    return res
}

/* eslint no-undef: 2 */
/**
 * @description HTPP status message
 * @param {number} status HTTP status (e.g: xhr.status)
 * @returns {string} Status message
 * @since 1.0
 * @func
 */
function getHTTPMsg (status) {
    switch (status) {
        //Information
        case 100: return "Continue";
        case 101: return "Switching Protocols";
        //Success
        case 200: return "OK";
        case 201: return "Created";
        case 202: return "Accepted";
        case 203: return "Non-Authoriative Information";
        case 204: return "No Content";
        case 205: return "Reset Content";
        case 206: return "Partial Content";
        //Redirection
        case 300: return "Multiple Choices";
        case 301: return "Moved Permanently";
        case 302: return "Found";
        case 303: return "See Other";
        case 304: return "Not Modified";
        case 305: return "Use Proxy";
        case 306: return "Unused";
        case 307: return "Temporary Redirect";
        //Client error
        case 400: return "Bad Request";
        case 401: return "Unauthorized";
        case 402: return "Payment Required";
        case 403: return "Forbidden";
        case 404: return "Not Found";
        case 405: return "Method Not Allowed";
        case 406: return "Not Acceptable";
        case 407: return "Proxy Authentification Required";
        case 408: return "Request Timeout";
        case 409: return "Conflict";
        case 410: return "Gone";
        case 411: return "Length Required";
        case 412: return "Precondition Failed";
        case 413: return "Request Entity Too Large";
        case 414: return "Request-url Too Long";
        case 415: return "Bad Request";
        case 416: return "Unsupported Media Type";
        case 417: return "Expectation Failed";
        //Server error
        case 500: return "Internal Server Error";
        case 501: return "Not Implemented";
        case 502: return "Bad Gateway";
        case 503: return "Service Unavailable";
        case 504: return "Gateway Timeout";
        case 505: return "HTTP Version Not Supported";
        default: return "Unknown status"
    }
}

/**
 * @description Xml HTTP Request ready-state message
 * @param {number} state XHR ready-state code
 * @returns {string} XHR message
 */
function getXHRMsg (state) {
    /* readyStates
     0 (UNSENT): request not initialized
     1 (OPENED): server connection established
     2 (HEADERS_RECEIVED): request received
     3 (LOADING): processing request
     4 (DONE): request finished and response is ready
     */
    return ["UNSENT", "OPENED", "HEADERS_RECEIVED", "LOADING", "DONE"][state];
}

/**
 * @description Cross Origin Resource Sharing request maker.<br />
 * Source: {@link https://stackoverflow.com/questions/3076414/ways-to-circumvent-the-same-origin-policy}
 * @param {string} [method="get"] Method
 * @param {string} [url=getDirectoryPath()] URL
 * @returns {XMLHttpRequest} CORS request
 * @example
 * var request = createCORSRequest("get", "http://www.stackoverflow.com/");
 if (request) {
    request.onload = function () {
        //...
    };
    request.onreadystatechange = handler;
    request.send();
 }
 * @since 1.1
 * @func
 * @see module:Ajax~setCORS
 */
function createCORSRequest (method, url) {
    var xhr = window.XMLHttpRequest? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");
    if ("withCredentials" in xhr || xhr.withCredentials !== undefined) xhr.open(method || "get", url || getDirectoryPath(), true);
    else if (typeof XDomainRequest != "undefined" || XDomainRequest) { //IE
        xhr = new XDomainRequest();
        xhr.open(method || "GET", url || getDirectoryPath());
    } else xhr = null;
    return xhr;
}

/**
 * @description Set up a Cross Origin Resource Sharing request
 * @param {string} [url=getDirectoryPath()] URL where CORS is going to be allowed
 * @param {string} [method="GET"] HTTP method
 * @param {boolean} [xml=false] Expect an XML response
 * @param {boolean} [withCreds=false] Add credentials
 * @param {Code} [body] Body of the request
 * @returns {*} CORS response
 * @see module:Ajax~createCORSRequest
 * @since 1.1
 * @func
 * @throws {Error} CORS not supported
 */
function setCORS (url, method, xml, withCreds, body) {
    var res = null, req = createCORSRequest(method, url || getDirectoryPath());
    if (!req) throw new Error("CORS not supported.");
    //from http://www.html5rocks.com/en/tutorials/cors/
    if (withCreds) {
        req.withCredentials = true;
        req.setRequestHeader("Access-Control-Allow-Credentials", "true");
    }
    req.setRequestHeader("Access-Control-Allow-Origin", getDirectoryPath());
    req.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    req.setRequestHeader("Access-Control-Allow-Headers", "Cache-Control, Content-Language, Content-Type, Expires, Last-Modified, Pragma, Body, Origin");
    req.setRequestHeader("Access-Control-Request-Headers", "X-Custom-Header");
    req.setRequestHeader("Access-Control-Allow-Max-Age", "1728000");
    req.onload = function () {
        res = xml? req.responseXML: req.responseText;
    };
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) res = xml? req.responseXML: req.responseText;
    };
    req.onerror = function () {
        Essence.say("There was an error in the CORS request", "erro");
    };
    //Access-Control-Allow-Origin needed
    //Access-Control-Expose-Headers : X-Custom-Header;(optional) so more than the default ones: Cache-Control, Content-Language, Content-Type, Expires, Last-Modified, Pragma
    //Access-Control-Max-Age (optional)

    /*req.setRequestHeader("Access-Control-Allow-Origin", url || getDirectoryPath());
     req.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS"); //Or ["POST", ...]
     //req.setRequestHeader("Access-Control-Allow-Headers", "X-PINGOTHER"); //Or *
     req.setRequestHeader("X-PING", "*");
     req.setRequestHeader("Access-Control-Allow-Max-Age", "1728000");
     if (req) {
     req.onload = function() {
     Essence.say("Setting a CORS request...");
     };
     req.onreadystatechange = function () {
     if (req.readyState === 4 && req.status === 200) res = xml? req.responseXML: req.responseText;
     };
     req.send();
     }*/

    body? req.send(body): req.send();

    return res;
}