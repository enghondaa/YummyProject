export default class ApiHelper{
    constructor()
    {
    
    this.apiResponse()
    
    }
    apiResponse = async ()=> {
     let response =  await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
     let Meals = await response.json();
     return Meals;
    
    }
    apiCategory = async ()=> {

        let response =  await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        let Category = await response.json();
        return Category;
    }
    searchMealByName = async (name) => {
        const fetchMeals = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
        );
        const data = await fetchMeals.json();
        const { meals } = data;
        return meals;
    };

    listAllMealsByFirstLetter = async (letter) => {
        const fetchMeals = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
        );
        const data = await fetchMeals.json();

        const { meals } = data;
        return meals;
    };
    
    }
    
    