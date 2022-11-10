import ApiHelper from "./Api.js";
$(window).on('load', function () {
  $('.lds-ring').css('display', 'none')
  let apiHelper = new ApiHelper();
  let Meals = [];
  let detailsOf = [];
  let categoryTest = [];
  function toggleSidebar() {
    let sideBarBox = $("#sidebarLinks").innerWidth();
    $("#sidebar").css("left", `-${sideBarBox}px`);
    $("#toggleMenuIcon").click(() => {
      if ($("#sidebar").css("left") == "0px") {
        $("#sidebar").animate({ left: `-${sideBarBox}` }, 1000);
        $(".nav-item").slideUp(800);
        $("#toggleMenuIcon").addClass("fa-bars ");
        $("#toggleMenuIcon").removeClass("fa-xmark ");
      } else {
        $("#sidebar").animate({ left: "0px" }, 800);
        $(".nav-item").slideDown(1000);
        $("#toggleMenuIcon").addClass("fa-xmark ");
        $("#toggleMenuIcon").removeClass("fa-bars ");
      }
    });
  }
  toggleSidebar();

  async function api() {
    Meals = await apiHelper.apiResponse();
    Meals = await Meals.meals;
    displayMain(Meals)
  }
  api();
  const displayMain = async (Meals,element='#rowMain') => {
    let box = ``;
    for (let i = 0; i < Meals.length; i++) {
      box += `<div class="col-md-3">
  <div class="items  mealItems" id ='${Meals[i].idMeal}'>
      <img src='${Meals[i].strMealThumb}' alt="" class="w-100 rounded">
      <div class="overlay">
        <h3 class="ms-1">${Meals[i].strMeal}</h3>
      </div>
  </div>
</div> `;
    }
    $(element).html(box);
    $('.mealItems').click(function (e) {
      getDetails($(e.target).parents('.mealItems')[0].id)
        $('#mainMeals').fadeOut(1000, function () {
          $('#mainMealsDetails').fadeIn(1000);
        });
    })

  };
  const getDetails = async (id) => {
     detailsOf = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
     detailsOf = await detailsOf.json();
     detailsOf = detailsOf.meals[0];
    displayRecipe();
  };
  const displayRecipe = () => {
    let ingredients = [];
    let tags = [];
    if (detailsOf.strTags == null) {
      tags = [];} 
      else {
      tags = detailsOf.strTags.split(",");
            }

    tags = tags.map((tag) => { return `<span class="alert alert-warning py-1 me-2 d-inline-block">${tag}</span>`; }).join("");

    for (let i = 0; i < 20; i++) {
      if (detailsOf[`strIngredient${i}`] !== "") {
        ingredients.push(
          `${detailsOf[`strMeasure${i}`]} ${detailsOf[`strIngredient${i}`]}`
        );
      }
    }
    ingredients.shift();
    ingredients = ingredients.map((item) => { return `<span class="alert alert-success py-1 me-2 d-inline-block">${item}</span>`; }).join("");
    let detailsBox = `
  <div class="col-md-4">
      <div class="recipeImg ">
          <img src="${detailsOf.strMealThumb}" class="w-100 rounded" alt="">
       </div>
</div>
<div class="col-md-8">
  <div class="recipeDetails ">
      <h2>Instructions</h2>
      <p>${detailsOf.strInstructions}</p>
      <p><span class="fw-bolder">Area :</span> ${detailsOf.strArea}</p>
      <p><span class="fw-bolder">Category :</span> ${detailsOf.strCategory}</p>
      <h3>Recipes :</h3>
      ${ingredients}
      <h3>Tags :</h3>
      ${tags}
      <div class="meal-links mt-2 mb-5">
                <a href="${detailsOf.strSource}" class="btn btn-success">Source</a>
                <a href="${detailsOf.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>
  </div>
</div> `;
    $('#rowDetails').html(detailsBox)

  };
  const displayCategory = async () => {
    let category = await apiHelper.apiCategory();
    let categories = category.categories;
    let box = ``;
    for (let i = 0; i < categories.length; i++) {
      box += `<div class="col-md-3">
<div class="items" id ='itemsCategory'>
    <img src='${categories[i].strCategoryThumb}' alt="" class="w-100 rounded">
    <div class="overlay">
      <h3 class="ms-1">${categories[i].strCategory}</h3>
    </div>
</div>
</div> `;
    }
    $('#rowCategory').html(box);
    let overLay = Array.from(document.querySelectorAll("#itemsCategory"));
    for (let i = 0; i < overLay.length; i++) {
      overLay[i].addEventListener("click", () => {
        getCategoryDetails(categories[i].strCategory);
        $('#categoryMeals').fadeOut(1000);
        $('#cateDetails').fadeIn(1000);
      });
    }
  };

  const getCategoryDetails = async (Name) => {
    let detailsOf = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${Name}`);
    categoryTest = await detailsOf.json();
    categoryTest = await categoryTest.meals;
    displayMain(categoryTest)
    $('#mainMeals').fadeIn(1000)
  };

  $('a[href^="#"]').click(function (e) {
    const linkHref = $(e.target).attr('href');
    const currentSection = `#${$(linkHref)[0].id}`;
    const allSections = $('section[id]');
    changeSectionAnimation(allSections, currentSection, true);

    switch (currentSection) {
      case '#search':
        getSearchMeals();
        break;
      case '#categories':
        displayCategory();
        break;

      case '#area':
        apiArea();
        break;

      case '#ingredients':
        apiIngrediant();
        break;
      case '#contactUs':
        validation();
        break;
    }

  });
  function changeSectionAnimation(currentSection, goingTo, section = false) {
    if (section == true) {
      $(currentSection).fadeOut(1000);
      $(goingTo).fadeIn(2000);
      return;
    }
    $(currentSection).fadeOut(1000, function () {
      $(goingTo).fadeIn(2000);
    });
  }
  $("#categories").click(function () {
    $("#mainMeals").fadeOut(1000);
    $("#categoryMeals").fadeIn(1000);
    console.log('hello');
  });

  //************************ Area **********************************/
  const apiArea = async () => {
    let Area = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
    Area = await Area.json();
    Area = Area.meals
    displayArea(Area)
  }
  function displayArea(Area) {
    let box = ``;
    for (let i = 0; i < Area.length; i++) {
      box += `
    <div class="col-md-3">
    <div class="area-items text-danger text-center" id='${Area[i].strArea}'>
        <i class="fa-solid fa-city fa-3x"> </i>
        <h2 class="text-black">${Area[i].strArea}</h2>
    </div>
      </div>

    `
    }
    $('#rowArea').html(box)
    $('.area-items').click(function (e) {
      getAreaByName($(e.target).parents('.area-items')[0].id)
    })
  }
  async function getAreaByName(Name) {
    let areaName = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${Name}`)
    areaName = await areaName.json();
    areaName = areaName.meals;
    displayMain(areaName)
    $('#mainMeals').fadeIn(1000);
    $('#area').fadeOut(1000);
  }
  // *****************************************Ingredians***************************************************

  const apiIngrediant = async () => {
    let Ingrediant = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
    Ingrediant = await Ingrediant.json();
    Ingrediant = Ingrediant.meals
    displayIngrediant(Ingrediant);
  }
  function displayIngrediant(Ingrediant) {
    let box = ``;
    for (let i = 0; i < 20; i++) {
      box += `
    <div class="col-md-3">
      <div class="ingrediant-items" id='${Ingrediant[i].strIngredient}'>
          <i class="fa-solid fa-bowl-food fa-3x"></i>
          <h2 class="text-black">${Ingrediant[i].strIngredient}</h2>
          <p class="text-black">${Ingrediant[i].strDescription.split(' ').slice(0, 20).join(' ')}</p>
      </div>
    </div>
    `
    }
    $('#rowIngrediant').html(box);
    $('.ingrediant-items').click(function (e) {
      getIngrediantByName($(e.target).parents('.ingrediant-items')[0].id)

    })
    async function getIngrediantByName(Name) {
      let ingrediantName = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${Name}`)
      ingrediantName = await ingrediantName.json();
      ingrediantName = ingrediantName.meals;
      displayMain(ingrediantName)
      $('#mainMeals').fadeIn(1000);
      $('#ingredients').fadeOut(1000);
    }
  }
