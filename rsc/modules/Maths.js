/**
 * @module Maths
 * @description Maths stuff
 * @version 1.0
 * @since 1.1
 * @license MIT
 * @author Maximilian Berkmann <maxieberkmann@gmail.com>
 * @copyright Maximilian Berkmann 2016
 * @requires module:essence
 * @requires Misc
 * @type {Module}
 * @exports Maths
 */
var Maths = new Module("Maths", "Maths stuff", ["Misc"]);

/* eslint no-undef: 0 */

/**
 * @description Exclusive or
 * @param {*} a Expression a
 * @param {*} b Expression b
 * @returns {boolean} a xor b
 * @since 1.0
 * @func
 */
function xor (a, b) {
    return (a && !b) || (!a && b)
}

/**
 * @description Converts <code>n</code> "times" to an appropriate formulation (if necessary)
 * @param {number} n Number
 * @returns {string} Literal
 * @since 1.0
 * @func
 */
function timesLiteral (n) {
    switch (n) {
        case 1: return "once";
        case 2: return "twice";
        default: return n + " times";
    }
}

/**
 * @description Random number generator
 * @param {number} min Minimum (inclusive)
 * @param {number} max Maximum (inclusive)
 * @param {boolean} [integer=false] Integer or float/double
 * @returns {number} Random number r&in;[<code>min</code>, <code>max</code>]
 * @since 1.0
 * @func
 */
function rand (min, max, integer) {
    return integer? Math.floor(Math.random() * (max - min + 1) + min): Math.random() * (max - min + 1) + min; //Math.random() * (max - min) / min doesn't works for min = 0
}

/**
 * @description Random number generator with 0 as the minimum
 * @param {number} max Maximum (inclusive)
 * @returns {number} Random number r&in;[0, <code>max</code>]
 * @see module:Maths~rand
 * @since 1.0
 * @func
 */
function randTo (max) {
    return rand(0, max, true); //To only have to use the max value and already knowing the rest
}

/**
 * @description Random number generator in a specific base
 * @param {number} min Minimum (inclusive)
 * @param {number} max Maximum (inclusive)
 * @param {number} [base=10] Base
 * @param {boolean} [integer=false] Integer or float/double
 * @returns {NumberLike} Random number r<sub><code>base</code></sub>&in;[<code>min</code><sub>10</sub>, <code>max</code><sub>10</sub>]
 * @see module:Maths~rand
 * @since 1.0
 * @func
 */
function baseRand (min, max, base, integer) { //Randomise a number in the selected base
    return parseFloat(rand(min, max, integer)).toString(base || 10)
}

/**
 * @description Dynamic random number generator (between two variables)
 * @param {number} var1 Variable #1
 * @param {number} var2 Variable #2
 * @param {boolean} [integer=false] Integer or float/double
 * @returns {number} Random number r&in;[min(<code>var1</code>, <code>var2</code>), max(<code>var1</code>, <code>var2</code>)]
 * @see module:Maths~rand
 * @since 1.0
 * @func
 */
function randVar (var1, var2, integer) {
    return rand(Math.min(var1, var2), Math.max(var1, var2), integer); //Setting the max and min for the rand() call
}

/**
 * @description Range random number generator
 * @param {number} len Length of the range
 * @param {boolean} [if0=false] If 0 is in the range or not
 * @returns {number} Random number r&in;[0||1, <code>len</code>(-1)]
 * @since 1.0
 * @func
 */
function lenRand (len, if0) {
    return Math.floor(Math.random() * (if0? len + 1: len)); //If the first term is 0 or 1
}

/**
 * @description Random float in [0, 1] with 16-bits of randomness as Math.random() creates repetitive patterns when applied over larger space.<br />
 * Source: Three.js
 * @returns {number} Random float
 * @since 1.0
 * @func
 * @see modume:Maths~random
 */
function random16 () {
    return (65280 * Math.random() + 255 * Math.random()) / 65535
}

/**
 * @description Generate a random double in [0, 1] with <code>bits</code>-bits of randomness to avoid repetitive patterns when using Math.random() on a large spaces.
 * @param bits
 * @return {number} Random double
 * @since 1.1
 * @func
 * @see modume:Maths~random16
 */
function random (bits) {
    if (!bits) bits = 32;
    return ((Math.pow(2, bits) - Math.pow(2, bits / 2)) * Math.random() + (Math.pow(2, bits / 2 - 1)) * Math.random()) / (Math.pow(2, bits) - 1)
}

/**
 * @description Random float in [-<code>range</code>/2, <code>range</code>/2].<br />
 * Source: Three.js
 * @param {number} range Range length
 * @returns {number} Random float
 * @since 1.0
 * @func
 */
function randFloatSpread (range) {
    return range * (.5 - Math.random())
}

/**
 * @description Generate an array of random numbers
 * @param {number} [n=10] Number of numbers
 * @param {number} [min=0] Minimum
 * @param {number} [max=100] Maximum
 * @param {boolean} [float=true] Floating point
 * @param {Bool} [base=false] Base
 * @returns {Array} Random number array where &forall;i&in;r, i&in;[<code>min</code>, <code>max</code>]<sub>(base)</sub>
 */
function randNum (n, min, max, float, base) {
    var r = [];
    for (var i = 0; i < (n || 10); i++) r[i] = base? conv(rand(min || 0, max || 100, !float || true), 10, base): rand(min || 0, max || 100, !float);
    return r
}

/**
 * @description Generate a nearly sorted array
 * @param {number} n Number of elements
 * @param {number} min Minimum
 * @param {number} max Maximum
 * @returns {Array} Nearly sorted array
 * @since 1.0
 * @func
 */
function genNearlySortedArr (n, min, max) {
    var aI = range(min, 1, max).slice(0, n), res = [], ic;
    ic = aI.getIncrement(0);
    for (var i = 0; i < aI.length; i++) {
        var r = randTo(ic);
        res.push(aI[i]);
        if (i > 0 && r === 0) swap(res, i, i - 1);
        else if (i > 1 && r === ic) swap(res, i, i - 2);
    }
    return res
}

/**
 * @description Sum squared
 * @param {number[]} arr Array of numbers
 * @param {number} [nbDec=2] Number of decimals
 * @returns {*} Sum squared
 * @since 1.0
 * @func
 */
function sumPow2 (arr, nbDec) {
    if (!isType(arr, "Array")) return false;
    return arr.map(function (x) {
        return x * x;
    }).sum().toNDec(nbDec)
}

/**
 * @description Base conversion
 * @param {NumberLike} n Number to convert
 * @param {number} [from=2] Initial base
 * @param {number} [to=10] Final base
 * @param {boolean} [float=false] FPR or not
 * @returns {NumberLike} Conversion: n<sub>from</sub>&rArr;r<sub>to</sub>
 * @since 1.0
 * @func
 */
function conv (n, from, to, float) {
    return float? parseFloat(n, from || 2).toString(to || 10): parseInt(n, from || 2).toString(to || 10)
}

/**
 * @description Negate a binary number using 2's complement
 * @param {NumberLike} bin Binary number
 * @param {boolean} [toArr=false] To array
 * @returns {NumberLike[]|NumberLike} Negated binary number
 * @since 1.0
 * @func
 */
function negateBin (bin, toArr) {
    var n = [];
    for(var i = 0; i < bin.length; i++) n[i] = 1 - parseInt(bin[i]);
    var dec = conv(n.join(""));
    dec++;
    return toArr? conv(dec, 10, 2).split(""): conv(dec, 10, 2)
}

/**
 * @description Floating point binary number to decimal number
 * @param {string} bin Binary number
 * @returns {number} Decimal number
 * @since 1.0
 * @func
 * @throws {Error} Invalid binary number
 */
