!function(e){function r(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,r),o.l=!0,o.exports}var n={};r.m=e,r.c=n,r.d=function(e,n,t){r.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,n){if(1&n&&(e=r(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(r.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)r.d(t,o,function(r){return e[r]}.bind(null,o));return t},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},r.p=__GLOBAL__.cdn,r(r.s=24)}({2:function(e,r,n){"use strict";function t(e,r){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=o(e))||r&&e&&"number"==typeof e.length){n&&(e=n);var t=0,i=function(){};return{s:i,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,a=!0,u=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return a=e.done,e},e:function(e){u=!0,c=e},f:function(){try{a||null==n.return||n.return()}finally{if(u)throw c}}}}function o(e,r){if(e){if("string"==typeof e)return i(e,r);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(e,r):void 0}}function i(e,r){(null==r||r>e.length)&&(r=e.length);for(var n=0,t=Array(r);n<r;n++)t[n]=e[n];return t}n.d(r,"d",(function(){return c})),n.d(r,"e",(function(){return a})),n.d(r,"a",(function(){return u})),n.d(r,"b",(function(){return l})),n.d(r,"c",(function(){return f}));var c=function(e,r){if(e instanceof Array){var n,o=t(e);try{for(o.s();!(n=o.n()).done;){n.value.classList.add(r)}}catch(e){o.e(e)}finally{o.f()}}else e.classList.add(r)},a=function(e,r){if(e instanceof Array){var n,o=t(e);try{for(o.s();!(n=o.n()).done;){n.value.classList.remove(r)}}catch(e){o.e(e)}finally{o.f()}}else e.classList.remove(r)},u=function(e){var r=1<arguments.length&&void 0!==arguments[1]?arguments[1]:2;return"$"+(+e/100).toLocaleString("en-EN",{minimumFractionDigits:r})},l=function(e){var r=1<arguments.length&&void 0!==arguments[1]?arguments[1]:1e3;return(""+e).replace(/([.](?:jpe?g|png))/,"_".concat(r,"x$1"))},f=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"";return e.replace(/^[\s_]+|[\s_]+$/g,"").replace(/[_\s]+/g," ").replace(/^[a-z]/,(function(e){return e.toUpperCase()}))}},24:function(e,r,n){e.exports=n(25)},25:function(e,r,n){"use strict";n.r(r);var t=n(2),o=__GLOBAL__.lineItems,i=["Color","Text","Name","Line 1","Line 2","Line 3","Font","Back Line 1","Back Line 2","Back Line 3"];(0,Checkout.$)(document).on("page:load page:change",(function(){o&&Array.from(document.querySelectorAll('[data-order-summary-section="line-items"]')[0].children).map((function(e,r){var n=__GLOBAL__.lineItems[r];Array.from(e.querySelectorAll(".product__description__property")).map((function(e){var r=e.innerText.split(":")[0].trim(),n=(i.findIndex((function(e){return e===r}))||0)+1;e.style.order=n})),"Monogram Fee"===n.product_type&&(e.style.display="none");var c=(n.properties.find((function(e){return!!e._monogram_key}))||{})._monogram_key;if(c){var a=o.find((function(e){return e.key!==n.key&&e.properties.some((function(e){return e._monogram_key===c}))}));if(a){var u=document.createElement("p");u.className="product__description__property order-summary__small-text monogram-pricing",u.innerHTML="Monogram: +".concat(a.line_price_money),u.style.order=100,e.querySelector("th.product__description .monogram-pricing")||e.querySelector("th.product__description").append(u);var l=n.line_price+a.line_price;e.querySelector("td.product__price .order-summary__emphasis").innerText="".concat(Object(t.a)(l))}Array.from(e.querySelectorAll(".product__description__property")).map((function(e){e.innerHTML=Object(t.c)(e.innerHTML)}));var f=document.createElement("p");f.className="product__description__property order-summary__small-text monogram-note",f.innerHTML=__GLOBAL__.finalSaleText,f.style.order=101,e.querySelector("th.product__description .monogram-note")||e.querySelector("th.product__description").append(f)}}))}))}});