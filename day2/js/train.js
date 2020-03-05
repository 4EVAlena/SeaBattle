const sum = {
    
    all: {
        a: 0,
        b: 0,
    },

    calculate() {
        const result = this.all.a + this.all.b;
        console.log(result);
    },

    set a(param) {
        if (typeof param !== 'number') {
            console.log("Мы принимаем только числа");            
        } else {
            this.all.a = param;
        }
        this.calculate();
    },

    set b(param) {
        this.all.b = param;
        this.calculate();
    },

    get a() {
        return 'Значение а: ' + this.all.a;
    },

    get result() {
        this.calculate();
        return this.all.result;
    }
};

sum.a = 3;
sum.b = 13;
sum.a = "Привет";

//-------------

let x = 0;
 // выражение x += 1 тоже самое что и ++x;

console.log(x++); // выдаст 0
// и только на следующей строке
console.log(x); // уже будет 1

// 