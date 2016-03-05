import riot from 'riot';

export var spa = {version: 0.1};

Object.assign(spa, riot.observable());

spa = {

    tags: {},

    viewify: {
        hidden: true
    }
};

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
function routeConfig(opts, configs){
    var tag = this;
    if(typeof configs === 'undefined'){
        configs = opts;
        opts = undefined;
    }
    if(!Array.isArray(configs)){
        if(typeof config != 'object'){
            configs = [configs];
        }else{
            throw new Error(`
                route's configs expected to be a array or a object
            `)
        }
    }

    var subRoute = riot.route.create();

    tag.routeRules = {};

    configs.forEach(_configureSubRoute(subRoute, tag));

    riot.route.start(true);

    return subRoute;
}

/**
 * dynamic viewify
 * @param tag
 */
function viewify(tag){

    if(!tag){
        throw new Error('viewify expected to be a tag');
    }
    var view = {
        context:     null,
        hidden :     true,
        isViewified: true,
        prev:      null
    };

    view.open = () =>{
        view.trigger('open');
        return view;
    };

    view.leave = (from, to) =>{
        view.trigger('leave', to);
        return view;
    };

    /**
     * check current view is presenting or not
     * @returns {boolean}
     */
    view.shouldNav = function(){
        try{
            let uri = getCurrentUrlFragments() || this.context.req.route;
            return this.parent.routeRules[this.routeOrigin].filter(
                    rule=>rule.indexOf(uri)>=0
                ).length >0;
        }catch (e){
            return false;
        }
    };

    view.setParent = (tag) =>{
        view.parent = tag;
        return view;
    };

    view = Object.assign(tag, view);
    return view;
}


function _configureSubRoute(route, tag){
    return (config)=>{

        const targetTagName = config.name;
        let targetTag = tag.tags[targetTagName];
        let body = config.body;
        targetTag.routeOrigin = config.path;

        if(body && typeof body != 'object'){
            throw new Error(`
                body in routeConfig expected to be a object.
            `)
        }

        var context = {};

        route(config.path, (...args)=>{

            if(!tag.routeRules[config.path]){
                tag.routeRules[config.path] = [];
            }
            tag.routeRules[config.path].push(getCurrentUrlFragments());

            if(!spa.tags[config.name]){
                !targetTag.isMounted && riot.mount(config.name);
                spa.tags[config.name] = targetTag;
            }

            context.req = {
                query: riot.route.query(),
                fragments: args && args.map(arg=>arg && (arg.charAt(0) === '_') && arg.substr(1)),
                route: config.path + args.join('/')
            };

            body && (context.req.body = body);

            if(targetTag.hidden){
                _doRoute({context, tag, targetTag, targetTagName});
            }
        });

        if(config.useAsDefault){
            try{
                context.req = config.useAsDefault;
                context.req.route = config.path;
                if(!tag.routeRules[config.path]){
                    tag.routeRules[config.path] = [];
                }
                tag.routeRules[config.path].push(getCurrentUrlFragments() || config.path);

                _doRoute({context, tag, targetTag, targetTagName});
            }catch(e){
                console.error(e);
                throw new Error('parse uri failed.');
            }
        }
    };
}

function _doRoute({context, tag, targetTag, targetTagName}){

    targetTag.isViewified || (targetTag = viewify(targetTag));
    targetTag.context = context;
    targetTag.off('ready').on('ready', readyHandler).open();

    function readyHandler(){
        Object.keys(tag.tags).forEach(key=>{

            let subTag = tag.tags[key];
            subTag.isViewified || (subTag = viewify(subTag));

            if(key != targetTagName) {
                if(subTag.hasOwnProperty('hidden') && !subTag.hidden){
                    subTag.update({hidden: true});
                    subTag.leave(subTag, targetTag);
                }
            }else{
                subTag.update({hidden: false});
            }
        });

        targetTag.off('ready', readyHandler);
    }
}

function getCurrentUrlFragments(){
    const fragments = window.location.hash.substr(1).split('/').slice(1);
    if(fragments.length){
        return fragments.map(fragment=>{
            if(fragment.split('?')[1]){
                return '/' + fragment.split('?')[0];
            }
            return '/' + fragment;
        }).join('')
    }
    return false;
}

spa.addons = {
    routeConfig
};

spa.init = function(opts){

};



