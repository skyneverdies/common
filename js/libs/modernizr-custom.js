
/*! modernizr 3.3.1 (Custom Build) | MIT *
 * http://modernizr.com/download/?-applicationcache-atobbtoa-cors-cssanimations-csscalc-csschunit-cssgradients-cssresize-csstransforms-csstransitions-cssvhunit-cssvmaxunit-cssvminunit-cssvwunit-eventlistener-fullscreen-geolocation-mediaqueries-proximity-supports-hasevent-setclasses !*/
!function(e,t,n){function i(e,t){return typeof e===t}function r(){var e,t,n,r,o,s,a;for(var l in C)if(C.hasOwnProperty(l)){if(e=[],t=C[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(r=i(t.fn,"function")?t.fn():t.fn,o=0;o<e.length;o++)s=e[o],a=s.split("."),1===a.length?Modernizr[a[0]]=r:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=r),w.push((r?"":"no-")+a.join("-"))}}function o(e){var t=b.className,n=Modernizr._config.classPrefix||"";if(z&&(t=t.baseVal),Modernizr._config.enableJSClass){var i=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(i,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),z?b.className.baseVal=t:b.className=t)}function s(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):z?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function a(e,t){return e-1===t||e===t||e+1===t}function l(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function u(e,t){if("object"==typeof e)for(var n in e)P(e,n)&&u(n,e[n]);else{e=e.toLowerCase();var i=e.split("."),r=Modernizr[i[0]];if(2==i.length&&(r=r[i[1]]),"undefined"!=typeof r)return Modernizr;t="function"==typeof t?t():t,1==i.length?Modernizr[i[0]]=t:(!Modernizr[i[0]]||Modernizr[i[0]]instanceof Boolean||(Modernizr[i[0]]=new Boolean(Modernizr[i[0]])),Modernizr[i[0]][i[1]]=t),o([(t&&0!=t?"":"no-")+i.join("-")]),Modernizr._trigger(e,t)}return Modernizr}function d(){var e=t.body;return e||(e=s(z?"svg":"body"),e.fake=!0),e}function f(e,n,i,r){var o,a,l,u,f="modernizr",c=s("div"),p=d();if(parseInt(i,10))for(;i--;)l=s("div"),l.id=r?r[i]:f+(i+1),c.appendChild(l);return o=s("style"),o.type="text/css",o.id="s"+f,(p.fake?p:c).appendChild(o),p.appendChild(c),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(t.createTextNode(e)),c.id=f,p.fake&&(p.style.background="",p.style.overflow="hidden",u=b.style.overflow,b.style.overflow="hidden",b.appendChild(p)),a=n(c,e),p.fake?(p.parentNode.removeChild(p),b.style.overflow=u,b.offsetHeight):c.parentNode.removeChild(c),!!a}function c(e,t){return!!~(""+e).indexOf(t)}function p(e,t){return function(){return e.apply(t,arguments)}}function m(e,t,n){var r;for(var o in e)if(e[o]in t)return n===!1?e[o]:(r=t[e[o]],i(r,"function")?p(r,n||t):r);return!1}function h(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function v(t,i){var r=t.length;if("CSS"in e&&"supports"in e.CSS){for(;r--;)if(e.CSS.supports(h(t[r]),i))return!0;return!1}if("CSSSupportsRule"in e){for(var o=[];r--;)o.push("("+h(t[r])+":"+i+")");return o=o.join(" or "),f("@supports ("+o+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function g(e,t,r,o){function a(){d&&(delete M.style,delete M.modElem)}if(o=i(o,"undefined")?!1:o,!i(r,"undefined")){var u=v(e,r);if(!i(u,"undefined"))return u}for(var d,f,p,m,h,g=["modernizr","tspan"];!M.style;)d=!0,M.modElem=s(g.shift()),M.style=M.modElem.style;for(p=e.length,f=0;p>f;f++)if(m=e[f],h=M.style[m],c(m,"-")&&(m=l(m)),M.style[m]!==n){if(o||i(r,"undefined"))return a(),"pfx"==t?m:!0;try{M.style[m]=r}catch(y){}if(M.style[m]!=h)return a(),"pfx"==t?m:!0}return a(),!1}function y(e,t,n,r,o){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+j.join(s+" ")+s).split(" ");return i(t,"string")||i(t,"undefined")?g(a,t,r,o):(a=(e+" "+q.join(s+" ")+s).split(" "),m(a,t,n))}function x(e,t,i){return y(e,n,n,t,i)}var w=[],C=[],S={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){C.push({name:e,fn:t,options:n})},addAsyncTest:function(e){C.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=S,Modernizr=new Modernizr,Modernizr.addTest("applicationcache","applicationCache"in e),Modernizr.addTest("cors","XMLHttpRequest"in e&&"withCredentials"in new XMLHttpRequest),Modernizr.addTest("eventlistener","addEventListener"in e),Modernizr.addTest("geolocation","geolocation"in navigator);var _="CSS"in e&&"supports"in e.CSS,T="supportsCSS"in e;Modernizr.addTest("supports",_||T),Modernizr.addTest("atobbtoa","atob"in e&&"btoa"in e,{aliases:["atob-btoa"]});var b=t.documentElement,z="svg"===b.nodeName.toLowerCase(),E=function(){function e(e,t){var r;return e?(t&&"string"!=typeof t||(t=s(t||"div")),e="on"+e,r=e in t,!r&&i&&(t.setAttribute||(t=s("div")),t.setAttribute(e,""),r="function"==typeof t[e],t[e]!==n&&(t[e]=n),t.removeAttribute(e)),r):!1}var i=!("onblur"in t.documentElement);return e}();S.hasEvent=E;var N=S._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];S._prefixes=N,Modernizr.addTest("csscalc",function(){var e="width:",t="calc(10px);",n=s("a");return n.style.cssText=e+N.join(t+e),!!n.style.length}),Modernizr.addTest("cssgradients",function(){for(var e,t="background-image:",n="gradient(linear,left top,right bottom,from(#9f9),to(white));",i="",r=0,o=N.length-1;o>r;r++)e=0===r?"to ":"",i+=t+N[r]+"linear-gradient("+e+"left top, #9f9, white);";Modernizr._config.usePrefixes&&(i+=t+"-webkit-"+n);var a=s("a"),l=a.style;return l.cssText=i,(""+l.backgroundImage).indexOf("gradient")>-1});var L={elem:s("modernizr")};Modernizr._q.push(function(){delete L.elem}),Modernizr.addTest("csschunit",function(){var e,t=L.elem.style;try{t.fontSize="3ch",e=-1!==t.fontSize.indexOf("ch")}catch(n){e=!1}return e});var P;!function(){var e={}.hasOwnProperty;P=i(e,"undefined")||i(e.call,"undefined")?function(e,t){return t in e&&i(e.constructor.prototype[t],"undefined")}:function(t,n){return e.call(t,n)}}(),S._l={},S.on=function(e,t){this._l[e]||(this._l[e]=[]),this._l[e].push(t),Modernizr.hasOwnProperty(e)&&setTimeout(function(){Modernizr._trigger(e,Modernizr[e])},0)},S._trigger=function(e,t){if(this._l[e]){var n=this._l[e];setTimeout(function(){var e,i;for(e=0;e<n.length;e++)(i=n[e])(t)},0),delete this._l[e]}},Modernizr._q.push(function(){S.addTest=u}),Modernizr.addAsyncTest(function(){function t(){clearTimeout(n),e.removeEventListener("deviceproximity",t),u("proximity",!0)}var n,i=300;"ondeviceproximity"in e&&"onuserproximity"in e?(e.addEventListener("deviceproximity",t),n=setTimeout(function(){e.removeEventListener("deviceproximity",t),u("proximity",!1)},i)):u("proximity",!1)});var I=function(){var t=e.matchMedia||e.msMatchMedia;return t?function(e){var n=t(e);return n&&n.matches||!1}:function(t){var n=!1;return f("@media "+t+" { #modernizr { position: absolute; } }",function(t){n="absolute"==(e.getComputedStyle?e.getComputedStyle(t,null):t.currentStyle).position}),n}}();S.mq=I,Modernizr.addTest("mediaqueries",I("only all"));var A=S.testStyles=f;A("#modernizr { height: 50vh; }",function(t){var n=parseInt(e.innerHeight/2,10),i=parseInt((e.getComputedStyle?getComputedStyle(t,null):t.currentStyle).height,10);Modernizr.addTest("cssvhunit",i==n)}),A("#modernizr1{width: 50vmax}#modernizr2{width:50px;height:50px;overflow:scroll}#modernizr3{position:fixed;top:0;left:0;bottom:0;right:0}",function(t){var n=t.childNodes[2],i=t.childNodes[1],r=t.childNodes[0],o=parseInt((i.offsetWidth-i.clientWidth)/2,10),s=r.clientWidth/100,l=r.clientHeight/100,u=parseInt(50*Math.max(s,l),10),d=parseInt((e.getComputedStyle?getComputedStyle(n,null):n.currentStyle).width,10);Modernizr.addTest("cssvmaxunit",a(u,d)||a(u,d-o))},3),A("#modernizr1{width: 50vm;width:50vmin}#modernizr2{width:50px;height:50px;overflow:scroll}#modernizr3{position:fixed;top:0;left:0;bottom:0;right:0}",function(t){var n=t.childNodes[2],i=t.childNodes[1],r=t.childNodes[0],o=parseInt((i.offsetWidth-i.clientWidth)/2,10),s=r.clientWidth/100,l=r.clientHeight/100,u=parseInt(50*Math.min(s,l),10),d=parseInt((e.getComputedStyle?getComputedStyle(n,null):n.currentStyle).width,10);Modernizr.addTest("cssvminunit",a(u,d)||a(u,d-o))},3),A("#modernizr { width: 50vw; }",function(t){var n=parseInt(e.innerWidth/2,10),i=parseInt((e.getComputedStyle?getComputedStyle(t,null):t.currentStyle).width,10);Modernizr.addTest("cssvwunit",i==n)});var O="Moz O ms Webkit",j=S._config.usePrefixes?O.split(" "):[];S._cssomPrefixes=j;var k=function(t){var i,r=N.length,o=e.CSSRule;if("undefined"==typeof o)return n;if(!t)return!1;if(t=t.replace(/^@/,""),i=t.replace(/-/g,"_").toUpperCase()+"_RULE",i in o)return"@"+t;for(var s=0;r>s;s++){var a=N[s],l=a.toUpperCase()+"_"+i;if(l in o)return"@-"+a.toLowerCase()+"-"+t}return!1};S.atRule=k;var q=S._config.usePrefixes?O.toLowerCase().split(" "):[];S._domPrefixes=q;var M={style:L.elem.style};Modernizr._q.unshift(function(){delete M.style}),S.testAllProps=y;var R=S.prefixed=function(e,t,n){return 0===e.indexOf("@")?k(e):(-1!=e.indexOf("-")&&(e=l(e)),t?y(e,t,n):y(e,"pfx"))};Modernizr.addTest("fullscreen",!(!R("exitFullscreen",t,!1)&&!R("cancelFullScreen",t,!1))),S.testAllProps=x,Modernizr.addTest("cssanimations",x("animationName","a",!0)),Modernizr.addTest("cssresize",x("resize","both",!0)),Modernizr.addTest("csstransitions",x("transition","all",!0)),Modernizr.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&x("transform","scale(1)",!0)}),r(),o(w),delete S.addTest,delete S.addAsyncTest;for(var W=0;W<Modernizr._q.length;W++)Modernizr._q[W]();e.Modernizr=Modernizr}(window,document);