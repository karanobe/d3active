function getCreditCardType(cardNumber) {
  console.log('card number');
  console.log(cardNumber);

  if (/^5[1-5]/.test(cardNumber)) {
    return 'master';
  } else if (/^4/.test(cardNumber)) {
    return 'visa';
  } else if (/^3[47]/.test(cardNumber)) {
    return 'amex';
  } else if (/^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(cardNumber)) {
    return 'discover';
  } else if (/^35(?:2[89]|[3-8]\d)\d{12}$/.test(cardNumber)) {
    return 'jcb';
  } else {
    return 'unknown';
  }
}

function addCreditCardIcon(type) {
  console.log(type);

  switch (type) {
    case 'master':
      $('.form-group--credit-card').addClass('mc');
      break;

    case 'visa':
      $('.form-group--credit-card').addClass('visa');
      break;

    case 'amex':
      $('.form-group--credit-card').addClass('ax');
      break;

    case 'discover':
      $('.form-group--credit-card').addClass('dsc');
      break;

    default:
      $('.form-group--credit-card').addClass('unknown');
      break;
  }
}

function handleEvent(event) {
  console.log('trigger');
  var type = getCreditCardType($(this).val().replace(/-/g, ''));
  $('#credit-card-type').val(type);
  $(this).val($(this).val().replace(/\D/g, '').match(/.{1,4}|^$/g).join('-'));
  $('.form-group--credit-card').removeClass('mc visa ax dsc');
  addCreditCardIcon(type);
}

$(function () {
  $(document).on('blur input keyup change', '[name="cardNumber"]', handleEvent);
});
/**********
VitaCell
*/

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}

