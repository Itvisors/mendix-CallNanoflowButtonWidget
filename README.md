# Call nanoflow(s) button widget

Currently, nanoflows cannot call other nanoflows. To have some form of reuse,
this widget can call multiple nanoflows with one button click.

Each microflow will get the context object or a one level deep associated object as parameter and should return a boolean value.
When false is returned from any nanoflow, processing ends. Other nanoflows in the widget property list will not be called.

While the nanoflow(s) are called, a class is placed on the button. Any clicks will be ignored.

The button is not disabled as this would prevent clicks from being received. This would allow the event to propagate.
Especially in listviews this can lead to undesired results like the listview action being performed instead.
