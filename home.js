var GamesJson;

$(function () {
    SetClickEvents();
    LoadCards();
    SetFilters();

    $(window).bind('popstate', OpenPage);
});

function SetClickEvents() {
    /* HIDE THE PURPLE DIV WHEN CLICKING THE BUTTON */

    $(".menuabout").unbind('click').bind('click', function () { $(".hide-purple-div").toggle(); });
    $("#zapochnibtn").click(function () { $(".hide-purple-div").hide(); });
    $(".menutoggle").click(function () { $(".hideOnClick").toggle(); $('.hide-purple-div').toggle(); });

    /* SCROLL TO TOP BUTTON */

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#myBtn').fadeIn();
        } else {
            $('#myBtn').fadeOut();
        }
    });

    $('#myBtn').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 800);
    });


    /* SCROLL ANIMATION ON SHOW FEATURED */

    $(".labelFeat").click(function () {
        $('html,body').animate({
            scrollTop: $("#featured").offset().top
        },
            'slow');
    });

}

function LoadCards() {
    $.ajax({
        url: 'data.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: Populate
    });
}

function Populate(data) {
    GamesJson = data;
    var newGameTemplate = $("#template");
    $('.redzakartichki').empty();

    $(data).each(function (i, item) {
        var newGame = newGameTemplate.clone();
        SetGameData(item, newGame)
        $(newGame).css('display', 'block');
        $(newGame).appendTo('.redzakartichki');
    });
    SetGameCounters();
    SetGameClick();
}
function SetGameData(item, newGame) {
    newGame.find('[data-bind="id"]').attr('data-bind', item.id);
    newGame.find('[data-bind="gameIcon"]').attr('src', item.gameIcon);
    newGame.find('[data-bind="gameTitle"]').html(item.gameTitle);
    newGame.find('[data-bind="timeFrame"]').html(item.timeFrame);
    newGame.find('[data-bind="categoryMKD"]').html(item.categoryMKD);
    newGame.find('[data-bind="groupSize"]').html(item.groupSize);
    newGame.attr('data-category', item.category);
    newGame.attr('data-groupSize', GetGroupSize(item.groupSize));
    newGame.attr('data-timeStamp', GetTimeFrame(item.timeFrame));
}

function SetFilters() {

    var filter = {
        category: {
            filters: [],
            all: true,
        },
        timeStamp: {
            filters: [],
            all: true,
        },
        groupSize: {
            filters: [],
            all: true,
        }
    }
    $(".filter").on("click", function () {
        var filterType = $(this).attr("data-type");
        var filterName = $(this).attr("data-filter");
        if (filterName == 'all') {
            filter[filterType].filters = [];
            filter[filterType].all = true;
            $(".filter[data-type='" + filterType + "']").removeClass("kliknato")
            $(".filter[data-type='" + filterType + "'][data-filter='all']").addClass("kliknato")
        } else {
            var isActive = false;
            if (filter[filterType].filters.indexOf(filterName) > -1) {
                isActive = true;
            }
            if (isActive) {
                filter[filterType].filters.splice(filter[filterType].filters.indexOf(filterName), 1)
                $(this).removeClass("kliknato")
            } else {
                filter[filterType].filters.push(filterName)
                $(this).addClass("kliknato")
            }
            if (filter[filterType].filters.length > 0) {
                filter[filterType].all = false;
                $(".filter[data-type='" + filterType + "'][data-filter='all']").removeClass("kliknato")
            } else {
                filter[filterType].all = true;
                $(".filter[data-type='" + filterType + "'][data-filter='all']").addClass("kliknato")
            }
        }
        $(".filterItem").each(function () {
            var show = true;
            var category = $(this).attr('data-category').split(" ");
            var timeStamp = $(this).attr('data-timeStamp').split(" ");
            var groupSize = $(this).attr('data-groupSize').split(" ");
            show = CheckFiltering(filter.category, show, category);
            show = CheckFiltering(filter.timeStamp, show, timeStamp);
            show = CheckFiltering(filter.groupSize, show, groupSize);
            if (show) {
                $(this).show(300)
            } else {
                $(this).hide(300)
            }
        })
    })
}
function CheckFiltering(filterObject, show, filters) {
    if (!filterObject.all) {
        var multichoice = false;
        for (var j = 0; j < filters.length; j++) {
            if (filterObject.filters.indexOf(filters[j]) > -1) {
                multichoice = true;
            }
        }
        if (show) {
            show = multichoice;
        }
    }
    return show;
}
function SetGameCounters() {
    var EnergyCount = $('[data-category="energy"]').length;
    var InnovationCount = $('[data-category="innovation"]').length;
    var LeadershipCount = $('[data-category="leadership"]').length;
    var ActionCount = $('[data-category="action"]').length;
    var TeamCount = $('[data-category="team"]').length;
    var SumCount = EnergyCount + InnovationCount + LeadershipCount + ActionCount + TeamCount;

    $("#energyCount").html(" (" + EnergyCount + ") ");
    $("#innovationCount").html(" (" + InnovationCount + ") ");
    $("#leadershipCount").html(" (" + LeadershipCount + ") ");
    $("#actionCount").html(" (" + ActionCount + ") ");
    $("#teamCount").html(" (" + TeamCount + ") ");
    $("#sumCount").html(" (" + SumCount + ") ");
}
function GetTimeFrame(timeFrame) {
    switch (timeFrame) {
        case '5-30':
            return "extraSmall";
        case '30-60':
            return "small";
        case '60-120':
            return "medium";
        case '120-240':
            return "large";
        case '30-120':
            return "small medium";
        case '60-240':
            return "medium large";
        case '5-60':
            return 'extraSmall small'
        default:
            return item.timeFrame;
    }
}
function GetGroupSize(groupSize) {
    switch (groupSize) {
        case '2-10':
            return "small";
        case '10-40':
            return "medium";
        case '40+':
            return "large";
        case '2-40':
            return "small medium";
        case '2-40+':
            return "small medium large";
        case '3-40':
            return "small medium";
        case '10-40+':
            return "medium large";
        default:
            return item.groupSize;
    }
}

