module
.service('Areastore', function(){
	this.arr_area = [];
	this.synched = false;
	this.pushArea = function(obj_area){
		this.arr_area.push(obj_area);
		this.synched = true;
	}
	this.getArea = function(index){
		if (index == null)
			return this.arr_area;
		else
			return this.arr_area[index];
	}
	this.getAreaDict = function(){
		var dict_area = {};
		for (var i in this.arr_area){
			dict_area[this.arr_area[i].id] = this.arr_area[i].name;
		}
		return dict_area;
	}
	this.removeArea = function(index){
		this.arr_area.splice(index, 1);
	}
});