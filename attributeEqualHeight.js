// --------------------------------------------------------------------
// attribute equal-height
//   sets the hight of the element to the max height of its siblings
//
// Value
//   none
//
// Example:
//   <div>
//     <div equal-height>XX<br/>XX</div>
//     <div equal-height>XX</div>
//   </div>
//
(function(){
	var mod = angular.module('attributeEqualHeight', []);

	mod.directive(
		'equalHeight',
		 function(){
			return {
				"priority"   : 0,
				"restrict"   : "A",
				"controller": [
					"$scope","$element", "$attrs",
					function(scope, jq, attrs){
						var fResize = function(){
							var cHeight = $(attrs["equalHeight"]).outerHeight(true);
//							jq.css("height", cHeight);
						};

						
						setTimeout(fResize,400);
						$(window).bind('resize',fResize);
					}
				]
			};
		 }
	);

})();