function floatingPtBin (bin) {
    //%= .05859375 (sign) + .27734375 (exponent) + .6640625 (mantissa)
    /* Lookup table aid
     var s = new Stream(8, "x*2", 5);
     table(s.data.map(function (x) {
     return [(.05859375 * x), (.27734375 * x), (.6640625 * x), (.05859375 * x) + (.27734375 * x) + (.6640625 * x)];
     }))
     S/E/M              (x2/x??/x??)
     1/4/3 (8bit) -%> .125/.5/.375
     1/6/9 (16bit) -%> .0625/.375/.5625
     1/8/23 (32bit) -%> .03125/.25/.71875
     1/11/52 (64bit) -%> .015625/.171875/.8125
     1/14/112 (128bit) -%> .0078125/.109375/.875
     1/x/y (Nbit) -%> .0484375/.28125/.66875 => .9984375
     var s = new Stream(8, "x*2", 5);
     table(s.data.map(function (x) {
     return [1, (.3212890625 * x), (.6787109375 * x), (.3212890625 * x) + (.6787109375 * x)];
     }))
     */
    var s = (bin[0] === 1)? -1: 1, e, m, mLoop = function (x, M) {
        var res = 0;
        for (var i = 0; i < M; i++) res += parseInt(x[i]) * Math.pow(2, -i - 1);
        return res;
    }; //sign, exponent, mantissa
    switch(bin.length) {
        case 8:
            e = ((bin[1] === 1)? 1: -1) * conv(bin.get(2, 4));
            m = mLoop(bin.get(5), 3);
            break;
        case 16:
            e = ((bin[1] === 1)? 1: -1) * conv(bin.get(2, 6));
            m = mLoop(bin.get(7), 9);
            break;
        case 32:
            e = ((bin[1] === 1)? 1: -1) * conv(bin.get(2, 8));
            m = mLoop(bin.get(9), 23);
            break;
        case 64:
            e = ((bin[1] === 1)? 1: -1) * conv(bin.get(2, 11));
            m = mLoop(bin.get(12), 52);
            break;
        case 128:
            e = ((bin[1] === 1)? 1: -1) * conv(bin.get(2, 14));
            m = mLoop(bin.get(15), 112);
            break;
        default:
            throw new Error("Invalid binary number");
    }
    return s * Math.pow(2, e) * m;
}

/**
 * @description Minute to decimal
 * @param {number} min Minutes
 * @returns {number} Decimals
 * @see module:Maths~dec2min
 * @since 1.0
 * @func
 */
function min2dec (min) { //Minute to decimal
    return (50 * min) / 30
}

/**
 * @description Decimal to minute
 * @param {number} dec Decimals
 * @returns {number} Minutes
 * @see module:Maths~min2dec
 * @since 1.0
 * @func
 */
function dec2min (dec) {
    return (30 * dec) / 50
}

/**
 * @description Time to second
 * @param {string} i Time ([hh:]mm:ss.xx[x])
 * @returns {number} Seconds
 * @see module:Maths~sec2time
 * @since 1.0
 * @func
 */
function toS (i) {
    if (i == parseFloat(i)) return parseFloat(i);
    var withH = i.count(":") === 2;
    if (!i) i = withH? "00:00:00.000": "00:00.000"; //Avoid having errors
    if (!isType(i, "String")) i += "";
    if (i.length >= 4 && i.indexOf(":") == 1) return toS("0" + i); //So times without the leading 0 or simply with a 1-digit first section could be read properly

    var t = i.split(":");

    if (withH) {
        var h, m, s; //Any parts that need to be extracted
        h = parseInt(t[0]); //The first section: hour
        m = parseInt(t[1]); //The second section: min
        s = parseFloat(t[2]); //The third section: sec
        return h * 3600 + m * 60 + s.toNDec();
    } else {
        m = parseInt(t[0]); //The first section: min
        s = parseFloat(t[1]); //The second section: sec
        return m * 60 + s;
    }
}

/**
 * @description Seconds to time
 * @param {string} i Seconds
 * @param {boolean} [withH=false] Include hours
 * @returns {string} Time
 * @see module:Maths~toS
 * @since 1.0
 * @func
 */
function sec2time (i, withH) {
    var h = 0, m = 0, s = i;
    if (withH) {
        s = (i % 60).toNDigits();
        h = (i >= 3600)? Math.floor(i / 3600): 0;
        m = Math.floor((i - s - 3600 * h) / 60);
        m = (m <= 0)? "00": m.toNDigits();
        h = (h <= 0)? "00": h.toNDigits();
        return h + ":" + m + ":" + s.toNDec().toNDigits(); ////Return the result as h:min:s.ms
    } else {
        s = (i % 60).toNDigits();
        m = Math.floor(i / 60).toNDigits();
        return (m <= 0)? s: m + ":" + s.toNDec().toNDigits(); //Return the result as min:s.ms
    }
}

/**
 * Alias/Shortcut
 * @alias sec2time
 * @since 1.0
 * @func
 */
var s2t = sec2time;

/**
 * @description Convert a mark (out of <code>initTotal</code>) to an other (out of <code>endTotal</code>)
 * @param {number} mark Mark
 * @param {number} initTotal Initial total
 * @param {number} [endTotal=100] Final total
 * @param {number} [nbDec=2] Number of decimals
 * @returns {number} Converted mark: <code>mark</code>/<code>initTotal</code> &rArr; r/<code>endTotal</code>
 * @since 1.0
 * @func
 */
function markConv (mark, initTotal, endTotal, nbDec) {
    return (mark / initTotal * (endTotal || 100)).toNDec(nbDec || 2)
}

/**
 * @description Nth-root calculator
 * @param {number} x Number
 * @param {number} n Root
 * @param {number} [nbDec=20] Number of decimals
 * @returns {number} Nth-root
 * @since 1.0
 * @func
 */
function nthroot (x, n, nbDec) {
    var r = getClosestRoot(x, n);
    for(var i = 0; i < 60; i++) r += (x - Math.pow(r, n)) / (Math.pow(r + 1, n) - Math.pow(r, n));
    return r.toNDec(nbDec || 20)
}

/**
 * @description Logarithm (log<sub><code>y</code></sub>(<code>x</code>))
 * @param {number} x Number
 * @param {number} [y=10] Base
 * @returns {number} Result
 * @since 1.0
 * @func
 */
function log (x, y) {
    return Math.log(x) / Math.log(y || 10)
}

/**
 * @description Neperian Logarithm
 * @param {number} x Number
 * @returns {number} Neperian logarithm
 * @see module:Maths~log
 * @since 1.0
 * @func
 */
function ln (x) {
    return log(x, Math.E);
}

/**
 * @description Greatest Common Divisor
 * @param {number} a Number a
 * @param {number} b Number b
 * @returns {number} GCD
 * @since 1.0
 * @func
 */
function gcd (a, b) {
    return b? gcd(b, a % b): Math.abs(a)
}

/**
 * @description Least Common Multiplier
 * @param {number} a Number a
 * @param {number} b Number b
 * @returns {number} LCM
 * @since 1.1
 * @func
 */
function lcm (a, b) {
    var multiple = a;
    range(a, 1, b).forEach(function(n) {
        multiple = (multiple * n) / gcd(multiple, n);
    });

    return multiple;
}

/**
 * @description Binomial distribution X~Bin(<code>n</code>, <code>p</code>)
 * @param {number} n Total number of attempts
 * @param {number} p Success probability
 * @param {number} r Number of attempts
 * @returns {number} Binomial distribution P(x=<code>r</code>)
 * @since 1.0
 * @func
 */
function Bin (n, p, r) { //Binomial distrib. where X~Bin(n, p) and it returns P(X = r)
    return C(n, r) * Math.pow(p, r) * Math.pow(1 - p, n - r)
}

/**
 * @description Cumultative binomial distribution (P(X<r)?)
 * @param {number} n Total number of attempts
 * @param {number} p Success probability
 * @param {number} r Number of attempts
 * @returns {number} Cumultative binomial distribution
 * @see module:Maths~Bin
 * @since 1.0
 * @func
 */
function BinCumul (n, p, r) { //P(X < r) ?
    var res = [];
    for (var i = 0; i < r; i++) res.push(Bin(n, p, r));
    return res.sum();
}

/**
 * @description Cumulative binomial distribution (P(X&le;r))
 * @param {number} n Total number of attempts
 * @param {number} p Success probability
 * @param {number} r Number of attempts
 * @returns {number} Cumulative binomial distribution
 * @see module:Maths~Bin
 * @since 1.0
 * @func
 */
