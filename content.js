// Global Number of Tabs Opened Counter
var opens_counter = 0;
// Global Current Background variable
var curr_bg = null;

// Function actually sets the date
function getDate() {
  var d = new Date();
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var result = days[d.getDay()] + ", " + d.getDate() + " " + months[d.getMonth()];
  document.getElementById("date_box").innerHTML = result;
}

// Function actually changes the time and calls date changer when needed
function changeTime() {
  var d = new Date();
  var current_hour = d.getHours();
  var current_minutes = d.getMinutes();
  if (current_minutes < 10) {
    current_minutes = "0" + current_minutes;
  }
  document.getElementById("time_box").innerHTML = current_hour + ":" + current_minutes;
  if ((current_hour == 0) && (current_minutes == 0)) {
    getDate();
  }
}

// Updates the time every 1000ms
setInterval(changeTime, 1000);

// Add event listeners to opening and closing the settings menu
$("#gear_box").click(function() {
  if ($('#settings_box').css('display') == 'none') {
    $(document).on('click', function (event) {
      if ($(event.target).is('#gear_box')) {
        $("#settings_box").fadeIn('fast');
        $('#adframe').css('z-index', '-1'); // Move Ad-Frame Back (Can't Click Ads while services open)
      } else if(!$(event.target).is('#settings_box') && !$(event.target).parents("#settings_box").is("#settings_box"))
        {
            $("#settings_box").fadeOut('fast');
            $(document).off('click');
            $('#adframe').css('z-index', '0'); // Move Ad-Frame to normal z-index
        }
    });
    $("#services_container").hide();
  } else {
    $("#settings_box").fadeOut('fast');
    $(document).off('click');
    $('#adframe').css('z-index', '0'); // Move Ad-Frame to normal z-index
  }
});

$("#exit_settings_button").click(function() {
  $("#settings_box").fadeOut('fast');
  $(document).off('click');
  $('#adframe').css('z-index', '0'); // Move Ad-Frame to normal z-index
});

// Show/Hide the To-Do List
$("#todo_toggle_button").on('click', function() {
  $('#todo_item_list').toggle();
});

$("#todo_list_add_button").on('click', function() {
  var newItem = $('#new_todo_item').val();
  if (newItem.length != 0) {
    var numOfElements = $('.todo_item_container').length + 1;
    var newElementToDo = '<li class="todo_item_container"><input class="todo_item" type="checkbox" id="tdi_' + numOfElements + '"><label for="tdi_' + numOfElements + '">' + newItem + '</label></li>';
    $('#todo_item_list_ul').append(newElementToDo);
    chrome.storage.sync.get(['todo_items'], function (result) {
      if (!chrome.runtime.error && result.todo_items != undefined) {
        todo_items = result.todo_items;
        todo_items.push(newItem);
        chrome.storage.sync.set({todo_items: todo_items}, function() {});
      }
    });
    $('#new_todo_item').val('');
    attachToDoHandlers();
  }
});

$('#new_todo_item').on('keydown', function(e) {
  if (e.key == 13 || e.which == 13) {
    $("#todo_list_add_button").trigger('click');
    return false;
  }
});

// Make the label get crossed out when the checkbox is checked
function attachToDoHandlers() {
  $('.todo_item').change(function() {
      var label = $("label[for='" + $(this).attr('id') + "']");
      if(this.checked) {
        $(label).css('text-decoration', 'line-through').delay(1000).fadeOut();
        $(this).delay(1000).fadeOut();
        $(this).parent().delay(1000).fadeOut();
        chrome.storage.sync.get(['todo_items'], function (result) {
          if (!chrome.runtime.error && result.todo_items != undefined) {
            todo_items = result.todo_items;
            for (var i = 0; i < todo_items.length; i++) {
              if (todo_items[i] == label.text()) {
                todo_items.splice(i, 1);
              }
            }
            chrome.storage.sync.set({todo_items: todo_items}, function() {});
          }
        });
      } else {
        $(label).css('text-decoration', 'none');
      }
  });
}

