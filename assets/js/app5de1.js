var links = $(".nav-item > .nav-link")
var video = $("video").first();

function checkCurrentState(offset) {

    $("section").each((i, element) => {
        var elementOffset = element.offsetTop;

        if (window.state == element.id)
            return;

        if (offset < video.height()) {
            window.state = "header";
            setActive("");
        }
        else if (offset >= elementOffset && offset <= elementOffset + 200) {
            window.state = element.id;
            setActive(element.id);
        }
    });
}

function setActive(target) {
    links.each((i) => {
        var e = links[i];
        var t = window.location.origin + "/#" + target;

        if (e.href === t) {
            $(e).parent().addClass("active");
        }
        else {
            $(e).parent().removeClass("active");
        }
    });
}

$('.navbar-toggler').click(function () {
    $('.navbar').toggleClass("navbar-overlay")
});

$(window).on("scroll", () => {
    var offset = window.pageYOffset;
    var scroller = $("#topScroller");

    checkCurrentState(offset);

    if (offset > 300) {
        scroller.removeClass("invisible");
    }
    else {
        scroller.addClass("invisible");
    }
});

$("#topScroller").on("click", () => {
    window.scrollTo(0, 0);
});

var options = {
    chart: {
        width: "100%",
        type: "donut"
    },
    plotOptions: {
        pie: {
            expandOnClick: false,
            //startAngle: 10,
            donut: {
                size: '90%',
            }
        },
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false
    },
    stroke: {
        width: 6,
        colors: ['#2d3b4c']
    },
    fill: {
        type: 'solid',
        colors: ['#5a9a94', '#ffcf00', '#b4207e', '#ff8000']
    },
    tooltip: {
        enabled: false,
    },
    states: {
        hover: {
            filter: {
                type: 'none',
            }
        },
        active: {
            filter: {
                type: 'none'
            }
        }
    },
    series: [19, 3, 1, 77]
};

var secondsLeft = 0;
var countdownTimer;
function startIcoTimer(time, icoState) {

    var now = new Date();
    var offset = -(new Date().getTimezoneOffset() / 60);

    now = Math.floor(now / 1000) - 3600 * offset

    secondsLeft = Math.floor(time / 1000) - now;
    console.log(secondsLeft)

    countdownTimer = setInterval(progressIcoTime, 1000, icoState);
}

function progressIcoTime(icoState) {
    var days = Math.floor(secondsLeft / 24 / 60 / 60);
    var hoursLeft = Math.floor((secondsLeft) - (days * 86400));
    var hours = Math.floor(hoursLeft / 3600);
    var minutesLeft = Math.floor((hoursLeft) - (hours * 3600));
    var minutes = Math.floor(minutesLeft / 60);
    var remainingSeconds = secondsLeft % 60;

    var t = "";
    if (icoState !== -1) {
        if (icoState === 0)
            t = "Starts in ";
        else
            t = "Ends in ";

        if (days > 0)
            t += '<span class="fw-bold">' + days + '</span>D ';

        if (hours > 0)
            t += '<span class="fw-bold">' + hours + '</span>H ';

        if (minutes > 0)
            t += '<span class="fw-bold">' + minutes + '</span>M ';

        t += '<span class="fw-bold">' + remainingSeconds + '</span>S';

        document.getElementById("ico-stage-end").innerHTML = t;
    }
    else {
        secondsLeft = 0;
    }

    if (secondsLeft == 0) {
        clearInterval(countdownTimer);
        document.getElementById("ico-stage-end").innerHTML = "Completed";
    } else {
        secondsLeft--;
    }
}