// ***************************************************************************************************
   const searchByName = async (Name,)=> {
    let searchbyname =  await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${Name}`)
        searchbyname = await searchbyname.json();
        searchbyname = searchbyname.meals;
        displayMain(searchbyname,'#searchDisplay');
   }

  // ************************************************************************************************ */
  const searchByletter = async (letter)=> {
    let searchbyletter =  await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        searchbyletter = await searchbyletter.json();
        searchbyletter = searchbyletter.meals;
        console.log(searchbyletter);
        displayMain(searchbyletter,'#searchDisplay');
   }
  //  *************************************************************************************************

function getSearchMeals() {
  $('#searchName').on('input',function(){searchByName($('#searchName').val());})

  $('#searchLetter').on('input',function(){searchByletter($('#searchLetter').val());})}


  // ******************************************************************************************************

  let nameInput = document.getElementById('nameInput');
  let emailInput = document.getElementById('emailInput');
  let phoneInput = document.getElementById('phoneInput');
  let ageInput = document.getElementById('ageInput');
  let passwordInput = document.getElementById('passwordInput');
  let passwordConfInput = document.getElementById('passwordConfInput');
  // **********************************************************
  let namealert = document.getElementById('namealert');
  let emailalert = document.getElementById('emailalert');
  let phonealert = document.getElementById('phonealert');
  let agealert = document.getElementById('agealert');
  let passwordalret = document.getElementById('passwordalret');
  let confirmalert = document.getElementById('confirmalert');
  //******************************************************** */
  let sub = document.getElementById('submit');
  // *******************************************************************************
  nameInput.addEventListener("focus", () => {
      nameTyping = true
  })
  emailInput.addEventListener("focus", () => {
      emailTyping = true
  })
  phoneInput.addEventListener("focus", () => {
      phoneTyping = true
  })
  ageInput.addEventListener("focus", () => {
      ageTyping = true
  })
  passwordInput.addEventListener("focus", () => {
      passwordTyping = true
  })
  passwordConfInput.addEventListener("focus", () => {
      pwConfTyping = true
  })
  
  // *******************************************************************************
  let nameTyping = false, emailTyping = false, phoneTyping = false, ageTyping = false, passwordTyping = false, pwConfTyping = false;
  // ********************************************************************************
  function validation() {
      if (nameTyping) {
          if (validateName()) {
              namealert.classList.add('d-none')
              nameInput.classList.add('is-valid')
              nameInput.classList.remove('is-invalid')
          }
          else {
              namealert.classList.remove('d-none')
              nameInput.classList.replace('is-valid', 'is-invalid')
          }
      }
      if (emailTyping) {
          if (validEmail()) {
              emailalert.classList.add('d-none')
              emailInput.classList.add('is-valid')
              emailInput.classList.remove('is-invalid')
          }
          else {
              emailalert.classList.remove('d-none')
              emailInput.classList.replace('is-valid', 'is-invalid')
          }
  
      }
      if(phoneTyping){
          if(validPhone()){
              phonealert.classList.add('d-none')
              phoneInput.classList.add('is-valid')
              phoneInput.classList.remove('is-invalid')
          }
          else {
              phonealert.classList.remove('d-none')
              phoneInput.classList.replace('is-valid', 'is-invalid')
  
          }
  
      }
      if(ageTyping) {
          if(validAge()){
              agealert.classList.add('d-none')
              ageInput.classList.add('is-valid')
              ageInput.classList.remove('is-invalid')
          }
          else {
              agealert.classList.remove('d-none')
              ageInput.classList.replace('is-valid', 'is-invalid')
          }
      }
      if(passwordTyping) {
          if(passwordValid()) {
              passwordalret.classList.add('d-none')
              passwordInput.classList.add('is-valid')
              passwordInput.classList.remove('is-invalid')
          }
          else {
              passwordalret.classList.remove('d-none')
              passwordInput.classList.replace('is-valid', 'is-invalid')
          }
      }
      if(pwConfTyping) {
          if(conPassword()){
              confirmalert.classList.add('d-none')
              passwordConfInput.classList.add('is-valid')
              passwordConfInput.classList.remove('is-invalid')
          }
          else {
              confirmalert.classList.remove('d-none')
              passwordConfInput.classList.replace('is-valid', 'is-invalid')
          }
      }           
  
  
      function validateName() {
          return /^[a-zA-Z ]+$/.test(nameInput.value);
      }
      function validEmail() {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.value);
      }
      function validPhone() {
          return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phoneInput.value);
      }
      function validAge() {
          return /^[1-9][0-9]?$|^100$/.test(ageInput.value);
      }
      function passwordValid() {
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(passwordInput.value);
      }
      function conPassword() {
           return passwordInput.value == passwordConfInput.value
      }
  
      if (validateName() && validEmail() && validPhone() && validAge() && passwordValid() && conPassword()) {
          sub.removeAttribute('disabled')
      }
      else {
          sub.setAttribute('disabled', 'true')
      }
  }
  
  $('#submit').click(function(){
      let box =`welcome ${nameInput.value}
      We will Contact you on ${emailInput.value}`;
      $('#messageSent').fadeIn(1000)
      $('#messageSent').text(box)
  })
  
  
$('#nameInput').keyup(function(){
  validation()
})
$('#emailInput').keyup(function(){
  validation()
})
$('#phoneInput').keyup(function(){
  validation()
})
$('#ageInput').keyup(function(){
  validation()
})
$('#passwordInput').keyup(function(){
  validation()
})
$('#passwordConfInput').keyup(function(){
  validation()
})


});