function BinCumulLT (n, p, r) { //P(X <= r) (adapted from http://stackoverflow.com/questions/1095650/how-can-i-efficiently-calculate-the-binomial-cumulative-distribution-function)
    var x = 1 - p, a = n - r, b = r + 1, c = a + b - 1, res = 0;
    for (var i = a; i < c + 1; i++) res += factorial(c) / (factorial(i) * factorial(c - i)) * Math.pow(x, i) * Math.pow((1 - x), c - i);
    return res;
}

/**
 * @description Normal distribution Z~N(0, 1)
 * @summary normalcdf(x)
 * @param {number} x Number
 * @returns {number} Normal distribution P(z<-abs(<code>x</code>))
 * @see module:Maths~StdNorm
 * @since 1.0
 * @func
 */
function Norm (x) { //P(z < x) where Z~N(0, 1) (or P(z>-x) if x is positive) === normalcdf(x)
    var t = 1 / (1 + .2316419 * Math.abs(x));
    var d = .3989423 * Math.exp(-x * x / 2);
    var p = d * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return p.toNDec(4)
}

/**
 * @description Standard normal distribution Z~N(<code>m</code>, <code>sd</code>)
 * @param {number} m Mean
 * @param {number} sd Standard deviation
 * @param {number} x Number
 * @returns {number} Standard normal distribution
 * @see module:Maths~Norm
 * @since 1.0
 * @func
 */
function StdNorm (m, sd, x) {
    return Norm((x - m) / sd); //P(Z<(x-m)/sd)
}

/**
 * @description Inverse of Norm(r)=<code>x</code> (Inverse Normal CDF)
 * @param {number} x Normal distribution
 * @return {number} r of <code>x</code>=Norm(r)
 * @constructor
 */
function InvNorm (x) {
    var a = [2.50662823884,	-18.61500062529, 41.39119773534, -25.44106049637], b = [-8.47351093090,	23.08336743743, -21.06224101826, 3.13082909833], c = [.3374754822726147, .9761690190917186,	.1607979714918209, .0276438810333863,	.0038405729373609,	.0003951896511919, .0000321767881768, .0000002888167364, .0000003960315187], y = x - .5, absY = Math.abs(y), sqY = y * y, res;

    //Beasley-Springer function
    if (absY < .42) res = y * (((a[3] * sqY + a[2]) * sqY + a[1]) * sqY + a[0]) / ((((b[3] * sqY +b[2]) * sqY + b[1]) * sqY + b[0]) * sqY + 1);
    else { //Moro function
        res = Math.log(-Math.log(y > 0? 1 - x: x));
        res = c[0] + res * (c[1] + res * (c[2] + res * (c[3] + res * (c[4] + res * (c[5] + res * (c[6] + res * (c[7] + res * c[8])))))));
        if (y < 0) res = -res;
    }
    return res;
}

/**
 * @description Poisson distribution X~Po(<code>l</code>, <code>x</code>)
 * @param {number} l Lambda
 * @param {number} x Number
 * @returns {number} Poisson distribution
 * @since 1.0
 * @func
 */
function Po (l, x) {
    return (Math.exp(-l) * Math.pow(l, x)) / factorial(x).toNDec(4)
}

/**
 * @description Cumultative poisson distribution
 * @param {number} l Lambda
 * @param {number} x Number
 * @returns {number} Cumulative poisson distribution
 * @see module:Maths~PoCumul
 * @todo To revisit
 * @since 1.0
 * @func
 */
function PoCumul (l, x) {
    /*var res = [];
    for (var i = 0; i < l; i++) res.push(Po(l, x));
    return res.sum();*/
    return Po(l, x) * l;
}

/**
 * @description factorial x!
 * @param {number} x Number
 * @returns {*} x!
 * @since 1.0
 * @func
 */
function factorial (x) {
    return (x <= 1)? x: x * factorial(x - 1)
}

/**
 * @description Combination/choose (&complement;)
 * @param {number} n Total
 * @param {number} r Number
 * @returns {number} n&complement;r
 * @see module:Maths~factorial
 * @since 1.0
 * @func
 */
function C (n, r) {
    return factorial(n) / (factorial(r) * factorial(n - r))
}

/**
 * @description Binomial to Normal distribution
 * @param {number} n Total number of attempts
 * @param {number} p Success probability
 * @param {number} r Number of attempts
 * @param {string} sign Sign used in the expression
 * @returns {number} Normal distribution
 * @see module:Maths~Bin
 * @see module:Maths~Norm
 * @since 1.0
 * @func
 */
function Bin2Norm (n, p, r, sign) {
    if (n * p > 5 && n * (1 - p) > 5) {
        r += (sign === ">=")? -.5: .5; //Continuity correction
        return StdNorm(n * p, Math.sqrt(n * p * (1 - p)), r)
    } else return false
}

/**
 * @description Binomial to Poisson distribution
 * @param {number} n Total number of attempts
 * @param {number} p Success probability
 * @param {number} r Number of attempts
 * @returns {Bool} Poisson distribution
 * @see module:Maths~Bin
 * @see module:Maths~Po
 * @since 1.0
 * @func
 */
function Bin2Po (n, p, r) {
    return (n > 50 && p < .1)? Po(n * p, r): false;
}

/**
 * @description Poisson to Normal distribution
 * @param {number} l Lambda
 * @param {number} x Number
 * @returns {Bool} Normal distribution
 * @see module:Maths~Po
 * @see module:Maths~Norm
 * @since 1.0
 * @func
 */
function Po2Norm (l, x) {
    return (l > 10)? StdNorm(l, Math.sqrt(x), x): false;
}

/**
 * @description Gaussian Error.<br />
 * Source: {@link http://stackoverflow.com/questions/1095650/how-can-i-efficiently-calculate-the-binomial-cumulative-distribution-function}
 * @param {number} z Number
 * @returns {number} Gaussian error
 * @since 1.0
 * @func
 */
function erf (z) {
    var t = 1/(1 + .5 * Math.abs(z)), res;
    res = 1 - t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * ( 0.37409196 + t * ( 0.09678418 + t * (-0.18628806 + t * ( 0.27886807 + t * (-1.13520398 + t * ( 1.48851587 + t * (-0.82215223 + t * ( 0.17087277))))))))));
    return z > 0? res: -res;
}

/**
 * @description Normal estimate.<br />
 * Source: {@link http://stackoverflow.com/questions/1095650/how-can-i-efficiently-calculate-the-binomial-cumulative-distribution-function}
 * @param {number} n Total number of attempts
 * @param {number} p Success probability
 * @param {number} r Number of attempts
 * @returns {number} Normal estimate
 * @see module:Maths~erf
 * @since 1.0
 * @func
 */
function NormEstimate (n, p, r) {
    var u = n * p, o;
    o = Math.pow(u * (1 - p), .5);
    return .5 * (1 + erf((r - u) / (o * Math.pow(2, .5))));
}

/**
 * @description Clamp values to keep them within a range [<code>a</code>; <code>b</code>]
 * @param {number} x Number
 * @param {number} a Lowest bound
 * @param {number} b Highest bound
 * @returns {number} Clamped number
 * @since 1.0
 * @see module:Maths~revClamp
 * @func
 */
function clamp (x, a, b) {
    return (x < a)? a: ((x > b)? b: x)
}

/**
 * @description Clamp values to keep them within a range ]-Inf; a]&Union;[b; Inf[
 * @param {number} x Number
 * @param {number} a Lowest inner bound
 * @param {number} b Highest inner bound
 * @returns {number} Clamped number
 * @since 1.0
 * @see module:Maths~clamp
 * @func
 */
function revClamp(x, a, b) {
    return (a <= x && x <= b)? getClosest(x, [a, b]): x;
}

/**
 * @description Clamp values to keep them within the range [a; Inf[
 * @param {number} x Number
 * @param {number} a Lowest bound
 * @returns {number} Clamped value
 * @see module:Maths~clamp
 * @see module:Maths~clampTop
 * @since 1.0
 * @func
 */
function clampBottom (x, a) {
    return (x < a)? a: x
}

