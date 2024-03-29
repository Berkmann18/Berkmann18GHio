/**
 * @module Security
 * @description Security/Hacking stuff
 * @version 1.0
 * @since 1.1
 * @license MIT
 * @author Maximilian Berkmann <maxieberkmann@gmail.com>
 * @copyright Maximilian Berkmann 2016
 * @requires module:essence
 * @requires Maths
 * @requires DOM
 * @requires QTest
 * @type {Module}
 * @exports Security
 */
var Security = new Module("Security", "Security stuff", ["Maths", "DOM", "QTest"]);

/* eslint no-undef: 0 */

/**
 * @description Caesar crypting
 * @param {NumberLike} character Character to encrypt
 * @param {number} n Key
 * @returns {string} Cryped character
 * @since 1.0
 * @func
 */
function trans (character, n) {
    var code = character.charCodeAt(0);
    return String.fromCharCode(code + n)
}

/**
 * @description Encrypt a text
 * @param {string} txt Text
 * @param {number} [key] Key
 * @returns {string} Encrypted text
 * @see module:Security~decrypt
 * @since 1.0
 * @func
 */
function encrypt (txt, key) {
    if (!key) {
        var len = txt.length, extra = 0;
        var mid = Math.floor(len/2);

        mid = (len % 2 === 0)? txt.charCodeAt(mid): (txt.charCodeAt(txt[mid - 1]) + txt.charCodeAt(txt[mid])) / 2;
        if (mid >= 97 && mid <= 122) extra = 2;
        else if (mid >= 65 && mid <= 90) extra = 1;
        else if (mid - Math.floor(mid/2) * 2 === 0) extra = -1;
        else extra = 2;

        key = Math.round((Math.pow(2, 7) + txt.sum() - 48) / txt.prod()) + extra;
    }
    var res = "";
    for(var i = 0; i < txt.length; i++) res += trans(txt[i], key);
    len = mid = extra = undefined;

    return res
}

/**
 * @description Decrypt a text
 * @param {string} txt Encrypted text
 * @param {number} [key] Key
 * @returns {string} Decrypted text
 * @see module:Security~encrypt
 * @since 1.0
 * @func
 */
function decrypt (txt, key) {
    var res = "";
    if (key) {
        for(var i = 1; i <= txt.length; i++) res += trans(txt[i - 1], key);
    } else {
        res = new Array(131073); //2 * Math.pow(2, 16) + 1
        for (i = -65536; i < 65537; i++) {
            res[i + 65536] = "";
            for (var j = 0; j < txt.length; j++) {
                res[i + 65536] += trans(txt[j], i % 65537);
            }
        }
    }
    if (!key) console.log(console.table(res));
    return key? res: complexTable("Decryption result for <i>" + txt + "</i>", range(-65536, 1, 65536), res, ["Key", "Result"], "decrypted_" + txt, false);
    //simpleTable("Decryption result for <i>" + txt + "</i>", , res, "decrypt_" + txt, Essence.css)
}

/**
 * @description Alphabetically encode (regardless of the case) to hexadecimal
 * @param {string} txt Text
 * @returns {string} Encoded text
 * @see module:Security~abcDecode
 * @since 1.0
 * @func
 */
