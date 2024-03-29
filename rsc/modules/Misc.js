/**
 * @module Misc
 * @description Miscellaneous stuff
 * @version 1.0
 * @since 1.1
 * @license MIT
 * @author Maximilian Berkmann <maxieberkmann@gmail.com>
 * @copyright Maximilian Berkmann 2016
 * @requires essence
 * @requires Files
 * @type {Module}
 * @exports Misc
 */
var Misc = new Module("Misc", "Miscellaneous", ["Files"]);

/* eslint no-undef: 0 */
/**
 * @description ASCII table
 * @param {NumberLike} [start=0] Starting decimal code
 * @param {number} [end=255] Ending decimal code
 * @returns {Array} ASCII table
 * @since 1.0
 * @func
 */
function asciiTable (start, end) {
    if (start === "A-Z" && !end) {
        start = 65;
        end = 90;
    } else if (start === "a-z" && !end) {
        start = 97;
        end = 122;
    } else if (start === "A-z" && !end) {
        start = 65;
        end = 122;
    } else if (start === "printable" && !end) {
        start = 32;
        end = 126;
    }
    if (!start) start = 0;
    if (!end) end = 255;
    var res = [];

    for (var i = start; i <= end; i++) res.push(String.fromCharCode(i));
    return res;
}

/**
 * @description A person
 * @param {string} fname First name
 * @param {string} sname Second name
 * @param {string} lname Last name
 * @param {string} title Title
 * @param {string} nickname Nickname
 * @param {NumberLike} [num="none"] Phone number
 * @param {string} country Country
 * @param {string} city City
 * @param {string} sex="other" Sex
 * @param {string} bday="01/01/2000" Birth date
 * @param {Str} [jobs="unemployed"] Job(s)
 * @param {Str} [activities="none"] Activitie(s)
 * @param {Str} [websites="none"] Website(s)
 * @param {string} [quote=""] Quote
 * @returns {Person} Person
 * @this Person
 * @constructor
 * @since 1.0
 * @func
 * @property {string} Person.firstName First name
 * @property {string} Person.secondName Second name
 * @property {string} Person.lastName Last name
 * @property {string} Person.title Title
 * @property {string} Person.nickname Nickname
 * @property {NumberLike} Person.phoneNum Phone number
 * @property {string} Person.country Country of residence or birthplace
 * @property {string} Person.city City of residence or birthplace
 * @property {string} Person.sex Sex
 * @property {string} Person.birthday Birthday
 * @property {?string} Person.deathday Deathday
 * @property {Str} Person.jobs Job(s)
 * @property {Str} Person.activities Activity/Activities
 * @property {Str} Person.websites Website(s)
 * @property {Str} Person.quote Quote(s)
 * @property {function(): string} Person.toString String representation
 * @property {function(): string} Person.genID ID generator
 * @property {function(): number} Person.getAge Age getter
 * @property {function(): boolean} Person.isMajor Majority check
 * @property {function(): string} Person.getFullName Full name getter
 */
function Person (fname, sname, lname, title, nickname, num, country, city, sex, bday, jobs, activities, websites, quote) {
    this.firstName = fname || "";
    this.secondName = sname || "";
    this.lastName = lname || "";
    this.title = title || "";
    this.nickname = nickname || "";
    this.phoneNum = num || "none";
    this.country = country || "";
    this.city = city || "";
    this.sex = (sex.toLowerCase() === "male" || sex.toLowerCase() === "female")? sex: "other";
    this.birthday = bday || "01/01/2000";
    this.deathday = null;
    this.jobs = jobs || "unemployed";
    this.activities = activities || "none";
    this.websites = websites || "none";
    this.quote = quote || "";
    this.toString = function () { //Weirdly showing "getName" which isn't the case of toLocaleString()
        var str = "Person(";
        for (var p in this) {
            if (this.hasOwnProperty(p) && p != "toString" && p != "toName") str += p + "=" + this[p] + ", ";
        }
        return str.substring(0, str.length-2) + ")"
    };

    this.genID = function () {
        return (this.lastName.get(0, 3) + this.birthday.split("/")[1] + this.firstName.get(0, 1) + this.secondName.get(0, 1) + this.birthday.split("/")[2] + this.sex[0]).toUpperCase();
    };

    this.getAge = function () {
        return (date2num(getDate()) - date2num(this.birthday)).toNDec(2);
    };

    this.isMajor = function () {
        return ((this.country.get(0, 1) === "UN" || this.country.toLowerCase() === "united states") && this.getAge() > 20) || ((this.country.get(0, 1) != "UN" || this.country.toLowerCase() != "united states") && this.getAge() > 17);
    };

    this.getFullName = function () {
        return this.firstName + " " + this.secondName + (this.nickname != ""? " \"" + this.nickname + "\" ": " ") + this.lastName;
    };

    return this
}