$(document).ready(() => {

    var chart = new ApexCharts(
        document.querySelector("#token-allocation"),
        options
    );
    chart.render();

    let formatter = new Intl.NumberFormat('en-US');

    $.ajax({
        async: true,
        type: "GET",
        crossDomain: true,
        cache: false,
        url: "api/v1/metadata",
        success: function (data) {
            // var sold = Math.round(((data.ico_sold / data.ico_total) * 100));

            // document.getElementById("ico-stage").innerHTML = "ICO Phase " + data.ico_stage;
            // document.getElementById("ico-stage-sold").innerHTML = sold + "%";
            // document.getElementById("ico-stage-price").innerHTML = "$" + data.ico_price;
            // document.getElementById("ico-stage-bonus").innerHTML = data.ico_bonus + "%";
            // document.getElementById("ico-stage-total").innerHTML = data.ico_total.toLocaleString("en-US");
            // document.getElementById("ico-progressbar").style.width = sold + "%";

            // var time;
            // if (data.ico_state === 0)
            //     time = new Date(data.ico_stage_start).toISOString();
            // else
            //     time = new Date(data.ico_stage_end).toISOString();

            // var localTime = Date.parse(time);
            // startIcoTimer(localTime, data.ico_state);

            // document.getElementById("currentprice").innerHTML = "$" + formatter.format(data.ico_price) + " USD";
            document.getElementById("btc").innerHTML = "$" + formatter.format(data.btc) + " USD";
            // document.getElementById("roi").innerHTML = data.roi + "%";
            // document.getElementById("holders").innerHTML = data.holders;

            Array.prototype.forEach.call(document.getElementsByClassName("marquee__content"), function (e) {
                for (var i = 0; i < data.runningText.length; i++) {
                    e.innerHTML += "<li>" + data.runningText[i] + "</li>";
                }
            });
        }
    });

    var news = document.getElementsByClassName("news-feed")[0];
    const parser = new DOMParser();

    $.ajax({
        async: true,
        type: "GET",
        crossDomain: true,
        cache: false,
        url: "api/v1/feed",
        success: function (articles) {
            news.innerHTML = "";

            articles.forEach((article, index, arr) => {
                var template = '<div class="row news-card">\n<div class="col-12 col-lg-4 news-thumbnail">\n<img class="thumbnail rounded"\nsrc="{{thumbnail}}" />\n</div>\n<div class="col-12 col-lg-8 news-inner-container">\n<a href="{{link}}" class="news-header mt-2 mt-lg-0">{{title}}</a><div class="news-body"><span>{{desc}}<span></div><div class="news-footer mt-3 mt-lg-0"><span>{{author}} • {{pubDate}}</span>\n<span>{{readingTime}} min to read</span>\n</div>\n</div>\n</div>';

                var pubDate = new Date(article["pubDate"]).toLocaleString('en-us', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    weekday: 'long'
                });

                template = template.replace("{{link}}", article["link"]);
                template = template.replace("{{thumbnail}}", article["thumbnail"]);
                template = template.replace("{{title}}", article["title"]);
                template = template.replace("{{desc}}", article["description"]);
                template = template.replace("{{author}}", article["author"]);
                template = template.replace("{{pubDate}}", pubDate);
                template = template.replace("{{readingTime}}", article["readingTime"]);

                var element = parser.parseFromString(template, 'text/html').body.firstChild;
                news.appendChild(element);
            });
        }
    });

    var containers = document.getElementsByClassName("video-container");

    Array.from(containers).forEach(container => {
        container.addEventListener("click", addVideo);
    });
});

function addVideo(e) {
    let ele = e.target;

    if (!ele.id) {
        ele = ele.parentElement;
    }

    var videoId = "";

    switch (ele.id) {
        case "v1":
            videoId = "quqtotk944A";
            break;
        case "v4":
            videoId = "GwCFXZ-1Dto";
            break;
        case "v2":
            videoId = "5uRIO0CnPTY";
            break;
        case "v3":
            videoId = "78gBx1P3exM";
            break;
    }

    document.getElementById("videoplayer").innerHTML = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + videoId + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}