// Open and Close Services Button Functionality
$("#services_button").click(function() {
  if ($('#services_container').css('display') == 'none') {
    $(document).on('click', function (event) {
      if ($(event.target).is('#services_button')) {
        $("#services_container").css('display', 'grid');
        $('#adframe').css('z-index', '-1'); // Move Ad-Frame Back (Can't Click Ads while services open)
      } else if(!$(event.target).is('#services_container') && !$(event.target).parents("#services_container").is("#services_container"))
        {
            $("#services_container").fadeOut('fast');
            $(document).off('click');
            $('#adframe').css('z-index', '0'); // Move Ad-Frame to normal z-index
        }
    });
  } else {
    $("#services_container").fadeOut('fast');
    $(document).off('click');
    $('#adframe').css('z-index', '0'); // Move Ad-Frame to normal z-index
  }
});

// Makes the background open on clicking the nav in settings
$("#bg_setting").click(function() {
  if (($('#background_chooser').css('display')) == 'none') {
    $(".setting_menu_option").hide();
    $("#background_chooser").show();
    $("#settings_menu li").removeClass("current_setting_option");
    $("#bg_setting").addClass("current_setting_option");
  }
});

// Makes the charity tab open on clicking the nav in settings
$("#ch_setting").click(function() {
  if (($('#charity_settings').css('display')) == 'none') {
    $(".setting_menu_option").hide();
    $("#charity_settings").show();
    $("#settings_menu li").removeClass("current_setting_option");
    $("#ch_setting").addClass("current_setting_option");
  }
});

// Makes the misc settings open on clicking the nav in settings
$("#mc_setting").click(function() {
  if (($('#misc_settings').css('display')) == 'none') {
    $(".setting_menu_option").hide();
    $("#misc_settings").show();
    $("#settings_menu li").removeClass("current_setting_option");
    $("#mc_setting").addClass("current_setting_option");
  }
});

// Function that changes the background upon selection in the settings + shows current selected bg
function updateBg(bg_num) {
    $('body').css('background-image', 'url(https://cdn.statically.io/img/fastserve.charitytab.ml/preset_backgrounds/' + bg_num + '.jpg)');
    $('.relative_container img').removeClass('selected_bg');
    $('#' + bg_num).addClass('selected_bg');
}

// Adds the listener to make the updateBg() get called when clicking on a bg (function bc async addition of bg options)
function addBgListener() {
  $('.relative_container img').click(function() {
    var bg_num = $(this).attr('alt')
    chrome.storage.sync.set({user_bg: bg_num}, function() {
      updateBg(bg_num);
      curr_bg = bg_num;
    });
  });
  if($('#customUserBg').length){
    $('#customUserBg').click(function() {
      curr_bg = 0;
      chrome.storage.sync.set({user_bg: curr_bg}, function() {
        $('#customUserBg').attr("src", user_custom_bg);
        $('#customUserBg').addClass('selected_bg');
      });
      $('body').css('background-image', 'url(' + user_custom_bg + ')');
    });
  }
}

// Global variable to count number of deleted quick links
var numDel = 0;

// Function to open and close the add and edit link boxes
function closeQLChanger() {
  $('#change_link').fadeOut('fast');
  $('#add_link').fadeOut('fast');
  $('#qldelete_button').off('click');
  $('#qlcancel_button').off('click');
  $('#qldone_button').off('click');
  $('#qladdcancel_button').off('click');
  $('#qladddone_button').off('click');
  if (numDel > 0) {
    $('#qladd_container').show();
  } else {
    $('#qladd_container').hide();
  }
}

// Function to verify a url is valid
function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

// This makes the change quick link box work
function changeQuickLink(linkID) {
  $('#add_link').fadeOut('fast');
  $('#change_link').fadeIn('fast');
  $('#qldelete_button').click(function() {
    $('#' + linkID).parent().hide();
    numDel++;
    saveQLs(linkID.substring(2), "deleted");
    closeQLChanger();
  });
  $('#qlcancel_button').click(function() {
    closeQLChanger();
  })
  $('#qldone_button').click(function() {
    var valid = 0;
    var newURL = $('#qlurl-field').val();
    if (newURL.substring(0, 4) != 'http') {
      if (newURL.substring(0,4) == 'www.') {
        newURL = newURL.substring(4);
      }
      newURL = 'https://' + newURL;
    } else if (newURL.substring(0, 4) == 'http' || newURL.substring(0, 5) == 'https') {
      if (newURL.substring(4,11) == '://www.') {
        newURL = newURL.substring(11);
        newURL = 'http://' + newURL;
      } else if (newURL.substring(4,12) == 's://www.') {
        newURL = newURL.substring(12);
        newURL = 'https://' + newURL;
      }
    }
    valid = isUrlValid(newURL);
    if (valid == 1) {
      $('#qlinvalid-url').hide();
      $("#" + linkID).css("background-image", "url(https://cdn.statically.io/screenshot/" + $('#qlurl-field').val());
      $('#' + linkID).attr('href', newURL);
      saveQLs(linkID.substring(2), newURL);
      closeQLChanger();
    } else {
      $('#qlinvalid-url').show();
    }
  });
}