/**
 * @description An item
 * @param {string} [name="unknown"] Name
 * @param {string} [cat="unknown"] Category
 * @param {number} [price=0] Price
 * @param {number} [amr=0.25] Age minimum required to use this
 * @param {number} nb Quantity
 * @returns {Item} Item
 * @this Item
 * @constructor
 * @since 1.0
 * @func
 * @property {string} Item.name Name
 * @property {string} Item.category Category
 * @property {number} Item.price Price
 * @property {number} Item.ageMinRequired Minimum age required to use the item
 * @property {number} Item.quantity Quantity
 * @property {Date} Item.firstMade First made date
 * @property {function(number, Item[])} Item.duplicate Duplication
 * @property {function(*)} Item.remove Remove the item from somewhere
 * @property {function(): string} Item.toString String representation
 */
function Item (name, cat, price, amr, nb) { //An item like the ones that can be bought/sold/traded/used
    this.name = name || "unknown";
    this.category = cat || "unknown";
    this.price = price || 0;
    this.ageMinRequired = amr || .25; //3 months old+
    this.quantity = nb || 1;
    this.firstMade = new Date().toLocaleString();

    this.duplicate = function (n, dest) {
        for (var i = 0; i < n; i++) dest.push(new Item(this.name, this.category, this.price, this.ageMinRequired, this.quantity));
    };
    this.remove = function (dest) {
        isType(dest, "Array")? dest = dest.remove(this): dest.remove(this)
    };
    this.toString = function () {
        var str = "";
        for (var p in this) {
            if (this.hasOwnProperty(p) && p != "toString" && !isType(p, "function")) str += p + "=" + this[p] + ", ";
        }
        return str.substring(0, str.length-2)
    };
    return this
}



/**
 * @description Letter pair array
 * @param {string} [first="a"] First letter
 * @param {string} [last="z"] Last letter
 * @returns {Array} Letter pair array
 * @since 1.0
 * @func
 */
function letterArray (first, last) { //A letter pair array
    var f = first.charCodeAt(0) || 97, l = last.charCodeAt(0) || 122, arr = [], letterPair = "";
    for (var firstLetter = f; firstLetter <= l; firstLetter++) {
        for (var secondLetter = f; secondLetter <= l; secondLetter++) {
            if (firstLetter != secondLetter) {
                letterPair = String.fromCharCode(firstLetter) + String.fromCharCode(secondLetter);
                arr.push(letterPair);
            }
        }
    }
    return arr
}

/**
 * @description Remove the consecutive duplicated values in an array
 * @param {Array} arr Array
 * @returns {Array} Filtered array
 * @see module:Misc~rmDuplicates
 * @since 1.0
 * @func
 */
function rmConsecDuplicates (arr) {
    var out = [];
    var j = 0;
    for (var i = 0; i < arr.length; i++) {
        if (i === 0 || arr[i] != arr[i - 1]) out[j++] = arr[i];
    }
    j = 0;
    for (i = 0; i < arr.length - 1; i++) { //Double enforced check
        if (arr[i] != arr[i + 1]) out[j++] = arr[i];
    }
    return out
}

/**
 * @description Remove the duplicates of an array
 * @param {Array|string} arr Array
 * @returns {Array|string} Filtered array
 * @see module:Misc~rmConsecDuplicates
 * @since 1.0
 * @func
 */
function rmDuplicates (arr) {
    var out = rmConsecDuplicates(arr), j = 0;

    for (var i = 0; i < arr.length; i++) { //Pre-filtering
        if (i === 0 || arr[i] != arr[i-1] || (i >= 1 && arr[i] != arr[i-2]) || (i >= 2 && arr[i] != arr[i-3])) out[j++] = arr[i];
    }
    for (i = 0; i < out.length; i++) {
        for (j = 0; j < out.length; j++) {
            if (i != j && out[i] === out[j]) out[j] = undefined;
        }
    }
    return isType(arr, "String")? out.remove().join(""): out.remove()
}

/**
 * @description Base64.<br />
 * Source: somewhere
 * @type {{PADCHAR: string, ALPHA: string, getbyte64: base64.getbyte64, decode: base64.decode, getbyte: base64.getbyte, encode: base64.encode}}
 * @global
 * @this base64
 * @since 1.0
 * @property {string} base64.PADCHAR PAD character
 * @property {string} base64.ALPHA Alphabet
 * @property {function(string, number): number} base64.getbyte64 b64 byte getter
 * @property {function(string): string} base64.decoder Base64 decoder
 * @property {function(string, number): string} base64.getbyte Byte getter
 * @property {function(string): string} base64.encoder Base64 encoder
 */
