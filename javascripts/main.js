var pageContents;

function Init () {
    if (typeof Essence !== "undefined") { //Use EssenceJS
        //Essence.applyCSS(true);
        DocTemplate.add(["title", "author", "dependencies", "comingSoon"], [$e("title").val(), "https://github.com/Berkmann18", colTable("", ["Libraries/Frameworks"], getDeps(), "deps"), "<em>Coming soon... Stay tuned</em>"]);
        DocTemplate.fullDeMustache();
        subInit();
        pageContents = {
            "Home": Copy($e("div.content").val(true)),
            "About": "<p class='lead'>About</p><article><header><h3>About this website</h3></header><p>The website was created by Maximilian Berkmann (@Berkmann18) in order to have a place where his GitHub projects could be showcased and to have a GitHub based website. It's powered by: <span data-dependencies=''>{{dependencies}}</span></p></article><article><header><h3>About the author</h3></header><table class='none'><tr><td><img src='https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAdwAAAAJDlhZDRmMzIzLTJjYjQtNGYwMC04N2FhLTE4MWM2YzIzMzJmYQ.jpg' style='width: 128px; height: 128px'/></td><td>Maximilian <i>'Maxie'</i> Berkmann is a 20 years old British RHUL Computer Science student is passioned by Computer Science and who loves coding. He's happy to help anyone in need and can be reached <a href='mailto: maxieberkmann@gmail.com'>here</a>.</td></tr></table></article>",
            "Projects": "<p class='lead'>Projects</p>",
            "Contact me": "<p class='lead'>Contact me</p><form action='mailto: maxieberkmann@gmail.com'><fieldset class='form-group'><label for='email'>Email</label><input type='text' class='form-control' id='email' name='email' /></fieldset><fieldset class='form-group'><label for='object'>Object</label><input type='text' class='form-control' id='object' name='object' /></fieldset><fieldset class='form-group'><label for='msg'>Message</label><br /><textarea id='msg' name='msg' rows='10' cols='60' class='form-control'></textarea></fieldset><button type='submit' class='btn btn-primary'>Submit</button></form>",
            "http400": "<p class='lead'>400 Bad request</p><em class='err'>Was that question the one you wanted to ask ?<br />Go back <a href='index.html'>home</a> or navigate through the menu above and ask again !</em>",
            "http401": "<p class='lead'>401 Unauthorized</p><em class='err'>WTF are you trying to do mate ?<br />Go back <a href='index.html'>home</a> or navigate through the menu above !</em>",
            "http403": "<p class='lead'>403 Forbidden</p><em class='err'>Sorry mate, you're trying to go somewhere forbidden !<br />Go back <a href='index.html'>home</a> or navigate through the menu above !</em>",
            "http404": "<p class='lead'>404 Not Found</p><em class='err'>What is wrong with you ? Why are you looking for something that doesn't exist ?<br />Go back <a href='index.html'>home</a> or navigate through the menu above !</em>",
            "http500": "<p class='lead'>500 Internal Server Error</p><em class='err'>What on Earth is wrong here ? Oh wait, it's a server issue not yours !<br />Go back <a href='index.html'>home</a> or navigate through the menu above !</em>"
        };
        $n("*nav li").toArray().map(function (elm) {
            elm.id = "navLi_" + elm.innerText;
            elm.addEventListener("click", function () {
                Essence.say("Switching to %c" + elm.innerText + "%c", "info", "text-decoration: italic", "text-decoration: none");
                chContent(elm.innerText);
            });
        });
        /*getNavLis().map(function (nl) {
           nl.onclick = function () {
               Essence.say("Switching to %c#" + this.id + "%c", "info", "text-decoration: italic", "text-decoration: none");
               write(pageContents[this.innerText], true);
               DocTemplate.deMustache();
               DocTemplate.associateAll(true);
           };
        });*/
        alert("\tDear visitors,\n\nThis website is currently under maintenance.\nYours sincerely,\n\n\tBerkmann18");
    } else {
        setTimeout("Init()", 500);
        console.warn("EssenceJS is not currently available !");
    }
}

function subInit () {
    DocTemplate.associateAll(true);
    DocTemplate.fullDeMustache();
    Essence.applyCSS();
}

function write (txt, html, inc) { //To ease the 1 page n contents management
    if (inc === -1) $e("div.content").before(txt, html);
    else if (inc === 1) $e("div.content").after(txt, html);
    else $e("div.content").write(txt, html);
}

function getDeps () {
    return ["EssenceJS"].append(filenameList(gatherRemoteResources("script")).map(function (x) {
        return x.split(".")[0].toLowerCase() === "jquery"? x.replace(/(\.min|)\.js/, "").replace("jquery", "jQuery"): x.split(".")[0].capitalize();
    }))
}

/*function getNavLis () {
    var nl = [];
    keyList(pageContents).get(0, keyList(pageContents).indexOf("http400") - 1).map(function (x) {
        return x.has("http")? undefined: nl.push($n("#navLi_" + x))
    });

    return nl;
}*/

function chContent (page) {
    if (!pageContents.hasOwnProperty(page)) page = "http404";
	write(pageContents[page], true);
    $e("li#navLi_" + page).addClass("active");
    var others = complement(keyList(pageContents).get(0, keyList(pageContents).indexOf("http400") - 1), [page]);
    console.log("page: ", page, "\nothers", others);
    for (var i = 0; i < others; i++) $e("li#navLi_" + others[i]).setCSS("background", "#fff");
	DocTemplate.associateAll(true);
}

function projectList () {
	var projs = ["BatchCMD", "EssenceJS", "EssencePHP", "PhysicsJS", "PuzzleSim", "ScTimer", "Sorting.js"], tpl = new Template("ProjectTemplate", "")
}