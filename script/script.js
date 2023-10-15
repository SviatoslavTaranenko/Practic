const usdCurr = 28;
const discount = 0.9;

function convert(amount, curr) {
    return curr * amount;

}

function prmotion(result) {
    console.log(result * discount);
}

prmotion(convert(500, usdCurr));
