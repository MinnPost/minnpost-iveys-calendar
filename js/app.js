/**
 * Main parts for Ivey overrides.
 */


require(['jquery', 'underscore', 'moment'], function($, _, moment) {

  function styleIvey() {

    // Production search
    var $prodSearch = $('#dnn_ctr438_PerformanceCalendar_pnlSearch');
    var $table, $swap;
    if ($prodSearch.size() > 0) {
      // Move button
      $table = $prodSearch.find('> table:first-child');
      $swap = $prodSearch.find('#dnn_ctr438_PerformanceCalendar_trProdSearch3');
      $swap.appendTo($table);

      // Move back button
      $swap = $prodSearch.find('#dnn_ctr438_PerformanceCalendar_cmdSearchGoBack').parent().parent();
      $swap.prependTo($table);

      // Remove alignments
      $table = $($prodSearch.find('> table')[1]);
      $table.find('tr td').removeAttr('align');

      // Reformat dates and add column for time
      $table.find('tr:first-child td:first-child').text('Date');
      $table.find('tr:first-child td:first-child').after('<td>Time</td>');
      $table.find('tr').each(function(i) {
        var $this = $(this);
        var $fTD = $this.find('td:first-child');
        var m, $sTD;

        if (i > 0) {
          $sTD = $('<td>').insertAfter($fTD);
          m = moment($fTD.text());
          if (m.isValid()) {
            $fTD.html(m.format('ddd, MMM D, YYYY'));
            $sTD.html(m.format('LT'));
          }
        }
      });

      // Break up search lines
      $table.find('tr').each(function(i) {
        var $this = $(this);
        var $td;

        if (i > 0) {
          $td = $(this).find('td').last();
          $td.html($td.html().replace(/\sat\s/ig, ' <br> at '));
        }
      });
    }
  }

  $(document).ready(function() {
    _.delay(styleIvey, 250);
  });
});
