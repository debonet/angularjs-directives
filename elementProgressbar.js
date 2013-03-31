(function(){
	document.createElement('progressbar');

	var modProgressbar = angular.module('elementProgressbar', ['attributeEvents']);

	modProgressbar.directive(
		'progressbar',  
		function(){
			return {
				"restrict" : "E",
				"replace" : true,
				"scope" : false,
				"template" : (
					''
					+ '<span class="progressbar">'
					+   '<span />'
					+ '</span>'
				),
				"controller" : [
					"$scope","$element", "$attrs", "$timeout", 
					function(scope,jq, aAttr, fTimeout){

						scope.$watch(aAttr["ngModel"], function(){


							var rMin = scope.$eval(aAttr["min"]) || 0;
							var rMax = scope.$eval(aAttr["max"]) || 0;
							var r = scope.$eval(aAttr["ngModel"]);
							var rPercent = (r - rMin + 1) / (rMax - rMin) * 100;

							jq.find('span').css("width",  rPercent + "%");
						});
					}
				]
			};
		}
	);
})();
