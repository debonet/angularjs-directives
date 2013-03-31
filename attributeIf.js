(function(){

	var mod = angular.module('attributeIf',[]);

	// Defines the if tag. This removes/adds an element from the dom depending on a condition
	// rewritten from https://github.com/angular-ui/angular-ui/blob/master/modules/directives/if/if.js
	mod.directive(
		'if', 
		function () {
			return {
				transclude: 'element',
				priority: 1000,
				terminal: true,
				restrict: 'A',
				compile: function (jq, attr, fLinker) {
					return function (scope, jqStart, attr) {
						//							jqStart[0].doNotMove = true;
						var jqLast;
						var scopeLast;
						scope.$watch(attr["if"], function (bTest) {
							if (jqLast) {
								jqLast.remove();
								jqLast = null;
							}
							if (scopeLast) {
								scopeLast.$destroy();
								scopeLast = null;
							}

							if (bTest) {
								scopeLast = scope.$new();
								fLinker(scopeLast, function (jqClone) {
									jqLast = jqClone;
									jqStart.after(jqClone);
								});
							}
							// Note: need to be parent() as jquery cannot trigger events on comments
							// (angular creates a comment node when using transclusion, as ng-repeat does).
							//	jqStart.parent().trigger("$childrenChanged");
						});
					};
				}
			};
		}
	);
})();

