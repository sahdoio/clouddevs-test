const axios = require('axios')

axios.get('https://coderbyte.com/api/challenges/json/age-counting').then((resp) => {  
  const data = resp.data.data
  const splittedData = data.split(',')
  let resultList = []
  
  for (let index = 0; index < splittedData.length; index++) {
    if ((index + 1)% 2 == 0) {
      var age = splittedData[index].split('=')[1]
      resultList.push({
        key: splittedData[index - 1],
        age
      })
    }
  }  

  let count = 0;

  for (let index = 0; index < resultList.length; index++) {
    var age = resultList[index].age
    if (age >= 50) {
      count++
    }
  }

  console.log(count)
});