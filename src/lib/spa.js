import riot from 'riot';

export var spa = {version: 0.1};

Object.assign(spa, riot.observable());

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
    viewify: (tag) => {
        if(!tag){
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

    routeConfig(opts, configs){
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

        configs.forEach(configureSubRoute(subRoute, tag));

        riot.route.start(true);

        return subRoute;
    }
};

function configureSubRoute(route, tag){
    return (config)=>{

        const targetTagName = config.name;
        let targetTag = tag.tags[targetTagName];
        let body = config.body;

        if(body && typeof body != 'object'){
            throw new Error(`
                body in routeConfig expected to be a object.
            `)
        }

        route(config.path, (...args)=>{

            if(!spa.tags[config.name]){
                !targetTag.isMounted && riot.mount(config.name);
                spa.tags[config.name] = targetTag;
            }

            let req = {
                query: riot.route.query(),
                args: args && args.map(arg=>arg && (arg.charAt(0) === '_') && arg.substr(1))
            };
            body && (req.body = body);

            if(targetTag.hidden){
                bindReadyAndOpen({req, tag, targetTag, targetTagName});
            }
        });

        if(config.useAsDefault){
            try{
                let req = config.useAsDefault;
                bindReadyAndOpen({req, tag, targetTag, targetTagName});
            }catch(e){
                console.error(e);
                throw new Error('parse uri failed.');
            }
        }
    };
}

function bindReadyAndOpen({req, tag, targetTag, targetTagName}){

    targetTag.off('ready').on('ready', readyHandler);
    targetTag.trigger('open', {req});

    function readyHandler(){
        Object.keys(tag.tags).forEach(key=>{

            let subTag = tag.tags[key];
            subTag.isViewified || spa.addons.viewify(subTag);

            if(key != targetTagName) {
                subTag.update({hidden: true});
                subTag.trigger('leave');
            }else{
                subTag.update({hidden: false});
            }
        });

        targetTag.off('ready', readyHandler);
    }
}

spa.init = function(opts){

};



