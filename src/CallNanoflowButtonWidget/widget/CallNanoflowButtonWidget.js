define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/_base/event"

], function (declare, _WidgetBase, dojoClass, dojoStyle, dojoConstruct, dojoLang, dojoOn, dojoEvent) {
    "use strict";

    return declare("CallNanoflowButtonWidget.widget.CallNanoflowButtonWidget", [ _WidgetBase ], {


        // Parameters configured in the Modeler.
        buttonCaption: "",
        buttonName: "",
        buttonType: "",
        buttonClass: "",
        activeClass: "",
        buttonGlyphiconClass: "",
        nanoflowList: null,

        // Internal variables.
        _contextObj: null,
        _button: null,
        _clickHandlerActive: false,
        _listIndex: null,

        constructor: function () {
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            var buttonHtml;

            // Create the basic HTML for the button
            buttonHtml  = "<button type='button' class='btn mx-button btn-" + this.buttonType + "'>";
            if (this.buttonGlyphiconClass) {
                buttonHtml += "<span class='" + this.buttonGlyphiconClass + "'></span> "; // The space is intentional! Separation between icon and caption
            }
            buttonHtml += this.buttonCaption;
            buttonHtml += "</button>";

            this._button = dojoConstruct.place(buttonHtml, this.domNode);
            if (this.buttonName) {
                dojoClass.add(this._button, "mx-name-" + this.buttonName);
            }
            if (this.buttonClass) {
                dojoClass.add(this._button, this.buttonClass);
            }
            dojoOn(this._button, "click", dojoLang.hitch(this, this.handleButtonClick));
        },

        handleButtonClick: function (e) {
            var thisObj = this;
            dojoEvent.stop(e);
            if (this._clickHandlerActive) {
                logger.info("Click ignored, already processing!");
                return;
            }
            this._clickHandlerActive = true;
            this._listIndex = 0;
            dojoClass.add(this._button, this.activeClass);
            logger.info("Click!");
            this.callNanoflow();
        },

        callNanoflow: function () {

            var nanoflowListItem = this.nanoflowList[this._listIndex],
                thisObj = this;

            logger.info("Call nanoflow at index postion " + this._listIndex);

            mx.data.callNanoflow({
                nanoflow: nanoflowListItem.nanoflowToCall,
                origin: this.mxform,
                context: this.mxcontext,
                callback: function(result) {
                    thisObj.handleNanoflowCallResult(result);
                },
                error: function(error) {
                    logger.info("Nanoflow call failed, error: " + error.message);
                    thisObj.finalizeButtonClick();
                }
            });
        },

        handleNanoflowCallResult: function (result) {

            if (result) {
                if ((this._listIndex + 1) < this.nanoflowList.length) {
                    logger.info("Nanoflow completed succesfully, call next nanoflow");
                    this._listIndex++;
                    this.callNanoflow();
                } else {
                    logger.info("Nanoflow completed succesfully, no more nanoflows to call");
                    this.finalizeButtonClick();
                }
            } else {
                logger.info("Nanoflow returned false value, stop processing");
                this.finalizeButtonClick();
            }
        },

        finalizeButtonClick: function () {
            logger.info("Click handling done!");
            this._clickHandlerActive = false;
            dojoClass.remove(this._button, this.activeClass);
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
