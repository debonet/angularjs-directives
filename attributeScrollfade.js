// module Scrollfade
// 
//
(function(){

	var mod = angular.module('attributeScrollfade', []);

	mod.directive(
		'scrollfade',  
		function(){
			return {
				"restrict" : "A",
				"link" : function(scope, jq, attrs, ctrl) {

					var jqScroller = jq.find(attrs["scrollfade"]);

					// -------------
					var fHandleScroll = function(){

						var cY = jqScroller[0].scrollHeight;
						var nY = jqScroller.scrollTop();
						var cYView = jqScroller.height();

						var cH = nsUtilities.fsTrim(attrs["scrollfade-height"] || "10%");
						if (cH.charAt(cH.length -1) === "%"){
							cH = cH.substring(0,cH.length-1) / 100 * cYView;
						}

						var rTop    = Math.min(1.0, nY/cH);
						var rBottom = Math.min(1.0, (cY - nY - cYView)/cH);

						if (cY <= cYView){
							rTop = 0;
							rBottom = 0;
						}

						var selTop    = attrs["scrollfadeTop"] || ".scrollfade-top";
						var selBottom = attrs["scrollfadeBottom"] || ".scrollfade-bottom";

						jq.find(selTop).css("opacity",rTop);
						jq.find(selBottom).css("opacity",rBottom);
					};


					fHandleScroll();

					// -------------
					jqScroller.on('scroll', fHandleScroll);

					$(window).on('resize', fHandleScroll);

					// recompute the fade on every digest cycle
					scope.$watch(fHandleScroll);

					// -------------
					scope.$on('$destroy', function() {
						return jqScroller.off('scroll', fHandleScroll);
						return $(window).off('resize', fHandleScroll);
					});

				}
			};
		}
	);

})();

