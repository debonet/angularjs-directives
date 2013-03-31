// TODO: i18n this file

var fRegisterFormatter;

var fxEvalAttrib = function(scope,attrs,sAttr){
	try{
		var xOut = scope.$eval(attrs[sAttr]);
		if (xOut){
			return xOut;
		}
	}
	catch(e)
	{}

	return attrs[sAttr] || "";
};

(function(){

	var afForFormatter = {};

	var mod = angular.module('attributeFormat', []);

	fRegisterFormatter = function(sFormatter, sFilter, f){
		afForFormatter[sFormatter] = f;
		mod.filter(sFilter, function(){return f;});
	};

	// ---------------------------------
	mod.directive('format', function(){
		return {
			restrict: 'A',
			require : 'ngModel',
			scope : false,
			link: function(scope, jq, attr, ngModel){
				var ss = new SingletonSchedule(
					500,
					function(){
						var xValue = scope.$eval(attr['ngModel']);

						// if we have a placeholder then we can allow an empty value
						if (attr['placeholder']){
							if (typeof(xValue) === "undefined" || xValue === ""){
								return;
							}
						}

						// check for a min or max
						var rMin = scope.$eval(attr['min']);
						if (rMin){
							xValue = nsUtilities.frFromS(xValue);
							xValue = Math.max(xValue,rMin);
						}
						
						var rMax = scope.$eval(attr['max']);
						if (rMax){
							xValue = nsUtilities.frFromS(xValue);
							xValue = Math.min(xValue,rMax);
						}

						// get our formatter
						var svsFormatter = fxEvalAttrib(scope,attr,"format");

						var vsFormatter = svsFormatter.split(':');
						var sFormatter = vsFormatter.shift();
						var fFormatter = afForFormatter[sFormatter];

						if (!fFormatter){
							throw("unknown formatter: --" + sFormatter + "--");
						}

						vsFormatter.unshift(xValue);
						var s = fFormatter.apply(null, vsFormatter);
						s=s.replace("'","\\'");
						scope.$eval(attr["ngModel"] + "= '" + s + "'");
						scope.$digest();
					}
				);

				scope.$watch(attr['ngModel'], function(){ ss.fSchedule(); });
				scope.$watch("foo", function(){ ss.fSchedule(); });
			}
		};
	});

})();


fRegisterFormatter(
	"date", 
	"fmtDate",  
	function(s,sFmt){
		var tm = nsUtilities.frFromS(s);
		if (tm && !isNaN(tm)){
			return nsFormatters.fsFormatDate(sFmt,new Date(tm));
		}
		return "";
	}
);

fRegisterFormatter(
	"money", 
	"fmtMoney",  
	function(s){return nsFormatters.fsMoney(nsUtilities.frFromS(s));}
);

fRegisterFormatter(
	"dollars", 
	"fmtDollars",  
	function(s){return nsFormatters.fsMoneyInteger(nsUtilities.frFromS(s));}
);

fRegisterFormatter(
	"comma-integer", 
	"fmtCommaInteger",  
	function(s){return nsFormatters.fsCommaInteger(nsUtilities.frFromS(s));}
);

fRegisterFormatter(
	"comma-number", 
	"fmtCommaNumber",  
	function(s){return nsFormatters.fsCommaNumber(nsUtilities.frFromS(s));}
);

fRegisterFormatter(
	"integer",  
	"fmtInteger", 
	function(s){return Math.floor(nsUtilities.frFromS(s));}
);

fRegisterFormatter(
	"percentage",  
	"fmtPercentage", 
	function(s){return Math.floor(nsUtilities.frFromS(s) * 10000)/100 + "%";}
);


fRegisterFormatter(
	"pluralize",  
	"fmtPluralize", 
	function(n,sSingular,sPlural){
		sPlural = sPlural || (sSingular + "s");
		if (n === 0){
			return "0 " + sPlural;
		}
		if (n === 1){
			return "one " + sSingular;

/*
			if ('aeiouh'.indexOf(sSingular.charAt(0)) !== -1){
				return "an " + sSingular;
			}
			return "a " + sSingular;
*/
		}

		if (n === 2){
			return "two " + sPlural;
		}

		if (n === 3){
			return "three " + sPlural;
		}

		return nsFormatters.fsCommaInteger(n) + " " + sPlural;
	}
);

