function sortAlgorithm(array){
	this.arr = array;
	this.size = this.arr.length;
	
	this.finished = false;

}
sortAlgorithm.prototype = {
	swap:function(a, b){
		var temp = this.arr[a];
		this.arr[a] = this.arr[b];
		this.arr[b] = temp;
	},
	shuffle:function(){

	},
	//select the minimum number, place it to first position,
	selectSort:function(){
		for(var i = 0; i < this.size - 1; i++){
			var min_index = i;

			for(var j = i + 1; j < this.size; j++){
				if(this.arr[j] < this.arr[min_index])
					min_index = j;
			}

			if(min_index != i){
				this.swap(i, min_index);
			}
		}
	},

	bubbleSort:function(){
		for(var i = 0; i < this.size - 1; i++){

			var isSorted = true;

			for(var j = 0; j < this.size - 1 - i; j++){
				if(this.arr[j] > this.arr[j+1]){
					isSorted = false;
					this.swap(j,j+1);
				}
			}
			//if there is no swap, array is already sorted
			if(isSorted)
				break;
		}
	},

	insertSort:function(){
		//n-1 insert operation
		for( var i = 1; i < this.size; i++){

			//look for the postion from head
			var j = 0;
			
			while(this.arr[j] < this.arr[i] && j < i)
				j++;
			//need to shift
			if(i != j){
				var temp = this.arr[i];
				//clean the postion
				for(var k = i; k > j; k--)
					this.arr[k] = this.arr[k-1]
				//insert the value
				this.arr[j] = temp;
			}
			//if i == j, means position is good for now,
		}
	},

	quickSort:function(){
		this.quickSortImpl(0, this.size - 1);
	},
	quickSortImpl:function(start, end){
		if(start < end){
			var pos = this.partition(start, end);
			this.quickSortImpl(start, pos-1);
			this.quickSortImpl(pos+1, end);
		}
	},
	//part of quickSort
	partition:function(low, high){
		var key = this.arr[low];

		while(low < high){
			while(low < high && this.arr[high] >= key)
				high--;
			if(low < high)
				this.arr[low++] = this.arr[high];
			while(low < high && this.arr[low] <= key)
				low++;
			if(low < high)
				this.arr[high--] = this.arr[low];
		}
		this.arr[low] = key;

		return low;
	},

	mergeSort:function(){
		this.mergeSortImpl(0, this.size - 1);
	},
	mergeSortImpl:function(first, last){
		var mid = 0;
		if(first < last){
			mid = Math.floor((first + last) / 2);

			this.mergeSortImpl(first, mid);
			this.mergeSortImpl(mid+1, last);
			this.merge(first, mid, last);
		}
	},
	//part of mergeSort
	merge:function(low, mid , high){
		var i, k;
		var tmp = new Array();
		var left_low = low;
		var left_high = mid;
		var right_low = mid + 1;
		var right_high = high;

		for(k = 0; left_low <= left_high && right_low <= right_high; k++){
			if(this.arr[left_low] <= this.arr[right_low])
				tmp[k] = this.arr[left_low++];
			else
				tmp[k] = this.arr[right_low++];
		}

		if(left_low <= left_high){
			for(i = left_low; i <= left_high; i++){
				tmp[k++] = this.arr[i];
			}
		}
		if(right_low <= right_high){
			for(i = right_low; i <= right_high; i++)
				tmp[k++] = this.arr[i];
		}

		for(i = 0; i < high - low + 1; i++)
			this.arr[low+i] = tmp[i];

	},

	shellSort:function(){
		var gap = Math.floor(this.size / 2);
		for( gap = Math.floor(this.size / 2); gap > 0; gap = Math.floor(gap/2) ){
			for(var j = gap; j < this.size; j++){
				if(this.arr[j] < this.arr[j-gap]){
					var temp = this.arr[j];
					var k = j - gap;
					while(k >= 0 && this.arr[k] > temp){
						this.arr[k + gap] = this.arr[k];
						k = k - gap;
					}
					this.arr[k + gap] = temp;
				}
			}
		}
	}


}

function Graph(canvas){
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.bgColor = "#333";
	this.barColor = "#6cf";
	this.highlightColor = "#cf6";
}

Graph.prototype.draw = function(highlightIndexes, arr){
	//fill background
	this.ctx.fillStyle = this.bgColor;
	this.ctx.fillRect(0, 0, this.width, this.height);

	var idx1 = highlightIndexes[0];
	var idx2 = highlightIndexes[1];

	var size = arr.length;
	// there is 1px between two bar
	var barWidth = (this.width - size + 1) / size;
	var barHeightUnit = this.height / size;

	var x = 0;
	var h = 0;

	//fill the bar
	this.ctx.fillStyle = this.barColor;

	for(var i = 0; i < size; i++){
		h = arr[i] * barHeightUnit;
		if(i === idx1 || i == idx2){
			this.ctx.save();
			this.ctx.fillStyle = this.highlightColor;
			this.ctx.fillRect(x, this.height - h, barWidth, h);
			this.ctx.restore();
		}else{
			this.ctx.fillRect(x, this.height - h, barWidth, h);
		}
		x = x + barWidth + 1;
	}
}

function ViewModel(canvas){

	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");

	this.size = 10;
	this.arr = null;
	this.speed = 50;
	this.algorithm = null;
	this.sort = null;

	this.graph = new Graph(this.canvas);
}

ViewModel.prototype = {
	init:function(){
		this.initData();
		this.getParam();
		this.graph.draw([0,1],this.arr)
	},
	initData:function(){
		this.arr = new Array();
		for(var i = 0; i < this.size; i++){
			this.arr[i] = i + 1;
		}
		for(var j = 0; j < this.size * 50; j++){
			var r1 = Math.floor(Math.random()*this.size);
			var r2 = Math.floor(Math.random()*this.size);
			while(r1 == r2){
				r2 = Math.floor(Math.random()*this.size);
			}
			var temp = this.arr[r1];
			this.arr[r1] = this.arr[r2];
			this.arr[r2] = temp;
		}
	},
	getParam:function(){
		var _this = this;
		//get data
		$("#elementNum li").click(function(){
			_this.size = $(this).text();
			_this.arr = null;
			_this.init();
		});
		this.algorithm = new sortAlgorithm(this.arr);
		this.sort = this.algorithm.bubbleSort();
		//get algorithm
		$("#algorithmMenu li").click(function(){
			var index = $(this).index();
			switch (index){
				case 0:
					_this.sort = _this.algorithm.selectSort();
					break;
				case 1:
					_this.sort = _this.algorithm.bubbleSort();
					break;
				case 2:
					_this.sort = _this.algorithm.insertSort();
					break;
				case 3:
					_this.sort = _this.algorithm.quickSort();
					break;
				case 4:
					_this.sort = _this.algorithm.shellSort();
					break;
				case 5:
					_this.sort = _this.algorithm.mergeSort();
					break;
				default:
					_this.sort = _this.algorithm.bubbleSort();
			}
			//restart
			_this.init();
		});
	},

	animationFrame:function(){
		if(this.sort.finished){
			return;
		}else{
			this.sort = t
		}
	}
}
$(function(){

	var canvas = document.getElementById("graph_board");

	var view = new ViewModel(canvas);
	view.init();

	$("#control_bar li").click(function(){
		var _this = $(this);
		_this.parent().children("li").removeClass("selected");
		_this.addClass("selected");
	});
})