/**
 * @description Clamped values to keep them within the range ]-Inf; b]
 * @param {number} x Number
 * @param {number} b Highest bound
 * @returns {number} Clamped valued
 * @see module:Maths~clamp
 * @since 1.0
 * @func
 */
function clampTop (x, b) {
    return (x > b)? b: x
}

/**
 * @description Keeps an ascii code in the alphabetical range in the ascii table
 * @param {number} code Ascii code
 * @returns {number} Clamped code
 * @since 1.0
 * @func
 */
function abcClamp(code) {
    return code === 32? 32: revClamp(clamp(code, 65, 122), 90, 97);
}

/**
 * @description Linear mapping from range [<code>a1</code>; <code>a2</code>] to range [<code>b1</code>; <code>b2</code>].
 * @param {number} x Number
 * @param {number} a1 Lowest initial bound
 * @param {number} a2 Highest initial bound
 * @param {number} b1 Lowest final bound
 * @param {number} b2 Highest final bound
 * @returns {number} Mapped value
 * @since 1.0
 * @func
 */
function mapLinear (x, a1, a2, b1, b2) {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1)
}

/**
 * @description Degree to radiant
 * @param {number} deg Degrees (°)
 * @returns {number} Radiant (rad)
 * @see module:Maths~rad2deg
 * @since 1.0
 * @func
 */
function deg2rad (deg) {
    return deg * Math.PI / 180
}

/**
 * @description Radiant to degree
 * @param {number} rad Radiant (rad)
 * @returns {number} Degree (°)
 * @see module:Maths~deg2rad
 * @since 1.0
 * @func
 */
function rad2deg (rad) {
    return rad * 180 / Math.PI
}

/**
 * @description Celsius to fahrenheit
 * @param {number} cel Celsius (°C)
 * @returns {number} Fahrenheit (°F)
 * @see module:Maths~fahr2cels
 * @since 1.0
 * @func
 */
function cels2fahr (cel) {
    return cel * 33.8
}

/**
 * @description Fahrenheit to celsius
 * @param {number} fahr Fahrenheit (°F)
 * @returns {number} Celsius (°C)
 * @see module:Maths~fahr2cels
 * @since 1.0
 * @func
 */
function fahr2cels (fahr) {
    return fahr / 33.8
}

/**
 * @description Check if <code>x</code> is a prime number
 * @param {number} x Number
 * @return {boolean}
 * @since 1.1
 * @func
 */
function isPrime (x) {
    return primeN(range(1, 1, x)).has(x);
}

/**
 * @description Return the prime numbers of <code>arr</code> where non prime numbers that doesn't have divisors in the array are considered prime numbers
 * @param {number[]} arr Array
 * @returns {Array} Prime numbers
 * @see module:Maths~primeCheck
 * @since 1.0
 * @func
 */
function primeN (arr) {
    var res = arr.quickSort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 0 && arr[i] != 2) res[i] = "x";
        for (var j = 0; j < i; j++) {
            if (primeCheck(res[j], res[i])) res[i] = "x";
        }
    }
    return res.remove("x")
}

/**
 * @description Primeness check of <code>a</code> toward <code>b</code>
 * @param {number} a Number a
 * @param {number} b Number b
 * @returns {boolean} Primeness
 * @see module:Maths~primeN
 * @since 1.0
 * @func
 */
function primeCheck (a, b) {
    return (a > 1 && b > 1 && b % a === 0 && b != a)
}

/**
 * @description Get the closest whole <code>n</code>th-root of <code>x</code>
 * @param {number} x Number
 * @param {number} n Nth-root
 * @returns {number} Closest root
 * @since 1.0
 * @func
 */
function getClosestRoot (x, n) {
    if (!n) n = 2;
    var rof = 0, er = 0;

    if ((x / 2 * x / 2) / 2 - 2 <= x) rof = x / 2;
    else if (x / 3 * x / 3 <= x) rof = x / 3;
    else rof = x / 4;
    if (Math.pow(rof, n) === x) return rof;

    for (var p = 1; p <= n; p++) {
        for (var i = 1; i < x; i++) {
            if (Math.pow(i, p) === x || Math.pow(i, p - 1) * i === x) er = i;
            else if (Math.pow(i, p) > x || Math.pow(i, p - 1) * i > x) er = i - .5;
        }
    }
    if (Math.pow(er, n) <= x) return er;
    else er = (Math.pow(n, -2) + x / Math.pow(n, 4)-x / Math.pow(n, 5) + Math.pow(x, n) / (Math.pow(n, Math.pow(n, 3) + 3)) + x / Math.pow(n, 2)) / 2;
    if (Math.pow(er, n) > x) er = (er + rof) / 2;
    var res = [rof, er, (x / er + er) / 2, (er + rof) / 2];
    var resMap = res.map(function (x) {
        return Math.pow(x, n);
    });
    return res[resMap.lookFor(getClosest(x, resMap))] * .9956973041;
}

/**
 * @description Simple interest
 * @param {number} po Balance
 * @param {number} i Interest
 * @param {number} [t=1] Time (in years)
 * @returns {number} Resulting balance
 * @see module:Maths~compoundInterest
 * @since 1.0
 * @func
 */
function simpleInterest (po, i, t) {
    return po * (1 + i * (t || 1))
}

/**
 * @description Compound interest
 * @param {number} po Balance
 * @param {number} i Interest
 * @param {number} [t=1] Time (in years)
 * @param {number} n Time divisions
 * @returns {number} Resulting balance
 * @see module:Maths~simpleInterest
 * @since 1.0
 * @func
 */
function compoundInterest (po, i, t, n) {
    return n > 1? po * Math.pow(1 + i / n, (t || 1) * n): po * Math.pow(1 + i, (t || 1))
}

/**
 * @description Everything but not 0
 * @param {number} x Number
 * @returns {!number} Non-null number
 * @see module:essence~Essence.eps
 * @since 1.0
 * @func
 */
function non0 (x) {
    return (x === 0)? Essence.eps: x;
}

/**
 * @description Fraction form of n.<br />
 * Source: somewhere
 * @param {number} n Number
 * @param {number} prec Precision
 * @param {boolean} [up=false] Round up
 * @returns {string} Fraction
 * @since 1.0
 * @func
 */
function toFrac (n, prec, up) {
    var s = n.toString(), p = s.indexOf(".");
    if (p === -1) return s;

    var i = Math.floor(n) || "", dec = s.substring(p),  m = prec || Math.pow(10, dec.length - 1), num = up? Math.ceil(dec * m): Math.round(dec * m), den = m,
        g = gcd(num, den);

    if (den / g === 1) return String(i + (num / g));
    if (i) i += " and ";
    return i + String(num / g) + "/" + (den / g)
}

/**
 * @description Makes a number more readable
 * @param {number} n Number
 * @param {number} [nDec=3] Number of decimals
 * @param {boolean} [usFormat=false] US format
 * @returns {string} Clear number
 * @since 1.0
 * @func
 */
function clearNum (n, nDec, usFormat) {
    var sps = (Math.floor(n) + "").length/3, str = "";
    for (var i = 0; i < sps; i++) {
        str = ((n - n % Math.pow(1000, i)) % Math.pow(1000, i + 1)) / Math.pow(1000, i) + " " + str;
    }
    str = str.split(" ");
    str.pop();
    return str.join(usFormat? ",": " ") + (n % 1).toNDec(nDec || 3)
}

/**
 * @description Get the increment value from $a to $b
 * @param {number} a Minimum
 * @param {number} b Maximum
 * @param {number} [nbDec] Number of decimals
 * @returns {number} Step
 * @see external:Array.getIncrement
 * @since 1.0
 * @func
 */
function getStep (a, b, nbDec) {
    return [a, b].getIncrement(nbDec)
}

/**
 * @description Quadratic equation solver
 * @param {number} a Constant a
 * @param {number} b Constant b
 * @param {number} c Constant c
 * @param {number} [nDec] Number of decimals
 * @returns {number|NumberLike[]} Solutions
 * @since 1.0
 * @func
 */
