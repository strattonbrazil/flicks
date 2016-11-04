

Thumbnail ...
    popping. on page load first thumbnail appears on bottom of seekbar. why?!

Preview ..
    add left and right arrows that appear over preview when cursor is over preview; or when on index zero
    image buffering (on preview 5, buffer 4 and 6)

General ...
    Maybe handle undefined errors like going outside seekbar area
    Add movie meta data underneath the seek bar (title, producer, number of image currently selected (1 of 1000), etc

code ...
    data bind hq-image title to name of image

watermark ...
    figure out how to embed watermark, or at least experiment with it

nav arrows ...
    flickering during hovering, feels unstable
    nav divs are hacked into place using styling, must be a better solution for placement, perhaps implement skeleton to see if it's any easier given additional features?
    hook up left and right nav buttons to clicking the left and right buttons ... or ...
    create functions for left and right movement; clicking on nav arrow or using left/right key fires them directly, both controlled by global timestamp quality, may be easier/slicker to implement than getting a click on a div to pretend it's a button push

questions ...
    create functions for left and right movement through array of preview images, ones that can control whether the nav arrows appear (so no left option on load, no right option on last image)
    left arrow button and left nav arrow click call the left function, right arrow button and right nav arrow click call the right function, after either function timestamp is reset and position in array is tested to see if left/right nav arrows are displayed
    would skeleton look cleaner at this point given the additional controls?
    
