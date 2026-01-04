$(function () {


    // ========================================================================= //
    //    SideBar Panel  Open & Close
    // ========================================================================= //

    jQuery('.sidebaricon').on('click', function () {
        jQuery(".in-demo-panel").toggleClass('active');
    });


    jQuery('.in-demo-panel.active .bg-close').on('click', function () {

        jQuery('.in-demo-panel').toggleClass('active');

    });
    // ========================================================================= //
    //    Select A Demo
    // ========================================================================= //

    jQuery('.dm-1 a').on('click', function () {
        jQuery('body').addClass('light');
        jQuery('body').removeClass('dark');
        jQuery('body').attr('data-theme-version', 'light');
        jQuery('body').attr('data-nav-headerbg', 'primary_color_1');
        jQuery('body').attr('data-headerbg', 'primary_color_1');
        jQuery('body').attr('data-sibebarbg', 'primary_color_1');
        jQuery('body').attr('data-primary', 'primary_color_1');
        jQuery('body').attr('data-sibebartext', 'primary_color_1');
        jQuery('body').attr('data-topbar', 'primary_color_1');
        $('.brand-title').attr('src', 'assets/images/Logo.png');
    });


    jQuery('.dm-2 a').on('click', function () {
        jQuery('body').addClass('dark');
        jQuery('body').removeClass('light');
        jQuery('body').attr('data-theme-version', 'dark');
        jQuery('body').attr('data-nav-headerbg', 'primary_color_3');
        jQuery('body').attr('data-headerbg', 'primary_color_3');
        jQuery('body').attr('data-sibebarbg', 'primary_color_3');
        jQuery('body').attr('data-primary', 'primary_color_3');
        jQuery('body').attr('data-sibebartext', 'primary_color_3');
        jQuery('body').attr('data-topbar', 'primary_color_3');
        $('.brand-title').attr('src', 'assets/images/logo-dark.png');
    })


    // ========================================================================= //
    //    Direction RTL
    // ========================================================================= //

    jQuery('.layout_direction ul li').on('click', function () {
        jQuery('.layout_direction ul li').removeClass('active');
        jQuery(this).toggleClass('active');

    })

    jQuery('.layout_direction .ltr-version').on('click', function () {

        jQuery('html').removeAttr('dir', 'rtl');

    });

    jQuery('.layout_direction .rtl-version').on('click', function () {

        jQuery('html').attr('dir', 'rtl');

    });

    // ========================================================================= //
    //    Change Sidebar Size
    // ========================================================================= //


    jQuery('.sidebar_size ul li').on('click', function () {
        jQuery('.sidebar_size ul li').removeClass('active');
        jQuery(this).toggleClass('active');

    })

    // sidebar size default

    jQuery('.sidebar-size-default').on('click', function () {
        jQuery('body').attr('data-sidebar-style', 'full');
        jQuery('body').removeClass('sidebar-toggled');
        jQuery('.show').removeClass('menu-toggle');
        jQuery('.hamburger').css('display', 'inline-block');

        jQuery('.layout-width-boxed ').show();
        if (window.matchMedia("(max-width: 767px)").matches) {
            jQuery('body').attr('data-sidebar-style', 'overlay');

        }

    })

    // sidebar size compact

    jQuery('.sidebar-size-compact').on('click', function () {
        jQuery('body').attr('data-sidebar-style', 'compact');
        jQuery('body').removeClass('sidebar-toggled');
        jQuery('.show').removeClass('menu-toggle');
        jQuery('.hamburger').css('display', 'none');
        jQuery('.layout-width-boxed ').show();
    })

    // sidebar size small

    jQuery('.sidebar-size-small').on('click', function () {
        jQuery('body').attr('data-sidebar-style', 'mini');
        // jQuery('body').addClass('sidebar-toggled');
        // jQuery('.show').addClass('menu-toggle');
        // jQuery('.left-panel').removeClass('collapsed');
        jQuery('.hamburger').css('display', 'none');
        jQuery('.layout-width-boxed ').show();
    
        
    })

    // sidebar size close

    jQuery('.sidebar-size-close').on('click', function () {
        jQuery('body').attr('data-sidebar-style', 'close');
        jQuery('body').removeClass('sidebar-toggled');
        jQuery('.show').removeClass('menu-toggle');
        jQuery('.left-panel').removeClass('collapsed');
        jQuery('.hamburger').css('display', 'inline-block');


        jQuery('.layout-width-boxed ').hide();

    })

    //condition if max width Ecran  => 1199px = Diabled Cursor event

    if (window.matchMedia("(max-width:1199px)").matches) {

        jQuery('.sidebar_size').css('display', 'none');

        jQuery('body').on('click', function () {

            jQuery('.sidebar_size ul li').css('pointer-events', 'none');

        })

    }

    // ========================================================================= //
    //    Layout Positions
    // ========================================================================= //

    jQuery('.layout_width ul li').on('click', function () {
        jQuery('.layout_width ul li').removeClass('active');
        jQuery(this).toggleClass('active');

    })

    //  Full width screen

    jQuery('.layout-width-full').on('click', function () {
        jQuery('body').attr('data-container', 'full')
        jQuery('.items-panel ul .sidebar-size-close ').show();

    })

    // Boxed screen

    jQuery('.layout-width-boxed').on('click', function () {

        jQuery('body').attr('data-container', 'boxed');
        jQuery('.items-panel ul .sidebar-size-close ').hide();


        if (window.matchMedia("(max-width: 767px)").matches) {
            jQuery('body').attr('data-container', 'full');
       
        }


    })

    // Condition i data-container = Boxed => Hide link item panel

    if (jQuery('body').attr('data-container') == 'boxed') {

        jQuery('.items-panel ul .sidebar-size-close ').hide();

    }


    if(window.matchMedia("(max-width: 1199px)").matches){

        jQuery('.layout_width').css('display', 'none');

    }


    // ========================================================================= //
    //    Layout Positions
    // ========================================================================= //

    jQuery('.layout_positions ul li').on('click', function () {
        jQuery('.layout_positions ul li').removeClass('active');
        jQuery(this).toggleClass('active');

    })

    jQuery('.layout-positions-fixed').on('click', function () {
        jQuery('body').attr('layout-positions', 'fixed')

    })

    jQuery('.layout-positions-scrollable').on('click', function () {

        jQuery('body').attr('layout-positions', 'scrollable')

    })


    // ========================================================================= //
    //    Change Color Top Bar 
    // ========================================================================= //

    jQuery(".topbar-color li").on('click', function () {
        var color = $(this).attr('data-topbar-color');
        jQuery('body').attr('data-topbar', color);
    })


    // ========================================================================= //
    //   Navigation Header
    // ========================================================================= //

    jQuery('.nav_header_top li').on('click', function () {
        var color = jQuery(this).attr('data-nav-header-top');
        jQuery('body').attr('data-nav-headerbg', color);
    })

    // ========================================================================= //
    //   Sidebar Color
    // ========================================================================= //
    jQuery('.sidebar_color li').on('click', function () {
        var color = $(this).attr("data-sidebar-color");
        jQuery('body').attr('data-sidebar', 'dark');
        jQuery('body').attr('data-sibebarbg', color);
        jQuery('body').attr('data-sibebartext', color);
    })


    if (window.matchMedia("(max-width: 767px)").matches) {
        jQuery('body').attr('data-container', 'full');

    }

})
