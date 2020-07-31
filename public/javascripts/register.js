_.templateSettings = {
    escape: /\{\{\-(.+?)\}\}/g,
    evaluate: /\{\%(.+?)\%\}/g,
    interpolate: /\{\{(.+?)\}\}/g,
};

$('.calendar-cont').clndr({
    template: $('#calendar-template').html(),
    clickEvents:{
        click: function(target){
            if(!Array.from(target.element.classList).includes('select-day')){

                //add circular indicator
                $('.day-inner').removeClass('select-day'); //remove from others
                target.element.firstElementChild.classList.toggle('select-day'); //add to target
                
                //change selected date like state change
                $('#selected-date').text(moment(target.date._d).format('MMMM DD'));
                $('#time-slots').removeClass('hidden'); //show slots
            }
        }
    }
});