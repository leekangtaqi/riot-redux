'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.del = exports.put = exports.post = exports.get = undefined;

require('fetch');

function post(url, json) {
    return fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }).then(function (res) {
        return checkStatus(res);
    }).then(function (res) {
        return parseJSON(res);
    });
}

function get(url) {
    return fetch(url, { method: 'get' }).then(function (res) {
        return checkStatus(res);
    }).then(function (res) {
        return parseJSON(res);
    });
}

function put(url, json) {
    return fetch(url, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }).then(function (res) {
        return checkStatus(res);
    }).then(function (res) {
        return parseJSON(res);
    });
}

function del(url) {
    return fetch(url, { method: 'delete' }).then(function (res) {
        return checkStatus(res);
    }).then(function (res) {
        return parseJSON(res);
    });
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

function parseJSON(response) {
    try {
        response.json();
    } catch (e) {
        var error = new Error('parse json error');
        error.response = response;
        throw error;
    }
}

exports.get = get;
exports.post = post;
exports.put = put;
exports.del = del;