var base64 = {
    /**
     * @readonly
     * @instance
     */
    PADCHAR: "=",
    /**
     * @readonly
     * @instance
     */
    ALPHA: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    /**
     * @throws Invalid character error: DOM Exception 5
     */
    getbyte64: function (s, i) {
        /* "This is oddly fast, except on Chrome/V8.
         Minimal or no improvement in performance by using an
         object with properties mapping chars to value (eg. 'A': 0)" */
        i = base64.ALPHA.indexOf(s.charAt(i || 0));
        if (i === -1) throw "Cannot decode base64";
        return i
    },
    /**
     * @throws Cannot decode base64
     */
    decode: function (s) { //Convert to string
        s += "";
        var pads, i, b10;
        var imax = s.length;
        if (imax === 0) return s;
        else if (imax % 4 != 0) throw "Cannot decode base64";

        pads = 0;
        if (s.charAt(imax - 1) === this.PADCHAR) {
            pads = 1;
            if (s.charAt(imax - 2) === this.PADCHAR) pads = 2;
            //Either way, we want to ignore this last block
            imax -= 4;
        }

        var x = [];
        for (i = 0; i < imax; i += 4) {
            b10 = (this.getbyte64(s, i) << 18) | (this.getbyte64(s, i + 1) << 12) | (this.getbyte64(s, i + 2) << 6) | this.getbyte64(s, i + 3);
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
        }

        switch (pads) {
            case 1:
                b10 = (this.getbyte64(s, i) << 18) | (this.getbyte64(s, i + 1) << 12) | (this.getbyte64(s, i + 2) << 6);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
                break;
            case 2:
                b10 = (this.getbyte64(s, i) << 18) | (this.getbyte64(s, i + 1) << 12);
                x.push(String.fromCharCode(b10 >> 16));
                break;
        }
        return x.join("")
    },
    /**
     * @throws Invalid character error: DOM Exception 5
     */
    getbyte: function (s, i) {
        var x = s.charCodeAt(i || 0);
        if (x > 255) throw "INVALID_CHARACTER_ERR: DOM Exception 5";
        return x
    },
    /**
     * @throws {SyntaxError} Only one argument needed
     */
    encode: function (s) {
        if (arguments.length != 1) throw new SyntaxError("Only one argument please !");

        var i, b10, x = [];
        s += "";
        var imax = s.length - s.length % 3;

        if (s.length === 0) return s;
        for (i = 0; i < imax; i += 3) {
            b10 = (this.getbyte(s, i) << 16) || (this.getbyte(s, i + 1) << 8) || this.getbyte(s, i + 2);
            x.push(this.ALPHA.charAt(b10 >> 18));
            x.push(this.ALPHA.charAt((b10 >> 12) & 0x3F));
            x.push(this.ALPHA.charAt((b10 >> 6) & 0x3f));
            x.push(this.ALPHA.charAt(b10 & 0x3f));
        }
        switch (s.length - imax) {
            case 1:
                b10 = this.getbyte(s, i) << 16;
                x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 0x3F) + this.PADCHAR.repeat(2));
                break;
            case 2:
                b10 = (this.getbyte(s, i) << 16) || (this.getbyte(s, i + 1) << 8);
                x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 0x3F) + this.ALPHA.charAt((b10 >> 6) & 0x3f) + this.PADCHAR);
                break;
        }
        return x.join("")
    }
};

/**
 * @description Virtual Web Machine
 * @param {string} [name="Machine_5"] Name of the VWM
 * @param {number} [ver=5] Version of the VWM
 * @param {number} [cpy=1024] Capacity of the VWM (in bits).
 * @param {string} [type=""] Type of the memory used
 * @constructor
 * @this {Machine}
 * @returns {Machine} VWM
 * @see module:Misc~Memory
 * @since 1.0
 * @property {number} Machine.capacity Capacity (in bits)
 * @property {number} Machine.version Version (1-6)
 * @property {string} Machine.name Name
 * @property {function(number, number, string): number} Machine.operation Operation calculator
 * @property {function(string): string} Machine.inv Data inverter
 * @property {Memory} Machine.memory Memory
 * @property {function(*, string)} Machine.send Data sender
 * @property {function(Str): *} Machine.parse Machine code into a human readable code
 * @property {function(*): Str} Machine.unparse Human readable code into a machine code
 * @property {function(*)} Machine.store Data storer
 * @property {Function} Machine.show Data log
 * @property {function(): string} Machine.specs Machine specifications
 * @property {function(): string} Machine.toString String representation
 * @property {function(*, number): NumberLike} Machine.conv Data converter
 */
