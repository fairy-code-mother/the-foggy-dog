window.slate = window.slate || {};
window.theme = window.theme || {};


/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');
      
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function () {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  var arrayIncludes = function(e, t) {
    for (var n = 0; n < e.length; n++)
      if (e[n] == t) return !0;
    return !1;
  };

  var uniq = function(e) {
    for (var t = [], n = 0; n < e.length; n++) arrayIncludes(t, e[n]) || t.push(e[n]);
    return t;
  }

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    var _this = this;

    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));

    // Trigger change on load
    //$(this.singleOptionSelector, this.$container).first().change();

    var productHasOption = this.product.options.reduce(function(acc, option) {
      if( option.toLowerCase() == "option" || option.toLowerCase() == "hardware" ) {
        acc = true;
      }

      return acc;
    }, false);

    // Init linked options
    if( productHasOption ) {
      _this._initLinkedOptions();
    }
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });

      var $mainImages = $('.product-main-image .item');
      var $variantTitle = variant.title;
      $mainImages.each(function(){
        var dataVariant = $(this).attr("data-image-variant");
        if (~dataVariant.indexOf($variantTitle)) {
          $thisImage = $(this);
          //alert("thisImages = " + $thisImage);
          
          $slideNum = $thisImage.attr("data-slick-index");
          //alert("slideNum = " + $slideNum);
          
          // Go to that slide
          $('.product-main-image').slick('slickGoTo', $slideNum ); 
        }
      });

    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        //return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param {object} variant - Currently selected variant
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?variant=' +
        variant.id;
      window.history.replaceState({ path: newurl }, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param {object} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    },

    _initLinkedOptions: function() {
      var this_ = this;

      var product = this.product;

      var selector = $("[data-single-option-selector]:eq(0)");

      selector.trigger("change");

      if( product.options.length == 1 ) {
        product.variants.forEach(function(variant) {
          if( !variant.available ) {
            $("[data-single-option-selector] option")
              .filter(function() {
                return $(this).text().trim() == variant.title;
              })
              .append(" - Sold out");
          }
        });

        $("[data-single-option-selector]").trigger("change");

        setTimeout(function() {
          $("[data-product-select] option").each(function() {
            var title = $(this).text().trim();

            var swatch = $(".new-variant-swatch").filter(function() {
              return $(this).data("val") == title;
            });

            if( !$(this)[0].disabled ) {
              return;
            }

            swatch.addClass("is-soldout");
          });
        }, 100);
      } else {
        if( product.available ) {
          setTimeout(function() {
            this_._linkOptionSelectors(product);

            var optionsMap = this_._getNewOptionsMap();

            setTimeout(function() {
              $(".new-variant-swatch").each(function() {
                var key = $(this).data("val");
                var match = optionsMap[key] ? optionsMap[key].available : null;

                if( !match ) {
                  //$(this).addClass("is-soldout");
                }
              });
            }, 100);
          }, 100);
        }
      }
    },

    _linkOptionSelectors: function() {
      var _this = this;
      var product = this.product;

      // Update options right away.
      this._updateOptionsInSelector(0);

      if( product.options.length > 1 ) {
        this._updateOptionsInSelector(1)
      };

      if( product.options.length > 2 ) {
        this._updateOptionsInSelector(2)
      };

      // When there is an update in the first dropdown.
      $("[data-single-option-selector]:eq(0)").on("change", function() {
        _this._updateOptionsInSelector(1);

        if( product.options.length > 2 ) {
          _this._updateOptionsInSelector(2)
        };

        return true;
      });

      // When there is an update in the second dropdown.
      $("[data-single-option-selector]:eq(1)").on("change", function() {
        if( product.options.length > 2 ) {
          _this._updateOptionsInSelector(2);
        };
      });
    },

    _updateOptionsInSelector: function(selectorIndex) {
      var optionsMap = this._getNewOptionsMap();

      var key = "root";
      var selector = $("[data-single-option-selector]:eq(0)");

      if( selectorIndex == 1 ) {
        key = $("[data-single-option-selector]:eq(0)").val();
        selector = $("[data-single-option-selector]:eq(1)");
      } else if( selectorIndex == 2 ) {
        key = $("[data-single-option-selector]:eq(0)").val();
        key += " / " + $("[data-single-option-selector]:eq(1)").val();
        selector = $("[data-single-option-selector]:eq(2)");
      } 

      var initialValue = selector.val();
      var allOptions = optionsMap[key] ? optionsMap[key].all : null;
      var availableOptions = optionsMap[key] ? optionsMap[key].available : null;

      var swatches = selector.parents(".selector-wrapper").find(".last-option");

      if( allOptions ) {
        selector.empty();

        allOptions.forEach(function(option) {
          var newOption = $("<option></option>").val(option).html(option);
          selector.append(newOption);
        });

        selector.find("option").each(function() {
          var html = $(this).html().split(" - Sold out")[0];
          $(this).html(html);
        });

        setTimeout(function() {
          swatches.find(".new-variant-swatch").removeClass("is-soldout");
        }, 200);

        var unavailableOptionElements = $(selector).find("option")
          .filter(function() {
            return !availableOptions.includes( $(this).val() );
          });

        setTimeout(function() {
          var unavailableSwatchElements = swatches.find(".new-variant-swatch")
            .filter(function() {
              return !availableOptions.includes( $(this).data("val") );
            });

            if($(this).text().indexOf("Select An Option") > -1) {
              console.log(" ");
            } else {
              unavailableSwatchElements.addClass("is-soldout");
            }
             
          
        }, 200);

        unavailableOptionElements.each(function() {
          var isUnavailable = $(this).text().indexOf(" - Sold out") > -1;

          if( !isUnavailable ) {
            if($(this).text().indexOf("Select An Option") > -1) {
              console.log(" ");
            } else {
              $(this).append(" - Sold out");
            }
          }
        });

        if( availableOptions.includes(initialValue) ) {
          selector.val(initialValue);
        } else {
          selector.val( availableOptions[0] );
        }
      } else {
        selector.find("option").each(function(i,v) {
          var isUnavailable = $(this).text().indexOf(" - Sold out") > -1;

          if( !isUnavailable ) {
            if($(this).text().indexOf("Select An Option") > -1) {
              console.log("");
            } else {
              $(this).append(" - Sold out");
            }
          }
        });

        setTimeout(function() {
          //swatches.find(".new-variant-swatch").addClass("is-soldout");
        }, 200);
      }
      
        var newOption = $("<option></option>").val("").html("Select Option");
        selector.prepend(newOption);
        selector.prop("selectedIndex", 0);
      
      //selector.trigger("change");
    },

    _getOptionsMap: function() {
      var product = this.product;

      var optionsMap = {};

      product.variants.forEach(function(variant) {
        if( !variant.available ) {
          return;
        }

        // Gathering values for the 1st drop-down.
        optionsMap["root"] = optionsMap["root"] || [];
        optionsMap["root"].push(variant.option1);
        optionsMap["root"] = uniq(optionsMap["root"]);

        // Gathering values for the 2nd drop-down.
        if( product.options.length > 1 ) {
          var key = variant.option1;
          optionsMap[key] = optionsMap[key] || [];
          optionsMap[key].push(variant.option2);
          optionsMap[key] = uniq(optionsMap[key]);
        }

        // Gathering values for the 3rd drop-down.
        if( product.options.length > 2 ) {
          var key = variant.option1 + " / " + variant.option2;
          optionsMap[key] = optionsMap[key] || [];
          optionsMap[key].push(variant.option3);
          optionsMap[key] = uniq(optionsMap[key]);
        }
      });

      return optionsMap;
    },

    _getNewOptionsMap: function() {
      var product = this.product;

      var optionsMap = {};

      product.variants.forEach(function(variant) {
        // Gathering values for the 1st drop-down.
        optionsMap["root"] = optionsMap["root"] || {};
        optionsMap["root"].all = optionsMap["root"].all || [];
        optionsMap["root"].available = optionsMap["root"].available || [];
        optionsMap["root"].unavailable = optionsMap["root"].unavailable || [];

        optionsMap["root"].all.push(variant.option1);

        if( variant.available ) {
          optionsMap["root"].available.push(variant.option1);
        } else {
          optionsMap["root"].unavailable.push(variant.option1);
        }

        optionsMap["root"].all = uniq(optionsMap["root"].all);
        optionsMap["root"].available = uniq(optionsMap["root"].available);
        optionsMap["root"].unavailable = uniq(optionsMap["root"].unavailable);

        // Gathering values for the 2nd drop-down.
        if( product.options.length > 1 ) {
          var key = variant.option1;

          optionsMap[key] = optionsMap[key] || {};
          optionsMap[key].all = optionsMap[key].all || [];
          optionsMap[key].available = optionsMap[key].available || [];
          optionsMap[key].unavailable = optionsMap[key].unavailable || [];

          optionsMap[key].all.push(variant.option2);

          if( variant.available ) {
            optionsMap[key].available.push(variant.option2);
          } else {
            optionsMap[key].unavailable.push(variant.option2);
          }

          optionsMap[key].all = uniq(optionsMap[key].all);
          optionsMap[key].available = uniq(optionsMap[key].available);
          optionsMap[key].unavailable = uniq(optionsMap[key].unavailable);
        }

        // Gathering values for the 3rd drop-down.
        if( product.options.length > 2 ) {
          var key = variant.option1 + " / " + variant.option2;

          optionsMap[key] = optionsMap[key] || {};
          optionsMap[key].all = optionsMap[key].all || [];
          optionsMap[key].available = optionsMap[key].available || [];
          optionsMap[key].unavailable = optionsMap[key].unavailable || [];

          optionsMap[key].all.push(variant.option3);

          if( variant.available ) {
            optionsMap[key].available.push(variant.option3);
          } else {
            optionsMap[key].unavailable.push(variant.option3);
          }

          optionsMap[key].all = uniq(optionsMap[key].all);
          optionsMap[key].available = uniq(optionsMap[key].available);
          optionsMap[key].unavailable = uniq(optionsMap[key].unavailable);
        }
      });

      return optionsMap;
    }
  });

  return Variants;
})();


