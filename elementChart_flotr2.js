(function(){
	var modChart = angular.module('elementChart', []);


	//--------------------------------------------------------------------------
	var fvseriesRegularizeSeries = function(x){
		// single series object
		if (nsTypes.fbIsObject(x) || nsTypes.fbIsNumber(x[0])){
			return fvseriesRegularizeSeries([x]);
		}

		return x.map(function(x2){
			if (nsTypes.fbIsObject(x2)){
				return x2;
			}
			else{
				return {
					data   : x2,
					color  : nsColor.fclrRandom()
					// no label
				};
			}
		});
	};



	//--------------------------------------------------------------------------
	// faaRangeFromVSeries
	//  finds the min and max of the data in the vector of regularized series
	//
	// Params
	//   vseries := vector of regularized series whos data to example
	//
	// Returns
	//   an aaRange structure of the form:
	//   ~~~
	//    {
  //       x : {min:, max:, range:}
	//       y : {min:, max:, range:}
	//    }
	//   ~~~
	//
	var faaRangeFromVSeries = function(vseries){
		var aaRange = {x: {min: 1e20, max: -1e20}, y:{min: 1e20, max: -1e20}};

		vseries.each(function(series){
			series.data.each(function(pt){
				aaRange.x.min = Math.min(aaRange.x.min, pt[0]);
				aaRange.y.min = Math.min(aaRange.y.min, pt[1]);

				aaRange.x.max = Math.max(aaRange.x.max, pt[0]);
				aaRange.y.max = Math.max(aaRange.y.max, pt[1]);
			});
		});

		aaRange.x.range = aaRange.x.max - aaRange.x.min;
		aaRange.y.range = aaRange.y.max - aaRange.y.min;

		return aaRange;
	};


	//--------------------------------------------------------------------------
	// ffsSmartLabel
	//   returns a date aware labeler function
	// 
	// Params
	//   x := vseries or aaRange
	//   sDimension := {'x' or 'y'}
	//
	// Returns
	//   `function fsSmartLabel(s)` which returns a formatted label that
	//   makes sense given the range of the data
	//
	var tmEarliestReasonableDate = new Date(1990,1,1);
	var ffsSmartLabel = function(x,sDimension){
		var aaRange = nsTypes.fbIsObject(x) ? x : faaRangeFromVSeries(x);

		var aRange = aaRange[sDimension];

		return function(s){
			var r = nsUtilities.frFromS(s);

			if (r > tmEarliestReasonableDate){
				var date = new Date(r);

				if (aRange.range > nsDate.dtmDay * 365 * 5){
					return nsFormatters.fsFormatDate("yyyy",date);
				}
				if (aRange.range > nsDate.dtmDay * 365 * 2){
					return nsFormatters.fsFormatDate("mm/yyyy",date);
				}
				if (aRange.range > nsDate.dtmDay * 90){
					return nsFormatters.fsFormatDate("mmm, yyyy",date);
				}
				if (aRange.range > nsDate.dtmDay * 5){
					return nsFormatters.fsFormatDate("dd, mmm, yyyy",date);
				}
				return nsFormatters.fsFormatDate("dd, mmm, yyyy @ hh:MM",date);
			}
			else{
				if (aRange.range > 10000){
					return nsFormatters.fsAbbreviatedNumber(r);
				}
				if (aRange.range < 100){
					return nsFormatters.fsCommaNumber(r);
				}
				else{
					return nsFormatters.fsCommaInteger(r);
				}
			}
		};
	};


	//--------------------------------------------------------------------------
	modChart.directive(
		'chart',  
		[ "$rootScope", function(scopeRoot){
			return {
				"restrict" : "E",
				"scope" : false,
				"link" : function(scope, jq, attr){
					var maxfreq = new MaximumFrequency(500);
					// -----------------------------------------------------------------
					var fDrawChart = function(){
						maxfreq.fDo(fDoDrawChart);
					};

					var fDoDrawChart = function(){
						var x = scope.$eval(attr["series"]);
						if (!x){
							jq.empty();
							return;
						}

						var e=jq.get(0);

						var jqParent;
						var jqHidden;
						/*
							if (e.offsetWidth <= 100|| e.offsetHeight <= 100){
							// HACK: workaround for flot limitation
							// we move the chart area into a visibility:hidden div, then
							// draw it, then put it back
							jqParent=$(e).parent();
							jqHidden = $("<div style='visibility:hidden'></div>");
							$('body').append(jqHidden);

							jqHidden.append(e);

							var jqSizedParent = jqParent;
							while (jqSizedParent.length && (e.offsetWidth <= 0|| e.offsetHeight <= 0)){
							if (e.offsetWidth  <= 0){
							$(e).width(jqSizedParent[0].offsetWidth);
							}
							if (e.offsetHeight  <= 0){
							$(e).height(jqSizedParent[0].offsetHeight);
							}
							jqSizedParent = jqSizedParent.parent();
							}
							}
						*/

						var vseries = fvseriesRegularizeSeries(x);
						var aaRange = faaRangeFromVSeries(vseries);

						try{
							Flotr.draw(
								e, 
								vseries,
								{
									legend: {
										show: true,
										labelBoxBorderColor: "#CCC",
										margin: 5,
										backgroundColor: "#FFF",
										backgroundOpacity: 0.85
									},
									xaxis: {
										mode: 'time'
										//										tickFormatter: ffsSmartLabel(aaRange,'x')
									},
									yaxis: {
										autoscale: true,
										autoscaleMargin: 0.20
										//										tickFormatter: ffsSmartLabel(aaRange,'y')
									}
								}.mergeIn(scope.$eval(attr["options"]) || {})
							);
						}
						catch(err){
						}

						// if we moved it, put it back
						if (jqParent){
							jqParent.append(e);
							jqHidden.remove();
						}

					};
					
					
					// -----------------------------------------------------------------
					scope.$watch(attr["series"],fDrawChart,true);

					// HACK: because flot can't draw when the chart is missized or not
					// displayed, we redraw on notifications of such by a parent
					scopeRoot.$on('tabchange', function(){
						fDrawChart();
					});

					// -----------------------------------------------------------------
					$(window).bind('resize',function(){fDrawChart();});

					fDrawChart();
				},
				"template": '<div/>',
				"replace": true
			};
		}]
	);
})();