var maropostInterest = 102363;
$(function () {
  // Auto Focus on first input field
  $('[name=firstName]').focus();
});
var postUrl = '/api/limelight/payment';
$(document).on('click', '.shipping-form__next-button', function (e) {
  e.preventDefault(); // console.log(postUrl);
  // console.log('bump');
  // console.log(typeof fbq === "function");
  // console.log('Attempting to send');
  // fields & rule sets

  var fieldRules = {
    'firstName': ['required', 'numbers letters spaces periods hypens'],
    'lastName': ['required', 'numbers letters spaces periods hypens'],
    'emailAddress': ['required', 'email'],
    'shippingAddress1 ': ['required', 'numbers letters spaces periods hypens'],
    'shippingCity': ['required', 'numbers letters spaces periods hypens'],
    'shippingState': ['required', 'numbers letters spaces periods hypens'],
    'shippingCountry': ['required', 'numbers letters spaces periods hypens'],
    'phoneNumber': ['required', 'numbers letters spaces periods hypens'],
    'shippingZip': ['required', 'numbers letters spaces periods hypens'],
    'phoneNumber': ['required', 'numbers']
  }; // Data to be submitted

  var formData = {}; // Contains error messages

  var formError = []; // Loop through rule set

  for (var fieldName in fieldRules) {
    // Get field value
    var value = $('[name=' + fieldName + ']').val();

    if (fieldName == 'creditCardNumber') {
      // If credit card remove
      value = value.replace(/\D/g, '');
    } // console.log('value')
    // console.log(value)
    // console.log(fieldName)
    // Remove uppercase


    value = value.toLowerCase(); // Remove previous border styling

    $('[name=' + fieldName + ']').css({
      'border-bottom': '1px solid #5da743'
    }); // Get field rules

    var rule = fieldRules[fieldName]; // Add form data to object

    formData[fieldName] = value; // Check if Required

    if (rule.indexOf('required') !== -1) {
      if (value === '' || value == undefined) {
        var errorData = {
          // field name
          'fieldName': fieldName,
          // failed rule
          'failedRule': 'required',
          // failed message
          'failedMessage': 'Field Required'
        };
        formError.push(errorData);
      }
    } // Check if Credit Card Number


    if (rule.indexOf('credit card number') !== -1) {
      if (!/[0-9\-]/.test(value)) {
        var errorData = {
          'fieldName': fieldName,
          'failed_Rule': 'credit card number',
          'failedMessage': 'Field should only contain Numbers & Hypens'
        };
        formError.push(errorData); // console.log('field should only contain Numbers & Hypens');
      }
    } // Check if Number


    if (rule.indexOf('numbers') !== -1) {
      if (!/^\d+$/.test(value)) {
        var errorData = {
          'fieldName': fieldName,
          'failedRule': 'numbers',
          'failedMessage': 'Field should only contain Numbers'
        };
        formError.push(errorData); // console.log('field should only contain numbers');
      }
    } // Check if is numbers & letters


    if (rule.indexOf('letters') !== -1) {
      if (!/^[a-zA-Z]+$/.test(value)) {
        var errorData = {
          'fieleName': fieldName,
          'failedRule': 'letters',
          'failedMessage': 'Field should only contain Letters'
        };
        formError.push(errorData);
        console.log('field should only contain letters');
      }
    } // Check if is numbers & letters


    if (rule.indexOf('numbers letters spaces periods hypens') !== -1) {
      if (!/^[0-9a-zA-Z\s-.]+$/.test(value)) {
        var errorData = {
          'fieldName': fieldName,
          'failedRule': 'numbers letters',
          'failedMessage': 'Field should only contain Numbers, Letters, Periods, Spaces & Hypens'
        };
        formError.push(errorData);
        console.log('field should only contain numbers and letters');
      }
    } // Check if it is Email Address


    if (rule.indexOf('email') !== -1) {
      console.log('check email'); // Remove first and last spaces if found

      value = value.trim();

      if (!/^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/.test(value)) {
        var errorData = {
          'fieldName': fieldName,
          'failedRule': 'email',
          'failedMessage': 'Field should be formatted like an Email Address'
        };
        formError.push(errorData);
        console.log('field should be formatted like an Email Address');
      }
    } // Check if Email Address matches


    if (rule.indexOf('match') !== -1) {
      console.log('check email match');

      if ($('[name=emailAddress]').val() !== $('[name=confirmEmailAddress]').val()) {
        var errorData = {
          'fieldName': fieldName,
          'failedRule': 'match',
          'failedMessage': 'Field should match Email Address'
        };
        formError.push(errorData);
        console.log('field should be match Confirm Email Address');
      }
    }
  }

  console.log(formError);

  if (formError.length) {
    for (var error in formError) {
      // Select & add border to field with error
      var fieldSelect = $('[name=' + formError[error].fieldName + ']');
      fieldSelect.css({
        'border-bottom': '1px solid #ff0000'
      }); // focus on the first field with an error

      if (error == 0) {
        fieldSelect.focus();
        $('.error-message').css({
          'display': 'block'
        });
        $('.form-error').html(formError[error].failedMessage);
      }
    }

    return;
  } else {
    // Clear error message
    $('.form-error').html('');
    $('.error-message').css({
      'display': 'none'
    });
  } // Switch to next step


  var step_1 = $('.steps-list__item--first');
  var step_2 = $('.steps-list__item--second'); // Hide `Shipping Form`

  $('.steps-content__item--shipping-form').fadeOut(200, function () {
    // Switch step highlighting
    step_1.removeClass('active');
    step_2.addClass('active');

    if (maropostInterest != 0) {
      var formInformation = {
        'firstName': $('[name=firstName]').val(),
        'lastName': $('[name=lastName]').val(),
        'emailAddress': $('[name=emailAddress]').val(),
        'phoneNumber': $('[name=phoneNumber]').val(),
        'maropostId': maropostInterest
      };
      console.log(formInformation); // Send Email to Maropsot
      // $.ajax({
      //     type   : 'post',
      //     url    : '/api/add/maropost',
      //     data   : formInformation,
      //     success: function (resp) {
      //         console.log(resp)
      //     },
      //     error  : function() {
      //         console.log("error");
      //     }
      // });
    } // Show `Payment Form`


    $('.steps-content__item--payment-form').fadeIn(100, function () {
      // Scroll page up
      $("html, body").animate({
        scrollTop: 0
      }, "slow"); // Focus on first field

      $('[name="cardNumber"]').focus();
    });
  });
}); // Same as Billing

