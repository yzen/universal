/*!
GPII Renderer Server

Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function () {

    "use strict";

    var fluid = require("infusion"),
        path = require("path"),
        gpii = fluid.registerNamespace("gpii");

    fluid.require("../../gpii/node_modules/gpiiFramework/framework.js", require);
    fluid.require("./rendererGet.js", require);
    
    fluid.defaults("gpii.rendererServer", {
        gradeNames: ["gpii.app", "autoInit"],
        handlers: {
            rendererGet: {
                route: "/",
                type: "get"
            }
        },
        templates: {
            rendererGet: "file://%root/renderer/renderer.html"
        },
        events: {
            onMiddleware: "{gpii.server}.events.onMiddleware"
        },
        components: {
            rawTemplateSource: {
                type: "gpii.dataSource",
                options: {
                    url: "{gpii.rendererServer}.options.templates.rendererGet",
                    writable: false
                }
            },
            templateSource: {
                type: "gpii.callbackWrappingDataSource"
            },
            staticInfusion: {
                type: "gpii.middleware",
                createOnEvent: "onMiddleware",
                options: {
                    staticPath: "%root/../node_modules/infusion",
                    path: "/infusion"
                }
            },
            staticSrc: {
                type: "gpii.middleware",
                createOnEvent: "onMiddleware",
                options: {
                    staticPath: "%root/renderer/src",
                    path: "/src"
                }
            }
        },
        root: path.join(__dirname, "..")
    });

    fluid.defaults("gpii.rendererServer.handler", {
        gradeNames: ["gpii.requests.request.handler", "gpii.renderer", "gpii.renderer.injector", "autoInit"],
        selectors: {
            "my-paragraph": ".my-paragraph"
        },
        protoTree: {
            "my-paragraph": "TEST"
        },
        invokers: {
            handle: {
                funcName: "gpii.requests.request.handler.rendererGet",
                args: ["{requestProxy}", "{that}", "{rendererServer}.templateSource"]
            }
        }
    });

    fluid.defaults("gpii.middleware.staticInfusion", {
        gradeNames: ["autoInit", "gpii.middleware.static"]
    });
    fluid.defaults("gpii.middleware.staticSrc", {
        gradeNames: ["autoInit", "gpii.middleware.static"]
    });

    gpii.config.makeConfigLoader({
        nodeEnv: gpii.config.getNodeEnv("rendererServer"),
        configPath: "./examples/renderer"
    });
    
})();