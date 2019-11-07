const teamColors = {
  1: ['#FDD900', '#000000', 'yellow'],
  2: ['#EC1C24', '#ffffff', 'red'],
  3: ['#3675BB', '#ffffff', 'blue'],
  4: ['#F27421', '#ffffff', 'orange'],
  5: ['#4FB648', '#ffffff', 'green'],
  6: ['#EF4681', '#ffffff', 'pink'],
  7: ['#8A4C9D', '#ffffff', 'purple'],
  8: ['#B2B4B6', '#000000', 'silver'],
}

previousHeight = 0;
currentLine = 0;
highlightedWord = 0;
LINE_HEIGHT = 86;
SHIFT = 115;

function generateCurrentLine() {
  words = lyrics[currentLine].split(' ');
  var generatedLyrics = '';
  for (i in words) {
    textStyle = '';
    word = words[i];
    for (j in teamColors) {
      if (words[i].indexOf(j) > 0){
        textStyle = "data-color=\"" + teamColors[j][0] + "\" data-textcolor=\"" + teamColors[j][1] + 
        "\" data-word=\"" + teamColors[j][2] + "\" class=\"colorful\"";
        word = word.substring(0,word.length-1)
      }
    }

  // largeee!
  var isBigger = false;
  var count = 0;
  while (word.indexOf('#') > 0) {
    isBigger = true;
    count += 1;
    word = word.substring(0,word.length-1);
  }

  if (isBigger) {
    var fontsize = 50 + 50 * count;
    var lineheight = 80 + 50 * count;
    textStyle = 'style="font-size:'+ fontsize+'px; line-height:' + lineheight + 'px" data-big="' + count + '"';
  }

  generatedLyrics += '<div class="text-line" '+textStyle+' id='+i+'>'+word+'</div>';
}
$('.text-container').html(generatedLyrics)
}

function init() {
  $('#pointer').attr("class", "dot " + default_color + "-knife");
  generateCurrentLine();
}

function nextStep() {
if (highlightedWord + 1 > lyrics[currentLine].split(' ').length) {
  currentLine ++;

  if (currentLine >= lyrics.length) {
    $('.dot').stop().animate({
      top: 1950
    }, 100, function() {
      console.log('dot leaves forever');
    })
    $('#' + (highlightedWord-1)).removeClass('highlight');
    return;
  } 

  highlightedWord = 0;
  $('.dot').stop().animate({
    top: 1 * LINE_HEIGHT - SHIFT,
    opacity: 0.8,
  }, 100, function() {
    console.log('start highlight')
  });

  previousHeight = - SHIFT;

    // to correct any awko taco jumps >:
    setTimeout(function() {
      generateCurrentLine();
    }, 50);

  } else {

    setTimeout(function() {
      if ($('#' + (highlightedWord)).data('color')) {
        color = $('#' + (highlightedWord)).data('color');
        textcolor = $('#' + (highlightedWord)).data('textcolor');
        word = $(this).data('word');
        $('#' + (highlightedWord)).css('backgroundColor', color)
        $('#' + (highlightedWord)).css('color', textcolor)
        $('#pointer').attr("class", "dot " + word + "-knife");
      }
      $('#' + (highlightedWord-1)).removeClass('highlight');
      $('#' + (highlightedWord)).addClass('highlight');

      highlightedWord ++;
    }, 50);

    if ($('#' + (highlightedWord)).data('big')) {
      console.log("yay");
      previousHeight = previousHeight + LINE_HEIGHT +  48 * (parseInt($('#' + (highlightedWord)).data('big')));

      console.log(previousHeight);
      $('.dot').animate({
        top: previousHeight,
      }, 50, function() {
        console.log("previous height " + previousHeight);
      });
    } else {
      $('.dot').animate({
        top: (highlightedWord+1) * LINE_HEIGHT - SHIFT
      }, 50, function() {
        previousHeight = (highlightedWord) * LINE_HEIGHT - SHIFT;
        console.log("previousHeight " + previousHeight);
      })
    }
  }

}
$(function() {
  init();
  $('body').keyup(function(e){
    console.log(e.keyCode);
    if(e.keyCode == 32 || e.keyCode == 40){
         // user has pressed backspace
         nextStep();
       }
       if (e.keyCode == 38) {
        previousStep();
      }
    });
});