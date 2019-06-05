function generateRandomString() {
   var shortLength = 6;
   var randomNumb = 0;
   var result = "";
   for(var i = 0; i < shortLength; i++){
       if(randomNumb / 2 === 0){
        randomNumb =  Math.floor(Math.random() * 10)
           result += randomNumb
       } else { 
            console.log(String.fromCharCode(Math.floor(Math.random() * 10)))
        }

   }return result
}
console.log(generateRandomString())