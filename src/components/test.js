var Popover = {
    render: function render() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c('div', {staticClass: "v-popover", class: _vm.cssClass}, [_c('span', {
            ref: "trigger",
            staticClass: "trigger",
            staticStyle: {"display": "inline-block"},
            attrs: {"aria-describedby": _vm.popoverId, "tabindex": _vm.trigger.indexOf('focus') !== -1 ? 0 : -1}
        }, [_vm._t("default")], 2), _vm._v(" "), _c('div', {
            ref: "popover", class: [_vm.popoverBaseClass, _vm.popoverClass, _vm.cssClass], style: {
                visibility: _vm.isOpen ? 'visible' : 'hidden'
            }, attrs: {"id": _vm.popoverId, "aria-hidden": _vm.isOpen ? 'false' : 'true'}
        }, [_c('div', {class: _vm.popoverWrapperClass}, [_c('div', {
            ref: "inner",
            class: _vm.popoverInnerClass,
            staticStyle: {"position": "relative"}
        }, [_c('div', [_vm._t("popover")], 2), _vm._v(" "), _vm.handleResize ? _c('ResizeObserver', {on: {"notify": _vm.$_handleResize}}) : _vm._e()], 1), _vm._v(" "), _c('div', {
            ref: "arrow",
            class: _vm.popoverArrowClass
        })])])]);
    }, staticRenderFns: [],
    name: 'VPopover',

    components: {
        ResizeObserver: ResizeObserver
    },

    props: {
        open: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        placement: {
            type: String,
            default: function _default() {
                return getDefault('defaultPlacement');
            }
        },
        delay: {
            type: [String, Number, Object],
            default: function _default() {
                return getDefault('defaultDelay');
            }
        },
        offset: {
            type: [String, Number],
            default: function _default() {
                return getDefault('defaultOffset');
            }
        },
        trigger: {
            type: String,
            default: function _default() {
                return getDefault('defaultTrigger');
            }
        },
        container: {
            type: [String, Object, Element, Boolean],
            default: function _default() {
                return getDefault('defaultContainer');
            }
        },
        boundariesElement: {
            type: [String, Element],
            default: function _default() {
                return getDefault('defaultBoundariesElement');
            }
        },
        popperOptions: {
            type: Object,
            default: function _default() {
                return getDefault('defaultPopperOptions');
            }
        },
        popoverClass: {
            type: [String, Array],
            default: function _default() {
                return getDefault('defaultClass');
            }
        },
        popoverBaseClass: {
            type: [String, Array],
            default: function _default() {
                return directive.options.popover.defaultBaseClass;
            }
        },
        popoverInnerClass: {
            type: [String, Array],
            default: function _default() {
                return directive.options.popover.defaultInnerClass;
            }
        },
        popoverWrapperClass: {
            type: [String, Array],
            default: function _default() {
                return directive.options.popover.defaultWrapperClass;
            }
        },
        popoverArrowClass: {
            type: [String, Array],
            default: function _default() {
                return directive.options.popover.defaultArrowClass;
            }
        },
        autoHide: {
            type: Boolean,
            default: function _default() {
                return directive.options.popover.defaultAutoHide;
            }
        },
        handleResize: {
            type: Boolean,
            default: function _default() {
                return directive.options.popover.defaultHandleResize;
            }
        },
        openGroup: {
            type: String,
            default: null
        }
    },

    data: function data() {
        return {
            isOpen: false,
            id: Math.random().toString(36).substr(2, 10)
        };
    },


    computed: {
        cssClass: function cssClass() {
            return {
                'open': this.isOpen
            };
        },
        popoverId: function popoverId() {
            return 'popover_' + this.id;
        }
    },

    watch: {
        open: function open(val) {
            if (val) {
                this.show();
            } else {
                this.hide();
            }
        },
        disabled: function disabled(val, oldVal) {
            if (val !== oldVal) {
                if (val) {
                    this.hide();
                } else if (this.open) {
                    this.show();
                }
            }
        },
        container: function container(val) {
            if (this.isOpen && this.popperInstance) {
                var popoverNode = this.$refs.popover;
                var reference = this.$refs.trigger;

                var container = this.$_findContainer(this.container, reference);
                if (!container) {
                    console.warn('No container for popover', this);
                    return;
                }

                container.appendChild(popoverNode);
                this.popperInstance.scheduleUpdate();
            }
        },
        trigger: function trigger(val) {
            this.$_removeEventListeners();
            this.$_addEventListeners();
        },
        placement: function placement(val) {
            var _this = this;

            this.$_updatePopper(function () {
                _this.popperInstance.options.placement = val;
            });
        },


        offset: '$_restartPopper',

        boundariesElement: '$_restartPopper',

        popperOptions: {
            handler: '$_restartPopper',
            deep: true
        }
    },

    created: function created() {
        this.$_isDisposed = false;
        this.$_mounted = false;
        this.$_events = [];
        this.$_preventOpen = false;
    },
    mounted: function mounted() {
        var popoverNode = this.$refs.popover;
        popoverNode.parentNode && popoverNode.parentNode.removeChild(popoverNode);

        this.$_init();

        if (this.open) {
            this.show();
        }
    },
    beforeDestroy: function beforeDestroy() {
        this.dispose();
    },


    methods: {
        show: function show() {
            var _this2 = this;

            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                event = _ref.event,
                _ref$skipDelay = _ref.skipDelay,
                _ref$force = _ref.force,
                force = _ref$force === undefined ? false : _ref$force;

            if (force || !this.disabled) {
                this.$_scheduleShow(event);
                this.$emit('show');
            }
            this.$emit('update:open', true);
            this.$_beingShowed = true;
            requestAnimationFrame(function () {
                _this2.$_beingShowed = false;
            });
        },
        hide: function hide() {
            var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                event = _ref2.event,
                _ref2$skipDelay = _ref2.skipDelay;

            this.$_scheduleHide(event);

            this.$emit('hide');
            this.$emit('update:open', false);
        },
        dispose: function dispose() {
            this.$_isDisposed = true;
            this.$_removeEventListeners();
            this.hide({skipDelay: true});
            if (this.popperInstance) {
                this.popperInstance.destroy();

                // destroy tooltipNode if removeOnDestroy is not set, as popperInstance.destroy() already removes the element
                if (!this.popperInstance.options.removeOnDestroy) {
                    var popoverNode = this.$refs.popover;
                    popoverNode.parentNode && popoverNode.parentNode.removeChild(popoverNode);
                }
            }
            this.$_mounted = false;
            this.popperInstance = null;
            this.isOpen = false;

            this.$emit('dispose');
        },
        $_init: function $_init() {
            if (this.trigger.indexOf('manual') === -1) {
                this.$_addEventListeners();
            }
        },
        $_show: function $_show() {
            var _this3 = this;

            var reference = this.$refs.trigger;
            var popoverNode = this.$refs.popover;

            clearTimeout(this.$_disposeTimer);

            // Already open
            if (this.isOpen) {
                return;
            }

            // Popper is already initialized
            if (this.popperInstance) {
                this.isOpen = true;
                this.popperInstance.enableEventListeners();
                this.popperInstance.scheduleUpdate();
            }

            if (!this.$_mounted) {
                var container = this.$_findContainer(this.container, reference);
                if (!container) {
                    console.warn('No container for popover', this);
                    return;
                }
                container.appendChild(popoverNode);
                this.$_mounted = true;
            }

            if (!this.popperInstance) {
                var popperOptions = _extends$1({}, this.popperOptions, {
                    placement: this.placement
                });

                popperOptions.modifiers = _extends$1({}, popperOptions.modifiers, {
                    arrow: _extends$1({}, popperOptions.modifiers && popperOptions.modifiers.arrow, {
                        element: this.$refs.arrow
                    })
                });

                if (this.offset) {
                    var offset = this.$_getOffset();

                    popperOptions.modifiers.offset = _extends$1({}, popperOptions.modifiers && popperOptions.modifiers.offset, {
                        offset: offset
                    });
                }

                if (this.boundariesElement) {
                    popperOptions.modifiers.preventOverflow = _extends$1({}, popperOptions.modifiers && popperOptions.modifiers.preventOverflow, {
                        boundariesElement: this.boundariesElement
                    });
                }

                this.popperInstance = new Popper(reference, popoverNode, popperOptions);

                // Fix position
                requestAnimationFrame(function () {
                    if (!_this3.$_isDisposed && _this3.popperInstance) {
                        _this3.popperInstance.scheduleUpdate();

                        // Show the tooltip
                        requestAnimationFrame(function () {
                            if (!_this3.$_isDisposed) {
                                _this3.isOpen = true;
                            } else {
                                _this3.dispose();
                            }
                        });
                    } else {
                        _this3.dispose();
                    }
                });
            }

            var openGroup = this.openGroup;
            if (openGroup) {
                var popover = void 0;
                for (var i = 0; i < openPopovers.length; i++) {
                    popover = openPopovers[i];
                    if (popover.openGroup !== openGroup) {
                        popover.hide();
                        popover.$emit('close-group');
                    }
                }
            }

            openPopovers.push(this);

            this.$emit('apply-show');
        },
        $_hide: function $_hide() {
            var _this4 = this;

            // Already hidden
            if (!this.isOpen) {
                return;
            }

            var index = openPopovers.indexOf(this);
            if (index !== -1) {
                openPopovers.splice(index, 1);
            }

            this.isOpen = false;
            if (this.popperInstance) {
                this.popperInstance.disableEventListeners();
            }

            clearTimeout(this.$_disposeTimer);
            var disposeTime = directive.options.popover.disposeTimeout || directive.options.disposeTimeout;
            if (disposeTime !== null) {
                this.$_disposeTimer = setTimeout(function () {
                    var popoverNode = _this4.$refs.popover;
                    if (popoverNode) {
                        // Don't remove popper instance, just the HTML element
                        popoverNode.parentNode && popoverNode.parentNode.removeChild(popoverNode);
                        _this4.$_mounted = false;
                    }
                }, disposeTime);
            }

            this.$emit('apply-hide');
        },
        $_findContainer: function $_findContainer(container, reference) {
            // if container is a query, get the relative element
            if (typeof container === 'string') {
                container = window.document.querySelector(container);
            } else if (container === false) {
                // if container is `false`, set it to reference parent
                container = reference.parentNode;
            }
            return container;
        },
        $_getOffset: function $_getOffset() {
            var typeofOffset = _typeof(this.offset);
            var offset = this.offset;

            // One value -> switch
            if (typeofOffset === 'number' || typeofOffset === 'string' && offset.indexOf(',') === -1) {
                offset = '0, ' + offset;
            }

            return offset;
        },
        $_addEventListeners: function $_addEventListeners() {
            var _this5 = this;

            var reference = this.$refs.trigger;
            var directEvents = [];
            var oppositeEvents = [];

            var events = typeof this.trigger === 'string' ? this.trigger.split(' ').filter(function (trigger) {
                return ['click', 'hover', 'focus'].indexOf(trigger) !== -1;
            }) : [];

            events.forEach(function (event) {
                switch (event) {
                    case 'hover':
                        directEvents.push('mouseenter');
                        oppositeEvents.push('mouseleave');
                        break;
                    case 'focus':
                        directEvents.push('focus');
                        oppositeEvents.push('blur');
                        break;
                    case 'click':
                        directEvents.push('click');
                        oppositeEvents.push('click');
                        break;
                }
            });

            // schedule show tooltip
            directEvents.forEach(function (event) {
                var func = function func(event) {
                    if (_this5.isOpen) {
                        return;
                    }
                    event.usedByTooltip = true;
                    !_this5.$_preventOpen && _this5.show({event: event});
                };
                _this5.$_events.push({event: event, func: func});
                reference.addEventListener(event, func);
            });

            // schedule hide tooltip
            oppositeEvents.forEach(function (event) {
                var func = function func(event) {
                    if (event.usedByTooltip) {
                        return;
                    }
                    _this5.hide({event: event});
                };
                _this5.$_events.push({event: event, func: func});
                reference.addEventListener(event, func);
            });
        },
        $_scheduleShow: function $_scheduleShow() {
            var skipDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            clearTimeout(this.$_scheduleTimer);
            if (skipDelay) {
                this.$_show();
            } else {
                // defaults to 0
                var computedDelay = parseInt(this.delay && this.delay.show || this.delay || 0);
                this.$_scheduleTimer = setTimeout(this.$_show.bind(this), computedDelay);
            }
        },
        $_scheduleHide: function $_scheduleHide() {
            var _this6 = this;

            var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var skipDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            clearTimeout(this.$_scheduleTimer);
            if (skipDelay) {
                this.$_hide();
            } else {
                // defaults to 0
                var computedDelay = parseInt(this.delay && this.delay.hide || this.delay || 0);
                this.$_scheduleTimer = setTimeout(function () {
                    if (!_this6.isOpen) {
                        return;
                    }

                    // if we are hiding because of a mouseleave, we must check that the new
                    // reference isn't the tooltip, because in this case we don't want to hide it
                    if (event && event.type === 'mouseleave') {
                        var isSet = _this6.$_setTooltipNodeEvent(event);

                        // if we set the new event, don't hide the tooltip yet
                        // the new event will take care to hide it if necessary
                        if (isSet) {
                            return;
                        }
                    }

                    _this6.$_hide();
                }, computedDelay);
            }
        },
        $_setTooltipNodeEvent: function $_setTooltipNodeEvent(event) {
            var _this7 = this;

            var reference = this.$refs.trigger;
            var popoverNode = this.$refs.popover;

            var relatedreference = event.relatedreference || event.toElement || event.relatedTarget;

            var callback = function callback(event2) {
                var relatedreference2 = event2.relatedreference || event2.toElement || event2.relatedTarget;

                // Remove event listener after call
                popoverNode.removeEventListener(event.type, callback);

                // If the new reference is not the reference element
                if (!reference.contains(relatedreference2)) {
                    // Schedule to hide tooltip
                    _this7.hide({event: event2});
                }
            };

            if (popoverNode.contains(relatedreference)) {
                // listen to mouseleave on the tooltip element to be able to hide the tooltip
                popoverNode.addEventListener(event.type, callback);
                return true;
            }

            return false;
        },
        $_removeEventListeners: function $_removeEventListeners() {
            var reference = this.$refs.trigger;
            this.$_events.forEach(function (_ref3) {
                var func = _ref3.func,
                    event = _ref3.event;

                reference.removeEventListener(event, func);
            });
            this.$_events = [];
        },
        $_updatePopper: function $_updatePopper(cb) {
            if (this.popperInstance) {
                cb();
                if (this.isOpen) this.popperInstance.scheduleUpdate();
            }
        },
        $_restartPopper: function $_restartPopper() {
            if (this.popperInstance) {
                var isOpen = this.isOpen;
                this.dispose();
                this.$_isDisposed = false;
                this.$_init();
                if (isOpen) {
                    this.show({skipDelay: true, force: true});
                }
            }
        },
        $_handleGlobalClose: function $_handleGlobalClose(event) {
            var _this8 = this;

            var touch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (this.$_beingShowed) return;

            this.hide({event: event});

            if (event.closePopover) {
                this.$emit('close-directive');
            } else {
                this.$emit('auto-hide');
            }

            if (touch) {
                this.$_preventOpen = true;
                setTimeout(function () {
                    _this8.$_preventOpen = false;
                }, 300);
            }
        },
        $_handleResize: function $_handleResize() {
            if (this.isOpen && this.popperInstance) {
                this.popperInstance.scheduleUpdate();
                this.$emit('resize');
            }
        }
    }
};