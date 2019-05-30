"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CochlearaiSenseClient_pb_1 = require("../client/CochlearaiSenseClient_pb");
var CochlearaiSenseClient_grpc_pb_1 = require("../client/CochlearaiSenseClient_grpc_pb");
var grpc_1 = require("grpc");
var CochlearSense = (function () {
    function CochlearSense(apiKey, host) {
        if (host === void 0) { host = "35.229.175.68:50051"; }
        this.grpcClient = new CochlearaiSenseClient_grpc_pb_1.CochlearaiSenseClient(host, grpc_1.credentials.createInsecure());
        this.apiKey = apiKey;
    }
    CochlearSense.prototype.music = function (buffer, extension, callback) {
        this.sendData(buffer, extension, "music", callback);
    };
    CochlearSense.prototype.event = function (buffer, extension, callback) {
        this.sendData(buffer, extension, "event", callback);
    };
    CochlearSense.prototype.speech = function (buffer, extension, callback) {
        this.sendData(buffer, extension, "speech", callback);
    };
    CochlearSense.prototype.sendData = function (buffer, extension, task, callback) {
        var e_1, _a;
        var timeOutMetadata = this.getTimeOut();
        var call = this.grpcClient.cochlearai(timeOutMetadata, function (error, response) {
            if (error) {
                callback(error, undefined);
            }
            else {
                callback(error, response.getOutputs());
            }
        });
        var requestsIterator = this.createRequestIterator(buffer, extension, task);
        try {
            for (var requestsIterator_1 = __values(requestsIterator), requestsIterator_1_1 = requestsIterator_1.next(); !requestsIterator_1_1.done; requestsIterator_1_1 = requestsIterator_1.next()) {
                var request = requestsIterator_1_1.value;
                call.write(request);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (requestsIterator_1_1 && !requestsIterator_1_1.done && (_a = requestsIterator_1.return)) _a.call(requestsIterator_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        call.end();
    };
    CochlearSense.prototype.getTimeOut = function () {
        var metadata = new grpc_1.Metadata();
        var timeout = new Date().setSeconds(new Date().getSeconds() + CochlearSense.TIMEOUT);
        metadata.set('deadline', timeout.toString());
        return metadata;
    };
    CochlearSense.prototype.createRequestIterator = function (buffer, extension, task) {
        var n, i, slice, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    n = CochlearSense.CHUNK_SIZE;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < buffer.length / n)) return [3, 4];
                    slice = buffer.slice(i * n, (i + 1) * n);
                    request = new CochlearaiSenseClient_pb_1.Request();
                    request.setApikey(this.apiKey);
                    request.setData(slice);
                    request.setFormat(extension);
                    request.setTask(task);
                    return [4, request];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    };
    CochlearSense.CHUNK_SIZE = 1024 * 1024;
    CochlearSense.TIMEOUT = 10;
    return CochlearSense;
}());
exports.CochlearSense = CochlearSense;
