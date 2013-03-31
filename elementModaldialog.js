(function(){
	document.createElement('modaldialog');

	var modModaldialog = angular.module('elementModaldialog', ['modelDialog', 'attributeIf']);

	modModaldialog.directive(
		'modaldialog',  
		['modelDialog', function(modelDialog){
			return {
				"restrict" : "E",
				"replace" : true,
				"transclude" : true,
				"scope" : {},
				"template" : (
					''
						+ '<div class="modaldialog" ng-show="fbIsOpen()" ng-cloak>'
						+   '<div>'
						+     '<div ng-transclude />'
						+     '<div class="close" ng-click="fClose()" />'
						+   '</div>'
						+ '</div>'
				),
				"link" : function(scope,jq, aAttr){
					scope.modelDialog = modelDialog;

					scope.fbIsOpen = function(){
						scope.$eval(aAttr["onOpen"]);
						return modelDialog.fbIsOpen(aAttr["name"]);
					};

					scope.fClose = function(){
						scope.$eval(aAttr["onClose"]);
						return modelDialog.fClose(aAttr["name"]);
					};
				}
			};
		}]
	);
})();