function abcEncode (txt) {
    var code = new Array(txt.length);
    if (isType(txt, "string") || isType(txt, "array")) {
        for (var i in txt) {
            if(txt.hasOwnProperty(i)) {
                switch (txt[i].toLowerCase()) {
                    case " ": code[i] = "00";break;
                    case "a": code[i] = "01";break;
                    case "b": code[i] = "02";break;
                    case "c": code[i] = "03";break;
                    case "d": code[i] = "04";break;
                    case "e": code[i] = "05";break;
                    case "f": code[i] = "06";break;
                    case "g": code[i] = "07";break;
                    case "h": code[i] = "08";break;
                    case "i": code[i] = "09";break;
                    case "j": code[i] = 0xA;break;
                    case "k": code[i] = 0xB;break;
                    case "l": code[i] = 0xC;break;
                    case "m": code[i] = 0xD;break;
                    case "n": code[i] = 0xE;break;
                    case "o": code[i] = 0xF;break;
                    case "p": code[i] = 0x10;break;
                    case "q": code[i] = 0x11;break;
                    case "r": code[i] = 0x12;break;
                    case "s": code[i] = 0x13;break;
                    case "t": code[i] = 0x14;break;
                    case "u": code[i] = 0x15;break;
                    case "v": code[i] = 0x16;break;
                    case "w": code[i] = 0x17;break;
                    case "x": code[i] = 0x18;break;
                    case "y": code[i] = 0x19;break;
                    case "z": code[i] = 0x1A;break;
                    case ".": code[i] = 0x1B;break;
                    case ",": code[i] = 0x1C;break;
                    case "!": code[i] = 0x1D;break;
                    case "?": code[i] = 0x1E;break;
                    case "(": code[i] = 0x1F;break;
                    case ")": code[i] = 0x20;break;
                    case ":":code[i] = 0x21;break;
                    case ";": code[i] = 0x22;break;
                    case "@": code[i] = 0x23;break;
                    case "~": code[i] = 0x24;break;
                    case "\'": code[i] = 0x25;break;
                    case "\"": code[i] = 0x26;break;
                    case "#": code[i] = 0x27;break;
                    case "{": code[i] = 0x28;break;
                    case "}": code[i] = 0x29;break;
                    case "-": code[i] = 0x2A;break;
                    case "\\": code[i] = 0x2B;break;
                    case "/": code[i] = 0x2C;break;
                    case "£": code[i] = 0x2D;break;
                    case "$": code[i] = 0x2E;break;
                    case "€": code[i] = 0x2F;break;
                    case "+": code[i] = 0x30;break;
                    case "*": code[i] = 0x31;break;
                    case "%": code[i] = 0x32;break;
                    case "^": code[i] = 0x33;break;
                    case "°": code[i] = 0x34;break;
                    default: code[i] = "x";
                }
            }
        }
        return isType(txt, "string")? code.join(""): code
    }
    return Essence.say("The parameter of abcEncode must be a string or an array.", "err")
}

/**
 * @description Alphabetically decode from hexadecimal to lowercase text.
 * @param {string} txt Hexadecimal code
 * @returns {string} Alphabetical text
 * @see module:Security~abcEncode
 * @since 1.0
 * @func
 */
function abcDecode (txt) {
    var code = new Array(txt.length);
    if (isType(txt, "string") || isType(txt, "array")) {
        for (var i = 0; i < txt.length; i += 2) {
            switch (txt.substr(i, 2)) {
                case "00": code[i] = " ";break;
                case "01": code[i] = "a";break;
                case "02": code[i] = "b";break;
                case "03": code[i] = "c";break;
                case "04": code[i] = "d";break;
                case "05": code[i] = "e";break;
                case "06": code[i] = "f";break;
                case "07": code[i] = "g";break;
                case "08": code[i] = "h";break;
                case "09": code[i] = "i";break;
                case "10": code[i] = "j";break;
                case "11": code[i] = "k";break;
                case "12": code[i] = "l";break;
                case "13": code[i] = "m";break;
                case "14": code[i] = "n";break;
                case "15": code[i] = "o";break;
                case "16": code[i] = "p";break;
                case "17": code[i] = "q";break;
                case "18": code[i] = "r";break;
                case "19": code[i] = "s";break;
                case "20": code[i] = "t";break;
                case "21": code[i] = "u";break;
                case "22": code[i] = "v";break;
                case "23": code[i] = "w";break;
                case "24": code[i] = "x";break;
                case "25": code[i] = "y";break;
                case "26": code[i] = "z";break;
                case "27": code[i] = ".";break;
                case "28": code[i] = ",";break;
                case "29": code[i] = "!";break;
                case "30": code[i] = "?";break;
                case "31": code[i] = "(";break;
                case "32": code[i] = ")";break;
                case "33": code[i] = ":";break;
                case "34": code[i] = ";";break;
                case "35": code[i] = "@";break;
                case "36": code[i] = "~";break;
                case "37": code[i] = "\'";break;
                case "38": code[i] = "\"";break;
                case "39": code[i] = "#";break;
                case "40": code[i] = "{";break;
                case "41": code[i] = "}";break;
                case "42": code[i] = "-";break;
                case "43": code[i] = "\\";break;
                case "44": code[i] = "/";break;
                case "45": code[i] = "£";break;
                case "46": code[i] = "$";break;
                case "47": code[i] = "€";break;
                case "48": code[i] = "+";break;
                case "49": code[i] = "*";break;
                case "50": code[i] = "%";break;
                case "51": code[i] = "^";break;
                case "52": code[i] = "°";break;
                default: code[i] = 0;
            }
        }
        return isType(txt, "string")? code.join(""): code
    }
    return Essence.say("The parameter of abcDecode must be a string or an array.", "err")
}

