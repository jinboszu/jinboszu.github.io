
var mr = (function ($, window, document){
    "use strict";

    var mr         = {},
        components = {documentReady: [], windowLoad: []};


    $(document).ready(documentReady);
    $(window).load(windowLoad);

    function documentReady(context){
        
        context = typeof context == typeof undefined ? $ : context;
        components.documentReady.forEach(function(component){
            component(context);
        });
    }

    function windowLoad(context){
        
        context = typeof context == "object" ? $ : context;
        components.windowLoad.forEach(function(component){
           component(context);
        });
    }

    mr.setContext = function (contextSelector){
        var context = $;
        if(typeof contextSelector !== typeof undefined){
            return function(selector){
                return $(contextSelector).find(selector);
            };
        }
        return context;
    };

    mr.components    = components;
    mr.documentReady = documentReady;
    mr.windowLoad    = windowLoad;

    return mr;
}(jQuery, window, document));


//////////////// Utility Functions
mr = (function (mr, $, window, document){
    "use strict";
    mr.util = {};

    mr.util.requestAnimationFrame    = window.requestAnimationFrame || 
                                       window.mozRequestAnimationFrame || 
                                       window.webkitRequestAnimationFrame ||
                                       window.msRequestAnimationFrame;

    mr.util.documentReady = function($){
        var today = new Date();
        var year = today.getFullYear();
        $('.update-year').text(year);
    };

    mr.util.getURLParameter = function(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    };


    mr.util.capitaliseFirstLetter = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    mr.util.slugify = function(text, spacesOnly){
        if(typeof spacesOnly !== typeof undefined){
            return text.replace(/ +/g, '');
        }else{
            return text
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        }
    };

    mr.util.sortChildrenByText = function(parentElement, reverse){
        var $parentElement = $(parentElement);
        var items          = $parentElement.children().get();
        var order          = -1;
        var order2         = 1;
        if(typeof reverse !== typeof undefined){order = 1; order2 = -1;}

        items.sort(function(a,b){
          var keyA = $(a).text();
          var keyB = $(b).text();

          if (keyA < keyB) return order;
          if (keyA > keyB) return order2;
          return 0;
        });
        
        // Append back into place
        $parentElement.empty();
        $(items).each(function(i, itm){
          $parentElement.append(itm);
        });
    }
    
    // Set data-src attribute of element from src to be restored later
    mr.util.idleSrc = function(context, selector){
        
            selector  = (typeof selector !== typeof undefined) ? selector : '';
            var elems = context.is(selector+'[src]') ? context : context.find(selector+'[src]');

        elems.each(function(index, elem){
            elem           = $(elem);
            var currentSrc = elem.attr('src'),
                dataSrc    = elem.attr('data-src');

            // If there is no data-src, save current source to it
            if(typeof dataSrc === typeof undefined){
                elem.attr('data-src', currentSrc);
            }

            // Clear the src attribute
            elem.attr('src', '');    
            
        });
    };

    // Set src attribute of element from its data-src where it was temporarily stored earlier
    mr.util.activateIdleSrc = function(context, selector){
        
        selector     = (typeof selector !== typeof undefined) ? selector : '';
        var elems    = context.is(selector+'[src]') ? context : context.find(selector+'[src]');

        elems.each(function(index, elem){
            elem = $(elem);
            var dataSrc    = elem.attr('data-src');

            // If there is no data-src, save current source to it
            if(typeof dataSrc !== typeof undefined){
                elem.attr('src', dataSrc);
            }
        });
    };

    mr.util.pauseVideo = function(context){
        var elems = context.is('video') ? context : context.find('video');

        elems.each(function(index, video){
            var playingVideo = $(video).get(0);
            playingVideo.pause();
        });
    };

    mr.components.documentReady.push(mr.util.documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Scroll Functions
mr = (function (mr, $, window, document){
    "use strict";

    mr.scroll           = {};
    mr.scroll.listeners = [];
    mr.scroll.y         = 0;
    mr.scroll.x         = 0;

     var documentReady = function($){
        
        // Check if scroll-assist is on
        if($('body').hasClass('scroll-assist')){
            mr.scroll.assisted = true;
        }

        //////////////// Capture Scroll Event and fire scroll function
        
        addEventListener('scroll', function(evt) {        
                //if(!mr.scroll.assisted){
                    window.mr.scroll.y = window.pageYOffset;
                //}
                window.mr.scroll.update(evt)
        }, false);
        
    };

    mr.scroll.update = function(event){
        // Loop through all mr scroll listeners
        for (var i = 0, l = mr.scroll.listeners.length; i < l; i++) {
           mr.scroll.listeners[i](event);
        }
    };

    mr.scroll.documentReady = documentReady;

    mr.components.documentReady.push(documentReady);

    return mr;

}(mr, jQuery, window, document));


//////////////// Accordions
mr = (function (mr, $, window, document){
    "use strict";
    
    var documentReady = function($){
        $('.accordion__title').on('click', function(){
            var accordion = $(this).closest('.accordion');
            var li = $(this).closest('li');
            if(li.hasClass('active')){
                li.removeClass('active');      
            }else{
                if(accordion.hasClass('accordion--oneopen')){
                    var wasActive = accordion.find('li.active');
                    wasActive.removeClass('active');
                    li.addClass('active');
                }else{
                    li.addClass('active');
                }
            }
        });

        $('.accordion').each(function(){
            var accordion = $(this);
            var minHeight = accordion.outerHeight(true);
            accordion.css('min-height',minHeight);
        });
    };

    mr.accordions = {
        documentReady : documentReady        
    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));


//////////////// Backgrounds
mr = (function (mr, $, window, document){
    "use strict";
    
    var documentReady = function($){
        
        //////////////// Append .background-image-holder <img>'s as CSS backgrounds

        $('.background-image-holder').each(function() {
            var imgSrc = $(this).children('img').attr('src');
            $(this).css('background', 'url("' + imgSrc + '")').css('background-position', 'initial').css('opacity','1');
        });
    };

    mr.backgrounds = {
        documentReady : documentReady        
    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Forms
mr = (function (mr, $, window, document){
    "use strict";
    
    mr.forms = {};

    var documentReady = function($){
        
        //////////////// Checkbox Inputs

        $('.input-checkbox').on('click', function() {
            var checkbox = $(this);
            checkbox.toggleClass('checked');
            
            var input = checkbox.find('input');
            if (input.prop('checked') === false) {
                input.prop('checked', true);
            } else {
                input.prop('checked', false);
            }
            return false;
        });

        //////////////// Radio Buttons

        $('.input-radio').on('click', function() {
            var radio = $(this);
            radio.closest('form').find('.input-radio').removeClass('checked');
            radio.addClass('checked').find('input').prop('checked', true);
            return false;
        });

        //////////////// File Uploads

        $('.input-file .btn').on('click',function(){
            $(this).siblings('input').trigger('click');
            return false;
        });
        
        //////////////// Handle Form Submit

        $('form.form-email, form[action*="list-manage.com"], form[action*="createsend.com"]').attr('novalidate', true).unbind('submit').on('submit', mr.forms.submit);

        //////////////// Handle Form Submit
        $(document).on('change, input, paste, keyup', '.attempted-submit .field-error', function(){
            $(this).removeClass('field-error');
        });

    };

    mr.forms.documentReady = documentReady;
    
    mr.forms.submit = function(e){
        // return false so form submits through jQuery rather than reloading page.
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;

        var body          = $('body'),
            thisForm      = $(e.target).closest('form'),
            formAction    = typeof thisForm.attr('action') !== typeof undefined ? thisForm.attr('action') : "",
            submitButton  = thisForm.find('button[type="submit"], input[type="submit"]'),
            error         = 0,
            originalError = thisForm.attr('original-error'),
            successRedirect, formError, formSuccess, errorText, successText;

        body.find('.form-error, .form-success').remove();
        submitButton.attr('data-text', submitButton.text());
        errorText = thisForm.attr('data-error') ? thisForm.attr('data-error') : "Please fill all fields correctly";
        successText = thisForm.attr('data-success') ? thisForm.attr('data-success') : "Thanks, we'll be in touch shortly";
        body.append('<div class="form-error" style="display: none;">' + errorText + '</div>');
        body.append('<div class="form-success" style="display: none;">' + successText + '</div>');
        formError = body.find('.form-error');
        formSuccess = body.find('.form-success');
        thisForm.addClass('attempted-submit');

        // Do this if the form is intended to be submitted to MailChimp or Campaign Monitor
        if (formAction.indexOf('createsend.com') !== -1 || formAction.indexOf('list-manage.com') !== -1 ) {

            console.log('Mail list form signup detected.');

        } else {
            // If no MailChimp or Campaign Monitor form was detected then this is treated as an email form instead.
            if (typeof originalError !== typeof undefined && originalError !== false) {
                formError.text(originalError);
            }

            error = mr.forms.validateFields(thisForm);

            if (error === 1) {
                mr.forms.showFormError(formSuccess, formError, 1000, 5000, 500);
            } else {

                thisForm.removeClass('attempted-submit');

                // Hide the error if one was shown
                formError.fadeOut(200);
                
                // Create a new loading spinner in the submit button.
                submitButton.addClass('btn--loading');

                jQuery.ajax({
                    type: "POST",
                    url: "mail/mail.php",
                    data: thisForm.serialize()+"&url="+window.location.href,
                    success: function(response) {
                        // Swiftmailer always sends back a number representing number of emails sent.
                        // If this is numeric (not Swift Mailer error text) AND greater than 0 then show success message.

                        submitButton.removeClass('btn--loading');

                        if ($.isNumeric(response)) {
                            if (parseInt(response,10) > 0) {
                                // For some browsers, if empty 'successRedirect' is undefined; for others,
                                // 'successRedirect' is false.  Check for both.
                                successRedirect = thisForm.attr('data-success-redirect');
                                if (typeof successRedirect !== typeof undefined && successRedirect !== false && successRedirect !== "") {
                                    window.location = successRedirect;
                                }

                                mr.forms.resetForm(thisForm);
                                mr.forms.showFormSuccess(formSuccess, formError, 1000, 5000, 500);
                            }
                        }
                        // If error text was returned, put the text in the .form-error div and show it.
                        else {
                            // Keep the current error text in a data attribute on the form
                            formError.attr('original-error', formError.text());
                            // Show the error with the returned error text.
                            formError.text(response).stop(true).fadeIn(1000);
                            formSuccess.stop(true).fadeOut(1000);
                        }
                    },
                    error: function(errorObject, errorText, errorHTTP) {
                        // Keep the current error text in a data attribute on the form
                        formError.attr('original-error', formError.text());
                        // Show the error with the returned error text.
                        formError.text(errorHTTP).stop(true).fadeIn(1000);
                        formSuccess.stop(true).fadeOut(1000);
                        submitButton.removeClass('btn--loading');
                    }
                });
            }
        }
        return false;
    };
    
    mr.forms.validateFields = function(form) {
        var body = $(body), name, error, originalErrorMessage;

        $(form).find('.validate-required[type="checkbox"]').each(function() {
            if (!$('[name="' + $(this).attr('name') + '"]:checked').length) {
                error = 1;
                name = $(this).attr('name').replace('[]', '');
                body.find('.form-error').text('Please tick at least one ' + name + ' box.');
            }
        });

        $(form).find('.validate-required, .required, [required]').each(function() {
            if ($(this).val() === '') {
                $(this).addClass('field-error');
                error = 1;
            } else {
                $(this).removeClass('field-error');
            }
        });

        $(form).find('.validate-email, .email, [name*="cm-"][type="email"]').each(function() {
            if (!(/(.+)@(.+){2,}\.(.+){2,}/.test($(this).val()))) {
                $(this).addClass('field-error');
                error = 1;
            } else {
                $(this).removeClass('field-error');
            }
        });

        if (!form.find('.field-error').length) {
            body.find('.form-error').fadeOut(1000);
        }else{
            
            var firstError = $(form).find('.field-error:first');
            
            if(firstError.length){
                $('html, body').stop(true).animate({
                    scrollTop: (firstError.offset().top - 100)
                }, 1200, function(){firstError.focus();});
            }
        }

        return error;
    };

    mr.forms.showFormSuccess = function(formSuccess, formError, fadeOutError, wait, fadeOutSuccess){
        
        formSuccess.stop(true).fadeIn(fadeOutError);

        formError.stop(true).fadeOut(fadeOutError);
        setTimeout(function() {
            formSuccess.stop(true).fadeOut(fadeOutSuccess);
        }, wait);
    };

    mr.forms.showFormError = function(formSuccess, formError, fadeOutSuccess, wait, fadeOutError){
        
        formError.stop(true).fadeIn(fadeOutSuccess);

        formSuccess.stop(true).fadeOut(fadeOutSuccess);
        setTimeout(function() {
            formError.stop(true).fadeOut(fadeOutError);
        }, wait);
    };

    // Reset form to empty/default state.
    mr.forms.resetForm = function(form){
        form = $(form);
        form.get(0).reset();
        form.find('.input-radio, .input-checkbox').removeClass('checked');

    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Modals
mr = (function (mr, $, window, document){
    "use strict";
    
    mr.modals = {};

    var documentReady = function($){
        $('.modal-container').each(function(){

            // Add modal close if none exists

            var modal        = $(this),
                $window      = $(window),
                modalContent = modal.find('.modal-content');
                
            
            if(!modal.find('.modal-close').length){
                modal.find('.modal-content').append('<div class="modal-close modal-close-cross"></div>');
            }

            // Set modal height
            
            if(modalContent.attr('data-width') !== undefined){
                var modalWidth = modalContent.attr('data-width').substr(0,modalContent.attr('data-width').indexOf('%')) * 1;
                if($window.width()<1280 && $window.width()>990){
                    modalWidth = modalWidth + 15;  
                }else if($window.width()<990){
                    modalWidth = modalWidth + 20;  
                }
                modalContent.css('width',modalWidth + '%');
            }
            if(modalContent.attr('data-height') !== undefined){
                var modalHeight = modalContent.attr('data-height').substr(0,modalContent.attr('data-height').indexOf('%')) * 1;
                if($window.height()<768){
                    console.log($window.height());
                    modalHeight = modalHeight + 15;  
                }
                modalContent.css('height',modalHeight + '%');
            }

            // Set iframe's src to data-src to stop autoplaying iframes
            mr.util.idleSrc(modal, 'iframe');

        });

        if(typeof mr_variant == typeof undefined){
            $('.modal-instance').each(function(index){
                var modalInstance = $(this);
                var modal = modalInstance.find('.modal-container');
                var modalContent = modalInstance.find('.modal-content');
                var trigger = modalInstance.find('.modal-trigger');
                
                // Link modal with modal-id attribute
                
                trigger.attr('data-modal-index',index);
                modal.attr('data-modal-index',index);
                
                // Set unique id for multiple triggers
                
                if(typeof modal.attr('data-modal-id') !== typeof undefined){
                    trigger.attr('data-modal-id', modal.attr('data-modal-id'));
                }
                

                // Attach the modal to the body            
                modal = modal.detach();
                $('body').append(modal);
            });
        }

        $('.modal-trigger').on('click', function(){

            var modalTrigger = $(this);
            var $body        = $('body');
            var uniqueID, targetModal;
            // Determine if the modal id is set by user or is set programatically
   
            if(typeof modalTrigger.attr('data-modal-id') !== typeof undefined){
                uniqueID = modalTrigger.attr('data-modal-id');
                targetModal = $body.find('.modal-container[data-modal-id="'+uniqueID+'"]');    
            }else{
                uniqueID = $(this).attr('data-modal-index');
                targetModal = $body.find('.modal-container[data-modal-index="'+uniqueID+'"]');
            }
            
            mr.util.activateIdleSrc(targetModal, 'iframe');
            mr.modals.autoplayVideo(targetModal);

            mr.modals.showModal(targetModal);

            return false;
        });

        $('.modal-close').on('click', mr.modals.closeActiveModal);

        $(document).keyup(function(e) {
            if (e.keyCode == 27) { // escape key maps to keycode `27`
                mr.modals.closeActiveModal();
            }
        });

        $('.modal-container').on('click', function(e) { 
            if( e.target != this ) return;
            mr.modals.closeActiveModal();
        });

        // Trigger autoshow modals
        $('.modal-container[data-autoshow]').each(function(){
            var modal = $(this);
            var millisecondsDelay = modal.attr('data-autoshow')*1;

            mr.util.activateIdleSrc(modal);
            mr.modals.autoplayVideo(modal);

            // If this modal has a cookie attribute, check to see if a cookie is set, and if so, don't show it.
            if(typeof modal.attr('data-cookie') !== typeof undefined){
                if(!mr.cookies.hasItem(modal.attr('data-cookie'))){
                    mr.modals.showModal(modal, millisecondsDelay);
                }
            }else{
                mr.modals.showModal(modal, millisecondsDelay);
            }
        });

        // Autoshow modal by ID from location href
        if(window.location.href.split('#').length == 2){
            var modalID = window.location.href.split('#').pop();
            if($('[data-modal-id="'+modalID+'"]').length){
                mr.modals.closeActiveModal();
                mr.modals.showModal($('[data-modal-id="'+modalID+'"]'));
            }  
        };

        // Make modal scrollable
        $(document).on('wheel mousewheel scroll','.modal-content, .modal-content .scrollable', function(evt){
            if(evt.preventDefault){evt.preventDefault();}
            if(evt.stopPropagation){evt.stopPropagation();}
            this.scrollTop += (evt.originalEvent.deltaY); 
        });
    };
    ////////////////
    //////////////// End documentReady
    ////////////////

    mr.modals.documentReady = documentReady;

    mr.modals.showModal = function(modal, millisecondsDelay){
        
        var delay = (typeof millisecondsDelay !== typeof undefined) ? (1*millisecondsDelay) : 0;
        
        setTimeout(function(){
            modal.addClass('modal-active');
        },delay);
    };

    mr.modals.closeActiveModal = function(){
        var modal = $('body div.modal-active');
        mr.util.idleSrc(modal, 'iframe');
        mr.util.pauseVideo(modal);

        // If this modal requires to be closed permanently using a cookie, set the cookie now.
        if(typeof modal.attr('data-cookie') !== typeof undefined){
            mr.cookies.setItem(modal.attr('data-cookie'), "true", Infinity);
        }

        modal.removeClass('modal-active');
    };

    mr.modals.autoplayVideo = function(modal){
        // If modal contains HTML5 video with autoplay, play the video
        if(modal.find('video[autoplay]').length){
            var video = modal.find('video').get(0);
            video.play();
        }
    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Navigation
mr = (function (mr, $, window, document){
    "use strict";
    
    // The navigation object
    mr.navigation = {};

    // The overall nav element (one per page)
    mr.navigation.nav = {};

    // In case there is a bar type nav element
    mr.navigation.bar = {};

    var documentReady = function($){
        
        mr.navigation.nav.element = $('nav');
        mr.navigation.bar.element = $('nav .nav-bar');
        
        // Check for nav element and set outerHeight variable
        if(mr.navigation.nav.element.length){
            mr.navigation.nav.outerHeight = mr.navigation.nav.element.outerHeight();
        }else{
            mr.navigation.nav.outerHeight = 0;
        }
        // Check for a bar type nav
        if(mr.navigation.bar.element.length){
            mr.navigation.bar.init();
        }

        //////////////// Mobile Menu Toggle
        
        $('.nav-mobile-toggle').on('click', function(){
            $('nav').toggleClass('nav-open');
        });
        
        // $('.menu li').on('click', function(ev){
        //     var navItem = $(this),
        //         e       = ev || window.event;
            
        //     e.stopPropagation();
        //     if (navItem.find('ul').length) {
        //         navItem.toggleClass('active');
        //     } else {
        //         navItem.parents('.active').removeClass('active');
        //     }
        // });
        
        //////////////// Mobile Menu Applets
        
        $('.module-applet').on('click', function(){
            $(this).toggleClass('active');
        });
        
        $('.module-applet__body').each(function(){
            var moduleBody = $(this);
            var farRight = moduleBody.offset().left + moduleBody.outerWidth();
            if(farRight > $(window).width()){
                moduleBody.addClass('pos-right');
            }
        });
        
        //////////////// Menu dropdown positioning

        $('.menu > li > ul').each(function() {
            var $window          = $(window);
            var dropDown         = $(this);
            var menu             = dropDown.offset();
            var farRight         = menu.left + dropDown.outerWidth(true);
            var windowWidth      = $window.width();
            var multiColumn      = dropDown.hasClass('multi-column');

            if (farRight > windowWidth && !multiColumn) {
                dropDown.addClass('make-right');
            } else if (farRight > windowWidth && multiColumn) {
                var difference = farRight - windowWidth;
                dropDown.css('margin-left', -(difference));
            }
        });

    };

    ///
    ///    END DOCUMENTREADY
    ///
    ////////////////////////////////////
    
    mr.navigation.bar.init = function(){
        // Get data-fixed-at attribute
        var fixedAt = mr.navigation.bar.element.attr('data-fixed-at');
        // Save mr.navigation.bar.fixedAt as a number or null if not set
        mr.navigation.bar.fixedAt = (typeof fixedAt !== typeof undefined) ? parseInt(fixedAt.replace('px', ''), 10) : false;

        // Only run scroll listeners if bar does not already have nav--fixed class
        if(mr.navigation.bar.element.hasClass('nav--fixed')){
            // We know this is a fixed nav bar
            mr.navigation.bar.isFixed = true;
        }else if (fixedAt) {
            // If fixedAt has a value (not false) and nav bar has no ".nav--fixed" class
            // add navigation.bar.update to scroll event cycle
            mr.navigation.nav.element.css('min-height', mr.navigation.nav.outerHeight);
            mr.navigation.bar.isFixed = false;
            mr.scroll.listeners.push(mr.navigation.bar.update);
        }


    };

    mr.navigation.bar.update = function(){
        // If page is scrolled beyond the point where nav should be fixed
        if( (mr.scroll.y > mr.navigation.bar.fixedAt) && !mr.navigation.bar.isFixed)
        {
            mr.navigation.bar.isFixed = true;
            mr.navigation.bar.element.addClass('nav--fixed');
            mr.navigation.nav.element.addClass('nav--fixed');
        }

        if( (mr.scroll.y < mr.navigation.bar.fixedAt) && mr.navigation.bar.isFixed)
        {
            mr.navigation.bar.isFixed = false;
            mr.navigation.bar.element.removeClass('nav--fixed');
            mr.navigation.nav.element.removeClass('nav--fixed');
        }
    };

    mr.navigation.documentReady = documentReady;        

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));


//////////////// Notifications
mr = (function (mr, $, window, document){
    "use strict";
    
    mr.notifications = {};

    var documentReady = function($){
        
        $('.notification').each(function(){
            var notification = $(this);
            if(!notification.find('.notification-close').length){
                notification.append('<div class="notification-close-cross notification-close"></div>');
            }
        });
    

        $('.notification[data-autoshow]').each(function(){
            var notification = $(this);
            var millisecondsDelay = notification.attr('data-autoshow') * 1;

            // If this notification has a cookie attribute, check to see if a cookie is set, and if so, don't show it.
            if(typeof notification.attr('data-cookie') !== typeof undefined){
                if(!mr.cookies.hasItem(notification.attr('data-cookie'))){
                    mr.notifications.showNotification(notification, millisecondsDelay);
                }
            }else{
                mr.notifications.showNotification(notification, millisecondsDelay);
            }
        });

        $('[data-notification-link]:not(.notification)').on('click', function(){
            var notificationID = $(this).attr('data-notification-link');
            var notification = $('body').find('.notification[data-notification-link="'+notificationID+'"]');
            notification.removeClass('notification--dismissed');
            notification.addClass('notification--reveal');
            return false;
        });

        $('.notification-close').on('click', function(){
            var closeButton = $(this);
            // Pass the closeNotification function a reference to the close button
            mr.notifications.closeNotification(closeButton);

            if(closeButton.attr('href') === '#'){
                return false;
            }
        });
    
    };
    
    mr.notifications.documentReady = documentReady;

    mr.notifications.showNotification = function(notification, millisecondsDelay){
        var delay = (typeof millisecondsDelay !== typeof undefined) ? (1*millisecondsDelay) : 0;

        setTimeout(function(){
            notification.addClass('notification--reveal');
        },delay);
    };

    mr.notifications.closeNotification = function(notification){

        var $notification = $(notification);
        
        notification = $notification.is('.notification-close') ? 
                       $notification.closest('.notification') : 
                       $('body').find('.notification[data-notification-link="'+notification+'"]');

        notification.addClass('notification--dismissed'); 

        // If this notification requires to be closed permanently using a cookie, set the cookie now.
        if(typeof notification.attr('data-cookie') !== typeof undefined){
            mr.cookies.setItem(notification.attr('data-cookie'), "true", Infinity);
        }
    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Piecharts
mr = (function (mr, $, window, document){
      "use strict";
      
      var documentReady = function($){
          jQuery.fn.easyaspie = function () {
            
                var size    = parseInt(this.data('size'), 10),
                    radius  = size / 2,
                    value   = parseInt(this.data('value'), 10);
                
                // pie all the things!
                if (this.length > 1){
                    this.each( function() {
                        $(this).easyaspie();
                    });
                    return this;
                }
                
                // is you trying to break things?
                if (isNaN(value)) {
                    return this;
                }
                
                // set the size of this
                this.css({
                    height: size,
                    width: size
                }).addClass('pie-sliced');
                
                // make value behave
                value = Math.min(Math.max(value, 0), 100);

                // make me some svg
                this.pie = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                
                // if value is 100 or higher, just use a circle
                if (value >= 100) {
                    this.pie.slice = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    this.pie.slice.setAttribute('r', radius);
                    this.pie.slice.setAttribute('cx', radius);
                    this.pie.slice.setAttribute('cy', radius);
                    
                } else {
                    this.pie.slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    
                    //calculate x,y coordinates of the point on the circle to draw the arc to. 
                    var x = Math.cos((2 * Math.PI)/(100/value));
                    var y = Math.sin((2 * Math.PI)/(100/value));
                    
                    //should the arc go the long way round?
                    var longArc = (value <= 50) ? 0 : 1;
                    
                    //d is a string that describes the path of the slice.
                    var d = "M" + radius + "," + radius + " L" + radius + "," + 0 + ", A" + radius + "," + radius + " 0 " + longArc + ",1 " + (radius + y*radius) + "," + (radius - x*radius) + " z";       
                    this.pie.slice.setAttribute('d', d);
                }
                
                //add the slice to the pie.
                jQuery(this.pie.slice).appendTo(this.pie);
                
                // add the pie to this
                jQuery(this.pie).appendTo(this);
                
                return this;
            };

            var pieCharts = $('.piechart');

            if(pieCharts.length){
                pieCharts.easyaspie().addClass('active');
            }

            $('.barchart').each(function(){
                var chart = $(this);
                var bar = chart.find('.barchart__progress');
                var barWidth = chart.attr('data-value')*1 + '%';
                bar.attr('data-value', barWidth);
                if(!chart.hasClass('barchart--vertical')){
                    bar.css('width', barWidth);
                }else{
                    bar.css('height', barWidth);
                }

            });
      };

      mr.piecharts = {
          documentReady : documentReady        
      };

      mr.components.documentReady.push(documentReady);
      return mr;

}(mr, jQuery, window, document));

//////////////// Scroll Reveal
mr = (function (mr, $, window, document){
    "use strict";
    
    var documentReady = function($){
        
        var $body = $('body');
        if($('body[data-reveal-selectors]').length){
            window.sr = ScrollReveal();
            var selectors = $body.attr('data-reveal-selectors');

            // Gather scroll reveal options
            var revealTiming = 1000;
            if($('body[data-reveal-timing]').length){
                revealTiming = $body.attr('data-reveal-timing');
            }

            // Initialize scroll reveal
            window.sr.reveal(''+selectors+'', { viewFactor: 0.1, duration: ''+revealTiming+'', scale: 1, mobile: false });

        }

    };

    mr.scrollreveal = {
        documentReady : documentReady
    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Smoothscroll
mr = (function (mr, $, window, document){
    "use strict";
    
    var documentReady = function($){
        // Smooth scroll to inner links
        var innerLinks = $('a.inner-link');

        if(innerLinks.length){
            innerLinks.each(function(){
                var link = $(this);
                var href = link.attr('href');
                if(href.charAt(0) !== "#"){
                    link.removeClass('inner-link');
                }
            });

            var offset = 0;
            if($('body[data-smooth-scroll-offset]').length){
                offset = $('body').attr('data-smooth-scroll-offset');
                offset = offset*1;
            }
            
            innerLinks.smoothScroll({
              offset: offset,
              speed: 800
            });
        }
    };

    mr.smoothscroll = {
        documentReady : documentReady        
    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Tabs
mr = (function (mr, $, window, document){
    "use strict";
    
    var documentReady = function($){
        $('.tabs').each(function(){
            var tabs = $(this);
            tabs.after('<ul class="tabs-content">');
            tabs.find('li').each(function(){
                var currentTab = $(this);
                var tabContent = currentTab.find('.tab__content').wrap('<li></li>').parent();
                tabContent.detach();
                currentTab.closest('.tabs-container').find('.tabs-content').append(tabContent);
            });
        });
        
        $('.tabs li').on('click', function(){
            var clickedTab = $(this);
            var tabContainer = clickedTab.closest('.tabs-container');
            var activeIndex = (clickedTab.index()*1)+(1);
            
            tabContainer.find('> .tabs > li').removeClass('active');
            tabContainer.find('> .tabs-content > li').removeClass('active');
            
            clickedTab.addClass('active');
            tabContainer.find('> .tabs-content > li:nth-of-type('+activeIndex+')').addClass('active');
        });
        
        $('.tabs li.active').trigger('click');
    };

    mr.tabs = {
        documentReady : documentReady        
    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Transitions
$(window).bind("pageshow", function(event) {
    if (event.originalEvent.persisted) {
        window.location.reload() 
    }
});

mr = (function (mr, $, window, document){
    "use strict";
    
    var documentReady = function($){
        $('a:not([href^="#"]):not([href^="tel"]):not([href^="mailto"]):not([data-lightbox]):not([href=""]):not([target="_blank"]):not(.modal-trigger)').on('click', function(){
            $('[class*="transition--"]').removeClass('transition--active');
        });   
    };

    var windowLoad = function(){
        $('[class*="transition--"]').addClass('transition--active');
        $('[class*="content--"]').addClass('content--active');
        $('.loader').addClass('loader--fade');
    };

    mr.transitions = {
        documentReady : documentReady,
        windowLoad : windowLoad        
    };

    mr.components.documentReady.push(documentReady);
    mr.components.windowLoad.push(windowLoad);
    return mr;

}(mr, jQuery, window, document));