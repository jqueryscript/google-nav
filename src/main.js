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
        $li.on('click', () => {
            window.open(node.url);
        });
        //监听li元素里的icon图标的点击事件：
        $li.on('click', '.close', (e) => {
            console.log('触发了一次点击事件');
            e.stopPropagation();//阻止冒泡到li上
            hashMap.splice(index, 1);
            console.log(hashMap);
            //删除hashMap后重新渲染hashMap里的节点到页面
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
    console.log(url);
    hashMap.push({
        logo: simplifyUrl(url)[0].toUpperCase(),
        url: url
    });

    render();
});

//浏览器本地存储，每次刷新前存储上次数据
window.onbeforeunload = () => {
    const string = JSON.stringify(hashMap);
    localStorage.setItem('x', string);
};