/**
 * @description Data encryption
 * @param {NumberLike} data Data
 * @returns {NumberLike} Encrypted data
 * @since 1.0
 * @func
 */
function ilEncrypt (data) {
    var res = isType(data, "String")? data.split(""): data;
    for (var i = 0; i < res.length; i++) res[i] = String.fromCharCode(abcModulus(data[i].charCodeAt(0) * data.length));
    return isType(data, "String")? res.join(""): res;
}

/**
 * @description Data decryption
 * @param {NumberLike} data Data
 * @returns {NumberLike} Decrypted data
 * @since 1.0
 * @func
 */
function ilDecrypt (data) {
    var res = isType(data, "String")? data.split(""): data;
    for (var i = 0; i < res.length; i++) res[i] = String.fromCharCode(abcModulus(data[i].charCodeAt(0) / data.length));
    return isType(data, "String")? res.join(""): res;
}

/* eslint no-unused-vars: 0 */
/**
 * @description RSA algorithm keys computation
 * @param {number} p=23 Number #1
 * @param {number} q=29 Number #2
 * @returns {number[]} Public key
 * @see module:Security~cryptRSA
 * @since 1.0
 * @func
 * @throws {Error} Either p or q isn't a prime number
 */
function computeRSA (p, q) {
    if (arguments.toArray().length === 0) {
        p = bruteForceNum(23, "isPrime(x)", 99);
        q = bruteForceNum(23, "isPrime(x) && x!=" + p, 99);
    }
    if (!isPrime(p)) throw new Error("p=" + p + "; isn't a prime number !!");
    if (!isPrime(q)) throw new Error("q=" + q + "; isn't a prime number !!");
    if (p < 20 || q < 20) Essence.say("p/q should be bigger !", "warn");
    var n = p * q, z = (p - 1) * (q - 1), e = bruteForceNum(2, "1<x<" + n + " && gcd(x," + z + ")==1", n + 1), d; //1 < e < n & gcd(e, z) = 1
    d = bruteForceNum(0, "(x*" + e + ")%"+ z + "==1", n); //bruteForceNum(0, "x*" + e + "==" + "1+k" + z, n);

    Essence.say([n, d]); //Private key
    //Issue: d might be too big for cryptRSA
    return [n, e]; //Public keys
}
/* eslint no-unused-vars: 2 */

/**
 * @description Encrypt/decrypt a message with the public/private key
 * @param {number} msg Message
 * @param {number[]} key Key
 * @returns {number} Crypted/decrypted code
 * @see module:Security~RSA
 * @since 1.0
 * @func
 */
function cryptRSA (msg, key) { //Encrypt $msg with the public/private key $key to encrypt/decrypt the message
    return Math.pow(msg, key[1]) % key[0];
}

/**
 * @description RSA algorithm
 * @param {Str} msg Message to encrypt/decrypt
 * @param {number[]} keys RSA Key pair
 * @return {Str} Encrypted/decrypted message
 * @since 1.1
 * @func
 * @todo Make sure the RSA(RSA(<code>msg</code>, [n, e|d]), [n, d|e])=<code>msg</code>
 */
function RSA (msg, keys) {
    return msg.map(function (l) {
        return String.fromCharCode(abcModulus(cryptRSA(l.charCodeAt(0), keys)));
    })
}

