//>>built
define("dojox/lang/aspect/cflow",["dojo","dijit","dojox"],function(k,m,l){k.provide("dojox.lang.aspect.cflow");(function(){var f=l.lang.aspect;f.cflow=function(g,a){1<arguments.length&&!(a instanceof Array)&&(a=[a]);for(var h=f.getContextStack(),c=h.length-1;0<=c;--c){var b=h[c];if(!g||b.instance==g){if(!a)return!0;for(var b=b.joinPoint.targetName,d=a.length-1;0<=d;--d){var e=a[d];if(e instanceof RegExp){if(e.test(b))return!0}else if(b==e)return!0}}}return!1}})()});
//# sourceMappingURL=cflow.js.map