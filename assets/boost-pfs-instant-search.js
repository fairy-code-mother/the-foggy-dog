/** VERSION: 1.0.0 Please do not delete this line. Thank you! **/
// Override Settings
var boostPFSInstantSearchConfig = {
	search: {
		//suggestionMode: 'test',
		//suggestionPosition: 'left'
	}
};

(function() {
	BoostPFS.inject(this);

	// Customize style of Suggestion box
	SearchInput.prototype.customizeInstantSearch = function() {
		var suggestionElement = this.$uiMenuElement;
		var searchElement = this.$element;
		var searchBoxId = this.id;
	};

  // Bind Event for input search Mobile
  var bindEventsMobile = InstantSearchMobile.prototype.bindEvents;
  InstantSearchMobile.prototype.bindEvents = function() {
    bindEventsMobile.call(this);

    var self = this;
    var searchButtonMobile = '.site-nav--mobile .search-button, .js-search-destop';
    var searchInputMobile = '.search-input-group input[type="search"], .wg-search-form .search-input';
    var searchCloseButtonMobile = '.drawer__close > button, .drawer_back a';
    jQ(searchButtonMobile).off('click').click(function(e) {
      e.preventDefault();
      //e.stopPropagation();
      jQ(searchInputMobile).focus();
      self.openSuggestionMobile();
      jQ(searchCloseButtonMobile).trigger('click');

    });
  }
  
  // Bind Event for input search style 3
  var bindEvents = InstantSearchStyle3.prototype.bindEvents;
  InstantSearchStyle3.prototype.bindEvents = function() {
    bindEvents.call(this);

    var self = this;
    var searchButtonDesktop = '.site-header__links .search-button';
    var searchInputDesktop = '#SearchContainer #search-input';
    var searchCloseButtonDesktop = '.drawer__close > button';
    jQ(searchButtonDesktop).off('click').click(function(e) {
      e.preventDefault();
      //e.stopPropagation();
      jQ(searchInputDesktop).focus();
      self.openSuggestionStyle3();
      jQ(searchCloseButtonDesktop).trigger('click');

    });
  }

  // Fix search for the Flow theme
  jQ('.site-header__links .search-button').on('click', function() {
    setTimeout(function() {
      boostPFS.initSearchBox();
      if(Utils.isCollectionPage()) jQ('.search-input-group > .boost-pfs-search-box').val('');
    }, 500);
  });

  // Locksmith integration
  InstantSearchApi.afterCallAsync = function (result, callbackInstantSearchApi) {
    /* Call 3rd party api */
    if (typeof window.Locksmith === 'object' && result.products.length > 0) {
      var URLs = [],
        URLsCollection = [],
        totalUrls = [],
        grantedAccess = [],
        grantedAccessCollection = [];
      //Create an array of products URLs
      for (var i = 0; i < result.products.length; i++) {
        URLs.push('/products/' + result.products[i].handle);
      }
      for (var i = 0; i < result.collections.length; i++) {
        URLsCollection.push('/collections/' + result.collections[i].handle);
      }
      totalUrls = URLs.concat(URLsCollection);
      jQ.ajax({
        method: 'GET',
        url: '/apps/locksmith/api/resources',
        data: { urls: totalUrls, },
        timeout: 1500,
        async: false,
        success: function (response) {
          try {
            var resources = JSON.parse(response);
            for (var i = 0; i < URLs.length; i++) {
              //Checks that the response exists
              if (resources[URLs[i]]) {
                //Checks that the access of the product has been granted
                if (typeof resources[URLs[i]] !== 'undefined' && (!resources[URLs[i]].hide_resource || resources[URLs[i]].manual_lock)) {
                  //If the product is accessible add it to the array of the products
                  grantedAccess.push(result.products[i])
                }
              }
            }
            //Change array of products
            result.products = grantedAccess;
            //Same for collections
            for (var i = 0; i < URLsCollection.length; i++) {
              //Checks that the response exists
              if (resources[URLsCollection[i]]) {
                //Checks that the access of the product has been granted
                if (!resources[URLsCollection[i]].hide_resource || resources[URLsCollection[i]].manual_lock) {
                  //If the product is accessible add it to the array of the products
                  grantedAccessCollection.push(result.collections[i])
                }
              }
            }
            //Change array of collections
            result.collections = grantedAccessCollection;
            /* Build everything after getting instant search data */
            callbackInstantSearchApi(result);
          } catch (error) {
            console.error(error);
            callbackFilterApi(result);
          }
        },
        error: function () {
          /* Build everything after getting instant search data */
          callbackInstantSearchApi(result);
        },
      });
    } else {
      callbackInstantSearchApi(result);
    }
  }
  
   /* start-boost-custom */
/* #boost-: Customize instant search results */
InstantSearchApi.beforeCall = function(searchTerm) {
  Globals.instantSearchQueryParams.q = Utils.encodeURIParamValue(unescape(searchTerm || '').replace(/&#x27;/g, '').replace(/&#x26;/g, '').replace(/&#x2A;/gi, ''));
  if (!Globals.instantSearchQueryParams.q) Globals.instantSearchQueryParams.q = searchTerm // avoid breaking the search
}

var searchSubmit = SearchInput.prototype._onSubmit;
  
SearchInput.prototype._onSubmit = function(event, redirect) {
  searchSubmit.call(this, event, redirect);
  
  var term = unescape(Globals.currentTerm || '').replace(/&#x27;/g, '').replace(/&#x26;/g, '').replace(/&#x2A;/gi, '');
  var isApiReturnedResult = Globals.suggestionCache.hasOwnProperty(term);
  
  var redirectUrl = InstantSearchResultRedirect.getSearchRedirectUrl();
  
  if (isApiReturnedResult) {
    if (redirectUrl && !Utils.isBadUrl(redirectUrl)) {
      Utils.setWindowLocation(redirectUrl);
    } else {
      this.isChangePage = true;
      this.$searchForm[0].submit();
    }
  } 
}
/* end-boost-custom */
})();

