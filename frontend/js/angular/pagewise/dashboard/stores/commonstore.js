module
.service('Commonstore', function(){
	this.count = {click:0, view:0, visit: 20};
	this.synched = false;

	this.updateClickCount = function(val){
		this.count.click = val;
	}
	this.updateViewCount = function(val){
		this.count.view = val;
	}
});