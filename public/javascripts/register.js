//delimeters for clndr.js
_.templateSettings = {
    escape: /\{\{\-(.+?)\}\}/g,
    evaluate: /\{\%(.+?)\%\}/g,
    interpolate: /\{\{(.+?)\}\}/g,
};

//values to be sent on submission
var dateSubmission, timeSubmission, timeIndexSubmission;

//the number of companions left
let numberOfCompanions = 0;

//this is the calendar
$('.calendar-cont').clndr({
    template: $('#calendar-template').html(),
    clickEvents:{
        click: function(target){
            if(!Array.from(target.element.classList).includes('select-day')){

                let date = target.date._d.getTime();

                $.get(`/available/${date}`, function(data){
                    $('.time-slot').each(function(index){
                        if(data[`${index}`] > 0) {
                            //make slots available if there are spots left
                            $(this).removeClass('disabled-time').removeAttr('disabled');
                            
                            //configure number of companions per slot
                            $(this).attr('data-companions', data[`${index}`] - 1);
                        }

                    });
                });              

                dateSubmission = date; //if slots are available

                //add circular indicator
                $('.day-inner').removeClass('select-day'); //remove from others
                target.element.firstElementChild.classList.toggle('select-day'); //add to target
                
                //change selected date like state change
                $('#selected-date').text(moment(target.date._d).format('MMMM DD'));
                $('#time-slots').removeClass('hidden'); //show slots


                //scroll to view
                let timeSlots = document.getElementById('time-slots');
                timeSlots.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
            }
        }
    }
});

//this are the timeslots
$('.time-slot').each(function(){
    $(this).on('click', function() {

        //add indicator to selected time slot
        $('.time-slot').removeClass('bg-hope text-white').addClass('bg-white text-hope');
        $(this).removeClass('bg-white text-hope').addClass('bg-hope text-white');

        //assign value for submission
        timeSubmission = $(this).attr('data-value');
        timeIndexSubmission = $(this).attr('data-index');

        //assign value for number of companions available (if user choose to include)
        numberOfCompanions = $(this).attr('data-companions');

        $('select').empty(); //clear options first

        //set value of companions applicable
        for(let i = 1; i <= numberOfCompanions; i ++){
            $('select').append(`<option>${i}</option>`);
        }

        //show primary contact form
        $('#primary-contact').removeClass('hidden');
        $('#buttons-cont').removeClass('hidden');

        updateCompanions();

        let primaryContact = document.getElementById('primary-contact');
        primaryContact.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
    });
});

$('form').submit(function(event){
    event.preventDefault();
    let submission = {};

    let formData = $('form').serializeArray();

    //config primary contact info
    for(let i = 0; i < 4; i++){
        submission[formData[i].name] = formData[i].value;
    }

    //config for companion data
    let companions = [];

    let companionFirstNames = formData.filter(data => data.name === "companion-first-name[]");
    let companionLastNames = formData.filter(data => data.name === "companion-last-name[]");

    let companion = {
        firstName: companionFirstNames[0].value,
        lastName: companionLastNames[0].value
    }

    companions.push(companion);

    submission = {...submission, date: dateSubmission, time: timeSubmission, timeIndex: timeIndexSubmission, companions: companions};

    $.post("/register", {data: JSON.stringify(submission)});
});

//on user selecting 'not alone' checkbox
$('#companions').change(function(){
    
    //if customer is not alone
    if($('#companions').prop('checked')){

        //append companion form 
        $('#companion-form').empty();
        $('#companion-form').append(
            `
            <div class="w-full flex">
                <div class="w-1/2 px-3">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="companion-first-name">
                    COMPANION #1
                  </label>
                  <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="companion-1-first-name" type="text" placeholder="Enter First Name" name="companion-first-name[]">
                </div>
                <div class="w-1/2 px-3">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="companion-last-name">
                    &nbsp;
                  </label>
                  <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="companion-1-last-name" type="text" placeholder="Enter Last Name" name="companion-last-name[]">
                </div>
              </div>
            `
        );

        //show companions info form
        $('#companion-records').removeClass('hidden');

        let companionRecords = document.getElementById('companion-records');
        companionRecords.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});


    } else{
        $('#companion-records').addClass('hidden');
    }
});

$('select').on('change', function(){
    updateCompanions(); 
    let companionRecords = document.getElementById('companion-records');
    companionRecords.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
});

const updateCompanions = () => {
    $('#companion-form').empty(); //clear companion forms first

    let pop = $('select').val(); //pop => population (how many companions)
    for(let i = 1; i <= pop; i++){
        $('#companion-form').append(
            `
            <div class="w-full flex">
                <div class="w-1/2 px-3">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    COMPANION #${i}
                  </label>
                  <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Enter First Name" name="companion-first-name[]">
                </div>
                <div class="w-1/2 px-3">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    &nbsp;
                  </label>
                  <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Enter Last Name" name="companion-last-name[]">
                </div>
              </div>
              <br>
            `
        );
    }
}