// This makes the quick links work (opening add/edit menus etc..)
function addHandlers() {
  $('.quick_link').hover(function() { // Handler for in
    var current_ql = $(this).attr('id');
    $("#" + current_ql + "opt").show();
  }, function() { // Handler for out
    var current_ql = $(this).attr('id');
    $("#" + current_ql + "opt").hide();
  });

  $('.ql_options').hover(function() { // Handler for in
    $(this).next().toggleClass('hovered');
    $(this).show();
    $(this).click(function() {
      changeQuickLink($(this).next().attr('id'));
    });
  }, function() { // Handler for out
    $(this).next().toggleClass('hovered');
    $(this).hide();
    $(this).off('click');
  });
  // Hide necessary elements
  $('.ql_options').hide();
  $('#change_link').hide();
  $('#qladd_container').hide();
  $('#add_link').hide();
}

// Makes the quicklink add box work
$('#qladd').click(function() {
  $('#change_link').fadeOut('fast');
  $('#add_link').fadeIn('fast');
  $('#qladdcancel_button').click(function() {
    closeQLChanger();
  })
  $('#qladddone_button').click(function() {
    var valid = 0;
    var newURL = $('#qladdurl-field').val();
    if (newURL.substring(0, 4) != 'http') {
      if (newURL.substring(0,4) == 'www.') {
        newURL = newURL.substring(4);
      }
      newURL = 'https://' + newURL;
    } else if (newURL.substring(0, 4) == 'http' || newURL.substring(0, 5) == 'https') {
      if (newURL.substring(4,11) == '://www.') {
        newURL = newURL.substring(11);
        newURL = 'http://' + newURL;
      } else if (newURL.substring(4,12) == 's://www.') {
        newURL = newURL.substring(12);
        newURL = 'https://' + newURL;
      }
    }
    valid = isUrlValid(newURL);
    if (valid == 1) {
      $('#qladdinvalid-url').hide();
      chrome.storage.sync.get(['quickLinks'], function (result) {
        user_qls = result.quickLinks;
        callback_for_ql_add_update_of_user_qls();
      });
      function callback_for_ql_add_update_of_user_qls() {
        for (var i = 0; i < user_qls.length; i++) {
          if (user_qls[i] == "deleted") {
            linkID = "ql" + (i+1);
            break;
          }
        };
        var newDIV = '<div class="ql_containers"><img class="ql_options" id="' + linkID + 'opt" src="/images/more_options.svg" /><a class="quick_link" href="' + newURL + '" id="' + linkID + '"></a></div>';
        $('#ql' + (linkID.substring(2)-1)).parent().after(newDIV);
        $("#" + linkID).css("background-image", "url(https://cdn.statically.io/screenshot/" + $('#qladdurl-field').val());
        numDel--;
        $("#" + linkID).parent().show();
        saveQLs(linkID.substring(2), newURL);
        addHandlers();
        closeQLChanger();
      }
    } else {
      $('#qladdinvalid-url').show();
    }
  });
});

// Saves the quicklinks into chrome sync storage
function saveQLs(qlNum, qlURL) {
  currentQLs = [];
  chrome.storage.sync.get(['quickLinks'], function(result) {
    if (!chrome.runtime.error && result.quickLinks != undefined) {
        currentQLs = result.quickLinks;
        qlcallback()
    } else if (result.quickLinks == undefined) {
        currentQLs = ["https://youtube.com", "https://facebook.com", "https://netflix.com", "https://smile.amazon.com", "https://twitter.com", "https://gmail.com"];
        qlcallback()
    } else {
      console.log("Chrome Sync Error. Error Code: 420");
    }
  });
  function qlcallback() {
    currentQLs[qlNum - 1] = qlURL;
    chrome.storage.sync.set({quickLinks: currentQLs}, function() {
      console.log("Saved URL");
    });
  }
}

