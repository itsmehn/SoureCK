$("input").click(e => {
    $("#alert").hide().css("visibility", "hidden");
})



//CALL API MANAGER ACCOUNT SELECTION
$('#chooseDefine').change(function() {
    const status = this.value

    console.log(status)
    $.ajax({
        // async: false,
        type: "GET",
        dataType: "json",
        url: '/admin/manageraccount',
        data: {
            status: status
        },
        success: function(res) {
            if (res.code === 0) {
                updateTableAcount(res.listAccount)
            }

        },
        error: function(err) {

            console.log('The following error occured: ' + err);
        }

    })

});

//CALL API ACCEPT ACCOUNT
{
    $('#acceptActive .btn-primary').click(function(e) {
        e.preventDefault()
        let id = $(e.target).data('id')
        console.log(id)

        $.ajax({
            // async: false,
            type: "GET",
            url: '/admin/account/active/' + id,
            success: function(res) {
                if (res.code === 0) {
                    $('#acceptActive').hide().css("visibility", "hidden");
                    location.reload()
                }
            },
            error: function(err) {

                console.log('The following error occured: ' + err);
            }


        })
    });
}


const updateTableAcount = (listAccount) => {
    const table = $("#table-hongngocngu");
    console.log("table, ",
        table)

    console.log("listacciount, ", listAccount)

    table.html('');

    listAccount.forEach((account, index) => {
        if (account.check <= 1) {
            const tr = `
        <tr>
            <td>
         ${index + 1}
                </td>
                <td>
                    ${account._id}
                </td>
                <td>
                ${account.fullName}
                </td>
                <td>
                ${account.phoneNumber}
                </td>
                <td>
                ${account.password}
                </td>
              
                    <td class="text-warning">đang chờ kích hoạt</td>
                    <td>
                        <a href="/admin/account/${account._id}">Xem chi tiết</a>
      
                      
                    </td>
                
       </tr>
        
        `
            table.append(tr)
        } else if (account.check == 2) {
            const tr = `
        <tr>
            <td>
         ${index + 1}
                </td>
                <td>
                    ${account._id}
                </td>
                <td>
                ${account.fullName}
                </td>
                <td>
                ${account.phoneNumber}
                </td>
                <td>
                ${account.password}
                <td class="text-success">đã kích hoạt</td>
                        <td>
                            <a href="/admin/account/${account._id}">Xem chi tiết</a>
                        
                 
                        </td>
                    
       </tr>
        
        `
            table.append(tr)
        } else if (account.check == 3) {
            const tr = `
        <tr>
            <td>
         ${index + 1}
                </td>
                <td>
                    ${account._id}
                </td>
                <td>
                ${account.fullName}
                </td>
                <td>
                ${account.phoneNumber}
                </td>
                <td>
                ${account.password}
                <td class="text-danger">Bị vô hiệu hóa</td>
                <td>
                <a href="/admin/account/${account._id}">Xem chi tiết</a>
        
             
                 </td>
       </tr>
        
        `
            table.append(tr)
        } else {
            const tr = `
        <tr>
            <td>
         ${index + 1}
                </td>
                <td>
                    ${account._id}
                </td>
                <td>
                ${account.fullName}
                </td>
                <td>
                ${account.phoneNumber}
                </td>
                <td>
                ${account.password}
                <td class="text-danger">Bị vô hiệu hóa vĩnh viên</td>
                 <td>
                   <a href="/admin/account/${account._id}">Xem chi tiết</a>
             
          
                  </td>
       </tr>
        
        `
            table.append(tr)
        }



    })


}

//CALL API REQUEST ACCOUNT UPDATE ID CARD IMAGE
{
    $('#requestIDcard .btn-primary').click(function(e) {
        e.preventDefault()
        let id = $(e.target).data('id')
        console.log(id)

        $.ajax({
            // async: false,
            type: "GET",
            url: '/admin/account/updateIDCard/' + id,
            success: function(res) {
                if (res.code === 0) {
                    $('#requestIDcard').hide().css("visibility", "hidden");
                    location.reload()
                }
            },
            error: function(err) {

                console.log('The following error occured: ' + err);
            }


        })
    });
}

//CALL API REJECT ACCOUNT
{
    $('#reject .btn-primary').click(function(e) {
        e.preventDefault()
        let id = $(e.target).data('id')
        console.log(id)

        $.ajax({
            // async: false,
            type: "GET",
            url: '/admin/account/reject/' + id,
            success: function(res) {
                if (res.code === 0) {
                    $('#reject').modal('hide')
                    location.reload()
                }
            },
            error: function(err) {

                console.log('The following error occured: ' + err);
            }


        })
    });
}

//CALL API UNLOCK ACCOUNT
{
    $('#unlock .btn-primary').click(function(e) {
        e.preventDefault()
        let id = $(e.target).data('id')
        console.log(id)

        $.ajax({
            // async: false,
            type: "GET",
            url: '/admin/account/unlock/' + id,
            success: function(res) {
                if (res.code === 0) {
                    $('#unlock').hide().css("visibility", "hidden");
                    location.reload()
                }
            },
            error: function(err) {

                console.log('The following error occured: ' + err);
            }


        })
    });
}

