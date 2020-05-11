const $siteList = $('.siteList');
const $lastLi = $('li.last');
const x = localStorage.getItem('x');
const xObject = JSON.parse(x);

const hashMap = xObject || [
    {
        logo: 'J',
        url: 'https://www.jqueryscript.net'
    },
    {
        logo: 'C',
        url: 'https://www.cssscript.com'
    }
];

const simplifyUrl = (url) => {
    const newUrl = url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '');
    return newUrl;
};

const render = () => {
    $siteList.find('li:not(.last)').remove();
    hashMap.forEach((node, index) => {
        const $li = $(`
            <li>
                <div class="site">
                    <div class="logo">${node.logo}</div>
                    <div class="link">${simplifyUrl(node.url)}</div>
                    <div class="close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </li>
        `).insertBefore($lastLi);

        (function () {
            let sUserAgent = navigator.userAgent;
            if (sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('iPhone') > -1 || sUserAgent.indexOf('iPad') > -1 || sUserAgent.indexOf('iPod') > -1 || sUserAgent.indexOf('Symbian') > -1) {
                console.log("Mobile");
                let timeOut = null;
                $li.on('click', () => {
                    window.clearTimeout(timeOut);
                    timeOut = setTimeout(() => {
                        window.open(node.url);
                    }, 200);
                    // window.open(node.url);
                });

                const $close = $(".close");
                $li.on('dblclick', function () {
                    window.clearTimeout(timeOut);
                    $close.style.display = 'block';
                });
            } else {
                console.log("Desktop");
                $li.on('click', () => {
                    window.open(node.url);
                });
            }
        })();


        $li.on('click', '.close', (e) => {
            console.log('Remove Event');
            e.stopPropagation();
            hashMap.splice(index, 1);
            window.localStorage.setItem('x', JSON.stringify(hashMap));
            console.log(hashMap);
            render();
        });
    });
};

render();

$('.addButton').on('click', () => {
    let url = window.prompt("URL:");
    if (url.indexOf('www') === 0) {
        url = 'https://' + url;
    }
    else if (url.indexOf('http') === 0 && url.indexOf('https') <= -1) {
        if (url.indexOf('www') > -1) {
            url = 'https://' + url.substring(7);
        } else {
            url = 'https://www.' + url.substring(7);
        }
    }
    else if (url.indexOf('https') === 0) {
        if (url.indexOf('www') > -1) {
            url = url;
        } else {
            url = 'https://www.' + url.substring(8);
        }
    } else {
        url = 'https://www.' + url;
    }
    hashMap.push({
        logo: simplifyUrl(url)[0].toUpperCase(),
        url: url
    });
    window.localStorage.setItem('x', JSON.stringify(hashMap));
    console.log('Add Event');
    console.log(hashMap);
    render();
});

$(document).on("keypress", e => {
    const {key} = e;
    console.log(key);
    for (let i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo.toLowerCase() === key) {
            window.open(hashMap[i].url);
        }
    }
});
$('input').on('keypress', (e) => {
    e.stopPropagation();
});
