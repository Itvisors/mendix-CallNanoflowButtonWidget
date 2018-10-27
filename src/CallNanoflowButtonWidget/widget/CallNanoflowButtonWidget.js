define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/_base/event"

], function (declare, _WidgetBase, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoOn, dojoEvent) {
    "use strict";

    return declare("CallNanoflowButtonWidget.widget.CallNanoflowButtonWidget", [ _WidgetBase ], {


        // Parameters configured in the Modeler.
        buttonCaption: "",
        buttonName: "",
        buttonType: "",
        buttonClass: "",
        buttonGlyphiconClass: "",
        nanoflowList: null,

        // Internal variables.
        _contextObj: null,

        constructor: function () {
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            var buttonHtml,
                button;

            // Create the basic HTML for the button
            buttonHtml  = "<button type='button' class='btn mx-button btn-" + this.buttonType + "'>";
            if (this.buttonGlyphiconClass) {
                buttonHtml += "<span class='" + this.buttonGlyphiconClass + "'></span> "; // The space is intentional! Separation between icon and caption
            }
            buttonHtml += this.buttonCaption;
            buttonHtml += "</button>";

            button = dojoConstruct.place(buttonHtml, this.domNode);
            if (this.buttonName) {
                dojoClass.add(button, "mx-name-" + this.buttonName);
            }
            if (this.buttonClass) {
                dojoClass.add(button, this.buttonClass);
            }
            dojoOn(button, "click", dojoLang.hitch(this, this.handleButtonClick));
        },

        handleButtonClick: function (e) {
            dojoEvent.stop(e);
            logger.info("Click!");
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._updateRendering(callback);
        },

        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["CallNanoflowButtonWidget/widget/CallNanoflowButtonWidget"]);
