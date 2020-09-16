(function ($) {
    'use strict';
    var Countdown = function (elm, options) {
        var
            // Vars

            self,
            $this = $( elm ),
            str = $this.data( 'rt-countdown' ),
            opts = [],
            endDate, today,
            timer_is_on = 0,
            $daysValue = $( '[data-rt-countdown-days] .value', $this ),
            $hoursValue = $( '[data-rt-countdown-hours] .value', $this ),
            $minsValue = $( '[data-rt-countdown-minutes] .value', $this ),
            $secsValue = $( '[data-rt-countdown-seconds] .value', $this ),
            dividers = new Array(86400, 3600, 60, 1), rest, t,
            values = new Array( $daysValue, $hoursValue, $minsValue, $secsValue ),

            // Methods

            convert = function ( element ) {
                opts.push( parseInt( element, 10 ) );
            },
            changeTime = function () {
                today = new Date();
                rest = ( endDate - today ) / 1000;
                for ( var i = 0; i < dividers.length; i++ ) {
                    values[i].html( Math.floor( rest / dividers[i] ) );
                    rest = rest % dividers[i];
                }
                t = setTimeout( changeTime,1000 );
            },
            init = function () {
                str.split( ':' ).map( convert );
                endDate = new Date( opts[0], opts[1] - 1, opts[2], opts[3], opts[4], opts[5] );
                if ( ! timer_is_on ) {
                    timer_is_on = 1;
                    changeTime();
                }
            };
        self = {
            init: init
        };
        return self;
    };
    $.fn.rtCountdown = function( opt ) {
        return this.each( function () {
            var countdown;
            if ( ! $( this ).data( 'rtAccordion' ) ) {
                countdown = new Countdown( this, opt );
                countdown.init();
                $( this ).data('rtAccordion', countdown);
            }
        } );
    };
    var $rtCountdown = $( '[data-rt-countdown]' );
    if ( $rtCountdown.length ) {
        $rtCountdown.rtCountdown();
    }
} ( jQuery ) );