function quadraticSolver (a, b, c, nDec) {
    var d = Math.sqrt(b, 2) - 4 * a * c;
    return d === 0? (-b / (2 * a)).toNDec(nDec): [((-b - Math.sqrt(Math.abs(d))) / (2 * a) + (d < 0? "i": 0)).toNDec(nDec), (-b + Math.sqrt(Math.abs(d)))/(2 * a) + (d < 0? "i": 0).toNDec(nDec)]
}

/**
 * @description Solve equations with a given formula and the result (e.g: x + y + x = res) and the range [<code>a</code>, <code>b</code>]
 * @param {string} formula Formula
 * @param {Array} res Result(s)
 * @param {number} a Lowest bound
 * @param {number} b Highest bound
 * @returns {Array} Results
 * @since 1.0
 * @func
 */
function eqSolver (formula, res, a, b) {
    a = a || -100;
    b = b || 200;
    var  r= mkArray(a > 0? b - a: b - a + 1, 2, 1);
    //Translation from text to commands or to a computer readable string for eval()
    //Str.replace(/([A-z]|[0-9])\x29$/m, "m") for end )
    //Str.replace(/^\x28([A-z]|[0-9])/m, "m") for start (
    if (formula.search(/\^[0-9]/g)>0) { //Look for a ^n
        /* if (formula.charAt(formula.search(/\^[0-9]/g)-1) == ")") {
         formula = formula.replace(/^\(/m, "Math.pow(");
         formula = formula.replace(/\)\^[0-9]/g, [A-z] + );
         } else {
         formula = formula.replace(/^\(/m, "Math.pow(");
         formula = formula.replace(/\^[0-9]/g, [A-z] + );
         } */
        /* propposed by Jhonatan Sneider Salguero Villa
         [(]. * ?[)] (very simplistic, what is inside might not be a math expression)
         \d + \.\d+ (float)
         \d+ (int)
         [a-z]+ (variable)
         */
        var expr = "([(]. * ?[)]|\\d + \\.\\d + |\\d + |[a-z] + )";
        var reg = new RegExp(expr + "\\^" + expr);
        formula = formula.replace(reg, "Math.pow($1, $2)");
    }else if (formula.search(/e\^/g)>0) { //Look for a e^
        expr = "([(]. * ?[)]|\\d + \\.\\d + |\\d + |[a-z] + )";
        reg = new RegExp("e\\^" + expr);
        formula = formula.replace(reg, "Math.exp($1)");
    }
    Essence.say("Formula now converted to %c" + formula, "info", "color: #00f;");
    //Brute force using any values within [a, b]
    for (var x = a; x <= b; x++) {
        for (var y = a; y <= b; y++) {
            r[x][y] = "(" + x+"," + y+") " + eval(formula);
        }
    }
    return r.filter(function (n) {
        if (n.split(") ")[1] == res) return n.split(") ")[0] + ")"
    }); //Filter out the values which doesn't match the result and returns only (x, y)
}


/**
 * @description Manual equation solver
 * @param {string} eq Equation
 * @param {number} max Upper limit
 * @param {number} dim Dimension (1: x, 2: x/y, 3: x/y/z)
 * @param {number} r Result of one of the sides
 * @returns {Array} Result(s)
 * @since 1.0
 * @func
 */
function manuEqSolver (eq, max, dim, r) {
    var res = mkArray(max + 1, dim, 1), p = [];
    for (var x = 0; x < res.length; x++) {
        if (dim === 2) {
            for (var y = 0; y < res.length; y++) {
                res[x][y] = eval(eq);
                if (res[x][y] === r) p.push("x = " + x + ", y = " + y);
            }
        } else if (dim === 3) {
            for (y = 0; y < res.length; y++) {
                for (var z = 0; z < res.length; z++) {
                    res[x][y][z] = eval(eq);
                    if (res[x][y][z] === r) p.push("x = " + x + ", y = " + y + ", z = " + z);
                }
            }
        } else {
            res[x] = eval(eq);
            if (res[x] === r) p.push("x = " + x);
        }
    }
    return p
}

/**
 * @description Remove the text from the string to keep the numbers
 * @param {string} x String
 * @returns {number} Number
 * @since 1.0
 * @func
 */
function getNumFromStr (x) {
    return isNon(x)? NaN: parseFloat(x.replace(/[A-Za-z_ ]+/g, ""))
}

/**
 * @description <code>x</code> unit to <code>y</code> px.<br />
 * Reference/help: {@link http://www.endmemo.com/sconvert/centimeterpixel.php}
 * @param {string} x Number with a unit
 * @returns {number} Pixels
 * @see module:Maths~fromPixel
 * @since 1.0
 * @func
 */
function toPixel (x) {
    var m = 1;
    switch (x.substring(String(getNumFromStr(x)).length, x.length).remove(" ")) {
        case "em":
            m = 16;
            break;
        case "km":
            m = 3779527.5593333;
            break;
        case "hm":
            m = 377952.75593333;
            break;
        case "m":
            m = 3779.5275593333;
            break;
        case "dm":
            m = 377.95275593333;
            break;
        case "cm":
            m = 37.795275593333;
            break;
        case "mm":
            m = 3.7795275593333;
            break;
        case "ɥm":
            m = 0.0037795275593333;
            break;
        case "nm":
            m = 3.7795275593333e-6;
            break;
        case "ex":
            m = 7.156;
            break;
        case "in":
            m = 96;
            break;
        case "pt":
            m = 1.3333333333333;
            break;
        case "pc":
            m = 16;
            break;
        case "ft":
            m = 1152;
            break;
        case "twip":
            m = 15;
            break;
        case "mi":
            m = 6082636.631643;
            break;
        case "yd":
            m = 3456.043540706;
            break;
        default: break;
    }
    return getNumFromStr(x) * m
}

/**
 * @description X px to y unit
 * @param {number} x Pixels
 * @param {string} unit Unit
 * @returns {string} Conversion
 * @see module:Maths~toPixel
 * @since 1.0
 * @func
 */
function fromPixel (x, unit) {
    var m = 1;
    switch (unit) {
        case "em":
            m = 1 / 16;
            break;
        case "km":
            m = 1 / 3779527.5593333;
            break;
        case "hm":
            m = 1 / 377952.75593333;
            break;
        case "m":
            m = 1 / 3779.5275593333;
            break;
        case "dm":
            m = 1 / 377.95275593333;
            break;
        case "cm":
            m = 1 / 37.795275593333;
            break;
        case "mm":
            m = 1 / 3.7795275593333;
            break;
        case "ɥm":
            m = 1 / .0037795275593333;
            break;
        case "nm":
            m = 1 / 3.7795275593333e-6;
            break;
        case "ex":
            m = 1 / 7.156;
            break;
        case "in":
            m = 1 / 96;
            break;
        case "pt":
            m = 1 / 1.3333333333333;
            break;
        case "pc":
            m = 1 / 16;
            break;
        case "ft":
            m = 1 / 1152;
            break;
        case "twip":
            m = 1 / 15;
            break;
        case "mi":
            m = 1 / 6082636.631643;
            break;
        case "yd":
            m = 1 / 3456.043540706;
            break;
        default: break;
    }
    return x * m + unit
}

/**
 * @description Unit converter
 * @param {string} x Number with unit
 * @param {string} unit Final unit
 * @returns {string} <code>x</code> &rArr; <code>y</code> <code>unit</code>
 * @see module:Maths~fromPixel
 * @see module:Maths~toPixel
 * @since 1.0
 * @func
 */
function convUnit (x, unit) {
    return fromPixel(toPixel(x), unit); //demux(.* , px)->mux(px, .* )
}

/**
 * @description X size to y bits
 * @param {string} x Number with a size unit
 * @returns {number} Bits
 * @see module:Maths~fromBit
 * @since 1.1
 * @func
 */
