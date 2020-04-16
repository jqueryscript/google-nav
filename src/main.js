const $siteList = $('.siteList');
const $lastLi = $('li.last');
const x = localStorage.getItem('x');
const xObject = JSON.parse(x);

const hashMap = xObject || [
    {
        logo: 'A',
        url: 'https://www.acfun.cn'
    },
    {
        logo: 'B',
        url: 'https://www.bilibili.com'
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
                        <svg class="icon">
                            <use xlink:href="#icon-close"></use>
                        </svg>
                    </div>
                </div>
            </li>
        `).insertBefore($lastLi);
        //监听li元素的点击事件，点击时跳转到该li元素的url网址;
        // 为什么不在创建li元素时直接加一个a标签呢？
        // 问得好，因为这样的话就会导致点击icon-close也会跳转到新链接。

        //下边代码45~72行基本都是加的，为了实现手机端双击显示删除按钮（并且不会触发两次单击事件）
        (function () {
            let sUserAgent = navigator.userAgent;
            if (sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('iPhone') > -1 || sUserAgent.indexOf('iPad') > -1 || sUserAgent.indexOf('iPod') > -1 || sUserAgent.indexOf('Symbian') > -1) {
                console.log("手机端");
                let timeOut = null;
                $li.on('click', () => {
                    window.clearTimeout(timeOut);
                    timeOut = setTimeout(() => {
                        window.open(node.url);
                    }, 200);
                    // window.open(node.url);
                });

                //适配手机端，双击li显示删除图标
                const $close = $(".close");
                $li.on('dblclick', function () {
                    window.clearTimeout(timeOut);
                    $close.style.display = 'block';
                    window.alert('哈哈');
                });
            } else {
                console.log("电脑端");
                $li.on('click', () => {
                    window.open(node.url);
                });
            }
        })();


        //监听li元素里的icon图标的点击事件：
        $li.on('click', '.close', (e) => {
            console.log('触发了一次点击删除网址事件');
            e.stopPropagation();//阻止冒泡到li上
            hashMap.splice(index, 1);
            //删除hashMap后重新渲染hashMap里的节点到页面
            window.localStorage.setItem('x', JSON.stringify(hashMap));
            console.log(hashMap);
            render();
        });
    });
};

render();

$('.addButton').on('click', () => {
    let url = window.prompt("请问你要添加的网址是什么？");
    //  url是以www开头
    if (url.indexOf('www') === 0) {
        url = 'https://' + url;
    }
    //url是以http开头
    else if (url.indexOf('http') === 0 && url.indexOf('https') <= -1) {
        //url里有www http://www.qq.com
        if (url.indexOf('www') > -1) {
            url = 'https://' + url.substring(7);
        } else {
            //url里没有www, http://qq.com
            url = 'https://www.' + url.substring(7);
        }
    }
    //url是以https开头
    else if (url.indexOf('https') === 0) {
        //url里有www https://www.qq.com
        if (url.indexOf('www') > -1) {
            url = url;
        } else {
            //url里没有www, https://qq.com
            url = 'https://www.' + url.substring(8);
        }
    } else {
        //qq.com
        url = 'https://www.' + url;
    }
    hashMap.push({
        logo: simplifyUrl(url)[0].toUpperCase(),
        url: url
    });
    window.localStorage.setItem('x', JSON.stringify(hashMap));
    console.log('触发了一次点击添加网址事件');
    console.log(hashMap);
    render();
});

$(document).on("keypress", e => {
    // 等价于const key = e.key;表示按下的是键盘上哪个键？把这个键赋值给key
    const {key} = e;
    console.log(key);
    // 遍历hashMap数组
    for (let i = 0; i < hashMap.length; i++) {
        // 如果hashMap数组的某个对象的logo属性的小写字母就是key：
        if (hashMap[i].logo.toLowerCase() === key) {
            // 那么证明匹配按键成功，就打开按键对应的这个对象的url链接：
            window.open(hashMap[i].url);
        }
    }
});

//阻止搜索框的keypress事件冒泡到document上，
// 不阻止的话到冒泡到document上，然后打开对应的网址
$('input').on('keypress', (e) => {
    e.stopPropagation();
});