$(document).on('click', '[data-autofill="zip-country"]', function (e) {
  // e.preventDefault();
  if (!$(this).parent().hasClass('checked')) {
    var shippingZip = $('[name="shippingZip"]').val();
    var shippingCountry = $('[name="shippingCountry"]').val();
    $('[name="billingZip"]').val(shippingZip);
    $('[name="billingCountry"]').val(shippingCountry);
    $(this).parent().addClass('checked');
  } else {
    $('[name="billingZip"]').val('');
    $('[name="billingCountry"]').val('');
    $(this).parent().removeClass('checked');
  }
});
$(document).on('click', '.payment-form__next-button', function (e) {
  e.preventDefault();

  if ($('[name="bump"]').val() == 1) {
    postUrl = '/api/limelight/payment/bump2';
  } else {
    postUrl = '/api/limelight/payment';
  }

  console.log(postUrl);
  console.log('bump');
  console.log($('[name="bump"]').val());
  console.log(typeof fbq === "function");
  console.log('Attempting to send'); // fields & rule sets

  var fieldRules = {
    'cardNumber': ['required', 'credit card number'],
    'creditCardType': ['required', 'letters'],
    'expirationMonth': ['required', 'numbers'],
    'expirationYear': ['required', 'numbers'],
    'cvv': ['required', 'numbers letters'],
    'billingZip': ['required', 'numbers letters spaces periods hypens']
  }; // Data to be submitted

  var formData = {}; // Contains error messages

  var formError = []; // Loop through rule set

  for (var fieldName in fieldRules) {
    // Get field value
    var value = $('[name=' + fieldName + ']').val();

    if (fieldName == 'cardNumber') {
      // If credit card remove
      value = value.replace(/\D/g, '');
    }

    console.log('value');
    console.log(value);
    console.log(fieldName); // Remove uppercase

    value = value.toLowerCase(); // Remove previous border styling

    if (fieldName === 'expirationMonth' || fieldName === 'expirationYear') {
      $('[name=' + fieldName + ']').siblings('.jcf-select-form-group__input').css({
        'border-bottom': '1px solid #5da743'
      });
    } else {
      $('[name=' + fieldName + ']').css({
        'border-bottom': '1px solid #5da743'
      });
    } // Get field rules


    var rule = fieldRules[fieldName]; // Add form data to object

    formData[fieldName] = value; // Check if Required

    if (rule.indexOf('required') !== -1) {
      if (value === '' || value == undefined) {
        // field name
        // failed rule
        // failed message
        var errorData = {
          'fieldName': fieldName,
          'failedRule': 'required',
          'failedMessage': 'Field Required'
        };
        formError.push(errorData);
      }
    } // Check if Credit Card Number


    if (rule.indexOf('credit card number') !== -1) {
      if (!/[0-9\-]/.test(value)) {
        var errorData = {
          'fieldName': fieldName,
          'failed_Rule': 'credit card number',
          'failedMessage': 'Field should only contain Numbers & Hypens'
        };
        formError.push(errorData);
        console.log('field should only contain Numbers & Hypens');
      }
    } // Check if Number


    if (rule.indexOf('numbers') !== -1) {
      if (!/^\d+$/.test(value)) {
        var errorData = {
          'fieldName': fieldName,
          'failedRule': 'numbers',
          'failedMessage': 'Field should only contain Numbers'
        };
        formError.push(errorData);
        console.log('field should only contain numbers');
      }
    } // Check if is numbers & letters


    if (rule.indexOf('letters') !== -1) {
      if (!/^[a-zA-Z]+$/.test(value)) {
        var errorData = {
          'fieleName': fieldName,
          'failedRule': 'letters',
          'failedMessage': 'Field should only contain Letters'
        };
        formError.push(errorData);
        console.log('field should only contain letters');
      }
    } // Check if is numbers & letters


    if (rule.indexOf('numbers letters spaces periods hypens') !== -1) {
      if (!/^[0-9a-zA-Z\s-.]+$/.test(value)) {
        var errorData = {
          'fieldName': fieldName,
          'failedRule': 'numbers letters',
          'failedMessage': 'Field should only contain Numbers, Letters, Periods, Spaces & Hypens'
        };
        formError.push(errorData);
        console.log('field should only contain numbers and letters');
      }
    } // Check if it is Email Address


    if (rule.indexOf('email') !== -1) {
      console.log('check email');

      if (!/^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/.test(value)) {
        var errorData = {
          'fieldName': fieldName,
          'failedRule': 'email',
          'failedMessage': 'Field should be formatted like an Email Address'
        };
        formError.push(errorData);
        console.log('field should be formatted like an Email Address');
      }
    } // Check if Email Address matches


    if (rule.indexOf('match') !== -1) {
      console.log('check email match');

      if ($('[name=emailAddress]').val() !== $('[name=confirmEmailAddress]').val()) {
        var errorData = {
          'fieldName': fieldName,
          'failedRule': 'match',
          'failedMessage': 'Field should match Email Address'
        };
        formError.push(errorData);
        console.log('field should be match Confirm Email Address');
      }
    }
  }

  console.log(formError);

  if (formError.length) {
    for (var error in formError) {
      // Select & add border to field with error
      var fieldSelect = $('[name=' + formError[error].fieldName + ']');

      if (fieldSelect.is('[name=expirationMonth]') || fieldSelect.is('[name=expirationYear]')) {
        fieldSelect.siblings('.jcf-select-form-group__input').css({
          'border-bottom': '1px solid #ff0000'
        });
      } else {
        fieldSelect.css({
          'border-bottom': '1px solid #ff0000'
        });
      } // focus on the first field with an error


      if (error == 0) {
        fieldSelect.focus();
        $('.error-message').css({
          'display': 'block'
        });
        $('.form-error').html(formError[error].failedMessage);
      }
    }

    return;
  } else {
    // Clear error message
    $('.form-error').html('');
    $('.error-message').css({
      'display': 'none'
    });
  } // Processing Messages


  $('.payment-form__next-button').prop("disabled", true).text('Processing...'); // $('#processing-modal').modal('show');

  var formInformation = {
    // Shipping Details
    'firstName': $('[name=firstName]').val(),
    'lastName': $('[name=lastName]').val(),
    'emailAddress': $('[name=emailAddress]').val().trim(),
    'shippingAddress1': $('[name=shippingAddress1]').val(),
    'shippingCity': $('[name=shippingCity]').val(),
    'shippingState': $('[name=shippingState]').val().toUpperCase(),
    'shippingZip': $('[name=shippingZip]').val(),
    'shippingCountry': $('[name=shippingCountry]').val(),
    'phoneNumber': $('[name=phoneNumber]').val(),
    'bump': $('[name=bump]').val(),
    // Payment Details
    'cardNumber': $('[name=cardNumber]').val().replace(/\D/g, ''),
    'creditCardType': $('[name=creditCardType]').val(),
    'expirationMonth': $('[name=expirationMonth]').val(),
    'expirationYear': $('[name=expirationYear]').val(),
    'cvv': $('[name=cvv]').val(),
    'billingZip': $('[name=billingZip]').val(),
    'shippingMethod': 2
  };
  var ClickId = getCookie('ClickId');

  if (ClickId) {
    formInformation.ClickId = ClickId;
  }

  console.log(formInformation); // Actually Send
  // $.ajax({
  //     type   : 'post',
  //     url    : postUrl,
  //     data   : formInformation,
  //     success: function (resp) {
  //         $("html, body").animate({ scrollTop: 0 }, "slow");
  //         // Success
  //         if(resp.status == true) {
  //             if(typeof fbq === 'function') {
  //                 fbq('track', 'Purchase',
  //                     {
  //                         'value'   : '67.00',
  //                         'currency': 'USD'
  //                     }
  //                 );
  //             }
  //             // Google Analytics Enhanced Ecommerce
  //             if(typeof pushDataLayer === 'function') {
  //                 pushDataLayer(resp.transaction, resp.product);
  //             }
  //             // Get Cookie Value
  //             var picks = getCookie('bonus_pick');
  //             // Redirect to
  //             if(picks != '') {
  //                 window.location.href = 'order/' + picks;
  //             } else {
  //                window.location.href = resp[0];
  //             }
  //         } else {
  //             $('.payment-form__next-button').prop("disabled", false).text('Click To Complete Your Order');
  //             $('#processing-modal').modal('hide');
  //             $('.error-message').css({'display':'block'});
  //             $('.form-error').html(resp.errorMessage);
  //         }
  //     },
  //     error  : function() {
  //         console.log("error");
  //     }
  // });
}); // Payment Form `Back` Event Listen

$('.steps-list__item--first').click(function (e) {
  // Prevent Default Actions
  e.preventDefault();

  if (!$(this).hasClass('active')) {
    var step_1 = $('.steps-list__item--first');
    var step_2 = $('.steps-list__item--second'); // Hide `Payment Form`

    $('.steps-content__item--payment-form').fadeOut(200, function () {
      // Switch step highlighting
      step_1.addClass('active');
      step_2.removeClass('active'); // Scroll page up

      $("html, body").animate({
        scrollTop: 0
      }, "slow"); // Show `Shipping Form`

      $('.steps-content__item--shipping-form').fadeIn(100);
    });
  }
});