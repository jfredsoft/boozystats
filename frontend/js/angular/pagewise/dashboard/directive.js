module
.directive('growthWidget', function(){
	var directive = {};

	directive.restrict = 'E';
	directive.link = function($scope, element, attributes){
		var type = attributes.type;

		$scope.$watch('widget_activity', function(newValue, oldValue){
			var dict = JSON.parse(attributes.dict);
			element.html('<div class="c-title">'+type+'</div><div class="c-numbers"><div class="c-view">'+dict.view+'<div>View</div></div><div class="c-click">'+dict.click+'<div>Click</div></div><div class="clearfix"></div></div>');
		}, true);
		
	};

	return directive;
});