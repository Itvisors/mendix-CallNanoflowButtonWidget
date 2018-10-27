# Call nanoflow(s) button widget

Currently, nanoflows cannot call other nanoflows. To have some form of reuse,
this widget can call multiple nanoflows with one button click.

Each microflow will get the context object as parameter and should return a boolean value.
When false is returned from any nanoflow, processing ends. Other nanoflows in the widget property list will not be called.

