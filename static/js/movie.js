var ViewModel = function() {
    this.seekPosition = ko.observable();
    this.thumbnailVisible = ko.observable(false);
    this.onSeek = function ()   {
        this.thumbnailVisible(true);
    }
    this.offSeek = function ()  {
        this.thumbnailVisible(false);
    }
    this.thumbnailOffset = ko.observable();
    this.thumbnailUrl = ko.observable();
};

var vm = new ViewModel();

ko.applyBindings(vm);

$("#seek-bar").mousemove(function(e){
    var x = e.pageX - this.offsetLeft;
    vm.seekPosition(x);
    vm.thumbnailOffset(x);
    vm.thumbnailUrl(cdnBase + '/' + movieInfo.thumbnailPaths[100]);
    // console.log(movieInfo);
    // console.log(cdnBase);
});
