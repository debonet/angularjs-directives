(function(){
	var modGauge = angular.module('elementGauge', []);


	var aOptionsDefault = {
		max : 100,
		min : 0,

		// colors are interpolated within range
		colorstops : [ 
			// val, inner,     outer
			[  0,   '#6FADCF', '#8FC0DA' ],
			[  100, '#6FADCF', '#8FC0DA' ] 
		]
	};


	var aSettingsDefault = {
		lines: 12, // The number of lines to draw
		angle: 0.15, // The length of each line
		lineWidth: 0.44, // The line thickness
		pointer: {
			length: 0.9, // The radius of the inner circle
			strokeWidth: 0.035, // The rotation offset
			color: '#000000' // Fill color
		},

		colorStart: '#6FADCF',   // Colors
		colorStop: '#8FC0DA',    // just experiment with them
		strokeColor: '#E0E0E0',   // to see which ones work best for you
		generateGradient: true
	};


	//--------------------------------------------------------------------------
	modGauge.directive(
		'gauge',  
		[ "$rootScope", function(scopeRoot){
			return {
				"restrict" : "E",
				"scope" : false,
				"link" : function(scope, jq, attr){

					var gauge;

					var fSetupGauge = function(){
						if (!gauge){
							return;
						}

						// get options, and settings
						var aSettings = {}.mergeIn(aSettingsDefault);

						var aOptions = {}.shallowmergeIn(aOptionsDefault).shallowmergeIn(scope.$eval(attr["options"]));

						// set up misc non-settings parameters
						gauge.animationSpeed = aSettings["animationSpeed"] || 32;
						gauge.maxValue = 1;

						// set up position
						var rValue = attr["ngModel"] 
							? scope.$eval(attr["ngModel"])
							: scope.$eval(attr["value"]);
						
						rValue = nsUtilities.fxFirstArg(rValue, aOptions["minValue"]);
						rValue = Math.min(Math.max(rValue,aOptions["min"]), aOptions["max"]);

						var rSet = (rValue - aOptions["min"]) / (aOptions["max"] - aOptions["min"]);

						rSet = nsTypes.fbIsNumber(rSet) ? rSet : 0;
//						D("ABOUT TO SET",rSet);
						gauge.set(rSet);

						// set up color ("Cs" stands for "Colorstop", which 
						// is an array of [stop, colorInside, colorOutside])
						var vvCs = aOptions["colorstops"];
//						D("GOTOPTIONS",aOptions);

						var c = vvCs.length;
						if (c >= 2){
							vvCs.sort(function(vCs1, vCs2){return vCs1[0] - vCs2[0];});
								
							var n = 1;
							while ( n<c-1 && rValue > vvCs[n][0]){
								n++;
							}
							// n is left with index of colorstop after current position
								
							var rRange = (vvCs[n][0] - vvCs[n-1][0]);
							var rBlend = (
								(rRange > 0) 
									? (rValue - vvCs[n-1][0]) / rRange
									: 0
							);

//							D("BLENDING", rValue, vvCs[n-1][0], rRange,rBlend, n, vvCs);

							if (nsTypes.fbIsNumber(rBlend)){
								aSettings["colorStart"] = nsColor.fclrBlendColors(
									vvCs[n-1][1], vvCs[n][1], rBlend
								);
								aSettings["colorStop"]  = nsColor.fclrBlendColors(
									vvCs[n-1][2], vvCs[n][2], rBlend
								);
							}
						}

						gauge.setOptions(aSettings);
					};


					var fRedrawGauge = function(){
						if (jq.length){
							gauge = new Gauge(jq.get(0));
							fSetupGauge();
						}
					};


					fRedrawGauge();

					scope.$watch(attr["options"], fSetupGauge, true);
					scope.$watch(attr["ngModel"], fSetupGauge);

					scopeRoot.$on('tabchange', fRedrawGauge);

				},
				"template": '<canvas/>',
				"replace": true
			};
		}]
	);
})();

