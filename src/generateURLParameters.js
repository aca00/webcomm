

class URLWorker {
    test() {
        console.log("URL worker loaded.")
    }

    isIPv4(str) {
        const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipv4Pattern.test(str);
    }

    isIPv6(str) {
        const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv6Pattern.test(str);
    }

    // 1
    checkIPAddress(str) {
        if (this.isIPv4(str) || this.isIPv6(str)) {
            return -1
        } else {
            return 1
        }
    }

    // 2
    checkUrlLength(url) {
        console.log(`length: ${url}`)
        if (url.length < 54) {
            return 1
        } else if (url.length >= 54 && url.length <= 75) {
            return 0
        } else {
            return -1
        }
    }

    // 3
    check_for_url_shortening_service(url) {
        if (url.match(url_shortening_services_pattern)) {
            return -1
        }
        return 1
    }

    // 4
    hasAtSymbol(url) {
        if (url.includes('@')) {
            return -1
        }
        return 1
    }

    // 5
    has_double_has_redirect(url) {
        const regex = /\/\//g
        const matches = url.match(regex) || []
        if (matches.length > 1 && matches[matches.length - 1] > 6) {
            return -1
        } else {
            return 1
        }
    }

    // 6
    prefix_suffix(url) {
        if (url.match(/^https?:\/\/[^\-]+-[^\-]+\//)) {
            return -1
        } else {
            return 1
        }
    }

    // 7
    has_subdomain(url) {
        const matches = url.match(/\./g) || []
        if (matches.length === 1) {
            return 1
        } else if (matches.length === 2) {
            return 0
        } else {
            return -1
        }
    }

    // 8
    has_port(port) {
        if (port) {
            return -1
        }
        return 1
    }

    // 9
    has_https(url) {
        if (url.match(/^https:\/\//)) {
            return 1
        }
        return -1
    }

    // 10
    checkForHyphenLikeCharacters(domain) {
        var hyphenRegex = /[-–—]/;
        if (hyphenRegex.test(domain)) {
            return -1;
        } else {
            return 1;
        }
    }

    // 11
    lookAlike(url) {
        var lookAlikeRegex = /.*[аạąäàáąсƈċԁɗеẹėéèġһіíïјʝκӏḷոоοօȯọỏơóòöрզʂυսüúùνѵхҳуýʐż]+.*/
        if (lookAlikeRegex.test(url)) {
            return -1;
        } else {
            return 1;
        }
    }


    // 12
    numDots(url) {
        let numOfDots = url.split(".").length - 1;

        if (numOfDots > 3) {
            return -1;
        } else {
            return 1;
        }
    }

    // 13
    numHiphens(url) {
        let hyphenCount = (url.match(/[-–—]/g) || []).length;

        if (hyphenCount > 8) {
            return -1;
        } else {
            return 0;
        }
    }

    // 14
    numDigits(url) {
        let digitCount = (url.match(/\d/g) || []).length;
        if (digitCount == 0) {
            return 1;
        } else if (digitCount > 0 && digitCount < 10) {
            return 0;
        } else {
            return -1;
        }
    }



    create_input(url) {
        let row = new Array()

        console.log(url)

        row.push(this.checkIPAddress(url.hostname));
        row.push(this.checkUrlLength(url.href));
        row.push(this.check_for_url_shortening_service(url.href));
        row.push(this.hasAtSymbol(url.href));
        row.push(this.has_double_has_redirect(url.href));
        row.push(this.prefix_suffix(url.href));
        row.push(this.has_subdomain(url.href));
        row.push(this.has_port(url.port));
        row.push(this.has_https(url.protocol));


        // row.push(this.checkForHyphenLikeCharacters(url.hostname));
        // row.push(this.lookAlike(url.href));
        // row.push(this.numDots(url.href));
        // row.push(this.numHiphens(url.href))
        // row.push(this.numDigits(url.href));



        return row;


    }

}




const url_shortening_services_pattern = /0\.gp|02faq\.com|0987\.win|0a\.sk|0rz\.tw|0vu\.cn|101\.gg|12ne\.ws|17mimei\.club|1drv\.ms|1ea\.ir|1kh\.de|1shop\.io|1u\.fi|1un\.fr|1url\.cz|2\.gp|2\.ht|2\.ly|2doc\.net|2fear\.com|2kgam\.es|2link\.cc|2ni\.in|2no\.co|2nu\.gs|2pl\.us|2u\.lc|2u\.pw|2wsb\.tv|3\.cn|3\.ly|301\.link|365edu\.io|3le\.ru|4\.gp|4\.ly|420\.bio|49rs\.co|4sq\.com|5\.gp|52\.nu|53eig\.ht|5du\.pl|5w\.fit|6\.gp|6\.ly|69run\.fun|6g6\.eu|7\.ly|71a\.xyz|7news\.link|7ny\.tv|7oi\.de|8\.ly|88nb\.cc|89q\.sk|8fig\.me|92url\.com|985\.so|98pro\.cc|9k\.gg|9mp\.com|9nl\.com|9qr\.de|9splay\.store|a\.189\.cn|a\.co|a0\.fr|a360\.co|ab\.co|abc\.li|abc13\.co|abc11\.tv|abc7\.la|abc7\.ws|abc7ne\.ws|abcn\.ws|abe\.ma|abelinc\.me|abn\.com|abnb\.me|abr\.ai|abre\.ai|accntu\.re|acer\.co|acortar\.link|act\.gp|acus\.org|adb\.ug|adbl\.co|adf\.ly|adfoc\.us|adobe\.ly|adol\.us|adweek\.it|aet\.na|agrd\.io|ai6\.net|aka\.ms|al\.st|alexa\.design|alias\.live|alli\.pub|alnk\.to|alpha\.camp|alphab\.gr|alturl\.com|amays\.im|amba\.to|amc\.film|amex\.co|amp\.gs|ampr\.gs|amrep\.org|amz\.run|amzn\.com|amzn\.to|ana\.ms|anon\.to|anyimage\.io|aol\.it|aon\.io|apne\.ws|apple\.co|apple\.news|aptg\.tw|arc\.ht|arkinv\.st|asics\.tv|asin\.cc|asq\.kr|asus\.click|at\.tumblr\.com|at\.vibe\.com|atm\.tk|atmilb\.com|atmlb\.com|atres\.red|autode\.sk|avlr\.co|avydn\.co|axios\.link|axoni\.us|ay\.gy|azc\.cc|b-gat\.es|b\.link|b\.mw|b23\.ru|b2n\.ir|baratun\.de|bayareane\.ws|bbc\.in|bbva\.info|bc\.vc|bca\.id|bcove\.video|bcsite\.io|bddy\.me|beth\.games|bg4\.me|bhpho\.to|bigcc\.cc|bigfi\.sh|biggo\.tw|biibly\.com|binged\.it|bit\.ly|bitly\.com|bitly\.is|bitly\.lc|bitly\.ws|bl\.ink|bl1\.ir|blap\.net|blbrd\.cm|blck\.by|blizz\.ly|bloom\.bg|blstg\.news|blur\.by|bmai\.cc|bnds\.in|bnetwhk\.com|bo\.st|boa\.la|boile\.rs|bom\.so|bonap\.it|booki\.ng|bose\.life|boston25\.com|bougn\.at|bp\.cool|br4\.in|bravo\.ly|bre\.is|bridge\.dev|brief\.ly|brook\.gs|browser\.to|bst\.bz|bstk\.me|bsun\.md|btwrdn\.com|btm\.li|budurl\.com|buff\.ly|bung\.ie|bwnews\.pr|bytl\.fr|bzfd\.it|bzh\.me|c11\.kr|cadill\.ac|can\.al|can\.si|canon\.us|capital\.one|captl1\.co|careem\.me|cart\.mn|casim\.ir|casio\.link|cathaybk\.tw|cathaysec\.tw|cb\.com|cbj\.co|cbsloc\.al|cbsn\.ws|cbt\.gg|cc\.cc|cdl\.booksy\.com|cfl\.re|chilp\.it|chip\.tl|chl\.li|chn\.ge|chn\.lk|chng\.it|chts\.tw|chzb\.gr|cin\.ci|cindora\.club|circle\.ci|cirk\.me|cisn\.co|citi\.asia|cjky\.it|ckbe\.at|cl\.ly|clarobr\.co|clc\.to|clck\.ru|cle\.clinic|cli\.re|clickmeter\.com|clicky\.me|clvr\.li|clvr\.rocks|cmon\.co|cmu\.is|cmxl\.gy|cmy\.tw|cna\.asia|cnb\.cx|cnet\.co|cnfl\.io|cnn\.it|cnnmon\.ie|cnvrge\.co|cockroa\.ch|comca\.st|conta\.cc|cookcenter\.info|coop\.uk|cort\.as|cr\.ma|cr8\.lv|crackm\.ag|crdrv\.co|credicard\.biz|crwd\.fr|cs\.co|csmo\.us|cstu\.io|ctbc\.tw|ctfl\.io|cultm\.ac|cup\.org|cut\.pe|cute2w\.in|cutt\.ly|cutt\.us|cvent\.me|cvs\.co|cyb\.ec|cybr\.rocks|d-sh\.io|da\.gd|dai\.ly|dailym\.ai|dainik-b\.in|davidbombal\.wiki|db\.tt|dbricks\.co|dcps\.co|dd\.ma|deb\.li|deli\.bz|dell\.to|deloi\.tt|dems\.me|derpy\.me|desert\.sn|dhk\.gg|di\.sn|dibb\.me|discord\.gg|discvr\.co|disq\.us|dive\.pub|djex\.co|dk\.rog\.gg|dkng\.co|dkng\.me|dky\.bz|dl\.gl|dld\.bz|dlsh\.it|dlvr\.it|dmdi\.pl|dmreg\.co|do\.co|dockr\.ly|dopice\.sk|dpo\.st|dpurl\.org|drexe\.lu|droid\.ws|dssurl\.com|dtdg\.co|dtsx\.io|dub\.sh|dv\.gd|dvrv\.ai|dwz\.tax|dxc\.to|dy\.fi|dy\.si|e\.lilly|e\.vg|ebay\.to|econ\.st|ed\.gr|edin\.ac|edu\.nl|eepurl\.com|efshop\.tw|elle\.re|ellemag\.co|embt\.co|emirat\.es|engt\.co|enshom\.link|entm\.ag|eonli\.ne|epochtim\.es|ept\.ms|eqix\.it|es\.pn|es\.rog\.gg|escape\.to|esl\.gg|eslite\.me|esqr\.co|esun\.co|etoro\.tw|etp\.tw|etsy\.me|everri\.ch|exe\.io|exitl\.ag|ezstat\.ru|f1\.com|f5yo\.com|fa\.by|fal\.cn|fam\.ag|fandan\.co|fandom\.link|fandw\.me|faras\.link|faturl\.com|fav\.me|fave\.co|fb\.me|fb\.watch|fbshort\.com|fbstw\.link|fce\.gg|fcpa\.cc|feitopara\.vc|fetnet\.tw|fevo\.me|ff\.im|fifa\.fans|firsturl\.de|firsturl\.net|flic\.kr|flip\.it|flomuz\.io|flq\.us|flx\.to|fmurl\.cc|fn\.gg|fnb\.lc|foodtv\.com|fooji\.info|forms\.gle|forr\.com|found\.ee|fox\.tv|foxs\.pt|fr\.rog\.gg|frdm\.mobi|fstrk\.cc|ftnt\.net|fumacrom\.com|fvrr\.co|fwme\.eu|fxn\.ws|g\.asia|g\.co|g\.page|g-web\.in|g02\.ir|ga\.co|galien\.org|garyvee\.com|gaw\.kr|gbod\.org|gbpg\.net|gbte\.tech|gcc\.gl|gdurl\.com|gek\.link|gen\.cat|geni\.us|genie\.co\.kr|getf\.ly|geti\.in|gfuel\.ly|gg\.gg|gh\.io|ghkp\.us|gigaz\.in|git\.io|github\.co|gizmo\.do|gl\.am|glbe\.co|glblctzn\.me|gldr\.co|glmr\.co|glo\.bo|glo\.li|gma\.abc|gmj\.tw|go\.9nl\.com|go\.aws|go\.dbs\.com|go\.gcash\.com|go\.hny\.co|go\.id\.me|go\.intel-academy\.com|go\.intigriti\.com|go\.lamotte\.fr|go\.ly|go\.nasa\.gov|go\.nowth\.is|go\.osu\.edu|go\.qb\.by|go\.rebel\.pl|go\.shell\.com|go\.shr\.lc|go\.skilllabs\.io|go\.sony\.tw|go\.tinder\.com|go\.usa\.gov|go\.ustwo\.games|go\.vic\.gov\.au|godrk\.de|gofund\.me|goo-gl\.me|goo\.by|goo\.click|goo\.gl|goo\.gle|goo\.su|goolink\.cc|goolnk\.com|got\.cr|got\.to|gov\.tw|gowat\.ch|gph\.to|gq\.mn|gr\.pn|grb\.to|grhb\.me|grm\.my|grnh\.se|gtly\.ink|gtly\.to|gtne\.ws|gtnr\.it|gym\.sh|haa\.su|han\.gl|hashi\.co|hbaz\.co|hbom\.ax|her\.is|herff\.ly|hex\.tw|hi\.kktv\.to|hi\.sat\.cool|hi\.switchy\.io|hicider\.com|hideout\.cc|hill\.cm|histori\.ca|hit\.kg|hnsl\.mn|homes\.jp|hp\.care|hpe\.to|hrbl\.me|href\.li|ht\.ly|htgb\.co|htl\.li|htn\.to|httpslink\.com|hub\.am|hubs\.la|hubs\.li|hubs\.ly|huff\.to|huffp\.st|hulu\.tv|huma\.na|hyp\.ae|hyperurl\.co|hyperx\.gg|i\.coscup\.org|i\.mtr\.cool|i-d\.co|ibb\.co|ibf\.tw|ibit\.ly|ibm\.co|ic9\.in|icit\.fr|icks\.ro|iea\.li|ifix\.gd|ift\.tt|iherb\.co|ihr\.fm|iii\.im|iiil\.io|il\.rog\.gg|illin\.is|iln\.io|ilnk\.io|imdb\.to|ind\.pn|indeedhi\.re|indy\.st|infy\.com|insd\.io|insig\.ht|instagr\.am|intel\.ly|interc\.pt|intuit\.me|inx\.lv|ionos\.ly|ipgrabber\.ru|ipgraber\.ru|iplogger\.co|iplogger\.com|iplogger\.info|iplogger\.org|iplogger\.ru|iplwin\.us|iqiyi\.cn|irng\.ca|is\.gd|isw\.pub|itsh\.bo|itvty\.com|ity\.im|ix\.sk|j\.gs|j\.mp|ja\.cat|ja\.ma|jb\.gg|jcp\.is|jdem\.cz|jkf\.lv|joo\.gl|jp\.rog\.gg|jpeg\.ly|jsparty\.fm|k-p\.li|kas\.pr|kask\.us|katzr\.net|kbank\.co|kbit\.co|kck\.st|kf\.org|kfrc\.co|kham\.tw|kings\.tn|kkc\.tech|kkday\.me|kko\.to|kkstre\.am|kl\.ik\.my|klck\.me|kli\.cx|klmf\.ly|ko\.gl|kp\.org|kpmg\.ch|krazy\.la|ku\.ag|kuku\.lu|kutt\.it|l\.linklyhq\.com|l\.prageru\.com|l-i-nk\.me|l8r\.it|l9k\.net|laco\.st|lam\.bo|lat\.ms|lativ\.tw|lbtw\.tw|lc\.cx|learn\.to|lego\.build|lemde\.fr|letsharu\.cc|lft\.to|lih\.kg|lihi\.biz|lihi\.cc|lihi\.one|lihi\.pro|lihi\.tv|lihi\.vip|lihi1\.cc|lihi1\.com|lihi1\.me|lihi2\.cc|lihi2\.com|lihi2\.me|lihi3\.cc|lihi3\.com|lihi3\.me|lihipro\.com|lihivip\.com|lin\.ee|link\.ac|link\.gy|link\.infini\.fr|link\.tubi\.tv|linkbun\.com|linkd\.in|linkd\.pl|linkingunitas\.com|linkjust\.com|linko\.page|linkr\.in|links2\.me|linkshare\.pro|linkye\.net|livemu\.sc|livestre\.am|llo\.to|lmg\.gg|lmt\.co|lmy\.de|lnk\.bz|lnk\.direct|lnk\.do|lnk\.sk|lnkd\.in|lnkiy\.com|lnkiy\.in|lnky\.jp|lnnk\.in|lnv\.gy|lohud\.us|lonerwolf\.co|loom\.ly|low\.es|lprk\.co|lru\.jp|lsdl\.es|lstu\.fr|lt27\.de|lttr\.ai|ludia\.gg|luminary\.link|lurl\.cc|lyksoomu\.com|lzd\.co|m\.me|m\.tb\.cn|m101\.org|m1p\.fr|m6z\.cn|maac\.io|maga\.lu|man\.ac\.uk|many\.at|maper\.info|mapfan\.to|mayocl\.in|mcafee\.ly|mcd\.to|mcgam\.es|mck\.co|mcys\.co|me\.sv|me2\.kr|meck\.co|meetu\.ps|merky\.de|metamark\.net|mgnet\.me|mgstn\.ly|michmed\.org|migre\.me|minify\.link|minilink\.io|mm\.rog\.gg|mmz\.li|mney\.co|mnge\.it|mnot\.es|mojo\.ly|mo\.ma|momo\.dm|monster\.cat|moo\.im|moovit\.me|mork\.ro|mou\.sr|mpago\.info|mrte\.ch|mrx\.cl|ms\.spr\.ly|msft\.it|msi\.gm|mstr\.cd|mtw\.so|mub\.me|munbyn\.biz|my\.mtr\.cool|mybmw\.tw|myglamm\.in|mylt\.tv|mypoya\.com|myppt\.cc|mysp\.ac|myumi\.ch|myurls\.ca|mz\.cm|mzl\.la|n\.opn\.tl|n\.pr|n9\.cl|name\.ly|nature\.ly|nav\.cx|naver\.me|nbc4dc\.com|nbcbay\.com|nbcchi\.com|nbcct\.co|nbcnews\.to|nbzp\.cz|nej\.md|neti\.cc|netm\.ag|nflx\.it|ngrid\.com|nie\.mn|njersy\.co|nkbp\.jp|nkf\.re|nmrk\.re|nnn\.is|nnnna\.store|nokia\.ly|notlong\.com|nq\.st|nr\.tn|ntap\.com|ntck\.co|ntn\.so|ntnx\.tw|ntuc\.co|nus\.edu|nvda\.ws|nwppr\.co|nwsdy\.li|nxb\.tw|nxdr\.co|nydn\.us|nyer\.cm|nym\.ag|nyp\.st|nyr\.kr|nyti\.ms|o\.vg|oal\.lu|obank\.tw|oc\.cm|ock\.cn|ocul\.us|oe\.cd|ofcour\.se|offerup\.co|offf\.to|offs\.ec|okok\.fr|okt\.to|oldnvy\.me|omni\.ag|on\.bp\.com|on\.fb\.me|on\.ft\.com|on\.louisvuitton\.com|on\.mktw\.net|on\.nba\.com|on\.ny\.gov|on\.nypl\.org|on\.tcs\.com|on\.wsj\.com|on9news\.tv|onelink\.to|onepl\.us|onforb\.es|onion\.com|onx\.la|opr\.as|opr\.news|optimize\.ly|oran\.ge|orlo\.uk|osdb\.link|ouo\.io|ouo\.press|ourl\.co|ourl\.in|ourl\.tw|outschooler\.me|ovh\.to|ow\.ly|owl\.li|owy\.mn|oxelt\.gl|oxf\.am|oyn\.at|p\.asia|p1r\.es|p4k\.in|pag\.la|parg\.co|patm\.sg|pchome\.link|pck\.tv|pdora\.co|pdxint\.at|pe\.ga|pens\.pe|peoplem\.ag|pepsi\.co|pesc\.pw|petrobr\.as|pew\.org|pewrsr\.ch|pg3d\.app|pgat\.us|pgrs\.in|philips\.to|piee\.pw|pin\.it|pipr\.es|pj\.pizza|play\.st|pldthome\.info|plu\.sh|pnsne\.ws|poie\.ma|pojonews\.co|politi\.co|popm\.ch|pops\.ci|posh\.mk|postdispat\.ch|ppt\.cc|ppurl\.io|prdct\.school|preml\.ge|prf\.hn|prgress\.co|prn\.to|pro\.ps|propub\.li|pros\.is|psce\.pw|pse\.is|psee\.io|pt\.rog\.gg|ptix\.co|puext\.in|purdue\.university|purefla\.sh|puri\.na|pwc\.to|pxu\.co|py\.md|pzdls\.co|q\.gs|qnap\.to|qr\.ae|qr\.net|qrco\.de|qrs\.ly|qvc\.co|r\.zecz\.ec|r-7\.co|r29\.co|rb\.gy|rbl\.ms|rch\.lt|rd\.gt|rdbl\.co|rdcrss\.org|rdre\.me|read\.bi|readhacker\.news|rebelne\.ws|rebrand\.ly|reconis\.co|red\.ht|redd\.it|redir\.ec|redir\.is|redsto\.ne|redtag\.la|ref\.trade\.re|referer\.us|refini\.tv|reline\.cc|relink\.asia|rem\.ax|replug\.link|rethinktw\.cc|reurl\.cc|reut\.rs|rev\.cm|revr\.ec|rfr\.bz|ringcentr\.al|riot\.com|risu\.io|ritea\.id|rizy\.ir|rlu\.ru|rnm\.me|rog\.gg|roge\.rs|rol\.st|rotf\.lol|rozhl\.as|rsc\.li|rsh\.md|rtvote\.com|ru\.rog\.gg|rushgiving\.com|rushtix\.co|rvtv\.io|rvwd\.co|rwl\.io|s\.accupass\.com|s\.coop|s\.g123\.jp|s\.id|s\.mj\.run|s\.sh-topia\.com|s\.ul\.com|s\.uniqlo\.com|s\.wikicharlie\.cl|s3vip\.tw|saf\.li|safelinking\.net|safl\.it|sail\.to|sbird\.co|sbsne\.ws|sbux\.co|sbux\.jp|sc\.org|sched\.co|sck\.io|scr\.bi|scrb\.ly|scuf\.co|sdnl\.org|sdpbne\.ws|sdu\.sk|sdut\.us|se\.rog\.gg|sealed\.in|seedsta\.rs|sejr\.nl|selnd\.com|seolrea\.net|seph\.me|sf3c\.tw|sfcne\.ws|sforce\.co|sfty\.io|sgq\.io|sh\.st|shln\.me|shar\.as|shar\.es|shiny\.link|sho\.pe|shope\.ee|shorl\.com|short\.gy|shorte\.st|shorten\.asia|shorturl\.ae|shorturl\.asia|shorturl\.at|shorturl\.com|shorturl\.gg|shoturl\.org|shp\.ee|shrt\.ml|shrtco\.de|sht\.moe|shutr\.bz|sie\.ag|simp\.ly|sina\.lt|sincere\.ly|sinourl\.tw|sinyi\.biz|sinyi\.in|siriusxm\.us|siteco\.re|skimmth\.is|skl\.sh|skr\.sk|skrat\.it|skroc\.pl|skyurl\.cc|slidesha\.re|small\.cat|smart\.link|smarturl\.it|smashed\.by|smbz\.us|smlk\.es|smonty\.co|smsb\.co|smsng\.news|smsng\.us|smtvj\.com|smu\.gs|sn\.cf|snd\.sc|sndn\.link|snip\.link|snip\.ly|snyk\.co|soc\.cr|soch\.us|social\.ora\.cl|sokrati\.ru|solsn\.se|sou\.nu|sourl\.cn|spcne\.ws|spgrp\.sg|split\.to|splk\.it|spoti\.fi|spotify\.link|spr\.ly|spr\.tn|sprtsnt\.ca|sptfy\.com|sqex\.to|squ\.re|srnk\.us|ssur\.cc|st\.news|st8\.fm|stan\.md|stanford\.io|starz\.tv|sti\.to|stmodel\.com|storycor\.ps|stspg\.io|stts\.in|stuf\.in|sumal\.ly|suo\.fyi|suo\.im|supr\.cl|supr\.link|surl\.li|svy\.mk|swa\.is|swag\.run|swiy\.co|swoo\.sh|swtt\.cc|sy\.to|syb\.la|synd\.co|syw\.co|t-bi\.link|t-mo\.co|t\.cn|t\.co|t\.iotex\.me|t\.libren\.ms|t\.ly|t\.me|t\.tl|t1p\.de|t2m\.io|ta\.co|tabsoft\.co|tanks\.ly|tatung\.site|tbb\.tw|tbrd\.co|tcat\.tc|tcrn\.ch|tdrive\.li|tdy\.sg|tek\.io|ter\.li|tg\.pe|tgam\.ca|tgr\.ph|thatis\.me|thd\.co|thebp\.site|thedo\.do|thein\.fo|thesne\.ws|thetim\.es|thght\.works|thinfi\.com|thls\.co|thn\.news|thr\.cm|thrill\.to|ti\.me|tibco\.cm|tibco\.co|tidd\.ly|tim\.com\.vc|tinu\.be|tiny\.cc|tiny\.ee|tiny\.ie|tiny\.one|tiny\.pl|tiny\.sg|tinyarro\.ws|tinylink\.net|tinyurl\.com|tinyurl\.hu|tinyurl\.mobi|tl\.gd|tlil\.nl|tlnt\.at|tlrk\.it|tmblr\.co|tmsnrt\.rs|tmz\.me|tnne\.ws|tnsne\.ws|tnvge\.co|tnw\.to|tny\.cz|tny\.im|tny\.so|to\.ly|to\.pbs\.org|toi\.in|tokopedia\.link|tonyr\.co|topt\.al|toyota\.us|tpmr\.com|tprk\.us|trackurl\.link|travl\.rs|trbna\.co|trib\.al|trib\.in|troy\.hn|trt\.sh|trymongodb\.com|tsbk\.tw|tsta\.rs|tsurl\.co|tt\.vg|tvote\.org|tw\.rog\.gg|tw\.sv|twb\.nz|twiturl\.de|twm5g\.co|twou\.co|twtr\.to|txdl\.top|txtly\.me|txul\.cn|u\.fail|u\.nu|u\.shxj\.pw|u\.to|u2s\.in|u6v\.cn|ua\.rog\.gg|uafly\.co|ubm\.io|ubnt\.link|ubr\.to|ucbexed\.org|ucla\.in|ui8\.ru|uk\.rog\.gg|ukf\.me|ukoeln\.de|ul\.rs|ul\.to|ul3\.ir|ume\.la|umlib\.us|unc\.live|undrarmr\.co|uni\.cf|unipapa\.co|unr\.ly|uofr\.us|uoft\.me|up\.to|upmchp\.us|ur3\.us|urb\.tf|urbn\.is|url\.cn|url\.cy|url\.ie|url2\.fr|url365\.club|urla\.ru|urlbun\.ch|urlbunch\.com|urlcut\.com|urlday\.cc|urlgeni\.us|urli\.ai|urlify\.cn|urlin\.it|urlink\.io|urlo\.in|urlr\.me|urls\.fr|urls\.im|urls\.kr|urluno\.com|urly\.co|urly\.fi|urlz\.fr|urlzs\.com|us\.rog\.gg|usanet\.tv|usat\.ly|usm\.ag|utfg\.sk|utm\.to|utn\.pl|utraker\.com|v\.gd|v\.ht|vai\.la|vbly\.us|vd55\.com|vercel\.link|vi\.sa|viaalto\.me|viraln\.co|vivo\.tl|vk\.cc|vk\.sv|vn\.rog\.gg|vntyfr\.com|vo\.la|vodafone\.uk|vogue\.cm|voicetu\.be|volvocars\.us|vonq\.io|vrnda\.us|vtns\.io|vult\.re|vur\.me|vurl\.com|vvnt\.co|vxn\.link|vypij\.bar|vz\.to|vzturl\.com|w\.idg\.de|w\.tt|w\.wiki|w5n\.co|wa\.link|wa\.me|wa\.sv|waa\.ai|waad\.co|wahoowa\.net|walk\.sc|walkjc\.org|wapo\.st|warby\.me|warp\.plus|wartsi\.ly|way\.to|wb\.md|wbur\.fm|wbze\.de|wcha\.it|we\.co|weall\.vote|weare\.rs|wee\.so|wef\.ch|wellc\.me|wenk\.io|westm\.in|wf0\.xin|wfts\.tv|whatel\.se|whcs\.law|whereel\.se|whi\.ch|whoel\.se|whr\.tn|win\.gs|winzgo\.xyz|wit\.to|wjcf\.co|wkf\.ms|wmojo\.com|wn\.nr|wndrfl\.co|wo\.ws|wooo\.tw|wp\.me|wpbeg\.in|wrctr\.co|wrd\.cm|wrem\.it|wryh\.at|wu\.to|wun\.io|ww7\.fr|wwf\.to|wwhts\.com|wwp\.news|www\.shrunken\.com|www3\.to|x\.co|x\.gd|xbx\.lv|xerox\.bz|xfin\.tv|xfl\.ag|xfru\.it|xgam\.es|xor\.tw|xpr\.li|xprt\.re|xqss\.org|xrds\.ca|xrl\.us|xtra\.li|xurl\.es|xurls\.org|xvirt\.it|xxl\.frl|xy2\.eu|y\.ahoo\.it|y2u\.be|yadi\.sk|yelp\.to|yex\.tt|yhoo\.it|yip\.su|yji\.tw|ynews\.page\.link|yoox\.ly|your\.ls|yourls\.org|yourwish\.es|youtu\.be|yubi\.co|yugatech\.ph|yuk\.nu|yun\.ir|z23\.ru|zat\.ink|zaya\.io|zc\.vg|zcu\.io|zd\.net|zdrive\.li|zdsk\.co|zecz\.ec|zeep\.ly|zeni\.ws|zev\.mobi|zez\.kr|zi\.ma|ziadi\.co|zicbo\.info|zipr\.ir|zipurl\.fr|zitty\.me|zln\.do|zlw\.re|zlr\.my|zlra\.co|zoho\.to|zopen\.to|zovpart\.com|zpr\.io|zrge\.eu|zuki\.ie|zulucr\.bz|zuo\.in|zuplo\.link|zurb\.us|zurins\.uk|zurl\.co|zurl\.ir|zurl\.ws|zws\.im|zxc\.li|zynga\.my|zywv\.us|zzb\.bz|zzu\.info/