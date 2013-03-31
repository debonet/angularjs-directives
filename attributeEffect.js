(function(){


// render-if ="expression"
// render-show="function"
// render-hide="function"

	var mod = angular.module('attributeRender',[]);

	// Defines the if tag. This removes/adds an element from the dom depending on a condition
	// rewritten from https://github.com/angular-ui/angular-ui/blob/master/modules/directives/if/if.js
	mod.directive(
		'renderIf', 
		function () {
			return {
				transclude: 'element',
				priority: 1000,
				terminal: true,
				restrict: 'A',
				compile: function (jq, attr, fLinker) {
					var jqLast;
					var scopeLast;

					return function (scope, jq, attr) {
						scope.$watch(attr["renderIf"], function (bRender) {

							// -------------
							var fShow = function(){
								if (bRender){
									scopeLast = scope.$new();
									fLinker(scopeLast, function (jqClone) {
										jqLast = jqClone;
										jqStart.after(jqClone);

										var fShow = scope[attr["renderShow"]];
										if (fShow){
											fShow(jqClone);
										}
									});
								}
							}

							// -------------
							var fRemove = function(){
								D("REMOVE");
								jqLast.remove();
								jqLast = null;

								if (scopeLast) {
									scopeLast.$destroy();
									scopeLast = null;
								}

								fShow();
							};

							D("RENDER?",bRender);

							// -------------
							if (!bRender && jqLast) {
								var fHide = scope[attr["renderHide"]];

								if (!fHide){
									fRemove();
								}
								else if (fHide.length === 1){
									fHide(jqLast);
									fRemove();
								}
								else if (fHide.length === 2){
									fHide(jqLast, fRemove);
								}
								else{
									fRemove();
								}
							}
							else{
								fShow();
							}

						});
					};
				}
			};
		}
	);
})();

