
(function() {

    // Cookie to store user consent
    const cookieName = 'MP_COOKIE_CONSENT';

    // If consent popup exists on page and cookie is set should remove it
    if ( document.cookie.match( new RegExp( cookieName + '=([^;]+)' ) ) ) {
        return;
    }

    // Create popup dynamically from localized object
    const popupHolder = document.createElement( 'div' );
    popupHolder.innerHTML = MP_COOKIE_CONSENT.popupHTML;

    document.body.insertAdjacentElement(
        'beforeend',
        popupHolder
    );

    // Shows consent popup after DOM loaded
    document.addEventListener( 'DOMContentLoaded', () => {
        document.getElementById( 'mp-cookie-consent' ).classList.add( 'visible' );
    } );

    // Get consent popup DOM Element
    const consentPopup = document.getElementById( 'mp-cookie-consent' );

    if ( ! consentPopup ) {
        return;
    }

    // Get cosent tabs and control buttons
    const customizeButton = document.getElementById( 'mp-cookie-consent__customize' );
    const backButton = document.getElementById( 'mp-cookie-consent__back' );
    const base = consentPopup.getElementsByClassName( 'mp-cookie-consent__base' )[0];
    const preferences = consentPopup.getElementsByClassName( 'mp-cookie-consent__preferences' )[0];

    // Conntrols tabs visibility
    const toggleCustomizeTab = () => {
        base.classList.toggle( 'hidden' );
        preferences.classList.toggle( 'hidden' );
    }

    // Add listeners to conntrol tabs visibility
    customizeButton.addEventListener( 'click', toggleCustomizeTab );
    backButton.addEventListener( 'click', toggleCustomizeTab );

    const hideConsentPopup = () => {
        consentPopup.classList.remove( 'visible' );

        setTimeout( () => {
            consentPopup.remove();
        }, 400 );
    }

    // Array of callbacks to be executed when consent changes
    const consentListeners = [];

    /**
     * Called from GTM template to set callback to be executed when user consent is provided.
     * @param {function} Callback to execute on user consent
     */
    window.updateUserConsent = ( callback ) => {
        consentListeners.push( callback );
    };

    /**
     * Called when user grants/denies consent.
     * @param {Object} Object containing user consent settings.
     */
    const onConsentChange = ( consent ) => {
        consentListeners.forEach( ( callback ) => {
            callback( consent );
        } );
    };

    const saveUserPreferences = ( consent ) => {
        let expiryDate = new Date();
        expiryDate.setFullYear( expiryDate.getFullYear() + 1 );

        let domainParts = location.host.split('.');
        let topLevelDomain = '.' + domainParts.slice(-2).join('.');

        document.cookie = cookieName + '=' + JSON.stringify( consent ) + ';domain=' + topLevelDomain + ';path=/; expires=' + expiryDate.toGMTString();
    }

    // Get cosent control buttons
    const acceptAllButton = document.getElementById( 'mp-cookie-consent__accept-all' );
    const acceptSelectedButton = document.getElementById( 'mp-cookie-consent__accept-selected' );

    acceptAllButton.addEventListener( 'click', ( event ) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const consent = {
            adConsentGranted: true,
            adUserDataConsentGranted: true,
            adPersonalizationConsentGranted: true,
            analyticsConsentGranted: true,
            functionalityConsentGranted: true,
            personalizationConsentGranted: true,
            securityConsentGranted: true
        };

        onConsentChange( consent );

        saveUserPreferences( consent );

        hideConsentPopup();
    } );

    acceptSelectedButton.addEventListener( 'click', ( event ) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const adConsent = consentPopup.querySelector( 'input[name="advertising"]' );
        const analyticsConsent = consentPopup.querySelector( 'input[name="analytics"]' );

        const adConsentGranted = adConsent && adConsent.checked || false;
        const analyticsConsentGranted = analyticsConsent && analyticsConsent.checked || false;

        const consent = {
            functionalityConsentGranted: true,
            personalizationConsentGranted: true,
            securityConsentGranted: true,
            adConsentGranted: adConsentGranted,
            adUserDataConsentGranted: adConsentGranted,
            adPersonalizationConsentGranted: adConsentGranted,
            analyticsConsentGranted: analyticsConsentGranted,
        };

        onConsentChange( consent );

        saveUserPreferences( consent );

        hideConsentPopup();
    } );

})();