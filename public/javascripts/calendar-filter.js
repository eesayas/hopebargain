_.templateSettings = {
    escape: /\{\{\-(.+?)\}\}/g,
    evaluate: /\{\%(.+?)\%\}/g,
    interpolate: /\{\{(.+?)\}\}/g,
};

var dateValue;

$('.calendar-cont').clndr({
    template: $('#calendar-template').html(),
    clickEvents: {
        click: function(target){
            if(!Array.from(target.element.classList).includes('select-day')){

                dateValue = target.date._d.getTime();    
                
                //add circular indicator
                $('.day-inner').removeClass('select-day'); //remove from others
                target.element.firstElementChild.classList.toggle('select-day'); //add to target
            }
        }
    }
});

var urlParams = new URLSearchParams(window.location.search);

//if req query "date" exists
if(urlParams.get('date') && urlParams.get('date').length >= 13){
    let date = new Date(parseInt(urlParams.get('date')));
    let formatDate = `${date.getFullYear()}-${prependZero(date.getMonth() + 1)}-${prependZero(date.getDate())}`;
    
    //set default
    if(formatDate) $(`.calendar-day-${formatDate} > .day-inner`).addClass('select-day');

} else { //no query
    let date = new Date();
    let formatDate = `${date.getFullYear()}-${prependZero(date.getMonth() + 1)}-${prependZero(date.getDate())}`;

    if(formatDate) $(`.calendar-day-${formatDate} > .day-inner`).addClass('select-day');
}

//add zero to single digit for proper formatting
function prependZero(number) {
    if (number <= 9)
        return "0" + number;
    else
        return number;
}

//on click view report
$('#VIEW-REPORT').on('click', function(){
    if(dateValue){
        urlParams.set("date", dateValue);
        window.location.href =  "/admin?" + urlParams.toString();
    }
});

$('#CANCEL-REPORT').on('click', function(){
    $('#CAL-CONT').addClass('hidden');
    $('#CAL-CONT').addClass('pointer-events-none');
});