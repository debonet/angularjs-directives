(function(){
	var mod = angular.module('attributeEvents', []);

	var vsEvents = [
		"Focus",
		"Blur",
		"Change"
		/*
			,
			"Contextmenu",
			"Copy",
			"Cut",
			"Keydown",
			"Keypress",
			"Mousedown",
			"Mousemove",
			"Mod",

		*/
	];


	vsEvents.each(function(sEvent){
		mod.directive('ng' + sEvent, function(){
			return {
				"restrict" : "A",
				"scope" : false,
				"link" : function(scope, element, attrs) {
					element.bind(sEvent.toLowerCase(), function(){
						scope.$eval(attrs["ng" + sEvent]);
						scope.$digest();
					});
				}
			};
		});
	});
})();