function Machine (name, ver, cpy, type) {
    //ver (basis) := 1: binary, 2: ternary, 3: octal, 4: decimal, 5: hexadecimal, 6: base 36
    this.capacity = cpy || 1024; //pow(2, 10) bits = 128B
    this.version = ver || 5;
    this.name = name || "Machine_" + this.version;

    switch (this.version) {
        case 1: this.base = 2; break;
        case 2: this.base = 3; break;
        case 3: this.base = 8; break;
        case 4: this.base = 10; break;
        case 5: this.base = 16; break;
        case 6: this.base = 36; break;
        default: this.base = 16; break;
    }

    this.operation = function (a, b, op) {
        switch (op.normal()) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": return a / b;
            case "%": return a % b;
            case ">>": return a >> b;
            case "<<": return a << b;
            case ">>>": return a >>> b;
            case ">": return a > b;
            case "<": return a < b;
            case "|": return a | b;
            case "&": return a & b;
            case "^": return a ^ b;
            case "=": return a === b;
            case "!=": return a != b;
            case ">=": return a >= b;
            case "<=": return a <= b;
            case "||": return a || b;
            case "&&": return a && b;
            case "e": return a * Math.pow(10, b);
            case "e^": case "exp":
            return [Math.exp(a), Math.exp(b)];
            case "log": return log(a, b);
            case "++": return [a++, b++];
            case "--": return [a--, b--];
            case "+=": return a += b;
            case "-=": return a -= b;
            case "*=": return a *= b;
            case "/=": return a /= b;
            case "%=": return a %= b;
            case ".=": return a.concat(b);
            default: return a + "" + b;
        }
    };

    this.inv = function (data) {
        if (!isType(data, "String")) data += "";
        for(var i = 0; i < data.length; i++) data[i] = parseInt(this.base) - 1 - parseFloat(data[i]);
        return data
    };

    this.memory = new Memory(this.capacity, type || "", this.name);
    this.send = function (msg, to) {
        POST(to, "msg=" + this.parse(msg));
    };

    this.parse = function (data) { //Turn the machine string into a human readable one
        if (!isType(data, "Array")) data = this.base === 2? data.divide(8): data.divide(2);
        var res = "", deconvs = [];
        for (var i = 0; i < data.length; i++) {
            deconvs[i] = conv(data[i], this.base);
            res += String.fromCharCode(conv(data[i], this.base));
        }
        Essence.say(deconvs);
        return JSON.parse(res); //prone to errors when this.base != 16
    };

    this.unparse = function (data, noArr) { //Turn the data into a machine readable string
        var nd = JSON.stringify(data), res = "", codes = [];
        for (var i = 0; i < nd.length; i++) {
            codes[i] = nd.charCodeAt(i);
            res += this.base === 2? conv(nd.charCodeAt(i).toNDigits(8), 10, this.base): conv(nd.charCodeAt(i), 10, this.base);
        }
        //Essence.say("\'" + data + "\'= " + codes, "info");
        return noArr? res: (this.base === 2? res.divide(8): res.divide(2));
    };

    this.store = function (data) {
        this.memory.add(this.unparse(data));
        this.memory.save();
    };

    this.show = function () {
        for(var i = 0; i < this.memory.slots.length; i++) Essence.say(this.memory.slots[i]);
    };

    this.specs = function () { //Specifications about the machine
        return "Name: " + this.name + "\nCapacity: " + this.capacity + " bits\nMemory: \n" + this.memory.toString()
    };

    this.toString = function () {
        return "Machine("+ this.specs() + ")";
    };

    this.conv = function (data, base) {
        return conv(data, base || 36, this.base);
    };

    return this;
}

/**
 * @description Stack memory
 * @param {number} [cpy=1024] Capacity (in bits).
 * @param {string} [type="session"] Memory type
 * @param {NumberLike|boolean} [prefix] Prefix
 * @returns {Memory} Memory
 * @this {Memory}
 * @constructor
 * @since 1.0
 * @property {number} Memory.capacity Capacity
 * @property {Array} Memory.slots Memory slots
 * @property {string} Memory.type Type (local/session)
 * @property {string} Memory.name Name
 * @property {number} Memory.free Index of the first free slot
 * @property {Function} Machine.save Save the memory
 * @property {function(*)} Machine.remove Data removal
 * @property {function(*): number} Machine.getLocation Data location getter
 * @property {Function} Machine.clear Data reset
 * @property {function(*)} Machine.add Data adder
 * @property {Function} Machine.print Print/log the data
 * @property {Function} Machine.pop Pop the last row of data
 * @property {function(): string} Machine.toString String representation
 */