//CALL API SEND OTP
$('#insertOTP').click(function() {
    const input = $('#phone').val()
    console.log(input)

    $.ajax({
        // async: false,
        type: "GET",
        dataType: "json",
        url: '/users/getOTP',
        data: {
            phoneNumber: input
        },
        success: function(res) {

        },
        error: function(err) {

            console.log('The following error occured: ' + err);
        }

    })

});



// Mỹ Anh
// menu
document.addEventListener("DOMContentLoaded", function(event) {

    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId)

        // Validate that all variables exist
        if (toggle && nav && bodypd && headerpd) {
            toggle.addEventListener('click', () => {
                // show navbar
                nav.classList.toggle('show')
                    // change icon
                toggle.classList.toggle('bx-x')
                bodypd.classList.toggle('body-pd')
                    // add padding to header
                headerpd.classList.toggle('body-pd')
            })
        }
    }

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')

    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')

    function colorLink() {
        if (linkColor) {
            linkColor.forEach(l => l.classList.remove('active'))
            this.classList.add('active')
        }
    }
    linkColor.forEach(l => l.addEventListener('click', colorLink))

    // Your code to run since DOM is loaded and ready
});
// end menu

(function($) {
    "use strict";

    /*----------------------------
     jQuery MeanMenu
    ------------------------------ */
    /*----------------------------
     jQuery myTab
    ------------------------------ */
    $('#myTab a').on('click', function(e) {
        e.preventDefault()
        $(this).tab('show')
    });
    $('#myTab3 a').on('click', function(e) {
        e.preventDefault()
        $(this).tab('show')
    });
    $('#myTab4 a').on('click', function(e) {
        e.preventDefault()
        $(this).tab('show')
    });
    $('#myTabedu1 a').on('click', function(e) {
        e.preventDefault()
        $(this).tab('show')
    });

    $('#single-product-tab a').on('click', function(e) {
        e.preventDefault()
        $(this).tab('show')
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });
    // Collapse ibox function
    $('#sidebar ul li').on('click', function() {
        var button = $(this).find('i.fa.indicator-mn');
        button.toggleClass('fa-plus').toggleClass('fa-minus');

    });
    /*-----------------------------
        Menu Stick
    ---------------------------------*/
    $('#sidebarCollapse').on('click', function() {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();
    });
    $(document).on('click', '.header-right-menu .dropdown-menu', function(e) {
        e.stopPropagation();
    });
    /*----------------------------
     wow js active
    ------------------------------ */
    new WOW().init();
    /*----------------------------
     owl active
    ------------------------------ */
    $("#owl-demo").owlCarousel({
        autoPlay: false,
        slideSpeed: 2000,
        pagination: false,
        navigation: true,
        items: 4,
        /* transitionStyle : "fade", */
        /* [This code for animation ] */
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [980, 3],
        itemsTablet: [768, 2],
        itemsMobile: [479, 1],
    });
    /*----------------------------
     price-slider active
    ------------------------------ */
    $("#slider-range").slider({
        range: true,
        min: 40,
        max: 600,
        values: [60, 570],
        slide: function(event, ui) {
            $("#amount").val("£" + ui.values[0] + " - £" + ui.values[1]);
        }
    });
    $("#amount").val("£" + $("#slider-range").slider("values", 0) +
        " - £" + $("#slider-range").slider("values", 1));
    /*--------------------------
     scrollUp
    ---------------------------- */
    $.scrollUp({
        scrollText: '<i class="fa fa-angle-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
    });

})(jQuery);

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

(function($) {
    "use strict";

    var card = new Card({
        form: '.active form',
        container: '.card-wrapper'
    });
    var owner = $('#owner');
    var cardNumber = $('#cardNumber');
    var cardNumberField = $('#card-number-field');
    var CVV = $("#cvv");
    var mastercard = $("#mastercard");
    var confirmButton = $('#confirm-purchase');
    var visa = $("#visa");
    var amex = $("#amex");
    cardNumber.payform('formatCardNumber');
    CVV.payform('formatCardCVC');
    cardNumber.keyup(function() {
        amex.removeClass('transparent');
        visa.removeClass('transparent');
        mastercard.removeClass('transparent');
        if ($.payform.validateCardNumber(cardNumber.val()) == false) {
            cardNumberField.addClass('has-error');
        } else {
            cardNumberField.removeClass('has-error');
            cardNumberField.addClass('has-success');
        }
        if ($.payform.parseCardType(cardNumber.val()) == 'visa') {
            mastercard.addClass('transparent');
            amex.addClass('transparent');
        } else if ($.payform.parseCardType(cardNumber.val()) == 'amex') {
            mastercard.addClass('transparent');
            visa.addClass('transparent');
        } else if ($.payform.parseCardType(cardNumber.val()) == 'mastercard') {
            amex.addClass('transparent');
            visa.addClass('transparent');
        }
    });
    confirmButton.on('click', function(e) {
        e.preventDefault();
        var isCardValid = $.payform.validateCardNumber(cardNumber.val());
        var isCvvValid = $.payform.validateCardCVC(CVV.val());
    });

})(jQuery);

