  ;
  (function(factory) {
      if (typeof define === 'function' && define.amd) {
          define(['jquery'], factory);
      } else if (typeof exports === 'object') {
          factory(require('jquery'));
      } else {
          factory(window.jQuery || window.Zepto);
      }
  }(function($) {
      var CLOSE_EVENT = 'Close',
          BEFORE_CLOSE_EVENT = 'BeforeClose',
          AFTER_CLOSE_EVENT = 'AfterClose',
          BEFORE_APPEND_EVENT = 'BeforeAppend',
          MARKUP_PARSE_EVENT = 'MarkupParse',
          OPEN_EVENT = 'Open',
          CHANGE_EVENT = 'Change',
          NS = 'mfp',
          EVENT_NS = '.' + NS,
          READY_CLASS = 'mfp-ready',
          REMOVING_CLASS = 'mfp-removing',
          PREVENT_CLOSE_CLASS = 'mfp-prevent-close';
      var mfp, MagnificPopup = function() {},
          _isJQ = !!(window.jQuery),
          _prevStatus, _window = $(window),
          _document, _prevContentType, _wrapClasses, _currPopupType;
      var _mfpOn = function(name, f) {
              mfp.ev.on(NS + name + EVENT_NS, f);
          },
          _getEl = function(className, appendTo, html, raw) {
              var el = document.createElement('div');
              el.className = 'mfp-' + className;
              if (html) {
                  el.innerHTML = html;
              }
              if (!raw) {
                  el = $(el);
                  if (appendTo) {
                      el.appendTo(appendTo);
                  }
              } else if (appendTo) {
                  appendTo.appendChild(el);
              }
              return el;
          },
          _mfpTrigger = function(e, data) {
              mfp.ev.triggerHandler(NS + e, data);
              if (mfp.st.callbacks) {
                  e = e.charAt(0).toLowerCase() + e.slice(1);
                  if (mfp.st.callbacks[e]) {
                      mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
                  }
              }
          },
          _getCloseBtn = function(type) {
              if (type !== _currPopupType || !mfp.currTemplate.closeBtn) {
                  mfp.currTemplate.closeBtn = $(mfp.st.closeMarkup.replace('%title%', mfp.st.tClose));
                  _currPopupType = type;
              }
              return mfp.currTemplate.closeBtn;
          },
          _checkInstance = function() {
              if (!$.magnificPopup.instance) {
                  mfp = new MagnificPopup();
                  mfp.init();
                  $.magnificPopup.instance = mfp;
              }
          },
          supportsTransitions = function() {
              var s = document.createElement('p').style,
                  v = ['ms', 'O', 'Moz', 'Webkit'];
              if (s['transition'] !== undefined) {
                  return true;
              }
              while (v.length) {
                  if (v.pop() + 'Transition' in s) {
                      return true;
                  }
              }
              return false;
          };
      MagnificPopup.prototype = {
          constructor: MagnificPopup,
          init: function() {
              var appVersion = navigator.appVersion;
              mfp.isIE7 = appVersion.indexOf("MSIE 7.") !== -1;
              mfp.isIE8 = appVersion.indexOf("MSIE 8.") !== -1;
              mfp.isLowIE = mfp.isIE7 || mfp.isIE8;
              mfp.isAndroid = (/android/gi).test(appVersion);
              mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
              mfp.supportsTransition = supportsTransitions();
              mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent));
              _document = $(document);
              mfp.popupsCache = {};
          },
          open: function(data) {
              var i;
              if (data.isObj === false) {
                  mfp.items = data.items.toArray();
                  mfp.index = 0;
                  var items = data.items,
                      item;
                  for (i = 0; i < items.length; i++) {
                      item = items[i];
                      if (item.parsed) {
                          item = item.el[0];
                      }
                      if (item === data.el[0]) {
                          mfp.index = i;
                          break;
                      }
                  }
              } else {
                  mfp.items = $.isArray(data.items) ? data.items : [data.items];
                  mfp.index = data.index || 0;
              }
              if (mfp.isOpen) {
                  mfp.updateItemHTML();
                  return;
              }
              mfp.types = [];
              _wrapClasses = '';
              if (data.mainEl && data.mainEl.length) {
                  mfp.ev = data.mainEl.eq(0);
              } else {
                  mfp.ev = _document;
              }
              if (data.key) {
                  if (!mfp.popupsCache[data.key]) {
                      mfp.popupsCache[data.key] = {};
                  }
                  mfp.currTemplate = mfp.popupsCache[data.key];
              } else {
                  mfp.currTemplate = {};
              }
              mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data);
              mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;
              if (mfp.st.modal) {
                  mfp.st.closeOnContentClick = false;
                  mfp.st.closeOnBgClick = false;
                  mfp.st.showCloseBtn = false;
                  mfp.st.enableEscapeKey = false;
              }
              if (!mfp.bgOverlay) {
                  mfp.bgOverlay = _getEl('bg').on('click' + EVENT_NS, function() {
                      mfp.close();
                  });
                  mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click' + EVENT_NS, function(e) {
                      if (mfp._checkIfClose(e.target)) {
                          mfp.close();
                      }
                  });
                  mfp.container = _getEl('container', mfp.wrap);
              }
              mfp.contentContainer = _getEl('content');
              if (mfp.st.preloader) {
                  mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
              }
              var modules = $.magnificPopup.modules;
              for (i = 0; i < modules.length; i++) {
                  var n = modules[i];
                  n = n.charAt(0).toUpperCase() + n.slice(1);
                  mfp['init' + n].call(mfp);
              }
              _mfpTrigger('BeforeOpen');
              if (mfp.st.showCloseBtn) {
                  if (!mfp.st.closeBtnInside) {
                      mfp.wrap.append(_getCloseBtn());
                  } else {
                      _mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
                          values.close_replaceWith = _getCloseBtn(item.type);
                      });
                      _wrapClasses += ' mfp-close-btn-in';
                  }
              }
              if (mfp.st.alignTop) {
                  _wrapClasses += ' mfp-align-top';
              }
              if (mfp.fixedContentPos) {
                  mfp.wrap.css({
                      overflow: mfp.st.overflowY,
                      overflowX: 'hidden',
                      overflowY: mfp.st.overflowY
                  });
              } else {
                  mfp.wrap.css({
                      top: _window.scrollTop(),
                      position: 'absolute'
                  });
              }
              if (mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos)) {
                  mfp.bgOverlay.css({
                      height: _document.height(),
                      position: 'absolute'
                  });
              }
              if (mfp.st.enableEscapeKey) {
                  _document.on('keyup' + EVENT_NS, function(e) {
                      if (e.keyCode === 27) {
                          mfp.close();
                      }
                  });
              }
              _window.on('resize' + EVENT_NS, function() {
                  mfp.updateSize();
              });
              if (!mfp.st.closeOnContentClick) {
                  _wrapClasses += ' mfp-auto-cursor';
              }
              if (_wrapClasses)
                  mfp.wrap.addClass(_wrapClasses);
              var windowHeight = mfp.wH = _window.height();
              var windowStyles = {};
              if (mfp.fixedContentPos) {
                  if (mfp._hasScrollBar(windowHeight)) {
                      var s = mfp._getScrollbarSize();
                      if (s) {
                          windowStyles.marginRight = s;
                      }
                  }
              }
              if (mfp.fixedContentPos) {
                  if (!mfp.isIE7) {
                      windowStyles.overflow = 'hidden';
                  } else {
                      $('body, html').css('overflow', 'hidden');
                  }
              }
              var classesToadd = mfp.st.mainClass;
              if (mfp.isIE7) {
                  classesToadd += ' mfp-ie7';
              }
              if (classesToadd) {
                  mfp._addClassToMFP(classesToadd);
              }
              mfp.updateItemHTML();
              _mfpTrigger('BuildControls');
              $('html').css(windowStyles);
              mfp.bgOverlay.add(mfp.wrap).prependTo(mfp.st.prependTo || $(document.body));
              mfp._lastFocusedEl = document.activeElement;
              setTimeout(function() {
                  if (mfp.content) {
                      mfp._addClassToMFP(READY_CLASS);
                      mfp._setFocus();
                  } else {
                      mfp.bgOverlay.addClass(READY_CLASS);
                  }
                  _document.on('focusin' + EVENT_NS, mfp._onFocusIn);
              }, 16);
              mfp.isOpen = true;
              mfp.updateSize(windowHeight);
              _mfpTrigger(OPEN_EVENT);
              return data;
          },
          close: function() {
              if (!mfp.isOpen) return;
              _mfpTrigger(BEFORE_CLOSE_EVENT);
              mfp.isOpen = false;
              if (mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition) {
                  mfp._addClassToMFP(REMOVING_CLASS);
                  setTimeout(function() {
                      mfp._close();
                  }, mfp.st.removalDelay);
              } else {
                  mfp._close();
              }
          },
          _close: function() {
              _mfpTrigger(CLOSE_EVENT);
              var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';
              mfp.bgOverlay.detach();
              mfp.wrap.detach();
              mfp.container.empty();
              if (mfp.st.mainClass) {
                  classesToRemove += mfp.st.mainClass + ' ';
              }
              mfp._removeClassFromMFP(classesToRemove);
              if (mfp.fixedContentPos) {
                  var windowStyles = {
                      marginRight: ''
                  };
                  if (mfp.isIE7) {
                      $('body, html').css('overflow', '');
                  } else {
                      windowStyles.overflow = '';
                  }
                  $('html').css(windowStyles);
              }
              _document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
              mfp.ev.off(EVENT_NS);
              mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
              mfp.bgOverlay.attr('class', 'mfp-bg');
              mfp.container.attr('class', 'mfp-container');
              if (mfp.st.showCloseBtn && (!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
                  if (mfp.currTemplate.closeBtn)
                      mfp.currTemplate.closeBtn.detach();
              }
              if (mfp._lastFocusedEl) {
                  $(mfp._lastFocusedEl).focus();
              }
              mfp.currItem = null;
              mfp.content = null;
              mfp.currTemplate = null;
              mfp.prevHeight = 0;
              _mfpTrigger(AFTER_CLOSE_EVENT);
          },
          updateSize: function(winHeight) {
              if (mfp.isIOS) {
                  var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
                  var height = window.innerHeight * zoomLevel;
                  mfp.wrap.css('height', height);
                  mfp.wH = height;
              } else {
                  mfp.wH = winHeight || _window.height();
              }
              if (!mfp.fixedContentPos) {
                  mfp.wrap.css('height', mfp.wH);
              }
              _mfpTrigger('Resize');
          },
          updateItemHTML: function() {
              var item = mfp.items[mfp.index];
              mfp.contentContainer.detach();
              if (mfp.content)
                  mfp.content.detach();
              if (!item.parsed) {
                  item = mfp.parseEl(mfp.index);
              }
              var type = item.type;
              _mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
              mfp.currItem = item;
              if (!mfp.currTemplate[type]) {
                  var markup = mfp.st[type] ? mfp.st[type].markup : false;
                  _mfpTrigger('FirstMarkupParse', markup);
                  if (markup) {
                      mfp.currTemplate[type] = $(markup);
                  } else {
                      mfp.currTemplate[type] = true;
                  }
              }
              if (_prevContentType && _prevContentType !== item.type) {
                  mfp.container.removeClass('mfp-' + _prevContentType + '-holder');
              }
              var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
              mfp.appendContent(newContent, type);
              item.preloaded = true;
              _mfpTrigger(CHANGE_EVENT, item);
              _prevContentType = item.type;
              mfp.container.prepend(mfp.contentContainer);
              _mfpTrigger('AfterChange');
          },
          appendContent: function(newContent, type) {
              mfp.content = newContent;
              if (newContent) {
                  if (mfp.st.showCloseBtn && mfp.st.closeBtnInside && mfp.currTemplate[type] === true) {
                      if (!mfp.content.find('.mfp-close').length) {
                          mfp.content.append(_getCloseBtn());
                      }
                  } else {
                      mfp.content = newContent;
                  }
              } else {
                  mfp.content = '';
              }
              _mfpTrigger(BEFORE_APPEND_EVENT);
              mfp.container.addClass('mfp-' + type + '-holder');
              mfp.contentContainer.append(mfp.content);
          },
          parseEl: function(index) {
              var item = mfp.items[index],
                  type;
              if (item.tagName) {
                  item = {
                      el: $(item)
                  };
              } else {
                  type = item.type;
                  item = {
                      data: item,
                      src: item.src
                  };
              }
              if (item.el) {
                  var types = mfp.types;
                  for (var i = 0; i < types.length; i++) {
                      if (item.el.hasClass('mfp-' + types[i])) {
                          type = types[i];
                          break;
                      }
                  }
                  item.src = item.el.attr('data-mfp-src');
                  if (!item.src) {
                      item.src = item.el.attr('href');
                  }
              }
              item.type = type || mfp.st.type || 'inline';
              item.index = index;
              item.parsed = true;
              mfp.items[index] = item;
              _mfpTrigger('ElementParse', item);
              return mfp.items[index];
          },
          addGroup: function(el, options) {
              var eHandler = function(e) {
                  e.mfpEl = this;
                  mfp._openClick(e, el, options);
              };
              if (!options) {
                  options = {};
              }
              var eName = 'click.magnificPopup';
              options.mainEl = el;
              if (options.items) {
                  options.isObj = true;
                  el.off(eName).on(eName, eHandler);
              } else {
                  options.isObj = false;
                  if (options.delegate) {
                      el.off(eName).on(eName, options.delegate, eHandler);
                  } else {
                      options.items = el;
                      el.off(eName).on(eName, eHandler);
                  }
              }
          },
          _openClick: function(e, el, options) {
              var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;
              if (!midClick && (e.which === 2 || e.ctrlKey || e.metaKey)) {
                  return;
              }
              var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;
              if (disableOn) {
                  if ($.isFunction(disableOn)) {
                      if (!disableOn.call(mfp)) {
                          return true;
                      }
                  } else {
                      if (_window.width() < disableOn) {
                          return true;
                      }
                  }
              }
              if (e.type) {
                  e.preventDefault();
                  if (mfp.isOpen) {
                      e.stopPropagation();
                  }
              }
              options.el = $(e.mfpEl);
              if (options.delegate) {
                  options.items = el.find(options.delegate);
              }
              mfp.open(options);
          },
          updateStatus: function(status, text) {
              if (mfp.preloader) {
                  if (_prevStatus !== status) {
                      mfp.container.removeClass('mfp-s-' + _prevStatus);
                  }
                  if (!text && status === 'loading') {
                      text = mfp.st.tLoading;
                  }
                  var data = {
                      status: status,
                      text: text
                  };
                  _mfpTrigger('UpdateStatus', data);
                  status = data.status;
                  text = data.text;
                  mfp.preloader.html(text);
                  mfp.preloader.find('a').on('click', function(e) {
                      e.stopImmediatePropagation();
                  });
                  mfp.container.addClass('mfp-s-' + status);
                  _prevStatus = status;
              }
          },
          _checkIfClose: function(target) {
              if ($(target).hasClass(PREVENT_CLOSE_CLASS)) {
                  return;
              }
              var closeOnContent = mfp.st.closeOnContentClick;
              var closeOnBg = mfp.st.closeOnBgClick;
              if (closeOnContent && closeOnBg) {
                  return true;
              } else {
                  if (!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0])) {
                      return true;
                  }
                  if ((target !== mfp.content[0] && !$.contains(mfp.content[0], target))) {
                      if (closeOnBg) {
                          if ($.contains(document, target)) {
                              return true;
                          }
                      }
                  } else if (closeOnContent) {
                      return true;
                  }
              }
              return false;
          },
          _addClassToMFP: function(cName) {
              mfp.bgOverlay.addClass(cName);
              mfp.wrap.addClass(cName);
          },
          _removeClassFromMFP: function(cName) {
              this.bgOverlay.removeClass(cName);
              mfp.wrap.removeClass(cName);
          },
          _hasScrollBar: function(winHeight) {
              return ((mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()));
          },
          _setFocus: function() {
              (mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
          },
          _onFocusIn: function(e) {
              if (e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target)) {
                  mfp._setFocus();
                  return false;
              }
          },
          _parseMarkup: function(template, values, item) {
              var arr;
              if (item.data) {
                  values = $.extend(item.data, values);
              }
              _mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item]);
              $.each(values, function(key, value) {
                  if (value === undefined || value === false) {
                      return true;
                  }
                  arr = key.split('_');
                  if (arr.length > 1) {
                      var el = template.find(EVENT_NS + '-' + arr[0]);
                      if (el.length > 0) {
                          var attr = arr[1];
                          if (attr === 'replaceWith') {
                              if (el[0] !== value[0]) {
                                  el.replaceWith(value);
                              }
                          } else if (attr === 'img') {
                              if (el.is('img')) {
                                  el.attr('src', value);
                              } else {
                                  el.replaceWith('<img src="' + value + '" class="' + el.attr('class') + '" />');
                              }
                          } else {
                              el.attr(arr[1], value);
                          }
                      }
                  } else {
                      template.find(EVENT_NS + '-' + key).html(value);
                  }
              });
          },
          _getScrollbarSize: function() {
              if (mfp.scrollbarSize === undefined) {
                  var scrollDiv = document.createElement("div");
                  scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
                  document.body.appendChild(scrollDiv);
                  mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                  document.body.removeChild(scrollDiv);
              }
              return mfp.scrollbarSize;
          }
      };
      $.magnificPopup = {
          instance: null,
          proto: MagnificPopup.prototype,
          modules: [],
          open: function(options, index) {
              _checkInstance();
              if (!options) {
                  options = {};
              } else {
                  options = $.extend(true, {}, options);
              }
              options.isObj = true;
              options.index = index || 0;
              return this.instance.open(options);
          },
          close: function() {
              return $.magnificPopup.instance && $.magnificPopup.instance.close();
          },
          registerModule: function(name, module) {
              if (module.options) {
                  $.magnificPopup.defaults[name] = module.options;
              }
              $.extend(this.proto, module.proto);
              this.modules.push(name);
          },
          defaults: {
              disableOn: 0,
              key: null,
              midClick: false,
              mainClass: '',
              preloader: true,
              focus: '',
              closeOnContentClick: false,
              closeOnBgClick: true,
              closeBtnInside: true,
              showCloseBtn: true,
              enableEscapeKey: true,
              modal: false,
              alignTop: false,
              removalDelay: 0,
              prependTo: null,
              fixedContentPos: 'auto',
              fixedBgPos: 'auto',
              overflowY: 'auto',
              closeMarkup: '<a title="%title%" class="mfp-close"></a>',
              tClose: 'Close (Esc)',
              tLoading: '<i class="fa fa-circle-o-notch fa-spin"></i>'
          }
      };
      $.fn.magnificPopup = function(options) {
          _checkInstance();
          var jqEl = $(this);
          if (typeof options === "string") {
              if (options === 'open') {
                  var items, itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
                      index = parseInt(arguments[1], 10) || 0;
                  if (itemOpts.items) {
                      items = itemOpts.items[index];
                  } else {
                      items = jqEl;
                      if (itemOpts.delegate) {
                          items = items.find(itemOpts.delegate);
                      }
                      items = items.eq(index);
                  }
                  mfp._openClick({
                      mfpEl: items
                  }, jqEl, itemOpts);
              } else {
                  if (mfp.isOpen)
                      mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
              }
          } else {
              options = $.extend(true, {}, options);
              if (_isJQ) {
                  jqEl.data('magnificPopup', options);
              } else {
                  jqEl[0].magnificPopup = options;
              }
              mfp.addGroup(jqEl, options);
          }
          return jqEl;
      };
      var INLINE_NS = 'inline',
          _hiddenClass, _inlinePlaceholder, _lastInlineElement, _putInlineElementsBack = function() {
              if (_lastInlineElement) {
                  _inlinePlaceholder.after(_lastInlineElement.addClass(_hiddenClass)).detach();
                  _lastInlineElement = null;
              }
          };
      $.magnificPopup.registerModule(INLINE_NS, {
          options: {
              hiddenClass: 'hide',
              markup: '',
              tNotFound: 'Content not found'
          },
          proto: {
              initInline: function() {
                  mfp.types.push(INLINE_NS);
                  _mfpOn(CLOSE_EVENT + '.' + INLINE_NS, function() {
                      _putInlineElementsBack();
                  });
              },
              getInline: function(item, template) {
                  _putInlineElementsBack();
                  if (item.src) {
                      var inlineSt = mfp.st.inline,
                          el = $(item.src);
                      if (el.length) {
                          var parent = el[0].parentNode;
                          if (parent && parent.tagName) {
                              if (!_inlinePlaceholder) {
                                  _hiddenClass = inlineSt.hiddenClass;
                                  _inlinePlaceholder = _getEl(_hiddenClass);
                                  _hiddenClass = 'mfp-' + _hiddenClass;
                              }
                              _lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
                          }
                          mfp.updateStatus('ready');
                      } else {
                          mfp.updateStatus('error', inlineSt.tNotFound);
                          el = $('<div>');
                      }
                      item.inlineElement = el;
                      return el;
                  }
                  mfp.updateStatus('ready');
                  mfp._parseMarkup(template, {}, item);
                  return template;
              }
          }
      });
      var AJAX_NS = 'ajax',
          _ajaxCur, _removeAjaxCursor = function() {
              if (_ajaxCur) {
                  $(document.body).removeClass(_ajaxCur);
              }
          },
          _destroyAjaxRequest = function() {
              _removeAjaxCursor();
              if (mfp.req) {
                  mfp.req.abort();
              }
          };
      $.magnificPopup.registerModule(AJAX_NS, {
          options: {
              settings: null,
              cursor: 'mfp-ajax-cur',
              tError: '<a href="%url%">The content</a> could not be loaded.'
          },
          proto: {
              initAjax: function() {
                  mfp.types.push(AJAX_NS);
                  _ajaxCur = mfp.st.ajax.cursor;
                  _mfpOn(CLOSE_EVENT + '.' + AJAX_NS, _destroyAjaxRequest);
                  _mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
              },
              getAjax: function(item) {
                  if (_ajaxCur) {
                      $(document.body).addClass(_ajaxCur);
                  }
                  mfp.updateStatus('loading');
                  var opts = $.extend({
                      url: item.src,
                      success: function(data, textStatus, jqXHR) {
                          var temp = {
                              data: data,
                              xhr: jqXHR
                          };
                          _mfpTrigger('ParseAjax', temp);
                          mfp.appendContent($(temp.data), AJAX_NS);
                          item.finished = true;
                          _removeAjaxCursor();
                          mfp._setFocus();
                          setTimeout(function() {
                              mfp.wrap.addClass(READY_CLASS);
                          }, 16);
                          mfp.updateStatus('ready');
                          _mfpTrigger('AjaxContentAdded');
                      },
                      error: function() {
                          _removeAjaxCursor();
                          item.finished = item.loadError = true;
                          mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
                      }
                  }, mfp.st.ajax.settings);
                  mfp.req = $.ajax(opts);
                  return '';
              }
          }
      });
      var _imgInterval, _getTitle = function(item) {
          if (item.data && item.data.title !== undefined)
              return item.data.title;
          var src = mfp.st.image.titleSrc;
          if (src) {
              if ($.isFunction(src)) {
                  return src.call(mfp, item);
              } else if (item.el) {
                  return item.el.attr(src) || '';
              }
          }
          return '';
      };
      $.magnificPopup.registerModule('image', {
          options: {
              markup: '<div class="mfp-figure">' + '<div class="mfp-close"></div>' + '<figure>' + '<div class="mfp-img"></div>' + '<figcaption>' + '<div class="mfp-bottom-bar">' + '<div class="mfp-title"></div>' + '<div class="mfp-counter"></div>' + '</div>' + '</figcaption>' + '</figure>' + '</div>',
              cursor: 'mfp-zoom-out-cur',
              titleSrc: 'title',
              verticalFit: true,
              tError: '<a href="%url%">The image</a> could not be loaded.'
          },
          proto: {
              initImage: function() {
                  var imgSt = mfp.st.image,
                      ns = '.image';
                  mfp.types.push('image');
                  _mfpOn(OPEN_EVENT + ns, function() {
                      if (mfp.currItem.type === 'image' && imgSt.cursor) {
                          $(document.body).addClass(imgSt.cursor);
                      }
                  });
                  _mfpOn(CLOSE_EVENT + ns, function() {
                      if (imgSt.cursor) {
                          $(document.body).removeClass(imgSt.cursor);
                      }
                      _window.off('resize' + EVENT_NS);
                  });
                  _mfpOn('Resize' + ns, mfp.resizeImage);
                  if (mfp.isLowIE) {
                      _mfpOn('AfterChange', mfp.resizeImage);
                  }
              },
              resizeImage: function() {
                  var item = mfp.currItem;
                  if (!item || !item.img) return;
                  if (mfp.st.image.verticalFit) {
                      var decr = 0;
                      if (mfp.isLowIE) {
                          decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'), 10);
                      }
                      item.img.css('max-height', parseInt(mfp.wH - decr - 30));
                  }
              },
              _onImageHasSize: function(item) {
                  if (item.img) {
                      item.hasSize = true;
                      if (_imgInterval) {
                          clearInterval(_imgInterval);
                      }
                      item.isCheckingImgSize = false;
                      _mfpTrigger('ImageHasSize', item);
                      if (item.imgHidden) {
                          if (mfp.content)
                              mfp.content.removeClass('mfp-loading');
                          item.imgHidden = false;
                      }
                  }
              },
              findImageSize: function(item) {
                  var counter = 0,
                      img = item.img[0],
                      mfpSetInterval = function(delay) {
                          if (_imgInterval) {
                              clearInterval(_imgInterval);
                          }
                          _imgInterval = setInterval(function() {
                              if (img.naturalWidth > 0) {
                                  mfp._onImageHasSize(item);
                                  return;
                              }
                              if (counter > 200) {
                                  clearInterval(_imgInterval);
                              }
                              counter++;
                              if (counter === 3) {
                                  mfpSetInterval(10);
                              } else if (counter === 40) {
                                  mfpSetInterval(50);
                              } else if (counter === 100) {
                                  mfpSetInterval(500);
                              }
                          }, delay);
                      };
                  mfpSetInterval(1);
              },
              getImage: function(item, template) {
                  var guard = 0,
                      onLoadComplete = function() {
                          if (item) {
                              if (item.img[0].complete) {
                                  item.img.off('.mfploader');
                                  if (item === mfp.currItem) {
                                      mfp._onImageHasSize(item);
                                      mfp.updateStatus('ready');
                                  }
                                  item.hasSize = true;
                                  item.loaded = true;
                                  _mfpTrigger('ImageLoadComplete');
                              } else {
                                  guard++;
                                  if (guard < 200) {
                                      setTimeout(onLoadComplete, 100);
                                  } else {
                                      onLoadError();
                                  }
                              }
                          }
                      },
                      onLoadError = function() {
                          if (item) {
                              item.img.off('.mfploader');
                              if (item === mfp.currItem) {
                                  mfp._onImageHasSize(item);
                                  mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src));
                              }
                              item.hasSize = true;
                              item.loaded = true;
                              item.loadError = true;
                          }
                      },
                      imgSt = mfp.st.image;
                  var el = template.find('.mfp-img');
                  if (el.length) {
                      var img = document.createElement('img');
                      img.className = 'mfp-img';
                      if (item.el && item.el.find('img').length) {
                          img.alt = item.el.find('img').attr('alt');
                      }
                      item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
                      img.src = item.src;
                      if (el.is('img')) {
                          item.img = item.img.clone();
                      }
                      img = item.img[0];
                      if (img.naturalWidth > 0) {
                          item.hasSize = true;
                      } else if (!img.width) {
                          item.hasSize = false;
                      }
                  }
                  mfp._parseMarkup(template, {
                      title: _getTitle(item),
                      img_replaceWith: item.img
                  }, item);
                  mfp.resizeImage();
                  if (item.hasSize) {
                      if (_imgInterval) clearInterval(_imgInterval);
                      if (item.loadError) {
                          template.addClass('mfp-loading');
                          mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src));
                      } else {
                          template.removeClass('mfp-loading');
                          mfp.updateStatus('ready');
                      }
                      return template;
                  }
                  mfp.updateStatus('loading');
                  item.loading = true;
                  if (!item.hasSize) {
                      item.imgHidden = true;
                      template.addClass('mfp-loading');
                      mfp.findImageSize(item);
                  }
                  return template;
              }
          }
      });
      var hasMozTransform, getHasMozTransform = function() {
          if (hasMozTransform === undefined) {
              hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
          }
          return hasMozTransform;
      };
      $.magnificPopup.registerModule('zoom', {
          options: {
              enabled: false,
              easing: 'ease-in-out',
              duration: 300,
              opener: function(element) {
                  return element.is('img') ? element : element.find('img');
              }
          },
          proto: {
              initZoom: function() {
                  var zoomSt = mfp.st.zoom,
                      ns = '.zoom',
                      image;
                  if (!zoomSt.enabled || !mfp.supportsTransition) {
                      return;
                  }
                  var duration = zoomSt.duration,
                      getElToAnimate = function(image) {
                          var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
                              transition = 'all ' + (zoomSt.duration / 1000) + 's ' + zoomSt.easing,
                              cssObj = {
                                  position: 'fixed',
                                  zIndex: 9999,
                                  left: 0,
                                  top: 0,
                                  '-webkit-backface-visibility': 'hidden'
                              },
                              t = 'transition';
                          cssObj['-webkit-' + t] = cssObj['-moz-' + t] = cssObj['-o-' + t] = cssObj[t] = transition;
                          newImg.css(cssObj);
                          return newImg;
                      },
                      showMainContent = function() {
                          mfp.content.css('visibility', 'visible');
                      },
                      openTimeout, animatedImg;
                  _mfpOn('BuildControls' + ns, function() {
                      if (mfp._allowZoom()) {
                          clearTimeout(openTimeout);
                          mfp.content.css('visibility', 'hidden');
                          image = mfp._getItemToZoom();
                          if (!image) {
                              showMainContent();
                              return;
                          }
                          animatedImg = getElToAnimate(image);
                          animatedImg.css(mfp._getOffset());
                          mfp.wrap.append(animatedImg);
                          openTimeout = setTimeout(function() {
                              animatedImg.css(mfp._getOffset(true));
                              openTimeout = setTimeout(function() {
                                  showMainContent();
                                  setTimeout(function() {
                                      animatedImg.remove();
                                      image = animatedImg = null;
                                      _mfpTrigger('ZoomAnimationEnded');
                                  }, 16);
                              }, duration);
                          }, 16);
                      }
                  });
                  _mfpOn(BEFORE_CLOSE_EVENT + ns, function() {
                      if (mfp._allowZoom()) {
                          clearTimeout(openTimeout);
                          mfp.st.removalDelay = duration;
                          if (!image) {
                              image = mfp._getItemToZoom();
                              if (!image) {
                                  return;
                              }
                              animatedImg = getElToAnimate(image);
                          }
                          animatedImg.css(mfp._getOffset(true));
                          mfp.wrap.append(animatedImg);
                          mfp.content.css('visibility', 'hidden');
                          setTimeout(function() {
                              animatedImg.css(mfp._getOffset());
                          }, 16);
                      }
                  });
                  _mfpOn(CLOSE_EVENT + ns, function() {
                      if (mfp._allowZoom()) {
                          showMainContent();
                          if (animatedImg) {
                              animatedImg.remove();
                          }
                          image = null;
                      }
                  });
              },
              _allowZoom: function() {
                  return mfp.currItem.type === 'image';
              },
              _getItemToZoom: function() {
                  if (mfp.currItem.hasSize) {
                      return mfp.currItem.img;
                  } else {
                      return false;
                  }
              },
              _getOffset: function(isLarge) {
                  var el;
                  if (isLarge) {
                      el = mfp.currItem.img;
                  } else {
                      el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
                  }
                  var offset = el.offset();
                  var paddingTop = parseInt(el.css('padding-top'), 10);
                  var paddingBottom = parseInt(el.css('padding-bottom'), 10);
                  offset.top -= ($(window).scrollTop() - paddingTop);
                  var obj = {
                      width: el.width(),
                      height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
                  };
                  if (getHasMozTransform()) {
                      obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
                  } else {
                      obj.left = offset.left;
                      obj.top = offset.top;
                  }
                  return obj;
              }
          }
      });
      var IFRAME_NS = 'iframe',
          _emptyPage = '//about:blank',
          _fixIframeBugs = function(isShowing) {
              if (mfp.currTemplate[IFRAME_NS]) {
                  var el = mfp.currTemplate[IFRAME_NS].find('iframe');
                  if (el.length) {
                      if (!isShowing) {
                          el[0].src = _emptyPage;
                      }
                      if (mfp.isIE8) {
                          el.css('display', isShowing ? 'block' : 'none');
                      }
                  }
              }
          };
      $.magnificPopup.registerModule(IFRAME_NS, {
          options: {
              markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>' + '</div>',
              srcAction: 'iframe_src',
              patterns: {
                  youtube: {
                      index: 'youtube.com',
                      id: 'v=',
                      src: '//www.youtube.com/embed/%id%?autoplay=1'
                  },
                  vimeo: {
                      index: 'vimeo.com/',
                      id: '/',
                      src: '//player.vimeo.com/video/%id%?autoplay=1'
                  },
                  gmaps: {
                      index: '//maps.google.',
                      src: '%id%&output=embed'
                  }
              }
          },
          proto: {
              initIframe: function() {
                  mfp.types.push(IFRAME_NS);
                  _mfpOn('BeforeChange', function(e, prevType, newType) {
                      if (prevType !== newType) {
                          if (prevType === IFRAME_NS) {
                              _fixIframeBugs();
                          } else if (newType === IFRAME_NS) {
                              _fixIframeBugs(true);
                          }
                      }
                  });
                  _mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
                      _fixIframeBugs();
                  });
              },
              getIframe: function(item, template) {
                  var embedSrc = item.src;
                  var iframeSt = mfp.st.iframe;
                  $.each(iframeSt.patterns, function() {
                      if (embedSrc.indexOf(this.index) > -1) {
                          if (this.id) {
                              if (typeof this.id === 'string') {
                                  embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id) + this.id.length, embedSrc.length);
                              } else {
                                  embedSrc = this.id.call(this, embedSrc);
                              }
                          }
                          embedSrc = this.src.replace('%id%', embedSrc);
                          return false;
                      }
                  });
                  var dataObj = {};
                  if (iframeSt.srcAction) {
                      dataObj[iframeSt.srcAction] = embedSrc;
                  }
                  mfp._parseMarkup(template, dataObj, item);
                  mfp.updateStatus('ready');
                  return template;
              }
          }
      });
      var _getLoopedId = function(index) {
              var numSlides = mfp.items.length;
              if (index > numSlides - 1) {
                  return index - numSlides;
              } else if (index < 0) {
                  return numSlides + index;
              }
              return index;
          },
          _replaceCurrTotal = function(text, curr, total) {
              return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
          };
      $.magnificPopup.registerModule('gallery', {
          options: {
              enabled: false,
              arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
              preload: [0, 2],
              navigateByImgClick: true,
              arrows: true,
              tPrev: 'Previous (Left arrow key)',
              tNext: 'Next (Right arrow key)',
              tCounter: '%curr% / %total%'
          },
          proto: {
              initGallery: function() {
                  var gSt = mfp.st.gallery,
                      ns = '.mfp-gallery',
                      supportsFastClick = Boolean($.fn.mfpFastClick);
                  mfp.direction = true;
                  if (!gSt || !gSt.enabled) return false;
                  _wrapClasses += ' mfp-gallery';
                  _mfpOn(OPEN_EVENT + ns, function() {
                      if (gSt.navigateByImgClick) {
                          mfp.wrap.on('click' + ns, '.mfp-img', function() {
                              if (mfp.items.length > 1) {
                                  mfp.next();
                                  return false;
                              }
                          });
                      }
                      _document.on('keydown' + ns, function(e) {
                          if (e.keyCode === 37) {
                              mfp.prev();
                          } else if (e.keyCode === 39) {
                              mfp.next();
                          }
                      });
                  });
                  _mfpOn('UpdateStatus' + ns, function(e, data) {
                      if (data.text) {
                          data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
                      }
                  });
                  _mfpOn(MARKUP_PARSE_EVENT + ns, function(e, element, values, item) {
                      var l = mfp.items.length;
                      values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
                  });
                  _mfpOn('BuildControls' + ns, function() {
                      if (mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
                          var markup = gSt.arrowMarkup,
                              arrowLeft = mfp.arrowLeft = $(markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left')).addClass(PREVENT_CLOSE_CLASS),
                              arrowRight = mfp.arrowRight = $(markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right')).addClass(PREVENT_CLOSE_CLASS);
                          var eName = supportsFastClick ? 'mfpFastClick' : 'click';
                          arrowLeft[eName](function() {
                              mfp.prev();
                          });
                          arrowRight[eName](function() {
                              mfp.next();
                          });
                          if (mfp.isIE7) {
                              _getEl('b', arrowLeft[0], false, true);
                              _getEl('a', arrowLeft[0], false, true);
                              _getEl('b', arrowRight[0], false, true);
                              _getEl('a', arrowRight[0], false, true);
                          }
                          mfp.container.append(arrowLeft.add(arrowRight));
                      }
                  });
                  _mfpOn(CHANGE_EVENT + ns, function() {
                      if (mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);
                      mfp._preloadTimeout = setTimeout(function() {
                          mfp.preloadNearbyImages();
                          mfp._preloadTimeout = null;
                      }, 16);
                  });
                  _mfpOn(CLOSE_EVENT + ns, function() {
                      _document.off(ns);
                      mfp.wrap.off('click' + ns);
                      if (mfp.arrowLeft && supportsFastClick) {
                          mfp.arrowLeft.add(mfp.arrowRight).destroyMfpFastClick();
                      }
                      mfp.arrowRight = mfp.arrowLeft = null;
                  });
              },
              next: function() {
                  mfp.direction = true;
                  mfp.index = _getLoopedId(mfp.index + 1);
                  mfp.updateItemHTML();
              },
              prev: function() {
                  mfp.direction = false;
                  mfp.index = _getLoopedId(mfp.index - 1);
                  mfp.updateItemHTML();
              },
              goTo: function(newIndex) {
                  mfp.direction = (newIndex >= mfp.index);
                  mfp.index = newIndex;
                  mfp.updateItemHTML();
              },
              preloadNearbyImages: function() {
                  var p = mfp.st.gallery.preload,
                      preloadBefore = Math.min(p[0], mfp.items.length),
                      preloadAfter = Math.min(p[1], mfp.items.length),
                      i;
                  for (i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
                      mfp._preloadItem(mfp.index + i);
                  }
                  for (i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
                      mfp._preloadItem(mfp.index - i);
                  }
              },
              _preloadItem: function(index) {
                  index = _getLoopedId(index);
                  if (mfp.items[index].preloaded) {
                      return;
                  }
                  var item = mfp.items[index];
                  if (!item.parsed) {
                      item = mfp.parseEl(index);
                  }
                  _mfpTrigger('LazyLoad', item);
                  if (item.type === 'image') {
                      item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
                          item.hasSize = true;
                      }).on('error.mfploader', function() {
                          item.hasSize = true;
                          item.loadError = true;
                          _mfpTrigger('LazyLoadError', item);
                      }).attr('src', item.src);
                  }
                  item.preloaded = true;
              }
          }
      });
      var RETINA_NS = 'retina';
      $.magnificPopup.registerModule(RETINA_NS, {
          options: {
              replaceSrc: function(item) {
                  return item.src.replace(/\.\w+$/, function(m) {
                      return '@2x' + m;
                  });
              },
              ratio: 1
          },
          proto: {
              initRetina: function() {
                  if (window.devicePixelRatio > 1) {
                      var st = mfp.st.retina,
                          ratio = st.ratio;
                      ratio = !isNaN(ratio) ? ratio : ratio();
                      if (ratio > 1) {
                          _mfpOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
                              item.img.css({
                                  'max-width': item.img[0].naturalWidth / ratio,
                                  'width': '100%'
                              });
                          });
                          _mfpOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
                              item.src = st.replaceSrc(item, ratio);
                          });
                      }
                  }
              }
          }
      });
      (function() {
          var ghostClickDelay = 1000,
              supportsTouch = 'ontouchstart' in window,
              unbindTouchMove = function() {
                  _window.off('touchmove' + ns + ' touchend' + ns);
              },
              eName = 'mfpFastClick',
              ns = '.' + eName;
          $.fn.mfpFastClick = function(callback) {
              return $(this).each(function() {
                  var elem = $(this),
                      lock;
                  if (supportsTouch) {
                      var timeout, startX, startY, pointerMoved, point, numPointers;
                      elem.on('touchstart' + ns, function(e) {
                          pointerMoved = false;
                          numPointers = 1;
                          point = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0];
                          startX = point.clientX;
                          startY = point.clientY;
                          _window.on('touchmove' + ns, function(e) {
                              point = e.originalEvent ? e.originalEvent.touches : e.touches;
                              numPointers = point.length;
                              point = point[0];
                              if (Math.abs(point.clientX - startX) > 10 || Math.abs(point.clientY - startY) > 10) {
                                  pointerMoved = true;
                                  unbindTouchMove();
                              }
                          }).on('touchend' + ns, function(e) {
                              unbindTouchMove();
                              if (pointerMoved || numPointers > 1) {
                                  return;
                              }
                              lock = true;
                              e.preventDefault();
                              clearTimeout(timeout);
                              timeout = setTimeout(function() {
                                  lock = false;
                              }, ghostClickDelay);
                              callback();
                          });
                      });
                  }
                  elem.on('click' + ns, function() {
                      if (!lock) {
                          callback();
                      }
                  });
              });
          };
          $.fn.destroyMfpFastClick = function() {
              $(this).off('touchstart' + ns + ' click' + ns);
              if (supportsTouch) _window.off('touchmove' + ns + ' touchend' + ns);
          };
      })();
      _checkInstance();
  }));
  jQuery.easing['jswing'] = jQuery.easing['swing'];
  jQuery.extend(jQuery.easing, {
      def: 'easeOutQuad',
      swing: function(x, t, b, c, d) {
          return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
      },
      easeInQuad: function(x, t, b, c, d) {
          return c * (t /= d) * t + b;
      },
      easeOutQuad: function(x, t, b, c, d) {
          return -c * (t /= d) * (t - 2) + b;
      },
      easeInOutQuad: function(x, t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t + b;
          return -c / 2 * ((--t) * (t - 2) - 1) + b;
      },
      easeInCubic: function(x, t, b, c, d) {
          return c * (t /= d) * t * t + b;
      },
      easeOutCubic: function(x, t, b, c, d) {
          return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOutCubic: function(x, t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
          return c / 2 * ((t -= 2) * t * t + 2) + b;
      },
      easeInQuart: function(x, t, b, c, d) {
          return c * (t /= d) * t * t * t + b;
      },
      easeOutQuart: function(x, t, b, c, d) {
          return -c * ((t = t / d - 1) * t * t * t - 1) + b;
      },
      easeInOutQuart: function(x, t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
          return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      },
      easeInQuint: function(x, t, b, c, d) {
          return c * (t /= d) * t * t * t * t + b;
      },
      easeOutQuint: function(x, t, b, c, d) {
          return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      },
      easeInOutQuint: function(x, t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
          return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      },
      easeInSine: function(x, t, b, c, d) {
          return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
      },
      easeOutSine: function(x, t, b, c, d) {
          return c * Math.sin(t / d * (Math.PI / 2)) + b;
      },
      easeInOutSine: function(x, t, b, c, d) {
          return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      },
      easeInExpo: function(x, t, b, c, d) {
          return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
      },
      easeOutExpo: function(x, t, b, c, d) {
          return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
      },
      easeInOutExpo: function(x, t, b, c, d) {
          if (t == 0) return b;
          if (t == d) return b + c;
          if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
          return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      },
      easeInCirc: function(x, t, b, c, d) {
          return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
      },
      easeOutCirc: function(x, t, b, c, d) {
          return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
      },
      easeInOutCirc: function(x, t, b, c, d) {
          if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
          return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      },
      easeInElastic: function(x, t, b, c, d) {
          var s = 1.70158;
          var p = 0;
          var a = c;
          if (t == 0) return b;
          if ((t /= d) == 1) return b + c;
          if (!p) p = d * .3;
          if (a < Math.abs(c)) {
              a = c;
              var s = p / 4;
          } else var s = p / (2 * Math.PI) * Math.asin(c / a);
          return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      },
      easeOutElastic: function(x, t, b, c, d) {
          var s = 1.70158;
          var p = 0;
          var a = c;
          if (t == 0) return b;
          if ((t /= d) == 1) return b + c;
          if (!p) p = d * .3;
          if (a < Math.abs(c)) {
              a = c;
              var s = p / 4;
          } else var s = p / (2 * Math.PI) * Math.asin(c / a);
          return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
      },
      easeInOutElastic: function(x, t, b, c, d) {
          var s = 1.70158;
          var p = 0;
          var a = c;
          if (t == 0) return b;
          if ((t /= d / 2) == 2) return b + c;
          if (!p) p = d * (.3 * 1.5);
          if (a < Math.abs(c)) {
              a = c;
              var s = p / 4;
          } else var s = p / (2 * Math.PI) * Math.asin(c / a);
          if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
          return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      },
      easeInBack: function(x, t, b, c, d, s) {
          if (s == undefined) s = 1.70158;
          return c * (t /= d) * t * ((s + 1) * t - s) + b;
      },
      easeOutBack: function(x, t, b, c, d, s) {
          if (s == undefined) s = 1.70158;
          return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      },
      easeInOutBack: function(x, t, b, c, d, s) {
          if (s == undefined) s = 1.70158;
          if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
          return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
      },
      easeInBounce: function(x, t, b, c, d) {
          return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
      },
      easeOutBounce: function(x, t, b, c, d) {
          if ((t /= d) < (1 / 2.75)) {
              return c * (7.5625 * t * t) + b;
          } else if (t < (2 / 2.75)) {
              return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
          } else if (t < (2.5 / 2.75)) {
              return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
          } else {
              return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
          }
      },
      easeInOutBounce: function(x, t, b, c, d) {
          if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
          return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
      }
  });
  (function() {
      var t = [].indexOf || function(t) {
              for (var e = 0, n = this.length; e < n; e++) {
                  if (e in this && this[e] === t) return e
              }
              return -1
          },
          e = [].slice;
      (function(t, e) {
          if (typeof define === "function" && define.amd) {
              return define("waypoints", ["jquery"], function(n) {
                  return e(n, t)
              })
          } else {
              return e(t.jQuery, t)
          }
      })(this, function(n, r) {
          var i, o, l, s, f, u, a, c, h, d, p, y, v, w, g, m;
          i = n(r);
          c = t.call(r, "ontouchstart") >= 0;
          s = {
              horizontal: {},
              vertical: {}
          };
          f = 1;
          a = {};
          u = "waypoints-context-id";
          p = "resize.waypoints";
          y = "scroll.waypoints";
          v = 1;
          w = "waypoints-waypoint-ids";
          g = "waypoint";
          m = "waypoints";
          o = function() {
              function t(t) {
                  var e = this;
                  this.$element = t;
                  this.element = t[0];
                  this.didResize = false;
                  this.didScroll = false;
                  this.id = "context" + f++;
                  this.oldScroll = {
                      x: t.scrollLeft(),
                      y: t.scrollTop()
                  };
                  this.waypoints = {
                      horizontal: {},
                      vertical: {}
                  };
                  t.data(u, this.id);
                  a[this.id] = this;
                  t.bind(y, function() {
                      var t;
                      if (!(e.didScroll || c)) {
                          e.didScroll = true;
                          t = function() {
                              e.doScroll();
                              return e.didScroll = false
                          };
                          return r.setTimeout(t, n[m].settings.scrollThrottle)
                      }
                  });
                  t.bind(p, function() {
                      var t;
                      if (!e.didResize) {
                          e.didResize = true;
                          t = function() {
                              n[m]("refresh");
                              return e.didResize = false
                          };
                          return r.setTimeout(t, n[m].settings.resizeThrottle)
                      }
                  })
              }
              t.prototype.doScroll = function() {
                  var t, e = this;
                  t = {
                      horizontal: {
                          newScroll: this.$element.scrollLeft(),
                          oldScroll: this.oldScroll.x,
                          forward: "right",
                          backward: "left"
                      },
                      vertical: {
                          newScroll: this.$element.scrollTop(),
                          oldScroll: this.oldScroll.y,
                          forward: "down",
                          backward: "up"
                      }
                  };
                  if (c && (!t.vertical.oldScroll || !t.vertical.newScroll)) {
                      n[m]("refresh")
                  }
                  n.each(t, function(t, r) {
                      var i, o, l;
                      l = [];
                      o = r.newScroll > r.oldScroll;
                      i = o ? r.forward : r.backward;
                      n.each(e.waypoints[t], function(t, e) {
                          var n, i;
                          if (r.oldScroll < (n = e.offset) && n <= r.newScroll) {
                              return l.push(e)
                          } else if (r.newScroll < (i = e.offset) && i <= r.oldScroll) {
                              return l.push(e)
                          }
                      });
                      l.sort(function(t, e) {
                          return t.offset - e.offset
                      });
                      if (!o) {
                          l.reverse()
                      }
                      return n.each(l, function(t, e) {
                          if (e.options.continuous || t === l.length - 1) {
                              return e.trigger([i])
                          }
                      })
                  });
                  return this.oldScroll = {
                      x: t.horizontal.newScroll,
                      y: t.vertical.newScroll
                  }
              };
              t.prototype.refresh = function() {
                  var t, e, r, i = this;
                  r = n.isWindow(this.element);
                  e = this.$element.offset();
                  this.doScroll();
                  t = {
                      horizontal: {
                          contextOffset: r ? 0 : e.left,
                          contextScroll: r ? 0 : this.oldScroll.x,
                          contextDimension: this.$element.width(),
                          oldScroll: this.oldScroll.x,
                          forward: "right",
                          backward: "left",
                          offsetProp: "left"
                      },
                      vertical: {
                          contextOffset: r ? 0 : e.top,
                          contextScroll: r ? 0 : this.oldScroll.y,
                          contextDimension: r ? n[m]("viewportHeight") : this.$element.height(),
                          oldScroll: this.oldScroll.y,
                          forward: "down",
                          backward: "up",
                          offsetProp: "top"
                      }
                  };
                  return n.each(t, function(t, e) {
                      return n.each(i.waypoints[t], function(t, r) {
                          var i, o, l, s, f;
                          i = r.options.offset;
                          l = r.offset;
                          o = n.isWindow(r.element) ? 0 : r.$element.offset()[e.offsetProp];
                          if (n.isFunction(i)) {
                              i = i.apply(r.element)
                          } else if (typeof i === "string") {
                              i = parseFloat(i);
                              if (r.options.offset.indexOf("%") > -1) {
                                  i = Math.ceil(e.contextDimension * i / 100)
                              }
                          }
                          r.offset = o - e.contextOffset + e.contextScroll - i;
                          if (r.options.onlyOnScroll && l != null || !r.enabled) {
                              return
                          }
                          if (l !== null && l < (s = e.oldScroll) && s <= r.offset) {
                              return r.trigger([e.backward])
                          } else if (l !== null && l > (f = e.oldScroll) && f >= r.offset) {
                              return r.trigger([e.forward])
                          } else if (l === null && e.oldScroll >= r.offset) {
                              return r.trigger([e.forward])
                          }
                      })
                  })
              };
              t.prototype.checkEmpty = function() {
                  if (n.isEmptyObject(this.waypoints.horizontal) && n.isEmptyObject(this.waypoints.vertical)) {
                      this.$element.unbind([p, y].join(" "));
                      return delete a[this.id]
                  }
              };
              return t
          }();
          l = function() {
              function t(t, e, r) {
                  var i, o;
                  r = n.extend({}, n.fn[g].defaults, r);
                  if (r.offset === "bottom-in-view") {
                      r.offset = function() {
                          var t;
                          t = n[m]("viewportHeight");
                          if (!n.isWindow(e.element)) {
                              t = e.$element.height()
                          }
                          return t - n(this).outerHeight()
                      }
                  }
                  this.$element = t;
                  this.element = t[0];
                  this.axis = r.horizontal ? "horizontal" : "vertical";
                  this.callback = r.handler;
                  this.context = e;
                  this.enabled = r.enabled;
                  this.id = "waypoints" + v++;
                  this.offset = null;
                  this.options = r;
                  e.waypoints[this.axis][this.id] = this;
                  s[this.axis][this.id] = this;
                  i = (o = t.data(w)) != null ? o : [];
                  i.push(this.id);
                  t.data(w, i)
              }
              t.prototype.trigger = function(t) {
                  if (!this.enabled) {
                      return
                  }
                  if (this.callback != null) {
                      this.callback.apply(this.element, t)
                  }
                  if (this.options.triggerOnce) {
                      return this.destroy()
                  }
              };
              t.prototype.disable = function() {
                  return this.enabled = false
              };
              t.prototype.enable = function() {
                  this.context.refresh();
                  return this.enabled = true
              };
              t.prototype.destroy = function() {
                  delete s[this.axis][this.id];
                  delete this.context.waypoints[this.axis][this.id];
                  return this.context.checkEmpty()
              };
              t.getWaypointsByElement = function(t) {
                  var e, r;
                  r = n(t).data(w);
                  if (!r) {
                      return []
                  }
                  e = n.extend({}, s.horizontal, s.vertical);
                  return n.map(r, function(t) {
                      return e[t]
                  })
              };
              return t
          }();
          d = {
              init: function(t, e) {
                  var r;
                  if (e == null) {
                      e = {}
                  }
                  if ((r = e.handler) == null) {
                      e.handler = t
                  }
                  this.each(function() {
                      var t, r, i, s;
                      t = n(this);
                      i = (s = e.context) != null ? s : n.fn[g].defaults.context;
                      if (!n.isWindow(i)) {
                          i = t.closest(i)
                      }
                      i = n(i);
                      r = a[i.data(u)];
                      if (!r) {
                          r = new o(i)
                      }
                      return new l(t, r, e)
                  });
                  n[m]("refresh");
                  return this
              },
              disable: function() {
                  return d._invoke(this, "disable")
              },
              enable: function() {
                  return d._invoke(this, "enable")
              },
              destroy: function() {
                  return d._invoke(this, "destroy")
              },
              prev: function(t, e) {
                  return d._traverse.call(this, t, e, function(t, e, n) {
                      if (e > 0) {
                          return t.push(n[e - 1])
                      }
                  })
              },
              next: function(t, e) {
                  return d._traverse.call(this, t, e, function(t, e, n) {
                      if (e < n.length - 1) {
                          return t.push(n[e + 1])
                      }
                  })
              },
              _traverse: function(t, e, i) {
                  var o, l;
                  if (t == null) {
                      t = "vertical"
                  }
                  if (e == null) {
                      e = r
                  }
                  l = h.aggregate(e);
                  o = [];
                  this.each(function() {
                      var e;
                      e = n.inArray(this, l[t]);
                      return i(o, e, l[t])
                  });
                  return this.pushStack(o)
              },
              _invoke: function(t, e) {
                  t.each(function() {
                      var t;
                      t = l.getWaypointsByElement(this);
                      return n.each(t, function(t, n) {
                          n[e]();
                          return true
                      })
                  });
                  return this
              }
          };
          n.fn[g] = function() {
              var t, r;
              r = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
              if (d[r]) {
                  return d[r].apply(this, t)
              } else if (n.isFunction(r)) {
                  return d.init.apply(this, arguments)
              } else if (n.isPlainObject(r)) {
                  return d.init.apply(this, [null, r])
              } else if (!r) {
                  return n.error("jQuery Waypoints needs a callback function or handler option.")
              } else {
                  return n.error("The " + r + " method does not exist in jQuery Waypoints.")
              }
          };
          n.fn[g].defaults = {
              context: r,
              continuous: true,
              enabled: true,
              horizontal: false,
              offset: 0,
              triggerOnce: false
          };
          h = {
              refresh: function() {
                  return n.each(a, function(t, e) {
                      return e.refresh()
                  })
              },
              viewportHeight: function() {
                  var t;
                  return (t = r.innerHeight) != null ? t : i.height()
              },
              aggregate: function(t) {
                  var e, r, i;
                  e = s;
                  if (t) {
                      e = (i = a[n(t).data(u)]) != null ? i.waypoints : void 0
                  }
                  if (!e) {
                      return []
                  }
                  r = {
                      horizontal: [],
                      vertical: []
                  };
                  n.each(r, function(t, i) {
                      n.each(e[t], function(t, e) {
                          return i.push(e)
                      });
                      i.sort(function(t, e) {
                          return t.offset - e.offset
                      });
                      r[t] = n.map(i, function(t) {
                          return t.element
                      });
                      return r[t] = n.unique(r[t])
                  });
                  return r
              },
              above: function(t) {
                  if (t == null) {
                      t = r
                  }
                  return h._filter(t, "vertical", function(t, e) {
                      return e.offset <= t.oldScroll.y
                  })
              },
              below: function(t) {
                  if (t == null) {
                      t = r
                  }
                  return h._filter(t, "vertical", function(t, e) {
                      return e.offset > t.oldScroll.y
                  })
              },
              left: function(t) {
                  if (t == null) {
                      t = r
                  }
                  return h._filter(t, "horizontal", function(t, e) {
                      return e.offset <= t.oldScroll.x
                  })
              },
              right: function(t) {
                  if (t == null) {
                      t = r
                  }
                  return h._filter(t, "horizontal", function(t, e) {
                      return e.offset > t.oldScroll.x
                  })
              },
              enable: function() {
                  return h._invoke("enable")
              },
              disable: function() {
                  return h._invoke("disable")
              },
              destroy: function() {
                  return h._invoke("destroy")
              },
              extendFn: function(t, e) {
                  return d[t] = e
              },
              _invoke: function(t) {
                  var e;
                  e = n.extend({}, s.vertical, s.horizontal);
                  return n.each(e, function(e, n) {
                      n[t]();
                      return true
                  })
              },
              _filter: function(t, e, r) {
                  var i, o;
                  i = a[n(t).data(u)];
                  if (!i) {
                      return []
                  }
                  o = [];
                  n.each(i.waypoints[e], function(t, e) {
                      if (r(i, e)) {
                          return o.push(e)
                      }
                  });
                  o.sort(function(t, e) {
                      return t.offset - e.offset
                  });
                  return n.map(o, function(t) {
                      return t.element
                  })
              }
          };
          n[m] = function() {
              var t, n;
              n = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
              if (h[n]) {
                  return h[n].apply(null, t)
              } else {
                  return h.aggregate.call(null, n)
              }
          };
          n[m].settings = {
              resizeThrottle: 100,
              scrollThrottle: 30
          };
          return i.load(function() {
              return n[m]("refresh")
          })
      })
  }).call(this);
  (function(a, b, c) {
      "use strict";
      var d = a.document,
          e = a.Modernizr,
          f = function(a) {
              return a.charAt(0).toUpperCase() + a.slice(1)
          },
          g = "Moz Webkit O Ms".split(" "),
          h = function(a) {
              var b = d.documentElement.style,
                  c;
              if (typeof b[a] == "string") return a;
              a = f(a);
              for (var e = 0, h = g.length; e < h; e++) {
                  c = g[e] + a;
                  if (typeof b[c] == "string") return c
              }
          },
          i = h("transform"),
          j = h("transitionProperty"),
          k = {
              csstransforms: function() {
                  return !!i
              },
              csstransforms3d: function() {
                  var a = !!h("perspective");
                  if (a) {
                      var c = " -o- -moz- -ms- -webkit- -khtml- ".split(" "),
                          d = "@media (" + c.join("transform-3d),(") + "modernizr)",
                          e = b("<style>" + d + "{#modernizr{height:3px}}" + "</style>").appendTo("head"),
                          f = b('<div id="modernizr" />').appendTo("html");
                      a = f.height() === 3, f.remove(), e.remove()
                  }
                  return a
              },
              csstransitions: function() {
                  return !!j
              }
          },
          l;
      if (e)
          for (l in k) e.hasOwnProperty(l) || e.addTest(l, k[l]);
      else {
          e = a.Modernizr = {
              _version: "1.6ish: miniModernizr for Isotope"
          };
          var m = " ",
              n;
          for (l in k) n = k[l](), e[l] = n, m += " " + (n ? "" : "no-") + l;
          b("html").addClass(m)
      }
      if (e.csstransforms) {
          var o = e.csstransforms3d ? {
                  translate: function(a) {
                      return "translate3d(" + a[0] + "px, " + a[1] + "px, 0) "
                  },
                  scale: function(a) {
                      return "scale3d(" + a + ", " + a + ", 1) "
                  }
              } : {
                  translate: function(a) {
                      return "translate(" + a[0] + "px, " + a[1] + "px) "
                  },
                  scale: function(a) {
                      return "scale(" + a + ") "
                  }
              },
              p = function(a, c, d) {
                  var e = b.data(a, "isoTransform") || {},
                      f = {},
                      g, h = {},
                      j;
                  f[c] = d, b.extend(e, f);
                  for (g in e) j = e[g], h[g] = o[g](j);
                  var k = h.translate || "",
                      l = h.scale || "",
                      m = k + l;
                  b.data(a, "isoTransform", e), a.style[i] = m
              };
          b.cssNumber.scale = !0, b.cssHooks.scale = {
              set: function(a, b) {
                  p(a, "scale", b)
              },
              get: function(a, c) {
                  var d = b.data(a, "isoTransform");
                  return d && d.scale ? d.scale : 1
              }
          }, b.fx.step.scale = function(a) {
              b.cssHooks.scale.set(a.elem, a.now + a.unit)
          }, b.cssNumber.translate = !0, b.cssHooks.translate = {
              set: function(a, b) {
                  p(a, "translate", b)
              },
              get: function(a, c) {
                  var d = b.data(a, "isoTransform");
                  return d && d.translate ? d.translate : [0, 0]
              }
          }
      }
      var q, r;
      e.csstransitions && (q = {
          WebkitTransitionProperty: "webkitTransitionEnd",
          MozTransitionProperty: "transitionend",
          OTransitionProperty: "oTransitionEnd otransitionend",
          transitionProperty: "transitionend"
      }[j], r = h("transitionDuration"));
      var s = b.event,
          t = b.event.handle ? "handle" : "dispatch",
          u;
      s.special.smartresize = {
          setup: function() {
              b(this).bind("resize", s.special.smartresize.handler)
          },
          teardown: function() {
              b(this).unbind("resize", s.special.smartresize.handler)
          },
          handler: function(a, b) {
              var c = this,
                  d = arguments;
              a.type = "smartresize", u && clearTimeout(u), u = setTimeout(function() {
                  s[t].apply(c, d)
              }, b === "execAsap" ? 0 : 100)
          }
      }, b.fn.smartresize = function(a) {
          return a ? this.bind("smartresize", a) : this.trigger("smartresize", ["execAsap"])
      }, b.Isotope = function(a, c, d) {
          this.element = b(c), this._create(a), this._init(d)
      };
      var v = ["width", "height"],
          w = b(a);
      b.Isotope.settings = {
          resizable: !0,
          layoutMode: "masonry",
          containerClass: "isotope",
          itemClass: "isotope-item",
          hiddenClass: "isotope-hidden",
          hiddenStyle: {
              opacity: 0,
              scale: .001
          },
          visibleStyle: {
              opacity: 1,
              scale: 1
          },
          containerStyle: {
              position: "relative",
              overflow: "hidden"
          },
          animationEngine: "best-available",
          animationOptions: {
              queue: !1,
              duration: 800
          },
          sortBy: "original-order",
          sortAscending: !0,
          resizesContainer: !0,
          transformsEnabled: !0,
          itemPositionDataEnabled: !1
      }, b.Isotope.prototype = {
          _create: function(a) {
              this.options = b.extend({}, b.Isotope.settings, a), this.styleQueue = [], this.elemCount = 0;
              var c = this.element[0].style;
              this.originalStyle = {};
              var d = v.slice(0);
              for (var e in this.options.containerStyle) d.push(e);
              for (var f = 0, g = d.length; f < g; f++) e = d[f], this.originalStyle[e] = c[e] || "";
              this.element.css(this.options.containerStyle), this._updateAnimationEngine(), this._updateUsingTransforms();
              var h = {
                  "original-order": function(a, b) {
                      return b.elemCount++, b.elemCount
                  },
                  random: function() {
                      return Math.random()
                  }
              };
              this.options.getSortData = b.extend(this.options.getSortData, h), this.reloadItems(), this.offset = {
                  left: parseInt(this.element.css("padding-left") || 0, 10),
                  top: parseInt(this.element.css("padding-top") || 0, 10)
              };
              var i = this;
              setTimeout(function() {
                  i.element.addClass(i.options.containerClass)
              }, 0), this.options.resizable && w.bind("smartresize.isotope", function() {
                  i.resize()
              }), this.element.delegate("." + this.options.hiddenClass, "click", function() {
                  return !1
              })
          },
          _getAtoms: function(a) {
              var b = this.options.itemSelector,
                  c = b ? a.filter(b).add(a.find(b)) : a,
                  d = {
                      position: "absolute"
                  };
              return c = c.filter(function(a, b) {
                  return b.nodeType === 1
              }), this.usingTransforms && (d.left = 0, d.top = 0), c.css(d).addClass(this.options.itemClass), this.updateSortData(c, !0), c
          },
          _init: function(a) {
              this.$filteredAtoms = this._filter(this.$allAtoms), this._sort(), this.reLayout(a)
          },
          option: function(a) {
              if (b.isPlainObject(a)) {
                  this.options = b.extend(!0, this.options, a);
                  var c;
                  for (var d in a) c = "_update" + f(d), this[c] && this[c]()
              }
          },
          _updateAnimationEngine: function() {
              var a = this.options.animationEngine.toLowerCase().replace(/[ _\-]/g, ""),
                  b;
              switch (a) {
                  case "css":
                  case "none":
                      b = !1;
                      break;
                  case "jquery":
                      b = !0;
                      break;
                  default:
                      b = !e.csstransitions
              }
              this.isUsingJQueryAnimation = b, this._updateUsingTransforms()
          },
          _updateTransformsEnabled: function() {
              this._updateUsingTransforms()
          },
          _updateUsingTransforms: function() {
              var a = this.usingTransforms = this.options.transformsEnabled && e.csstransforms && e.csstransitions && !this.isUsingJQueryAnimation;
              a || (delete this.options.hiddenStyle.scale, delete this.options.visibleStyle.scale), this.getPositionStyles = a ? this._translate : this._positionAbs
          },
          _filter: function(a) {
              var b = this.options.filter === "" ? "*" : this.options.filter;
              if (!b) return a;
              var c = this.options.hiddenClass,
                  d = "." + c,
                  e = a.filter(d),
                  f = e;
              if (b !== "*") {
                  f = e.filter(b);
                  var g = a.not(d).not(b).addClass(c);
                  this.styleQueue.push({
                      $el: g,
                      style: this.options.hiddenStyle
                  })
              }
              return this.styleQueue.push({
                  $el: f,
                  style: this.options.visibleStyle
              }), f.removeClass(c), a.filter(b)
          },
          updateSortData: function(a, c) {
              var d = this,
                  e = this.options.getSortData,
                  f, g;
              a.each(function() {
                  f = b(this), g = {};
                  for (var a in e) !c && a === "original-order" ? g[a] = b.data(this, "isotope-sort-data")[a] : g[a] = e[a](f, d);
                  b.data(this, "isotope-sort-data", g)
              })
          },
          _sort: function() {
              var a = this.options.sortBy,
                  b = this._getSorter,
                  c = this.options.sortAscending ? 1 : -1,
                  d = function(d, e) {
                      var f = b(d, a),
                          g = b(e, a);
                      return f === g && a !== "original-order" && (f = b(d, "original-order"), g = b(e, "original-order")), (f > g ? 1 : f < g ? -1 : 0) * c
                  };
              this.$filteredAtoms.sort(d)
          },
          _getSorter: function(a, c) {
              return b.data(a, "isotope-sort-data")[c]
          },
          _translate: function(a, b) {
              return {
                  translate: [a, b]
              }
          },
          _positionAbs: function(a, b) {
              return {
                  left: a,
                  top: b
              }
          },
          _pushPosition: function(a, b, c) {
              b = Math.round(b + this.offset.left), c = Math.round(c + this.offset.top);
              var d = this.getPositionStyles(b, c);
              this.styleQueue.push({
                  $el: a,
                  style: d
              }), this.options.itemPositionDataEnabled && a.data("isotope-item-position", {
                  x: b,
                  y: c
              })
          },
          layout: function(a, b) {
              var c = this.options.layoutMode;
              this["_" + c + "Layout"](a);
              if (this.options.resizesContainer) {
                  var d = this["_" + c + "GetContainerSize"]();
                  this.styleQueue.push({
                      $el: this.element,
                      style: d
                  })
              }
              this._processStyleQueue(a, b), this.isLaidOut = !0
          },
          _processStyleQueue: function(a, c) {
              var d = this.isLaidOut ? this.isUsingJQueryAnimation ? "animate" : "css" : "css",
                  f = this.options.animationOptions,
                  g = this.options.onLayout,
                  h, i, j, k;
              i = function(a, b) {
                  b.$el[d](b.style, f)
              };
              if (this._isInserting && this.isUsingJQueryAnimation) i = function(a, b) {
                  h = b.$el.hasClass("no-transition") ? "css" : d, b.$el[h](b.style, f)
              };
              else if (c || g || f.complete) {
                  var l = !1,
                      m = [c, g, f.complete],
                      n = this;
                  j = !0, k = function() {
                      if (l) return;
                      var b;
                      for (var c = 0, d = m.length; c < d; c++) b = m[c], typeof b == "function" && b.call(n.element, a, n);
                      l = !0
                  };
                  if (this.isUsingJQueryAnimation && d === "animate") f.complete = k, j = !1;
                  else if (e.csstransitions) {
                      var o = 0,
                          p = this.styleQueue[0],
                          s = p && p.$el,
                          t;
                      while (!s || !s.length) {
                          t = this.styleQueue[o++];
                          if (!t) return;
                          s = t.$el
                      }
                      var u = parseFloat(getComputedStyle(s[0])[r]);
                      u > 0 && (i = function(a, b) {
                          b.$el[d](b.style, f).one(q, k)
                      }, j = !1)
                  }
              }
              b.each(this.styleQueue, i), j && k(), this.styleQueue = []
          },
          resize: function() {
              this["_" + this.options.layoutMode + "ResizeChanged"]() && this.reLayout()
          },
          reLayout: function(a) {
              this["_" + this.options.layoutMode + "Reset"](), this.layout(this.$filteredAtoms, a)
          },
          addItems: function(a, b) {
              var c = this._getAtoms(a);
              this.$allAtoms = this.$allAtoms.add(c), b && b(c)
          },
          insert: function(a, b) {
              this.element.append(a);
              var c = this;
              this.addItems(a, function(a) {
                  var d = c._filter(a);
                  c._addHideAppended(d), c._sort(), c.reLayout(), c._revealAppended(d, b)
              })
          },
          appended: function(a, b) {
              var c = this;
              this.addItems(a, function(a) {
                  c._addHideAppended(a), c.layout(a), c._revealAppended(a, b)
              })
          },
          _addHideAppended: function(a) {
              this.$filteredAtoms = this.$filteredAtoms.add(a), a.addClass("no-transition"), this._isInserting = !0, this.styleQueue.push({
                  $el: a,
                  style: this.options.hiddenStyle
              })
          },
          _revealAppended: function(a, b) {
              var c = this;
              setTimeout(function() {
                  a.removeClass("no-transition"), c.styleQueue.push({
                      $el: a,
                      style: c.options.visibleStyle
                  }), c._isInserting = !1, c._processStyleQueue(a, b)
              }, 10)
          },
          reloadItems: function() {
              this.$allAtoms = this._getAtoms(this.element.children())
          },
          remove: function(a, b) {
              this.$allAtoms = this.$allAtoms.not(a), this.$filteredAtoms = this.$filteredAtoms.not(a);
              var c = this,
                  d = function() {
                      a.remove(), b && b.call(c.element)
                  };
              a.filter(":not(." + this.options.hiddenClass + ")").length ? (this.styleQueue.push({
                  $el: a,
                  style: this.options.hiddenStyle
              }), this._sort(), this.reLayout(d)) : d()
          },
          shuffle: function(a) {
              this.updateSortData(this.$allAtoms), this.options.sortBy = "random", this._sort(), this.reLayout(a)
          },
          destroy: function() {
              var a = this.usingTransforms,
                  b = this.options;
              this.$allAtoms.removeClass(b.hiddenClass + " " + b.itemClass).each(function() {
                  var b = this.style;
                  b.position = "", b.top = "", b.left = "", b.opacity = "", a && (b[i] = "")
              });
              var c = this.element[0].style;
              for (var d in this.originalStyle) c[d] = this.originalStyle[d];
              this.element.unbind(".isotope").undelegate("." + b.hiddenClass, "click").removeClass(b.containerClass).removeData("isotope"), w.unbind(".isotope")
          },
          _getSegments: function(a) {
              var b = this.options.layoutMode,
                  c = a ? "rowHeight" : "columnWidth",
                  d = a ? "height" : "width",
                  e = a ? "rows" : "cols",
                  g = this.element[d](),
                  h, i = this.options[b] && this.options[b][c] || this.$filteredAtoms["outer" + f(d)](!0) || g;
              h = Math.floor(g / i), h = Math.max(h, 1), this[b][e] = h, this[b][c] = i
          },
          _checkIfSegmentsChanged: function(a) {
              var b = this.options.layoutMode,
                  c = a ? "rows" : "cols",
                  d = this[b][c];
              return this._getSegments(a), this[b][c] !== d
          },
          _masonryReset: function() {
              this.masonry = {}, this._getSegments();
              var a = this.masonry.cols;
              this.masonry.colYs = [];
              while (a--) this.masonry.colYs.push(0)
          },
          _masonryLayout: function(a) {
              var c = this,
                  d = c.masonry;
              a.each(function() {
                  var a = b(this),
                      e = Math.ceil(a.outerWidth(!0) / d.columnWidth);
                  e = Math.min(e, d.cols);
                  if (e === 1) c._masonryPlaceBrick(a, d.colYs);
                  else {
                      var f = d.cols + 1 - e,
                          g = [],
                          h, i;
                      for (i = 0; i < f; i++) h = d.colYs.slice(i, i + e), g[i] = Math.max.apply(Math, h);
                      c._masonryPlaceBrick(a, g)
                  }
              })
          },
          _masonryPlaceBrick: function(a, b) {
              var c = Math.min.apply(Math, b),
                  d = 0;
              for (var e = 0, f = b.length; e < f; e++)
                  if (b[e] === c) {
                      d = e;
                      break
                  }
              var g = this.masonry.columnWidth * d,
                  h = c;
              this._pushPosition(a, g, h);
              var i = c + a.outerHeight(!0),
                  j = this.masonry.cols + 1 - f;
              for (e = 0; e < j; e++) this.masonry.colYs[d + e] = i
          },
          _masonryGetContainerSize: function() {
              var a = Math.max.apply(Math, this.masonry.colYs);
              return {
                  height: a
              }
          },
          _masonryResizeChanged: function() {
              return this._checkIfSegmentsChanged()
          },
          _fitRowsReset: function() {
              this.fitRows = {
                  x: 0,
                  y: 0,
                  height: 0
              }
          },
          _fitRowsLayout: function(a) {
              var c = this,
                  d = this.element.width(),
                  e = this.fitRows;
              a.each(function() {
                  var a = b(this),
                      f = a.outerWidth(!0),
                      g = a.outerHeight(!0);
                  e.x !== 0 && f + e.x > d && (e.x = 0, e.y = e.height), c._pushPosition(a, e.x, e.y), e.height = Math.max(e.y + g, e.height), e.x += f
              })
          },
          _fitRowsGetContainerSize: function() {
              return {
                  height: this.fitRows.height
              }
          },
          _fitRowsResizeChanged: function() {
              return !0
          },
          _cellsByRowReset: function() {
              this.cellsByRow = {
                  index: 0
              }, this._getSegments(), this._getSegments(!0)
          },
          _cellsByRowLayout: function(a) {
              var c = this,
                  d = this.cellsByRow;
              a.each(function() {
                  var a = b(this),
                      e = d.index % d.cols,
                      f = Math.floor(d.index / d.cols),
                      g = (e + .5) * d.columnWidth - a.outerWidth(!0) / 2,
                      h = (f + .5) * d.rowHeight - a.outerHeight(!0) / 2;
                  c._pushPosition(a, g, h), d.index++
              })
          },
          _cellsByRowGetContainerSize: function() {
              return {
                  height: Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) * this.cellsByRow.rowHeight + this.offset.top
              }
          },
          _cellsByRowResizeChanged: function() {
              return this._checkIfSegmentsChanged()
          },
          _straightDownReset: function() {
              this.straightDown = {
                  y: 0
              }
          },
          _straightDownLayout: function(a) {
              var c = this;
              a.each(function(a) {
                  var d = b(this);
                  c._pushPosition(d, 0, c.straightDown.y), c.straightDown.y += d.outerHeight(!0)
              })
          },
          _straightDownGetContainerSize: function() {
              return {
                  height: this.straightDown.y
              }
          },
          _straightDownResizeChanged: function() {
              return !0
          },
          _masonryHorizontalReset: function() {
              this.masonryHorizontal = {}, this._getSegments(!0);
              var a = this.masonryHorizontal.rows;
              this.masonryHorizontal.rowXs = [];
              while (a--) this.masonryHorizontal.rowXs.push(0)
          },
          _masonryHorizontalLayout: function(a) {
              var c = this,
                  d = c.masonryHorizontal;
              a.each(function() {
                  var a = b(this),
                      e = Math.ceil(a.outerHeight(!0) / d.rowHeight);
                  e = Math.min(e, d.rows);
                  if (e === 1) c._masonryHorizontalPlaceBrick(a, d.rowXs);
                  else {
                      var f = d.rows + 1 - e,
                          g = [],
                          h, i;
                      for (i = 0; i < f; i++) h = d.rowXs.slice(i, i + e), g[i] = Math.max.apply(Math, h);
                      c._masonryHorizontalPlaceBrick(a, g)
                  }
              })
          },
          _masonryHorizontalPlaceBrick: function(a, b) {
              var c = Math.min.apply(Math, b),
                  d = 0;
              for (var e = 0, f = b.length; e < f; e++)
                  if (b[e] === c) {
                      d = e;
                      break
                  }
              var g = c,
                  h = this.masonryHorizontal.rowHeight * d;
              this._pushPosition(a, g, h);
              var i = c + a.outerWidth(!0),
                  j = this.masonryHorizontal.rows + 1 - f;
              for (e = 0; e < j; e++) this.masonryHorizontal.rowXs[d + e] = i
          },
          _masonryHorizontalGetContainerSize: function() {
              var a = Math.max.apply(Math, this.masonryHorizontal.rowXs);
              return {
                  width: a
              }
          },
          _masonryHorizontalResizeChanged: function() {
              return this._checkIfSegmentsChanged(!0)
          },
          _fitColumnsReset: function() {
              this.fitColumns = {
                  x: 0,
                  y: 0,
                  width: 0
              }
          },
          _fitColumnsLayout: function(a) {
              var c = this,
                  d = this.element.height(),
                  e = this.fitColumns;
              a.each(function() {
                  var a = b(this),
                      f = a.outerWidth(!0),
                      g = a.outerHeight(!0);
                  e.y !== 0 && g + e.y > d && (e.x = e.width, e.y = 0), c._pushPosition(a, e.x, e.y), e.width = Math.max(e.x + f, e.width), e.y += g
              })
          },
          _fitColumnsGetContainerSize: function() {
              return {
                  width: this.fitColumns.width
              }
          },
          _fitColumnsResizeChanged: function() {
              return !0
          },
          _cellsByColumnReset: function() {
              this.cellsByColumn = {
                  index: 0
              }, this._getSegments(), this._getSegments(!0)
          },
          _cellsByColumnLayout: function(a) {
              var c = this,
                  d = this.cellsByColumn;
              a.each(function() {
                  var a = b(this),
                      e = Math.floor(d.index / d.rows),
                      f = d.index % d.rows,
                      g = (e + .5) * d.columnWidth - a.outerWidth(!0) / 2,
                      h = (f + .5) * d.rowHeight - a.outerHeight(!0) / 2;
                  c._pushPosition(a, g, h), d.index++
              })
          },
          _cellsByColumnGetContainerSize: function() {
              return {
                  width: Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) * this.cellsByColumn.columnWidth
              }
          },
          _cellsByColumnResizeChanged: function() {
              return this._checkIfSegmentsChanged(!0)
          },
          _straightAcrossReset: function() {
              this.straightAcross = {
                  x: 0
              }
          },
          _straightAcrossLayout: function(a) {
              var c = this;
              a.each(function(a) {
                  var d = b(this);
                  c._pushPosition(d, c.straightAcross.x, 0), c.straightAcross.x += d.outerWidth(!0)
              })
          },
          _straightAcrossGetContainerSize: function() {
              return {
                  width: this.straightAcross.x
              }
          },
          _straightAcrossResizeChanged: function() {
              return !0
          }
      }, b.fn.imagesLoaded = function(a) {
          function h() {
              a.call(c, d)
          }

          function i(a) {
              var c = a.target;
              c.src !== f && b.inArray(c, g) === -1 && (g.push(c), --e <= 0 && (setTimeout(h), d.unbind(".imagesLoaded", i)))
          }
          var c = this,
              d = c.find("img").add(c.filter("img")),
              e = d.length,
              f = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
              g = [];
          return e || h(), d.bind("load.imagesLoaded error.imagesLoaded", i).each(function() {
              var a = this.src;
              this.src = f, this.src = a
          }), c
      };
      var x = function(b) {
          a.console && a.console.error(b)
      };
      b.fn.isotope = function(a, c) {
          if (typeof a == "string") {
              var d = Array.prototype.slice.call(arguments, 1);
              this.each(function() {
                  var c = b.data(this, "isotope");
                  if (!c) {
                      x("cannot call methods on isotope prior to initialization; attempted to call method '" + a + "'");
                      return
                  }
                  if (!b.isFunction(c[a]) || a.charAt(0) === "_") {
                      x("no such method '" + a + "' for isotope instance");
                      return
                  }
                  c[a].apply(c, d)
              })
          } else this.each(function() {
              var d = b.data(this, "isotope");
              d ? (d.option(a), d._init(c)) : b.data(this, "isotope", new b.Isotope(a, this, c))
          });
          return this
      }
  })(window, jQuery);
  (function(t) {
      "use strict";

      function e(t) {
          if (t) {
              if ("string" == typeof n[t]) return t;
              t = t.charAt(0).toUpperCase() + t.slice(1);
              for (var e, o = 0, r = i.length; r > o; o++)
                  if (e = i[o] + t, "string" == typeof n[e]) return e
          }
      }
      var i = "Webkit Moz ms Ms O".split(" "),
          n = document.documentElement.style;
      "function" == typeof define && define.amd ? define(function() {
          return e
      }) : t.getStyleProperty = e
  })(window),
  function(t) {
      "use strict";

      function e(t) {
          var e = parseFloat(t),
              i = -1 === t.indexOf("%") && !isNaN(e);
          return i && e
      }

      function i() {
          for (var t = {
                  width: 0,
                  height: 0,
                  innerWidth: 0,
                  innerHeight: 0,
                  outerWidth: 0,
                  outerHeight: 0
              }, e = 0, i = s.length; i > e; e++) {
              var n = s[e];
              t[n] = 0
          }
          return t
      }

      function n(t) {
          function n(t) {
              if ("string" == typeof t && (t = document.querySelector(t)), t && "object" == typeof t && t.nodeType) {
                  var n = r(t);
                  if ("none" === n.display) return i();
                  var h = {};
                  h.width = t.offsetWidth, h.height = t.offsetHeight;
                  for (var p = h.isBorderBox = !(!a || !n[a] || "border-box" !== n[a]), u = 0, f = s.length; f > u; u++) {
                      var d = s[u],
                          c = n[d],
                          l = parseFloat(c);
                      h[d] = isNaN(l) ? 0 : l
                  }
                  var m = h.paddingLeft + h.paddingRight,
                      y = h.paddingTop + h.paddingBottom,
                      g = h.marginLeft + h.marginRight,
                      v = h.marginTop + h.marginBottom,
                      _ = h.borderLeftWidth + h.borderRightWidth,
                      b = h.borderTopWidth + h.borderBottomWidth,
                      L = p && o,
                      E = e(n.width);
                  E !== !1 && (h.width = E + (L ? 0 : m + _));
                  var I = e(n.height);
                  return I !== !1 && (h.height = I + (L ? 0 : y + b)), h.innerWidth = h.width - (m + _), h.innerHeight = h.height - (y + b), h.outerWidth = h.width + g, h.outerHeight = h.height + v, h
              }
          }
          var o, a = t("boxSizing");
          return function() {
              if (a) {
                  var t = document.createElement("div");
                  t.style.width = "200px", t.style.padding = "1px 2px 3px 4px", t.style.borderStyle = "solid", t.style.borderWidth = "1px 2px 3px 4px", t.style[a] = "border-box";
                  var i = document.body || document.documentElement;
                  i.appendChild(t);
                  var n = r(t);
                  o = 200 === e(n.width), i.removeChild(t)
              }
          }(), n
      }
      var o = document.defaultView,
          r = o && o.getComputedStyle ? function(t) {
              return o.getComputedStyle(t, null)
          } : function(t) {
              return t.currentStyle
          },
          s = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
      "function" == typeof define && define.amd ? define(["get-style-property"], n) : t.getSize = n(t.getStyleProperty)
  }(window),
  function(t) {
      "use strict";
      var e = document.documentElement,
          i = function() {};
      e.addEventListener ? i = function(t, e, i) {
          t.addEventListener(e, i, !1)
      } : e.attachEvent && (i = function(e, i, n) {
          e[i + n] = n.handleEvent ? function() {
              var e = t.event;
              e.target = e.target || e.srcElement, n.handleEvent.call(n, e)
          } : function() {
              var i = t.event;
              i.target = i.target || i.srcElement, n.call(e, i)
          }, e.attachEvent("on" + i, e[i + n])
      });
      var n = function() {};
      e.removeEventListener ? n = function(t, e, i) {
          t.removeEventListener(e, i, !1)
      } : e.detachEvent && (n = function(t, e, i) {
          t.detachEvent("on" + e, t[e + i]);
          try {
              delete t[e + i]
          } catch (n) {
              t[e + i] = void 0
          }
      });
      var o = {
          bind: i,
          unbind: n
      };
      "function" == typeof define && define.amd ? define(o) : t.eventie = o
  }(this),
  function(t) {
      "use strict";

      function e(t) {
          "function" == typeof t && (e.isReady ? t() : r.push(t))
      }

      function i(t) {
          var i = "readystatechange" === t.type && "complete" !== o.readyState;
          if (!e.isReady && !i) {
              e.isReady = !0;
              for (var n = 0, s = r.length; s > n; n++) {
                  var a = r[n];
                  a()
              }
          }
      }

      function n(n) {
          return n.bind(o, "DOMContentLoaded", i), n.bind(o, "readystatechange", i), n.bind(t, "load", i), e
      }
      var o = t.document,
          r = [];
      e.isReady = !1, "function" == typeof define && define.amd ? define(["eventie"], n) : t.docReady = n(t.eventie)
  }(this),
  function(t) {
      "use strict";

      function e() {}

      function i(t, e) {
          if (o) return e.indexOf(t);
          for (var i = e.length; i--;)
              if (e[i] === t) return i;
          return -1
      }
      var n = e.prototype,
          o = Array.prototype.indexOf ? !0 : !1;
      n._getEvents = function() {
          return this._events || (this._events = {})
      }, n.getListeners = function(t) {
          var e, i, n = this._getEvents();
          if ("object" == typeof t) {
              e = {};
              for (i in n) n.hasOwnProperty(i) && t.test(i) && (e[i] = n[i])
          } else e = n[t] || (n[t] = []);
          return e
      }, n.getListenersAsObject = function(t) {
          var e, i = this.getListeners(t);
          return i instanceof Array && (e = {}, e[t] = i), e || i
      }, n.addListener = function(t, e) {
          var n, o = this.getListenersAsObject(t);
          for (n in o) o.hasOwnProperty(n) && -1 === i(e, o[n]) && o[n].push(e);
          return this
      }, n.on = n.addListener, n.defineEvent = function(t) {
          return this.getListeners(t), this
      }, n.defineEvents = function(t) {
          for (var e = 0; t.length > e; e += 1) this.defineEvent(t[e]);
          return this
      }, n.removeListener = function(t, e) {
          var n, o, r = this.getListenersAsObject(t);
          for (o in r) r.hasOwnProperty(o) && (n = i(e, r[o]), -1 !== n && r[o].splice(n, 1));
          return this
      }, n.off = n.removeListener, n.addListeners = function(t, e) {
          return this.manipulateListeners(!1, t, e)
      }, n.removeListeners = function(t, e) {
          return this.manipulateListeners(!0, t, e)
      }, n.manipulateListeners = function(t, e, i) {
          var n, o, r = t ? this.removeListener : this.addListener,
              s = t ? this.removeListeners : this.addListeners;
          if ("object" != typeof e || e instanceof RegExp)
              for (n = i.length; n--;) r.call(this, e, i[n]);
          else
              for (n in e) e.hasOwnProperty(n) && (o = e[n]) && ("function" == typeof o ? r.call(this, n, o) : s.call(this, n, o));
          return this
      }, n.removeEvent = function(t) {
          var e, i = typeof t,
              n = this._getEvents();
          if ("string" === i) delete n[t];
          else if ("object" === i)
              for (e in n) n.hasOwnProperty(e) && t.test(e) && delete n[e];
          else delete this._events;
          return this
      }, n.emitEvent = function(t, e) {
          var i, n, o, r = this.getListenersAsObject(t);
          for (n in r)
              if (r.hasOwnProperty(n))
                  for (i = r[n].length; i--;) o = e ? r[n][i].apply(null, e) : r[n][i](), o === !0 && this.removeListener(t, r[n][i]);
          return this
      }, n.trigger = n.emitEvent, n.emit = function(t) {
          var e = Array.prototype.slice.call(arguments, 1);
          return this.emitEvent(t, e)
      }, "function" == typeof define && define.amd ? define(function() {
          return e
      }) : t.EventEmitter = e
  }(this),
  function(t) {
      "use strict";

      function e() {}

      function i(t) {
          function i(e) {
              e.prototype.option || (e.prototype.option = function(e) {
                  t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e))
              })
          }

          function o(e, i) {
              t.fn[e] = function(o) {
                  if ("string" == typeof o) {
                      for (var s = n.call(arguments, 1), a = 0, h = this.length; h > a; a++) {
                          var p = this[a],
                              u = t.data(p, e);
                          if (u)
                              if (t.isFunction(u[o]) && "_" !== o.charAt(0)) {
                                  var f = u[o].apply(u, s);
                                  if (void 0 !== f) return f
                              } else r("no such method '" + o + "' for " + e + " instance");
                          else r("cannot call methods on " + e + " prior to initialization; " + "attempted to call '" + o + "'")
                      }
                      return this
                  }
                  return this.each(function() {
                      var n = t.data(this, e);
                      n ? (n.option(o), n._init()) : (n = new i(this, o), t.data(this, e, n))
                  })
              }
          }
          if (t) {
              var r = "undefined" == typeof console ? e : function(t) {
                  console.error(t)
              };
              t.bridget = function(t, e) {
                  i(e), o(t, e)
              }
          }
      }
      var n = Array.prototype.slice;
      "function" == typeof define && define.amd ? define(["jquery"], i) : i(t.jQuery)
  }(window),
  function(t, e) {
      "use strict";

      function i(t, e) {
          return t[a](e)
      }

      function n(t) {
          if (!t.parentNode) {
              var e = document.createDocumentFragment();
              e.appendChild(t)
          }
      }

      function o(t, e) {
          n(t);
          for (var i = t.parentNode.querySelectorAll(e), o = 0, r = i.length; r > o; o++)
              if (i[o] === t) return !0;
          return !1
      }

      function r(t, e) {
          return n(t), i(t, e)
      }
      var s, a = function() {
          if (e.matchesSelector) return "matchesSelector";
          for (var t = ["webkit", "moz", "ms", "o"], i = 0, n = t.length; n > i; i++) {
              var o = t[i],
                  r = o + "MatchesSelector";
              if (e[r]) return r
          }
      }();
      if (a) {
          var h = document.createElement("div"),
              p = i(h, "div");
          s = p ? i : r
      } else s = o;
      "function" == typeof define && define.amd ? define(function() {
          return s
      }) : window.matchesSelector = s
  }(this, Element.prototype),
  function(t) {
      "use strict";

      function e(t, e) {
          for (var i in e) t[i] = e[i];
          return t
      }

      function i(t, e) {
          t && (this.element = t, this.layout = e, this.position = {
              x: 0,
              y: 0
          }, this._create())
      }
      var n = t.getSize,
          o = t.getStyleProperty,
          r = t.EventEmitter,
          s = document.defaultView,
          a = s && s.getComputedStyle ? function(t) {
              return s.getComputedStyle(t, null)
          } : function(t) {
              return t.currentStyle
          },
          h = o("transition"),
          p = o("transform"),
          u = h && p,
          f = !!o("perspective"),
          d = {
              WebkitTransition: "webkitTransitionEnd",
              MozTransition: "transitionend",
              OTransition: "otransitionend",
              transition: "transitionend"
          }[h],
          c = ["transform", "transition", "transitionDuration", "transitionProperty"],
          l = function() {
              for (var t = {}, e = 0, i = c.length; i > e; e++) {
                  var n = c[e],
                      r = o(n);
                  r && r !== n && (t[n] = r)
              }
              return t
          }();
      e(i.prototype, r.prototype), i.prototype._create = function() {
          this.css({
              position: "absolute"
          })
      }, i.prototype.handleEvent = function(t) {
          var e = "on" + t.type;
          this[e] && this[e](t)
      }, i.prototype.getSize = function() {
          this.size = n(this.element)
      }, i.prototype.css = function(t) {
          var e = this.element.style;
          for (var i in t) {
              var n = l[i] || i;
              e[n] = t[i]
          }
      }, i.prototype.getPosition = function() {
          var t = a(this.element),
              e = this.layout.options,
              i = e.isOriginLeft,
              n = e.isOriginTop,
              o = parseInt(t[i ? "left" : "right"], 10),
              r = parseInt(t[n ? "top" : "bottom"], 10);
          o = isNaN(o) ? 0 : o, r = isNaN(r) ? 0 : r;
          var s = this.layout.size;
          o -= i ? s.paddingLeft : s.paddingRight, r -= n ? s.paddingTop : s.paddingBottom, this.position.x = o, this.position.y = r
      }, i.prototype.layoutPosition = function() {
          var t = this.layout.size,
              e = this.layout.options,
              i = {};
          e.isOriginLeft ? (i.left = this.position.x + t.paddingLeft + "px", i.right = "") : (i.right = this.position.x + t.paddingRight + "px", i.left = ""), e.isOriginTop ? (i.top = this.position.y + t.paddingTop + "px", i.bottom = "") : (i.bottom = this.position.y + t.paddingBottom + "px", i.top = ""), this.css(i), this.emitEvent("layout", [this])
      };
      var m = f ? function(t, e) {
          return "translate3d(" + t + "px, " + e + "px, 0)"
      } : function(t, e) {
          return "translate(" + t + "px, " + e + "px)"
      };
      i.prototype._transitionTo = function(t, e) {
          this.getPosition();
          var i = this.position.x,
              n = this.position.y,
              o = parseInt(t, 10),
              r = parseInt(e, 10),
              s = o === this.position.x && r === this.position.y;
          if (this.setPosition(t, e), s && !this.isTransitioning) return this.layoutPosition(), void 0;
          var a = t - i,
              h = e - n,
              p = {},
              u = this.layout.options;
          a = u.isOriginLeft ? a : -a, h = u.isOriginTop ? h : -h, p.transform = m(a, h), this.transition({
              to: p,
              onTransitionEnd: this.layoutPosition,
              isCleaning: !0
          })
      }, i.prototype.goTo = function(t, e) {
          this.setPosition(t, e), this.layoutPosition()
      }, i.prototype.moveTo = u ? i.prototype._transitionTo : i.prototype.goTo, i.prototype.setPosition = function(t, e) {
          this.position.x = parseInt(t, 10), this.position.y = parseInt(e, 10)
      }, i.prototype._nonTransition = function(t) {
          this.css(t.to), t.isCleaning && this._removeStyles(t.to), t.onTransitionEnd && t.onTransitionEnd.call(this)
      }, i.prototype._transition = function(t) {
          var e = this.layout.options.transitionDuration;
          if (!parseFloat(e)) return this._nonTransition(t), void 0;
          var i = t.to,
              n = [];
          for (var o in i) n.push(o);
          var r = {};
          if (r.transitionProperty = n.join(","), r.transitionDuration = e, this.element.addEventListener(d, this, !1), (t.isCleaning || t.onTransitionEnd) && this.on("transitionEnd", function(e) {
                  return t.isCleaning && e._removeStyles(i), t.onTransitionEnd && t.onTransitionEnd.call(e), !0
              }), t.from) {
              this.css(t.from);
              var s = this.element.offsetHeight;
              s = null
          }
          this.css(r), this.css(i), this.isTransitioning = !0
      }, i.prototype.transition = i.prototype[h ? "_transition" : "_nonTransition"], i.prototype.onwebkitTransitionEnd = function(t) {
          this.ontransitionend(t)
      }, i.prototype.onotransitionend = function(t) {
          this.ontransitionend(t)
      }, i.prototype.ontransitionend = function(t) {
          t.target === this.element && (this.removeTransitionStyles(), this.element.removeEventListener(d, this, !1), this.isTransitioning = !1, this.emitEvent("transitionEnd", [this]))
      }, i.prototype._removeStyles = function(t) {
          var e = {};
          for (var i in t) e[i] = "";
          this.css(e)
      };
      var y = {
          transitionProperty: "",
          transitionDuration: ""
      };
      i.prototype.removeTransitionStyles = function() {
          this.css(y)
      }, i.prototype.removeElem = function() {
          this.element.parentNode.removeChild(this.element), this.emitEvent("remove", [this])
      }, i.prototype.remove = h ? function() {
          var t = this;
          this.on("transitionEnd", function() {
              return t.removeElem(), !0
          }), this.hide()
      } : i.prototype.removeElem, i.prototype.reveal = function() {
          this.css({
              display: ""
          });
          var t = this.layout.options;
          this.transition({
              from: t.hiddenStyle,
              to: t.visibleStyle,
              isCleaning: !0
          })
      }, i.prototype.hide = function() {
          this.css({
              display: ""
          });
          var t = this.layout.options;
          this.transition({
              from: t.visibleStyle,
              to: t.hiddenStyle,
              isCleaning: !0,
              onTransitionEnd: function() {
                  this.css({
                      display: "none"
                  })
              }
          })
      }, i.prototype.destroy = function() {
          this.css({
              position: "",
              left: "",
              right: "",
              top: "",
              bottom: "",
              transition: "",
              transform: ""
          })
      }, t.Outlayer = {
          Item: i
      }
  }(window),
  function(t) {
      "use strict";

      function e(t, e) {
          for (var i in e) t[i] = e[i];
          return t
      }

      function i(t) {
          return "[object Array]" === v.call(t)
      }

      function n(t) {
          var e = [];
          if (i(t)) e = t;
          else if ("number" == typeof t.length)
              for (var n = 0, o = t.length; o > n; n++) e.push(t[n]);
          else e.push(t);
          return e
      }

      function o(t) {
          return t.replace(/(.)([A-Z])/g, function(t, e, i) {
              return e + "-" + i
          }).toLowerCase()
      }

      function r(t, i) {
          if ("string" == typeof t && (t = l.querySelector(t)), !t || !_(t)) return m && m.error("Bad " + this.settings.namespace + " element: " + t), void 0;
          this.element = t, this.options = e({}, this.options), e(this.options, i);
          var n = ++L;
          this.element.outlayerGUID = n, E[n] = this, this._create(), this.options.isInitLayout && this.layout()
      }

      function s(t, i) {
          t.prototype[i] = e({}, r.prototype[i])
      }
      var a = t.Outlayer,
          h = a.Item,
          p = t.docReady,
          u = t.EventEmitter,
          f = t.eventie,
          d = t.getSize,
          c = t.matchesSelector,
          l = t.document,
          m = t.console,
          y = t.jQuery,
          g = function() {},
          v = Object.prototype.toString,
          _ = "object" == typeof HTMLElement ? function(t) {
              return t instanceof HTMLElement
          } : function(t) {
              return t && "object" == typeof t && 1 === t.nodeType && "string" == typeof t.nodeName
          },
          b = Array.prototype.indexOf ? function(t, e) {
              return t.indexOf(e)
          } : function(t, e) {
              for (var i = 0, n = t.length; n > i; i++)
                  if (t[i] === e) return i;
              return -1
          },
          L = 0,
          E = {};
      r.prototype.settings = {
          namespace: "outlayer",
          item: a.Item
      }, r.prototype.options = {
          containerStyle: {
              position: "relative"
          },
          isInitLayout: !0,
          isOriginLeft: !0,
          isOriginTop: !0,
          isResizeBound: !0,
          transitionDuration: "0.4s",
          hiddenStyle: {
              opacity: 0,
              transform: "scale(0.001)"
          },
          visibleStyle: {
              opacity: 1,
              transform: "scale(1)"
          }
      }, e(r.prototype, u.prototype), r.prototype._create = function() {
          this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), e(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
      }, r.prototype.reloadItems = function() {
          this.items = this._getItems(this.element.children)
      }, r.prototype._getItems = function(t) {
          for (var e = this._filterFindItemElements(t), i = this.settings.item, n = [], o = 0, r = e.length; r > o; o++) {
              var s = e[o],
                  a = new i(s, this, this.options.itemOptions);
              n.push(a)
          }
          return n
      }, r.prototype._filterFindItemElements = function(t) {
          t = n(t);
          var e = this.options.itemSelector;
          if (!e) return t;
          for (var i = [], o = 0, r = t.length; r > o; o++) {
              var s = t[o];
              c(s, e) && i.push(s);
              for (var a = s.querySelectorAll(e), h = 0, p = a.length; p > h; h++) i.push(a[h])
          }
          return i
      }, r.prototype.getItemElements = function() {
          for (var t = [], e = 0, i = this.items.length; i > e; e++) t.push(this.items[e].element);
          return t
      }, r.prototype.layout = function() {
          this._resetLayout(), this._manageStamps();
          var t = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
          this.layoutItems(this.items, t), this._isLayoutInited = !0
      }, r.prototype._init = r.prototype.layout, r.prototype._resetLayout = function() {
          this.getSize()
      }, r.prototype.getSize = function() {
          this.size = d(this.element)
      }, r.prototype._getMeasurement = function(t, e) {
          var i, n = this.options[t];
          n ? ("string" == typeof n ? i = this.element.querySelector(n) : _(n) && (i = n), this[t] = i ? d(i)[e] : n) : this[t] = 0
      }, r.prototype.layoutItems = function(t, e) {
          t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout()
      }, r.prototype._getItemsForLayout = function(t) {
          for (var e = [], i = 0, n = t.length; n > i; i++) {
              var o = t[i];
              o.isIgnored || e.push(o)
          }
          return e
      }, r.prototype._layoutItems = function(t, e) {
          if (!t || !t.length) return this.emitEvent("layoutComplete", [this, t]), void 0;
          this._itemsOn(t, "layout", function() {
              this.emitEvent("layoutComplete", [this, t])
          });
          for (var i = [], n = 0, o = t.length; o > n; n++) {
              var r = t[n],
                  s = this._getItemLayoutPosition(r);
              s.item = r, s.isInstant = e, i.push(s)
          }
          this._processLayoutQueue(i)
      }, r.prototype._getItemLayoutPosition = function() {
          return {
              x: 0,
              y: 0
          }
      }, r.prototype._processLayoutQueue = function(t) {
          for (var e = 0, i = t.length; i > e; e++) {
              var n = t[e];
              this._positionItem(n.item, n.x, n.y, n.isInstant)
          }
      }, r.prototype._positionItem = function(t, e, i, n) {
          n ? t.goTo(e, i) : t.moveTo(e, i)
      }, r.prototype._postLayout = function() {
          var t = this._getContainerSize();
          t && (this._setContainerMeasure(t.width, !0), this._setContainerMeasure(t.height, !1))
      }, r.prototype._getContainerSize = g, r.prototype._setContainerMeasure = function(t, e) {
          if (void 0 !== t) {
              var i = this.size;
              i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px"
          }
      }, r.prototype._itemsOn = function(t, e, i) {
          function n() {
              return o++, o === r && i.call(s), !0
          }
          for (var o = 0, r = t.length, s = this, a = 0, h = t.length; h > a; a++) {
              var p = t[a];
              p.on(e, n)
          }
      }, r.prototype.ignore = function(t) {
          var e = this.getItem(t);
          e && (e.isIgnored = !0)
      }, r.prototype.unignore = function(t) {
          var e = this.getItem(t);
          e && delete e.isIgnored
      }, r.prototype.stamp = function(t) {
          if (t = this._find(t)) {
              this.stamps = this.stamps.concat(t);
              for (var e = 0, i = t.length; i > e; e++) {
                  var n = t[e];
                  this.ignore(n)
              }
          }
      }, r.prototype.unstamp = function(t) {
          if (t = this._find(t))
              for (var e = 0, i = t.length; i > e; e++) {
                  var n = t[e],
                      o = b(this.stamps, n); - 1 !== o && this.stamps.splice(o, 1), this.unignore(n)
              }
      }, r.prototype._find = function(t) {
          return t ? ("string" == typeof t && (t = this.element.querySelectorAll(t)), t = n(t)) : void 0
      }, r.prototype._manageStamps = function() {
          if (this.stamps && this.stamps.length) {
              this._getBoundingRect();
              for (var t = 0, e = this.stamps.length; e > t; t++) {
                  var i = this.stamps[t];
                  this._manageStamp(i)
              }
          }
      }, r.prototype._getBoundingRect = function() {
          var t = this.element.getBoundingClientRect(),
              e = this.size;
          this._boundingRect = {
              left: t.left + e.paddingLeft + e.borderLeftWidth,
              top: t.top + e.paddingTop + e.borderTopWidth,
              right: t.right - (e.paddingRight + e.borderRightWidth),
              bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
          }
      }, r.prototype._manageStamp = g, r.prototype._getElementOffset = function(t) {
          var e = t.getBoundingClientRect(),
              i = this._boundingRect,
              n = d(t),
              o = {
                  left: e.left - i.left - n.marginLeft,
                  top: e.top - i.top - n.marginTop,
                  right: i.right - e.right - n.marginRight,
                  bottom: i.bottom - e.bottom - n.marginBottom
              };
          return o
      }, r.prototype.handleEvent = function(t) {
          var e = "on" + t.type;
          this[e] && this[e](t)
      }, r.prototype.bindResize = function() {
          this.isResizeBound || (f.bind(t, "resize", this), this.isResizeBound = !0)
      }, r.prototype.unbindResize = function() {
          f.unbind(t, "resize", this), this.isResizeBound = !1
      }, r.prototype.onresize = function() {
          function t() {
              e.resize()
          }
          this.resizeTimeout && clearTimeout(this.resizeTimeout);
          var e = this;
          this.resizeTimeout = setTimeout(t, 100)
      }, r.prototype.resize = function() {
          var t = d(this.element),
              e = this.size && t;
          e && t.innerWidth === this.size.innerWidth || (this.layout(), delete this.resizeTimeout)
      }, r.prototype.addItems = function(t) {
          var e = this._getItems(t);
          if (e.length) return this.items = this.items.concat(e), e
      }, r.prototype.appended = function(t) {
          var e = this.addItems(t);
          e.length && (this.layoutItems(e, !0), this.reveal(e))
      }, r.prototype.prepended = function(t) {
          var e = this._getItems(t);
          if (e.length) {
              var i = this.items.slice(0);
              this.items = e.concat(i), this._resetLayout(), this.layoutItems(e, !0), this.reveal(e), this.layoutItems(i)
          }
      }, r.prototype.reveal = function(t) {
          if (t && t.length)
              for (var e = 0, i = t.length; i > e; e++) {
                  var n = t[e];
                  n.reveal()
              }
      }, r.prototype.hide = function(t) {
          if (t && t.length)
              for (var e = 0, i = t.length; i > e; e++) {
                  var n = t[e];
                  n.hide()
              }
      }, r.prototype.getItem = function(t) {
          for (var e = 0, i = this.items.length; i > e; e++) {
              var n = this.items[e];
              if (n.element === t) return n
          }
      }, r.prototype.getItems = function(t) {
          if (t && t.length) {
              for (var e = [], i = 0, n = t.length; n > i; i++) {
                  var o = t[i],
                      r = this.getItem(o);
                  r && e.push(r)
              }
              return e
          }
      }, r.prototype.remove = function(t) {
          t = n(t);
          var e = this.getItems(t);
          this._itemsOn(e, "remove", function() {
              this.emitEvent("removeComplete", [this, e])
          });
          for (var i = 0, o = e.length; o > i; i++) {
              var r = e[i];
              r.remove();
              var s = b(this.items, r);
              this.items.splice(s, 1)
          }
      }, r.prototype.destroy = function() {
          var t = this.element.style;
          t.height = "", t.position = "", t.width = "";
          for (var e = 0, i = this.items.length; i > e; e++) {
              var n = this.items[e];
              n.destroy()
          }
          this.unbindResize(), delete this.element.outlayerGUID
      }, r.data = function(t) {
          var e = t && t.outlayerGUID;
          return e && E[e]
      }, r.create = function(t, i) {
          function n() {
              r.apply(this, arguments)
          }
          return e(n.prototype, r.prototype), s(n, "options"), s(n, "settings"), e(n.prototype.options, i), n.prototype.settings.namespace = t, n.data = r.data, n.Item = function() {
              h.apply(this, arguments)
          }, n.Item.prototype = new r.Item, n.prototype.settings.item = n.Item, p(function() {
              for (var e = o(t), i = l.querySelectorAll(".js-" + e), r = "data-" + e + "-options", s = 0, a = i.length; a > s; s++) {
                  var h, p = i[s],
                      u = p.getAttribute(r);
                  try {
                      h = u && JSON.parse(u)
                  } catch (f) {
                      m && m.error("Error parsing " + r + " on " + p.nodeName.toLowerCase() + (p.id ? "#" + p.id : "") + ": " + f);
                      continue
                  }
                  var d = new n(p, h);
                  y && y.data(p, t, d)
              }
          }), y && y.bridget && y.bridget(t, n), n
      }, r.Item = h, t.Outlayer = r
  }(window),
  function(t) {
      "use strict";

      function e(t, e) {
          var n = t.create("masonry");
          return n.prototype._resetLayout = function() {
              this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
              var t = this.cols;
              for (this.colYs = []; t--;) this.colYs.push(0);
              this.maxY = 0
          }, n.prototype.measureColumns = function() {
              var t = this.items[0].element;
              this.columnWidth = this.columnWidth || e(t).outerWidth, this.columnWidth += this.gutter, this.cols = Math.floor((this.size.innerWidth + this.gutter) / this.columnWidth), this.cols = Math.max(this.cols, 1)
          }, n.prototype._getItemLayoutPosition = function(t) {
              t.getSize();
              var e = Math.ceil(t.size.outerWidth / this.columnWidth);
              e = Math.min(e, this.cols);
              for (var n = this._getColGroup(e), o = Math.min.apply(Math, n), r = i(n, o), s = {
                      x: this.columnWidth * r,
                      y: o
                  }, a = o + t.size.outerHeight, h = this.cols + 1 - n.length, p = 0; h > p; p++) this.colYs[r + p] = a;
              return s
          }, n.prototype._getColGroup = function(t) {
              if (1 === t) return this.colYs;
              for (var e = [], i = this.cols + 1 - t, n = 0; i > n; n++) {
                  var o = this.colYs.slice(n, n + t);
                  e[n] = Math.max.apply(Math, o)
              }
              return e
          }, n.prototype._manageStamp = function(t) {
              var i = e(t),
                  n = this._getElementOffset(t),
                  o = this.options.isOriginLeft ? n.left : n.right,
                  r = o + i.outerWidth,
                  s = Math.floor(o / this.columnWidth);
              s = Math.max(0, s);
              var a = Math.floor(r / this.columnWidth);
              a = Math.min(this.cols - 1, a);
              for (var h = (this.options.isOriginTop ? n.top : n.bottom) + i.outerHeight, p = s; a >= p; p++) this.colYs[p] = Math.max(h, this.colYs[p])
          }, n.prototype._getContainerSize = function() {
              return this.maxY = Math.max.apply(Math, this.colYs), {
                  height: this.maxY
              }
          }, n
      }
      var i = Array.prototype.indexOf ? function(t, e) {
          return t.indexOf(e)
      } : function(t, e) {
          for (var i = 0, n = t.length; n > i; i++) {
              var o = t[i];
              if (o === e) return i
          }
          return -1
      };
      "function" == typeof define && define.amd ? define(["outlayer", "get-size"], e) : t.Masonry = e(t.Outlayer, t.getSize)
  }(window);;
  (function(e, t, n) {
      function s(t, n) {
          this.bodyOverflowX;
          this.callbacks = {
              hide: [],
              show: []
          };
          this.checkInterval = null;
          this.Content;
          this.$el = e(t);
          this.$elProxy;
          this.elProxyPosition;
          this.enabled = true;
          this.options = e.extend({}, i, n);
          this.mouseIsOverProxy = false;
          this.namespace = "tooltipster-" + Math.round(Math.random() * 1e5);
          this.Status = "hidden";
          this.timerHide = null;
          this.timerShow = null;
          this.$tooltip;
          this.options.iconTheme = this.options.iconTheme.replace(".", "");
          this.options.theme = this.options.theme.replace(".", "");
          this._init()
      }

      function o(t, n) {
          var r = true;
          e.each(t, function(e, i) {
              if (typeof n[e] === "undefined" || t[e] !== n[e]) {
                  r = false;
                  return false
              }
          });
          return r
      }

      function f() {
          return !a && u
      }

      function l() {
          var e = n.body || n.documentElement,
              t = e.style,
              r = "transition";
          if (typeof t[r] == "string") {
              return true
          }
          v = ["Moz", "Webkit", "Khtml", "O", "ms"], r = r.charAt(0).toUpperCase() + r.substr(1);
          for (var i = 0; i < v.length; i++) {
              if (typeof t[v[i] + r] == "string") {
                  return true
              }
          }
          return false
      }
      var r = "tooltipster",
          i = {
              animation: "fade",
              arrow: true,
              arrowColor: "",
              autoClose: true,
              content: null,
              contentAsHTML: false,
              contentCloning: true,
              delay: 200,
              minWidth: 0,
              maxWidth: null,
              functionInit: function(e, t) {},
              functionBefore: function(e, t) {
                  t()
              },
              functionReady: function(e, t) {},
              functionAfter: function(e) {},
              icon: "(?)",
              iconCloning: true,
              iconDesktop: false,
              iconTouch: false,
              iconTheme: "tooltipster-icon",
              interactive: false,
              interactiveTolerance: 350,
              multiple: false,
              offsetX: 0,
              offsetY: 0,
              onlyOne: false,
              position: "top",
              positionTracker: false,
              speed: 350,
              timer: 0,
              theme: "tooltipster-default",
              touchDevices: true,
              trigger: "hover",
              updateAnimation: true
          };
      s.prototype = {
          _init: function() {
              var t = this;
              if (n.querySelector) {
                  if (t.options.content !== null) {
                      t._content_set(t.options.content)
                  } else {
                      var r = t.$el.attr("title");
                      if (typeof r === "undefined") r = null;
                      t._content_set(r)
                  }
                  var i = t.options.functionInit.call(t.$el, t.$el, t.Content);
                  if (typeof i !== "undefined") t._content_set(i);
                  t.$el.removeAttr("title").addClass("tooltipstered");
                  if (!u && t.options.iconDesktop || u && t.options.iconTouch) {
                      if (typeof t.options.icon === "string") {
                          t.$elProxy = e('<span class="' + t.options.iconTheme + '"></span>');
                          t.$elProxy.text(t.options.icon)
                      } else {
                          if (t.options.iconCloning) t.$elProxy = t.options.icon.clone(true);
                          else t.$elProxy = t.options.icon
                      }
                      t.$elProxy.insertAfter(t.$el)
                  } else {
                      t.$elProxy = t.$el
                  }
                  if (t.options.trigger == "hover") {
                      t.$elProxy.on("mouseenter." + t.namespace, function() {
                          if (!f() || t.options.touchDevices) {
                              t.mouseIsOverProxy = true;
                              t._show()
                          }
                      }).on("mouseleave." + t.namespace, function() {
                          if (!f() || t.options.touchDevices) {
                              t.mouseIsOverProxy = false
                          }
                      });
                      if (u && t.options.touchDevices) {
                          t.$elProxy.on("touchstart." + t.namespace, function() {
                              t._showNow()
                          })
                      }
                  } else if (t.options.trigger == "click") {
                      t.$elProxy.on("click." + t.namespace, function() {
                          if (!f() || t.options.touchDevices) {
                              t._show()
                          }
                      })
                  }
              }
          },
          _show: function() {
              var e = this;
              if (e.Status != "shown" && e.Status != "appearing") {
                  if (e.options.delay) {
                      e.timerShow = setTimeout(function() {
                          if (e.options.trigger == "click" || e.options.trigger == "hover" && e.mouseIsOverProxy) {
                              e._showNow()
                          }
                      }, e.options.delay)
                  } else e._showNow()
              }
          },
          _showNow: function(n) {
              var r = this;
              r.options.functionBefore.call(r.$el, r.$el, function() {
                  if (r.enabled && r.Content !== null) {
                      if (n) r.callbacks.show.push(n);
                      r.callbacks.hide = [];
                      clearTimeout(r.timerShow);
                      r.timerShow = null;
                      clearTimeout(r.timerHide);
                      r.timerHide = null;
                      if (r.options.onlyOne) {
                          e(".tooltipstered").not(r.$el).each(function(t, n) {
                              var r = e(n),
                                  i = r.data("tooltipster-ns");
                              e.each(i, function(e, t) {
                                  var n = r.data(t),
                                      i = n.status(),
                                      s = n.option("autoClose");
                                  if (i !== "hidden" && i !== "disappearing" && s) {
                                      n.hide()
                                  }
                              })
                          })
                      }
                      var i = function() {
                          r.Status = "shown";
                          e.each(r.callbacks.show, function(e, t) {
                              t.call(r.$el)
                          });
                          r.callbacks.show = []
                      };
                      if (r.Status !== "hidden") {
                          var s = 0;
                          if (r.Status === "disappearing") {
                              r.Status = "appearing";
                              if (l()) {
                                  r.$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-" + r.options.animation + "-show");
                                  if (r.options.speed > 0) r.$tooltip.delay(r.options.speed);
                                  r.$tooltip.queue(i)
                              } else {
                                  r.$tooltip.stop().fadeIn(i)
                              }
                          } else if (r.Status === "shown") {
                              i()
                          }
                      } else {
                          r.Status = "appearing";
                          var s = r.options.speed;
                          r.bodyOverflowX = e("body").css("overflow-x");
                          e("body").css("overflow-x", "hidden");
                          var o = "tooltipster-" + r.options.animation,
                              a = "-webkit-transition-duration: " + r.options.speed + "ms; -webkit-animation-duration: " + r.options.speed + "ms; -moz-transition-duration: " + r.options.speed + "ms; -moz-animation-duration: " + r.options.speed + "ms; -o-transition-duration: " + r.options.speed + "ms; -o-animation-duration: " + r.options.speed + "ms; -ms-transition-duration: " + r.options.speed + "ms; -ms-animation-duration: " + r.options.speed + "ms; transition-duration: " + r.options.speed + "ms; animation-duration: " + r.options.speed + "ms;",
                              f = r.options.minWidth ? "min-width:" + Math.round(r.options.minWidth) + "px;" : "",
                              c = r.options.maxWidth ? "max-width:" + Math.round(r.options.maxWidth) + "px;" : "",
                              h = r.options.interactive ? "pointer-events: auto;" : "";
                          r.$tooltip = e('<div class="tooltipster-base ' + r.options.theme + '" style="' + f + " " + c + " " + h + " " + a + '"><div class="tooltipster-content"></div></div>');
                          if (l()) r.$tooltip.addClass(o);
                          r._content_insert();
                          r.$tooltip.appendTo("body");
                          r.reposition();
                          r.options.functionReady.call(r.$el, r.$el, r.$tooltip);
                          if (l()) {
                              r.$tooltip.addClass(o + "-show");
                              if (r.options.speed > 0) r.$tooltip.delay(r.options.speed);
                              r.$tooltip.queue(i)
                          } else {
                              r.$tooltip.css("display", "none").fadeIn(r.options.speed, i)
                          }
                          r._interval_set();
                          e(t).on("scroll." + r.namespace + " resize." + r.namespace, function() {
                              r.reposition()
                          });
                          if (r.options.autoClose) {
                              e("body").off("." + r.namespace);
                              if (r.options.trigger == "hover") {
                                  if (u) {
                                      setTimeout(function() {
                                          e("body").on("touchstart." + r.namespace, function() {
                                              r.hide()
                                          })
                                      }, 0)
                                  }
                                  if (r.options.interactive) {
                                      if (u) {
                                          r.$tooltip.on("touchstart." + r.namespace, function(e) {
                                              e.stopPropagation()
                                          })
                                      }
                                      var p = null;
                                      r.$elProxy.add(r.$tooltip).on("mouseleave." + r.namespace + "-autoClose", function() {
                                          clearTimeout(p);
                                          p = setTimeout(function() {
                                              r.hide()
                                          }, r.options.interactiveTolerance)
                                      }).on("mouseenter." + r.namespace + "-autoClose", function() {
                                          clearTimeout(p)
                                      })
                                  } else {
                                      r.$elProxy.on("mouseleave." + r.namespace + "-autoClose", function() {
                                          r.hide()
                                      })
                                  }
                              } else if (r.options.trigger == "click") {
                                  setTimeout(function() {
                                      e("body").on("click." + r.namespace + " touchstart." + r.namespace, function() {
                                          r.hide()
                                      })
                                  }, 0);
                                  if (r.options.interactive) {
                                      r.$tooltip.on("click." + r.namespace + " touchstart." + r.namespace, function(e) {
                                          e.stopPropagation()
                                      })
                                  }
                              }
                          }
                      }
                      if (r.options.timer > 0) {
                          r.timerHide = setTimeout(function() {
                              r.timerHide = null;
                              r.hide()
                          }, r.options.timer + s)
                      }
                  }
              })
          },
          _interval_set: function() {
              var t = this;
              t.checkInterval = setInterval(function() {
                  if (e("body").find(t.$el).length === 0 || e("body").find(t.$elProxy).length === 0 || t.Status == "hidden" || e("body").find(t.$tooltip).length === 0) {
                      if (t.Status == "shown" || t.Status == "appearing") t.hide();
                      t._interval_cancel()
                  } else {
                      if (t.options.positionTracker) {
                          var n = t._repositionInfo(t.$elProxy),
                              r = false;
                          if (o(n.dimension, t.elProxyPosition.dimension)) {
                              if (t.$elProxy.css("position") === "fixed") {
                                  if (o(n.position, t.elProxyPosition.position)) r = true
                              } else {
                                  if (o(n.offset, t.elProxyPosition.offset)) r = true
                              }
                          }
                          if (!r) {
                              t.reposition()
                          }
                      }
                  }
              }, 200)
          },
          _interval_cancel: function() {
              clearInterval(this.checkInterval);
              this.checkInterval = null
          },
          _content_set: function(e) {
              if (typeof e === "object" && e !== null && this.options.contentCloning) {
                  e = e.clone(true)
              }
              this.Content = e
          },
          _content_insert: function() {
              var e = this,
                  t = this.$tooltip.find(".tooltipster-content");
              if (typeof e.Content === "string" && !e.options.contentAsHTML) {
                  t.text(e.Content)
              } else {
                  t.empty().append(e.Content)
              }
          },
          _update: function(e) {
              var t = this;
              t._content_set(e);
              if (t.Content !== null) {
                  if (t.Status !== "hidden") {
                      t._content_insert();
                      t.reposition();
                      if (t.options.updateAnimation) {
                          if (l()) {
                              t.$tooltip.css({
                                  width: "",
                                  "-webkit-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
                                  "-moz-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
                                  "-o-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
                                  "-ms-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
                                  transition: "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms"
                              }).addClass("tooltipster-content-changing");
                              setTimeout(function() {
                                  if (t.Status != "hidden") {
                                      t.$tooltip.removeClass("tooltipster-content-changing");
                                      setTimeout(function() {
                                          if (t.Status !== "hidden") {
                                              t.$tooltip.css({
                                                  "-webkit-transition": t.options.speed + "ms",
                                                  "-moz-transition": t.options.speed + "ms",
                                                  "-o-transition": t.options.speed + "ms",
                                                  "-ms-transition": t.options.speed + "ms",
                                                  transition: t.options.speed + "ms"
                                              })
                                          }
                                      }, t.options.speed)
                                  }
                              }, t.options.speed)
                          } else {
                              t.$tooltip.fadeTo(t.options.speed, .5, function() {
                                  if (t.Status != "hidden") {
                                      t.$tooltip.fadeTo(t.options.speed, 1)
                                  }
                              })
                          }
                      }
                  }
              } else {
                  t.hide()
              }
          },
          _repositionInfo: function(e) {
              return {
                  dimension: {
                      height: e.outerHeight(false),
                      width: e.outerWidth(false)
                  },
                  offset: e.offset(),
                  position: {
                      left: parseInt(e.css("left")),
                      top: parseInt(e.css("top"))
                  }
              }
          },
          hide: function(n) {
              var r = this;
              if (n) r.callbacks.hide.push(n);
              r.callbacks.show = [];
              clearTimeout(r.timerShow);
              r.timerShow = null;
              clearTimeout(r.timerHide);
              r.timerHide = null;
              var i = function() {
                  e.each(r.callbacks.hide, function(e, t) {
                      t.call(r.$el)
                  });
                  r.callbacks.hide = []
              };
              if (r.Status == "shown" || r.Status == "appearing") {
                  r.Status = "disappearing";
                  var s = function() {
                      r.Status = "hidden";
                      if (typeof r.Content == "object" && r.Content !== null) {
                          r.Content.detach()
                      }
                      r.$tooltip.remove();
                      r.$tooltip = null;
                      e(t).off("." + r.namespace);
                      e("body").off("." + r.namespace).css("overflow-x", r.bodyOverflowX);
                      e("body").off("." + r.namespace);
                      r.$elProxy.off("." + r.namespace + "-autoClose");
                      r.options.functionAfter.call(r.$el, r.$el);
                      i()
                  };
                  if (l()) {
                      r.$tooltip.clearQueue().removeClass("tooltipster-" + r.options.animation + "-show").addClass("tooltipster-dying");
                      if (r.options.speed > 0) r.$tooltip.delay(r.options.speed);
                      r.$tooltip.queue(s)
                  } else {
                      r.$tooltip.stop().fadeOut(r.options.speed, s)
                  }
              } else if (r.Status == "hidden") {
                  i()
              }
              return r
          },
          show: function(e) {
              this._showNow(e);
              return this
          },
          update: function(e) {
              return this.content(e)
          },
          content: function(e) {
              if (typeof e === "undefined") {
                  return this.Content
              } else {
                  this._update(e);
                  return this
              }
          },
          reposition: function() {
              var n = this;
              if (e("body").find(n.$tooltip).length !== 0) {
                  n.$tooltip.css("width", "");
                  n.elProxyPosition = n._repositionInfo(n.$elProxy);
                  var r = null,
                      i = e(t).width(),
                      s = n.elProxyPosition,
                      o = n.$tooltip.outerWidth(false),
                      u = n.$tooltip.innerWidth() + 1,
                      a = n.$tooltip.outerHeight(false);
                  if (n.$elProxy.is("area")) {
                      var f = n.$elProxy.attr("shape"),
                          l = n.$elProxy.parent().attr("name"),
                          c = e('img[usemap="#' + l + '"]'),
                          h = c.offset().left,
                          p = c.offset().top,
                          d = n.$elProxy.attr("coords") !== undefined ? n.$elProxy.attr("coords").split(",") : undefined;
                      if (f == "circle") {
                          var v = parseInt(d[0]),
                              m = parseInt(d[1]),
                              g = parseInt(d[2]);
                          s.dimension.height = g * 2;
                          s.dimension.width = g * 2;
                          s.offset.top = p + m - g;
                          s.offset.left = h + v - g
                      } else if (f == "rect") {
                          var v = parseInt(d[0]),
                              m = parseInt(d[1]),
                              y = parseInt(d[2]),
                              b = parseInt(d[3]);
                          s.dimension.height = b - m;
                          s.dimension.width = y - v;
                          s.offset.top = p + m;
                          s.offset.left = h + v
                      } else if (f == "poly") {
                          var w = [],
                              E = [],
                              S = 0,
                              x = 0,
                              T = 0,
                              N = 0,
                              C = "even";
                          for (var k = 0; k < d.length; k++) {
                              var L = parseInt(d[k]);
                              if (C == "even") {
                                  if (L > T) {
                                      T = L;
                                      if (k === 0) {
                                          S = T
                                      }
                                  }
                                  if (L < S) {
                                      S = L
                                  }
                                  C = "odd"
                              } else {
                                  if (L > N) {
                                      N = L;
                                      if (k == 1) {
                                          x = N
                                      }
                                  }
                                  if (L < x) {
                                      x = L
                                  }
                                  C = "even"
                              }
                          }
                          s.dimension.height = N - x;
                          s.dimension.width = T - S;
                          s.offset.top = p + x;
                          s.offset.left = h + S
                      } else {
                          s.dimension.height = c.outerHeight(false);
                          s.dimension.width = c.outerWidth(false);
                          s.offset.top = p;
                          s.offset.left = h
                      }
                  }
                  var A = 0,
                      O = 0,
                      M = 0,
                      _ = parseInt(n.options.offsetY),
                      D = parseInt(n.options.offsetX),
                      P = n.options.position;

                  function H() {
                      var n = e(t).scrollLeft();
                      if (A - n < 0) {
                          r = A - n;
                          A = n
                      }
                      if (A + o - n > i) {
                          r = A - (i + n - o);
                          A = i + n - o
                      }
                  }

                  function B(n, r) {
                      if (s.offset.top - e(t).scrollTop() - a - _ - 12 < 0 && r.indexOf("top") > -1) {
                          P = n
                      }
                      if (s.offset.top + s.dimension.height + a + 12 + _ > e(t).scrollTop() + e(t).height() && r.indexOf("bottom") > -1) {
                          P = n;
                          M = s.offset.top - a - _ - 12
                      }
                  }
                  if (P == "top") {
                      var j = s.offset.left + o - (s.offset.left + s.dimension.width);
                      A = s.offset.left + D - j / 2;
                      M = s.offset.top - a - _ - 12;
                      H();
                      B("bottom", "top")
                  }
                  if (P == "top-left") {
                      A = s.offset.left + D;
                      M = s.offset.top - a - _ - 12;
                      H();
                      B("bottom-left", "top-left")
                  }
                  if (P == "top-right") {
                      A = s.offset.left + s.dimension.width + D - o;
                      M = s.offset.top - a - _ - 12;
                      H();
                      B("bottom-right", "top-right")
                  }
                  if (P == "bottom") {
                      var j = s.offset.left + o - (s.offset.left + s.dimension.width);
                      A = s.offset.left - j / 2 + D;
                      M = s.offset.top + s.dimension.height + _ + 12;
                      H();
                      B("top", "bottom")
                  }
                  if (P == "bottom-left") {
                      A = s.offset.left + D;
                      M = s.offset.top + s.dimension.height + _ + 12;
                      H();
                      B("top-left", "bottom-left")
                  }
                  if (P == "bottom-right") {
                      A = s.offset.left + s.dimension.width + D - o;
                      M = s.offset.top + s.dimension.height + _ + 12;
                      H();
                      B("top-right", "bottom-right")
                  }
                  if (P == "left") {
                      A = s.offset.left - D - o - 12;
                      O = s.offset.left + D + s.dimension.width + 12;
                      var F = s.offset.top + a - (s.offset.top + s.dimension.height);
                      M = s.offset.top - F / 2 - _;
                      if (A < 0 && O + o > i) {
                          var I = parseFloat(n.$tooltip.css("border-width")) * 2,
                              q = o + A - I;
                          n.$tooltip.css("width", q + "px");
                          a = n.$tooltip.outerHeight(false);
                          A = s.offset.left - D - q - 12 - I;
                          F = s.offset.top + a - (s.offset.top + s.dimension.height);
                          M = s.offset.top - F / 2 - _
                      } else if (A < 0) {
                          A = s.offset.left + D + s.dimension.width + 12;
                          r = "left"
                      }
                  }
                  if (P == "right") {
                      A = s.offset.left + D + s.dimension.width + 12;
                      O = s.offset.left - D - o - 12;
                      var F = s.offset.top + a - (s.offset.top + s.dimension.height);
                      M = s.offset.top - F / 2 - _;
                      if (A + o > i && O < 0) {
                          var I = parseFloat(n.$tooltip.css("border-width")) * 2,
                              q = i - A - I;
                          n.$tooltip.css("width", q + "px");
                          a = n.$tooltip.outerHeight(false);
                          F = s.offset.top + a - (s.offset.top + s.dimension.height);
                          M = s.offset.top - F / 2 - _
                      } else if (A + o > i) {
                          A = s.offset.left - D - o - 12;
                          r = "right"
                      }
                  }
                  if (n.options.arrow) {
                      var R = "tooltipster-arrow-" + P;
                      if (n.options.arrowColor.length < 1) {
                          var U = n.$tooltip.css("background-color")
                      } else {
                          var U = n.options.arrowColor
                      }
                      if (!r) {
                          r = ""
                      } else if (r == "left") {
                          R = "tooltipster-arrow-right";
                          r = ""
                      } else if (r == "right") {
                          R = "tooltipster-arrow-left";
                          r = ""
                      } else {
                          r = "left:" + Math.round(r) + "px;"
                      }
                      if (P == "top" || P == "top-left" || P == "top-right") {
                          var z = parseFloat(n.$tooltip.css("border-bottom-width")),
                              W = n.$tooltip.css("border-bottom-color")
                      } else if (P == "bottom" || P == "bottom-left" || P == "bottom-right") {
                          var z = parseFloat(n.$tooltip.css("border-top-width")),
                              W = n.$tooltip.css("border-top-color")
                      } else if (P == "left") {
                          var z = parseFloat(n.$tooltip.css("border-right-width")),
                              W = n.$tooltip.css("border-right-color")
                      } else if (P == "right") {
                          var z = parseFloat(n.$tooltip.css("border-left-width")),
                              W = n.$tooltip.css("border-left-color")
                      } else {
                          var z = parseFloat(n.$tooltip.css("border-bottom-width")),
                              W = n.$tooltip.css("border-bottom-color")
                      }
                      if (z > 1) {
                          z++
                      }
                      var X = "";
                      if (z !== 0) {
                          var V = "",
                              J = "border-color: " + W + ";";
                          if (R.indexOf("bottom") !== -1) {
                              V = "margin-top: -" + Math.round(z) + "px;"
                          } else if (R.indexOf("top") !== -1) {
                              V = "margin-bottom: -" + Math.round(z) + "px;"
                          } else if (R.indexOf("left") !== -1) {
                              V = "margin-right: -" + Math.round(z) + "px;"
                          } else if (R.indexOf("right") !== -1) {
                              V = "margin-left: -" + Math.round(z) + "px;"
                          }
                          X = '<span class="tooltipster-arrow-border" style="' + V + " " + J + ';"></span>'
                      }
                      n.$tooltip.find(".tooltipster-arrow").remove();
                      var K = '<div class="' + R + ' tooltipster-arrow" style="' + r + '">' + X + '<span style="border-color:' + U + ';"></span></div>';
                      n.$tooltip.append(K)
                  }
                  n.$tooltip.css({
                      top: Math.round(M) + "px",
                      left: Math.round(A) + "px"
                  })
              }
              return n
          },
          enable: function() {
              this.enabled = true;
              return this
          },
          disable: function() {
              this.hide();
              this.enabled = false;
              return this
          },
          destroy: function() {
              var t = this;
              t.hide();
              if (t.$el[0] !== t.$elProxy[0]) t.$elProxy.remove();
              t.$el.removeData(t.namespace).off("." + t.namespace);
              var n = t.$el.data("tooltipster-ns");
              if (n.length === 1) {
                  var r = typeof t.Content === "string" ? t.Content : e("<div></div>").append(t.Content).html();
                  t.$el.removeClass("tooltipstered").attr("title", r).removeData(t.namespace).removeData("tooltipster-ns").off("." + t.namespace)
              } else {
                  n = e.grep(n, function(e, n) {
                      return e !== t.namespace
                  });
                  t.$el.data("tooltipster-ns", n)
              }
              return t
          },
          elementIcon: function() {
              return this.$el[0] !== this.$elProxy[0] ? this.$elProxy[0] : undefined
          },
          elementTooltip: function() {
              return this.$tooltip ? this.$tooltip[0] : undefined
          },
          option: function(e, t) {
              if (typeof t == "undefined") return this.options[e];
              else {
                  this.options[e] = t;
                  return this
              }
          },
          status: function() {
              return this.Status
          }
      };
      e.fn[r] = function() {
          var t = arguments;
          if (this.length === 0) {
              if (typeof t[0] === "string") {
                  var n = true;
                  switch (t[0]) {
                      case "setDefaults":
                          e.extend(i, t[1]);
                          break;
                      default:
                          n = false;
                          break
                  }
                  if (n) return true;
                  else return this
              } else {
                  return this
              }
          } else {
              if (typeof t[0] === "string") {
                  var r = "#*$~&";
                  this.each(function() {
                      var n = e(this).data("tooltipster-ns"),
                          i = n ? e(this).data(n[0]) : null;
                      if (i) {
                          if (typeof i[t[0]] === "function") {
                              var s = i[t[0]](t[1], t[2])
                          } else {
                              throw new Error('Unknown method .tooltipster("' + t[0] + '")')
                          }
                          if (s !== i) {
                              r = s;
                              return false
                          }
                      } else {
                          throw new Error("You called Tooltipster's \"" + t[0] + '" method on an uninitialized element')
                      }
                  });
                  return r !== "#*$~&" ? r : this
              } else {
                  var o = [],
                      u = t[0] && typeof t[0].multiple !== "undefined",
                      a = u && t[0].multiple || !u && i.multiple;
                  this.each(function() {
                      var n = false,
                          r = e(this).data("tooltipster-ns"),
                          i = null;
                      if (!r) {
                          n = true
                      } else {
                          if (a) n = true;
                          else console.log('Tooltipster: one or more tooltips are already attached to this element: ignoring. Use the "multiple" option to attach more tooltips.')
                      }
                      if (n) {
                          i = new s(this, t[0]);
                          if (!r) r = [];
                          r.push(i.namespace);
                          e(this).data("tooltipster-ns", r);
                          e(this).data(i.namespace, i)
                      }
                      o.push(i)
                  });
                  if (a) return o;
                  else return this
              }
          }
      };
      var u = !!("ontouchstart" in t);
      var a = false;
      e("body").one("mousemove", function() {
          a = true
      })
  })(jQuery, window, document);
  (function($) {
      var ParallaxManager = function(options) {
          this.options = options;
          this.vendor_prefixes = ['webkit', 'moz', 'o', 'ms'];
          this.num_vendor_prefixes = this.vendor_prefixes.length;
          var thisBrowserSupportsStyle = function(style) {
              var vendors = ['Webkit', 'Moz', 'ms', 'O'];
              var num_vendors = vendors.length;
              var dummy_el = window.document.createElement('parallax');
              if (dummy_el.style[style] !== undefined) {
                  return true;
              }
              style = style.replace(/./, function(first) {
                  return first.toUpperCase();
              });
              for (var i = 0; i < num_vendors; i++) {
                  var pfx_style = vendors[i] + style;
                  if (dummy_el.style[pfx_style] !== undefined) {
                      return true;
                  }
              }
              return false;
          };
          this.has_3dtransforms = thisBrowserSupportsStyle('perspective');
          if (this.has_3dtransforms && thisBrowserSupportsStyle('WebkitPerspective')) {
              var $test_el = $('<div><style type="text/css">@media (transform-3d),(-webkit-transform-3d) {#parallax-3dtest {position: absolute;left: 9px;height: 5px;margin: 0;padding: 0;border: 0;}</style><div id="parallax-3dtest"></div></div>').appendTo('body');
              var $el = $('#parallax-3dtest');
              this.has_3dtransforms = $el.height() == 5 && $el.offset().left == 9;
              $test_el.remove();
          }
          this.has_2dtransforms = thisBrowserSupportsStyle('transform');
      };
      $.extend(ParallaxManager.prototype, {
          init: function() {
              this.scroll_factor = this.options.scroll_factor;
              var parallax_blocks = this.parallax_blocks = [];
              var image_attr = this.options.image_attr
              var $body = $('body');
              var $origins = this.options.origins;
              $origins.each(function() {
                  var $origin = $(this);
                  var $parallax_block;
                  if ($origin.data(image_attr)) {
                      $parallax_block = $('<div class="parallax-block"><img class="parallax-image" src="' + $origin.data(image_attr) + '"></div>');
                      parallax_blocks.push({
                          origin: $origin,
                          block: $parallax_block,
                          bg_ratio: $origin.data('width') / $origin.data('height')
                      });
                      $body.prepend($parallax_block);
                  } else if ($origin.data('tile')) {
                      $parallax_block = $('<div class="parallax-block"><div class="parallax-image" style="background-image: url(' + $origin.data('tile') + ')"></div></div>')
                      parallax_blocks.push({
                          origin: $origin,
                          block: $parallax_block,
                          bg_ratio: 1
                      });
                      $body.prepend($parallax_block);
                  }
              });
              var manager = this;
              var reconfigure = function() {
                  manager.redrawBlocks();
                  manager.render();
              };
              var $window = $(window);
              $window.on('load', reconfigure);
              $window.on('resize', reconfigure);
              $window.on('hwparallax.reconfigure', reconfigure);
              $window.on('scroll', function() {
                  manager.render();
              });
          },
          redrawBlocks: function() {
              var window_width = $(window).width();
              var window_height = this.window_height = $(window).height();
              var body = document.body;
              var html = document.documentElement;
              var document_height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
              this.max_scrolltop = Math.max(0, document_height - window_height);
              var num_parallax_blocks = this.parallax_blocks.length;
              for (var i = 0; i < num_parallax_blocks; i++) {
                  var parallax_block_data = this.parallax_blocks[i];
                  var $parallax_block = parallax_block_data.block;
                  var bg_ratio = parallax_block_data.bg_ratio;
                  var $parallax_image = $parallax_block.children('.parallax-image');
                  var $origin = parallax_block_data.origin;
                  var origin_height = $origin.outerHeight();
                  var min_height = window_height - ((window_height - origin_height) * this.scroll_factor);
                  var img_width = window_width;
                  var img_height = Math.ceil(img_width / bg_ratio);
                  var img_xoff = 0;
                  if (img_height < min_height) {
                      img_height = min_height;
                      img_width = img_height * bg_ratio;
                      img_xoff = Math.floor(img_width - window_width) / 2;
                  }
                  $parallax_image.width(img_width).height(img_height);
                  $parallax_block.width(window_width).height(origin_height).css('visibility', 'hidden');
                  $.extend(parallax_block_data, {
                      origin_position: $origin.offset().top,
                      origin_height: origin_height,
                      image: $parallax_image,
                      image_xoff: img_xoff,
                      image_height: img_height
                  });
              }
          },
          render: function() {
              if (!this.drawing) {
                  this.drawing = true;
                  var manager = this;
                  if (window.requestAnimationFrame) {
                      window.requestAnimationFrame(function() {
                          manager.draw();
                      }, document);
                  } else {
                      manager.draw();
                  }
              }
          },
          draw: function() {
              var scroll_top = Math.min(Math.max(0, $(window).scrollTop()), this.max_scrolltop);
              var num_blocks = this.parallax_blocks.length;
              var data;
              for (var i = 0; i < num_blocks; i++) {
                  data = this.parallax_blocks[i];
                  if (data.origin_position < scroll_top + this.window_height && data.origin_position + data.origin_height > scroll_top) {
                      var new_block_position = data.origin_position - scroll_top;
                      var new_image_position = new_block_position * (this.scroll_factor - 1);
                      var block_styles = {
                          visibility: 'visible'
                      };
                      var image_styles = {};
                      var block_transform, image_transform, prefixed_style;
                      var j;
                      if (this.has_3dtransforms) {
                          block_transform = block_styles.transform = 'translate3d(0px, ' + new_block_position + 'px, 0px)';
                          image_transform = image_styles.transform = 'translate3d(-' + data.image_xoff + 'px, ' + new_image_position + 'px, 0px)';
                          for (j = 0; j < this.num_vendor_prefixes; j++) {
                              prefixed_style = '-' + this.vendor_prefixes[j] + '-transform';
                              block_styles[prefixed_style] = block_transform;
                              image_styles[prefixed_style] = image_transform;
                          }
                      } else if (this.has_2dtransforms) {
                          block_transform = block_styles.transform = 'translate(0px, ' + new_block_position + 'px)';
                          image_transform = image_styles.transform = 'translate(-' + data.image_xoff + 'px, ' + new_image_position + 'px)';
                          for (j = 0; j < this.num_vendor_prefixes; j++) {
                              prefixed_style = '-' + this.vendor_prefixes[j] + '-transform';
                              block_styles[prefixed_style] = block_transform;
                              image_styles[prefixed_style] = image_transform;
                          }
                      } else {
                          block_styles.top = new_block_position + 'px';
                          block_styles.left = 0 + 'px';
                          image_styles.top = new_image_position + 'px';
                          image_styles.left = -data.image_xoff + 'px';
                      }
                      data.block.css(block_styles);
                      data.image.css(image_styles);
                  } else {
                      data.block.css('visibility', 'hidden');
                  }
              }
              this.drawing = false;
          }
      });
      $.extend($.fn, {
          parallax: function(options) {
              var settings = $.extend({
                  scroll_factor: 0.2,
                  image_attr: 'image'
              }, options, {
                  origins: $(this)
              });
              var pm = new ParallaxManager(settings);
              pm.init();
          }
      });
  })(jQuery);
  ! function(a, b, c, d) {
      function e(b, c) {
          this.element = b, this.options = a.extend({}, g, c), this._defaults = g, this._name = f, this.init()
      }
      var f = "stellar",
          g = {
              scrollProperty: "scroll",
              positionProperty: "position",
              horizontalScrolling: !0,
              verticalScrolling: !0,
              horizontalOffset: 0,
              verticalOffset: 0,
              responsive: !1,
              parallaxBackgrounds: !0,
              parallaxElements: !0,
              hideDistantElements: !0,
              hideElement: function(a) {
                  a.hide()
              },
              showElement: function(a) {
                  a.show()
              }
          },
          h = {
              scroll: {
                  getLeft: function(a) {
                      return a.scrollLeft()
                  },
                  setLeft: function(a, b) {
                      a.scrollLeft(b)
                  },
                  getTop: function(a) {
                      return a.scrollTop()
                  },
                  setTop: function(a, b) {
                      a.scrollTop(b)
                  }
              },
              position: {
                  getLeft: function(a) {
                      return -1 * parseInt(a.css("left"), 10)
                  },
                  getTop: function(a) {
                      return -1 * parseInt(a.css("top"), 10)
                  }
              },
              margin: {
                  getLeft: function(a) {
                      return -1 * parseInt(a.css("margin-left"), 10)
                  },
                  getTop: function(a) {
                      return -1 * parseInt(a.css("margin-top"), 10)
                  }
              },
              transform: {
                  getLeft: function(a) {
                      var b = getComputedStyle(a[0])[k];
                      return "none" !== b ? -1 * parseInt(b.match(/(-?[0-9]+)/g)[4], 10) : 0
                  },
                  getTop: function(a) {
                      var b = getComputedStyle(a[0])[k];
                      return "none" !== b ? -1 * parseInt(b.match(/(-?[0-9]+)/g)[5], 10) : 0
                  }
              }
          },
          i = {
              position: {
                  setLeft: function(a, b) {
                      a.css("left", b)
                  },
                  setTop: function(a, b) {
                      a.css("top", b)
                  }
              },
              transform: {
                  setPosition: function(a, b, c, d, e) {
                      a[0].style[k] = "translate3d(" + (b - c) + "px, " + (d - e) + "px, 0)"
                  }
              }
          },
          j = function() {
              var b, c = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
                  d = a("script")[0].style,
                  e = "";
              for (b in d)
                  if (c.test(b)) {
                      e = b.match(c)[0];
                      break
                  }
              return "WebkitOpacity" in d && (e = "Webkit"), "KhtmlOpacity" in d && (e = "Khtml"),
                  function(a) {
                      return e + (e.length > 0 ? a.charAt(0).toUpperCase() + a.slice(1) : a)
                  }
          }(),
          k = j("transform"),
          l = a("<div />", {
              style: "background:#fff"
          }).css("background-position-x") !== d,
          m = l ? function(a, b, c) {
              a.css({
                  "background-position-x": b,
                  "background-position-y": c
              })
          } : function(a, b, c) {
              a.css("background-position", b + " " + c)
          },
          n = l ? function(a) {
              return [a.css("background-position-x"), a.css("background-position-y")]
          } : function(a) {
              return a.css("background-position").split(" ")
          },
          o = b.requestAnimationFrame || b.webkitRequestAnimationFrame || b.mozRequestAnimationFrame || b.oRequestAnimationFrame || b.msRequestAnimationFrame || function(a) {
              setTimeout(a, 1e3 / 60)
          };
      e.prototype = {
          init: function() {
              this.options.name = f + "_" + Math.floor(1e9 * Math.random()), this._defineElements(), this._defineGetters(), this._defineSetters(), this._handleWindowLoadAndResize(), this._detectViewport(), this.refresh({
                  firstLoad: !0
              }), "scroll" === this.options.scrollProperty ? this._handleScrollEvent() : this._startAnimationLoop()
          },
          _defineElements: function() {
              this.element === c.body && (this.element = b), this.$scrollElement = a(this.element), this.$element = this.element === b ? a("body") : this.$scrollElement, this.$viewportElement = this.options.viewportElement !== d ? a(this.options.viewportElement) : this.$scrollElement[0] === b || "scroll" === this.options.scrollProperty ? this.$scrollElement : this.$scrollElement.parent()
          },
          _defineGetters: function() {
              var a = this,
                  b = h[a.options.scrollProperty];
              this._getScrollLeft = function() {
                  return b.getLeft(a.$scrollElement)
              }, this._getScrollTop = function() {
                  return b.getTop(a.$scrollElement)
              }
          },
          _defineSetters: function() {
              var b = this,
                  c = h[b.options.scrollProperty],
                  d = i[b.options.positionProperty],
                  e = c.setLeft,
                  f = c.setTop;
              this._setScrollLeft = "function" == typeof e ? function(a) {
                  e(b.$scrollElement, a)
              } : a.noop, this._setScrollTop = "function" == typeof f ? function(a) {
                  f(b.$scrollElement, a)
              } : a.noop, this._setPosition = d.setPosition || function(a, c, e, f, g) {
                  b.options.horizontalScrolling && d.setLeft(a, c, e), b.options.verticalScrolling && d.setTop(a, f, g)
              }
          },
          _handleWindowLoadAndResize: function() {
              var c = this,
                  d = a(b);
              c.options.responsive && d.bind("load." + this.name, function() {
                  c.refresh()
              }), d.bind("resize." + this.name, function() {
                  c._detectViewport(), c.options.responsive && c.refresh()
              })
          },
          refresh: function(c) {
              var d = this,
                  e = d._getScrollLeft(),
                  f = d._getScrollTop();
              c && c.firstLoad || this._reset(), this._setScrollLeft(0), this._setScrollTop(0), this._setOffsets(), this._findParticles(), this._findBackgrounds(), c && c.firstLoad && /WebKit/.test(navigator.userAgent) && a(b).load(function() {
                  var a = d._getScrollLeft(),
                      b = d._getScrollTop();
                  d._setScrollLeft(a + 1), d._setScrollTop(b + 1), d._setScrollLeft(a), d._setScrollTop(b)
              }), this._setScrollLeft(e), this._setScrollTop(f)
          },
          _detectViewport: function() {
              var a = this.$viewportElement.offset(),
                  b = null !== a && a !== d;
              this.viewportWidth = this.$viewportElement.width(), this.viewportHeight = this.$viewportElement.height(), this.viewportOffsetTop = b ? a.top : 0, this.viewportOffsetLeft = b ? a.left : 0
          },
          _findParticles: function() {
              {
                  var b = this;
                  this._getScrollLeft(), this._getScrollTop()
              }
              if (this.particles !== d)
                  for (var c = this.particles.length - 1; c >= 0; c--) this.particles[c].$element.data("stellar-elementIsActive", d);
              this.particles = [], this.options.parallaxElements && this.$element.find("[data-stellar-ratio]").each(function() {
                  var c, e, f, g, h, i, j, k, l, m = a(this),
                      n = 0,
                      o = 0,
                      p = 0,
                      q = 0;
                  if (m.data("stellar-elementIsActive")) {
                      if (m.data("stellar-elementIsActive") !== this) return
                  } else m.data("stellar-elementIsActive", this);
                  b.options.showElement(m), m.data("stellar-startingLeft") ? (m.css("left", m.data("stellar-startingLeft")), m.css("top", m.data("stellar-startingTop"))) : (m.data("stellar-startingLeft", m.css("left")), m.data("stellar-startingTop", m.css("top"))), f = m.position().left, g = m.position().top, h = "auto" === m.css("margin-left") ? 0 : parseInt(m.css("margin-left"), 10), i = "auto" === m.css("margin-top") ? 0 : parseInt(m.css("margin-top"), 10), k = m.offset().left - h, l = m.offset().top - i, m.parents().each(function() {
                      var b = a(this);
                      return b.data("stellar-offset-parent") === !0 ? (n = p, o = q, j = b, !1) : (p += b.position().left, void(q += b.position().top))
                  }), c = m.data("stellar-horizontal-offset") !== d ? m.data("stellar-horizontal-offset") : j !== d && j.data("stellar-horizontal-offset") !== d ? j.data("stellar-horizontal-offset") : b.horizontalOffset, e = m.data("stellar-vertical-offset") !== d ? m.data("stellar-vertical-offset") : j !== d && j.data("stellar-vertical-offset") !== d ? j.data("stellar-vertical-offset") : b.verticalOffset, b.particles.push({
                      $element: m,
                      $offsetParent: j,
                      isFixed: "fixed" === m.css("position"),
                      horizontalOffset: c,
                      verticalOffset: e,
                      startingPositionLeft: f,
                      startingPositionTop: g,
                      startingOffsetLeft: k,
                      startingOffsetTop: l,
                      parentOffsetLeft: n,
                      parentOffsetTop: o,
                      stellarRatio: m.data("stellar-ratio") !== d ? m.data("stellar-ratio") : 1,
                      width: m.outerWidth(!0),
                      height: m.outerHeight(!0),
                      isHidden: !1
                  })
              })
          },
          _findBackgrounds: function() {
              var b, c = this,
                  e = this._getScrollLeft(),
                  f = this._getScrollTop();
              this.backgrounds = [], this.options.parallaxBackgrounds && (b = this.$element.find("[data-stellar-background-ratio]"), this.$element.data("stellar-background-ratio") && (b = b.add(this.$element)), b.each(function() {
                  var b, g, h, i, j, k, l, o = a(this),
                      p = n(o),
                      q = 0,
                      r = 0,
                      s = 0,
                      t = 0;
                  if (o.data("stellar-backgroundIsActive")) {
                      if (o.data("stellar-backgroundIsActive") !== this) return
                  } else o.data("stellar-backgroundIsActive", this);
                  o.data("stellar-backgroundStartingLeft") ? m(o, o.data("stellar-backgroundStartingLeft"), o.data("stellar-backgroundStartingTop")) : (o.data("stellar-backgroundStartingLeft", p[0]), o.data("stellar-backgroundStartingTop", p[1])), h = "auto" === o.css("margin-left") ? 0 : parseInt(o.css("margin-left"), 10), i = "auto" === o.css("margin-top") ? 0 : parseInt(o.css("margin-top"), 10), j = o.offset().left - h - e, k = o.offset().top - i - f, o.parents().each(function() {
                      var b = a(this);
                      return b.data("stellar-offset-parent") === !0 ? (q = s, r = t, l = b, !1) : (s += b.position().left, void(t += b.position().top))
                  }), b = o.data("stellar-horizontal-offset") !== d ? o.data("stellar-horizontal-offset") : l !== d && l.data("stellar-horizontal-offset") !== d ? l.data("stellar-horizontal-offset") : c.horizontalOffset, g = o.data("stellar-vertical-offset") !== d ? o.data("stellar-vertical-offset") : l !== d && l.data("stellar-vertical-offset") !== d ? l.data("stellar-vertical-offset") : c.verticalOffset, c.backgrounds.push({
                      $element: o,
                      $offsetParent: l,
                      isFixed: "fixed" === o.css("background-attachment"),
                      horizontalOffset: b,
                      verticalOffset: g,
                      startingValueLeft: p[0],
                      startingValueTop: p[1],
                      startingBackgroundPositionLeft: isNaN(parseInt(p[0], 10)) ? 0 : parseInt(p[0], 10),
                      startingBackgroundPositionTop: isNaN(parseInt(p[1], 10)) ? 0 : parseInt(p[1], 10),
                      startingPositionLeft: o.position().left,
                      startingPositionTop: o.position().top,
                      startingOffsetLeft: j,
                      startingOffsetTop: k,
                      parentOffsetLeft: q,
                      parentOffsetTop: r,
                      stellarRatio: o.data("stellar-background-ratio") === d ? 1 : o.data("stellar-background-ratio")
                  })
              }))
          },
          _reset: function() {
              var a, b, c, d, e;
              for (e = this.particles.length - 1; e >= 0; e--) a = this.particles[e], b = a.$element.data("stellar-startingLeft"), c = a.$element.data("stellar-startingTop"), this._setPosition(a.$element, b, b, c, c), this.options.showElement(a.$element), a.$element.data("stellar-startingLeft", null).data("stellar-elementIsActive", null).data("stellar-backgroundIsActive", null);
              for (e = this.backgrounds.length - 1; e >= 0; e--) d = this.backgrounds[e], d.$element.data("stellar-backgroundStartingLeft", null).data("stellar-backgroundStartingTop", null), m(d.$element, d.startingValueLeft, d.startingValueTop)
          },
          destroy: function() {
              this._reset(), this.$scrollElement.unbind("resize." + this.name).unbind("scroll." + this.name), this._animationLoop = a.noop, a(b).unbind("load." + this.name).unbind("resize." + this.name)
          },
          _setOffsets: function() {
              var c = this,
                  d = a(b);
              d.unbind("resize.horizontal-" + this.name).unbind("resize.vertical-" + this.name), "function" == typeof this.options.horizontalOffset ? (this.horizontalOffset = this.options.horizontalOffset(), d.bind("resize.horizontal-" + this.name, function() {
                  c.horizontalOffset = c.options.horizontalOffset()
              })) : this.horizontalOffset = this.options.horizontalOffset, "function" == typeof this.options.verticalOffset ? (this.verticalOffset = this.options.verticalOffset(), d.bind("resize.vertical-" + this.name, function() {
                  c.verticalOffset = c.options.verticalOffset()
              })) : this.verticalOffset = this.options.verticalOffset
          },
          _repositionElements: function() {
              var a, b, c, d, e, f, g, h, i, j, k = this._getScrollLeft(),
                  l = this._getScrollTop(),
                  n = !0,
                  o = !0;
              if (this.currentScrollLeft !== k || this.currentScrollTop !== l || this.currentWidth !== this.viewportWidth || this.currentHeight !== this.viewportHeight) {
                  for (this.currentScrollLeft = k, this.currentScrollTop = l, this.currentWidth = this.viewportWidth, this.currentHeight = this.viewportHeight, j = this.particles.length - 1; j >= 0; j--) a = this.particles[j], b = a.isFixed ? 1 : 0, this.options.horizontalScrolling ? (f = (k + a.horizontalOffset + this.viewportOffsetLeft + a.startingPositionLeft - a.startingOffsetLeft + a.parentOffsetLeft) * -(a.stellarRatio + b - 1) + a.startingPositionLeft, h = f - a.startingPositionLeft + a.startingOffsetLeft) : (f = a.startingPositionLeft, h = a.startingOffsetLeft), this.options.verticalScrolling ? (g = (l + a.verticalOffset + this.viewportOffsetTop + a.startingPositionTop - a.startingOffsetTop + a.parentOffsetTop) * -(a.stellarRatio + b - 1) + a.startingPositionTop, i = g - a.startingPositionTop + a.startingOffsetTop) : (g = a.startingPositionTop, i = a.startingOffsetTop), this.options.hideDistantElements && (o = !this.options.horizontalScrolling || h + a.width > (a.isFixed ? 0 : k) && h < (a.isFixed ? 0 : k) + this.viewportWidth + this.viewportOffsetLeft, n = !this.options.verticalScrolling || i + a.height > (a.isFixed ? 0 : l) && i < (a.isFixed ? 0 : l) + this.viewportHeight + this.viewportOffsetTop), o && n ? (a.isHidden && (this.options.showElement(a.$element), a.isHidden = !1), this._setPosition(a.$element, f, a.startingPositionLeft, g, a.startingPositionTop)) : a.isHidden || (this.options.hideElement(a.$element), a.isHidden = !0);
                  for (j = this.backgrounds.length - 1; j >= 0; j--) c = this.backgrounds[j], b = c.isFixed ? 0 : 1, d = this.options.horizontalScrolling ? (k + c.horizontalOffset - this.viewportOffsetLeft - c.startingOffsetLeft + c.parentOffsetLeft - c.startingBackgroundPositionLeft) * (b - c.stellarRatio) + "px" : c.startingValueLeft, e = this.options.verticalScrolling ? (l + c.verticalOffset - this.viewportOffsetTop - c.startingOffsetTop + c.parentOffsetTop - c.startingBackgroundPositionTop) * (b - c.stellarRatio) + "px" : c.startingValueTop, m(c.$element, d, e)
              }
          },
          _handleScrollEvent: function() {
              var a = this,
                  b = !1,
                  c = function() {
                      a._repositionElements(), b = !1
                  },
                  d = function() {
                      b || (o(c), b = !0)
                  };
              this.$scrollElement.bind("scroll." + this.name, d), d()
          },
          _startAnimationLoop: function() {
              var a = this;
              this._animationLoop = function() {
                  o(a._animationLoop), a._repositionElements()
              }, this._animationLoop()
          }
      }, a.fn[f] = function(b) {
          var c = arguments;
          return b === d || "object" == typeof b ? this.each(function() {
              a.data(this, "plugin_" + f) || a.data(this, "plugin_" + f, new e(this, b))
          }) : "string" == typeof b && "_" !== b[0] && "init" !== b ? this.each(function() {
              var d = a.data(this, "plugin_" + f);
              d instanceof e && "function" == typeof d[b] && d[b].apply(d, Array.prototype.slice.call(c, 1)), "destroy" === b && a.data(this, "plugin_" + f, null)
          }) : void 0
      }, a[f] = function() {
          var c = a(b);
          return c.stellar.apply(c, Array.prototype.slice.call(arguments, 0))
      }, a[f].scrollProperty = h, a[f].positionProperty = i, b.Stellar = e
  }(jQuery, this, document);
  (function(a) {
      a.fn.resizeToParent = function(c) {
          var e = {
              parent: "div",
              delay: 100
          };
          var c = a.extend(e, c);

          function f(n) {
              n.css({
                  width: "",
                  height: "",
                  "margin-left": "",
                  "margin-top": ""
              });
              var k = n.parents(c.parent).width();
              var j = n.parents(c.parent).height();
              var h = n.width();
              var g = n.height();
              var m = h / k;
              if ((g / m) < j) {
                  n.css({
                      width: "auto",
                      height: j
                  });
                  h = h / (g / j);
                  g = j
              } else {
                  n.css({
                      height: "auto",
                      width: k
                  });
                  h = k;
                  g = g / m
              }
              var l = (h - k) / -2;
              var i = (g - j) / -2;
              n.css({
                  "margin-left": l,
                  "margin-top": i
              })
          }
          var d;
          var b = this;
          a(window).on("resize", function() {
              clearTimeout(d);
              d = setTimeout(function() {
                  b.each(function() {
                      f(a(this))
                  })
              }, c.delay)
          });
          return this.each(function() {
              var g = a(this);
              g.attr("src", g.attr("src"));
              g.load(function() {
                  f(g)
              });
              if (this.complete) {
                  f(g)
              }
          })
      }
  })(jQuery);
  jQuery.fn.center = function() {
      this.css("left", (jQuery(window).width() / 2) - (this.outerWidth() / 2));
      return this;
  }
  jQuery.fn.animateAuto = function(prop, speed, callback) {
      var elem, height, width;
      return this.each(function(i, el) {
          el = jQuery(el), elem = el.clone().css({
              "height": "auto"
          }).appendTo("body");
          if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
              height = elem.height();
              height = elem.css("auto"), width = elem.css("width");
          } else {
              height = elem.height();
              height = height, width = elem.css("width");
          }
          elem.remove();
          if (prop === "height")
              el.animate({
                  "height": height + 15
              }, speed, callback);
          else if (prop === "max-height")
              el.animate({
                  "max-height": height
              }, speed, callback);
          else if (prop === "width")
              el.animate({
                  "width": width
              }, speed, callback);
          else if (prop === "both")
              el.animate({
                  "width": width,
                  "height": height
              }, speed, callback);
      });
  }
  jQuery.fn.setNav = function() {
      var calScreenWidth = jQuery(window).width();
      var menuLayout = jQuery('#pp_menu_layout').val();
      if (calScreenWidth >= 960) {
          jQuery('#main_menu li ul').css({
              display: 'none',
              opacity: 1
          });
          if (menuLayout != 'leftmenu') {
              jQuery('#menu_wrapper div .nav li.megamenu > ul > li').each(function() {
                  jQuery(this).css('height', jQuery(this).parent('ul').height() + 'px');
              });
          }
          jQuery('#main_menu li').each(function() {
              var jQuerysublist = jQuery(this).find('ul:first');
              jQuery(this).hover(function() {
                  position = jQuery(this).position();
                  if (jQuery(this).parents().attr('class') == 'sub-menu') {
                      jQuerysublist.stop().fadeIn(500);
                  } else {
                      jQuerysublist.stop().css({
                          overflow: 'visible'
                      }).fadeIn(500);
                  }
              }, function() {
                  jQuerysublist.stop().css({
                      height: 'auto'
                  }).fadeOut(500);
              });
          });
          jQuery('#menu_wrapper .nav ul li ul').css({
              display: 'none',
              opacity: 1
          });
          jQuery('#menu_wrapper .nav ul li').each(function() {
              var jQuerysublist = jQuery(this).find('ul:first');
              jQuery(this).hover(function() {
                  jQuerysublist.stop().fadeIn(500);
              }, function() {
                  jQuerysublist.stop().fadeOut(500);
              });
          });
      }
      jQuery('body').on('click', '.mobile_main_nav > li a', function(event) {
          var jQuerysublist = jQuery(this).parent('li').find('ul.sub-menu:first');
          var menuContainerClass = jQuery(this).parent('li').parent('#mobile_main_menu.mobile_main_nav').parent('div');
          if (jQuerysublist.length > 0) {
              event.preventDefault();
          }
          var menuLevel = 'top_level';
          var parentMenu = '';
          var menuClickedId = jQuery(this).attr('id');
          if (jQuery(this).parent('li').parent('ul').attr('id') == 'mobile_main_menu') {
              menuLevel = 'parent_level';
          } else {
              parentMenu = jQuery(this).parent('li').attr('id');
          }
          if (jQuerysublist.length > 0) {
              jQuery('#mobile_main_menu.mobile_main_nav').addClass('mainnav_out');
              jQuery('.mobile_menu_wrapper div #sub_menu').removeClass('subnav_in');
              jQuery('.mobile_menu_wrapper div #sub_menu').addClass('mainnav_out');
              setTimeout(function() {
                  jQuery('#mobile_main_menu.mobile_main_nav').css('display', 'none');
                  jQuery('.mobile_menu_wrapper div #sub_menu').remove();
                  var subMenuHTML = '<li><a href="#" id="menu_back" class="' + menuLevel + '" data-parent="' + parentMenu + '">' + jQuery('#pp_back').val() + '</a></li>';
                  subMenuHTML += jQuerysublist.html();
                  menuContainerClass.append('<ul id="sub_menu" class="nav ' + menuLevel + '"></ul>');
                  menuContainerClass.find('#sub_menu').html(subMenuHTML);
                  menuContainerClass.find('#sub_menu').addClass('subnav_in');
              }, 200);
          }
      });
      jQuery('body').on('click', '#menu_back.parent_level', function() {
          jQuery('.mobile_menu_wrapper div #sub_menu').removeClass('subnav_in');
          jQuery('.mobile_menu_wrapper div #sub_menu').addClass('subnav_out');
          jQuery('#mobile_main_menu.mobile_main_nav').removeClass('mainnav_out');
          setTimeout(function() {
              jQuery('.mobile_menu_wrapper div #sub_menu').remove();
              jQuery('#mobile_main_menu.mobile_main_nav').css('display', 'block');
              jQuery('#mobile_main_menu.mobile_main_nav').addClass('mainnav_in');
          }, 200);
      });
      jQuery('body').on('click', '#menu_back.top_level', function() {
          event.preventDefault();
          jQuery('.mobile_menu_wrapper div #sub_menu').addClass('subnav_out');
          var parentMenuId = jQuery(this).data('parent');
          setTimeout(function() {
              jQuery('.mobile_menu_wrapper div #sub_menu').remove();
              var menuLevel = 'top_level';
              var parentMenu = '';
              if (jQuery('#mobile_main_menu.mobile_main_nav li#' + parentMenuId).parent('ul.sub-menu:first').parent('li').parent('ul#main_menu').length == 1) {
                  menuLevel = 'parent_level';
              } else {
                  parentMenu = jQuery('#mobile_main_menu.mobile_main_nav li#' + parentMenuId).parent('ul.sub-menu:first').parent('li').attr('id');
              }
              var subMenuHTML = '<li><a href="#" id="menu_back" class="' + menuLevel + '" data-parent="' + parentMenu + '">' + jQuery('#pp_back').val() + '</a></li>';
              subMenuHTML += jQuery('#mobile_main_menu.mobile_main_nav li#' + parentMenuId).parent('ul.sub-menu:first').html();
              jQuery('.mobile_menu_wrapper div').append('<ul id="sub_menu" class="nav ' + menuLevel + '"></ul>');
              jQuery('.mobile_menu_wrapper div #sub_menu').html(subMenuHTML);
              jQuery('.mobile_menu_wrapper div #sub_menu').addClass('mainnav_in');
          }, 200);
      });
  }

  function adjustIframes() {
      jQuery('iframe').each(function() {
          var
              $this = jQuery(this),
              proportion = $this.data('proportion'),
              w = $this.attr('width'),
              actual_w = $this.width();
          if (!proportion) {
              proportion = $this.attr('height') / w;
              $this.data('proportion', proportion);
          }
          if (actual_w != w) {
              $this.css('height', Math.round(actual_w * proportion) + 'px !important');
          }
      });
  }

  function is_touch_device() {
      return 'ontouchstart' in window || 'onmsgesturechange' in window;
  };
  if (jQuery('#pp_page_title_img_blur').val() != '') {
      (function() {
          jQuery(window).scroll(function() {
              var oVal;
              oVal = jQuery(window).scrollTop() / 300;
              if (oVal > 1) {
                  oVal = 1;
              }
              if (oVal == 1) {
                  jQuery('body.single.single-post .post_share_bubble a.post_share, body.single.single-projects .post_share_bubble a.post_share, body.single.single-attachment .post_share_bubble a.post_share').css('display', 'block');
              }
              if (oVal == 0) {
                  jQuery('body.single.single-post .post_share_bubble a.post_share, body.single.single-projects .post_share_bubble a.post_share, body.single.single-attachment .post_share_bubble a.post_share').css('display', 'none');
              }
              return jQuery("#bg_blurred").css("opacity", oVal);
          });
      }).call(this);
  }
  if (jQuery('#pp_page_title_img_blur').val() != '') {
      (function() {
          jQuery(window).scroll(function() {
              var oVal;
              oVal = jQuery(window).scrollTop() / 300;
              if (oVal > 1) {
                  oVal = 1;
              }
              oVal = parseFloat(1 - oVal);
              return jQuery("#page_caption.hasbg .page_title_wrapper .page_title_inner").css("opacity", oVal);
          });
      }).call(this);
  }
  jQuery(document).ready(function() {
      "use strict";
      jQuery(document).setNav();
      jQuery(window).resize(function() {
          jQuery(document).setNav();
      });
      jQuery('.fancy_video, .lightbox_vimeo, .lightbox_youtube').magnificPopup({
          src: jQuery(this).attr('href'),
          type: 'inline',
          removalDelay: 300,
          mainClass: 'mfp-fade'
      });
      jQuery('a.fancy-gallery, .pp_gallery a').magnificPopup({
          type: 'image',
          removalDelay: 300,
          mainClass: 'mfp-fade',
          gallery: {
              enabled: true
          }
      });
      jQuery('.img_frame').magnificPopup({
          type: 'image',
          removalDelay: 300,
          mainClass: 'mfp-fade'
      });
      jQuery('#menu_expand_wrapper a').on('click', function() {
          jQuery('#menu_wrapper').fadeIn();
          jQuery('#custom_logo').animate({
              'left': '15px',
              'opacity': 1
          }, 400);
          jQuery('#menu_close').animate({
              'left': '-10px',
              'opacity': 1
          }, 400);
          jQuery(this).animate({
              'left': '-60px',
              'opacity': 0
          }, 400);
          jQuery('#menu_border_wrapper select').animate({
              'left': '0',
              'opacity': 1
          }, 400).fadeIn();
      });
      jQuery('#menu_close').on('click', function() {
          jQuery('#custom_logo').animate({
              'left': '-200px',
              'opacity': 0
          }, 400);
          jQuery(this).stop().animate({
              'left': '-200px',
              'opacity': 0
          }, 400);
          jQuery('#menu_expand_wrapper a').animate({
              'left': '20px',
              'opacity': 1
          }, 400);
          jQuery('#menu_border_wrapper select').animate({
              'left': '-200px',
              'opacity': 0
          }, 400).fadeOut();
          jQuery('#menu_wrapper').fadeOut();
      });
      jQuery.Isotope.prototype._getMasonryGutterColumns = function() {
          var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
          var containerWidth = this.element.width();
          this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth || this.$filteredAtoms.outerWidth(true) || containerWidth;
          this.masonry.columnWidth += gutter;
          this.masonry.cols = Math.floor((containerWidth + gutter) / this.masonry.columnWidth);
          this.masonry.cols = Math.max(this.masonry.cols, 1);
      };
      jQuery.Isotope.prototype._masonryReset = function() {
          this.masonry = {};
          this._getMasonryGutterColumns();
          var i = this.masonry.cols;
          this.masonry.colYs = [];
          while (i--) {
              this.masonry.colYs.push(0);
          }
      };
      jQuery.Isotope.prototype._masonryResizeChanged = function() {
          var prevSegments = this.masonry.cols;
          this._getMasonryGutterColumns();
          return (this.masonry.cols !== prevSegments);
      };
      var $window = jQuery(window);
      var dropdowns = jQuery(".portfolio_filter_dropdown");
      dropdowns.find(".portfolio_filter_dropdown_title").on('click', function() {
          dropdowns.find(".portfolio_filter_dropdown_select ul.portfolio_select").hide();
          jQuery(this).next().children().toggle();
      });
      dropdowns.find(".portfolio_filter_dropdown_select ul.portfolio_select li a").on('click', function() {
          var leSpan = jQuery(this).parents(".portfolio_filter_dropdown").find(".portfolio_filter_dropdown_title a span");
          jQuery(this).parents(".portfolio_filter_dropdown").find('.portfolio_filter_dropdown_select a').each(function() {
              jQuery(this).removeClass('selected');
          });
          leSpan.html(jQuery(this).html());
          if (jQuery(this).hasClass('default')) {
              leSpan.removeClass('selected')
          } else {
              leSpan.addClass('selected');
              jQuery(this).addClass('selected');
          }
          jQuery(this).parents("ul").hide();
      });
      jQuery(document).bind('click', function(e) {
          if (!jQuery(e.target).parents().hasClass("portfolio_filter_dropdown")) jQuery(".portfolio_filter_dropdown .portfolio_filter_dropdown_select ul.portfolio_select").hide();
      });

      function reLayout() {
          var jQuerycontainer = jQuery('#photo_wall_wrapper, .photo_wall_wrapper');
          var windowWidth = parseInt(jQuerycontainer.width());
          var jQueryportfolioColumn = 4;
          var columnValue;
          var masonryOpts;
          if (windowWidth < 480) {
              jQueryportfolioColumn = 1;
          } else if (windowWidth >= 480 && windowWidth < 960) {
              jQueryportfolioColumn = 2;
          } else if (windowWidth >= 960) {
              jQueryportfolioColumn = 4;
          }
          $container.addClass('visible');
          $container.isotope({
              resizable: false,
              itemSelector: '.wall_entry',
          }).isotope();
      }
      var $container = jQuery('#photo_wall_wrapper, .photo_wall_wrapper');
      $container.imagesLoaded(function() {
          reLayout();
          $window.smartresize(reLayout);
          $container.children('.wall_entry').children('.gallery_type').each(function() {
              jQuery(this).addClass('fade-in');
          });
          $container.children('.wall_entry').mouseenter(function() {
              jQuery(this).addClass('hover');
          });
          $container.children('.wall_entry').mouseleave(function() {
              $container.children('.wall_entry').removeClass('hover');
          });
      });
      jQuery(window).resize(function() {
          if (jQuery(this).width() < 768) {
              jQuery('#menu_expand_wrapper a').trigger('click');
          }
      });
      var isDisableRightClick = jQuery('#pp_enable_right_click').val();
      if (isDisableRightClick != '') {
          jQuery(this).bind("contextmenu", function(e) {
              e.preventDefault();
          });
      }

      function rePortfolioLayout() {
          var jQuerycontainer = jQuery('#portfolio_filter_wrapper, .portfolio_filter_wrapper');
          var windowWidth = jQuerycontainer.width();
          if (jQuery('#pp_menu_layout').val() == 'leftmenu' && jQuery(window).width() > 768) {
              windowWidth = parseInt(windowWidth + 265);
          }
          var jQueryportfolioColumn = jQuery('#pp_portfolio_columns').attr('value');
          var columnValue;
          var masonryOpts;
          if (jQuery('#pp_menu_layout').val() == 'leftmenu') {
              var windowWidth = jQuerycontainer.width();
          }
          if (jQuery.type(jQueryportfolioColumn) === "undefined") {
              if (windowWidth < 481) {
                  jQueryportfolioColumn = 1;
              } else if (windowWidth >= 480 && windowWidth < 960) {
                  jQueryportfolioColumn = 2;
              } else if (windowWidth >= 960) {
                  jQueryportfolioColumn = 4;
              }
          } else {
              if (windowWidth <= 768) {
                  jQueryportfolioColumn = 2;
              }
          }
          masonryOpts = {
              columnWidth: columnValue
          };
          jQuerycontainer.isotope({
              resizable: false,
              itemSelector: '.element',
              masonry: masonryOpts
          }).isotope();
      }
      var $window = jQuery(window);
      var jQuerycontainer = jQuery('#portfolio_filter_wrapper, .portfolio_filter_wrapper');
      jQuerycontainer.imagesLoaded(function() {
          rePortfolioLayout();
          $window.smartresize(rePortfolioLayout);
          jQuerycontainer.children('.element').children('.gallery_type').each(function() {
              jQuery(this).addClass('fadeIn');
          });
          jQuerycontainer.children('.element').children('.portfolio_type').each(function() {
              jQuery(this).addClass('fadeIn');
          });
          jQuerycontainer.children('.element').mouseenter(function() {
              jQuery(this).addClass('hover');
          });
          jQuerycontainer.children('.element').mouseleave(function() {
              jQuerycontainer.children('.element').removeClass('hover');
          });
          jQuery(this).addClass('visible');
      });
      if (jQuery('#tg_project_filterable_link').val() != 1) {
          jQuery('#project_services_filters li a').on('click', function() {
              var selector = jQuery(this).attr('data-filter');
              var selector_combine = jQuery('#project_sectors_filters').find('li').find('a.active').attr('data-filter');
              if (selector_combine != '*') {
                  selector += selector_combine;
              }
              jQuerycontainer.isotope({
                  filter: selector
              });
              jQuery('#project_services_filters li a').removeClass('active');
              jQuery(this).addClass('active');
              return false;
          });
          jQuery('#project_sectors_filters li a').on('click', function() {
              var selector = jQuery(this).attr('data-filter');
              var selector_combine = jQuery('#project_services_filters').find('li').find('a.active').attr('data-filter');
              if (selector_combine != '*') {
                  selector += selector_combine;
              }
              jQuerycontainer.isotope({
                  filter: selector
              });
              jQuery('#project_sectors_filters li a').removeClass('active');
              jQuery(this).addClass('active');
              return false;
          });
      }

      function reBlogLayout() {
          var windowWidth = jQuery(window).width();
          var jQueryblogcontainer = jQuery('#blog_grid_wrapper, .blog_grid_wrapper');
          var containerWidth = jQuery('#blog_grid_wrapper, .blog_grid_wrapper').width();
          var $blogGridColumn = 3;
          var columnValue = 0;
          var masonryOpts;
          if (containerWidth >= 960) {
              columnValue = containerWidth / $blogGridColumn;
          } else if (containerWidth < 960 && containerWidth >= 660) {
              columnValue = containerWidth / 2;
          } else {
              columnValue = containerWidth / 1;
          }
          masonryOpts = {
              columnWidth: columnValue
          };
          jQueryblogcontainer.isotope({
              resizable: false,
              itemSelector: '.status-publish',
              masonry: masonryOpts
          }).isotope();
      }
      var jQueryblogcontainer = jQuery('#blog_grid_wrapper, .blog_grid_wrapper');
      jQueryblogcontainer.imagesLoaded(function() {
          reBlogLayout();
          $window.smartresize(reBlogLayout);
      });
      jQuery(window).scroll(function() {
          var calScreenWidth = jQuery(window).width();
          if (jQuery(this).scrollTop() > 200) {
              jQuery('#toTop').stop().css({
                  opacity: 0.5,
                  "visibility": "visible"
              }).animate({
                  "visibility": "visible"
              }, {
                  duration: 1000,
                  easing: "easeOutExpo"
              });
          } else if (jQuery(this).scrollTop() == 0) {
              jQuery('#toTop').stop().css({
                  opacity: 0,
                  "visibility": "hidden"
              }).animate({
                  "visibility": "hidden"
              }, {
                  duration: 1500,
                  easing: "easeOutExpo"
              });
          }
      });
      jQuery('#toTop, .hr_totop').on('click', function() {
          jQuery('body,html').animate({
              scrollTop: 0
          }, 800);
      });
      var isDisableDragging = jQuery('#pp_enable_dragging').val();
      if (isDisableDragging != '') {
          jQuery("img").mousedown(function() {
              return false;
          });
      }
      if (jQuery('#pp_topbar').val() == 0) {
          var topBarHeight = jQuery('.header_style_wrapper').height();
      } else {
          var topBarHeight = parseInt(jQuery('.header_style_wrapper').height() - jQuery('.header_style_wrapper .above_top_bar').height());
      }
      var logoHeight = jQuery('#custom_logo img').height();
      var logoTransHeight = jQuery('#custom_logo_transparent img').height();
      var logoMargin = parseInt(jQuery('#custom_logo').css('marginTop'));
      var logoTransMargin = parseInt(jQuery('#custom_logo_transparent').css('marginTop'));
      var menuPaddingTop = parseInt(jQuery('#menu_wrapper div .nav li > a').css('paddingTop'));
      var menuPaddingBottom = parseInt(jQuery('#menu_wrapper div .nav li > a').css('paddingBottom'));
      var SearchPaddingTop = parseInt(jQuery('.top_bar #searchform button').css('paddingTop'));
      var menuLayout = jQuery('#pp_menu_layout').val();
      if (menuLayout != 'leftmenu' || jQuery(window).width() <= 768) {
          jQuery('#wrapper').css('paddingTop', parseInt(jQuery('.header_style_wrapper').height()) + 'px');
      }
      jQuery(window).resize(function() {
          if (jQuery(this).width() > 960) {
              if (menuLayout != 'leftmenu') {
                  var resizedTopBarHeight = jQuery('.header_style_wrapper').height();
                  jQuery('#wrapper').css('paddingTop', resizedTopBarHeight + 'px');
                  jQuery('.logo_wrapper').css('marginTop', '');
                  jQuery('.top_bar #searchform button').css('paddingTop', '');
              } else {
                  jQuery('#wrapper').css('paddingTop', 0);
              }
          } else {
              jQuery('#wrapper').css('paddingTop', parseInt(jQuery('.header_style_wrapper').height()) + 'px');
          }
      });
      if (menuLayout != 'leftmenu' || jQuery(window).width() <= 960) {
          if (jQuery(window).width() > 960) {
              jQuery('#wrapper').css('paddingTop', parseInt(topBarHeight + jQuery('.header_style_wrapper .above_top_bar').height()) + 'px');
              jQuery('.top_bar').css('height', topBarHeight + 'px');
          } else {
              jQuery('#wrapper').css('paddingTop', parseInt(jQuery('.header_style_wrapper').height()) + 'px');
          }
          jQuery(window).scroll(function() {
              if (jQuery('#pp_fixed_menu').val() == 1) {
                  if (jQuery(this).scrollTop() >= 200) {
                      jQuery('.header_style_wrapper .above_top_bar').hide();
                      jQuery('.extend_top_contact_info').hide();
                      if (jQuery(window).width() >= 1024) {
                          jQuery('.top_bar').addClass('scroll');
                          jQuery('.top_bar').css('height', parseInt(topBarHeight / 1.5) + 'px');
                          jQuery('.top_bar').css('height', parseInt(topBarHeight / 1.5) + 'px');
                          jQuery('#custom_logo img').addClass('zoom');
                          jQuery('#custom_logo img').css('width', 'auto');
                          jQuery('#custom_logo img').css('maxHeight', parseInt(topBarHeight / 3) + 'px');
                          jQuery('#custom_logo_transparent img').addClass('zoom');
                          jQuery('#custom_logo').css('marginTop', parseInt(logoMargin / 1.5) + 'px');
                          jQuery('#custom_logo_transparent').css('marginTop', parseInt(logoTransMargin / 1.5) + 'px');
                          jQuery('#menu_wrapper div .nav > li > a').css('paddingTop', parseInt(menuPaddingTop / 1.7) + 'px');
                          jQuery('#menu_wrapper div .nav > li > a').css('paddingBottom', parseInt(menuPaddingBottom / 1.7) + 'px');
                          if (menuLayout == 'centermenu') {
                              jQuery('.logo_container').addClass('hidden');
                          }
                      }
                      if (jQuery('.top_bar').hasClass('hasbg')) {
                          jQuery('.top_bar').removeClass('hasbg');
                          jQuery('.top_bar').data('hasbg', 1);
                          jQuery('#custom_logo').removeClass('hidden');
                          jQuery('#custom_logo_transparent').addClass('hidden');
                      }
                      if (jQuery(window).width() > 960) {
                          jQuery('#mobile_nav_icon').hide();
                      }
                  } else if (jQuery(this).scrollTop() < 200) {
                      jQuery('.header_style_wrapper .above_top_bar').show();
                      jQuery('.extend_top_contact_info').show();
                      jQuery('.top_bar').removeClass('scroll');
                      jQuery('.top_bar').css('height', topBarHeight + 'px');
                      jQuery('#custom_logo img').removeClass('zoom');
                      jQuery('#custom_logo img').css('maxHeight', '');
                      jQuery('#custom_logo_transparent img').removeClass('zoom');
                      jQuery('#custom_logo').css('marginTop', parseInt(logoMargin) + 'px');
                      jQuery('#custom_logo_transparent').css('marginTop', parseInt(logoTransMargin) + 'px');
                      jQuery('#menu_wrapper div .nav > li > a').css('paddingTop', menuPaddingTop + 'px');
                      jQuery('#menu_wrapper div .nav > li > a').css('paddingBottom', menuPaddingBottom + 'px');
                      if (menuLayout == 'centermenu') {
                          if (jQuery('.top_bar').data('hasbg') == 1) {
                              jQuery('#logo_transparent.logo_container').removeClass('hidden');
                          } else {
                              jQuery('#logo_normal.logo_container').removeClass('hidden');
                          }
                      }
                      if (jQuery('.top_bar').data('hasbg') == 1) {
                          jQuery('.top_bar').addClass('hasbg');
                          jQuery('#custom_logo').addClass('hidden');
                          jQuery('#custom_logo_transparent').removeClass('hidden');
                      }
                      jQuery('#mobile_nav_icon').show();
                  }
              } else {
                  if (jQuery(this).scrollTop() >= 200) {
                      jQuery('.header_style_wrapper').addClass('nofixed');
                  } else {
                      jQuery('.header_style_wrapper').removeClass('nofixed');
                  }
              }
          });
      }
      jQuery('.post_img img').imagesLoaded(function() {
          jQuery(this).parent('.post_img').addClass('fadeIn');
      });
      jQuery(document).mouseenter(function() {
          jQuery('body').addClass('hover');
      });
      jQuery(document).mouseleave(function() {
          jQuery('body').removeClass('hover');
      });
      jQuery('#slidecaption').center();
      jQuery(window).resize(function() {
          jQuery('#slidecaption').center();
      });
      var siteBaseURL = jQuery('#pp_homepage_url').val();
      if (jQuery('#pp_ajax_search').val() != '') {
          jQuery('#s').on('input', function() {
              jQuery.ajax({
                  url: siteBaseURL + "/wp-admin/admin-ajax.php",
                  type: 'POST',
                  data: 'action=pp_ajax_search&s=' + jQuery('#s').val(),
                  success: function(results) {
                      jQuery("#autocomplete").html(results);
                      if (results != '') {
                          jQuery("#autocomplete").addClass('visible');
                          jQuery("#autocomplete").show();
                          jQuery("body.js_nav .mobile_menu_wrapper").css('overflow', 'visible');
                      } else {
                          jQuery("#autocomplete").hide();
                          jQuery("body.js_nav .mobile_menu_wrapper").css('overflow', 'scroll');
                      }
                  }
              })
          });
          jQuery("#s").keypress(function(event) {
              if (event.which == 13) {
                  event.preventDefault();
                  jQuery("form#searchform").submit();
              }
          });
          jQuery('#s').focus(function() {
              if (jQuery('#autocomplete').html() != '') {
                  jQuery("#autocomplete").addClass('visible');
                  jQuery("#autocomplete").fadeIn();
              }
          });
          jQuery('#s').blur(function() {
              jQuery("#autocomplete").fadeOut();
          });
      }
      jQuery('.animated').imagesLoaded(function() {
          var windowWidth = jQuery(window).width();
          if (windowWidth >= 960) {
              jQuery(this).waypoint(function(direction) {
                  var animationClass = jQuery(this).data('animation');
                  jQuery(this).addClass(animationClass, direction === 'down');
              }, {
                  offset: '100%'
              });
          }
      });
      jQuery('#post_more_close').on('click', function() {
          jQuery('#post_more_wrapper').animate({
              right: '-380px'
          }, 300);
          return false;
      });
      jQuery('.parallax').each(function() {
          var parallaxHeight = jQuery(this).data('content-height');
          parallaxHeight = parseInt((parallaxHeight / 100) * jQuery(window).height());
          jQuery(this).css('height', parallaxHeight + 'px');
      });
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE ");
      if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./) || is_touch_device()) {
          jQuery('.parallax').each(function() {
              var dataImgURL = jQuery(this).data('image');
              if (jQuery.type(dataImgURL) != "undefined") {
                  jQuery(this).css('background-image', 'url(' + dataImgURL + ')');
                  jQuery(this).css('background-size', 'cover');
                  jQuery(this).css('background-position', 'center center');
              }
          });
      } else {
          if (jQuery(window).width() >= 960) {
              jQuery('.parallax').parallax();
          } else {
              jQuery('.parallax').each(function() {
                  var dataImgURL = jQuery(this).data('image');
                  if (jQuery.type(dataImgURL) != "undefined") {
                      jQuery(this).css('background-image', 'url(' + dataImgURL + ')');
                      jQuery(this).css('background-size', 'cover');
                      jQuery(this).css('background-position', 'center center');
                  }
              });
          }
          jQuery(window).resize(function() {
              if (jQuery(window).width() >= 960) {
                  jQuery('.parallax').each(function() {
                      var parallaxHeight = jQuery(this).data('content-height');
                      parallaxHeight = parseInt((parallaxHeight / 100) * jQuery(window).height());
                      jQuery(this).css('height', parallaxHeight + 'px');
                  });
                  jQuery(window).trigger('hwparallax.reconfigure');
              } else {
                  jQuery('.parallax').each(function() {
                      var dataImgURL = jQuery(this).data('image');
                      if (jQuery.type(dataImgURL) != "undefined") {
                          jQuery(this).css('background-image', 'url(' + dataImgURL + ')');
                          jQuery(this).css('background-size', 'cover');
                          jQuery(this).css('background-position', 'center center');
                      }
                  });
              }
          });
      }
      var stellarActivated = false;
      if (jQuery(window).width() >= 1024) {
          stellarActivated = true;
          jQuery(window).stellar({
              positionProperty: 'transform',
              parallaxBackgrounds: false,
              responsive: true,
              horizontalScrolling: false
          });
      }
      if (jQuery(window).width() <= 1024) {
          if (stellarActivated == true) {
              stellarActivated = false;
          }
      } else {
          if (stellarActivated == false) {
              jQuery(window).stellar({
                  positionProperty: 'transform',
                  parallaxBackgrounds: false,
                  responsive: true,
                  horizontalScrolling: false
              });
              stellarActivated = true;
          }
      }
      jQuery(window).resize(function() {
          if (jQuery(window).width() >= 1024) {
              stellarActivated = true;
              jQuery(window).stellar({
                  positionProperty: 'transform',
                  parallaxBackgrounds: false,
                  responsive: true,
                  horizontalScrolling: false
              });
          }
          if (jQuery(window).width() <= 1024) {
              if (stellarActivated == true) {
                  stellarActivated = false;
              }
          } else {
              if (stellarActivated == false) {
                  jQuery(window).stellar({
                      positionProperty: 'transform',
                      parallaxBackgrounds: false,
                      responsive: true,
                      horizontalScrolling: false
                  });
                  stellarActivated = true;
              }
          }
      });
      jQuery('#mobile_nav_icon').on('click', function() {
          jQuery('body,html').animate({
              scrollTop: 0
          }, 100);
          jQuery('body').toggleClass('js_nav');
          if (is_touch_device()) {
              jQuery('body.js_nav').css('overflow', 'auto');
          }
      });
      jQuery('#close_mobile_menu, #overlay_background').on('click', function() {
          jQuery('body').removeClass('js_nav');
      });
      jQuery('.mobile_menu_close a').on('click', function() {
          jQuery('body').removeClass('js_nav');
      });
      jQuery('.close_alert').on('click', function() {
          var target = jQuery(this).data('target');
          jQuery('#' + target).fadeOut();
      });
      jQuery('.progress_bar').waypoint(function(direction) {
          jQuery(this).addClass('fadeIn');
          var progressContent = jQuery(this).children('.progress_bar_holder').children('.progress_bar_content');
          var progressWidth = progressContent.data('score');
          progressContent.css({
              'width': progressWidth + '%'
          });
      }, {
          offset: '100%'
      });
      jQuery('.tooltip').tooltipster();
      jQuery('.demotip').tooltipster({
          position: 'left'
      });
      jQuery('.portfolio_prev_next_link').each(function() {
          jQuery(this).tooltipster({
              content: jQuery('<img src="' + jQuery(this).attr('data-img') + '" /><br/><div style="text-align:center;margin:7px 0 5px 0;"><strong>' + jQuery(this).attr('data-title') + '</strong></div>')
          });
      });
      jQuery('.post_prev_next_link').each(function() {
          jQuery(this).tooltipster({
              content: jQuery('<img src="' + jQuery(this).attr('data-img') + '" />')
          });
      });
      jQuery('.rev_slider_wrapper.fullscreen-container').each(function() {
          jQuery(this).append('<div class="icon-scroll"></div>');
      });
      jQuery('.post_share').on('click', function() {
          var targetShareID = jQuery(this).attr('data-share');
          var targetParentID = jQuery(this).attr('data-parent');
          jQuery(this).toggleClass('visible');
          jQuery('#' + targetShareID).toggleClass('slideUp');
          jQuery('#' + targetParentID).toggleClass('sharing');
          return false;
      });
      if (jQuery('.page_slider.menu_transparent').find('.rev_slider_wrapper').length > 0) {
          var sliderHeight = jQuery('.page_slider.menu_transparent').find('.rev_slider_wrapper').height();
          var topBarHeight = jQuery('.top_bar').height();
          if (jQuery('.above_top_bar').length > 0) {
              topBarHeight += jQuery('.above_top_bar').height();
          }
          if (jQuery('.page_slider.menu_transparent').find('.rev_slider_wrapper.fullscreen-container').length > 0) {
              var topBarHeight = 55;
          }
          jQuery('.ppb_wrapper').css('marginTop', sliderHeight - topBarHeight + 'px');
          jQuery('#page_content_wrapper').css('marginTop', sliderHeight - topBarHeight + 'px');
      }
      jQuery(window).resize(function() {
          if (jQuery('.page_slider.menu_transparent').find('.rev_slider_wrapper').length > 0) {
              var sliderHeight = jQuery('.page_slider.menu_transparent').find('.rev_slider_wrapper').height();
              var topBarHeight = jQuery('.top_bar').height();
              if (jQuery('.above_top_bar').length > 0) {
                  topBarHeight += jQuery('.above_top_bar').height();
              }
              if (jQuery('.page_slider.menu_transparent').find('.rev_slider_wrapper.fullscreen-container').length > 0) {
                  var topBarHeight = 55;
              }
              jQuery('.ppb_wrapper').css('marginTop', sliderHeight - topBarHeight + 'px');
              jQuery('#page_content_wrapper').css('marginTop', sliderHeight - topBarHeight + 'px');
          }
      });
      jQuery('.skin_box').on('click', function() {
          jQuery('.skin_box').removeClass('selected');
          jQuery(this).addClass('selected');
          jQuery('#skin').val(jQuery(this).attr('data-color'));
      });
      jQuery('#demo_apply').on('click', function() {
          jQuery('#ajax_loading').addClass('visible');
          jQuery('body').addClass('loading');
          jQuery("form#form_option").submit();
      });
      jQuery('#option_wrapper').mouseenter(function() {
          jQuery('body').addClass('overflow_hidden');
      });
      jQuery('#option_wrapper').mouseleave(function() {
          jQuery('body').removeClass('overflow_hidden');
      });
      jQuery('.animate').waypoint(function(direction) {
          var windowWidth = jQuery(window).width();
          jQuery(this).addClass('visible', direction === 'down');
      }, {
          offset: '80%'
      });
      var calScreenHeight = jQuery(window).height() - 108;
      var miniRightPos = 800;
      var cols = 3
      var masonry = jQuery('.gallery_mansory_wrapper');
      masonry.imagesLoaded(function() {
          masonry.masonry({
              itemSelector: '.mansory_thumbnail',
              isResizable: true,
              isAnimated: true,
              isFitWidth: true,
              columnWidth: Math.floor((masonry.width() / cols))
          });
          masonry.children('.mansory_thumbnail').children('.gallery_type').each(function() {
              jQuery(this).addClass('fade-in');
          });
      });
      jQuery(window).resize(function() {
          var masonry = jQuery('.gallery_mansory_wrapper');
          masonry.imagesLoaded(function() {
              masonry.masonry({
                  itemSelector: '.mansory_thumbnail',
                  isResizable: true,
                  isAnimated: true,
                  isFitWidth: true,
                  columnWidth: Math.floor((masonry.width() / cols))
              });
              masonry.children('.mansory_thumbnail').children('.gallery_type').each(function() {
                  jQuery(this).addClass('fade-in');
              });
          });
      });
      if (jQuery.browser.msie && parseFloat(jQuery.browser.version) < 10) {
          jQuery('.animate').css('opacity', 1);
          jQuery('.animate').css('visibility', 'visible');
          jQuery('.animated').each(function() {
              jQuery(this).css('opacity', 1);
              jQuery(this).css('visibility', 'visible');
          });
      }
      jQuery('#tg_reservation, .tg_reservation').on('click', function() {
          jQuery('#reservation_wrapper').fadeIn();
          jQuery('body').removeClass('js_nav');
          jQuery('body').addClass('overflow_hidden');
          jQuery('html').addClass('overflow_hidden');
      });
      jQuery('#tg_sidemenu_reservation').on('click', function() {
          jQuery('#reservation_wrapper').fadeIn();
          jQuery('body').removeClass('js_nav');
          jQuery('body').addClass('overflow_hidden');
          jQuery('html').addClass('overflow_hidden');
      });
      jQuery('#reservation_cancel_btn').on('click', function() {
          jQuery('#reservation_wrapper').fadeOut();
          jQuery('body').removeClass('overflow_hidden');
          jQuery('html').removeClass('overflow_hidden');
      });
      jQuery('body').on('adding_to_cart', function(event, param1, param2) {
          var currentCartCount = parseInt(jQuery('.header_cart_wrapper .cart_count').html());
          currentCartCount = currentCartCount + 1;
          jQuery('.header_cart_wrapper .cart_count').html(currentCartCount);
      });
      if (jQuery('.one.fullwidth.slideronly').length > 0) {
          jQuery('body').addClass('overflow_hidden');
      }
      var menuLayout = jQuery('#pp_menu_layout').val();
      if (jQuery(window).width() < 960 && menuLayout == 'leftmenu') {
          document.getElementById("leftmenu.css-css").disabled = true;
          jQuery('.mobile_menu_wrapper .logo_container').hide();
      }
      jQuery(window).resize(function() {
          if (jQuery(window).width() >= 960 && menuLayout == 'leftmenu') {
              document.getElementById("leftmenu.css-css").disabled = false;
              jQuery('.mobile_menu_wrapper .logo_container').show();
          } else if (jQuery(window).width() < 960 && menuLayout == 'leftmenu') {
              document.getElementById("leftmenu.css-css").disabled = true;
              jQuery('.mobile_menu_wrapper .logo_container').hide();
          }
      });
  });
  jQuery(window).on('resize load', adjustIframes);