function Memory (cpy, type, prefix) {
    this.capacity = cpy || 1024;
    this.slots = new Array(this.capacity);
    this.type = type === "local"? "local": "session";
    this.name = prefix? prefix + "_" + this.type + "M" + log(this.capacity): this.type + "M" + log(this.capacity);
    this.free = 0;
    this.save = function () {
        for (var i = 0; i < this.slots.length; i++) {
            if (this.type === "local") localStorage.setItem(this.name + "#" + i, this.slots[i]);
            else sessionStorage.setItem(this.name + "#" + i, this.slots[i]);
        }
    };

    this.remove = function (data) {
        this.slots.remove(JSON.stringify(data));
        if (this.type === "local") localStorage.setItem(this.getLocation(data), undefined);
        else sessionStorage.setItem(this.getLocation(data), undefined);
    };

    this.getLocation = function (data) { //Get the memory location of a data
        if (this.type === "local") {
            for (var i in localStorage) {
                if (localStorage.hasOwnProperty(i) && localStorage[i] === JSON.stringify(data)) return i
            }
        } else {
            for (i in sessionStorage) {
                if (sessionStorage.hasOwnProperty(i) && sessionStorage[i] === JSON.stringify(data)) return i
            }
        }
        return -1
    };

    this.clear = function () {
        this.slots = new Array(this.capacity);
        this.free = 0;
        if (this.type === "local") {
            for (var i in localStorage) {
                if (localStorage.hasOwnProperty(i) && i.has(this.name)) localStorage.removeItem(i);
            }
        } else {
            for (i in sessionStorage) {
                if (sessionStorage.hasOwnProperty(i) && i.has(this.name)) sessionStorage.removeItem(i);
            }
        }
    };

    this.add = function (data) { //Added but not saved
        this.slots[this.free++] = JSON.stringify(data);
    };

    this.print = function () {
        Essence.say(this.name + "\'s slots: ", "info");
        for (var i = 0; i < this.slots.length; i++) {
            try {
                Essence.say(i + ": " + JSON.parse(this.slots[i]))
            } catch(err) {
                Essence.say(i + ": ")
            }
        }
    };

    this.pop = function () {
        (this.type === "local")? localStorage.removeItem(this.getLocation(this.slots.last())): sessionStorage.removeItem(this.getLocation(this.slots.last()));
        this.free--;
        this.slots.pop();
    };

    this.toString = function () {
        return this.type.capitalize() + " memory " + this.name + ": " + this.slots.toStr(true)
    };

    return this;
}

/**
 * @description System (a bit like in Java)
 * @type {{in: {recording: boolean, record: Sys.in.record, startRecording: Sys.in.startRecording, stopRecording: Sys.in.stopRecording, data: Array}, log: Sys.log, debug: Sys.debug, out: Sys.out, toString: Sys.toString}}
 * @global
 * @since 1.0
 * @property {Object} Sys.in Input
 * @property {boolean} Sys.in.recording Recording flag
 * @property {function(keyStroke)} Sys.in.record Input recorder
 * @property {function(keyStroke)} Sys.in.startRecording Record starter
 * @property {function(): string} Sys.in.stopRecording Record stopper
 * @property {function(*)} Sys.log Logger
 * @property {function(Function)} Sys.debug Debugger
 * @property {function(): string} Sys.out Output
 * @property {function(): string} Sys.toString() String representation
 */
var Sys = { //System
    in: {
        recording: false,
        record: function (keyStroke) { //Record the user input
            if (this.recording) this.data.push(getKey(keyStroke)[0]);
        },
        startRecording: function (keyStroke) {
            this.recording = true;
            this.record(keyStroke);
        },
        stopRecording: function () {
            this.recording = false;
            return this.data.last()
        }, data: []//Slot data containing the data typed in the window and not the console
    },
    log: function (data) {
        console.log("[System]  " + data);
    },
    debug: function (cb) {
        this.log("Debugging: " + cb.name);
        console.group();
        console.time("debug");
        cb(Array.from(arguments).get(1));
        console.timeEnd("Time");
        console.trace();
        console.groupEnd();
    },
    out: function () {
        Essence.print("\b" + this.in.data);
        return Essence.txt2print;
    }, toString: function () {
        return "[object System]";
    }
};

/**
 * @description Start the keystroke recording
 * @param {*} keyStroke Keystroke
 * @returns {undefined}
 * @since 1.0
 * @func
 * @listens window.onkeypress
 */
window.onkeypress = function (keyStroke) {
    Sys.in.record(keyStroke);
    $G["lastKeyPair"] = getKey(keyStroke);
};

/**
 * @description Typing recorder
 * @deprecated
 * @param {function(function(string))} [cb] Callback
 * @returns {string} Recorded keystrokes
 * @ignore
 * @see module:Misc~Sys
 * @since 1.0
 * @func
 */
function stup (cb) {
    alert("You have 10s to type something !");
    Sys.in.recording = true;
    Sys.in.data = [];
    setTimeout(function () {
        Sys.in.recording = false;
        alert("Stop !!");
        if(cb) cb(Sys.in.data.join(""));
        return Sys.in.data.join("");
    }, 1e4);
    while(Sys.in.data.length === 0 || $G["las"]) {
        if(!Sys.in.recording) break;
    }
    return Sys.in.data.join("");
}

