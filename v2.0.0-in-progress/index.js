"use strict";

import APPLICATION from "./js/Application.js";
import LOGGER_FACTORY from "./js/logger/LoggerFactory.js";

const GLOBAL_CONTEXT = self;
const LOGGER = LOGGER_FACTORY.getLogger();

document.addEventListener("DOMContentLoaded", () => {
    LOGGER.info("Event: DOMContentLoaded");
    registerServiceWorker();

    APPLICATION.start();

    //LOGGER.info("Application started with cache-version: " + CACHE_VERSION);

    GLOBAL_CONTEXT.navigator.serviceWorker.ready.then(() => {
        LOGGER.info("------ 2" + navigator.serviceWorker.controller);
        LOGGER.info("Controller initialized successfully");
        //GLOBAL_CONTEXT.navigator.serviceWorker.controller.postMessage({'cache-version': CACHE_VERSION});
    });
});

function registerServiceWorker() {
    GLOBAL_CONTEXT.navigator.serviceWorker
        .register('./file-cache-service-worker.js', {scope: '.'})
        .then((registration) => {
            LOGGER.info('ServiceWorker registration successful with scope: ' + registration.scope);
        })
        .then(() => {
            GLOBAL_CONTEXT.navigator.serviceWorker.ready.then((worker) => {
                LOGGER.info("------ 5" + navigator.serviceWorker.controller);
                LOGGER.info("ServiceWorker event: ready");
                return worker.sync.register('syncdata');
            });
        })
        .catch((error) => {
            LOGGER.info('ServiceWorker event: registration failed: ' + error);
        });
    GLOBAL_CONTEXT.navigator.serviceWorker.ready
        .then(() => {
            // I thought the page would be controlled at this point, thanks to clients.claim()
            LOGGER.info('.ready resolved, and navigator.serviceWorker.controller is' + navigator.serviceWorker.controller);

            LOGGER.info("------ 3" + navigator.serviceWorker.controller);
            LOGGER.info("Controller initialized successfully");
            //GLOBAL_CONTEXT.navigator.serviceWorker.controller.postMessage({'cache-version': CACHE_VERSION});

            GLOBAL_CONTEXT.navigator.serviceWorker.addEventListener('controllerchange', () => {
                //LOGGER.info('Okay, now things are under control. navigator.serviceWorker.controller is', navigator.serviceWorker.controller);\LOGGER.info("------ 3");
                LOGGER.info("------ 4" + navigator.serviceWorker.controller);
                //GLOBAL_CONTEXT.navigator.serviceWorker.controller.postMessage({'cache-version': CACHE_VERSION});
            });
        });
}