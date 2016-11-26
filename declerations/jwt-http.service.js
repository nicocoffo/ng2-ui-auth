"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/switchMap');
var config_service_1 = require('./config.service');
var shared_service_1 = require('./shared.service');
var JwtHttp = (function (_super) {
    __extends(JwtHttp, _super);
    function JwtHttp(_backend, _defaultOptions, _shared, _config) {
        _super.call(this, _backend, _defaultOptions);
        this._shared = _shared;
        this._config = _config;
    }
    JwtHttp.prototype.request = function (url, options) {
        var _this = this;
        if (this._shared.getToken() && !this._shared.getExpirationDate() && ((options && options.autoRefreshToken) ||
            ((!options || typeof options.autoRefreshToken === 'undefined') &&
                this._config && this._config.autoRefreshToken))) {
            return this.refreshToken()
                .switchMap(function () { return _this.actualRequest(url, options); });
        }
        return this.actualRequest(url, options);
    };
    JwtHttp.prototype.get = function (url, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Get;
        return this.request(url, options);
    };
    JwtHttp.prototype.post = function (url, body, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Post;
        options.body = body;
        return this.request(url, options);
    };
    JwtHttp.prototype.put = function (url, body, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Put;
        options.body = body;
        return this.request(url, options);
    };
    JwtHttp.prototype.delete = function (url, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Delete;
        return this.request(url, options);
    };
    JwtHttp.prototype.patch = function (url, body, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Patch;
        options.body = body;
        return this.request(url, options);
    };
    JwtHttp.prototype.head = function (url, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Head;
        return this.request(url, options);
    };
    JwtHttp.prototype.refreshToken = function () {
        var _this = this;
        var authHeader = new http_1.Headers();
        authHeader.append(this._config.authHeader, (this._config.authToken + ' ' + this._shared.getToken()));
        return _super.prototype
            .get.call(this, this._config.refreshUrl, {
            headers: authHeader
        })
            .do(function (res) { return _this._shared.setToken(res); });
    };
    JwtHttp.prototype.actualRequest = function (url, options) {
        if (url instanceof http_1.Request) {
            url.headers = url.headers || new http_1.Headers();
            this.setHeaders(url);
        }
        else {
            options = options || {};
            this.setHeaders(options);
        }
        return _super.prototype.request.call(this, url, options);
    };
    JwtHttp.prototype.setHeaders = function (obj) {
        var _this = this;
        obj.headers = obj.headers || new http_1.Headers();
        if (this._config.defaultHeaders) {
            Object.keys(this._config.defaultHeaders).forEach(function (defaultHeader) {
                if (!obj.headers.has(defaultHeader)) {
                    obj.headers.set(defaultHeader, _this._config.defaultHeaders[defaultHeader]);
                }
            });
        }
        if (this._shared.isAuthenticated()) {
            obj.headers.set(this._config.authHeader, this._config.authToken + ' ' + this._shared.getToken());
        }
    };
    JwtHttp = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.ConnectionBackend, http_1.RequestOptions, shared_service_1.SharedService, config_service_1.ConfigService])
    ], JwtHttp);
    return JwtHttp;
}(http_1.Http));
exports.JwtHttp = JwtHttp;
//# sourceMappingURL=jwt-http.service.js.map