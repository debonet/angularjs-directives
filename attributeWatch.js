// module modWatch
// 
//   Calls the watch-changed function of the current scope 
//   when the watch expression changes
//
// Usage
//   <div watch="some-expression" watch-changed="some-fuction" />
//
//   Where some-expression is some expression on the current scope, and some-functions
//   is a function in the current scope of the form:
//
//   `function(xNew,xOld,scope,element,attrs,ctrl)`
//
//
// Example
//
// <div ng-controller='ctrlTest'>
//   <input ng-model="foo">
//   <span watch="foo" watch-changed="fSawChange">foo is a test</span>
// </div>
//
//
// var ctrlTest= function($scope,$element){
//   $scope.fSawChange = function(xNew,xOld,scope,element,attrs,ctrl){
//     $(element).addClass(xNew);
//     $(element).removeClass(xOld);
//   }
// };
//
//
(function(){

	var modWatch = angular.module('attributeWatch', []);

	modWatch.directive(
		'watch',  
		function(){
			return {
				"restrict" : "AC",
				"link" : function(scope, element, attrs, ctrl) {
					scope.$watch(
						attrs["watch"], 
						function(xNew,xOld){
							scope[attrs["watchChanged"]](xNew,xOld,scope,element,attrs, ctrl);
						},
						true
					);
				}
			};
		}
	);

})();
