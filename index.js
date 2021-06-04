
const express = require('express');

const app = express();

app.post('/',express.json({type:'*/*'}), (req,res)=> {
  res.set({
    'Access-Control-Allow-Headers': 'accept',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST'
  })
  let a = getFinalAnswer(req.body)
  res.send(JSON.stringify(a))
});

function mapping(list){
  return list.map(function(el){
    return el.map(function(el2){
      return el2-0
    })
  })
}

function simplifier(list){
  for (let j = 0; j<list.length;j++){
    if (list[j][0] != 1){
      for (let i = 0; i<9999;i++){
        let number = (list[j][2]*i + list[j][1])/list[j][0]
        if (number % 1 == 0){
          list[j][0] = 1
          list[j][1] = number
          break
        }
      }
    }
  }
  return list
}

function multiply(list,index){
  let multiplySum = 1
  for (let i =0; i<list.length;i++){
    if (i != index){
      multiplySum *= list[i]
    }
  }
  return multiplySum
}

function getM(a){
  let result = []
  for (let i = 0; i<a.length;i++){
    result.push(multiply(a,i))
  }
  return result
}

function getModulo(a){
  let result = []
  for (let i =0; i<a.length;i++){
    result.push(a[i][2])
  }
  return result
}

function getConstant(a){
  let result = []
  for (let i =0; i<a.length;i++){
    result.push(a[i][1])
  }
  return result
}

function getY(listM,listModulo){
  let result = []
  for (let i =0; i<listM.length;i++){
    for (let j =0; j<9999;j++){
      if (j*listM[i] % listModulo[i] === 1){
        result.push(j)
        break
      }
    }
  }
  return result 
}

function getAnswer(listY,listM,listConstant,m){
  let result = 0
  for (let i =0; i<listY.length;i++){
    result += listY[i] * listM[i] * listConstant[i]
  }
  return result
}

function getm(listModulo){
  let result = 1
  for (let i =0; i<listModulo.length;i++){
    result *= listModulo[i]
  }
  return result
}

function getFinalAnswer(a){
  let result = []
  a = mapping(a)
  a = simplifier(a)
  listModulo = getModulo(a)
  listConstant = getConstant(a)
  listM = getM(listModulo)
  listY = getY(listM,listModulo)
  if (listY.length == 0){
    return result
  }
  let m = getm(listModulo)
  result.push(a)
  result.push(listM)
  result.push(listY)
  result.push(listModulo)
  result.push(listConstant)
  result.push(m)
  result.push(getAnswer(listY,listM,listConstant,m))
  console.log(result)
  return result
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on ${PORT}`));