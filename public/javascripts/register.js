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

                //reset companion records
                $('#companions').prop('checked', false);
                $('#companion-form').empty();
                $('#companion-records').addClass('hidden');

                let date = target.date._d.getTime();

                $.get(`/available/${date}`, function(data){
                    $('.time-slot').each(function(index){
                        if(data[`${index}`] > 0) {
                            //make slots available if there are spots left
                            $(this).removeClass('disabled-time').removeAttr('disabled');
                            
                            //configure number of companions per slot
                            $(this).attr('data-companions', data[`${index}`] - 1);
                        
                        } else{
                            $(this).addClass('disabled-time');
                        }
                    });
                }).done(function(){

                    //reset on time slot value on new date
                    $('.time-slot').removeClass('bg-hope text-white').addClass('bg-white text-hope');
                    timeSubmission = null;
                    timeIndexSubmission = null;

                    $('#primary-contact').addClass('hidden');
                    $('#buttons-cont').addClass('hidden');
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

    for(let i = 0; i < $('#companion-form > div').length; i++){
        let companion = {
            firstName: companionFirstNames[i].value,
            lastName: companionLastNames[i].value
        }

        if(companion.firstName !== "" || companion.lastName !== "") companions.push(companion);
    }
    
    submission = {...submission, date: dateSubmission, time: timeSubmission, timeIndex: timeIndexSubmission, companions: companions};

    let approved = true; //if all necessary data is added

    //check for empty inputs
    $('.primary-contact-input').each(function(index){

        if($(this).val() === ""){
            $(this).addClass('border-red-500');
            $('.empty-error').eq(index).removeClass('hidden');
            approved = false;

        } else{
            $(this).removeClass('border-red-500');
            $('.empty-error').eq(index).addClass('hidden');
        }
    });

    if(approved) {
        //show modal
        $('#MODAL').removeClass('hidden');
        $('#MODAL').removeClass('pointer-events-none');

        $.post("/register", {data: JSON.stringify(submission)}, 
        
        //on success
        function(data){
            let date = new Date(parseInt(data.slot.date));

            //if registation is successful
            $('#MODAL-CONTENT').empty();
            $('#MODAL-CONTENT').append(`
                <div class="text-center text-green-600 font-bold text-3xl mx-10">You are booked successfully for ${moment(date).format('LL')} <br> at ${data.slot.time}</div>
                <br>
                <div class="flex mx-10">
                <a class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-auto" href="/">
                    OKAY
                </a>
                </div>
            `);
        })
        
        //on fail
        .fail(function(data){

            $('#MODAL-CONTENT').empty();
            $('#MODAL-CONTENT').append(`
                <div class="text-center text-red-600 font-bold text-3xl mx-10">${data.responseJSON.msg}</div>
                <br>
                <div class="flex mx-10">
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto" id="GO-BACK">
                    GO BACK
                </button>
                </div>
            `);

            $('#GO-BACK').on('click', function(){
                //hide modal
                $('#MODAL').addClass('hidden');
                $('#MODAL').addClass('pointer-events-none');
            });
        });
    }
    
});

//on user selecting 'not alone' checkbox
$('#companions').change(function(){
    
    //if customer is not alone
    if($('#companions').prop('checked')){

        $('select').val(1);
        $('#companion-form').empty();

        //append companion form 
        $('#companion-form').append(
            `
            <div class="w-full sm:flex-row flex-col flex">
                <div class="w-full sm:w-1/2 px-3">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="companion-first-name">
                    COMPANION #1
                  </label>
                  <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="companion-1-first-name" type="text" placeholder="Enter First Name" name="companion-first-name[]">
                </div>
                <div class="w-full sm:w-1/2 px-3">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="companion-last-name">
                    &nbsp;
                  </label>
                  <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="companion-1-last-name" type="text" placeholder="Enter Last Name" name="companion-last-name[]">
                </div>
              </div>
            `
        );

        //show companions info form
        $('#companion-records').removeClass('hidden');

        let companionRecords = document.getElementById('companion-records');
        companionRecords.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});


    } else{
        $('#companion-form').empty();
        $('#companion-records').addClass('hidden');
    }
});

$('select').on('change', function(){
    let formData = $('form').serializeArray();

    let companionFirstNames = formData.filter(data => data.name === "companion-first-name[]");
    let companionLastNames = formData.filter(data => data.name === "companion-last-name[]");

    let companionData = [];
    for(let i = 0; i < $('select').val(); i ++){
        if(i < companionFirstNames.length){
            companionData.push({firstName: companionFirstNames[i].value, lastName: companionLastNames[i].value});
        } else{
            companionData.push({firstName: "", lastName: ""});
        }
    }

    updateCompanions(companionData); 
    let companionRecords = document.getElementById('companion-records');
    companionRecords.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
});

const updateCompanions = (arr) => {

    $('#companion-form').empty(); //clear companion forms first

    arr.forEach((slot, index) =>{
        $('#companion-form').append(
            `
            <div class="w-full sm:flex-row flex-col flex">
                <div class="w-full sm:w-1/2 px-3">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    COMPANION #${index + 1}
                  </label>
                  <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Enter First Name" name="companion-first-name[]" value="${slot.firstName}">
                </div>
                <div class="w-full sm:w-1/2 px-3">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    &nbsp;
                  </label>
                  <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Enter Last Name" name="companion-last-name[]" value="${slot.lastName}">
                </div>
              </div>
              <br>
            `
        );
    });
}

//on agree
$('#AGREE').on('change', function(){
    if($('#AGREE').prop('checked')){
        $('#SUBMIT-BTN').removeAttr('disabled');
        $('#SUBMIT-BTN').removeClass('disabled-time');
    } else{
        $('#SUBMIT-BTN').addClass('disabled-time');
        $('#SUBMIT-BTN').attr('disabled', true);
    }
});