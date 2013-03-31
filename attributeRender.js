(function(){


// render-if ="expression"
// render-show="function"
// render-hide="function"

	var fCallUnknownSynch = function(f, jq, fAfter){
		if (!f){
			fAfter();
		}
		else if (f.length === 1){
			f(jq);
			fAfter();
		}
		else if (f.length === 2){
			D("TWO NUMBERS");
			f(jq, fAfter);
		}
		else{
			fAfter();
		}
	};

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
				scope: false,
				compile: function (jq, attr, fLinker) {
					return function (scope, jq, attr) {
						var jqLast;
						var scopeLast;

						scope.$watch(attr["renderIf"], function (bRender) {

							// -------------
							var fShow = function(){
								if (bRender){
									scopeLast = scope.$new();
									fLinker(scopeLast, function (jqClone) {
										jqLast = jqClone;
										jq.after(jqClone);
										var fShow = scope.$parent[attr["renderShow"]];
										fCallUnknownSynch(fShow, jqLast, function(){});
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


							// -------------
							if (!bRender && jqLast) {
								D("HIDE");
								var fHide = scope.$parent[attr["renderHide"]];
								fCallUnknownSynch(fHide, jqLast, fRemove);
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

