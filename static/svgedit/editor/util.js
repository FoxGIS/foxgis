var url = window.location.href;
var extensions = parseURL(url).params.extensions;
var options = parseURL(url).params.options;
if(options){
    var optionsStr = decodeURI(options);
    var options = JSON.parse(optionsStr);
    options.bbox = options.bbox.replace("[","").replace("]","").split(",");
    for(var i=0;i<options.bbox.length;i++){
        options.bbox[i]=parseFloat(options.bbox[i]);
    }
    window.OPTIONS=options;
}
function parseURL(url) {  
    var a =  document.createElement('a');  
    a.href = url;  
    return {  
        source: url,  
        protocol: a.protocol.replace(':',''),  
        host: a.hostname,  
        port: a.port,  
        query: a.search,  
        params: (function(){  
            var ret = {},  
            seg = a.search.replace(/^\?/,'').split('&'),  
            len = seg.length, i = 0, s;  
            for (;i<len;i++) {  
                if (!seg[i]) { continue; }  
                s = seg[i].split('=');  
                ret[s[0]] = s[1];  
            }  
            return ret;  
        })(),  
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],  
        hash: a.hash.replace('#',''),  
        path: a.pathname.replace(/^([^\/])/,'/$1'),  
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],  
        segments: a.pathname.replace(/^\//,'').split('/')  
    };  
} 