// Checks if internet works by pinging google
function hostReachable() {
    // Handle IE and more capable browsers
    var xhr = new(window.ActiveXObject || XMLHttpRequest)("Microsoft.XMLHTTP");
    var status;
    // Open new request as a HEAD to the root hostname with a random param to bust the cache
    xhr.open("HEAD", "https://google.com/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false);
    // Issue request and handle response
    try {
        xhr.send();
        return (xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304));
    } catch (error) {
        return false;
    }
}

// Changes the value of the numOfBg variable
function setNumOfBg(valueToSet) {
  numOfBg = parseInt(valueToSet);
  loadCustomBg();
}

// Gets the number of background images available
function getNumberOfBg() {
  $.get('https://fastserve.charitytab.ml/file_count.php', function(data) {
    setNumOfBg(data);
  });
}

function customBackgroundUploaded(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(input.files[0]);
      reader.onload = function (e) {
          user_custom_bg =  e.target.result;
          chrome.storage.local.set({'custom_bg': user_custom_bg}, function() {
            $('.relative_container img').removeClass('selected_bg');
            $('body').css('background-image', 'url(' + user_custom_bg + ')');
            chrome.storage.sync.set({user_bg: 0}, function() {});
            if($('#customUserBg').length){
            	$('#customUserBg').attr("src", user_custom_bg);
              $('#customUserBg').addClass('selected_bg');
            } else {
              $('#customBgUploadContainer').addClass('selected_bg');
            }
          });
      }
  }
}

function loadCustomBg() {
  chrome.storage.local.get(['custom_bg'], function(result) {
    if (!chrome.runtime.error && result.custom_bg != undefined) {
      // custom bg exists
      user_custom_bg = result.custom_bg;
      var bgCode = '<div class="relative_container"><img id="customUserBg" alt="User Uploaded Background" src="' + user_custom_bg + '" decoding="async" class="bg_selector_choice"/></div>';
      $('#bg_choice_column_1').append(bgCode);
      var bgCode = '<div class="relative_container" id="customBgUploadContainer"><p>Upload your own background!</p><input type="file" id="customBackgroundUpload" /></div>';
      $('#bg_choice_column_2').append(bgCode);
      $('#customBackgroundUpload').on('change', function() {
        customBackgroundUploaded(this);
      });
      loadBackgroundChoice();
    } else if (!chrome.runtime.error && result.custom_bg == undefined) {
      // There is no bg added
      user_custom_bg = -1;
      var bgCode = '<div class="relative_container" id="customBgUploadContainer"><p>Upload your own background!</p><input type="file" id="customBackgroundUpload" /></div>';
      $('#bg_choice_column_1').append(bgCode);
      $('#customBackgroundUpload').on('change', function() {
        customBackgroundUploaded(this);
      });
      loadBackgroundChoice();
    } else {
      console.log("Chrome Sync Error. Error Code: 420");
      user_custom_bg = -1;
      loadBackgroundChoice();
    };
  });
}

