(function(){

	var mod = angular.module('attributeEvalBindHtml', []);

	mod.directive(
		'evalBindHtml', 
		['$compile', function(fCompile) {
			return {
				"scope" : false,
				"link" : function(scope, jq, attrs) {
					scope.$watch(
						attrs['evalBindHtml'], 
						function(shtmlNew) {
							if (shtmlNew){
								jq.html(shtmlNew);
								fCompile(jq.contents())(scope);
							}
						}
					);
				}
			};
		}]
	);
})();