/**
 * @description Generate a password
 * @returns {string} Password
 * @see module:Security~genHash
 * @since 1.0
 * @func
 */
function genPassword () {
    var chars = [], sym = ["&", "~", "\"", "#", "\'", "{", "[", "(", "-", "|", "`", "_", "\\", "^", "@", ")", "]", " + ", "=", "}", " % ", " * ", "?", ",", ";", ".", "/", ":", "!", " ", ""], word = "";
    for (var i = 65; i < 123; i++) {
        if (i <= 90 || i >= 97) chars[i - 65] = String.fromCharCode(i);
    }
    chars = chars.concat(sym, range(9)).remove();
    while (word.length < 20) word += chars.rand();
    if (word.length < 20) word += chars.rand();
    return word
}

/**
 * @description Generate a hash
 * @param {string} password Password
 * @param {boolean} [withRest=false] Add the rest of the hashing bits to the result
 * @todo To fix
 * @returns {string} Hash
 * @see module:Security~genPassword
 * @since 1.0
 * @func
 */
function genHash (password, withRest) {
    var hash = "", k = (821 - password.sum()) / password.prod() * password.charCodeAt(0).toNDigits(1), rest, c;
    for (var i = 0; i < password.length; i++) {
        rest = password.charCodeAt(i) + k.toNDigits(1) % 255;
        //c = clamp(password.charCodeAt(i) + k, 32, 126);
        c = Math.abs(password.charCodeAt(i) + k).toNDigits(1) + (withRest? rest: 0);
        if (c < 32) c += 48;
        //console.log("k= " + k + "\trest (" + password.charCodeAt(i) + " + " + k + ")=" + rest + "\tc=" + c);
        //console.log("Adjust: " + parseInt(48 + Math.round(password.charCodeAt(password.length - 1) / 10 + rest)));
        hash += String.fromCharCode(clamp(c % 127, 32, 126));
    }
    return (hash === password)? genHash(hash, true): hash;
}

/**
 * @description Hash a word (might deprecate genHash())
 * @param {string} word Word
 * @return {Str} hash
 * @since 1.1
 * @func
 */
function hash (word) {
    var m = word.mean(), s = getStep(word.split("").map(function (x) {
            return x.charCodeAt(0);
        }).min(), word.split("").map(function (x) {
            return x.charCodeAt(0);
        }).max()
    ), w = word.split("");
    var p = w.even().concat(w.odd()).join("").map(function (c) {
        return String.fromCharCode(abcModulus(c.charCodeAt(0) + s));
    }), mw = w.even().concat(w.odd()).join("");
    console.log("p", p, "\nmw", mw);
    return toFSHA(p.split("").portion(2).concat(p.split("").portion(-2)).join(""));
}

function unHash (hash) {
    var word = fromFSHA(hash).split("");
    /*
   P.portion(2).concat(P.portion(-2)).join("")
   Px = P.portion(2)
   Py = Px.concat(P.portion(-2))
   Py.join("")
    word =
     */

    return word.join("");
}

/**
 * @description String/array to Fake SHA hash
 * @param {Str} str String/array
 * @return {Str} Fake SHA hash
 * @func
 * @since 1.1
 */
function toFSHA (str) {
    return str.map(function (c) {
        return /[A-Za-z]/.test(c)? c: c.charCodeAt(0);
    });
}

/**
 * @description Fake SHA hash to string
 * @param {Str} fsha Fake SHA hash
 * @return {string} String
 * @todo Get it right
 * @func
 * @since 1.1
 */
function fromFSHA (fsha) {
    /*return fsha.map(function (c) {
     return /[A-Za-z]/.test(c)? c: String.fromCharCode(c);
     });*/
    var res = "";
    for (var i = 0; i < fsha.length; i++) {
        if (/[A-Za-z]/.test(fsha[i])) res += fsha[i];
        else if (/\d+/.test(fsha[i])) {
            var j = i + 1;
            while (j < fsha.length - 1 && /\d+/.test(fsha[j])) j++;
            res += String.fromCharCode(fsha.get(i, j - 1));
            i = j - 1;
        }
    }
    return res;
}