var ViewModel = function() {
    this.title = ko.observable('stillsDB.com');
    this.previewIndex = ko.observable(0);
    this.thumbnailIndex = ko.observable(0);
    this.seekPosition = ko.observable();
    this.thumbnailVisibility = ko.observable(false);
    this.thumbnailOffsetX = ko.observable();
    this.thumbnailOffsetY = ko.observable();
    this.tracerWidth = ko.observable();
    this.tracerVisible = ko.observable(false);
    // this.previewUrl = ko.observable('http://cdn.wallpapersafari.com/13/80/3fOp6W.jpg');
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
    this.onPreviewClick = ko.observable();
    this.fullscreenVisible = ko.observable(false);
    this.fullscreenUrl = ko.observable();

    this.onKeyDown = function (vm,downEvent)    {
        /* look at the last time this was changed, if less than a second just return */
        console.log(downEvent);
        if (downEvent.originalEvent.code == "ArrowRight")   {
            this.previewIndex(this.previewIndex() + 1);
        }
        if (downEvent.originalEvent.code == "ArrowLeft")    {
            this.previewIndex(this.previewIndex() - 1);
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
        var yOffset = 0 - ($('#thumbnail').height() + 14); // fixed number, for the margin between the seek bar and the preview area and the width of the border around the thumbnail
        this.thumbnailOffsetX(x - xOffset); // centers thumbnail over position in seekbar
        this.thumbnailOffsetY = (yOffset); // aligns thumbnail bottom edge with bottom of preview image area
    };

    this.onPreviewClick = function (vm,clickEvent)    {
        this.fullscreenVisible = ko.observable(true);
    }

    this.onFullscreenClick = function (vm,clickEvent)   {
        this.fullscreenVisible = ko.observable(false);
    }
};

var vm = new ViewModel();

ko.applyBindings(vm);
