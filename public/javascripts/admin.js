//configure dates
$('.dates').each(function(index){
    let date = new Date(parseInt($(this).text()));
    $(this).text( moment(date).format('LL') );
    $(this).removeClass("text-transparent");
});

//this are the timeslots
$('.time-slot').each(function(){
    $(this).on('click', function() {
        //add indicator to selected time slot
        $('.time-slot').removeClass('bg-hope text-white').addClass('bg-white text-hope');
        $(this).removeClass('bg-white text-hope').addClass('bg-hope text-white');
    });
});

var slotValue = {};

//on click of a slot open MODAL
$('.SLOT').each(function(index){
    $(this).on('click', function(){
        slotValue = $(this).data('value');

        //highlight selected time slots
        $('.time-slot').removeClass('bg-hope text-white').addClass('bg-white text-hope');
        $('.time-slot').eq(slotValue.timeIndex).removeClass('bg-white text-hope').addClass('bg-hope text-white');

        //set values of modal
        $('#first-name-modal').val(slotValue.firstName);
        $('#last-name-modal').val(slotValue.lastName);
        $('#phone-modal').val(slotValue.phoneNumber);
        $('#email-modal').val(slotValue.emailAddress);

        updateCompanions(slotValue.companions);
        deleteComp();
        
        //show modal
        $('#MODAL').removeClass('hidden');
        $('#MODAL').removeClass('pointer-events-none');
    }); 
});

//update companion records
const updateCompanions = (arr) => {
    $('#COMPANION-RECORDS').empty();

    arr.forEach((slot, index) => {
        $('#COMPANION-RECORDS').append(
            `
                <div class="mx-10 w-auto flex flex-col companion-record">
                    <div class="w-auto flex">
                        <div class="w-1/2 px-3">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="companion-first-name">
                            COMPANION #${index+1}
                            </label>
                            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="companion-${index+1}-first-name" type="text" placeholder="Enter First Name" name="companion-first-name[]" value="${slot.firstName}">
                        </div>
                        <div class="w-1/2 px-3">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="companion-last-name">
                            &nbsp;
                            </label>
                            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="companion-${index+1}-last-name" type="text" placeholder="Enter Last Name" name="companion-last-name[]" value="${slot.lastName}">
                        </div>
                    </div>
                    
                    <button class="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded ml-auto mr-3 my-3 delete-comp">
                        DELETE
                    </button>
                </div>
            `
        )
    });
};

$('#ADD-COMP').on('click', function(){
    let index = slotValue.companions.length + 1;
    $('#COMPANION-RECORDS').append(
        `
            <div class="mx-10 w-auto flex flex-col companion-record">
                <div class="w-auto flex">
                    <div class="w-1/2 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="companion-first-name">
                        COMPANION #${index}
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="companion-${index}-first-name" type="text" placeholder="Enter First Name" name="companion-first-name[]">
                    </div>
                    <div class="w-1/2 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="companion-last-name">
                        &nbsp;
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="companion-${index}-last-name" type="text" placeholder="Enter Last Name" name="companion-last-name[]">
                    </div>
                </div>
                
                <button class="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded ml-auto mr-3 my-3 delete-comp">
                    DELETE
                </button>
            </div>
        `
    );

    deleteComp();
});

const deleteComp = () =>{
    //delete comp
    $('.delete-comp').each(function(index){
        $(this).off();
        $(this).on('click', function(){
            //remove from data if possible
            let companions = slotValue.companions;
            let companionData = [];
            let formData = $('form').serializeArray();

            let companionFirstNames = formData.filter(data => data.name === "companion-first-name[]");
            let companionLastNames = formData.filter(data => data.name === "companion-last-name[]");

            for(let i = 0; i < $('.companion-record').length; i++){
                if(i < companions.length){
                    companionData.push({firstName: companions[i].firstName, lastName: companions[i].lastName});
                }

                else{
                    companionData.push({firstName: `${companionFirstNames[i].value}`, lastName: `${companionLastNames[i].value}`});
                }
            }
    
            companionData.splice(index, 1);
            companions.splice(index, 1);

            updateCompanions(companionData);
        });
    });
}

$('form').submit(function(event){
    event.preventDefault();
    let submission = {};
    let formData = $('form').serializeArray();

    //config primary contact info
    for(let i = 0; i < 4; i++){
        submission[formData[i].name] = formData[i].value;
    }

    let companions = [];

    let companionFirstNames = formData.filter(data => data.name === "companion-first-name[]");
    let companionLastNames = formData.filter(data => data.name === "companion-last-name[]");
    
    for(let i = 0; i < companionFirstNames.length; i++){
        if(!(companionFirstNames[i].value === "" && companionLastNames[i].value === "")){
            let companion = {
                firstName: companionFirstNames[i].value,
                lastName: companionLastNames[i].value
            }
            companions.push(companion);
        }
    }

    submission = {...submission, companions};

    //update api here
    $.post(`/admin/${slotValue._id}`, {data: JSON.stringify(submission)}, function(data){        
        if(data.success) window.location.href = '/admin';
    });
});

//close modal
$('#CLOSE-MODAL').on('click', function(){
    $('#MODAL').addClass('hidden');
    $('#MODAL').addClass('pointer-events-none');
});

$('#DELETE-BTN').on('click', function(){
    $.ajax({url: `/admin/${slotValue._id}`, method: "DELETE"}).then(function(data){
        if(data.success) window.location.href = "/admin";
    });
});

$('#CAL-REPORT').on('click', function(){
    $('#CAL-CONT').removeClass('hidden');
    $('#CAL-CONT').removeClass('pointer-events-none');
});

var urlParams = new URLSearchParams(window.location.search);

if(urlParams.has("date")){
    let date = new Date(parseInt(urlParams.get('date')));
    $('#DATE-LABEL').text(`Report as of ${moment(date).format('LL')}`);
    $('#DATE-LABEL').removeClass("text-transparent");

} else if(!urlParams.has("date")){
    $('#DATE-LABEL').text(`Today is ${moment().format('LL')}`);
    $('#DATE-LABEL').removeClass("text-transparent");
}