let addr = document.getElementById("contractaddress").innerHTML;
const copyContractAddress = async () => {
    try {
        await navigator.clipboard.writeText(addr);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

var max_date;
function fetchPurchases() {
    $.ajax({
        type: "GET",
        url: "api/v1/purchases",
        cache: false,
        dataType: 'json',
        success: function (data) {
            updateTimestamps();

            if (max_date === undefined) {
                max_date = findMaxDate(data);

                for (var p of data) {
                    addPurchase(p, true);
                }
            }
            else {
                var newItems = filterByDate(data, max_date);

                if (newItems.length > 0) {
                    max_date = findMaxDate(newItems);

                    deletePurchases(newItems.length);

                    for (var item of newItems) {
                        addPurchase(item, false);
                    }
                }
            }
        }
    });
}

function deletePurchases(amount) {
    var parentElement = $("#purchases");
    var purchaseElements = parentElement.find(".purchase");

    if (purchaseElements.length >= amount) {
        purchaseElements.slice(-amount).each(function () {
            deletePurchase(this);
        });
    }
}

function deletePurchase(item) {
    $(item).addClass('fade-out');

    setTimeout(function () {
        $(item).remove();
    }, 900);
}

function addPurchase(p, append) {
    const div = $('#purchases');

    // var template = '<div class="d-flex justify-content-between text-primary rounded px-3 py-3 purchase"> <div class="d-flex flex-row"> <div class=""> <img src="assets/images/' + p.currency + '.svg" class="align-self-center" width="18"> </div><span class="ms-3 align-self-center">Someone bought ' + p.tokens + ' BTCS</span> </div><span class="ms-5 align-self-center">' + time_ago(p.timestamp) + '</span> </div>';
    var template = ' <div class="d-flex justify-content-between text-primary rounded px-3 py-2 purchase" data="' + p.timestamp + '"> <div class="d-flex flex-row"> <div class="p-1 rounded-3 align-self-center"> <img src="assets/images/' + p.currency + '.svg" class="align-self-center" width="30"> </div><div class="d-flex flex-column justify-content-start ms-3"> <span class="fw-semibold">' + p.currency.toUpperCase() + '</span> <span class="">' + p.value + ' ' + p.currency.toUpperCase() + ' (' + p.tokens + ' BTCS)</span> </div></div><small class="ms-5 align-self-start text-muted timestamp">' + time_ago(p.timestamp) + '</small> </div>';

    if (append === true)
        div.append(template);
    else
        div.prepend(template);
}

function updateTimestamps() {
    var purchaseElements = document.querySelectorAll('.purchase');

    purchaseElements.forEach(function (element) {
        var dataValue = element.getAttribute('data');
        var timestampElement = element.querySelector('.timestamp');

        if (timestampElement) {
            timestampElement.textContent = time_ago(dataValue);
        }
    });
}

// setInterval(fetchPurchases, 60000);
// fetchPurchases();


// --- Helper functions --- //




function filterByDate(data, maxDate) {
    return data.filter(item => {
        const dateStr = item.timestamp;
        if (dateStr) {
            const dateObj = new Date(dateStr);
            return dateObj > maxDate;
        }
        return false;
    });
}

function findMaxDate(data) {
    let maxDate = null;
    data.forEach(item => {
        const dateStr = item.timestamp;
        if (dateStr) {
            const dateObj = new Date(dateStr);
            if (maxDate === null || dateObj > maxDate) {
                maxDate = dateObj;
            }
        }
    });
    return maxDate;
}

function time_ago(time) {
    switch (typeof time) {
        case 'number':
            break;
        case 'string':
            time = new Date(time); // Wandelt den Zeitstempel in ein Datum um
            break;
        case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
        default:
            time = +new Date();
    }

    var now = new Date();
    var localTime = new Date(time - now.getTimezoneOffset() * 60000); // Berücksichtigt das UTC-Offset
    var diff = now - localTime;
    var seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
        return 'Just now';
    } else if (seconds < 3600) {
        var minutes = Math.floor(seconds / 60);
        return minutes + ' minutes ago';
    } else if (seconds < 86400) {
        var hours = Math.floor(seconds / 3600);
        return hours + ' hours ago';
    } else {
        return localTime.toLocaleString(undefined, { timeZone: 'auto' });
    }
}