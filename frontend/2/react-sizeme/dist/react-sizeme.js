'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var createResizeDetector = _interopDefault(require('element-resize-detector'));
var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var ReactDOM = _interopDefault(require('react-dom'));
var invariant = _interopDefault(require('invariant'));
var throttle = _interopDefault(require('lodash.throttle'));
var debounce = _interopDefault(require('lodash.debounce'));
var isShallowEqual = _interopDefault(require('shallowequal'));

var instances = {};

// Lazily require to not cause bug
// https://github.com/ctrlplusb/react-sizeme/issues/6
function resizeDetector() {
  var strategy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'scroll';

  if (!instances[strategy]) {
    instances[strategy] = createResizeDetector({
      strategy: strategy
    });
  }

  return instances[strategy];
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/* eslint-disable react/no-multi-comp */

var defaultConfig = {
  monitorWidth: true,
  monitorHeight: false,
  monitorPosition: false,
  refreshRate: 16,
  refreshMode: 'throttle',
  noPlaceholder: false,
  resizeDetectorStrategy: 'scroll'
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/**
 * This is a utility wrapper component that will allow our higher order
 * component to get a ref handle on our wrapped components html.
 * @see https://gist.github.com/jimfb/32b587ee6177665fb4cf
 */

var ReferenceWrapper = function (_Component) {
  inherits(ReferenceWrapper, _Component);

  function ReferenceWrapper() {
    classCallCheck(this, ReferenceWrapper);
    return possibleConstructorReturn(this, (ReferenceWrapper.__proto__ || Object.getPrototypeOf(ReferenceWrapper)).apply(this, arguments));
  }

  createClass(ReferenceWrapper, [{
    key: 'render',
    value: function render() {
      return React.Children.only(this.props.children);
    }
  }]);
  return ReferenceWrapper;
}(React.Component);

ReferenceWrapper.displayName = 'SizeMeReferenceWrapper';

ReferenceWrapper.propTypes = { children: PropTypes.element.isRequired };

function Placeholder(_ref) {
  var className = _ref.className,
      style = _ref.style;

  // Lets create the props for the temp element.
  var phProps = {};

  // We will use any provided className/style or else make the temp
  // container take the full available space.
  if (!className && !style) {
    phProps.style = { width: '100%', height: '100%' };
  } else {
    if (className) {
      phProps.className = className;
    }
    if (style) {
      phProps.style = style;
    }
  }

  return React__default.createElement('div', phProps);
}
Placeholder.displayName = 'SizeMePlaceholder';
Placeholder.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object

  /**
   * As we need to maintain a ref on the root node that is rendered within our
   * SizeMe component we need to wrap our entire render in a sub component.
   * Without this, we lose the DOM ref after the placeholder is removed from
   * the render and the actual component is rendered.
   * It took me forever to figure this out, so tread extra careful on this one!
   */
};var renderWrapper = function renderWrapper(WrappedComponent) {
  function SizeMeRenderer(props) {
    var explicitRef = props.explicitRef,
        className = props.className,
        style = props.style,
        size = props.size,
        disablePlaceholder = props.disablePlaceholder,
        onSize = props.onSize,
        restProps = objectWithoutProperties(props, ['explicitRef', 'className', 'style', 'size', 'disablePlaceholder', 'onSize']);


    var noSizeData = size == null || size.width == null && size.height == null && size.position == null;

    var renderPlaceholder = noSizeData && !disablePlaceholder;

    var renderProps = {
      className: className,
      style: style
    };

    if (size != null) {
      renderProps.size = size;
    }

    var toRender = renderPlaceholder ? React__default.createElement(Placeholder, { className: className, style: style }) : React__default.createElement(WrappedComponent, _extends({}, renderProps, restProps));

    return React__default.createElement(
      ReferenceWrapper,
      { ref: explicitRef },
      toRender
    );
  }

  SizeMeRenderer.displayName = 'SizeMeRenderer(' + getDisplayName(WrappedComponent) + ')';

  SizeMeRenderer.propTypes = {
    explicitRef: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    size: PropTypes.shape({
      width: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
      height: PropTypes.number // eslint-disable-line react/no-unused-prop-types
    }),
    disablePlaceholder: PropTypes.bool,
    onSize: PropTypes.func
  };

  return SizeMeRenderer;
};

/**
 * :: config -> Component -> WrappedComponent
 *
 * Higher order component that allows the wrapped component to become aware
 * of it's size, by receiving it as an object within it's props.
 *
 * @param  monitorWidth
 *   Default true, whether changes in the element's width should be monitored,
 *   causing a size property to be broadcast.
 * @param  monitorHeight
 *   Default false, whether changes in the element's height should be monitored,
 *   causing a size property to be broadcast.
 *
 * @return The wrapped component.
 */
function withSize() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultConfig;
  var _config$monitorWidth = config.monitorWidth,
      monitorWidth = _config$monitorWidth === undefined ? defaultConfig.monitorWidth : _config$monitorWidth,
      _config$monitorHeight = config.monitorHeight,
      monitorHeight = _config$monitorHeight === undefined ? defaultConfig.monitorHeight : _config$monitorHeight,
      _config$monitorPositi = config.monitorPosition,
      monitorPosition = _config$monitorPositi === undefined ? defaultConfig.monitorPosition : _config$monitorPositi,
      _config$refreshRate = config.refreshRate,
      refreshRate = _config$refreshRate === undefined ? defaultConfig.refreshRate : _config$refreshRate,
      _config$refreshMode = config.refreshMode,
      refreshMode = _config$refreshMode === undefined ? defaultConfig.refreshMode : _config$refreshMode,
      _config$noPlaceholder = config.noPlaceholder,
      noPlaceholder = _config$noPlaceholder === undefined ? defaultConfig.noPlaceholder : _config$noPlaceholder,
      _config$resizeDetecto = config.resizeDetectorStrategy,
      resizeDetectorStrategy = _config$resizeDetecto === undefined ? defaultConfig.resizeDetectorStrategy : _config$resizeDetecto;


  invariant(monitorWidth || monitorHeight || monitorPosition, 'You have to monitor at least one of the width, height, or position when using "sizeMe"');

  invariant(refreshRate >= 16, "It is highly recommended that you don't put your refreshRate lower than " + '16 as this may cause layout thrashing.');

  invariant(refreshMode === 'throttle' || refreshMode === 'debounce', 'The refreshMode should have a value of "throttle" or "debounce"');

  var refreshDelayStrategy = refreshMode === 'throttle' ? throttle : debounce;

  return function WrapComponent(WrappedComponent) {
    var SizeMeRenderWrapper = renderWrapper(WrappedComponent);

    var SizeAwareComponent = function (_React$Component) {
      inherits(SizeAwareComponent, _React$Component);

      function SizeAwareComponent() {
        var _ref2;

        var _temp, _this2, _ret;

        classCallCheck(this, SizeAwareComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this2 = possibleConstructorReturn(this, (_ref2 = SizeAwareComponent.__proto__ || Object.getPrototypeOf(SizeAwareComponent)).call.apply(_ref2, [this].concat(args))), _this2), _this2.state = {
          width: undefined,
          height: undefined,
          position: undefined
        }, _this2.determineStrategy = function (props) {
          if (props.onSize) {
            if (!_this2.callbackState) {
              _this2.callbackState = _extends({}, _this2.state);
            }
            _this2.strategy = 'callback';
          } else {
            _this2.strategy = 'render';
          }
        }, _this2.strategisedSetState = function (state) {
          if (_this2.strategy === 'callback') {
            _this2.callbackState = state;
            _this2.props.onSize(state);
          }
          _this2.setState(state);
        }, _this2.strategisedGetState = function () {
          return _this2.strategy === 'callback' ? _this2.callbackState : _this2.state;
        }, _this2.refCallback = function (element) {
          _this2.element = element;
        }, _this2.hasSizeChanged = function (current, next) {
          var c = current;
          var n = next;
          var cp = c.position || {};
          var np = n.position || {};

          return monitorHeight && c.height !== n.height || monitorPosition && (cp.top !== np.top || cp.left !== np.left || cp.bottom !== np.bottom || cp.right !== np.right) || monitorWidth && c.width !== n.width;
        }, _this2.checkIfSizeChanged = refreshDelayStrategy(function (el) {
          var _el$getBoundingClient = el.getBoundingClientRect(),
              width = _el$getBoundingClient.width,
              height = _el$getBoundingClient.height,
              right = _el$getBoundingClient.right,
              left = _el$getBoundingClient.left,
              top = _el$getBoundingClient.top,
              bottom = _el$getBoundingClient.bottom;

          var next = {
            width: monitorWidth ? width : null,
            height: monitorHeight ? height : null,
            position: monitorPosition ? { right: right, left: left, top: top, bottom: bottom } : null
          };

          if (_this2.hasSizeChanged(_this2.strategisedGetState(), next)) {
            _this2.strategisedSetState(next);
          }
        }, refreshRate), _temp), possibleConstructorReturn(_this2, _ret);
      }

      createClass(SizeAwareComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.detector = resizeDetector(resizeDetectorStrategy);
          this.determineStrategy(this.props);
          this.handleDOMNode(true);
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          this.determineStrategy(nextProps);
        }
      }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
          this.handleDOMNode();
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          // Change our size checker to a noop just in case we have some
          // late running events.
          this.hasSizeChanged = function () {
            return undefined;
          };
          this.checkIfSizeChanged = function () {
            return undefined;
          };

          if (this.domEl) {
            this.detector.uninstall(this.domEl);
            this.domEl = null;
          }
        }
      }, {
        key: 'handleDOMNode',
        value: function handleDOMNode(first) {
          var found = this.element && ReactDOM.findDOMNode(this.element);

          if (!found) {
            // If we previously had a dom node then we need to ensure that
            // we remove any existing listeners to avoid memory leaks.
            if (!first && this.domEl) {
              this.detector.removeAllListeners(this.domEl);
              this.domEl = null;
            }
            return;
          }

          if (!first && this.domEl) {
            this.detector.removeAllListeners(this.domEl);
          }

          this.domEl = found;
          this.detector.listenTo(this.domEl, this.checkIfSizeChanged);
        }
      }, {
        key: 'render',
        value: function render() {
          var disablePlaceholder = withSize.enableSSRBehaviour || withSize.noPlaceholders || noPlaceholder || this.strategy === 'callback';

          var size = _extends({}, this.state);

          return React__default.createElement(SizeMeRenderWrapper, _extends({
            explicitRef: this.refCallback,
            size: this.strategy === 'callback' ? null : size,
            disablePlaceholder: disablePlaceholder
          }, this.props));
        }
      }]);
      return SizeAwareComponent;
    }(React__default.Component);

    SizeAwareComponent.displayName = 'SizeMe(' + getDisplayName(WrappedComponent) + ')';
    SizeAwareComponent.propTypes = {
      onSize: PropTypes.func
    };


    SizeAwareComponent.WrappedComponent = WrappedComponent;

    return SizeAwareComponent;
  };
}