// Loads in all the background choices in settings
function loadBackgroundChoice() {
  perColumn = numOfBg;
  fColumn = 0;
  sColumn = 0;
  tColumn = 0;
  spareCount = 0;
  while ((perColumn % 3) != 0) {
    perColumn -= 1;
    spareCount++;
  }
  perColumn = perColumn / 3;
  if (user_custom_bg == -1) {
    fColumn = perColumn - 1;
    sColumn = perColumn;
    tColumn = perColumn;
    spareCount++;
  } else {
    fColumn = perColumn - 1;
    sColumn = perColumn - 1;
    tColumn = perColumn;
    spareCount += 2;
  }
  for (var i = 1; i <= fColumn; i++) {
    var bgCode = '<div class="relative_container"><img id="background' + i + '" alt="background' + i + '" src="https://cdn.statically.io/img/fastserve.charitytab.ml/preset_backgrounds/background' + i + '.jpg" decoding="async" class="bg_selector_choice"/></div>';
    $('#bg_choice_column_1').append(bgCode);
  }
  for (var j = (fColumn + 1); j <= (fColumn + sColumn); j++) {
    var bgCode = '<div class="relative_container"><img id="background' + j + '" alt="background' + j + '" src="https://cdn.statically.io/img/fastserve.charitytab.ml/preset_backgrounds/background' + j + '.jpg" decoding="async" class="bg_selector_choice"/></div>';
    $('#bg_choice_column_2').append(bgCode);
  }
  for (var k = (fColumn + sColumn + 1); k <= (fColumn + sColumn + tColumn); k++) {
    var bgCode = '<div class="relative_container"><img id="background' + k + '" alt="background' + k + '" src="https://cdn.statically.io/img/fastserve.charitytab.ml/preset_backgrounds/background' + k + '.jpg" decoding="async" class="bg_selector_choice"/></div>';
    $('#bg_choice_column_3').append(bgCode);
  }
  if (spareCount > 0) {
    var currColumn = 1;
    for (var l = (fColumn+sColumn+tColumn+1); l <= (fColumn+sColumn+tColumn+spareCount); l++) {
      var bgCode = '<div class="relative_container"><img id="background' + l + '" alt="background' + l + '" src="https://cdn.statically.io/img/fastserve.charitytab.ml/preset_backgrounds/background' + l + '.jpg" decoding="async" class="bg_selector_choice"/></div>';
      $('#bg_choice_column_'+ currColumn).append(bgCode);
      if (currColumn == 3) {
        currColumn = 1;
      } else {
        currColumn++;
      }
    }
  }
  addBgListener();
  if (curr_bg == 0) {
    $('.relative_container img').removeClass('selected_bg');
    $('#customUserBg').addClass('selected_bg');
  } else {
    $('.relative_container img').removeClass('selected_bg');
    $('#' + curr_bg).addClass('selected_bg');
  }
}

