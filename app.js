const express=require('express')
const app=express()
const path=require('path')
const ejsMate=require('ejs-mate')
require('dotenv').config()
const axios=require('axios')
const PORT=process.env.PORT ||3000
const API_ID = process.env.API_ID;
const API_KEY = process.env.API_KEY;

app.set('view engine', 'ejs')
app.engine('ejs',ejsMate)
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))


const searchRecipes=async(food)=>{
    try{  
        const response=await axios.get('https://api.edamam.com/api/recipes/v2',{
            params: {
              type:'public',
              q:food,
              app_id: API_ID,
              app_key: API_KEY,
              
            }
          })
        return response.data
    }catch(e){
        console.log(e)
    }
}


const searchRecipe=async(id)=>{
    try{
        const response=await axios.get(`https://api.edamam.com/api/recipes/v2/${id}`,{
            params: {
              type:'public',
              app_id: API_ID,
              app_key: API_KEY,
              
            }
          })
        return response.data
    }catch(e){
        console.log(e)
    }
}

app.get('/',(req,res)=>{
  
    res.render('home')
})



app.post('/recipes',async(req,res,next)=>{
    try{
    const {recipe,min_protein,max_protein,min_calories,max_calories,min_carbs,max_carbs,min_fat,max_fat}=req.body
    const recipes=await searchRecipes(recipe)
 

    const caloriesAndMacros={
        min_calories,
        min_protein,
        min_carbs,
        min_fat,
        max_calories,
        max_protein,
        max_carbs,
        max_fat
    }
    for (const key in caloriesAndMacros) {
        if (key.startsWith("min_") && caloriesAndMacros[key] === "") {
          caloriesAndMacros[key] = 0;
        } else if (key.startsWith("max_") && caloriesAndMacros[key] === "") {
          caloriesAndMacros[key] = 10000;
        }
      }

    const filteredRecipes=recipes.hits.filter((dishes)=>
    ((dishes.recipe.totalNutrients.PROCNT.quantity/dishes.recipe.yield)>caloriesAndMacros.min_protein&&
    (dishes.recipe.totalNutrients.PROCNT.quantity/dishes.recipe.yield)<caloriesAndMacros.max_protein)&&
    
    ((dishes.recipe.calories/dishes.recipe.yield)>caloriesAndMacros.min_calories&&
    (dishes.recipe.calories/dishes.recipe.yield)<caloriesAndMacros.max_calories)&&

    ((dishes.recipe.totalNutrients.CHOCDF.quantity/dishes.recipe.yield)>caloriesAndMacros.min_carbs&&
    (dishes.recipe.totalNutrients.CHOCDF.quantity/dishes.recipe.yield)<caloriesAndMacros.max_carbs)&&

    ((dishes.recipe.totalNutrients.FAT.quantity/dishes.recipe.yield)>caloriesAndMacros.min_fat&&
    (dishes.recipe.totalNutrients.FAT.quantity/dishes.recipe.yield)<caloriesAndMacros.max_fat))

   


    let recipeArray=[]
  
    for(dishes of filteredRecipes){
        recipeArray.push(dishes.recipe)
    }
    
    res.render('recipes.ejs',{recipeArray,recipe})
}catch(e){
    next(e)
}


})

app.get('/recipe/:id',async(req,res,next)=>{
    try{
    const {id}=req.params
    const recipe=await searchRecipe(id)

    res.render('showRecipe',{recipe})
    }catch(e){
        next(e)
    }
})



app.use((err,req,res,next)=>{
    if(err.name==='TypeError'){
        res.render('404')
    }
    
})

app.get('*',(req,res)=>{
    res.render('404')
})


app.listen(PORT,()=>{
    console.log(`Listenin on port ${PORT}`)
})