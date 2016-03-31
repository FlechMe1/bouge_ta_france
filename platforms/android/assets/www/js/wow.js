function init_wow(){
  $('.wow').each(function(){
    console.log($(this));
    $(this).addClass('animated');
  })
}
