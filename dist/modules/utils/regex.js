"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexEmail = exports.regexIban = exports.regexPhoneNumber = void 0;
exports.regexPhoneNumber = new RegExp("[0-9]{10}");
exports.regexIban = /^(?:(?:IT|SM)\d{2}[A-Za-z]\d{22}|CY\d{2}[A-Za-z]\d{23}|NL\d{2}[A-Za-z]{4}\d{10}|LV\d{2}[A-Za-z]{4}\d{13}|(?:BG|BH|GB|IE)\d{2}[A-Za-z]{4}\d{14}|GId{2}[A-Za-z]{4}\d{15}|RO\d{2}[A-Za-z]{4}\d{16}|KW\d{2}[A-Za-z]{4}\d{22}|MT\d{2}[A-Za-z]{4}\d{23}|NO\d{13}|(?:DK|FI|GL|FO)\d{16}|MK\d{17}|(?:AT|EE|KZ|LU|XK)\d{18}|(?:BA|HR|LI|CH|CR)\d{19}|(?:GE|DE|LT|ME|RS)\d{20}|IL\d{21}|(?:AD|CZ|ES|MD|SA)\d{22}|PT\d{23}|(?:BE|IS)\d{24}|(?:FR|MR|MC)\d{25}|(?:AL|DO|LB|PL)\d{26}|(?:AZ|HU)\d{27}|(?:GR|MU)\d{28})$/gim;
exports.regexEmail = new RegExp("[a-z0-9.]+@[a-z]+.[a-z]{2,3}");
