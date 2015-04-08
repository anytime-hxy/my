$(function () {
	 $('.lego-map-style-box').click(function() {
        $('.lego-map-style-box').removeClass('selected');
        $(this).addClass('selected').find('input[type=radio]').attr('checked', true);
    });
});