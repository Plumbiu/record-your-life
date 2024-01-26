"use strict";
const fsp = require("node:fs/promises");
const path = require("node:path");
const require$$0 = require("electron");
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var main = { exports: {} };
var attachTitlebarToWindow = { exports: {} };
function commonjsRequire(path2) {
  throw new Error('Could not dynamically require "' + path2 + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var consts = { exports: {} };
var color = { exports: {} };
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Color = exports.HSVA = exports.HSLA = exports.RGBA = void 0;
  function roundFloat(number, decimalPoints) {
    const decimal = Math.pow(10, decimalPoints);
    return Math.round(number * decimal) / decimal;
  }
  class RGBA {
    constructor(r, g, b, a = 1) {
      this.r = Math.min(255, Math.max(0, r)) | 0;
      this.g = Math.min(255, Math.max(0, g)) | 0;
      this.b = Math.min(255, Math.max(0, b)) | 0;
      this.a = _get__("roundFloat")(Math.max(Math.min(1, a), 0), 3);
    }
    static equals(a, b) {
      return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
    }
  }
  exports.RGBA = _get__("RGBA");
  class HSLA {
    constructor(h, s, l, a) {
      this.h = Math.max(Math.min(360, h), 0) | 0;
      this.s = _get__("roundFloat")(Math.max(Math.min(1, s), 0), 3);
      this.l = _get__("roundFloat")(Math.max(Math.min(1, l), 0), 3);
      this.a = _get__("roundFloat")(Math.max(Math.min(1, a), 0), 3);
    }
    static equals(a, b) {
      return a.h === b.h && a.s === b.s && a.l === b.l && a.a === b.a;
    }
    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h in the set [0, 360], s, and l in the set [0, 1].
     */
    static fromRGBA(rgba) {
      const r = rgba.r / 255;
      const g = rgba.g / 255;
      const b = rgba.b / 255;
      const a = rgba.a;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (min + max) / 2;
      const chroma = max - min;
      if (chroma > 0) {
        s = Math.min(l <= 0.5 ? chroma / (2 * l) : chroma / (2 - 2 * l), 1);
        switch (max) {
          case r:
            h = (g - b) / chroma + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / chroma + 2;
            break;
          case b:
            h = (r - g) / chroma + 4;
            break;
        }
        h *= 60;
        h = Math.round(h);
      }
      return new (_get__("HSLA"))(h, s, l, a);
    }
    static _hue2rgb(p, q, t) {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    }
    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h in the set [0, 360] s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     */
    static toRGBA(hsla) {
      const h = hsla.h / 360;
      const {
        s,
        l,
        a
      } = hsla;
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = _get__("HSLA")._hue2rgb(p, q, h + 1 / 3);
        g = _get__("HSLA")._hue2rgb(p, q, h);
        b = _get__("HSLA")._hue2rgb(p, q, h - 1 / 3);
      }
      return new (_get__("RGBA"))(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a);
    }
  }
  exports.HSLA = _get__("HSLA");
  class HSVA {
    constructor(h, s, v, a) {
      this.h = Math.max(Math.min(360, h), 0) | 0;
      this.s = _get__("roundFloat")(Math.max(Math.min(1, s), 0), 3);
      this.v = _get__("roundFloat")(Math.max(Math.min(1, v), 0), 3);
      this.a = _get__("roundFloat")(Math.max(Math.min(1, a), 0), 3);
    }
    static equals(a, b) {
      return a.h === b.h && a.s === b.s && a.v === b.v && a.a === b.a;
    }
    // from http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
    static fromRGBA(rgba) {
      const r = rgba.r / 255;
      const g = rgba.g / 255;
      const b = rgba.b / 255;
      const cmax = Math.max(r, g, b);
      const cmin = Math.min(r, g, b);
      const delta = cmax - cmin;
      const s = cmax === 0 ? 0 : delta / cmax;
      let m;
      if (delta === 0) {
        m = 0;
      } else if (cmax === r) {
        m = ((g - b) / delta % 6 + 6) % 6;
      } else if (cmax === g) {
        m = (b - r) / delta + 2;
      } else {
        m = (r - g) / delta + 4;
      }
      return new (_get__("HSVA"))(Math.round(m * 60), s, cmax, rgba.a);
    }
    // from http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
    static toRGBA(hsva) {
      const {
        h,
        s,
        v,
        a
      } = hsva;
      const c = v * s;
      const x = c * (1 - Math.abs(h / 60 % 2 - 1));
      const m = v - c;
      let [r, g, b] = [0, 0, 0];
      if (h < 60) {
        r = c;
        g = x;
      } else if (h < 120) {
        r = x;
        g = c;
      } else if (h < 180) {
        g = c;
        b = x;
      } else if (h < 240) {
        g = x;
        b = c;
      } else if (h < 300) {
        r = x;
        b = c;
      } else if (h < 360) {
        r = c;
        b = x;
      }
      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);
      return new (_get__("RGBA"))(r, g, b, a);
    }
  }
  exports.HSVA = _get__("HSVA");
  class Color {
    static fromHex(hex) {
      return _get__("Color").Format.CSS.parseHex(hex) || _get__("Color").RED;
    }
    get hsla() {
      if (this._hsla) {
        return this._hsla;
      } else {
        return _get__("HSLA").fromRGBA(this.rgba);
      }
    }
    get hsva() {
      if (this._hsva) {
        return this._hsva;
      }
      return _get__("HSVA").fromRGBA(this.rgba);
    }
    constructor(arg) {
      if (!arg) {
        throw new Error("Color needs a value");
      } else if (arg instanceof _get__("RGBA")) {
        this.rgba = arg;
      } else if (arg instanceof _get__("HSLA")) {
        this._hsla = arg;
        this.rgba = _get__("HSLA").toRGBA(arg);
      } else if (arg instanceof _get__("HSVA")) {
        this._hsva = arg;
        this.rgba = _get__("HSVA").toRGBA(arg);
      } else {
        throw new Error("Invalid color ctor argument");
      }
    }
    equals(other) {
      return !!other && _get__("RGBA").equals(this.rgba, other.rgba) && _get__("HSLA").equals(this.hsla, other.hsla) && _get__("HSVA").equals(this.hsva, other.hsva);
    }
    /**
     * http://www.w3.org/TR/WCAG20/#relativeluminancedef
     * Returns the number in the set [0, 1]. O => Darkest Black. 1 => Lightest white.
     */
    getRelativeLuminance() {
      const R = _get__("Color")._relativeLuminanceForComponent(this.rgba.r);
      const G = _get__("Color")._relativeLuminanceForComponent(this.rgba.g);
      const B = _get__("Color")._relativeLuminanceForComponent(this.rgba.b);
      const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
      return _get__("roundFloat")(luminance, 4);
    }
    static _relativeLuminanceForComponent(color2) {
      const c = color2 / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
    /**
     * http://www.w3.org/TR/WCAG20/#contrast-ratiodef
     * Returns the contrast ration number in the set [1, 21].
     */
    getContrastRatio(another) {
      const lum1 = this.getRelativeLuminance();
      const lum2 = another.getRelativeLuminance();
      return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
    }
    /**
     *	http://24ways.org/2010/calculating-color-contrast
     *  Return 'true' if darker color otherwise 'false'
     */
    isDarker() {
      const yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1e3;
      return yiq < 128;
    }
    /**
     *	http://24ways.org/2010/calculating-color-contrast
     *  Return 'true' if lighter color otherwise 'false'
     */
    isLighter() {
      const yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1e3;
      return yiq >= 128;
    }
    isLighterThan(another) {
      const lum1 = this.getRelativeLuminance();
      const lum2 = another.getRelativeLuminance();
      return lum1 > lum2;
    }
    isDarkerThan(another) {
      const lum1 = this.getRelativeLuminance();
      const lum2 = another.getRelativeLuminance();
      return lum1 < lum2;
    }
    lighten(factor) {
      return new (_get__("Color"))(new (_get__("HSLA"))(this.hsla.h, this.hsla.s, this.hsla.l + this.hsla.l * factor, this.hsla.a));
    }
    darken(factor) {
      return new (_get__("Color"))(new (_get__("HSLA"))(this.hsla.h, this.hsla.s, this.hsla.l - this.hsla.l * factor, this.hsla.a));
    }
    transparent(factor) {
      const {
        r,
        g,
        b,
        a
      } = this.rgba;
      return new (_get__("Color"))(new (_get__("RGBA"))(r, g, b, a * factor));
    }
    isTransparent() {
      return this.rgba.a === 0;
    }
    isOpaque() {
      return this.rgba.a === 1;
    }
    opposite() {
      return new (_get__("Color"))(new (_get__("RGBA"))(255 - this.rgba.r, 255 - this.rgba.g, 255 - this.rgba.b, this.rgba.a));
    }
    blend(c) {
      const rgba = c.rgba;
      const thisA = this.rgba.a;
      const colorA = rgba.a;
      const a = thisA + colorA * (1 - thisA);
      if (a < 1e-6) {
        return _get__("Color").TRANSPARENT;
      }
      const r = this.rgba.r * thisA / a + rgba.r * colorA * (1 - thisA) / a;
      const g = this.rgba.g * thisA / a + rgba.g * colorA * (1 - thisA) / a;
      const b = this.rgba.b * thisA / a + rgba.b * colorA * (1 - thisA) / a;
      return new (_get__("Color"))(new (_get__("RGBA"))(r, g, b, a));
    }
    flatten(...backgrounds) {
      const background = backgrounds.reduceRight((accumulator, color2) => {
        return _get__("Color")._flatten(color2, accumulator);
      });
      return _get__("Color")._flatten(this, background);
    }
    static _flatten(foreground, background) {
      const backgroundAlpha = 1 - foreground.rgba.a;
      return new (_get__("Color"))(new (_get__("RGBA"))(backgroundAlpha * background.rgba.r + foreground.rgba.a * foreground.rgba.r, backgroundAlpha * background.rgba.g + foreground.rgba.a * foreground.rgba.g, backgroundAlpha * background.rgba.b + foreground.rgba.a * foreground.rgba.b));
    }
    toString() {
      return "" + _get__("Color").Format.CSS.format(this);
    }
    static getLighterColor(of, relative, factor) {
      if (of.isLighterThan(relative)) {
        return of;
      }
      factor = factor || 0.5;
      const lum1 = of.getRelativeLuminance();
      const lum2 = relative.getRelativeLuminance();
      factor = factor * (lum2 - lum1) / lum2;
      return of.lighten(factor);
    }
    static getDarkerColor(of, relative, factor) {
      if (of.isDarkerThan(relative)) {
        return of;
      }
      factor = factor || 0.5;
      const lum1 = of.getRelativeLuminance();
      const lum2 = relative.getRelativeLuminance();
      factor = factor * (lum1 - lum2) / lum1;
      return of.darken(factor);
    }
  }
  exports.Color = _get__("Color");
  _get__("Color").WHITE = new (_get__("Color"))(new (_get__("RGBA"))(255, 255, 255, 1));
  _get__("Color").BLACK = new (_get__("Color"))(new (_get__("RGBA"))(0, 0, 0, 1));
  _get__("Color").RED = new (_get__("Color"))(new (_get__("RGBA"))(255, 0, 0, 1));
  _get__("Color").BLUE = new (_get__("Color"))(new (_get__("RGBA"))(0, 0, 255, 1));
  _get__("Color").GREEN = new (_get__("Color"))(new (_get__("RGBA"))(0, 255, 0, 1));
  _get__("Color").CYAN = new (_get__("Color"))(new (_get__("RGBA"))(0, 255, 255, 1));
  _get__("Color").LIGHTGREY = new (_get__("Color"))(new (_get__("RGBA"))(211, 211, 211, 1));
  _get__("Color").TRANSPARENT = new (_get__("Color"))(new (_get__("RGBA"))(0, 0, 0, 0));
  (function(Color2) {
    (function(Format) {
      (function(CSS) {
        function formatRGB(color2) {
          if (color2.rgba.a === 1) {
            return `rgb(${color2.rgba.r}, ${color2.rgba.g}, ${color2.rgba.b})`;
          }
          return Color2.Format.CSS.formatRGBA(color2);
        }
        CSS.formatRGB = formatRGB;
        function formatRGBA(color2) {
          return `rgba(${color2.rgba.r}, ${color2.rgba.g}, ${color2.rgba.b}, ${+color2.rgba.a.toFixed(2)})`;
        }
        CSS.formatRGBA = formatRGBA;
        function formatHSL(color2) {
          if (color2.hsla.a === 1) {
            return `hsl(${color2.hsla.h}, ${(color2.hsla.s * 100).toFixed(2)}%, ${(color2.hsla.l * 100).toFixed(2)}%)`;
          }
          return Color2.Format.CSS.formatHSLA(color2);
        }
        CSS.formatHSL = formatHSL;
        function formatHSLA(color2) {
          return `hsla(${color2.hsla.h}, ${(color2.hsla.s * 100).toFixed(2)}%, ${(color2.hsla.l * 100).toFixed(2)}%, ${color2.hsla.a.toFixed(2)})`;
        }
        CSS.formatHSLA = formatHSLA;
        function _toTwoDigitHex(n) {
          const r = n.toString(16);
          return r.length !== 2 ? "0" + r : r;
        }
        function formatHex(color2) {
          return `#${_toTwoDigitHex(color2.rgba.r)}${_toTwoDigitHex(color2.rgba.g)}${_toTwoDigitHex(color2.rgba.b)}`;
        }
        CSS.formatHex = formatHex;
        function formatHexA(color2, compact = false) {
          if (compact && color2.rgba.a === 1) {
            return Color2.Format.CSS.formatHex(color2);
          }
          return `#${_toTwoDigitHex(color2.rgba.r)}${_toTwoDigitHex(color2.rgba.g)}${_toTwoDigitHex(color2.rgba.b)}${_toTwoDigitHex(Math.round(color2.rgba.a * 255))}`;
        }
        CSS.formatHexA = formatHexA;
        function format(color2) {
          if (!color2) {
            return null;
          }
          if (color2.isOpaque()) {
            return Color2.Format.CSS.formatHex(color2);
          }
          return Color2.Format.CSS.formatRGBA(color2);
        }
        CSS.format = format;
        function parseHex(hex) {
          if (!hex) {
            return null;
          }
          const length = hex.length;
          if (length === 0) {
            return null;
          }
          if (hex.charCodeAt(0) !== 35) {
            return null;
          }
          if (length === 7) {
            const r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
            const g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
            const b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
            return new Color2(new (_get__("RGBA"))(r, g, b, 1));
          }
          if (length === 9) {
            const r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
            const g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
            const b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
            const a = 16 * _parseHexDigit(hex.charCodeAt(7)) + _parseHexDigit(hex.charCodeAt(8));
            return new Color2(new (_get__("RGBA"))(r, g, b, a / 255));
          }
          if (length === 4) {
            const r = _parseHexDigit(hex.charCodeAt(1));
            const g = _parseHexDigit(hex.charCodeAt(2));
            const b = _parseHexDigit(hex.charCodeAt(3));
            return new Color2(new (_get__("RGBA"))(16 * r + r, 16 * g + g, 16 * b + b));
          }
          if (length === 5) {
            const r = _parseHexDigit(hex.charCodeAt(1));
            const g = _parseHexDigit(hex.charCodeAt(2));
            const b = _parseHexDigit(hex.charCodeAt(3));
            const a = _parseHexDigit(hex.charCodeAt(4));
            return new Color2(new (_get__("RGBA"))(16 * r + r, 16 * g + g, 16 * b + b, (16 * a + a) / 255));
          }
          return null;
        }
        CSS.parseHex = parseHex;
        function _parseHexDigit(charCode) {
          switch (charCode) {
            case 48:
              return 0;
            case 49:
              return 1;
            case 50:
              return 2;
            case 51:
              return 3;
            case 52:
              return 4;
            case 53:
              return 5;
            case 54:
              return 6;
            case 55:
              return 7;
            case 56:
              return 8;
            case 57:
              return 9;
            case 97:
              return 10;
            case 65:
              return 10;
            case 98:
              return 11;
            case 66:
              return 11;
            case 99:
              return 12;
            case 67:
              return 12;
            case 100:
              return 13;
            case 68:
              return 13;
            case 101:
              return 14;
            case 69:
              return 14;
            case 102:
              return 15;
            case 70:
              return 15;
          }
          return 0;
        }
      })(Format.CSS || (Format.CSS = {}));
    })(Color2.Format || (Color2.Format = {}));
  })(_get__("Color") || (exports.Color = _assign__("Color", {})));
  function _getGlobalObject() {
    try {
      if (!!commonjsGlobal) {
        return commonjsGlobal;
      }
    } catch (e) {
      try {
        if (!!window) {
          return window;
        }
      } catch (e2) {
        return this;
      }
    }
  }
  var _RewireModuleId__ = null;
  function _getRewireModuleId__() {
    if (_RewireModuleId__ === null) {
      let globalVariable = _getGlobalObject();
      if (!globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__) {
        globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0;
      }
      _RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;
    }
    return _RewireModuleId__;
  }
  function _getRewireRegistry__() {
    let theGlobalVariable = _getGlobalObject();
    if (!theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__) {
      theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = /* @__PURE__ */ Object.create(null);
    }
    return theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__;
  }
  function _getRewiredData__() {
    let moduleId = _getRewireModuleId__();
    let registry = _getRewireRegistry__();
    let rewireData = registry[moduleId];
    if (!rewireData) {
      registry[moduleId] = /* @__PURE__ */ Object.create(null);
      rewireData = registry[moduleId];
    }
    return rewireData;
  }
  (function registerResetAll() {
    let theGlobalVariable = _getGlobalObject();
    if (!theGlobalVariable["__rewire_reset_all__"]) {
      theGlobalVariable["__rewire_reset_all__"] = function() {
        theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = /* @__PURE__ */ Object.create(null);
      };
    }
  })();
  var INTENTIONAL_UNDEFINED = "__INTENTIONAL_UNDEFINED__";
  let _RewireAPI__ = {};
  (function() {
    function addPropertyToAPIObject(name, value) {
      Object.defineProperty(_RewireAPI__, name, {
        value,
        enumerable: false,
        configurable: true
      });
    }
    addPropertyToAPIObject("__get__", _get__);
    addPropertyToAPIObject("__GetDependency__", _get__);
    addPropertyToAPIObject("__Rewire__", _set__);
    addPropertyToAPIObject("__set__", _set__);
    addPropertyToAPIObject("__reset__", _reset__);
    addPropertyToAPIObject("__ResetDependency__", _reset__);
    addPropertyToAPIObject("__with__", _with__);
  })();
  function _get__(variableName) {
    let rewireData = _getRewiredData__();
    if (rewireData[variableName] === void 0) {
      return _get_original__(variableName);
    } else {
      var value = rewireData[variableName];
      if (value === INTENTIONAL_UNDEFINED) {
        return void 0;
      } else {
        return value;
      }
    }
  }
  function _get_original__(variableName) {
    switch (variableName) {
      case "roundFloat":
        return roundFloat;
      case "RGBA":
        return RGBA;
      case "HSLA":
        return HSLA;
      case "HSVA":
        return HSVA;
      case "Color":
        return Color;
    }
    return void 0;
  }
  function _assign__(variableName, value) {
    let rewireData = _getRewiredData__();
    if (rewireData[variableName] === void 0) {
      return _set_original__(variableName, value);
    } else {
      return rewireData[variableName] = value;
    }
  }
  function _set_original__(variableName, _value) {
    switch (variableName) {
      case "Color":
        return Color = _value;
    }
    return void 0;
  }
  function _set__(variableName, value) {
    let rewireData = _getRewiredData__();
    if (typeof variableName === "object") {
      Object.keys(variableName).forEach(function(name) {
        rewireData[name] = variableName[name];
      });
      return function() {
        Object.keys(variableName).forEach(function(name) {
          _reset__(variableName);
        });
      };
    } else {
      if (value === void 0) {
        rewireData[variableName] = INTENTIONAL_UNDEFINED;
      } else {
        rewireData[variableName] = value;
      }
      return function() {
        _reset__(variableName);
      };
    }
  }
  function _reset__(variableName) {
    let rewireData = _getRewiredData__();
    delete rewireData[variableName];
    if (Object.keys(rewireData).length == 0) {
      delete _getRewireRegistry__()[_getRewireModuleId__];
    }
  }
  function _with__(object) {
    let rewireData = _getRewiredData__();
    var rewiredVariableNames = Object.keys(object);
    var previousValues = {};
    function reset() {
      rewiredVariableNames.forEach(function(variableName) {
        rewireData[variableName] = previousValues[variableName];
      });
    }
    return function(callback) {
      rewiredVariableNames.forEach(function(variableName) {
        previousValues[variableName] = rewireData[variableName];
        rewireData[variableName] = object[variableName];
      });
      let result = callback();
      if (!!result && typeof result.then == "function") {
        result.then(reset).catch(reset);
      } else {
        reset();
      }
      return result;
    };
  }
  function addNonEnumerableProperty(name, value) {
    Object.defineProperty(module.exports, name, {
      value,
      enumerable: false,
      configurable: true
    });
  }
  if (Object.isExtensible(module.exports)) {
    addNonEnumerableProperty("__get__", _get__);
    addNonEnumerableProperty("__GetDependency__", _get__);
    addNonEnumerableProperty("__Rewire__", _set__);
    addNonEnumerableProperty("__set__", _set__);
    addNonEnumerableProperty("__reset__", _reset__);
    addNonEnumerableProperty("__ResetDependency__", _reset__);
    addNonEnumerableProperty("__with__", _with__);
    addNonEnumerableProperty("__RewireAPI__", _RewireAPI__);
  }
})(color, color.exports);
var colorExports = color.exports;
var platform = { exports: {} };
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OS = exports.setImmediate = exports.globals = exports.isRootUser = exports.platform = exports.isWeb = exports.isNative = exports.isFreeBSD = exports.isLinux = exports.isMacintosh = exports.isWindows = exports.PlatformToString = void 0;
  let _isWindows = false;
  let _isMacintosh = false;
  let _isLinux = false;
  let _isFreeBSD = false;
  let _isNative = false;
  let _isWeb = false;
  const isElectronRenderer = typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.electron !== "undefined" && process.type === "renderer";
  if (typeof navigator === "object" && !_get__("isElectronRenderer")) {
    const userAgent = navigator.userAgent;
    _assign__("_isWindows", userAgent.indexOf("Windows") >= 0);
    _assign__("_isMacintosh", userAgent.indexOf("Macintosh") >= 0);
    _assign__("_isLinux", userAgent.indexOf("Linux") >= 0);
    _assign__("_isFreeBSD", userAgent.indexOf("FreeBSD") >= 0);
    _assign__("_isWeb", true);
  } else if (typeof process === "object") {
    _assign__("_isWindows", process.platform === "win32");
    _assign__("_isMacintosh", process.platform === "darwin");
    _assign__("_isLinux", process.platform === "linux");
    _assign__("_isFreeBSD", process.platform === "freebsd");
    _assign__("_isNative", true);
  }
  function PlatformToString(platform2) {
    switch (platform2) {
      case 0:
        return "Web";
      case 1:
        return "Mac";
      case 2:
        return "Linux";
      case 3:
        return "FreeBSD";
      case 4:
        return "Windows";
    }
  }
  exports.PlatformToString = _get__("PlatformToString");
  let _platform = 0;
  if (_get__("_isNative")) {
    if (_get__("_isMacintosh")) {
      _assign__("_platform", 1);
    } else if (_get__("_isWindows")) {
      _assign__("_platform", 4);
    } else if (_get__("_isLinux")) {
      _assign__("_platform", 2);
    } else if (_get__("_isFreeBSD")) {
      _assign__("_platform", 3);
    }
  }
  exports.isWindows = _get__("_isWindows");
  exports.isMacintosh = _get__("_isMacintosh");
  exports.isLinux = _get__("_isLinux");
  exports.isFreeBSD = _get__("_isFreeBSD");
  exports.isNative = _get__("_isNative");
  exports.isWeb = _get__("_isWeb");
  exports.platform = _get__("_platform");
  function isRootUser() {
    return _get__("_isNative") && !_get__("_isWindows") && process.getuid() === 0;
  }
  exports.isRootUser = _get__("isRootUser");
  const g = typeof commonjsGlobal === "object" ? commonjsGlobal : {};
  const _globals = typeof self === "object" ? self : _get__("g");
  exports.globals = _get__("_globals");
  let _setImmediate = null;
  function setImmediate(callback) {
    if (_get__("_setImmediate") === null) {
      if (exports.globals.setImmediate) {
        _assign__("_setImmediate", exports.globals.setImmediate.bind(exports.globals));
      } else if (typeof process !== "undefined" && typeof process.nextTick === "function") {
        _assign__("_setImmediate", process.nextTick.bind(process));
      } else {
        _assign__("_setImmediate", exports.globals.setTimeout.bind(exports.globals));
      }
    }
    return _get__("_setImmediate")(callback);
  }
  exports.setImmediate = _get__("setImmediate");
  const _wl = _get__("_isWindows") ? 1 : 3 | 4;
  exports.OS = _get__("_isMacintosh") ? 2 : _get__("_wl");
  function _getGlobalObject() {
    try {
      if (!!commonjsGlobal) {
        return commonjsGlobal;
      }
    } catch (e) {
      try {
        if (!!window) {
          return window;
        }
      } catch (e2) {
        return this;
      }
    }
  }
  var _RewireModuleId__ = null;
  function _getRewireModuleId__() {
    if (_RewireModuleId__ === null) {
      let globalVariable = _getGlobalObject();
      if (!globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__) {
        globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0;
      }
      _RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;
    }
    return _RewireModuleId__;
  }
  function _getRewireRegistry__() {
    let theGlobalVariable = _getGlobalObject();
    if (!theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__) {
      theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = /* @__PURE__ */ Object.create(null);
    }
    return theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__;
  }
  function _getRewiredData__() {
    let moduleId = _getRewireModuleId__();
    let registry = _getRewireRegistry__();
    let rewireData = registry[moduleId];
    if (!rewireData) {
      registry[moduleId] = /* @__PURE__ */ Object.create(null);
      rewireData = registry[moduleId];
    }
    return rewireData;
  }
  (function registerResetAll() {
    let theGlobalVariable = _getGlobalObject();
    if (!theGlobalVariable["__rewire_reset_all__"]) {
      theGlobalVariable["__rewire_reset_all__"] = function() {
        theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = /* @__PURE__ */ Object.create(null);
      };
    }
  })();
  var INTENTIONAL_UNDEFINED = "__INTENTIONAL_UNDEFINED__";
  let _RewireAPI__ = {};
  (function() {
    function addPropertyToAPIObject(name, value) {
      Object.defineProperty(_RewireAPI__, name, {
        value,
        enumerable: false,
        configurable: true
      });
    }
    addPropertyToAPIObject("__get__", _get__);
    addPropertyToAPIObject("__GetDependency__", _get__);
    addPropertyToAPIObject("__Rewire__", _set__);
    addPropertyToAPIObject("__set__", _set__);
    addPropertyToAPIObject("__reset__", _reset__);
    addPropertyToAPIObject("__ResetDependency__", _reset__);
    addPropertyToAPIObject("__with__", _with__);
  })();
  function _get__(variableName) {
    let rewireData = _getRewiredData__();
    if (rewireData[variableName] === void 0) {
      return _get_original__(variableName);
    } else {
      var value = rewireData[variableName];
      if (value === INTENTIONAL_UNDEFINED) {
        return void 0;
      } else {
        return value;
      }
    }
  }
  function _get_original__(variableName) {
    switch (variableName) {
      case "isElectronRenderer":
        return isElectronRenderer;
      case "_isWindows":
        return _isWindows;
      case "_isMacintosh":
        return _isMacintosh;
      case "_isLinux":
        return _isLinux;
      case "_isFreeBSD":
        return _isFreeBSD;
      case "_isWeb":
        return _isWeb;
      case "_isNative":
        return _isNative;
      case "PlatformToString":
        return PlatformToString;
      case "_platform":
        return _platform;
      case "isRootUser":
        return isRootUser;
      case "g":
        return g;
      case "_globals":
        return _globals;
      case "_setImmediate":
        return _setImmediate;
      case "setImmediate":
        return setImmediate;
      case "_wl":
        return _wl;
    }
    return void 0;
  }
  function _assign__(variableName, value) {
    let rewireData = _getRewiredData__();
    if (rewireData[variableName] === void 0) {
      return _set_original__(variableName, value);
    } else {
      return rewireData[variableName] = value;
    }
  }
  function _set_original__(variableName, _value) {
    switch (variableName) {
      case "_isWindows":
        return _isWindows = _value;
      case "_isMacintosh":
        return _isMacintosh = _value;
      case "_isLinux":
        return _isLinux = _value;
      case "_isFreeBSD":
        return _isFreeBSD = _value;
      case "_isWeb":
        return _isWeb = _value;
      case "_isNative":
        return _isNative = _value;
      case "_platform":
        return _platform = _value;
      case "_setImmediate":
        return _setImmediate = _value;
    }
    return void 0;
  }
  function _set__(variableName, value) {
    let rewireData = _getRewiredData__();
    if (typeof variableName === "object") {
      Object.keys(variableName).forEach(function(name) {
        rewireData[name] = variableName[name];
      });
      return function() {
        Object.keys(variableName).forEach(function(name) {
          _reset__(variableName);
        });
      };
    } else {
      if (value === void 0) {
        rewireData[variableName] = INTENTIONAL_UNDEFINED;
      } else {
        rewireData[variableName] = value;
      }
      return function() {
        _reset__(variableName);
      };
    }
  }
  function _reset__(variableName) {
    let rewireData = _getRewiredData__();
    delete rewireData[variableName];
    if (Object.keys(rewireData).length == 0) {
      delete _getRewireRegistry__()[_getRewireModuleId__];
    }
  }
  function _with__(object) {
    let rewireData = _getRewiredData__();
    var rewiredVariableNames = Object.keys(object);
    var previousValues = {};
    function reset() {
      rewiredVariableNames.forEach(function(variableName) {
        rewireData[variableName] = previousValues[variableName];
      });
    }
    return function(callback) {
      rewiredVariableNames.forEach(function(variableName) {
        previousValues[variableName] = rewireData[variableName];
        rewireData[variableName] = object[variableName];
      });
      let result = callback();
      if (!!result && typeof result.then == "function") {
        result.then(reset).catch(reset);
      } else {
        reset();
      }
      return result;
    };
  }
  function addNonEnumerableProperty(name, value) {
    Object.defineProperty(module.exports, name, {
      value,
      enumerable: false,
      configurable: true
    });
  }
  if (Object.isExtensible(module.exports)) {
    addNonEnumerableProperty("__get__", _get__);
    addNonEnumerableProperty("__GetDependency__", _get__);
    addNonEnumerableProperty("__Rewire__", _set__);
    addNonEnumerableProperty("__set__", _set__);
    addNonEnumerableProperty("__reset__", _reset__);
    addNonEnumerableProperty("__ResetDependency__", _reset__);
    addNonEnumerableProperty("__with__", _with__);
    addNonEnumerableProperty("__RewireAPI__", _RewireAPI__);
  }
})(platform, platform.exports);
var platformExports = platform.exports;
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.loadWindowIcons = exports.applyFill = exports.parseAccelerator = exports.cleanMnemonic = exports.mnemonicButtonLabel = exports.mnemonicMenuLabel = exports.getPx = exports.menuIcons = exports.MENU_ESCAPED_MNEMONIC_REGEX = exports.MENU_MNEMONIC_REGEX = exports.WINDOW_MIN_HEIGHT = exports.WINDOW_MIN_WIDTH = exports.TOP_TITLEBAR_HEIGHT_WIN = exports.TOP_TITLEBAR_HEIGHT_MAC = exports.BOTTOM_TITLEBAR_HEIGHT = exports.IS_MAC_BIGSUR_OR_LATER = exports.DEFAULT_ITEM_SELECTOR = exports.ACTIVE_FOREGROUND = exports.INACTIVE_FOREGROUND = exports.ACTIVE_FOREGROUND_DARK = exports.INACTIVE_FOREGROUND_DARK = void 0;
  const color_1 = colorExports;
  const platform_1 = platformExports;
  exports.INACTIVE_FOREGROUND_DARK = _get__("color_1").Color.fromHex("#222222");
  exports.ACTIVE_FOREGROUND_DARK = _get__("color_1").Color.fromHex("#333333");
  exports.INACTIVE_FOREGROUND = _get__("color_1").Color.fromHex("#EEEEEE");
  exports.ACTIVE_FOREGROUND = _get__("color_1").Color.fromHex("#FFFFFF");
  exports.DEFAULT_ITEM_SELECTOR = _get__("color_1").Color.fromHex("#0000001F");
  exports.IS_MAC_BIGSUR_OR_LATER = _get__("platform_1").isMacintosh && parseInt(process.getSystemVersion().split(".")[0]) >= 11;
  exports.BOTTOM_TITLEBAR_HEIGHT = 60;
  exports.TOP_TITLEBAR_HEIGHT_MAC = exports.IS_MAC_BIGSUR_OR_LATER ? 28 : 22;
  exports.TOP_TITLEBAR_HEIGHT_WIN = 30;
  exports.WINDOW_MIN_WIDTH = 400;
  exports.WINDOW_MIN_HEIGHT = 270;
  exports.MENU_MNEMONIC_REGEX = /\(&([^\s&])\)|(^|[^&])&([^\s&])/;
  exports.MENU_ESCAPED_MNEMONIC_REGEX = /(&amp;)?(&amp;)([^\s&])/g;
  exports.menuIcons = {
    submenuIndicator: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="9 6 15 12 9 18" /></svg>',
    checkbox: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>',
    radioChecked: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M10,5 C7.2,5 5,7.2 5,10 C5,12.8 7.2,15 10,15 C12.8,15 15,12.8 15,10 C15,7.2 12.8,5 10,5 L10,5 Z M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M10,18 C5.6,18 2,14.4 2,10 C2,5.6 5.6,2 10,2 C14.4,2 18,5.6 18,10 C18,14.4 14.4,18 10,18 L10,18 Z" /></svg>',
    radioUnchecked: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M10,18 C5.6,18 2,14.4 2,10 C2,5.6 5.6,2 10,2 C14.4,2 18,5.6 18,10 C18,14.4 14.4,18 10,18 L10,18 Z" /></svg>',
    linux: {
      minimize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><path d="M11,4.9v1.1H0V4.399h11z"/></svg>',
      maximize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><path d="M0,1.7v7.6C0,10.2,0.8,11,1.7,11h7.6c0.9,0,1.7-0.8,1.7-1.7V1.7C11,0.8,10.2,0,9.3,0H1.7C0.8,0,0,0.8,0,1.7z M8.8,9.9H2.2c-0.6,0-1.1-0.5-1.1-1.1V2.2c0-0.6,0.5-1.1,1.1-1.1h6.7c0.6,0,1.1,0.5,1.1,1.1v6.7C9.9,9.4,9.4,9.9,8.8,9.9z"/></svg>',
      restore: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><path d="M7.9,2.2h-7C0.4,2.2,0,2.6,0,3.1v7C0,10.6,0.4,11,0.9,11h7c0.5,0,0.9-0.4,0.9-0.9v-7C8.8,2.6,8.4,2.2,7.9,2.2z M7.7,9.6 c0,0.2-0.1,0.3-0.3,0.3h-6c-0.2,0-0.3-0.1-0.3-0.3v-6c0-0.2,0.1-0.3,0.3-0.3h6c0.2,0,0.3,0.1,0.3,0.3V9.6z M10,0.9 c0,0.5-0.4,0.9-0.9,0.9h-2.1 c-0.5,0-0.9-0.4-0.9-0.9V0.9c0-0.5,0.4-0.9,0.9-0.9h2.1C9.6,0,10,0.4,10,0.9z"/></svg>',
      close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><path d="M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z"/></svg>'
    },
    freebsd: {
      minimize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><path d="M11,4.9v1.1H0V4.399h11z"/></svg>',
      maximize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><path d="M0,1.7v7.6C0,10.2,0.8,11,1.7,11h7.6c0.9,0,1.7-0.8,1.7-1.7V1.7C11,0.8,10.2,0,9.3,0H1.7C0.8,0,0,0.8,0,1.7z M8.8,9.9H2.2c-0.6,0-1.1-0.5-1.1-1.1V2.2c0-0.6,0.5-1.1,1.1-1.1h6.7c0.6,0,1.1,0.5,1.1,1.1v6.7C9.9,9.4,9.4,9.9,8.8,9.9z"/></svg>',
      restore: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><path d="M7.9,2.2h-7C0.4,2.2,0,2.6,0,3.1v7C0,10.6,0.4,11,0.9,11h7c0.5,0,0.9-0.4,0.9-0.9v-7C8.8,2.6,8.4,2.2,7.9,2.2z M7.7,9.6 c0,0.2-0.1,0.3-0.3,0.3h-6c-0.2,0-0.3-0.1-0.3-0.3v-6c0-0.2,0.1-0.3,0.3-0.3h6c0.2,0,0.3,0.1,0.3,0.3V9.6z M10,0.9 c0,0.5-0.4,0.9-0.9,0.9h-2.1 c-0.5,0-0.9-0.4-0.9-0.9V0.9c0-0.5,0.4-0.9,0.9-0.9h2.1C9.6,0,10,0.4,10,0.9z"/></svg>',
      close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><path d="M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z"/></svg>'
    },
    windows: {
      minimize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><path d="M11,4.9v1.1H0V4.399h11z"/></svg>',
      maximize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><path d="M0,1.7v7.6C0,10.2,0.8,11,1.7,11h7.6c0.9,0,1.7-0.8,1.7-1.7V1.7C11,0.8,10.2,0,9.3,0H1.7C0.8,0,0,0.8,0,1.7z M8.8,9.9H2.2c-0.6,0-1.1-0.5-1.1-1.1V2.2c0-0.6,0.5-1.1,1.1-1.1h6.7c0.6,0,1.1,0.5,1.1,1.1v6.7C9.9,9.4,9.4,9.9,8.8,9.9z"/></svg>',
      restore: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><path d="M7.9,2.2h-7C0.4,2.2,0,2.6,0,3.1v7C0,10.6,0.4,11,0.9,11h7c0.5,0,0.9-0.4,0.9-0.9v-7C8.8,2.6,8.4,2.2,7.9,2.2z M7.7,9.6 c0,0.2-0.1,0.3-0.3,0.3h-6c-0.2,0-0.3-0.1-0.3-0.3v-6c0-0.2,0.1-0.3,0.3-0.3h6c0.2,0,0.3,0.1,0.3,0.3V9.6z"/><path d="M10,0H3.5v1.1h6.1c0.2,0,0.3,0.1,0.3,0.3v6.1H11V1C11,0.4,10.6,0,10,0z"/></svg>',
      close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><path d="M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z"/></svg>'
    }
  };
  function getPx(value) {
    return `${value}px`;
  }
  exports.getPx = _get__("getPx");
  function mnemonicMenuLabel(label, forceDisableMnemonics) {
    if (_get__("platform_1").isMacintosh || forceDisableMnemonics) {
      return label.replace(/\(&&\w\)|&&/g, "").replace(/&/g, _get__("platform_1").isMacintosh ? "&" : "&&");
    }
    return label.replace(/&&|&/g, (m) => m === "&" ? "&&" : "&");
  }
  exports.mnemonicMenuLabel = _get__("mnemonicMenuLabel");
  function mnemonicButtonLabel(label, forceDisableMnemonics) {
    if (_get__("platform_1").isMacintosh || forceDisableMnemonics) {
      return label.replace(/\(&&\w\)|&&/g, "");
    }
    if (_get__("platform_1").isWindows) {
      return label.replace(/&&|&/g, (m) => m === "&" ? "&&" : "&");
    }
    return label.replace(/&&/g, "_");
  }
  exports.mnemonicButtonLabel = _get__("mnemonicButtonLabel");
  function cleanMnemonic(label) {
    const regex = exports.MENU_MNEMONIC_REGEX;
    const matches = regex.exec(label);
    if (!matches) {
      return label;
    }
    const mnemonicInText = !matches[1];
    return label.replace(regex, mnemonicInText ? "$2$3" : "").trim();
  }
  exports.cleanMnemonic = _get__("cleanMnemonic");
  function parseAccelerator(accelerator) {
    let acc = accelerator.toString();
    if (!_get__("platform_1").isMacintosh) {
      acc = acc.replace(/(Cmd)|(Command)/gi, "");
    } else {
      acc = acc.replace(/(Ctrl)|(Control)/gi, "");
    }
    acc = acc.replace(/(Or)/gi, "");
    return acc;
  }
  exports.parseAccelerator = _get__("parseAccelerator");
  function applyFill(element, svgColor, fgColor, color2 = true) {
    let fillColor = "";
    if (svgColor)
      fillColor = svgColor.toString();
    else if (fgColor)
      fillColor = fgColor.toString();
    if (element && element !== null) {
      if (color2)
        element.style.color = fillColor;
      else
        element.style.backgroundColor = fillColor;
    }
  }
  exports.applyFill = _get__("applyFill");
  function loadWindowIcons(icons) {
    if (!icons)
      return;
    const jWindowsIcons = commonjsRequire(icons);
    return {
      icons: jWindowsIcons,
      platformIcons: jWindowsIcons[(0, _get__("platform_1").PlatformToString)(_get__("platform_1").platform).toLocaleLowerCase()]
    };
  }
  exports.loadWindowIcons = _get__("loadWindowIcons");
  function _getGlobalObject() {
    try {
      if (!!commonjsGlobal) {
        return commonjsGlobal;
      }
    } catch (e) {
      try {
        if (!!window) {
          return window;
        }
      } catch (e2) {
        return this;
      }
    }
  }
  var _RewireModuleId__ = null;
  function _getRewireModuleId__() {
    if (_RewireModuleId__ === null) {
      let globalVariable = _getGlobalObject();
      if (!globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__) {
        globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0;
      }
      _RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;
    }
    return _RewireModuleId__;
  }
  function _getRewireRegistry__() {
    let theGlobalVariable = _getGlobalObject();
    if (!theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__) {
      theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = /* @__PURE__ */ Object.create(null);
    }
    return theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__;
  }
  function _getRewiredData__() {
    let moduleId = _getRewireModuleId__();
    let registry = _getRewireRegistry__();
    let rewireData = registry[moduleId];
    if (!rewireData) {
      registry[moduleId] = /* @__PURE__ */ Object.create(null);
      rewireData = registry[moduleId];
    }
    return rewireData;
  }
  (function registerResetAll() {
    let theGlobalVariable = _getGlobalObject();
    if (!theGlobalVariable["__rewire_reset_all__"]) {
      theGlobalVariable["__rewire_reset_all__"] = function() {
        theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = /* @__PURE__ */ Object.create(null);
      };
    }
  })();
  var INTENTIONAL_UNDEFINED = "__INTENTIONAL_UNDEFINED__";
  let _RewireAPI__ = {};
  (function() {
    function addPropertyToAPIObject(name, value) {
      Object.defineProperty(_RewireAPI__, name, {
        value,
        enumerable: false,
        configurable: true
      });
    }
    addPropertyToAPIObject("__get__", _get__);
    addPropertyToAPIObject("__GetDependency__", _get__);
    addPropertyToAPIObject("__Rewire__", _set__);
    addPropertyToAPIObject("__set__", _set__);
    addPropertyToAPIObject("__reset__", _reset__);
    addPropertyToAPIObject("__ResetDependency__", _reset__);
    addPropertyToAPIObject("__with__", _with__);
  })();
  function _get__(variableName) {
    let rewireData = _getRewiredData__();
    if (rewireData[variableName] === void 0) {
      return _get_original__(variableName);
    } else {
      var value = rewireData[variableName];
      if (value === INTENTIONAL_UNDEFINED) {
        return void 0;
      } else {
        return value;
      }
    }
  }
  function _get_original__(variableName) {
    switch (variableName) {
      case "color_1":
        return color_1;
      case "platform_1":
        return platform_1;
      case "getPx":
        return getPx;
      case "mnemonicMenuLabel":
        return mnemonicMenuLabel;
      case "mnemonicButtonLabel":
        return mnemonicButtonLabel;
      case "cleanMnemonic":
        return cleanMnemonic;
      case "parseAccelerator":
        return parseAccelerator;
      case "applyFill":
        return applyFill;
      case "loadWindowIcons":
        return loadWindowIcons;
    }
    return void 0;
  }
  function _set__(variableName, value) {
    let rewireData = _getRewiredData__();
    if (typeof variableName === "object") {
      Object.keys(variableName).forEach(function(name) {
        rewireData[name] = variableName[name];
      });
      return function() {
        Object.keys(variableName).forEach(function(name) {
          _reset__(variableName);
        });
      };
    } else {
      if (value === void 0) {
        rewireData[variableName] = INTENTIONAL_UNDEFINED;
      } else {
        rewireData[variableName] = value;
      }
      return function() {
        _reset__(variableName);
      };
    }
  }
  function _reset__(variableName) {
    let rewireData = _getRewiredData__();
    delete rewireData[variableName];
    if (Object.keys(rewireData).length == 0) {
      delete _getRewireRegistry__()[_getRewireModuleId__];
    }
  }
  function _with__(object) {
    let rewireData = _getRewiredData__();
    var rewiredVariableNames = Object.keys(object);
    var previousValues = {};
    function reset() {
      rewiredVariableNames.forEach(function(variableName) {
        rewireData[variableName] = previousValues[variableName];
      });
    }
    return function(callback) {
      rewiredVariableNames.forEach(function(variableName) {
        previousValues[variableName] = rewireData[variableName];
        rewireData[variableName] = object[variableName];
      });
      let result = callback();
      if (!!result && typeof result.then == "function") {
        result.then(reset).catch(reset);
      } else {
        reset();
      }
      return result;
    };
  }
  function addNonEnumerableProperty(name, value) {
    Object.defineProperty(module.exports, name, {
      value,
      enumerable: false,
      configurable: true
    });
  }
  if (Object.isExtensible(module.exports)) {
    addNonEnumerableProperty("__get__", _get__);
    addNonEnumerableProperty("__GetDependency__", _get__);
    addNonEnumerableProperty("__Rewire__", _set__);
    addNonEnumerableProperty("__set__", _set__);
    addNonEnumerableProperty("__reset__", _reset__);
    addNonEnumerableProperty("__ResetDependency__", _reset__);
    addNonEnumerableProperty("__with__", _with__);
    addNonEnumerableProperty("__RewireAPI__", _RewireAPI__);
  }
})(consts, consts.exports);
var constsExports = consts.exports;
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  const consts_1 = constsExports;
  exports.default = (browserWindow) => {
    browserWindow.setMinimumSize(_get__("consts_1").WINDOW_MIN_WIDTH, _get__("consts_1").WINDOW_MIN_HEIGHT);
    browserWindow.on("enter-full-screen", () => {
      browserWindow.webContents.send("window-fullscreen", true);
    });
    browserWindow.on("leave-full-screen", () => {
      browserWindow.webContents.send("window-fullscreen", false);
    });
    browserWindow.on("focus", () => {
      browserWindow.webContents.send("window-focus", true);
    });
    browserWindow.on("blur", () => {
      browserWindow.webContents.send("window-focus", false);
    });
    browserWindow.on("maximize", () => {
      browserWindow.webContents.send("window-maximize", true);
    });
    browserWindow.on("unmaximize", () => {
      browserWindow.webContents.send("window-maximize", false);
    });
  };
  function _getGlobalObject() {
    try {
      if (!!commonjsGlobal) {
        return commonjsGlobal;
      }
    } catch (e) {
      try {
        if (!!window) {
          return window;
        }
      } catch (e2) {
        return this;
      }
    }
  }
  var _RewireModuleId__ = null;
  function _getRewireModuleId__() {
    if (_RewireModuleId__ === null) {
      let globalVariable = _getGlobalObject();
      if (!globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__) {
        globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0;
      }
      _RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;
    }
    return _RewireModuleId__;
  }
  function _getRewireRegistry__() {
    let theGlobalVariable = _getGlobalObject();
    if (!theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__) {
      theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = /* @__PURE__ */ Object.create(null);
    }
    return theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__;
  }
  function _getRewiredData__() {
    let moduleId = _getRewireModuleId__();
    let registry = _getRewireRegistry__();
    let rewireData = registry[moduleId];
    if (!rewireData) {
      registry[moduleId] = /* @__PURE__ */ Object.create(null);
      rewireData = registry[moduleId];
    }
    return rewireData;
  }
  (function registerResetAll() {
    let theGlobalVariable = _getGlobalObject();
    if (!theGlobalVariable["__rewire_reset_all__"]) {
      theGlobalVariable["__rewire_reset_all__"] = function() {
        theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = /* @__PURE__ */ Object.create(null);
      };
    }
  })();
  var INTENTIONAL_UNDEFINED = "__INTENTIONAL_UNDEFINED__";
  let _RewireAPI__ = {};
  (function() {
    function addPropertyToAPIObject(name, value) {
      Object.defineProperty(_RewireAPI__, name, {
        value,
        enumerable: false,
        configurable: true
      });
    }
    addPropertyToAPIObject("__get__", _get__);
    addPropertyToAPIObject("__GetDependency__", _get__);
    addPropertyToAPIObject("__Rewire__", _set__);
    addPropertyToAPIObject("__set__", _set__);
    addPropertyToAPIObject("__reset__", _reset__);
    addPropertyToAPIObject("__ResetDependency__", _reset__);
    addPropertyToAPIObject("__with__", _with__);
  })();
  function _get__(variableName) {
    let rewireData = _getRewiredData__();
    if (rewireData[variableName] === void 0) {
      return _get_original__(variableName);
    } else {
      var value = rewireData[variableName];
      if (value === INTENTIONAL_UNDEFINED) {
        return void 0;
      } else {
        return value;
      }
    }
  }
  function _get_original__(variableName) {
    switch (variableName) {
      case "consts_1":
        return consts_1;
    }
    return void 0;
  }
  function _set__(variableName, value) {
    let rewireData = _getRewiredData__();
    if (typeof variableName === "object") {
      Object.keys(variableName).forEach(function(name) {
        rewireData[name] = variableName[name];
      });
      return function() {
        Object.keys(variableName).forEach(function(name) {
          _reset__(variableName);
        });
      };
    } else {
      if (value === void 0) {
        rewireData[variableName] = INTENTIONAL_UNDEFINED;
      } else {
        rewireData[variableName] = value;
      }
      return function() {
        _reset__(variableName);
      };
    }
  }
  function _reset__(variableName) {
    let rewireData = _getRewiredData__();
    delete rewireData[variableName];
    if (Object.keys(rewireData).length == 0) {
      delete _getRewireRegistry__()[_getRewireModuleId__];
    }
  }
  function _with__(object) {
    let rewireData = _getRewiredData__();
    var rewiredVariableNames = Object.keys(object);
    var previousValues = {};
    function reset() {
      rewiredVariableNames.forEach(function(variableName) {
        rewireData[variableName] = previousValues[variableName];
      });
    }
    return function(callback) {
      rewiredVariableNames.forEach(function(variableName) {
        previousValues[variableName] = rewireData[variableName];
        rewireData[variableName] = object[variableName];
      });
      let result = callback();
      if (!!result && typeof result.then == "function") {
        result.then(reset).catch(reset);
      } else {
        reset();
      }
      return result;
    };
  }
  function addNonEnumerableProperty(name, value) {
    Object.defineProperty(module.exports, name, {
      value,
      enumerable: false,
      configurable: true
    });
  }
  if (Object.isExtensible(module.exports)) {
    addNonEnumerableProperty("__get__", _get__);
    addNonEnumerableProperty("__GetDependency__", _get__);
    addNonEnumerableProperty("__Rewire__", _set__);
    addNonEnumerableProperty("__set__", _set__);
    addNonEnumerableProperty("__reset__", _reset__);
    addNonEnumerableProperty("__ResetDependency__", _reset__);
    addNonEnumerableProperty("__with__", _with__);
    addNonEnumerableProperty("__RewireAPI__", _RewireAPI__);
  }
})(attachTitlebarToWindow, attachTitlebarToWindow.exports);
var attachTitlebarToWindowExports = attachTitlebarToWindow.exports;
var setupTitlebar = { exports: {} };
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = () => {
    if (process.type !== "browser")
      return;
    const {
      BrowserWindow,
      Menu,
      MenuItem,
      ipcMain
    } = require$$0;
    ipcMain.handle("request-application-menu", async () => JSON.parse(JSON.stringify(Menu.getApplicationMenu(), (key, value) => key !== "commandsMap" && key !== "menu" ? value : void 0)));
    ipcMain.on("window-event", (event, eventName) => {
      const window2 = BrowserWindow.fromWebContents(event.sender);
      if (window2) {
        switch (eventName) {
          case "window-minimize":
            window2 == null ? void 0 : window2.minimize();
            break;
          case "window-maximize":
            (window2 == null ? void 0 : window2.isMaximized()) ? window2.unmaximize() : window2 == null ? void 0 : window2.maximize();
            break;
          case "window-close":
            window2 == null ? void 0 : window2.close();
            break;
          case "window-is-maximized":
            event.returnValue = window2 == null ? void 0 : window2.isMaximized();
            break;
        }
      }
    });
    ipcMain.on("menu-event", (event, commandId) => {
      const item = _get__("getMenuItemByCommandId")(commandId, Menu.getApplicationMenu());
      if (item)
        item.click(void 0, BrowserWindow.fromWebContents(event.sender), event.sender);
    });
    ipcMain.on("menu-icon", (event, commandId) => {
      const item = _get__("getMenuItemByCommandId")(commandId, Menu.getApplicationMenu());
      if (item && item.icon && typeof item.icon !== "string") {
        event.returnValue = item.icon.toDataURL();
      } else {
        event.returnValue = null;
      }
    });
    ipcMain.on("update-window-controls", (event, args) => {
      const window2 = BrowserWindow.fromWebContents(event.sender);
      try {
        if (window2)
          window2.setTitleBarOverlay(args);
        event.returnValue = true;
      } catch (_) {
        event.returnValue = false;
      }
    });
  };
  function getMenuItemByCommandId(commandId, menu) {
    if (!menu)
      return void 0;
    for (const item of menu.items) {
      if (item.submenu) {
        const submenuItem = _get__("getMenuItemByCommandId")(commandId, item.submenu);
        if (submenuItem)
          return submenuItem;
      } else if (item.commandId === commandId)
        return item;
    }
    return void 0;
  }
  function _getGlobalObject() {
    try {
      if (!!commonjsGlobal) {
        return commonjsGlobal;
      }
    } catch (e) {
      try {
        if (!!window) {
          return window;
        }
      } catch (e2) {
        return this;
      }
    }
  }
  var _RewireModuleId__ = null;
  function _getRewireModuleId__() {
    if (_RewireModuleId__ === null) {
      let globalVariable = _getGlobalObject();
      if (!globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__) {
        globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0;
      }
      _RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;
    }
    return _RewireModuleId__;
  }
  function _getRewireRegistry__() {
    let theGlobalVariable = _getGlobalObject();
    if (!theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__) {
      theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = /* @__PURE__ */ Object.create(null);
    }
    return theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__;
  }
  function _getRewiredData__() {
    let moduleId = _getRewireModuleId__();
    let registry = _getRewireRegistry__();
    let rewireData = registry[moduleId];
    if (!rewireData) {
      registry[moduleId] = /* @__PURE__ */ Object.create(null);
      rewireData = registry[moduleId];
    }
    return rewireData;
  }
  (function registerResetAll() {
    let theGlobalVariable = _getGlobalObject();
    if (!theGlobalVariable["__rewire_reset_all__"]) {
      theGlobalVariable["__rewire_reset_all__"] = function() {
        theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = /* @__PURE__ */ Object.create(null);
      };
    }
  })();
  var INTENTIONAL_UNDEFINED = "__INTENTIONAL_UNDEFINED__";
  let _RewireAPI__ = {};
  (function() {
    function addPropertyToAPIObject(name, value) {
      Object.defineProperty(_RewireAPI__, name, {
        value,
        enumerable: false,
        configurable: true
      });
    }
    addPropertyToAPIObject("__get__", _get__);
    addPropertyToAPIObject("__GetDependency__", _get__);
    addPropertyToAPIObject("__Rewire__", _set__);
    addPropertyToAPIObject("__set__", _set__);
    addPropertyToAPIObject("__reset__", _reset__);
    addPropertyToAPIObject("__ResetDependency__", _reset__);
    addPropertyToAPIObject("__with__", _with__);
  })();
  function _get__(variableName) {
    let rewireData = _getRewiredData__();
    if (rewireData[variableName] === void 0) {
      return _get_original__(variableName);
    } else {
      var value = rewireData[variableName];
      if (value === INTENTIONAL_UNDEFINED) {
        return void 0;
      } else {
        return value;
      }
    }
  }
  function _get_original__(variableName) {
    switch (variableName) {
      case "getMenuItemByCommandId":
        return getMenuItemByCommandId;
    }
    return void 0;
  }
  function _set__(variableName, value) {
    let rewireData = _getRewiredData__();
    if (typeof variableName === "object") {
      Object.keys(variableName).forEach(function(name) {
        rewireData[name] = variableName[name];
      });
      return function() {
        Object.keys(variableName).forEach(function(name) {
          _reset__(variableName);
        });
      };
    } else {
      if (value === void 0) {
        rewireData[variableName] = INTENTIONAL_UNDEFINED;
      } else {
        rewireData[variableName] = value;
      }
      return function() {
        _reset__(variableName);
      };
    }
  }
  function _reset__(variableName) {
    let rewireData = _getRewiredData__();
    delete rewireData[variableName];
    if (Object.keys(rewireData).length == 0) {
      delete _getRewireRegistry__()[_getRewireModuleId__];
    }
  }
  function _with__(object) {
    let rewireData = _getRewiredData__();
    var rewiredVariableNames = Object.keys(object);
    var previousValues = {};
    function reset() {
      rewiredVariableNames.forEach(function(variableName) {
        rewireData[variableName] = previousValues[variableName];
      });
    }
    return function(callback) {
      rewiredVariableNames.forEach(function(variableName) {
        previousValues[variableName] = rewireData[variableName];
        rewireData[variableName] = object[variableName];
      });
      let result = callback();
      if (!!result && typeof result.then == "function") {
        result.then(reset).catch(reset);
      } else {
        reset();
      }
      return result;
    };
  }
  function addNonEnumerableProperty(name, value) {
    Object.defineProperty(module.exports, name, {
      value,
      enumerable: false,
      configurable: true
    });
  }
  if (Object.isExtensible(module.exports)) {
    addNonEnumerableProperty("__get__", _get__);
    addNonEnumerableProperty("__GetDependency__", _get__);
    addNonEnumerableProperty("__Rewire__", _set__);
    addNonEnumerableProperty("__set__", _set__);
    addNonEnumerableProperty("__reset__", _reset__);
    addNonEnumerableProperty("__ResetDependency__", _reset__);
    addNonEnumerableProperty("__with__", _with__);
    addNonEnumerableProperty("__RewireAPI__", _RewireAPI__);
  }
})(setupTitlebar, setupTitlebar.exports);
var setupTitlebarExports = setupTitlebar.exports;
(function(module, exports) {
  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
      "default": mod
    };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.attachTitlebarToWindow = exports.setupTitlebar = void 0;
  const attach_titlebar_to_window_1 = _get__("__importDefault")(attachTitlebarToWindowExports);
  exports.attachTitlebarToWindow = _get__("attach_titlebar_to_window_1").default;
  const setup_titlebar_1 = _get__("__importDefault")(setupTitlebarExports);
  exports.setupTitlebar = _get__("setup_titlebar_1").default;
  function _getGlobalObject() {
    try {
      if (!!commonjsGlobal) {
        return commonjsGlobal;
      }
    } catch (e) {
      try {
        if (!!window) {
          return window;
        }
      } catch (e2) {
        return this;
      }
    }
  }
  var _RewireModuleId__ = null;
  function _getRewireModuleId__() {
    if (_RewireModuleId__ === null) {
      let globalVariable = _getGlobalObject();
      if (!globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__) {
        globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0;
      }
      _RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;
    }
    return _RewireModuleId__;
  }
  function _getRewireRegistry__() {
    let theGlobalVariable = _getGlobalObject();
    if (!theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__) {
      theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = /* @__PURE__ */ Object.create(null);
    }
    return theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__;
  }
  function _getRewiredData__() {
    let moduleId = _getRewireModuleId__();
    let registry = _getRewireRegistry__();
    let rewireData = registry[moduleId];
    if (!rewireData) {
      registry[moduleId] = /* @__PURE__ */ Object.create(null);
      rewireData = registry[moduleId];
    }
    return rewireData;
  }
  (function registerResetAll() {
    let theGlobalVariable = _getGlobalObject();
    if (!theGlobalVariable["__rewire_reset_all__"]) {
      theGlobalVariable["__rewire_reset_all__"] = function() {
        theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = /* @__PURE__ */ Object.create(null);
      };
    }
  })();
  var INTENTIONAL_UNDEFINED = "__INTENTIONAL_UNDEFINED__";
  let _RewireAPI__ = {};
  (function() {
    function addPropertyToAPIObject(name, value) {
      Object.defineProperty(_RewireAPI__, name, {
        value,
        enumerable: false,
        configurable: true
      });
    }
    addPropertyToAPIObject("__get__", _get__);
    addPropertyToAPIObject("__GetDependency__", _get__);
    addPropertyToAPIObject("__Rewire__", _set__);
    addPropertyToAPIObject("__set__", _set__);
    addPropertyToAPIObject("__reset__", _reset__);
    addPropertyToAPIObject("__ResetDependency__", _reset__);
    addPropertyToAPIObject("__with__", _with__);
  })();
  function _get__(variableName) {
    let rewireData = _getRewiredData__();
    if (rewireData[variableName] === void 0) {
      return _get_original__(variableName);
    } else {
      var value = rewireData[variableName];
      if (value === INTENTIONAL_UNDEFINED) {
        return void 0;
      } else {
        return value;
      }
    }
  }
  function _get_original__(variableName) {
    switch (variableName) {
      case "__importDefault":
        return __importDefault;
      case "attach_titlebar_to_window_1":
        return attach_titlebar_to_window_1;
      case "setup_titlebar_1":
        return setup_titlebar_1;
    }
    return void 0;
  }
  function _set__(variableName, value) {
    let rewireData = _getRewiredData__();
    if (typeof variableName === "object") {
      Object.keys(variableName).forEach(function(name) {
        rewireData[name] = variableName[name];
      });
      return function() {
        Object.keys(variableName).forEach(function(name) {
          _reset__(variableName);
        });
      };
    } else {
      if (value === void 0) {
        rewireData[variableName] = INTENTIONAL_UNDEFINED;
      } else {
        rewireData[variableName] = value;
      }
      return function() {
        _reset__(variableName);
      };
    }
  }
  function _reset__(variableName) {
    let rewireData = _getRewiredData__();
    delete rewireData[variableName];
    if (Object.keys(rewireData).length == 0) {
      delete _getRewireRegistry__()[_getRewireModuleId__];
    }
  }
  function _with__(object) {
    let rewireData = _getRewiredData__();
    var rewiredVariableNames = Object.keys(object);
    var previousValues = {};
    function reset() {
      rewiredVariableNames.forEach(function(variableName) {
        rewireData[variableName] = previousValues[variableName];
      });
    }
    return function(callback) {
      rewiredVariableNames.forEach(function(variableName) {
        previousValues[variableName] = rewireData[variableName];
        rewireData[variableName] = object[variableName];
      });
      let result = callback();
      if (!!result && typeof result.then == "function") {
        result.then(reset).catch(reset);
      } else {
        reset();
      }
      return result;
    };
  }
  function addNonEnumerableProperty(name, value) {
    Object.defineProperty(module.exports, name, {
      value,
      enumerable: false,
      configurable: true
    });
  }
  if (Object.isExtensible(module.exports)) {
    addNonEnumerableProperty("__get__", _get__);
    addNonEnumerableProperty("__GetDependency__", _get__);
    addNonEnumerableProperty("__Rewire__", _set__);
    addNonEnumerableProperty("__set__", _set__);
    addNonEnumerableProperty("__reset__", _reset__);
    addNonEnumerableProperty("__ResetDependency__", _reset__);
    addNonEnumerableProperty("__with__", _with__);
    addNonEnumerableProperty("__RewireAPI__", _RewireAPI__);
  }
})(main, main.exports);
var mainExports = main.exports;
mainExports.setupTitlebar();
const STORAGE_PATH = "E:\\program\\record-your-life";
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = require$$0.app.isPackaged ? process.env.DIST : path.join(process.env.DIST, "../public");
let win;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  win = new require$$0.BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    titleBarStyle: "hidden",
    width: 1e3,
    height: 650,
    titleBarOverlay: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  require$$0.Menu.setApplicationMenu(null);
  mainExports.attachTitlebarToWindow(win);
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.openDevTools();
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
}
require$$0.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    require$$0.app.quit();
    win = null;
  }
});
require$$0.app.on("activate", () => {
  if (require$$0.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
require$$0.app.whenReady().then(() => {
  const DATE_JSON_REGX = /\d{4}-\d{2}-\d{2}.json/;
  require$$0.ipcMain.handle("all-date", async () => {
    const dates = (await fsp.readdir(STORAGE_PATH)).filter((item) => DATE_JSON_REGX.test(item)).map((item) => item.replace(".json", ""));
    return dates;
  });
  require$$0.ipcMain.handle("app", async (_e, date) => {
    try {
      const content = await fsp.readFile(
        path.join(STORAGE_PATH, date + ".json"),
        "utf-8"
      );
      const raw = JSON.parse(content);
      const result = [];
      for (const [name, value] of Object.entries(raw)) {
        try {
          if (value.path && value.total > 0 && value.durations.length > 2) {
            const icon = await require$$0.app.getFileIcon(value.path, {
              size: "large"
            });
            result.push({
              name,
              ...value,
              icon: icon.toDataURL()
            });
          }
        } catch (error) {
        }
      }
      return result.sort((a, b) => b.total - a.total);
    } catch (err) {
      return;
    }
  });
  createWindow();
});
