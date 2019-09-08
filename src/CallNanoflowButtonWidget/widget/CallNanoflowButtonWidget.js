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
        showProgress: false,
        callDirectly: false,
        closePage: false,
        loggingActive: false,

        // Internal variables.
        _contextObj: null,
        _button: null,
        _clickHandlerActive: false,
        _listIndex: null,
        _progressId: null,

        constructor: function () {
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            var buttonHtml,
                thisObj = this;

            if (this.callDirectly) {
                // Call the nanoflows directly, do not create button. Use timeout to allow Mendix to complete post create first.
                setTimeout( function() {
                    thisObj.processList();
                }, 100);
            } else {
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
            }
        },

        handleButtonClick: function (e) {
            dojoEvent.stop(e);
            if (this._clickHandlerActive) {
                this._writeToLogger("Click ignored, already processing!");
                return;
            }
            this._clickHandlerActive = true;
            dojoClass.add(this._button, this.activeClass);
            this._writeToLogger("Click!");
            this.processList();
        },

        processList: function () {
            if (this.showProgress) {
                this._showProgress();
            }
            this._listIndex = 0;
            this.processListItem();
        },

        processListItem: function () {

            var nanoflowListItem = this.nanoflowList[this._listIndex],
                referenceName,
                referencedGuid;

            // Use context object or a referenced object?
            if (nanoflowListItem.parameterEntity === this.mxcontext.getTrackEntity()) {
                this._writeToLogger("Call nanoflow at index position " + this._listIndex + " using context object");
                this.callNanoflow(nanoflowListItem.nanoflowToCall, this.mxcontext);
            } else {
                referenceName = nanoflowListItem.parameterEntity.substr(0, nanoflowListItem.parameterEntity.indexOf("/"));
                referencedGuid = this._contextObj.getReference(referenceName);
                mx.data.get({
                    guid: referencedGuid,
                    callback: function(referencedObject) {
                        var nanoflowContext = new mendix.lib.MxContext();
                        nanoflowContext.setTrackObject(referencedObject);
                        this._writeToLogger("Call nanoflow at index position " + this._listIndex + " using object " + referencedObject.getEntity());
                        this.callNanoflow(nanoflowListItem.nanoflowToCall, nanoflowContext);
                    }
                }, this);
            }
        },

        callNanoflow: function (nanoflowToCall, nanoflowContext) {
            var thisObj = this;

            mx.data.callNanoflow({
                nanoflow: nanoflowToCall,
                origin: this.mxform,
                context: nanoflowContext,
                callback: function(result) {
                    thisObj.handleNanoflowCallResult(result);
                },
                error: function(error) {
                    thisObj._writeToLogger("Nanoflow call failed, error: " + error.message, true);
                    thisObj.finalizeNanoflowCalls();
                }
            });
        },

        handleNanoflowCallResult: function (result) {

            if (result) {
                if ((this._listIndex + 1) < this.nanoflowList.length) {
                    this._writeToLogger("Nanoflow completed succesfully, call next nanoflow");
                    this._listIndex++;
                    this.processListItem();
                } else {
                    this._writeToLogger("Nanoflow completed succesfully, no more nanoflows to call");
                    this.finalizeNanoflowCalls();
                }
            } else {
                this._writeToLogger("Nanoflow returned false value, stop processing");
                this.finalizeNanoflowCalls();
            }
        },

        finalizeNanoflowCalls: function () {
            this._clickHandlerActive = false;
            this._hideProgress();
            if (this.closePage) {
                this._writeToLogger("Click handling done, closing the page!");
                this.mxform.close();
            } else {
                this._writeToLogger("Click handling done!");
                if (this._button) {
                    dojoClass.remove(this._button, this.activeClass);
                }
            }
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
            this._hideProgress();
        },

        _showProgress: function () {
            if (!this._progressId) {
                this._progressId = window.mx.ui.showProgress(null, true);
            }
        },

        _hideProgress: function () {
            if (this._progressId) {
                window.mx.ui.hideProgress(this._progressId);
                this._progressId = null;
            }
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

        _writeToLogger: function (message, isError) {
            if (this.loggingActive || isError) {
                logger.info(this.id + " - " + message);
                console.log(this.id + " - " + message);
            }

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
