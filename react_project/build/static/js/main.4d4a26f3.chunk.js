(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{16:function(e,t,n){e.exports=n(34)},25:function(e,t,n){},26:function(e,t,n){e.exports=n.p+"static/media/logo.06e73328.svg"},27:function(e,t,n){},34:function(e,t,n){"use strict";n.r(t);var o=n(1),i=n.n(o),r=n(12),c=n.n(r),a=(n(25),n(26),n(27),n(15)),l=n(14);const s=Object(a.a)("/chat",{cors:{origin:"http://localhost:8080/chat",credentials:!0},transports:["websocket"],query:{tenant:"EGU"}}),d=Object(l.v4)();let w,u={},m={},p={};function g(){s.emit("chat message",{type:"move",id:d,vec:u[d],now:p[d],time:(new Date).toLocaleString().toString()})}function y(e){const[t,n]=Object(o.useState)([d,232]);return Object(o.useEffect)(()=>{w=document.getElementById(d+""),p[d]=[w.getBoundingClientRect().top,w.getBoundingClientRect().left],s.on("response",e=>{if(console.log(JSON.stringify(e)),"join new"===e.type){let o=[...t];o.push(e.id),u[e.id]=e.vec,p[e.id]=e.now,n(o),f(e.id)}else if("move"===e.type)u[e.id]=e.vec,p[e.id]=e.now,f(e.id);else if("init"===e.type){u=e.vecObject,p=e.posObject,console.log(JSON.stringify(p)),n(e.list);for(let t=0;t<e.list.length;t++)f(e.list[t])}}),u[d]=[0,0,0,0],m[d]=!1,s.emit("chat message",{type:"join new",id:d,now:p[d],vec:u[d],time:(new Date).toLocaleString().toString()});const e=e=>{let t=!0;"ArrowRight"===e.key?(u[d][0]=1,f(d),console.log("PRESS RIGHT")):"ArrowLeft"===e.key?(u[d][1]=-1,f(d)):"ArrowDown"===e.key?(u[d][2]=1,f(d)):"ArrowUp"===e.key?(u[d][3]=-1,f(d)):t=!1,t&&g()},o=e=>{let t=!0;"ArrowRight"===e.key?u[d][0]=0:"ArrowLeft"===e.key?u[d][1]=0:"ArrowDown"===e.key?u[d][2]=0:"ArrowUp"===e.key?u[d][3]=0:t=!1,t&&g()};return window.addEventListener("keydown",e),window.addEventListener("keyup",o),()=>{window.removeEventListener("keydown",e),window.removeEventListener("keyup",o)}},[]),i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{class:"container"},t.map(e=>i.a.createElement("div",{class:"box",id:e},e))))}function f(e){let t=null,n=null;const o=document.getElementById(e+"");window.requestAnimationFrame(function i(r){t||(t=r,n=r);let c=r-n;n=r,p[e][0]+=(u[e][0]+u[e][1])*Math.min(c,2e3),p[e][1]+=(u[e][2]+u[e][3])*Math.min(c,2e3),o.style.left=p[e][0]+"px",o.style.top=p[e][1]+"px",(u[e][0]||u[e][1]||u[e][2]||u[e][3])&&window.requestAnimationFrame(i)})}var v=function(){return i.a.createElement("div",{className:"App"},i.a.createElement("header",{className:"App-header"},i.a.createElement(y,null)))};var E=e=>{e&&e instanceof Function&&n.e(3).then(n.bind(null,35)).then(t=>{let{getCLS:n,getFID:o,getFCP:i,getLCP:r,getTTFB:c}=t;n(e),o(e),i(e),r(e),c(e)})};c.a.createRoot(document.getElementById("root")).render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(v,null))),E()}},[[16,1,2]]]);
//# sourceMappingURL=main.4d4a26f3.chunk.js.map