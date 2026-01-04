// ========================================================================= //
//   Table Example 1
// ========================================================================= //

// Start DataTable

let ex1 = jQuery('#example1').DataTable({});

// Delete Row Datatable

$('#example1 tbody').on('click', 'a.delet span', function() {
    ex1
        .row($(this).parents('tr'))
        .remove()
        .draw();
});


// ========================================================================= //
//   Table Example 2  (✅ FIXED FOR 8 COLUMNS)
// ========================================================================= //

if ($.fn.DataTable.isDataTable('#example2')) {
    $('#example2').DataTable().destroy();
}

let ex2 = jQuery('#example2').DataTable({
    responsive: true,
    autoWidth: false,
    pageLength: 10,
    ordering: true
});

// ✅ Delete Row
$('#example2 tbody').on('click', '.fa-trash', function () {
    ex2
        .row($(this).closest('tr'))
        .remove()
        .draw();
});


// ========================================================================= //
//   Table Example 3
// ========================================================================= //

// Billing List Table

var ex3 = jQuery('#example3').DataTable({
    dom: 'lrtip',
    "ordering": false,
    "bPaginate": true,
    "bInfo": true,
    "bSort": false,
    "lengthChange": false,

});

// Delete Row Datatable

$('#example3 tbody').on('click', '.delet', function() {
    ex3
        .row($(this).parents('tr'))
        .remove()
        .draw();
});

// Filter by Date inside datatable

var ex3 = $("#example3").DataTable();

minDateFilter = "";
maxDateFilter = "";

$("#daterange").daterangepicker();
$("#daterange").on("apply.daterangepicker", function(ev, picker) {
    minDateFilter = Date.parse(picker.startDate);
    maxDateFilter = Date.parse(picker.endDate);

    $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
        var date = Date.parse(data[1]);

        if (
            (isNaN(minDateFilter) && isNaN(maxDateFilter)) ||
            (isNaN(minDateFilter) && date <= maxDateFilter) ||
            (minDateFilter <= date && isNaN(maxDateFilter)) ||
            (minDateFilter <= date && date <= maxDateFilter)
        ) {
            return true;
        }
        return false;
    });
    ex3.draw();
});

// Select filter inside datatable

$('.table-filter-select').on('change', function() {
    ex3.search(this.value).draw();
});

// Form search inside table

$('#myInputTextField').keyup(function() {
    ex3.search($(this).val()).draw();
})