function toBit (x) {
    var m = 1;
    switch (x.substring(String(getNumFromStr(x)).length, x.length).remove(" ")) {
        case "Kb":
            m = 1e-3;
            break;
        case "Mb":
            m = 1e-6;
            break;
        case "Gb":
            m = 1e-9;
            break;
        case "Tb":
            m = 1e-12;
            break;
        case "Pb":
            m = 1e-15;
            break;
        case "Eb":
            m = 1e-18;
            break;
        case "Zb":
            m = 1e-21;
            break;
        case "Yb":
            m = 1e-24;
            break;
        case "o":
            m = 8;
            break;
        case "Ko":
            m = 8e-3;
            break;
        case "Mo":
            m = 8e-6;
            break;
        case "Go":
            m = 8e-9;
            break;
        case "To":
            m = 8e-12;
            break;
        case "Po":
            m = 8e-15;
            break;
        case "Eo":
            m = 8e-18;
            break;
        case "Zo":
            m = 8e-21;
            break;
        case "Yo":
            m = 8e-24;
            break;
        case "Kio":
            m = 8 * Math.pow(2, -10);
            break;
        case "Mio":
            m = 8* Math.pow(2, -20);
            break;
        case "Gio":
            m = 8 * Math.pow(2, -30);
            break;
        case "Tio":
            m = 8 * Math.pow(2, -40);
            break;
        case "Pio":
            m = 8 * Math.pow(2, -50);
            break;
        case "Eio":
            m = 8 * Math.pow(2, -60);
            break;
        case "Zio":
            m = 8 * Math.pow(2, -70);
            break;
        case "Yio":
            m = 8 * Math.pow(2, -80);
            break;
        case "Kib":
            m = Math.pow(2, -10);
            break;
        case "Mib":
            m = Math.pow(2, -20);
            break;
        case "Gib":
            m = Math.pow(2, -30);
            break;
        case "Tib":
            m = Math.pow(2, -40);
            break;
        case "Pib":
            m = Math.pow(2, -50);
            break;
        case "Eib":
            m = Math.pow(2, -60);
            break;
        case "Zib":
            m = Math.pow(2, -70);
            break;
        case "Yib":
            m = Math.pow(2, -80);
            break;
        default: m = 1;
    }
    return getNumFromStr(x) * m
}

/**
 * @description X bit to y unit
 * @param {number} x Bits
 * @param {string} unit Unit
 * @returns {string} Conversion
 * @see module:Maths~toBit
 * @since 1.1
 * @func
 */
function fromBit (x, unit) {
    var m = 1;
    switch (unit) {
        case "Kb":
            m = 1e3;
            break;
        case "Mb":
            m = 1e6;
            break;
        case "Gb":
            m = 1e9;
            break;
        case "Tb":
            m = 1e12;
            break;
        case "Pb":
            m = 1e15;
            break;
        case "Eb":
            m = 1e18;
            break;
        case "Zb":
            m = 1e21;
            break;
        case "Yb":
            m = 1e24;
            break;
        case "o":
            m = 1 / 8;
            break;
        case "Ko":
            m = 1e3 / 8;
            break;
        case "Mo":
            m = 1e6 / 8;
            break;
        case "Go":
            m = 1e9 / 8;
            break;
        case "To":
            m = 1e12 / 8;
            break;
        case "Po":
            m = 1e15 / 8;
            break;
        case "Eo":
            m = 1e18 / 8;
            break;
        case "Zo":
            m = 1e21 / 8;
            break;
        case "Yo":
            m = 1e24 / 8;
            break;
        case "Kio":
            m = Math.pow(2, 10) / 8;
            break;
        case "Mio":
            m = Math.pow(2, 20) / 8;
            break;
        case "Gio":
            m = Math.pow(2, 30) / 8;
            break;
        case "Tio":
            m = Math.pow(2, 40) / 8;
            break;
        case "Pio":
            m = Math.pow(2, 50) / 8;
            break;
        case "Eio":
            m = Math.pow(2, 60) / 8;
            break;
        case "Zio":
            m = Math.pow(2, 70) / 8;
            break;
        case "Yio":
            m = Math.pow(2, 80) / 8;
            break;
        case "Kib":
            m = Math.pow(2, 10);
            break;
        case "Mib":
            m = Math.pow(2, 20);
            break;
        case "Gib":
            m = Math.pow(2, 30);
            break;
        case "Tib":
            m = Math.pow(2, 40);
            break;
        case "Pib":
            m = Math.pow(2, 50);
            break;
        case "Eib":
            m = Math.pow(2, 60);
            break;
        case "Zib":
            m = Math.pow(2, 70);
            break;
        case "Yib":
            m = Math.pow(2, 80);
            break;
        default: m = 1;
    }
    return x * m + unit
}

/**
 * @description Size converter
 * @param {string} x Size with unit
 * @param {string} unit Final unit
 * @returns {string} <code>x</code> &rArr; <code>y</code> <code>unit</code>
 * @see module:Maths~fromBit
 * @see module:Maths~toBit
 * @since 1.0
 * @func
 */
function convSize (x, unit) {
    return fromBit(toBit(x), unit); //demux(.* , bit)->mux(px, .* )
}

/**
 * @description Matlab min:inc:max range
 * @param {number} [min=0] Minimum
 * @param {number} [inc=1] Increment
 * @param {number} [max=100] Maximum
 * @param {Bool} [nbDec=false] Number of decimals
 * @returns {number[]} Range
 * @since 1.0
 * @func
 */
function range (min, inc, max, nbDec) {
    var val = [], n = 0;
    if (min && !inc && !max && max != 0) return range(0, 1, min);
    else if (min && inc && !max && max != 0) return range(0, inc, min);
    if (!min) min = 0;
    if (!inc) inc = 1;
    if (!max) max = 100;
    if (inc > 0) { //Ascending order
        for (var i = min; i <= max; i += inc) val[n++] = Number(i).toNDec(nbDec);
    } else { //Descending order
        for (i = min; i >= max; i -= inc) val[n++] = Number(i).toNDec(nbDec);
    }
    return val
}

/**
 * @description Same as range() but to the base <code>b</code>
 * @param {number} [min=0] Minimum
 * @param {number} [inc=1] Increment
 * @param {number} [max=100] Maximum
 * @param {number} [b=2] Base
 * @returns {Array} Range
 * @see module:Maths~range
 * @since 1.0
 * @func
 */
function range2base (min, inc, max, b) {
    var val = [], n = 0;
    if (inc > 0) {
        for (var i = min; i <= max; i += inc) val[n++] = conv(i, 10, b);
    } else {
        for (i = min; i >= max; i += inc) val[n++] = conv(i, 10, b);
    }
    return val
}

/**
 * @description Like Array.rand() but with optionally unique values and using a Fisher Yates-like approach
 * @param {number} [min=0] Minimum
 * @param {number} [inc=1] Increment
 * @param {number} [max=100] Maximum
 * @param {boolean} [noRepeat=false] No repeated numbers
 * @returns {Array} Mixed range
 * @since 1.0
 * @func
 */
function mixedRange (min, inc, max, noRepeat) {
    var r = range(min, inc, max);
    return noRepeat? r.shuffle(): r.rand(r.length);
}

/**
 * @description Fisher-Yates shuffle
 * @param {Iterable} obj Object to shuffle
 * @returns {Iterable} Shuffled array
 * @since 1.0
 * @func
 */
function fisherYatesShuffle (obj) { //Inspired by https://Github.com/duereg/js-algorithms/blob/master/lib/algorithms/1-strings/shuffle.js
    var l = obj.length;
    while (l > 0) {
        if (obj.hasOwnProperty(l)) swap(obj, l, Math.floor(Math.random() * l--));
    }
    return obj
}

/**
 * @description Vector product
 * @param {object} v1 Vector #1
 * @param {object} v2 Vector #2
 * @returns {string} Vector product
 * @see module:Math~scalarProd
 * @since 1.0
 * @func
 */
function vectorProd (v1, v2) { //V1 x v2
    var x = [], prod = [0, 0, 0];
    x[0] = ["i", "j", "k"];
    x[1] = [v1.x, v1.y, v1.z];
    x.last([v2.x, v2.y, v2.z]);
    prod[0] = v1.y * v2.z - v1.z * v2.y; //I
    prod[1] = v1.x * v2.z - v1.z * v2.x; //J
    prod.last(v1.x * v2.y - v1.y * v2.x); //K
    return prod[0] + "i + " + prod[1] + "j + " + prod.last() + "k"
}