// Runs all JS necessary upon load
window.onload = function() {
  // Sets background to user choice
  if (hostReachable()) {
    chrome.storage.sync.get(['user_bg'], function(result) {
      if ((!chrome.runtime.error) && (result.user_bg != undefined)) {
        if (result.user_bg == 0) {
          chrome.storage.local.get(['custom_bg'], function(result) {
            if (!chrome.runtime.error && result.custom_bg != undefined) {
              $('body').css('background-image', 'url(' + result.custom_bg + ')');
              curr_bg = 0;
            } else {
              console.log("Chrome Sync Error Occurred. Error 420");
            }
          });
        } else {
            updateBg(result.user_bg);
            curr_bg = result.user_bg;
        }
      } else if (result.user_bg == undefined) {
        $.get('https://fastserve.charitytab.ml/file_count.php', function(data) {
          var randomBg = Math.floor((Math.random() * data) + 1); // Number between 1 and data (max num of bg)
          updateBg('background' + randomBg);
          curr_bg = randomBg;
        });
      }
    });
  }
  // Shows or hides quick links depending on user choice
  chrome.storage.sync.get(['user_ql_setting'], function(result) {
    if (!chrome.runtime.error) {
      if (result.user_ql_setting == 'off') {
        $("#flex_container_links").toggle();
        $("#ql_onoff").prop('checked', false);  //Make button look off.
      } else if (result.user_ql_setting == undefined) {
        chrome.storage.sync.set({user_ql_setting: "on"}, function() {
        });
      }
    }
  });
  // Shows or hides ads depending on user choice
  chrome.storage.sync.get(['user_ad_setting'], function(result) {
    if (!chrome.runtime.error) {
      if (result.user_ad_setting == 'off') {
        $("#adframe").toggle();
        $("#ad_onoff").prop('checked', false);  //Make button look off.
      } else if (result.user_ad_setting == undefined) {
        chrome.storage.sync.set({user_ad_setting: "on"}, function() {
        });
      }
    }
  });
  // Shows or hides todo list by default depending on user choice
  chrome.storage.sync.get(['user_todo_default_setting'], function(result) {
    if (!chrome.runtime.error) {
      if (result.user_todo_default_setting == 'on') {
        $('#todo_item_list').show();
        $("#todo_onoff").prop('checked', true);  //Make button look on.
      } else if (result.user_todo_default_setting == 'off') {
        $('#todo_item_list').hide();
        $("#todo_onoff").prop('checked', false);  //Make button look off.
      } else if (result.user_todo_default_setting == undefined) {
        $('#todo_item_list').show();
        chrome.storage.sync.set({user_todo_default_setting: "on"}, function() {
        });
      }
    }
  });
  // Sets quicklinks to what the user has saved
  chrome.storage.sync.get(['quickLinks'], function (result) {
    if (!chrome.runtime.error && result.quickLinks != undefined) {
      user_qls = result.quickLinks;
      for (var i = 0; i < user_qls.length; i++) {
        $('#ql' + (i+1)).attr('href', user_qls[i]);
        if (user_qls[i] == "https://youtube.com" || user_qls[i] == "youtube.com" || user_qls[i] == "http://youtube.com" || user_qls[i] == "www.youtube.com"|| user_qls[i] == "http://www.youtube.com"|| user_qls[i] == "https://www.youtube.com") {
          $("#ql" + (i+1)).css("background-image", "url('/images/yt.webp')");
        } else if (user_qls[i] == "https://facebook.com" || user_qls[i] == "facebook.com" || user_qls[i] == "http://facebook.com" || user_qls[i] == "www.facebook.com"|| user_qls[i] == "http://www.facebook.com"|| user_qls[i] == "https://www.facebook.com") {
          $("#ql" + (i+1)).css("background-image", "url('/images/fb.webp')");
        } else if (user_qls[i] == "https://smile.amazon.com" || user_qls[i] == "amazon.com" || user_qls[i] == "http://amazon.com" || user_qls[i] == "www.amazon.com"|| user_qls[i] == "http://www.amazon.com"|| user_qls[i] == "https://www.amazon.com") {
          $("#ql" + (i+1)).css("background-image", "url('/images/amazon.webp')");
        } else if (user_qls[i] == "https://netflix.com" || user_qls[i] == "netflix.com" || user_qls[i] == "http://netflix.com" || user_qls[i] == "www.netflix.com"|| user_qls[i] == "http://www.netflix.com"|| user_qls[i] == "https://www.netflix.com") {
          $("#ql" + (i+1)).css("background-image", "url('/images/netflix.webp')");
        } else if (user_qls[i] == "https://twitter.com" || user_qls[i] == "twitter.com" || user_qls[i] == "http://twitter.com" || user_qls[i] == "www.twitter.com"|| user_qls[i] == "http://www.twitter.com"|| user_qls[i] == "https://www.twitter.com") {
          $("#ql" + (i+1)).css("background-image", "url('/images/twitter.webp')");
        } else if (user_qls[i] == "https://gmail.com" || user_qls[i] == "gmail.com" || user_qls[i] == "http://gmail.com" || user_qls[i] == "www.gmail.com"|| user_qls[i] == "http://www.gmail.com"|| user_qls[i] == "https://www.gmail.com") {
          $("#ql" + (i+1)).css("background-image", "url('/images/gmail.webp')");
        } else if (user_qls[i] == "deleted") {
          $('#ql' + (i+1)).parent().hide();
          numDel++;
          $('#qladd_container').show();
        } else {
          $("#ql" + (i+1)).css("background-image", "url(https://cdn.statically.io/screenshot/" + user_qls[i]);
        }
      }
    }
  });
  // Sets todo list to what the user has saved
  chrome.storage.sync.get(['todo_items'], function (result) {
    if (!chrome.runtime.error && result.todo_items != undefined) {
      todo_items = result.todo_items;
      for (var i = 0; i < todo_items.length; i++) {
        var currI = i + 1;
        var newItem = '<li class="todo_item_container"><input class="todo_item" type="checkbox" id="tdi_' + currI + '"><label for="tdi_' + currI + '">' + todo_items[i] + '</label></li>';
        $('#todo_item_list_ul').append(newItem);
      }
    } else if (!chrome.runtime.error && result.todo_items == undefined) {
      todo_items = ["To remove an item, simply check the checkbox or click the text!", "To add one, use the input below.", "To hide the To-Do List by default, go into the settings, under misc. settings change 'To-Do List' to 'Off'."];
      chrome.storage.sync.set({todo_items: todo_items}, function() {});
      for (var i = 0; i < todo_items.length; i++) {
        var currI = i + 1;
        var newItem = '<li class="todo_item_container"><input class="todo_item" type="checkbox" id="tdi_' + currI + '"><label for="tdi_' + currI + '">' + todo_items[i] + '</label></li>';
        $('#todo_item_list_ul').append(newItem);
      }
    }
    // Attach handlers for the To-Do List
    attachToDoHandlers();
  });
  
  //Increase counter of tabs & save & also ask for review if needed
  chrome.storage.sync.get(['opens_counter'], function(result) {
    if (!chrome.runtime.error && result.opens_counter != undefined) {
      opens_counter = result.opens_counter;
      opens_counter += 1;
      chrome.storage.sync.set({opens_counter: opens_counter}, function() {
        //Check to see if 100, 500, multiple of 100 tabs opened has been hit -> if yes ask to review!
        if (opens_counter == 100 || opens_counter == 500 || (opens_counter % 1000) == 0) {
          $("#insert_num_tabs_here").html(opens_counter);
          $("#exit_review_button").on("click", function() {
            $('#pls_review_box').hide();
          });
          $("#pls_review_box").show();
        }
      });
    } else if (!chrome.runtime.error && result.opens_counter == undefined) {
      chrome.storage.sync.set({opens_counter: 0}, function() {
        console.log("First tab opened counted!");
        opens_counter = 0;
      });
    } else {
      console.log("Chrome Sync Error. Error Code: 420");
    };
  });
  // Append Ad iFrame
  $('<iframe src="https://charitytab.ml/acontent.html" id="adframe"></iframe>').appendTo('#aframeholder');
  // Load background options in Settings
  getNumberOfBg();
};