/*================ Sections ================*/
/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]',
    productStock: '[data-product-stock]',
    preorderJson: '[data-preorder-json]',
    estimatedDateAttr: '.estimated-date-attr',
    estimatedDate: '.estimated-date',
    preorderProp: '.preorder__prop'
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    var sectionId = this.$container.attr('data-section-id');
    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

    var options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject
    };

    this.settings = {};
    this.namespace = '.product';
    this.variants = new slate.Variants(options);
    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
    this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));

    if (this.$featuredImage.length > 0) {
      this.settings.imageSize = slate.Image.imageSize(this.$featuredImage.attr('src'));
      slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
    }
  }

  Product.prototype = $.extend({}, Product.prototype, {

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      // First, if we have preorder info
      if ($(selectors.preorderJson, this.$container).html() && variant) {
        this.productPreorderObject = JSON.parse($(selectors.preorderJson, this.$container).html());
      }

      if (this.productPreorderObject && this.productPreorderObject.isPreorderProduct == true) {
        var quantityAvailableData = this.productPreorderObject.quantityAvailableData;
        var estimatedDateData = this.productPreorderObject.estimatedDateData;
        var quantityCapsData = this.productPreorderObject.quantityCapsData;

        if( variant.inventory_management == 'shopify' ) {
          if( variant.inventory_policy == 'continue' ){
            // pre order button - if the quantity is less than or equal to 0
            if( quantityCapsData[variant.id] != "" ){

              var inventoryValue = quantityAvailableData[variant.id];
              if ( inventoryValue < 0 ){
                inventoryValue = quantityAvailableData[variant.id] * -1;
              }

              if(inventoryValue >= parseInt(quantityCapsData[variant.id])){
                $(selectors.addToCartText, this.$container).html(theme.strings.soldOut)
                $(selectors.addToCart, this.$container).attr('disabled', 'disabled')
                $(selectors.addToCart, this.$container).attr('id', 'add-sold-out')
                $(selectors.estimatedDateAttr, this.$container).val('')
                $(selectors.preorderProp, this.$container).hide();
              }else{
                $(selectors.addToCartText, this.$container).html(theme.strings.preorder)
                $(selectors.addToCart, this.$container).removeAttr('disabled')
                $(selectors.addToCart, this.$container).attr('id', 'add')

                $(selectors.estimatedDate, this.$container).text(estimatedDateData[variant.id])
                if( $('.preorder__prop > input').length == 0 ){
                  $(selectors.preorderProp, this.$container).append('<input type="hidden" class="estimated-date-attr" id="pre-order" name="properties[Pre Order]" value="'+ estimatedDateData[variant.id] +'" >');
                }else{
                  $(selectors.estimatedDateAttr, this.$container).val(estimatedDateData[variant.id])
                }

                if( estimatedDateData[variant.id].trim() != '' ){
                  $(selectors.estimatedDate, this.$container).show();
                }else{
                  $(selectors.estimatedDate, this.$container).hide();
                }
              }
            }else{
              $(selectors.addToCartText, this.$container).html(theme.strings.preorder)
              $(selectors.addToCart, this.$container).removeAttr('disabled')
              $(selectors.addToCart, this.$container).attr('id', 'add')

              $(selectors.estimatedDate, this.$container).text(estimatedDateData[variant.id])
              if( $('.preorder__prop > input').length == 0 ){
                $(selectors.preorderProp, this.$container).append('<input type="hidden" class="estimated-date-attr" id="pre-order" name="properties[Pre Order]" value="'+ estimatedDateData[variant.id] +'" >');
              }else{
                $(selectors.estimatedDateAttr, this.$container).val(estimatedDateData[variant.id])
              }

              if( estimatedDateData[variant.id].trim() != '' ){
                $(selectors.estimatedDate, this.$container).show();
              }else{
                $(selectors.estimatedDate, this.$container).hide();
              }
            }
          }
        } else {
          if (variant.available) {
            $(selectors.addToCart, this.$container).prop('disabled', false);
            $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
            $(selectors.addToCart, this.$container).attr('id', 'add');
          } else {
            $(selectors.addToCart, this.$container).prop('disabled', true);
            $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
            $(selectors.addToCart, this.$container).attr('id', 'add-sold-out');
          }

          $(selectors.estimatedDateAttr, this.$container).val('')
          $(selectors.estimatedDate, this.$container).hide();
          $(selectors.preorderProp, this.$container).empty();
        }
      }
      else {
        if (variant) {
          $(selectors.priceWrapper, this.$container).removeClass('hide');
        } else {
          $(selectors.addToCart, this.$container).prop('disabled', true);
          $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
          $(selectors.priceWrapper, this.$container).addClass('hide');
          $(selectors.estimatedDateAttr, this.$container).val('')
          $(selectors.estimatedDate, this.$container).hide();
          $(selectors.preorderProp, this.$container).empty();
          return;
        }

        if (variant.available) {
          $(selectors.addToCart, this.$container).prop('disabled', false);
          $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
          $(selectors.addToCart, this.$container).attr('id', 'add');
        } else {
          $(selectors.addToCart, this.$container).prop('disabled', true);
          $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
          $(selectors.addToCart, this.$container).attr('id', 'add-sold-out');
        }
      }

      if($('.bis-button').length) {
        if(variant.available) {
          $('.bis-button').hide();
        } else {
          $('.bis-button').show();
        }
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function (evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);
      var $productStock = $(selectors.productStock, this.$container);

      $(selectors.productPrice, this.$container)
        .html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));
      
      if ($(selectors.preorderJson, this.$container).html() && variant) {
        this.productPreorderObject = JSON.parse($(selectors.preorderJson, this.$container).html());
        var finalSaleData = this.productPreorderObject.finalSaleData;

        if (finalSaleData[variant.id] == true) {
          $productStock.html('Final Sale');
        } else {
          if (variant.inventory_quantity < 4 && variant.inventory_quantity > 0) {
            $productStock.html('Only ' + variant.inventory_quantity + " left!");
          } else {
            $productStock.html('');
          }
        }
      }

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.removeClass('hide');
        $(selectors.productPrice, this.$container).addClass('sale-price');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('hide').removeClass('sale-price');
        $(selectors.productPrice, this.$container).removeClass('sale-price');
      }

	    setTimeout(function(){
        if($('.spurit-po-wrapper').length > 0){
        $('.spurit-po-wrapper').show();
        $('.spo-container').addClass('spurit-hidden');
            }
      },300)
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;
      var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);

      this.$featuredImage.attr('src', sizedImgUrl);
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
  });

  return Product;
})();


