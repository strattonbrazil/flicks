var ViewModel = function() {
    this.seekPosition = ko.observable();
    this.thumbnailVisible = ko.observable(false);
    this.onSeek = function ()   {
        this.thumbnailVisible(true);
    }
    this.offSeek = function ()  {
        this.thumbnailVisible(false);
    }
    this.onClick = function (vm,clickEvent)  {
        var seekBar = clickEvent.currentTarget;
        var x = clickEvent.originalEvent.clientX - seekBar.offsetLeft;
        var percent = x/seekBar.offsetWidth;
        var seekReference = Math.round(percent*movieInfo.previewPaths.length);
        console.log(seekBar);
        console.log(x);
        this.previewUrl(cdnBase + '/' + movieInfo.previewPaths[seekReference]);
    }
    this.thumbnailOffset = ko.observable();
    this.thumbnailUrl = ko.observable();
    this.previewUrl = ko.observable(cdnBase + '/' + movieInfo.previewPaths[0]);
};

var vm = new ViewModel();

ko.applyBindings(vm);

// TODO do this using knockout instead of jquery
$("#seek-bar").mousemove(function(e){
    var x = e.pageX - this.offsetLeft;
    var percent = x/this.offsetWidth;
    var seekReference = Math.round(percent*movieInfo.thumbnailPaths.length);
    // vm.seekPosition(x);
    vm.thumbnailOffset(x);
    vm.thumbnailUrl(cdnBase + '/' + movieInfo.thumbnailPaths[seekReference]);
    //vm.previewUrl(cdnBase + '/' + movieInfo.previewPaths[20]);

    // console.log(movieInfo);
    // console.log(cdnBase);
});
