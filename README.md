# Call nanoflow(s) button widget

Currently, nanoflows cannot call other nanoflows. To have some form of reuse,
this widget can call multiple nanoflows with one button click.

Each microflow will get the context object or a one level deep associated object as parameter and should return a boolean value.
When false is returned from any nanoflow, processing ends. Other nanoflows in the widget property list will not be called.

While the nanoflow(s) are called, a class is placed on the button. Any clicks will be ignored. You can also configure to show a progress bar.

It is also possible to not render a button at all and call the nanoflow(s) directly. This is useful when you want to run a nanoflow dynamically, for example to isolate modules from each other. That is not (yet) possible, but using a JavaScript action you can open a page. That page can use this widget to directly call a nanoflow. Define the page as a modal popup and use class HiddenPopup on it to hide it. The widget can close the page after running the nanoflows.

The button is not disabled as this would prevent clicks from being received. This would allow the event to propagate.
Especially in listviews this can lead to undesired results like the listview action being performed instead.
