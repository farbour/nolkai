"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrandMetrics = exports.defaultBrand = exports.brands = void 0;
// List of all brands
exports.brands = [
    'Alex Bottle',
    'Arctic Tumblers',
    'Corretto',
    'Ergonofis',
    'Freakmount',
    'Go Green',
    'Gravity',
    'Homesick',
    'Kana',
    'Loctote',
    'Love Your Melon',
    'MiHIGH',
    'Opposite Wall',
    'Proper Pour',
    'Qalo',
    'Rachel',
    'Revant',
    'Rose Boreal',
    'Wolf & Grizzly'
];
// Default selected brand
exports.defaultBrand = 'Alex Bottle';
var getBrandMetrics = function (data, brand) {
    var brandData = data.filter(function (item) { return item.Brand === brand; });
    var percentageMetrics = brandData
        .filter(function (item) { return item['KPI Unit'] === '%'; })
        .map(function (item) { return ({
        name: item['KPI Name'],
        value: item['This Period Value'],
    }); });
    var currencyMetrics = brandData
        .filter(function (item) { return item['KPI Unit'] === '$'; })
        .map(function (item) { return ({
        name: item['KPI Name'],
        value: item['This Period Value'],
    }); });
    var numberMetrics = brandData
        .filter(function (item) { return item['KPI Unit'] === 'Number'; })
        .map(function (item) { return ({
        name: item['KPI Name'],
        value: item['This Period Value'],
    }); });
    return {
        percentageMetrics: percentageMetrics,
        currencyMetrics: currencyMetrics,
        numberMetrics: numberMetrics,
    };
};
exports.getBrandMetrics = getBrandMetrics;
