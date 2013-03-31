// module Fillvertical
// 
//
(function(){

	var mod = angular.module('attributeFillvertical', []);

	mod.directive(
		'fillvertical',  
		function(){
			return {
				"restrict" : "A",
				"link" : function(scope, jq, attrs, ctrl) {

					// -------------
					var fResize = function(){
						var cYParent = jq.parent().innerHeight();
						var cYChildren = 0;
						jq.parent().children().each(function(n,e){
							var c = $(e).outerHeight(true);
							if (c){
								cYChildren += c;
							}
						});


						if (jq.outerHeight(true)){
							cYChildren -= jq.outerHeight(true);
						}

						var cYSurround = jq.outerHeight(true) - jq.height();

						var cYFinal = cYParent - cYChildren - cYSurround;

						jq.height(cYFinal);
					};


					fResize();

					// -------------
					$(window).on('resize', fResize);

					// recompute the resize on every digest cycle
					scope.$watch(fResize);

					// -------------
					scope.$on('$destroy', function() {
						return $(window).off('resize', fResize);
					});

				}
			};
		}
	);

})();