/* СИМУЛАЦИЈА НА ВТОРА СТРАНА */

function SetGameClick() {
    $('[data-action="OpenGame"]').unbind('click').bind('click', OpenGame);
}

function OpenPage() {
    if (location.pathname.toString().indexOf('index.html') != -1)
        OpenHomePage()
    else
        OpenGame();
}

function OpenHomePage() {
    $('#homePage').show();
    $(".hide-purple-div").show();
    $('#gameDetails').hide();
    var homeURL = location.origin;
    window.history.pushState(null, null, homeURL);
}


function OpenGame() {
    $('#homePage').hide();
    $('.gameDetails').show();
    $(".hide-purple-div").hide();
    $(".menutoggle").click(function () { $(".hideOnClick").toggle(); $('.hide-purple-div').toggle(); $('.gameDetails').toggle(); $('.hideAgain').toggle(); });
    /* SCROLL ANIMATION ON СПОДЕЛИ */

    var gId = $(this).attr('data-bind');
    var gameData = GamesJson[gId];
    var url = gameData.urlName;
    window.history.pushState(null, null, url);
    LoadGame(gameData);
}

function LoadGame(gameData) {
    var gameHTML = new CreateGameHtml(gameData).print();
    $("#gameExpanded").html(gameHTML);
    $("div:contains('undefined')").closest('.step').hide();
    $("div img[src*='undefined']").closest("div").hide();
    $('html, body').animate({ scrollTop: 0 }, 0);
    $("#shareBTN").click(function () {
        $('html,body').animate({
            scrollTop: $("#disqus_thread").offset().top
        },
            'fast');
    });
}


