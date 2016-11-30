var ViewModel = function() {
    this.fileName = ko.observable();
    this.hqIndex = ko.observable(0);
    this.previewIndex = ko.observable(0);
    this.thumbnailIndex = ko.observable(0);
    this.seekPosition = ko.observable();
    this.prevNavVisibility = ko.observable(false);
    this.nextNavVisibility = ko.observable(false);
    this.thumbnailVisibility = ko.observable(false);
    this.thumbnailOffsetX = ko.observable();
    this.thumbnailOffsetY = ko.observable();
    this.tracerWidth = ko.observable();
    this.tracerVisible = ko.observable(false);
    this.titleGoesHere = movieInfo.title;
    this.directorsGoesHere = movieInfo.directors;
    this.producersGoesHere = movieInfo.producers;
    this.buttonPrompt = movieInfo.buttonPrompt;
    this.buttonAction = function()  {
        window.open(movieInfo.buttonAddress, '_blank');
    };
    this.previewUrl = ko.computed(function()    {
        return cdnBase + '/' + movieInfo.previewPaths[this.previewIndex()];
    }, this);

    this.previousPreviewUrl = ko.computed(function()    {
        var previousIndex = Math.max(this.previewIndex()-1, 0);
        return cdnBase + '/' + movieInfo.previewPaths[previousIndex];
    }, this);

    this.nextPreviewUrl = ko.computed(function()    {
        var nextIndex = Math.min(this.previewIndex()+1, movieInfo.previewPaths.length-1);
        return cdnBase + '/' + movieInfo.previewPaths[nextIndex];
    }, this);




    this.fileName = ko.computed(function()  {
        return movieInfo.hqPaths[this.previewIndex()];
    }, this);
    this.hqUrl = ko.computed(function()     {
        return cdnBase + '/' + movieInfo.hqPaths[this.previewIndex()];
    }, this);
    // console.log(movieInfo);
    this.thumbnailUrl = ko.computed(function()    {
        return cdnBase + '/' + movieInfo.thumbnailPaths[this.thumbnailIndex()];
    }, this);
    this.seekPosition = ko.computed(function()  {
        var percent = this.previewIndex() / movieInfo.previewPaths.length;
        return percent * $('.seek-bar').width();
    }, this);

    this.onSeek = function ()   {
        this.thumbnailVisibility(true);
        this.tracerVisible(true);
    }

    this.offSeek = function ()  {
        this.thumbnailVisibility(false);
        this.tracerVisible(false);
    }

    this.onPreview = function()     {
        if (this.previewIndex() > 0)    {
            this.prevNavVisibility(true);
        }
        if (this.previewIndex() < (movieInfo.previewPaths.length - 1)) {
            this.nextNavVisibility(true);
        }
        // this.navVisibility(true);
    }

    this.offPreview = function()    {
        this.prevNavVisibility(false);
        this.nextNavVisibility(false);
    }

    this.onKeyDown = function (vm,downEvent)    {
        if (downEvent.originalEvent.code == "ArrowLeft")   {
             this.goPrev();
        }
        if (downEvent.originalEvent.code == "ArrowRight")   {
             this.goNext();
        }
        return true;
    }

    let timestamp = 0;  // eek, global variable ...
    this.goPrev = function ()   {
        if ((Date.now() - timestamp > 1000) && (this.previewIndex() > 0))  {
            this.previewIndex(this.previewIndex() - 1);
            timestamp = Date.now();
        };
    }

    this.goNext = function ()   {
        if ((Date.now() - timestamp > 1000) && (this.previewIndex() < (movieInfo.previewPaths.length - 1)))  {
            this.previewIndex(this.previewIndex() + 1);
            timestamp = Date.now();
        }
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
        var xOffset = 82;
        var yOffset = -92;
        this.thumbnailOffsetX(x - xOffset); // centers thumbnail over position in seekbar
        this.thumbnailOffsetY = (yOffset); // aligns thumbnail bottom edge with bottom of preview image area
    }

    this.homeClick = function() {
        document.location.href="/"
    };

};  // end of view model


var vm = new ViewModel();

ko.applyBindings(vm);
