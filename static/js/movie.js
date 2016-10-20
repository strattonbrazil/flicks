// device blueprints and default values
var ViewModel = function() {
    this.title = ko.observable('stillsDB.com');
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
    this.thumbnailShiftDown = 4;
    // this.previewUrl = ko.observable(cdnBase + '/' + movieInfo.previewPaths[0]);
    this.previewUrl = ko.observable('http://cdn.wallpapersafari.com/13/80/3fOp6W.jpg');
};

// assemble device
var vm = new ViewModel();

// start device
ko.applyBindings(vm);

// why is this outside the ViewModel ... could you replace vm. with this. ?
$("#seek-bar").mousemove(function(e){
    var x = e.pageX - this.offsetLeft;
    var percent = x/this.offsetWidth;
    var seekReference = Math.round(percent*movieInfo.thumbnailPaths.length);
    // vm.seekPosition(x);
    vm.thumbnailOffset(x-82);
    // right here, above this line ... x minus half the width of the thumbnail
    vm.thumbnailUrl(cdnBase + '/' + movieInfo.thumbnailPaths[seekReference]);
    //vm.previewUrl(cdnBase + '/' + movieInfo.previewPaths[20]);

    // console.log(movieInfo);
    // console.log(cdnBase);
});
