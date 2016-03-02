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

spa.tags = {};

spa.viewify = {
    hidden: true,
    isViewified: true
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
        tag.hidden = true;
        tag.isViewified = true;
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

        configs.forEach(configSubRoute(subRoute, tag));

        _riot2.default.route.start(true);

        return subRoute;
    }
};

function configSubRoute(route, tag) {
    return function (config) {

        var targetTagName = config.name;
        var targetTag = tag.tags[targetTagName];
        var body = config.body;

        if (body && (typeof body === 'undefined' ? 'undefined' : _typeof(body)) != 'object') {
            throw new Error('\n                body in routeConfig expected to be a object.\n            ');
        }

        route(config.path, function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (!spa.tags[config.name]) {
                !targetTag.isMounted && _riot2.default.mount(config.name);
                spa.tags[config.name] = targetTag;
            }

            var req = {
                query: _riot2.default.route.query(),
                args: args && args.map(function (arg) {
                    return arg && arg.charAt(0) === '_' && arg.substr(1);
                })
            };
            body && (req.body = body);

            if (targetTag.hidden) {
                bindReadyAndOpen({ req: req, tag: tag, targetTag: targetTag, targetTagName: targetTagName });
            }
        });

        if (config.useAsDefault) {
            try {
                var req = config.useAsDefault;
                bindReadyAndOpen({ req: req, tag: tag, targetTag: targetTag, targetTagName: targetTagName });
            } catch (e) {
                console.error(e);
                throw new Error('parse uri failed.');
            }
        }
    };
}

function bindReadyAndOpen(_ref) {
    var req = _ref.req;
    var tag = _ref.tag;
    var targetTag = _ref.targetTag;
    var targetTagName = _ref.targetTagName;


    targetTag.off('ready').on('ready', readyHandler);
    targetTag.trigger('open', { req: req });

    function readyHandler() {
        Object.keys(tag.tags).forEach(function (key) {

            var subTag = tag.tags[key];
            subTag.isViewified || spa.addons.viewify(subTag);

            if (key != targetTagName) {
                subTag.update({ hidden: true });
                subTag.trigger('leave');
            } else {
                subTag.update({ hidden: false });
            }
        });

        targetTag.off('ready', readyHandler);
    }
}

spa.init = function (opts) {};