/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('hide');
  });

  $('.address-edit-toggle').on('click', function() {
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('hide');
  });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
    document.getElementById("MainContent").scrollIntoView();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
    document.getElementById("MainContent").scrollIntoView();
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();


$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('product', theme.Product);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  /*** Mobile menu */

  $('.trigger-secondary').click(function(){
    $(this).next().fadeIn();
    $(this).closest('.nav-menu').addClass('secondary-open');
  });
  $('.close-secondary').click(function(){
    $(this).closest('.secondary-links').fadeOut();
    $(this).closest('.nav-menu').removeClass('secondary-open');
  });
  $('.mobile-menu-trigger').click(function(){
    $('.mobile-menu').addClass('open');
    $('body').css('overflow-y','hidden');
  });
  $('.mobile-menu .icon-times').click(function(){
    $('.mobile-menu').removeClass('open');
    $('body').css('overflow','');
  });

  //$( '.mobile-nav li:has(ul), .top-nav li:has(ul)' ).doubleTapToGo();

  $('.collection-tab-nav li:first-child .tab-link').addClass('tab-link-active');
  $('.collection-tabs .collection-tab:first-child').addClass('tab-active');

  $('.tab-link').click(function(){
    var tab_id = $(this).data('tab-index');
    //alert(tab_id);
    $('.collection-tab').each(function(){
      $(this).removeClass("tab-active");
    });

    $('.tab-link').each(function(){
      $(this).removeClass("tab-link-active");
    });

    $('.collection-tab[data-tab-index='+ tab_id +']').addClass("tab-active");
    $('.tab-link[data-tab-index='+ tab_id +']').addClass("tab-link-active");
  });

  $('.faq-accordion h3').click(function(){
    $('.faq-qa').not($(this).closest('.faq-qa')).removeClass('open').find('.faq-answer').slideUp();
    if($(this).closest('.faq-qa').hasClass('open')){
      $(this).closest('.faq-qa').removeClass('open').find('.faq-answer').slideUp();
    } else {
      $(this).closest('.faq-qa').addClass('open').find('.faq-answer').slideDown();
    }
  });

  $('.testimonials').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    dots: true,
    prevArrow: ".slider-prev",
    nextArrow: ".slider-next"
  });

  $('.about-press-carousel').slick({
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: ".slider-prev",
    nextArrow: ".slider-next",
    responsive: [
      {
      breakpoint: 992,
        settings: {
          slidesToShow: 3
        }
      },
      {
      breakpoint: 768,
        settings: {
          slidesToShow: 3
        }
      },
      {
      breakpoint: 575,
        settings: {
          slidesToShow: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });

  if($("[data-single-option-selector]").length) { 
    var $last = false;
    $("[data-single-option-selector]").each(function(i) {
      
      var total = $("[data-single-option-selector]").length;
      var $thisSelect = $(this);
      var $indexClass = $(this).data("index");
      if (i === total - 1) {
         $indexClass = $indexClass + " last-option"; 
      }
      var $optionName = $(this).data("option-name");
      $optionName = ' ' + $optionName;
      var $newClass = "js-option-selector-" + i;
      var $newOptions = '<ul class="new-variant-swatches ' + $indexClass + $optionName + '">';
      var $currentOption = '';

      $thisSelect.find("option").each(function() {
        var $this = $(this);
        var $optionText = $this.text();
        var $optionVal = $this.val();
        var $soldOut = this.classList.contains("disabled");

        $newOptions += '<li class="new-variant-swatch js-new-variant-swatch' +
          ($currentOption == $optionVal ? ' is-active' : '') +
          ($soldOut ? ' is-soldout' : '') + '" data-yui="' + $soldOut +'" data-val="' + $optionVal + '" data-select="' + $newClass + '">' +
          $optionText +
          '</li>';
      });

      $thisSelect.addClass("is-hidden").addClass($newClass).after($newOptions + '</ul>');
    });

    $('[data-single-option-selector]').prepend('<option value="">Select An Option</option>')
      .val('')
      .trigger('change');


    $(document).on("click", ".js-new-variant-swatch", function() {

      //if(!$(this).hasClass("is-soldout")) {
        var $this = $(this);
        var $select = $this.attr("data-select");
        var $val = $this.attr("data-val");
        var $parent = $this.parent("ul");

        let update_price = true;

      
      $('.' + $select).val($val).trigger("change");
        $("[data-single-option-selector]").each(function(i, opt) {
          if ($('[data-single-option-selector]').eq(i).val() == '') {
            update_price = false;
          }
        });
        
        if (update_price) {
          $('.initial-price').hide();
          $('.product-prices').addClass('show').show();
        }
        
        $parent.children("li").removeClass("is-active");
        $(this).addClass("is-active");

        let sec = $('.new-variant-swatches.option2 li.is-active');
        let third = $('.new-variant-swatches.option3 li.is-active');
 
        if (sec.length > 0) {
          $('[data-single-option-selector]').eq(1).val(sec.data('val'));
        }
        if (third.length > 0) {
          $('[data-single-option-selector]').eq(2).val(third.data('val'));
        }
        $('[data-single-option-selector]').eq(1).trigger("change");
      //}

      if($('.product-main-image').find("[data-image-variant='" + $val + "']").length) { 
        // Find the slide that corresponds with the selected variant
        $slide = $('.product-main-image').find("[data-image-variant='" + $val + "']");
        // Get the index of that slide
        $slideNum = $slide.attr("data-slick-index");
        // Go to that slide
        $('.product-main-image').slick('slickGoTo', $slideNum ); 
      }

    });

  }

  $('.new-variant-swatch').on('click', function(evt) {
    var dataVal = $(this).data('val');
    //alert(dataVal);
    var variants;
    $("[data-product-select] option").each(function() {
        if (variants) {
          variants = variants + $.trim($(this).text());
        } else { 
          variants = $.trim($(this).text());
        }
    });
    //alert(variants);
  });

  $(".thumbs-slider .item").click(function(e){
      e.preventDefault();
      slideIndex = $(this).attr('data-slick-index');
      slideIndex = parseInt(slideIndex);
      //alert(slideIndex);      
      $( '.product-main-image' ).slick('slickGoTo', slideIndex);
  });

  $(".product-description h6").each(function(){
    $(this).nextUntil("h6").wrapAll('<div class="content"></div>');
  });

  $('.product-description .rte').accordion({
    active: false,
    header: "h6",
    heightStyle: "content",
    collapsible: true,
    activate: function( event, ui ) {
        if(!$.isEmptyObject(ui.newHeader.offset())) {
            $('html:not(:animated), body:not(:animated)').animate({ scrollTop: ui.newHeader.offset().top }, 'slow');
        }
    }
  });

  $('[data-fancybox]').fancybox({
    touch: false
  });

});

window.addEventListener('DOMContentLoaded', (event) => {
  
  if($(window).width() >= 750) {
    $('.featured-collections').each(function(){
      var $module = $(this);
      var update = function(){
        $module.masonry('layout');
      };

      this.addEventListener('load', update, true);

      $module.masonry({
        itemSelector: '.featured-collection',
        transitionDuration: 0
      });
    });
  }
});

$( document ).ready(function() {
jQuery( ".new-variant-swatch" ).click(function() {
window.esc_now_back_in_stock.triggerRefresh();
console.log('clicked');
});
});