function CreateGameHtml(data) {
    this.image = data.gameIcon;
    this.naslov = data.gameTitle;
    this.description = data.moreDetails.gameDetails;
    this.categoryname = data.categoryMKD;
    this.timeframe = data.timeFrame;
    this.groupsize = data.groupSize;
    this.difficulty = data.moreDetails.facilitation;
    this.materials = data.moreDetails.materials;
    this.steptitle1 = data.moreDetails.steps.step1title;
    this.steptitle2 = data.moreDetails.steps.step2title;
    this.steptitle3 = data.moreDetails.steps.step3title;
    this.steptitle4 = data.moreDetails.steps.step4title;
    this.steptitle5 = data.moreDetails.steps.step5title;
    this.steptitle6 = data.moreDetails.steps.step6title;
    this.steptitle7 = data.moreDetails.steps.step7title;
    this.step1 = data.moreDetails.steps.step1txt;
    this.step2 = data.moreDetails.steps.step2txt;
    this.step3 = data.moreDetails.steps.step3txt;
    this.step4 = data.moreDetails.steps.step4txt;
    this.step5 = data.moreDetails.steps.step5txt;
    this.step6 = data.moreDetails.steps.step6txt;
    this.step7 = data.moreDetails.steps.step7txt;
    this.step1img = data.moreDetails.steps.step1img;
    this.step2img = data.moreDetails.steps.step2img;
    this.step3img = data.moreDetails.steps.step3img;
    this.step4img = data.moreDetails.steps.step4img;
    this.step5img = data.moreDetails.steps.step5img;
    this.step6img = data.moreDetails.steps.step6img;
    this.step7img = data.moreDetails.steps.step7img;

    document.title = this.naslov + " - BrainsterBox";

    this.print = function () {
        return `
            <div class="row gameStuff filterItem" data-category="${this.category}">
                    <div class="col-4 imgWrapper">
                        <img data-bind="gameIcon" class="imgGame2" src="${this.image}">
                    </div>
                    <div class="col-5 gameContent">
                        <div class="catSpan">
                            <i class="fas fa-grip-vertical fASIcon"></i>
                            <span data-bind="categoryMKD" class="categorySqr2">${this.categoryname}</span>
                        </div>
                        <h2 data-bind="gameTitle">${this.naslov}</h2>
                        <p data-bind="gameDetails">${this.description}</p>
                    </div>
                    <div class="col-2 shareDiv">
                        <div id="shareBTN" class="shareIcon">
                            <i class="fas fa-share-alt"></i><br>Сподели
                        </div>
                    </div>
                </div>
                <div class="row browsebycategory2">
                    <div class="col-3 greyCol">
                        <div class="row">
                            <div class="col-2">
                                <i class="far fa-clock categoryFAS"></i>
                            </div>
                            <div class="col-9 attrTitle">
                                <b>ВРЕМЕНСКА РАМКА</b><br>
                                <label>${this.timeframe}</label>min
                            </div>
                        </div>
                    </div>
                    <div class="col-3 greyCol">
                        <div class="row">
                            <div class="col-2">
                                <i class="fas fa-male categoryFAS"></i>
                            </div>
                            <div class="col-9 attrTitle">
                                <b>ГОЛЕМИНА НА ГРУПА</b><br>
                                <label>${this.groupsize}</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-3 greyCol">
                        <div class="row">
                            <div class="col-2">
                                <i class="fas fa-dumbbell categoryFAS"></i>
                            </div>
                            <div class="col-9 attrTitle">
                                <b>ТЕЖИНА</b><br>
                                <label>${this.difficulty}</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-3 greyCol">
                        <div class="row">
                            <div class="col-2">
                                <i class="far fa-edit categoryFAS"></i>
                            </div>
                            <div class="col-9 attrTitle">
                                <b>МАТЕРИЈАЛИ</b><br>
                                <label>${this.materials}</label>
                            </div>
                        </div>
                    </div>

                </div>
                <br>
                <div class="row steps">
                    <div class="offset-2 col-8">
                        <br>
                        <div class="row step">
                            <div class="col-md-9 col-sm-12">
                                <h4>${this.steptitle1}</h4>
                                <p>${this.step1}</p>
                            </div>
                            <div class="col-md-3 col-sm-12">
                                <img class="stepsIcon" src="${this.step1img}">
                            </div>
                        </div>
                        
                        <div class="row step">
                            <div class="col-md-9 col-sm-12">
                                <h4>${this.steptitle2}</h4>
                                <p>${this.step2}</p>
                            </div>
                            <div class="col-md-3 col-sm-12">
                                <img class="stepsIcon" src="${this.step2img}">
                            </div>
                        </div>
                        
                        <div class="row step">
                            <div class="col-md-9 col-sm-12">
                                <h4>${this.steptitle3}</h4>
                                <p>${this.step3}</p>
                            </div>
                            <div class="col-md-3 col-sm-12">
                                <img class="stepsIcon" src="${this.step3img}">
                            </div>
                        </div>
                        
                        <div class="row step">
                            <div class="col-md-9 col-sm-12">
                                <h4>${this.steptitle4}</h4>
                                <p>${this.step4}</p>
                            </div>
                            <div class="col-md-3 col-sm-12">
                                <img class="stepsIcon" src="${this.step4img}">
                            </div>
                        </div>
                        
                        <div class="row step">
                            <div class="col-md-9 col-sm-12">
                                <h4>${this.steptitle5}</h4>
                                <p>${this.step5}</p>
                            </div>
                            <div class="col-md-3 col-sm-12">
                                <img class="stepsIcon" src="${this.step5img}">
                            </div>
                        </div>
                        
                        <div class="row step">
                            <div class="col-md-9 col-sm-12">
                                <h4>${this.steptitle6}</h4>
                                <p>${this.step6}</p>
                            </div>
                            <div class="col-md-3 col-sm-12">
                                <img class="stepsIcon" src="${this.step6img}">
                            </div>
                        </div>
                        
                        <div class="row step">
                            <div class="col-md-9 col-sm-12">
                                <h4>${this.step7title}</h4>
                                <p>${this.step7}</p>
                            </div>
                            <div class="col-md-3 col-sm-12">
                                <img class="stepsIcon" src="${this.step7img}">
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <div id="disqus_thread"></div>
    <script>

        /**
        *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
        *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
        /*
        var disqus_config = function () {
        this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        */
        (function () { // DON'T EDIT BELOW THIS LINE
            var d = document, s = d.createElement('script');
            s.src = 'https://brainster-box.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();
    </script>
    <script>
        
    </script>
    <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by
            Disqus.</a></noscript>
        `
    }
}















