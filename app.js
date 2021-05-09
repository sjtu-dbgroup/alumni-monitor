var app = new Vue({
    el: '#app',
    data: function () {
        let environments = [{
                name: 'dev',
                services: [{
                        name: 'api',
                        versionUrl: 'http://10.119.7.181:1005/version/',
                        url: 'http://10.119.7.181:1005/',
                    },
                    {
                        name: 'admin',
                        versionUrl: 'http://10.119.7.181:1000/version.txt',
                        url: 'http://10.119.7.181:1000/',
                    },
                    {
                        name: 'service',
                        versionUrl: 'http://10.119.7.181:1004/version-service.txt',
                        url: 'http://10.119.7.181:1004/',
                    },
                    {
                        name: 'giving',
                        versionUrl: 'http://10.119.7.181:1003/version-giving.txt',
                        url: 'http://10.119.7.181:1003/',
                    },
                ],
            },
            {
                name: 'qa',
                services: [{
                        name: 'api',
                        versionUrl: 'http://10.119.7.181:1006/version/',
                        url: 'http://10.119.7.181:1006/',
                    },
                    {
                        name: 'admin',
                        versionUrl: 'http://10.119.7.181:1001/version.txt',
                        url: 'http://10.119.7.181:1001/',
                    },
                    {
                        name: 'service',
                        versionUrl: 'http://10.119.7.181:1008/version-service.txt',
                        url: 'http://10.119.7.181:1008/',
                    },
                    {
                        name: 'giving',
                        versionUrl: 'http://10.119.7.181:1007/version-giving.txt',
                        url: 'http://10.119.7.181:1007/',
                    },
                ],
            },
            {
                name: 'prod',
                services: [{
                        name: 'api',
                        versionUrl: 'http://10.119.7.186:1007/version/',
                        url: 'http://10.119.7.186:1007/',
                    },
                    {
                        name: 'admin',
                        versionUrl: 'http://10.119.7.186:1000/version.txt',
                        url: 'http://10.119.7.186:1000/',
                    },
                    {
                        name: 'service',
                        versionUrl: 'http://10.119.7.186:1002/version-service.txt',
                        url: 'http://10.119.7.186:1002/',
                    },
                    {
                        name: 'giving',
                        versionUrl: 'http://10.119.7.186:1001/version-giving.txt',
                        url: 'http://10.119.7.186:1001/',
                    },
                ],
            },
        ];

        let icons = {
            api: 'api',
            admin: 'web',
            service: 'web',
            giving: 'web',
        };
        for (var i = 0; i < environments.length; i++) {
            let stage = environments[i];
            for (var j = 0; j < stage.services.length; j++) {
                let service = stage.services[j];
                service.version = null;
                service.versionError = null;
                service.icon = icons[service.name];
            }
        }

        return {
            environments,
        }
    },
    mounted: function () {},
    methods: {
        refresh() {
            for (var i = 0; i < this.environments.length; i++) {
                let stage = this.environments[i];
                for (var j = 0; j < stage.services.length; j++) {
                    let service = stage.services[j];
                    service.version = null;
                    service.versionError = null;
                }
            }

            for (var i = 0; i < this.environments.length; i++) {
                let stage = this.environments[i];
                for (var j = 0; j < stage.services.length; j++) {
                    let service = stage.services[j];
                    this.fetchWithTimeout(service.versionUrl, {
                            timeout: 15000
                        })
                        .then((response) => response.text())
                        .then(_ => {
                            service.version = _;
                        })
                        .catch(err => {
                            service.version = err.message;
                            service.versionError = err;
                        });

                }
            }

        },
        fetchWithTimeout(resource, options) {
            const {
                timeout = 8000
            } = options;
            console.log(options)

            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);

            const response = fetch(resource, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);

            return response;
        },
    },
    computed: {},
})