/**
 * Allow SizeMe to run within SSR environments.  This is a "global" behaviour
 * flag that should be set within the initialisation phase of your application.
 *
 * Warning: don't set this flag unless you need to as using it may cause
 * extra render cycles to happen within your components depending on the logic
 * contained within them around the usage of the `size` data.
 *
 * DEPRECATED: Please use the global disablePlaceholders
 */
withSize.enableSSRBehaviour = false;

/**
 * Global configuration allowing to disable placeholder rendering for all
 * sizeMe components.
 */
withSize.noPlaceholders = false;

var SizeMe = function (_Component) {
  inherits(SizeMe, _Component);

  function SizeMe(props) {
    classCallCheck(this, SizeMe);

    var _this = possibleConstructorReturn(this, (SizeMe.__proto__ || Object.getPrototypeOf(SizeMe)).call(this, props));

    _initialiseProps.call(_this);

    var children = props.children,
        render = props.render,
        sizeMeConfig = objectWithoutProperties(props, ['children', 'render']);

    _this.createComponent(sizeMeConfig);
    _this.state = {
      size: {
        width: undefined,
        height: undefined
      }
    };
    return _this;
  }

  createClass(SizeMe, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _props = this.props,
          prevChildren = _props.children,
          prevRender = _props.render,
          prevSizeMeConfig = objectWithoutProperties(_props, ['children', 'render']);
      var nextChildren = nextProps.children,
          nextRender = nextProps.render,
          nextSizeMeConfig = objectWithoutProperties(nextProps, ['children', 'render']);

      if (!isShallowEqual(prevSizeMeConfig, nextSizeMeConfig)) {
        this.createComponent(nextSizeMeConfig);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var SizeAware = this.SizeAware;

      var render = this.props.children || this.props.render;
      return React__default.createElement(
        SizeAware,
        { onSize: this.onSize },
        render({ size: this.state.size })
      );
    }
  }]);
  return SizeMe;
}(React.Component);

SizeMe.propTypes = {
  children: PropTypes.func,
  render: PropTypes.func
};
SizeMe.defaultProps = {
  children: undefined,
  render: undefined
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.createComponent = function (config) {
    _this2.SizeAware = withSize(config)(function (_ref) {
      var children = _ref.children;
      return children;
    });
  };

  this.onSize = function (size) {
    return _this2.setState({ size: size });
  };
};

withSize.SizeMe = SizeMe;
withSize.withSize = withSize;

module.exports = withSize;
//# sourceMappingURL=react-sizeme.js.map
