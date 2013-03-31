(function(){

	document.createElement('tabs');
	document.createElement('tab');
	document.createElement('after');
	document.createElement('before');

	var modTabs = angular.module('elementTabs', ['attributeWatch','attributeEvalBindHtml']);

	var uidTab = 100;
	var fuidForTab = function(){
		uidTab++;
		return uidTab;
	};
					var n=0;

	modTabs.directive(
		'tabs',  
		function(){
			return {
				"restrict" : "E",
				"transclude" : true,
				"scope" : false,
				"controller" : [
					"$rootScope", "$scope","$attrs","$element","$timeout",
					function(scopeRoot, scope,attr,jq,fTimeout) {
						scope.vaTab = [];
						scope.aTabSelected = undefined;
						scope.shtmlBefore = "";
						scope.shtmlAfter = "";

						// ----------------
						scope.fSelectTab = function(x, bClicked) {
							var aTab;
							switch(nsTypes.fsTypeOf(x)){
							case 'string':
								aTab = scope.vaTab.fxFirst(function(aTabInner){
									return aTabInner.id === x ? aTabInner : false;
								});
								break;
							case 'number':
								aTab = scope.vaTab[x];
								break;
							default:
								aTab = x;
							}
																
							if (!aTab){
								return ;
							}

							if (aTab === scope.aTabSelected){
								return;
							}


							if(scope.aTabSelected){
								scope.aTabSelected.bSelected = false;
							}
							scope.aTabSelected = aTab;
							scope.aTabSelected.bSelected = true;

							if (attr["ngModel"]){
								var xSetting = aTab.id || scope.vaTab.indexOf(aTab);
								fTimeout(function(){
									scope.$apply(
										attr["ngModel"]+ '=' + JSON.stringify(xSetting)
									);
								});
							}
							
							if (bClicked){
								if (attr["ngClick"]){
									fTimeout(function(){
										scope.$apply(attr["ngClick"]);
									});
								}
								
								if (aTab["ngClick"]){
									fTimeout(function(){
										scope.$apply(aTab["ngClick"]);
									});
								}
							}

							scopeRoot.$broadcast('tabchange', aTab);
						};

						// ----------------
						// watch for model changes
						if (attr["ngModel"]){
							scope.$watch(
								attr["ngModel"],
								function(){
									// don't use the passed in value in case its changed again!
									scope.fSelectTab(scope.$eval(attr["ngModel"]));
								}
							);
						}

						// ----------------
						scope.fSetActiveClass = function(xNew,xOld,scope,element,attrs,ctrl){
							if (scope.aTab.bSelected){
								$(element).addClass('active',200);
							}
							else{
								$(element).removeClass('active',200);
							}
						};

						// ----------------
						this.fRegisterTab = function(aTab, nIndex) {
							if (nIndex < 0){
								nIndex += scope.vaTab.length + 1;
							}

							aTab.bSelected = false;
							scope.vaTab.splice(nIndex,0,aTab);
							var xSetting = scope.$eval(attr['ngModel']) || 0;
							if (xSetting === aTab.id || xSetting === nIndex){
								scope.fSelectTab(aTab);
							}
						};


						// ----------------
						this.fRemoveTab = function(aTab) {
							var n = scope.vaTab.indexOf(aTab);
							if (n>=0){
								scope.vaTab.splice(n,1);
							}
						};
					}
				], 
				"template" : (
					''
						+ '<div class="tabs">' 
						+   '<ul class="tabs-bar">'
						+     '<div class="before" eval-bind-html="shtmlBefore"/>' 
						+     '<li ng-repeat="aTab in vaTab" '
						+         'watch="aTab.bSelected" watch-changed="fSetActiveClass" '
						+         'ng-click="fSelectTab(aTab,true)">'
					// we need to add this unique='' field to prevent ng-repeat from getting
					// confused by duplicate titles
						+       '<span unique="{{aTab.uid}}">{{aTab.sTitle}}</span>' 
						+     '</li>' 
						+     '<div class="after" eval-bind-html="shtmlAfter"/>'
						+   '</ul>' 
						+   '<div class="tabs-content" ng-transclude></div>' 
						+ '</div>'
				),
				"replace": true
			};
		}
	);

	modTabs.directive(
		'after', 
		function(){
			return {
				"require" : "^tabs",
				"restrict" : "E",
				"template": '',
				"replace" : true,
				"transclude" : true,
				"scope" : false,
				"controller" : [
					"$scope", "$transclude",
					function(scope, fTransclude){
						fTransclude(function(jqClone){
							scope.$parent.shtmlAfter = $('<div>').append(jqClone).html();
						});
					}
				]
			};
		}
	);

	modTabs.directive(
		'before', 
		function(){
			return {
				"require" : "^tabs",
				"restrict" : "E",
				"template": '',
				"replace" : true,
				"transclude" : true,
				"scope" : false,
				"controller" : [
					"$scope", "$transclude", 
					function(scope, fTransclude){
						fTransclude(function(jqClone){
							scope.$parent.shtmlBefore = $('<div>').append(jqClone).html();
						});
					}
				]
			};
		}
	);


	modTabs.directive(
		'tab', 
		function(){
			return {
				"require" : "^tabs",
				"restrict" : "E",
				"replace" : true,
				"transclude" : 'element',
				"scope" : false,

				compile: function (jqOuter, attrs, fLinker) {
					return function (scope, jq, attrs, ctrlTabs) {
						var jqLast;
						var scopeLast;

						var aTab = {
							sTitle  : scope.$eval(attrs["title"]),
							id      : scope.$eval(attrs["id"]),
							uid     : fuidForTab(),
							ngClick : attrs["ngClick"]
						};
						
						// register the new tab
						ctrlTabs.fRegisterTab(aTab, -1);

						// watch for <tab> removal
						scope.$on("$destroy",function(){
							ctrlTabs.fRemoveTab(aTab);
						});

						// watch for changes in the title or id
						scope.$watch(attrs["title"], function(sTitleNew){
							aTab.sTitle = sTitleNew;
						});
						scope.$watch(attrs["id"], function(idNew){
							aTab.id = idNew;
						});
						// TODO: can we watch the position too? Don't know how
						
						// watch for changes
						scope.$watch("aTabSelected.uid", function () {
							if (jqLast) {
								jqLast.remove();
								jqLast = null;
							}
							if (scopeLast) {
								scopeLast.$destroy();
							}
							
							if (scope.aTabSelected && (scope.aTabSelected.uid === aTab.uid)) {
								scopeLast = scope.$new();
								fLinker(scopeLast, function (jqClone) {
									jqLast = jqClone;
									jq.after(jqLast);
								});
							}
						}, true);
					};
				}
			};
		}
	);


})();
