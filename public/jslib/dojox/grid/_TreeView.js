//>>built
require({cache:{"url:dojox/grid/resources/Expando.html":'\x3cdiv class\x3d"dojoxGridExpando"\n\t\x3e\x3cdiv class\x3d"dojoxGridExpandoNode" dojoAttachEvent\x3d"onclick:onToggle"\n\t\t\x3e\x3cdiv class\x3d"dojoxGridExpandoNodeInner" dojoAttachPoint\x3d"expandoInner"\x3e\x3c/div\n\t\x3e\x3c/div\n\x3e\x3c/div\x3e\n'}});
define("dojox/grid/_TreeView","dijit/registry ../main dojo/_base/declare dojo/_base/array dojo/_base/lang dojo/_base/event dojo/dom-attr dojo/dom-class dojo/dom-style dojo/dom-construct dojo/query dojo/parser dojo/text!./resources/Expando.html dijit/_Widget dijit/_TemplatedMixin ./_View ./_Builder ./util".split(" "),function(t,D,k,x,y,F,h,f,E,G,g,H,q,I,J,K,L,M){k("dojox.grid._Expando",[I,J],{open:!1,toggleClass:"",itemId:"",cellIdx:-1,view:null,rowNode:null,rowIdx:-1,expandoCell:null,level:0,templateString:q,
_toggleRows:function(a,c){if(a&&this.rowNode)if(g("table.dojoxGridRowTableNeedsRowUpdate").length)this._initialized&&this.view.grid.updateRow(this.rowIdx);else{var b=this;if(this.view.grid.treeModel){var e=this._tableRow?h.get(this._tableRow,"dojoxTreeGridPath"):"";e&&g('tr[dojoxTreeGridPath^\x3d"'+e+'/"]',this.rowNode).forEach(function(b){var d=g(".dojoxGridExpando",b)[0];d&&d.parentNode&&d.parentNode.parentNode&&!f.contains(d.parentNode.parentNode,"dojoxGridNoChildren")&&(d=t.byNode(d))&&d._toggleRows(a,
d.open&&c);b.style.display=c?"":"none"})}else g("tr."+a,this.rowNode).forEach(function(a){if(f.contains(a,"dojoxGridExpandoRow")){var d=g(".dojoxGridExpando",a)[0];if(d){var e=t.byNode(d),r=e?e.toggleClass:d.getAttribute("toggleClass"),d=e?e.open:b.expandoCell.getOpenState(d.getAttribute("itemId"));b._toggleRows(r,d&&c)}}a.style.display=c?"":"none"})}},setOpen:function(a){a&&f.contains(this.domNode,"dojoxGridExpandoLoading")&&(a=!1);var c=this.view.grid,b=c.store,e=c.treeModel,u=this;if(c._by_idx[this.rowIdx])if(e&&
!this._loadedChildren)if(a){var d=c.getItem(h.get(this._tableRow,"dojoxTreeGridPath"));d?(this.expandoInner.innerHTML="o",f.add(this.domNode,"dojoxGridExpandoLoading"),e.getChildren(d,function(b){u._loadedChildren=!0;u._setOpen(a)})):this._setOpen(a)}else this._setOpen(a);else!e&&b?a?(e=c._by_idx[this.rowIdx])&&!b.isItemLoaded(e.item)?(this.expandoInner.innerHTML="o",f.add(this.domNode,"dojoxGridExpandoLoading"),b.loadItem({item:e.item,onItem:y.hitch(this,function(e){var d=b.getIdentity(e);c._by_idty[d]=
c._by_idx[this.rowIdx]={idty:d,item:e};this._setOpen(a)})})):this._setOpen(a):this._setOpen(a):this._setOpen(a)},_setOpen:function(a){if(a&&this._tableRow&&f.contains(this._tableRow,"dojoxGridNoChildren"))this._setOpen(!1);else{this.expandoInner.innerHTML=a?"-":"+";f.remove(this.domNode,"dojoxGridExpandoLoading");f.toggle(this.domNode,"dojoxGridExpandoOpened",a);if(this._tableRow){f.toggle(this._tableRow,"dojoxGridRowCollapsed",!a);var c=h.get(this._tableRow,"dojoxTreeGridBaseClasses"),b="",b=a?y.trim((" "+
c+" ").replace(" dojoxGridRowCollapsed "," ")):0>(" "+c+" ").indexOf(" dojoxGridRowCollapsed ")?c+(c?" ":"")+"dojoxGridRowCollapsed":c;h.set(this._tableRow,"dojoxTreeGridBaseClasses",b)}c=this.open!==a;this.open=a;this.expandoCell&&this.itemId&&(this.expandoCell.openStates[this.itemId]=a);var b=this.view,e=b.grid;this.toggleClass&&c&&(this._tableRow&&this._tableRow.style.display||this._toggleRows(this.toggleClass,a));b&&this._initialized&&0<=this.rowIdx&&(e.rowHeightChanged(this.rowIdx),e.postresize(),
b.hasVScrollbar(!0));this._initialized=!0}},onToggle:function(a){this.setOpen(!this.open);F.stop(a)},setRowNode:function(a,c,b){if(0>this.cellIdx||!this.itemId)return!1;this._initialized=!1;this.view=b;this.rowNode=c;this.rowIdx=a;this.expandoCell=b.structure.cells[0][this.cellIdx];(a=this.domNode)&&a.parentNode&&a.parentNode.parentNode&&(this._tableRow=a.parentNode.parentNode);this.open=this.expandoCell.getOpenState(this.itemId);b.grid.treeModel&&(E.set(this.domNode,"marginLeft",18*this.level+"px"),
this.domNode.parentNode&&E.set(this.domNode.parentNode,"backgroundPosition",18*this.level+3+"px"));this.setOpen(this.open);return!0}});q=k("dojox.grid._TreeContentBuilder",L._ContentBuilder,{generateHtml:function(a,c){var b=this.getTableArray(),e=this.view,u=e.structure.cells[0],d=this.grid.getItem(c),l=this.grid,r=this.grid.store;M.fire(this.view,"onBeforeRow",[c,[u]]);var C=function(a,c,d,f,g,h){if(h){var z=b.length;f=f||[];var k=f.join("|"),A=f[f.length-1],m=A+(d?" dojoxGridSummaryRow":"");l.treeModel&&
c&&!l.treeModel.mayHaveChildren(c)&&(m+=" dojoxGridNoChildren");b.push('\x3ctr style\x3d"" class\x3d"'+m+'" dojoxTreeGridPath\x3d"'+g.join("/")+'" dojoxTreeGridBaseClasses\x3d"'+m+'"\x3e');for(var q=a+1,m=null,v=0,n;n=u[v];v++){var B=n.markup,t=n.customClasses=[],y=n.customStyles=[];B[5]=n.formatAtLevel(g,c,a,d,A,t);B[1]=t.join(" ");B[3]=y.join(";");b.push.apply(b,B);!m&&n.level===q&&n.parentCell&&(m=n.parentCell)}b.push("\x3c/tr\x3e");c&&r&&r.isItem(c)&&(v=r.getIdentity(c),"undefined"==typeof l._by_idty_paths[v]&&
(l._by_idty_paths[v]=g.join("/")));var w,p=g.concat([]);l.treeModel&&c?l.treeModel.mayHaveChildren(c)&&(d=e.structure.cells[0][l.expandoCell||0],w=d.getOpenState(c)&&h,d=new D.grid.TreePath(g.join("/"),l),d=d.children(!0)||[],x.forEach(d,function(a,b){var d=k.split("|");d.push(d[d.length-1]+"-"+b);p.push(b);C(q,a,!1,d,p,w);p.pop()})):c&&m&&!d?(d=e.structure.cells[0][m.level],w=d.getOpenState(c)&&h,r.hasAttribute(c,m.field)?(h=k.split("|"),h.pop(),d=new D.grid.TreePath(g.join("/"),l),d=d.children(!0)||
[],d.length?(b[z]='\x3ctr class\x3d"'+h.join(" ")+' dojoxGridExpandoRow" dojoxTreeGridPath\x3d"'+g.join("/")+'"\x3e',x.forEach(d,function(a,b){var d=k.split("|");d.push(d[d.length-1]+"-"+b);p.push(b);C(q,a,!1,d,p,w);p.pop()}),p.push(d.length),C(a,c,!0,f,p,w)):b[z]='\x3ctr class\x3d"'+A+' dojoxGridNoChildren" dojoxTreeGridPath\x3d"'+g.join("/")+'"\x3e'):r.isItemLoaded(c)?b[z]='\x3ctr class\x3d"'+A+' dojoxGridNoChildren" dojoxTreeGridPath\x3d"'+g.join("/")+'"\x3e':b[0]=b[0].replace("dojoxGridRowTable",
"dojoxGridRowTable dojoxGridRowTableNeedsRowUpdate")):c&&!d&&1<f.length&&(b[z]='\x3ctr class\x3d"'+f[f.length-2]+'" dojoxTreeGridPath\x3d"'+g.join("/")+'"\x3e')}else-1==b[0].indexOf("dojoxGridRowTableNeedsRowUpdate")&&(b[0]=b[0].replace("dojoxGridRowTable","dojoxGridRowTable dojoxGridRowTableNeedsRowUpdate"))};C(0,d,!1,["dojoxGridRowToggle-"+c],[c],!0);b.push("\x3c/table\x3e");return b.join("")},findTarget:function(a,c){for(var b=a;b&&b!=this.domNode&&(!b.tagName||"tr"!=b.tagName.toLowerCase());)b=
b.parentNode;return b!=this.domNode?b:null},getCellNode:function(a,c){var b=g("td[idx\x3d'"+c+"']",a)[0];if(b&&b.parentNode&&!f.contains(b.parentNode,"dojoxGridSummaryRow"))return b},decorateEvent:function(a){a.rowNode=this.findRowTarget(a.target);if(!a.rowNode)return!1;a.rowIndex=h.get(a.rowNode,"dojoxTreeGridPath");this.baseDecorateEvent(a);a.cell=this.grid.getCell(a.cellIndex);return!0}});return k("dojox.grid._TreeView",K,{_contentBuilderClass:q,_onDndDrop:function(a,c,b){this.grid&&this.grid.aggregator&&
this.grid.aggregator.clearSubtotalCache();this.inherited(arguments)},postCreate:function(){this.inherited(arguments);this.connect(this.grid,"_cleanupExpandoCache","_cleanupExpandoCache")},_cleanupExpandoCache:function(a,c,b){if(-1!=a)if(x.forEach(this.grid.layout.cells,function(a){"undefined"!=typeof a.openStates&&c in a.openStates&&delete a.openStates[c]}),"string"==typeof a&&-1<a.indexOf("/")){var e=new D.grid.TreePath(a,this.grid);for(a=e.parent();a;)e=a,a=e.parent();if(e=e.item())if(e=this.grid.store.getIdentity(e),
"undefined"!=typeof this._expandos[e]){for(var f in this._expandos[e])(a=this._expandos[e][f])&&a.destroy(),delete this._expandos[e][f];delete this._expandos[e]}}else{for(f in this._expandos)if("undefined"!=typeof this._expandos[f])for(e in this._expandos[f])(a=this._expandos[f][e])&&a.destroy();this._expandos={}}},postMixInProperties:function(){this.inherited(arguments);this._expandos={}},onBeforeRow:function(a,c){var b=this.grid;b._by_idx&&b._by_idx[a]&&b._by_idx[a].idty&&(b=b._by_idx[a].idty,this._expandos[b]=
this._expandos[b]||{});this.inherited(arguments)},onAfterRow:function(a,c,b){x.forEach(g("span.dojoxGridExpando",b),function(d){if(d&&d.parentNode){var c=d.getAttribute("toggleClass"),e,f,g=this.grid;g._by_idx&&g._by_idx[a]&&g._by_idx[a].idty&&(e=g._by_idx[a].idty,f=this._expandos[e][c]);f?(G.place(f.domNode,d,"replace"),f.itemId=d.getAttribute("itemId"),f.cellIdx=parseInt(d.getAttribute("cellIdx"),10),isNaN(f.cellIdx)&&(f.cellIdx=-1)):e&&(f=H.parse(d.parentNode)[0],this._expandos[e][c]=f);f&&!f.setRowNode(a,
b,this)&&f.domNode.parentNode.removeChild(f.domNode)}},this);var e=!1,k=this;g("tr[dojoxTreeGridPath]",b).forEach(function(a){f.toggle(a,"dojoxGridSubRowAlt",e);h.set(a,"dojoxTreeGridBaseClasses",a.className);e=!e;k.grid.rows.styleRowNode(h.get(a,"dojoxTreeGridPath"),a)});this.inherited(arguments)},updateRowStyles:function(a){var c=g("tr[dojoxTreeGridPath\x3d'"+a+"']",this.domNode);c.length&&this.styleRowNode(a,c[0])},getCellNode:function(a,c){var b=g("tr[dojoxTreeGridPath\x3d'"+a+"']",this.domNode)[0];
if(b)return this.content.getCellNode(b,c)},destroy:function(){this._cleanupExpandoCache();this.inherited(arguments)}})});
//# sourceMappingURL=_TreeView.js.map