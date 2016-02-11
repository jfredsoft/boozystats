module
.service('Bizstore', function(){
	this.arr_business = [];
	this.synched = false;
	this.pushBusiness = function(obj_business){
		this.arr_business.push(obj_business);
		this.synched = true;
	};
	this.getBusiness = function(index){
		if (index == null)
			return this.arr_business;
		else
			return this.arr_business[index];

	};
	this.getBusinessDict = function(){
		var dict_biz = {};
		for (var i in this.arr_business){
			dict_biz[this.arr_business[i].code] = this.arr_business[i].name;
		}
		return dict_biz;
	}
	this.getBusinessByCode = function(code){
		for (var i in this.arr_business){
			if (this.arr_business[i].code == code)
				return this.arr_business[i];
		}
	}
	this.getBusinessCount = function(){
		return this.arr_business.length;
	}
	this.removeBusiness = function(index){
		this.arr_business.splice(index, 1);
	}
});