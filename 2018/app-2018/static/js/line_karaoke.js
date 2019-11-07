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

currentVerse = 0;
highlightedLine = 0;
LINE_HEIGHT = 86;
SHIFT = 113;

function generateCurrentVerse() {
  lines = lyrics[currentVerse].split('|');
  textStyle = "";
  generatedLyrics = "";

  for (l in lines) {
    words = lines[l].split(' ');

      // start of the line
      generatedLyrics += '<div class="text-line" id ="' + l + '">';

      for (i in words) {
        textStyle = "";
        word = words[i];
        for (j in teamColors) {
          if (words[i].slice(-1) == (j).toString()) {
            //'class="boxy" ' +
            textStyle = "data-color=\"" + teamColors[j][0] + "\" data-textcolor=\"" + teamColors[j][1] + 
            "\" data-word=\"" + teamColors[j][2] + "\" class=\"colorful\"";
            word = word.substring(0,word.length-1);
          } 
        }

        // largeee!
        if (words[i].indexOf('#') > 0) {
          word = word.substring(0,word.length-1)
          textStyle = "style=\"font-size:150px\"";
        }

        if (textStyle) {
          generatedLyrics += "<span " + textStyle + ">" + word + "</span>"
        } else {
          generatedLyrics += "<span>" + word + "</span>";
        }
      }

      generatedLyrics += '</div>';
    }
    $('.text-container').html(generatedLyrics);

    $('#pointer').attr("class", "dot " + default_color + "-knife");
    $('#0').children().each(function() {
      if ($(this).hasClass("colorful")) {            
        word = $(this).data('word');
        $('#pointer').attr("class", "dot " + word + "-knife");
      }
    });
  }


  function init() {
    generateCurrentVerse();
    nextStep();
  }

  function nextStep() {
    if (highlightedLine >= lyrics[currentVerse].split('|').length) {
      currentVerse ++;

      if (currentVerse >= lyrics.length) {
        $('.dot').stop().animate({
          top: 1950
        }, 100, function() {
          console.log('dot leaves forever');
        });
        $('#' + (highlightedLine-1)).removeClass('highlight');
        return;
      } 

      highlightedLine = 0;
      $('.dot').stop().animate({
        top: 1 * LINE_HEIGHT - SHIFT,
        opacity: 0.8,
          }, 100, function() {
            console.log('start highlight')
          });

      // to correct any awko taco jumps >:
      setTimeout(function() {
        generateCurrentVerse();
      }, 50);

    } else {
      setTimeout(function() {
        // loop through children
        $('#pointer').attr("class", "dot " + default_color + "-knife");
        console.log(default_color, $('#pointer').attr("class"));
        $('#' + (highlightedLine)).children().each(function() {
          if ($(this).hasClass("colorful")) {            
            color = $(this).data('color');
            textcolor = $(this).data('textcolor');
            word = $(this).data('word');
            $(this).css('backgroundColor', color);
            $(this).css('color', textcolor);
            $(this).css('padding-left', 20);
            $(this).css('padding-right', 20);
            $('#pointer').attr("class", "dot " + word + "-knife");
          }
        });
        
        $('#' + (highlightedLine-1)).removeClass('highlight');
        $('#' + (highlightedLine)).addClass('highlight');

        highlightedLine ++;
      }, 50);

      $('.dot').animate({
        top: (highlightedLine+1) * LINE_HEIGHT - SHIFT
      }, 50, function() {
        console.log('shifty');
        console.log((highlightedLine+1) * LINE_HEIGHT - SHIFT);
      })
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
          // this isn't implemented lol
          // previousStep();
        }
      });
  });