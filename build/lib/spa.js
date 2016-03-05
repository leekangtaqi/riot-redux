'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.spa = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _riot = require('riot');

var _riot2 = _interopRequireDefault(_riot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spa = exports.spa = { version: 0.1 };

Object.assign(spa, _riot2.default.observable());

exports.spa = spa = {

    tags: {},

    viewify: {
        hidden: true
    }
};

spa.addons = {
    /**
     * dynamic viewify
     * @param tag
     */
    viewify: function viewify(tag) {
        if (!tag) {
            throw new Error('viewify expected to be a tag');
        }
        var view = {
            context: null,
            hidden: true,
            isViewified: true,
            prev: null
        };

        view.open = function () {
            view.trigger('open');
            return view;
        };

        view.leave = function (from, to) {
            view.trigger('leave', to);
            return view;
        };

        /**
         * check current view is presenting or not
         * @returns {boolean}
         */
        view.shouldNav = function () {
            var _this = this;

            try {
                var _ret = function () {
                    var uri = getCurrentUrlFragments() || _this.context.req.route;
                    return {
                        v: _this.parent.routeRules[_this.routeOrigin].filter(function (rule) {
                            return rule.indexOf(uri) >= 0;
                        }).length > 0
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            } catch (e) {
                return false;
            }
        };

        view.setParent = function (tag) {
            view.parent = tag;
            return view;
        };

        view = Object.assign(tag, view);
        return view;
    },

    /**
     * configure the route in current tag,
     * expected to config after the tag is mounted.
     *
     * <tag1></tag1>
     * <tag2></tag2>
     * @RouteConfig([
     *     {path:'/posts', name: 'tag1', useAsDefault: true},
     *     {path:'/user/register', name: 'tag2'},
     * ])
     */

    routeConfig: function routeConfig(opts, configs) {
        var tag = this;
        if (typeof configs === 'undefined') {
            configs = opts;
            opts = undefined;
        }
        if (!Array.isArray(configs)) {
            if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) != 'object') {
                configs = [configs];
            } else {
                throw new Error('\n                    route\'s configs expected to be a array or a object\n                ');
            }
        }

        var subRoute = _riot2.default.route.create();

        tag.routeRules = {};

        configs.forEach(configureSubRoute(subRoute, tag));

        _riot2.default.route.start(true);

        return subRoute;
    }
};

function configureSubRoute(route, tag) {
    return function (config) {

        var targetTagName = config.name;
        var targetTag = tag.tags[targetTagName];
        var body = config.body;
        targetTag.routeOrigin = config.path;

        if (body && (typeof body === 'undefined' ? 'undefined' : _typeof(body)) != 'object') {
            throw new Error('\n                body in routeConfig expected to be a object.\n            ');
        }

        var context = {};

        route(config.path, function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (!tag.routeRules[config.path]) {
                tag.routeRules[config.path] = [];
            }
            tag.routeRules[config.path].push(getCurrentUrlFragments());

            if (!spa.tags[config.name]) {
                !targetTag.isMounted && _riot2.default.mount(config.name);
                spa.tags[config.name] = targetTag;
            }

            context.req = {
                query: _riot2.default.route.query(),
                fragments: args && args.map(function (arg) {
                    return arg && arg.charAt(0) === '_' && arg.substr(1);
                }),
                route: config.path + args.join('/')
            };

            body && (context.req.body = body);

            if (targetTag.hidden) {
                doRoute({ context: context, tag: tag, targetTag: targetTag, targetTagName: targetTagName });
            }
        });

        if (config.useAsDefault) {
            try {
                context.req = config.useAsDefault;
                context.req.route = config.path;
                if (!tag.routeRules[config.path]) {
                    tag.routeRules[config.path] = [];
                }
                tag.routeRules[config.path].push(getCurrentUrlFragments() || config.path);

                doRoute({ context: context, tag: tag, targetTag: targetTag, targetTagName: targetTagName });
            } catch (e) {
                console.error(e);
                throw new Error('parse uri failed.');
            }
        }
    };
}

function doRoute(_ref) {
    var context = _ref.context;
    var tag = _ref.tag;
    var targetTag = _ref.targetTag;
    var targetTagName = _ref.targetTagName;


    targetTag.isViewified || (targetTag = spa.addons.viewify(targetTag));
    targetTag.context = context;
    targetTag.off('ready').on('ready', readyHandler).open();

    function readyHandler() {
        Object.keys(tag.tags).forEach(function (key) {

            var subTag = tag.tags[key];
            subTag.isViewified || (subTag = spa.addons.viewify(subTag));

            if (key != targetTagName) {
                if (subTag.hasOwnProperty('hidden') && !subTag.hidden) {
                    subTag.update({ hidden: true });
                    subTag.leave(subTag, targetTag);
                }
            } else {
                subTag.update({ hidden: false });
            }
        });

        targetTag.off('ready', readyHandler);
    }
}

function getCurrentUrlFragments() {
    var fragments = window.location.hash.substr(1).split('/').slice(1);
    if (fragments.length) {
        return fragments.map(function (fragment) {
            if (fragment.split('?')[1]) {
                return '/' + fragment.split('?')[0];
            }
            return '/' + fragment;
        }).join('');
    }
    return false;
}

spa.init = function (opts) {};