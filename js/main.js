$(document).ready(function() {
  console.log("ready!");

  var names = [];
  var myjson;
  $.getJSON("https://api.pixel5.us/api/quakecon/2015", function(json) {
    myjson = json;
    console.log(json);
  }).done(function() {
    names = myjson.map(function(item) {
      var aItem = {seat: item.seat, name: item.name, clan: item.clan};
      return JSON.stringify(aItem);
    });
    console.log(names);

    var substringMatcher = function(strs) {
      return function findMatches(q, cb) {
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
          if (substrRegex.test(str)) {
            matches.push(str);
          }
        });

        cb(matches);
      };
    };

    $('#player').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'names',
      limit: 15,
      highlight: true,
      display: 'name',
      source: substringMatcher(names),
      templates: {
        empty: [
          '<div class="empty-message">',
          'No players found.',
          '</div>'
        ].join('\n'),
        suggestion: function(searchstring) {
          console.log(searchstring);
          var friendlyJSON = JSON.parse(searchstring);
          var clanstring = "";
          if (friendlyJSON.clan != "") {
            clanstring = "[" + friendlyJSON.clan + "] ";
          }
          return '<div>' + clanstring + '<span class="player-name">' + friendlyJSON.name + '</span> - <em>' + friendlyJSON.seat + '</em></div>';
        }
      }
    });
    document.querySelector('#player').focus();
  });
});
