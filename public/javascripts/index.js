//declare reacting elements
let closeModal = document.getElementById('CLOSE-MODAL');
let modal = document.getElementById('MODAL');
let registerBtn = document.getElementById('REGISTER-BUTTON');

//when close icon in modal is clicked => close modal
$('#CLOSE-MODAL').on('click', function(){
    $('#MODAL').addClass('opacity-0');
    $('#MODAL').addClass('pointer-events-none');
});

//when book time btn is clicked => open modal
$('#BOOK-TIME-BUTTON').on('click', function(){
    $('#MODAL').removeClass('opacity-0');
    $('#MODAL').removeClass('pointer-events-none');
});

//on click register btn => redirect /register
$('#REGISTER-BUTTON').on('click', function(){
    window.location.href = "/register";
});