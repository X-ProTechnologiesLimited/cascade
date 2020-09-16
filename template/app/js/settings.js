"use strict";
( function ( $ ) {

	$( 'document' ).ready( function () {

		var $settings = $( '#template-settings' ),
			$template_settings_open = $( '#template-settings-open', $settings ),
			$layout_pane = $( '.template-settings-pane.layout-pane', $settings ),
			$skin_pane = $( '.template-settings-pane.skin-pane', $settings );

			$template_settings_open.on( 'click', function () {
				$settings.toggleClass( 'open' );
			} );

			$( 'a', $skin_pane ).on( 'click', function ( e ) {
				e.preventDefault();
				var $this = $( this ),
					$template_skin = $( '#template-skin' );
				$template_skin.attr( 'href', 'css/style-' + $this.data( 'skin' ) + '.css' );
				$( 'a', $skin_pane ).removeClass( 'active' );
				$this.addClass( 'active' );
			} ).first().addClass( 'active' );

			$( 'input[name="choose-page-layout"]', $layout_pane ).on( 'change', function () {
				console.log( 'value: ' + $( this ).filter( ':checked' ).val() );
				$( 'body' ).attr( 'class', '' ).addClass( $( this ).filter( ':checked' ).val() );
			} )

	} );

} )( jQuery );
