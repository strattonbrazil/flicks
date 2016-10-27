var ViewModel = function() {
    this.title = ko.observable('stillsDB.com');
    this.hqIndex = ko.observable(0);
    this.previewIndex = ko.observable(0);
    this.thumbnailIndex = ko.observable(0);
    this.seekPosition = ko.observable();
    this.thumbnailVisibility = ko.observable(false);
    this.thumbnailOffsetX = ko.observable();
    this.thumbnailOffsetY = ko.observable();
    this.tracerWidth = ko.observable();
    this.tracerVisible = ko.observable(false);
    // this.previewUrl = ko.observable('http://cdn.wallpapersafari.com/13/80/3fOp6W.jpg');
    // set image source to empty string, see if that blows away the image
    this.hqUrl = ko.computed(function()     {
        return cdnBase + '/' + movieInfo.hqPaths[this.previewIndex()];
    }, this);
    // console.log(movieInfo);
    this.previewUrl = ko.computed(function()    {
        return cdnBase + '/' + movieInfo.previewPaths[this.previewIndex()];
    }, this);
    this.thumbnailUrl = ko.computed(function()    {
        return cdnBase + '/' + movieInfo.thumbnailPaths[this.thumbnailIndex()];
    }, this);
    this.seekPosition = ko.computed(function()  {
        var percent = this.previewIndex() / movieInfo.previewPaths.length;
        return percent * $('.seek-bar').width();
    }, this);

    let timestamp = 0;  // aaaaaah, global variable ...
    this.onKeyDown = function (vm,downEvent)    {
        if (Date.now() - timestamp > 1000)  {
            if (downEvent.originalEvent.code == "ArrowRight")   {
                if (this.previewIndex() < (movieInfo.previewPaths.length - 1)) {
                    this.previewIndex(this.previewIndex() + 1);
                }
            }
            if (downEvent.originalEvent.code == "ArrowLeft")    {
                if (this.previewIndex() > 0)    {
                    this.previewIndex(this.previewIndex() - 1);
                }
            }
            timestamp = Date.now();
        }
    }

    this.onSeek = function ()   {
        this.thumbnailVisibility(true);
        this.tracerVisible(true);
    }

    this.offSeek = function ()  {
        this.thumbnailVisibility(false);
        this.tracerVisible(false);
    }

    this.onClickSeekbar = function (vm,clickEvent)  {
        var seekBar = clickEvent.currentTarget;
        var x = clickEvent.originalEvent.clientX - seekBar.offsetLeft;
        var percent = x/seekBar.offsetWidth;
        this.previewIndex(Math.round(percent*movieInfo.previewPaths.length));
    }

    this.onMouseMove = function (vm,mouseEvent) {
        var seekBar = mouseEvent.currentTarget;
        var x = mouseEvent.originalEvent.clientX - seekBar.offsetLeft;
        this.tracerWidth(x-4);
        var percent = x/seekBar.offsetWidth;
        this.thumbnailIndex(Math.round(percent*movieInfo.previewPaths.length));
        var xOffset = $('#thumbnail').width() * 0.5;
        var yOffset = 0 - ($('#thumbnail').height());
        this.thumbnailOffsetX(x - xOffset); // centers thumbnail over position in seekbar
        this.thumbnailOffsetY = (yOffset); // aligns thumbnail bottom edge with bottom of preview image area
    }

};  // end of view model


var vm = new ViewModel();

ko.applyBindings(vm);
