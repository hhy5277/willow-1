/*
Copyright (c) 2010 Jason Wyatt Feinstein

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
if(typeof window.willowConfig === "undefined"){
    window.willowConfig = {
        enabled: true,
        overwriteConsole: true
    };
}
(function willow(){
    if(typeof window.console === "undefined"){
        window.willow = {
            log: function(){},
            warn: function(){},
            error: function(){},
            enter: function(){},
            exit: function(){},
            autoTrace: function(){}
        };
        return;
    } 
    
    /* Rename/copy the log/error/warning functions. so we can overwrite them 
     * later, if need be.
     */
    window.console.willow_log = console.log;
    window.console.willow_error = console.error;
    window.console.willow_warn = console.warn;
    
    /* Meta function determination stuff.
     */
    var meta_fns = ["willow_enter","willow_exit"].join("??");
    function memberOfMetaFns(name){
        return meta_fns.indexOf(name) > -1;
    }
    
    /* Common worker function, to get the args, function name, and function args.
     */
    function getInfo(){
        var fn_name = arguments.callee.caller.caller.name;
        var args = Array.prototype.slice.call(arguments.callee.caller.arguments);
        var fn_args = Array.prototype.slice.call(arguments.callee.caller.caller.arguments);
        
        // if calling function was a meta logging function from willow, look deeper for the real function name and arguments.
        if(memberOfMetaFns(fn_name)){
            fn_name = arguments.callee.caller.caller.caller.name;
            fn_args = Array.prototype.slice.call(arguments.callee.caller.caller.caller.arguments);
        }
        return [fn_name, fn_args, args];
    }
    
    var buildTemplateArray = function buildTemplateArray(info){
        return [info[0], "("].concat(info[1]).concat(["):"]).concat(info[2]);
    }
    
    window.willow = {
        log: function willow_log(){
            if(willowConfig.enabled !== true){
                return;
            }
            var info = getInfo();
            console.willow_log.apply(null, buildTemplateArray(info));
        },
        error: function willow_error(){
            if(willowConfig.enabled !== true){
                return;
            }
            var info = getInfo();
            console.willow_error.apply(null, buildTemplateArray(info));
        },
        warn: function willow_warn(){
            if(willowConfig.enabled !== true){
                return;
            }
            var info = getInfo();
            console.willow_warn.apply(null, buildTemplateArray(info));
        },
        enter: function willow_enter(){
            window.willow.log("Entered.");
        },
        exit: function willow_exit(){
            window.willow.log("Exited.");
        },
        autoTrace: function autoTrace(object){
            // not done yet.
        }
    };
    
    if(willowConfig.overwriteConsole === true) {
        console.log = window.willow.log;
        console.error = window.willow.error;
        console.warn = window.willow.warn;
    }
})();
