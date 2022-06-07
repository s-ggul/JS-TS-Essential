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
})({"app.ts":[function(require,module,exports) {
"use strict";

var ajax = new XMLHttpRequest();
var container = document.getElementById('root');
var content = document.createElement('div');
var NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
var CONTENTS_URL = 'https://api.hnpwa.com/v0/item/@id.json';
var store = {
  currentPage: 1,
  feeds: []
}; // 후에 newsFeed 뿐 아니라 detail에서 목록으로 넘어올 경우에 활용할 수 있으므로, 전역 객체로 설정하여 남겨둔다.

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

function makeFeeds(feeds) {
  for (var i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }

  return feeds;
}

function newsFeed() {
  var newsFeed = store.feeds;
  var newsList = [];

  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeeds(getData(NEWS_URL));
  }

  var maxPage = Math.ceil(newsFeed.length / 10);
  var template = "\n    <div class=\"bg-gray-600 min-h-screen\">\n        <div class=\"bg-white text-xl\">\n        <div class=\"mx-auto px-4\">\n            <div class=\"flex justify-between items-center py-6\">\n            <div class=\"flex justify-start\">\n                <h1 class=\"font-extrabold\">Hacker News</h1>\n            </div>\n            <div class=\"items-center justify-end\">\n                <a href=\"#/page/{{__prev_page__}}\" class=\"text-gray-500\">\n                Previous\n                </a>\n                <a href=\"#/page/{{__next_page__}}\" class=\"text-gray-500 ml-4\">\n                Next\n                </a>\n            </div>\n            </div> \n        </div>\n        </div>\n        <div class=\"p-4 text-2xl text-gray-700\">\n        {{__news_feed__}}        \n        </div>\n    </div>\n    ";

  for (var i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push("\n        <div class=\"p-6 ".concat(newsFeed[i].read ? 'bg-blue-500' : 'bg-white', " mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100\">\n            <div class=\"flex\">\n            <div class=\"flex-auto\">\n                <a href=\"#/show/").concat(newsFeed[i].id, "\">").concat(newsFeed[i].title, "</a>  \n            </div>\n            <div class=\"text-center text-sm\">\n                <div class=\"w-10 text-white bg-green-300 rounded-lg px-0 py-2\">").concat(newsFeed[i].comments_count, "</div>\n            </div>\n            </div>\n            <div class=\"flex mt-3\">\n            <div class=\"grid grid-cols-3 text-sm text-gray-500\">\n                <div><i class=\"fas fa-user mr-1\"></i>").concat(newsFeed[i].user, "</div>\n                <div><i class=\"fas fa-heart mr-1\"></i>").concat(newsFeed[i].points, "</div>\n                <div><i class=\"far fa-clock mr-1\"></i>").concat(newsFeed[i].time_ago, "</div>\n            </div>  \n            </div>\n        </div>    \n      "));
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1);
  template = template.replace('{{__next_page__}}', store.currentPage === maxPage ? store.currentPage : store.currentPage + 1);
  container.innerHTML = template;
}

function newsDetail() {
  var id = location.hash.substring(7);
  var newsContent = getData(CONTENTS_URL.replace('@id', id));
  var template = "\n    <div class=\"bg-gray-600 min-h-screen pb-8\">\n      <div class=\"bg-white text-xl\">\n        <div class=\"mx-auto px-4\">\n          <div class=\"flex justify-between items-center py-6\">\n            <div class=\"flex justify-start\">\n              <h1 class=\"font-extrabold\">Hacker News</h1>\n            </div>\n            <div class=\"items-center justify-end\">\n              <a href=\"#/page/".concat(store.currentPage, "\" class=\"text-gray-500\">\n                <i class=\"fa fa-times\"></i>\n              </a>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"h-full border rounded-xl bg-white m-6 p-4 \">\n        <h2>").concat(newsContent.title, "</h2>\n        <div class=\"text-gray-400 h-20\">\n          ").concat(newsContent.content // 컨텐츠가 안넘오옴 API로 제공이 안되는듯함
  , " \n        </div>\n\n        {{__comments__}}\n\n      </div>\n    </div>\n    ");

  for (var i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  } // comment(댓글)의 경우 comment에 하위에 또 comment가 있는 depth 가 깊어지는 형태로 되어있어 
  // 총 comment가 몇개인지 알기 어렵다. 그러한 데이터를 처리하는데 있어 채택할 수 있는 방법을 강구한다.
  // comment의 ui를 만드는 것은 함수로 만들어야 함은 자명하다. => 댓글이 여러개다 라고 생각하면 반복해서 불리는 구조일테니 UI를 만들기위해 함수로 정의한다.


  function makeComment(comments, called) {
    if (called === void 0) {
      called = 0;
    }

    var commentString = [];

    for (var i = 0; i < comments.length; i++) {
      commentString.push("\n            <div style=\"padding-left: ".concat(called * 40, "px;\" class=\"mt-4\">\n                <div class=\"text-gray-400\">\n                    <i class=\"fa fa-sort-up mr-2\"></i>\n                    <strong>").concat(comments[i].user, "</strong> ").concat(comments[i].time_ago, "\n                </div>\n                <p class=\"text-gray-700\">").concat(comments[i].content, "</p>\n            </div>   \n            "));

      if (comments[i].comments.length > 0) {
        commentString.push(makeComment(comments[i].comments, called + 1)); // 재귀호출을 통해 해당 댓글의 댓글 대댓글... 까지 모두 달아준다.
        // 이렇게 끝을 알 수 없는 구조에 자주 사용되는 테크닉이고 익숙해져야한다.
      }
    }

    return commentString.join('');
  }

  container.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments));
}

function router() {
  var routePath = location.hash; // location.hash에 '#'만 들어가있는 경우에는 빈문자열을 반환한다.

  if (routePath === '') {
    newsFeed();
  } else if (routePath.indexOf('#/page/') >= 0) {
    // indexOf는 인자로 들어온 문자열이 포함되어 있다면 0 ~ (문자열 길이-1) 까지의 인덱스를 반환한다.
    // 만일 포함되지 않았다면 -1을 반환한다.
    store.currentPage = Number(routePath.substring(7));
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener('hashchange', router); // 기존 hashchanger의 이벤트 함수가 newsDetail로 작성된 경우 해시가 바뀌면 무조건 글내용을 보여줘 라는 코드이다.
// 이제 hashchange의 이벤트 함수를 route로 해줌으로써 경로의 해시값이 바뀔때마다 어떤 화면으로 가는지 정해준다.

router();
},{}],"C:/Users/k0s0a/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53931" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/k0s0a/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.ts"], null)
//# sourceMappingURL=/app.c61986b1.js.map