var Tabs = function($) {
    return {

        init: function() {
            this.cacheDom();
            this.setupAria();
            this.appendIndicator();
            this.bindEvents();
        },

        cacheDom: function() {
            this.$el = $('.tabs');
            this.$tabList = this.$el.find('ul');
            this.$tab = this.$tabList.find('li');
            this.$tabFirst = this.$tabList.find('li:first-child a');
            this.$tabLink = this.$tab.find('a');
            this.$tabPanel = this.$el.find('section');
            this.$tabPanelFirstContent = this.$el.find('section > *:first-child');
            this.$tabPanelFirst = this.$el.find('section:first-child');
            this.$tabPanelNotFirst = this.$el.find('section:not(:first-of-type)');
        },

        bindEvents: function() {
            this.$tabLink.on('click', function() {
                this.changeTab();
                this.animateIndicator($(event.currentTarget));
            }.bind(this));
            this.$tabLink.on('keydown', function() {
                this.changeTabKey();
            }.bind(this));
        },

        changeTab: function() {
            var self = $(event.target);
            event.preventDefault();
            this.removeTabFocus();
            this.setSelectedTab(self);
            this.hideAllTabPanels();
            this.setSelectedTabPanel(self);
        },

        animateIndicator: function(elem) {
            var offset = elem.offset().left;
            var width = elem.width();
            var $indicator = this.$tabList.find('.indicator');

            console.log(elem.width());

            $indicator.transition({
                x: offset,
                width: elem.width()
            })
        },

        appendIndicator: function() {
            this.$tabList.append('<div class="indicator"></div>');
        },

        changeTabKey: function() {
            var self = $(event.target),
                $target = this.setKeyboardDirection(self, event.keyCode);

            if ($target.length) {
                this.removeTabFocus(self);
                this.setSelectedTab($target);
            }
            this.hideAllTabPanels();
            this.setSelectedTabPanel($(document.activeElement));
            this.animateIndicator($target);
        },

        hideAllTabPanels: function() {
            this.$tabPanel.attr('aria-hidden', 'true');
        },

        removeTabFocus: function(self) {
            var $this = self || $('[role="tab"]');

            $this.attr({
                'tabindex': '-1',
                'aria-selected': null
            });
        },

        selectFirstTab: function() {
            this.$tabFirst.attr({
                'aria-selected': 'true',
                'tabindex': '0'
            });
        },

        setupAria: function() {
            this.$tabList.attr('role', 'tablist');
            this.$tab.attr('role', 'presentation');
            this.$tabLink.attr({
                'role': 'tab',
                'tabindex': '-1'
            });
            this.$tabLink.each(function() {
                var $this = $(this);

                $this.attr('aria-controls', $this.attr('href').substring(1));
            });
            this.$tabPanel.attr({
                'role': 'tabpanel'
            });
            this.$tabPanelFirstContent.attr({
                'tabindex': '0'
            });
            this.$tabPanelNotFirst.attr({
                'aria-hidden': 'true'
            });
            this.selectFirstTab();
        },

        setKeyboardDirection: function(self, keycode) {
            var $prev = self.parents('li').prev().children('[role="tab"]'),
                $next = self.parents('li').next().children('[role="tab"]');

            switch (keycode) {
                case 37:
                    return $prev;
                    break;
                case 39:
                    return $next;
                    break;
                default:
                    return false;
                    break;
            }
        },

        setSelectedTab: function(self) {
            self.attr({
                'aria-selected': true,
                'tabindex': '0'
            }).focus();
        },

        setSelectedTabPanel: function(self) {
            $('#' + self.attr('href').substring(1)).attr('aria-hidden', null);
        },

    };
}(jQuery);

Tabs.init();
//----------
//thay đổi trang danh sách
function opentchucnang(chucnang) {
    var i;
    var x = document.getElementsByClassName("cn");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(chucnang).style.display = "block";
}

function openCity(cityName) {
    var i;
    var x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(cityName).style.display = "block";
}

//--------------
// Trang navbar
document.addEventListener("DOMContentLoaded", function(event) {

    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId)

        // Validate that all variables exist
        if (toggle && nav && bodypd && headerpd) {
            toggle.addEventListener('click', () => {
                // show navbar
                nav.classList.toggle('show')
                    // change icon
                toggle.classList.toggle('bx-x')
                bodypd.classList.toggle('body-pd')
                    // add padding to header
                headerpd.classList.toggle('body-pd')
            })
        }
    }

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')

    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')

    function colorLink() {
        if (linkColor) {
            linkColor.forEach(l => l.classList.remove('active'))
            this.classList.add('active')
        }
    }
    linkColor.forEach(l => l.addEventListener('click', colorLink))

    // Your code to run since DOM is loaded and ready
});

// Home page
$(document).ready(function() {
    $(".wish-icon i").click(function() {
        $(this).toggleClass("fa-heart fa-heart-o");
    });
});
// End Home pgae
// Mỹ ANh

//Upload file của cmnd
// Add the following code if you want the name of the file appear on select
$(".custom-file-input").on("change", function() {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});