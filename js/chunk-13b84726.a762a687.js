(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-13b84726"],{6768:function(e,t,n){"use strict";n("6d52")},"6d52":function(e,t,n){},bb7c:function(e,t,n){"use strict";n.r(t);var a=n("7a23"),o=Object(a["B"])("data-v-4b0a42e2");Object(a["s"])("data-v-4b0a42e2");var i={ref:"game_container",class:"game-content mt-1"},s={class:"game-controls"},r=Object(a["f"])("div",{class:"game-screen"},[Object(a["f"])("canvas",{width:"640",height:"480"})],-1);Object(a["q"])();var c=o((function(e,t,n,o,c,l){return Object(a["p"])(),Object(a["d"])("div",i,[Object(a["f"])("div",s,[Object(a["f"])("button",{class:"btn btn-secondary",onClick:t[1]||(t[1]=function(){return o.new_rectangle.apply(o,arguments)})},"Add Rectangle")]),r],512)})),l=n("d4ec"),u=n("bee2"),h=n("257e"),d=n("45eb"),v=n("7e84"),g=n("262e"),_=n("2caf"),p=n("7cda"),f=n("aa84"),b=n("bd27"),m=n("e142"),w=n("6280"),y=function(e){Object(g["a"])(n,e);var t=Object(_["a"])(n);function n(e,a,o,i,s){var r;return Object(l["a"])(this,n),r=t.call(this,e,a,s),r.fill_color=m["a"].create_random(),r.width=o,r.height=i,r}return Object(u["a"])(n,[{key:"draw_sprite",value:function(e){e.fillStyle=this.fill_color.rgba,e.fillRect(this.collision_box.x,this.collision_box.y,this.collision_box.width,this.collision_box.height)}},{key:"move_to",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=Math.atan2(e.x-this.location.x,e.y-this.location.y);return this.velocity=new f["a"](Math.sin(n)*t,Math.cos(n)*t),this}},{key:"collision_box",get:function(){return b["a"].centered_at(this.location,this.width,this.height)}}]),n}(w["a"]),j=function(e){Object(g["a"])(n,e);var t=Object(_["a"])(n);function n(){var e;return Object(l["a"])(this,n),e=t.apply(this,arguments),e.selected_rect=null,e.bound_handlers={mousemove:e.handle_mousemove.bind(Object(h["a"])(e)),mouseup:e.handle_mouseup.bind(Object(h["a"])(e)),mousedown:e.handle_mousedown.bind(Object(h["a"])(e))},e}return Object(u["a"])(n,[{key:"setup",value:function(e){Object(d["a"])(Object(v["a"])(n.prototype),"setup",this).call(this,e),this.sprites.push([]),this.sprites.push([]),this.sprites.push([]),this.rectangles.push(this.create_rectangle(new f["a"](-150,-120),200,200,new m["a"](0,255,0))),this.rectangles.push(this.create_rectangle(new f["a"](100,15),180,50,new m["a"](0,0,255))),this.sprites[2].push(this.create_rectangle(f["a"].origin,1,1e3,new m["a"](255,255,0,.5))),this.sprites[2].push(this.create_rectangle(f["a"].origin,1e3,1,new m["a"](255,255,0,.5))),this.viewport=new b["a"](-e.canvas.width/2,-e.canvas.height/2,e.canvas.width,e.canvas.height)}},{key:"create_rectangle",value:function(e,t,n){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:m["a"].create_random(),o=new y(e.copy(),null,t,n,b["a"].null_rect);return o.fill_color=a,o.did_leave_bounding_box=function(){},o}},{key:"detect_collisions",value:function(e){this.collisions.length=0;for(var t=0;t<this.rectangles.length-1;t++)for(var n=t+1;n<this.rectangles.length;n++){var a=this.rectangles[t].collision_box.intersection(this.rectangles[n].collision_box);a&&this.collisions.push(this.create_rectangle(a.center,a.width,a.height,new m["a"](255,0,0)))}}},{key:"handle_mousedown",value:function(e){e.preventDefault,e.stopPropagation;var t=e.target,n=new f["a"](e.pageX-t.offsetLeft+this.viewport.x,e.pageY-t.offsetTop+this.viewport.y);this.selected_rect=this.get_rect_at(n);var a=this.get_root_node(t);a.addEventListener("mousemove",this.bound_handlers.mousemove),a.addEventListener("mouseup",this.bound_handlers.mouseup)}},{key:"handle_mousemove",value:function(e){e.preventDefault,e.stopPropagation,this.selected_rect?(this.selected_rect.location.x+=e.movementX,this.selected_rect.location.y+=e.movementY):(this.viewport.x-=e.movementX,this.viewport.y-=e.movementY)}},{key:"handle_mouseup",value:function(e){e.preventDefault,e.stopPropagation;var t=e.target;this.selected_rect=null;var n=this.get_root_node(t);n.removeEventListener("mousemove",this.bound_handlers.mousemove),n.removeEventListener("mouseup",this.bound_handlers.mouseup)}},{key:"get_root_node",value:function(e){return e.constructor==HTMLDocument?e:this.get_root_node(e.parentNode)}},{key:"get_rect_at",value:function(e){for(var t=this.rectangles.length-1;t>=0;t--)if(this.rectangles[t].collision_box.contains(e))return this.rectangles[t];return null}},{key:"rectangles",get:function(){return this.sprites[0]}},{key:"collisions",get:function(){return this.sprites[1]}}]),n}(p["a"]),O={setup:function(){var e=Object(a["u"])(null),t=new j;function n(e,t){setInterval(o,0),i(e,t)}function o(){t.update(Math.floor(performance.now())/1e3)}function i(e,n){s(n),t.draw(n),s(e),e.drawImage(n.canvas,0,0),requestAnimationFrame((function(){return i(e,n)}))}function s(e){e.clearRect(0,0,e.canvas.width,e.canvas.height)}function r(){if(t.viewport){var e=Math.floor(151*Math.random())+50,n=Math.floor(151*Math.random())+50,a=t.create_rectangle(t.viewport.center,e,n,m["a"].create_random());t.rectangles.push(a)}}return Object(a["n"])((function(){if(e.value){var a=e.value.querySelector("canvas"),o=document.createElement("canvas").getContext("2d");o.canvas.width=a.width,o.canvas.height=a.height;var i=a.getContext("2d");t.setup(i),e.value.addEventListener("mousedown",t.bound_handlers.mousedown),n(i,o)}})),{game_container:e,new_rectangle:r}}};n("6768");O.render=c,O.__scopeId="data-v-4b0a42e2";t["default"]=O}}]);
//# sourceMappingURL=chunk-13b84726.a762a687.js.map