/**
 * @description Turn a string into a RegExp
 * @param {string} str String
 * @returns {RegExp} Resulting regular expression
 * @see module:Misc~unRegExpify
 * @since 1.0
 * @func
 */
function RegExpify (str) {
    return new RegExp(str.replace(/[|\\{}()[\]^$+*?.:'%]/g, "\\$&"), "gm");
}

/**
 * @description Turn a RegExp into a string
 * @param {RegExp} re RegExp
 * @returns {string|Array} Resulting string
 * @see module:Misc~RegExpify
 * @since 1.0
 * @func
 */
function unRegExpify (re) {
    return re.toString().get(1, re.toString().lastIndexOf("/") - 1).remove("\\");
}

/**
 * @description Join two arrays into an object
 * @param {Array} keyArr Key array
 * @param {Array} valArr Value array
 * @returns {{}} Resulting object
 * @since 1.0
 * @see module:Misc~Tablify
 * @func
 */
function Objectify (keyArr, valArr) {
    var res = {};
    for (var i = 0; i < keyArr.length; i++) res[keyArr[i]] = valArr[i] || null;
    return res;
}

/**
 * @description Join two arrays into an de-linked object
 * @param {Array} keyArr Key array
 * @param {*} [val=[]] Value of all the keys
 * @returns {{}} Resulting semi-empty reference independent object
 * @since 1.1
 * @see module:Misc~Objectify
 * @func
 */
function Tablify (keyArr, val) {
    return Objectify(keyArr, new Array(keyArr.length).fill(arguments.toArray().length > 0? val: []).map(function () {
        return arguments.toArray().length > 1? val: [];
    }));
}

/* eslint no-array-constructor: 0 */
/**
 * @description Name of a type to the type itself
 * @param {string} name Name
 * @param {*} [param] Parameters/value
 * @returns {*} Type
 * @since 1.0
 * @func
 */
function name2type (name, param) {
    switch(name) {
        case "Number": return Number(param);
        case "String": return String(param);
        case "Boolean": return Boolean(param);
        case "Function": return Function(param, arguments.toArray().get(2));
        case "Object": return Object(param, arguments.toArray().get(2));
        case "Date": return new Date(param, arguments.toArray().get(2));
        case "Array": return [param, arguments.toArray().get(2)];
        case "RegExp": return new RegExp(param, arguments.toArray().get(2).toString());
        case "Error": return Error(param, arguments.toArray().get(2));
        case "File": return File(param, arguments.toArray().get(2));
        case "URL": return URL(param, arguments.toArray().get(2));
        case "FileReader": return FileReader(param, arguments.toArray().get(2));
        case "FileWriter": return FileWriter(param, arguments.toArray().get(2));
        case "Blob": return Blob(param, arguments.toArray().get(2));
        case "Element": return Element(param, arguments.toArray().get(2));
        case "Person": return Person(param, arguments.toArray().get(2));
        case "Item": return Item(param, parseFloat(arguments.toArray().get(2)));
        case "Colour": return Colour(param, arguments.toArray().get(2));
        case "LinkedList": return LinkedList(param, arguments.toArray().get(2));
        case "TreeNode": return TreeNode(param, arguments.toArray().get(2));
        case "Node": return Node(param, arguments.toArray().get(2));
        case "PathNode": return PathNode(param, arguments.toArray().get(2));
        case "NTreeNode": return NTreeNode(param, arguments.toArray().get(2));
        case "Set": return Set(param, arguments.toArray().get(2));
        case "SortedSet": return SortedSet(param, arguments.toArray().get(2));
        case "Stack": return Stack(param, arguments.toArray().get(2));
        case "StackArray": return Stack(param, arguments.toArray().get(2));
        case "StackList": return StackList(param, arguments.toArray().get(2));
        case "Queue": return Queue(param, arguments.toArray().get(2));
        case "QueueArray": return QueueArray(param, arguments.toArray().get(2));
        case "QueueList": return QueueList(param, arguments.toArray().get(2));
        case "Shape": return Shape(param, arguments.toArray().get(2));
        case "Box": return Box(param, arguments.toArray().get(2));
        case "AABB": return AABB(param, arguments.toArray().get(2));
        case "Circ": return Circ(param, arguments.toArray().get(2));
        case "Pt": return Pt(param, arguments.toArray().get(2));
        case "Line": return Line(param, arguments.toArray().get(2));
        case "Vector": return Vector(param, arguments.toArray().get(2));
        case "Polygon": return Polygon(param, arguments.toArray().get(2));
        case "database": return database(param, arguments.toArray().get(2));
        case "process": return process(param, arguments.toArray().get(2));
        case "server": return server(param, arguments.toArray().get(2));
        case "Archive": return Archive(param, arguments.toArray().get(2));
        case "Machine": return Machine(param, arguments.toArray().get(2).toString());
        case "Memory": return Memory(param, arguments.toArray()[2], arguments.toArray()[3]);
        case "WebPage": return WebPage(param, arguments.toArray().get(2));
        case "WebApp": return WebApp(param, arguments.toArray().get(2));
        case "virtualHistory": return virtualHistory(param, arguments.toArray().get(2));
        case "Editor": return Editor(param, arguments.toArray().get(2));
        case "Preview": return Preview(param, arguments.toArray().get(2));
        case "Debugger": return Debugger(param, arguments.toArray().get(2));
        case "Parser": return Parser(param, arguments.toArray().get(2));
        case "Toolbar": return Toolbar(param, arguments.toArray().get(2));
        case "IDE": return IDE(param, arguments.toArray().get(2));
        case "Template": return Template(param, arguments.toArray().get(2));
        case "Stream": return Stream(param, arguments.toArray().get(2));
        case "MultiStream": return MultiStream(param, arguments.toArray().get(2));
        default: return name;
    }
}

/* eslint no-array-constructor: 2 */
/* eslint no-unused-vars: 0 */
/**
 * @description Finite-state Automaton
 * @param {RegExp} re Regular expression
 * @constructor
 * @returns {FA} FA
 * @todo
 * 1. Read more about it
 * 2. Decide whether using NFA or DFA
 * 3. Work on it
 * @this {FA}
 * @since 1.0
 * @func
 */
function FA (re) {
    this.regexp = re;
    this.states = [];

    return this;
}

/**
 * @description Human RegExp to dictionnary (language)
 * @param {string} exp Human RegExp (simplified RegExp)
 * @todo Work on it
 * @returns {Array} Dictionary
 * @since 1.0
 * @func
 */
function exp2dict (exp) {
    var re = RegExpify(exp), res = [], grp = [
        /([a-z]+\|[a-z]+)+/gm, //...|...
        /([a-z]+)\*/gm, //...*
        /([a-z]+)\+/gm, //...+
        /([a-z]+)\?/gm //...?
    ];
    //matches: re.exec(str).last()
    return res;
}
/* eslint no-unused-vars: 2 */

/**
 * @description Convert an array into a human string
 * @param {Array} arr Array
 * @param {string} [cjt="and"] Conjunctions
 * @returns {string} Literal
 * @since 1.0
 * @func
 */
function arrayLiteral (arr, cjt) {
    return arr.length > 1? arr.get(-1).toStr(true) + " " + (cjt || "and") + " " + arr.last(): arr[0];
}

/**
 * @description Module list
 * @return {Array[]} Module list
 * @func
 * @since 1.1
 */
function moduleList (extended) {
    var table = [["Name", "Version", "Description", "Dependencies"]];
    if (extended) table[0].push("Weight");
    Essence.loadedModules.map(function (m) {
        extended? table.push([m.name, m.version, m.description, m.dependency.toStr(true), m.getWeight()]): table.push([m.name, m.version, m.description, m.dependency.toStr(true)]);
    });
    return table;
}

/**
 * @description Scoreboard
 * @param {string} [name="Scoreboard"] Name
 * @param {string[]} members Participants of whatever the scoreboard is logging/tracking
 * @param {string[]} events Events/things in which participants are evaluated in.
 * @param {number} [maxScore=10] Maximum score
 * @this {Scoreboard}
 * @since 1.1
 * @constructor
 * @property {string} Scoreboard.name Name of the scoreboard
 * @property {string[]} Scoreboard.participants List of participants
 * @property {number} Scoreboard.maxScore Maximum score
 * @property {Function} Scoreboard.build Build the scoreboard (it's table)
 * @property {function(string, string, number)} Scoreboard.addPoint Change/add the point to a participant in a particular event
 * @property {function(string, string): number} Scoreboard.getPoint Get the point(s) of a participant in a particular event
 * @property {function(string): number} Scoreboard.getTotal Get the total score of the participant
 * @property {function(): string[]} Scoreboard.podium Get the scoreboard's podium
 * @property {function(): number} Scoreboard.avgScore Average total score of the "game"
 * @property {function(): Scoreboard} Scoreboard.getFormatted Get a percentage formatted scoreboard
 * @property {function(): string} Scoreboard.toString String representation of the Scoreboard
 */
function Scoreboard (name, members, events, maxScore) {
    this.name = name || "Scoreboard";
    this.participants = members;
    this.maxScore = maxScore || 10;
    this.events = events;
    this.build = function () {
        this.table = [];
        this.table.push([""].append(this.participants));
        for (var i = 1; i <= this.events.length; i++) this.table.push([this.events[i - 1]].append(new Array(this.participants.length).fill(0)));
        this.table.push(["Total"].append(new Array(this.participants.length).fill(0)));
    };
    this.build();
    this.addPoint = function (participant, event, score) {
        this.table[lookfor(event, this.table)[0]][lookfor(participant, this.table)[1]] = score || 0;
        this.table[lookfor("Total", this.table)[0]][lookfor(participant, this.table)[1]] = this.table.line(lookfor(participant, this.table)[1]).get(1, -1).sum();
    };

    this.getPoint = function (participant, event) {
        return this.table[lookfor(event, this.table)[0]][lookfor(participant, this.table)[1]];
    };
    this.getTotal = function (participant) {
        return this.table[lookfor("Total", this.table)[0]][lookfor(participant, this.table)[1]];
    };

    this.podium = function () {
        var scores = this.table.last().get(1), first, second, third;
        first = this.table[0][this.table.last().indexOf(scores.max())];
        scores = scores.removeFirst(scores.max());
        second = this.table[0][this.table.last().indexOf(scores.max())];
        scores = scores.removeFirst(scores.max());
        third = this.table[0][this.table.last().indexOf(scores.max())];
        return [first, second, third];
    };

    this.avgScore = function () {
        return this.table.last().mean(2, 1);
    };

    this.getFormatted = function (nbDec) {
        if (!nbDec) nbDec = 2;
        var sb = Copy(this);
        for (var p = 0; p < this.participants.length; p++) {
            for (var e = 0; e < this.events.length; e++) sb.table[e + 1][p + 1] = (sb.table[e + 1][p + 1] / this.maxScore).toNDec(nbDec);//this.addPoint(this.participants[p], this.events[e], this.getFormated(this.participants[p], this.events[e]) / this.maxScore);
            sb.table[sb.events.length + 1][p + 1] = sb.table.line(p + 1).get(1, -1).sum().toNDec(nbDec);
        }
        return sb;
    };

    this.toString = function () {
        return "Scoreboard(name=" + this.name + ", participants=" + this.participants.toStr(true) + "; maxScore=" + this.maxScore + ", events=" + this.events.toStr(true) + ")";
    }
}

/**
 * @description Console text animation
 * @param {string} [msg="Loading"] Text
 * @param {number} [startTime=0] Starting time of the animation (in ms).
 * @param {number} [max=10e3] End time of the animation (in ms).
 * @param {number} [step=1e3] Transition delay
 * @param {boolean} [tuxStyle=false] Animate the animation the Linux style
 * @param {boolean} [stop=startTime>max] Forced stop
 * @return {?boolean} Animation done ?
 * @func
 * @since 1.1
 * @todo Improve/fix the ending
 */
function anim (msg, startTime, max, step, tuxStyle, stop) {
    if (!msg) msg = "Loading";
    if (!startTime) startTime = 0;
    if (!max) max = 10e3;
    if (!step) step = 800;
    var waits = tuxStyle? ["-", "\\", "|", "/"]: ["", ".", "..", "..."], j = 0, tw = [], done = function () {
        tw.map(function (t) {
            clearTimeout(t);
        });
        console.clear();
        console.log("Done !");
        return true;
    };

    if (!stop) waits.map(function (c) {
        tw.push(setTimeout(function () {
            console.clear();
            console.log(msg + " " + c);
        }, startTime + j * step));
        j++;
    });
    else return done();
    startTime += 2 * step;
    if (startTime <= max || !stop) setTimeout(function () {
        anim(msg, startTime, max, step, tuxStyle, startTime > max);
    }, 2 * step);
    else return done();
}

//AI system that stores it's rules in a database and update it after learning
/**
 * @description Artificial Intelligence system.
 * @param {Array} [rules=[[0, "", null]]] Rules
 * @return {AI} AI
 * @constructor
 * @since 1.1
 */
function AI (rules) {
    this.rules = rules || [[0, "", null]];
    this.db = new DB("AI rules", ["Index", "Rules", "Precision"], this.rules);
    this.db.init();
    this.updateRule = function (rule, val, newRule) { //rule can be the id/rank of the row
        var pos = this.db.find(rule);
        this.db.set(val, pos[0], pos[1] + (isType(rule, "Number")? 2: 1));
        if (newRule) this.db.set(newRule, pos[0], pos[1]);
        this.rules = this.db.val;
    };
    this.addRule = function (name, val) {
        this.db.add([name, val]);
        this.rules = this.db.val;
    };
    this.removeRule = function (name) {
        this.db.remove(this.db.find(name));
        this.rules = this.db.val;
    };
    this.update = function () {
        this.db.update();
        this.db.build();
        this.rules = this.db.val;
    };
    this.save = function () {
        this.db.save();
        this.rules = this.db.val;
    };
    this.findRule = function (rule) {
        return this.db.find(rule);
    };
    this.verify = function (rule, val) {
        var pos = this.findRule(rule);
        return eval(this.rules[pos[0]][pos[1] + 1].replace("x", val));
    };
    return this;
}