/**
 * @description Convert  a vector to a point
 * @param {object} v Vector
 * @returns {Pt} Point
 * @see module:UI~Pt
 * @since 1.0
 * @func
 */
function vector2Point (v) { //Get the conversion of the vector to a point
    return new Pt(v.x, v.y, v.z)
}

/**
 * @description Convert a vector to a point form (R = xi + yj + zk&rarr;(x, y, z))
 * @param {object} r Vector
 * @returns {string} Point form
 * @see module:Maths~vector2Point
 * @since 1.0
 * @func
 */
function vector2PointForm (r) {
    return "(" + (r.split("i")[0]).clean() + ", " + (r.split("i")[1].split("j")[0].slice(1, r.split("i")[1].split("j")[0].length)).clean() + ", " + (r.split("i")[1].split("j")[1].split("k")[0]).clean() + ")";
}

/**
 * @description Scalar/dot product
 * @param {object} v1 Vector #1
 * @param {object} v2 Vector #2
 * @returns {number} Scalar product
 * @see module:Maths~vectorProd
 * @since 1.0
 * @func
 */
function scalarProd (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
}

/**
 * @description Union (&Union;)
 * @param {Array} a Array a
 * @param {Array} b Array b
 * @param {Array} [c] Array c
 * @param {boolean} [toSort=false] Sort the elements
 * @returns {Array} a &Union; b (&Union; c)
 * @since 1.0
 * @func
 */
function union (a, b, c, toSort) {
    return toSort? rmDuplicates(a.concat(b, c)).quickSort(): rmDuplicates(a.concat(b, c))
}

/**
 * @description Intersection (&Intersection;)
 * @param {Array} a Array a
 * @param {Array} b Array b
 * @param {Array} [c] Array c
 * @param {boolean} [toSort=false] Sort the elements
 * @returns {Array} a &Intersection; b (&Intersection; c)
 * @since 1.0
 * @func
 */
function intersection (a, b, c, toSort) {
    var inter = [];
    a = a.quickSort();
    b = b.quickSort();
    c = c? c.quickSort(): false;

    for (var i in a) {
        if(a.hasOwnProperty(i)) {
            if (b.has(a[i]) && isNon(c)) inter.push(a[i]);
            else if (b.has(a[i]) && c.has(a[i])) inter.push(a[i]);
        }
    }
    return toSort? rmDuplicates(inter).quickSort(): rmDuplicates(inter)
}

/**
 * @description Complement (\\)
 * @param {Array} a Array a
 * @param {Array} b Array b
 * @param {Array} [c] Array c
 * @param {boolean} [toSort=false] Sort the elements
 * @returns {Array} a\b(\c) &rArr; a xor b (xor c)
 * @since 1.0
 * @func
 */
function complement (a, b, c, toSort) {
    var cpt = [];
    a = a.quickSort();
    b = b.quickSort();
    c = c? c.quickSort(): false;

    for (var i in a) {
        if(a.hasOwnProperty(i)) {
            if (b.indexOf(a[i]) === -1 && isNon(c)) cpt.push(a[i]);
            else if (b.indexOf(a[i]) === -1 && c.indexOf(a[i]) === -1) cpt.push(a[i]);
        }
    }
    return toSort? rmDuplicates(cpt).quickSort(): rmDuplicates(cpt)
}

/**
 * @description Symmetric difference
 * @param {Array} a Array a
 * @param {Array} b Array b
 * @param {Array} [c] Array c
 * @param {boolean} [toSort=false] Sort the elements
 * @returns {Array} a &Union; b - a &Intersection; b &rArr; a only & b only
 * @since 1.0
 * @func
 */
function symDif (a, b, c, toSort) {
    var sd = [];
    a = a.quickSort();
    b = b.quickSort();
    c = c? c.quickSortort(): false;
    for (var i in a) {
        if(a.hasOwnProperty(i)) {
            if (b.indexOf(a[i]) === -1 && isNon(c)) sd.push(a[i]);
            else if (b.indexOf(a[i]) === -1 && c.indexOf(a[i]) === -1) sd.push(a[i]);
        }
    }
    for (i in b) {
        if(b.hasOwnProperty(i)) {
            if (a.indexOf(b[i]) === -1 && isNon(c)) sd.push(b[i]);
            else if (a.indexOf(b[i]) === -1 && c.indexOf(b[i]) === -1) sd.push(b[i])
        }
    }
    if (c) {
        for (i in c) {
            if (c.hasOwnProperty(i) && a.indexOf(c[i]) === -1 && b.indexOf(c[i]) === -1) sd.push(c[i]);
        }
    }
    return toSort? rmDuplicates(sd).quickSort(): rmDuplicates(sd)
}

/**
 * @description Bit string of a set in relation to an other
 * @param {Array} a Array a
 * @param {Array} b Array b
 * @returns {Array} Bit string B<sub>a</sub> of <i>b</i>
 * @since 1.0
 * @func
 */
function bitStr (a, b) {
    var ba = []; //Ba in b
    for(var i in a) {
        if(a.hasOwnProperty(i)) ba[i] = (a[i] === b[i])? 1: 0;
    }
    return ba
}

/**
 * @description Is a equivalent to b, a &hArr; b
 * @param {number} a Number a
 * @param {number} b Number b
 * @return {boolean} Equivalence
 * @since 1.1
 * @func
 */
function equivalent (a, b) {
    return Math.round(a) === Math.round(b) || Math.floor(a) === Math.floor(b) || Math.ceil(a) === Math.floor(b) || Math.floor(a) === Math.ceil(b);
}

/**
 * @description Is a approximately equal to b, a &approx; b
 * @param {number} a Number a
 * @param {number} b Number b
 * @param {number} [precision=Essence.eps] Precision
 * @return {boolean} Approximative equality
 * @since 1.1
 * @func
 */
function approxEqual (a, b, precision) {
    if (!precision) precision = Essence.eps;
    return a >= b - precision && a <= b + precision || b >= a - precision && b <= a + precision;
}

/**
 * @description Truthness of the proposition among all elements of the array.
 * @summary Propotional function P(arr)
 * @param {number} arr Array
 * @param {string} prop Proposition
 * @return {boolean[]} P(arr)
 * @since 1.1
 * @func
 */
function P (arr, prop) {
    arr.map(function (x) {
        truth.push(Boolean(prop.replace(/x/gm, x)));
    });
    return truth;
}

/**
 * @description Check if the proposition holds for all elements of the array.
 * @summary Universal quantification of P(arr): &forall;P(arr)
 * @param {number} arr Array
 * @param {string} prop Proposition
 * @return {boolean} Quantification result
 * @since 1.1
 * @func
 */
function forAll (arr, prop) {
    var truth = true;
    for (var i = 0; i < arr.length; i++) {
        truth &= prop.replace(/x/gm, arr[i]);
        if (!truth) return false;
    }
    return !!truth; //P(arr, prop).count(true) === arr.length || !P(arr, prop).has(false)
}

/**
 * @description Check if the proposition holds for some elements of the array.
 * @summary Existensial quantification of P(arr): &exist;P(arr)
 * @param {number} arr Array
 * @param {string} prop Proposition
 * @return {boolean} Quantification result
 * @since 1.1
 * @func
 */
function forSome (arr, prop) {
    var truth = prop.replace(/x/gm, arr[0]);
    for (var i = 1; i < arr.length; i++) {
        truth &= prop.replace(/x/gm, arr[i]);
        if (truth) return true;
    }
    return false; //P(arr, prop).has(true)
}

/**
 * @description Check if the proposition holds for only one element of the array.
 * @summary Uniqueness quantification of P(arr)
 * @param {number} arr Array
 * @param {string} prop Proposition
 * @return {boolean} Quantification result
 * @see module:Maths~P
 * @since 1.1
 * @func
 */
function forOne (arr, prop) {
   return P(arr, prop).count(true) === 1;
}

/**
 * @description Read and convert coordinates to code readable data
 * @param {string} str Coordinates
 * @param {boolean} isInt Convert the cells into integers
 * @returns {NumberLike[]} Coordinates
 * @since 1.0
 * @func
 */
