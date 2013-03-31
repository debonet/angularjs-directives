(function(){
	var mod = angular.module('attributeLiveModel', []);

	//------------------------------------------------------------------------
	// live-model attribute
	//   allows for dynamic setting of which part of the scope is used in the
	//   ng-model. 
	//
	// NOTE:
	//   due to a strange Angular design pattern, ng-model cannot be effectively
	//   set from this directive so ng-model="liveModel" must also be specified.
	//
	//
	// Value: 
	//   template := a templateable expression which resolves to a dotted path
	//     into the scope to be used as the location for ng-model
	//
	// Example:
	//
	//   ~~~
	//       <div ng-repeat='foopart in ["bar","baz"]'>
	//         <input live-model="foo.{{foo}}.name" ng-model="liveModel" >`
	//       </div>
	//   ~~~
	//
	//   is effectively:
	// 
	//   ~~~
	//      <input ng-model="foo.bar.name" >
	//      <input ng-model="foo.baz.name" >
	//   ~~~
	//
	mod.directive(
		'liveModel',  
		function($interpolate){
			return {
				"priority"   : 2,
				"restrict"   : "A",
				"link" : function(scope, jq,attrs){

					var xValModelLast; 

					scope.$watch(
						function(){
							if (!attrs["liveModel"]){
								return;
							}

							var sPathRealModel = $interpolate(attrs["liveModel"])(scope);

							var xValRealModel = nsUtilities.fxGetTreePath(scope,sPathRealModel);
							if (xValRealModel !== xValModelLast){
								xValModelLast = xValRealModel;
								scope["liveModel"] = xValModelLast;
							}

							var xValScopeModel = scope["liveModel"];
							if (xValScopeModel !== xValModelLast){
								xValModelLast = xValScopeModel;
								nsUtilities.fSetTreePath(scope,sPathRealModel,xValModelLast);								
							}
					});

					jq.removeAttr("liveModel");
				}
			};
		}
	);
})();

