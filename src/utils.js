export function changeUnit(arg,arg2){
    var num1 = Number(arg)
    var num2 = Number(arg2)
    var unit = "B"
    var rate = 1
    const num = (num2 && num2 > num1)? num2 : num1
    if(num < 1 << 10){//小于G
        //B
    }else if(num < 1 << 20){//小于M
        [rate, unit] = [1<<10,"KB"]
    }else if(num < 1 << 30){//小于G
        [rate, unit] = [1<<20,"M"]
    }else{
        [rate, unit] = [1<<30,"G"]
    }
    const show = (a) => `${(a/rate).toFixed(1)}${unit}`
    return arg2? [show(num1),show(num2)]: show(num)
}

