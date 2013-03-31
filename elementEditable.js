(function(){
	document.createElement('editable');

	var modEditable = angular.module('elementEditable', ['attributeEvents']);

	modEditable.directive(
		'editable',  
		function(){
			return {
				"restrict" : "E",
				"transclude" : true,
				"replace" : true,
				"scope" : true,
				"template" : (
					''
					+ '<span>'
					+   '<span class="editable" ng-hide="bEdit" ng-bind-html-unsafe="sEdit" ng-click="fEdit()" />'
					+   '<form ng-show="bEdit" ng-submit="fDone()">'
					+     '<input ng-model="sEdit" ng-blur="fDone()" />'
					+   '</form>'
					+ '</span>'
				),
				"controller" : [
					"$scope","$element", "$attrs", "$timeout", 
					function(scope,jq, aAttr, fTimeout){

						scope.fEdit = function(){
							scope.bEdit = true;
							fTimeout(
								function(){	jq.find('input').focus();	},
								0,
								false
							);
						};

						scope.fDone = function(){
							scope.bEdit = false;
							var s=scope.sEdit.replace("'","\\'");
							scope.$parent.$eval(aAttr["ngModel"] + "='" + s +"'");
						};

						scope.$watch(aAttr["ngModel"], function(){
							scope.sEdit = scope.$parent.$eval(aAttr["ngModel"]);
						});

						scope.bEdit = false;
					}
				]
			};
		}
	);
})();
