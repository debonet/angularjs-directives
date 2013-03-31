// --------------------------------------------------------------------
// attribute attributes=''
//   adds as element attributes (i.e. key=value" all of the key, 
//   values in its argument
//
// Value
//   hash := hash of attributes to be set
//
//   special 'element' member will change the type of the node
//
// Example:
//   <div ng-init="myatts={style:'color:#f00', width: '200px'}"
//     <foo attributes="myatts">
//   </div>
//
(function(){
	var mod = angular.module('attributeAttributes', []);

	mod.directive(
		'attributes',
		["$compile", function(ffCompile){
			return {
				"priority"   : 200000,
				"restrict"   : "A",
				"compile": function(jqCompile,attrs, fTransclude){

					var fjqChangeElement = function(jq,sElement,sType){
						var sElementActual = jq.prop("tagName").toLowerCase();
						if (!sElement){
							sElement = sElementActual;
						}

						if (sElementActual === sElement && jq.attr("type") === sType){
							return jq;
						}

						var jqNew = $("<" + sElement + ">");
						if (sType){
							jqNew.attr("type",sType);
						}

						var aAttr={};
						jq[0].attributes.each(function(node){
							if (node["name"]){
								aAttr[node["name"]] = node["nodeValue"];
							}
						});

						jqNew.attr(aAttr);
						jqNew.append(jq.children());

						return jqNew;
					};

					var fRender;
					return {
						"pre": function(scope, jq, attrs,ctrl){
							var a=scope.$eval(attrs["attributes"]);
							a = a || {};

							if (a["type"] || a["element"]){
								jq = fjqChangeElement(jq,a["element"],a["type"]);
							}

							a.each(function(sVal,sVar){
								if (sVar === "type"){
									return;
								}
								if (!jq.attr(sVar)){
									jq.attr(sVar,sVal);
								}
							});
							jq.removeAttr("attributes");

							fRender = ffCompile(jq,fTransclude);
						},

						"post" : function(scope, jq, attrs, ctrl){
							var x = fRender(scope);

							jq.after(x);
							jq.css("display","none");
						}
					};
				}
			};
		}]
	);

})();