function readCoord (str, isInt) {
    var c = str.slice(1, str.length - 1).split(", ");
    return isInt? [parseInt(c[0]), parseInt(c[1])]: c
}

/**
 * @description x % b where x < a isn't allowed
 * @param {number} x Number
 * @param {number} a Lowest bound
 * @param {number} b Module
 * @returns {number} Result
 * @since 1.0
 * @func
 */
function modRange (x, a, b) {
    var r = x % (b + 1);
    return r + (r < a)? a + r: 0;
}

/**
 * @description Alphabetical modulus
 * @param {number} code Ascii code
 * @returns {number} Moded ascii code
 * @since 1.0
 * @func
 */
function abcModulus (code) {
    var m = code % 123;
    if (90 < m && m < 97) return m + abcModulus(Math.abs(getClosest(m, [90, 97]) - m));
    return m + ((m < 65 && m != 32)? 65 + m: 0);
}

/**
 * @description Brute force through &real; to find an x such that <code>min</code> &le; x &le; <code>max</code> and the condition is true for x
 * @param {number} min Minimum
 * @param {string} cond Condition
 * @param {number} max Maximum
 * @returns {Bool} X or false
 * @since 1.0
 * @func
 */
function bruteForceNum (min, cond, max) { //Brute force through R to find a x such that min <= x <= max and cond is true for x
    for (var x = min; x <= max; x++) {
        if(eval(cond.replace(RegExpify("x"), x + ""))) return x;
    }
    return false;
}

/**
 * @description Is <code>a</code> closer to <code>x</code> than <code>b</code>
 * @param {number} x Number x
 * @param {number} a Number a
 * @param {number} b Number b
 * @returns {boolean} Truth
 * @since 1.0
 * @func
 */
function isCloser (x, a, b) {
    return Math.abs(x - a) < Math.abs(x - b);
}

/**
 * @description Get the closest option from the options to <code>x</code>
 * @param {number} x Number
 * @param {number[]} opt Options
 * @returns {number} Closest number
 * @since 1.0
 * @func
 */
function getClosest (x, opt) {
    var closest = opt[0];
    for (var i = 1; i < opt.length; i++) closest = isCloser(x, closest, opt[i])? closest: opt[i];
    return closest;
}

/**
 * @description Single parametric equation
 * @param {string} [formula="y=x"] Formula
 * @returns {Equation} Equation
 * @this {Equation}
 * @constructor
 * @since 1.0
 * @property {string} Equation.formula Formula
 * @property {string} Equation.leftSide LHS
 * @property {string} Equation.rightSide RHS
 * @property {function(NumberLike): number} Equation.compute Compute data
 * @property {function(): string} Equation.toString String representation
 */
function Equation (formula) {
    this.formula = formula.normal() || "y=x";
    this.leftSide = this.formula.split("=")[0];
    this.rightSide = this.formula.split("=")[1];
    this.compute = function (data) {
        return eval(this.rightSide.multiReplace([
            [/x/g, data.x || 0], [/y/g, data.y || 0], [/z/g, data.z || 0],
            [/pi/ig, Math.PI], [/e/ig, Math.E], [/sqrt(2)/ig, Math.SQRT2],
            [/(pow|max|min)\((.*?),(.*?)\)/, "Math.$1($2, $3)"], //fails on first occurrence
            [/(sqrt|cbrt|cos|sin|tan|acos|asin|cosh|sinh|tanh|acosh|asinh|atanh|exp|abs|e\^)\((.*?)\)/, "Math.$1($2)"],
            [/(ln|log|nthroot|clampTop|clampBottom)\((.*?),(.*?)\)/, "$1($2, $3)"],
            [/(clamp)\((.*?),(.*?),(.*?)\)/, "$1($2, $3, $4)"]
        ]))
    };

    this.toString = function () {
        return "Equation(" + this.formula + ")";
    };

    return this;
}

/**
 * @description Generate an array of all possible binary numbers with <code>x</code> digits or less
 * @param {number} x Number of digits
 * @returns {Array} Array of possible binary numbers
 * @since 1.0
 * @func
 */
function binaryCases (x) {
    var end = parseInt("1".repeat(x)), res = [], i = 0;
    do {
        res.push(conv(i++, 10, 2));
    } while(i <= conv(end));
    return res;
}

/**
 * @description Get the truth table of an expression
 * @param {string} exp Expression
 * @returns {Array} Truth table
 * @since 1.0
 * @func
 */
function truthTable (exp) { //Get the truth table of an expression
    // /(([a-z])(\+|\x2a))+/g
    var ascii = asciiTable("a-z"), vars = [], rows, res = [];
    for (var i = 0; i < ascii.length; i++) {
        if(exp.has(ascii[i])) vars.push(ascii[i]);
    }
    Essence.say("variables: " + vars.toStr(true), "info");
    rows = binaryCases(vars.length);
    for (i = 0; i < rows.length; i++) {
        var cexp = exp;
        for (var j = 0; j < vars.length; j++) cexp = cexp.multiReplace([[vars[j], rows[i][j]]]);
        Essence.say("current exp: " + cexp, "info");
        res.push(eval(cexp));
    }
    return [vars, rows, res];
}

/* eslint no-unused-vars: 0 */
/**
 * @description Get the DNF form of an expression
 * @param {string} exp Expression
 * @returns {string} DNF
 * @since 1.0
 * @todo Work on it
 * @func
 */
function getDNF (exp) {
    var tt = truthTable(exp), dnf = "";
    //code here
    return dnf;
}

/**
 * @description Get the CNF form of an expression
 * @param {string} exp Expression
 * @returns {string} CNF
 * @since 1.0
 * @todo Work on it
 * @func
 */
function getCNF (exp) {
    var tt = truthTable(exp), cnf = "";
    //code here
    return cnf;
}
/* eslint no-unused-vars: 2 */

/**
 * @description Confidence interval with stats known for times
 * @param {number} avg Average/mean
 * @param {number} n Number of times
 * @param {number} sd Standard Deviation
 * @return {number[]} Confidence interval
 * @since 1.1
 * @func
 */
function timeCI (avg, n, sd) {
    return [avg + InvNorm(n / 200) * sd / Math.sqrt(n), avg - InvNorm(n / 200) * sd / Math.sqrt(n)];
}

/**
 * @description Sample mean of a population/array
 * @param {number[]} arr Population
 * @return {number} Sample mean <span style='text-decoration: overline'>x</span>
 */
function sampleMean (arr) { //bar(x)
    return Math.sqrt(sumPow2(arr) / arr.length - arr.mean());
}

/**
 * @description Confidence interval with stats known
 * @param {Nums} avg Sample average/mean or population (array of numbers)
 * @param {number} [c=.95] Confidence (eg.: 95%)
 * @param {number} [n] Number of data
 * @param {number} [sd] Standard Deviation
 * @return {number[]} Confidence interval
 * @todo Make <code>sd</code> optional after having a t-Distribution table calculator
 * @since 1.1
 * @func
 * @example
 * //If the first parameter is a number (hence the sample mean), than the rest of the parameters are necessary
 * var ci = confidenceInterval(6.34, .75, 5, .74);
 * //Otherwise if the first parameter is an array (of numbers), than the rest of the parameters are useless (except the second one)
 * ci = confidenceInterval([5.7, 6.63, 6.57, 7.7, 7.51], .75);
 */
function confidenceInterval (avg, c, n, sd) {
    var z = InvNorm(c || .95); //sd? InvNorm(c): TDistrib((1 - c) / 2, n - 1);
    if (isType(avg, "Array")) {
        sd = avg.stddev();
        n = avg.length;
        avg = sampleMean(avg);
    }
    return [avg - z * sd / Math.sqrt(n), avg + z * sd / Math.sqrt(n)];
}

/**
 * @description Fibonacci sequence
 * @param {number} x Number
 * @return {*} Fibonacci sequence to <code>x</code>
 * @func
 * @since 1.1
 */
function Fibonacci (x) {
    return (x <= 1)? x: Fibonacci(x - 1) + Fibonacci(x - 2);
}