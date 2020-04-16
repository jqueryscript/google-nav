// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $('li.last');
var x = localStorage.getItem('x');
var xObject = JSON.parse(x);
var hashMap = xObject || [{
  logo: 'A',
  url: 'https://www.acfun.cn'
}, {
  logo: 'B',
  url: 'https://www.bilibili.com'
}];

var simplifyUrl = function simplifyUrl(url) {
  var newUrl = url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, '');
  return newUrl;
};

var render = function render() {
  $siteList.find('li:not(.last)').remove();
  hashMap.forEach(function (node, index) {
    var $li = $("\n            <li>\n                <div class=\"site\">\n                    <div class=\"logo\">".concat(node.logo, "</div>\n                    <div class=\"link\">").concat(simplifyUrl(node.url), "</div>\n                    <div class=\"close\">\n                        <svg class=\"icon\">\n                            <use xlink:href=\"#icon-close\"></use>\n                        </svg>\n                    </div>\n                </div>\n            </li>\n        ")).insertBefore($lastLi); //监听li元素的点击事件，点击时跳转到该li元素的url网址;
    // 为什么不在创建li元素时直接加一个a标签呢？
    // 问得好，因为这样的话就会导致点击icon-close也会跳转到新链接。
    //下边代码45~72行基本都是加的，为了实现手机端双击显示删除按钮（并且不会触发两次单击事件）

    (function () {
      var sUserAgent = navigator.userAgent;

      if (sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('iPhone') > -1 || sUserAgent.indexOf('iPad') > -1 || sUserAgent.indexOf('iPod') > -1 || sUserAgent.indexOf('Symbian') > -1) {
        console.log("手机端");
        var timeOut = null;
        $li.on('click', function () {
          window.clearTimeout(timeOut);
          timeOut = setTimeout(function () {
            window.open(node.url);
          }, 200); // window.open(node.url);
        }); //适配手机端，双击li显示删除图标

        var $close = $(".close");
        $li.on('dblclick', function () {
          window.clearTimeout(timeOut);
          $close.style.display = 'block';
          window.alert('哈哈');
        });
      } else {
        console.log("电脑端");
        $li.on('click', function () {
          window.open(node.url);
        });
      }
    })(); //监听li元素里的icon图标的点击事件：


    $li.on('click', '.close', function (e) {
      console.log('触发了一次点击删除网址事件');
      e.stopPropagation(); //阻止冒泡到li上

      hashMap.splice(index, 1); //删除hashMap后重新渲染hashMap里的节点到页面

      window.localStorage.setItem('x', JSON.stringify(hashMap));
      console.log(hashMap);
      render();
    });
  });
};

render();
$('.addButton').on('click', function () {
  var url = window.prompt("请问你要添加的网址是什么？"); //  url是以www开头

  if (url.indexOf('www') === 0) {
    url = 'https://' + url;
  } //url是以http开头
  else if (url.indexOf('http') === 0 && url.indexOf('https') <= -1) {
      //url里有www http://www.qq.com
      if (url.indexOf('www') > -1) {
        url = 'https://' + url.substring(7);
      } else {
        //url里没有www, http://qq.com
        url = 'https://www.' + url.substring(7);
      }
    } //url是以https开头
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
$(document).on("keypress", function (e) {
  // 等价于const key = e.key;表示按下的是键盘上哪个键？把这个键赋值给key
  var key = e.key;
  console.log(key); // 遍历hashMap数组

  for (var i = 0; i < hashMap.length; i++) {
    // 如果hashMap数组的某个对象的logo属性的小写字母就是key：
    if (hashMap[i].logo.toLowerCase() === key) {
      // 那么证明匹配按键成功，就打开按键对应的这个对象的url链接：
      window.open(hashMap[i].url);
    }
  }
}); //阻止搜索框的keypress事件冒泡到document上，
// 不阻止的话到冒泡到document上，然后打开对应的网址

$('input').on('keypress', function (e) {
  e.stopPropagation();
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.7a9f3dd4.js.map