// Function to show or hide quicklinks and save user choice
$('#ql_onoff').on('click', function() {
  chrome.storage.sync.get(['user_ql_setting'], function(result) {
    if (!chrome.runtime.error && (result.user_ql_setting == undefined)) {
      chrome.storage.sync.set({user_ql_setting: "off"}, function() {
      });
    } else if (!chrome.runtime.error && (result.user_ql_setting != undefined)) {
      if (result.user_ql_setting == "on") {
        chrome.storage.sync.set({user_ql_setting: "off"}, function() {
        });
      } else if (!chrome.runtime.error) {
        chrome.storage.sync.set({user_ql_setting: "on"}, function() {
        });
      } else {
        console.log("Chrome Error: " + chrome.runtime.error);
      }
    }
  });
  $("#flex_container_links").toggle();
});

// Function to show or hide ads and save user choice
$('#ad_onoff').on('click', function() {
  chrome.storage.sync.get(['user_ad_setting'], function(result) {
    if (!chrome.runtime.error && (result.user_ad_setting == undefined)) {
      chrome.storage.sync.set({user_ad_setting: "off"}, function() {
      });
    } else if (!chrome.runtime.error && (result.user_ad_setting != undefined)) {
      if (result.user_ad_setting == "on") {
        chrome.storage.sync.set({user_ad_setting: "off"}, function() {
        });
      } else if (!chrome.runtime.error) {
        chrome.storage.sync.set({user_ad_setting: "on"}, function() {
        });
      } else {
        console.log("Chrome Error: " + chrome.runtime.error);
      }
    }
  });
  $("#adframe").toggle();
});

// Function to show or hide todo list by default and save user choice
$('#todo_onoff').on('click', function() {
  chrome.storage.sync.get(['user_todo_default_setting'], function(result) {
    if (!chrome.runtime.error && (result.user_todo_default_setting == undefined)) {
      chrome.storage.sync.set({user_todo_default_setting: "on"}, function() {
      });
    } else if (!chrome.runtime.error && (result.user_todo_default_setting != undefined)) {
      if (result.user_todo_default_setting == "on") {
        chrome.storage.sync.set({user_todo_default_setting: "off"}, function() {
        });
      } else if (!chrome.runtime.error) {
        chrome.storage.sync.set({user_todo_default_setting: "on"}, function() {
        });
      } else {
        console.log("Chrome Error: " + chrome.runtime.error);
      }
    }
  });
  $("#todo_item_list").toggle();
});

// Sets time and date at opening of new tab
getDate();
changeTime();
// Adds the handlers for making quick links work
addHandlers();
