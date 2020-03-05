const record = document.getElementById('record'),
      shot = document.getElementById('shot'),
      hit = document.getElementById('hit'),
      dead = document.getElementById('dead'),
      enemy = document.getElementById('enemy'), // id таблицы     
      again = document.getElementById('again');
      header = document.querySelector('.header');

const game = {
    // литерал массива это квадратные скобки
    // корабли лучше записывать в массивы, что у нас были их координаты и индикаторы попадания в них
    ships: [
        {
            location: ['26', '36', '46', '56'], // корабль по вертикали
            hit: ['', '', '', ''] // когда мы fire по кораблю, 
            // мы проставляем крестики в '' из метода fire()  ship.hit[index] = 'x';
        },
        {   // так как все идентификаторы (idишники) строки (<td id="95"></td>), 
        //  то и в массив мы записываем строками - не нужно будет конвертировать в другие типы данных
            location: ['11', '12', '13'], // корабль по горизонтали, трехпалубный
            hit: ['', '', '']
        },
        {
            location: ['69', '79'], // корабль по вертикали
            hit: ['', '']
        },
        {
            location: ['32'], // корабль по вертикали
            hit: ['']
        }
    ],

};      

const play = {
    record: localStorage.getItem('seaBattleRecord') || 0, // логический оператор || работает слева направо и если первый аргумент до оператора false, то идет дальше проверять
    shot: 0,
    hit: 0,
    dead: 0,
    set updateData(data) {
        this[data] += 1;
        this.render();
    },
    render() { // этот метод обновляет на странице данные 
        record.textContent = this.record;
        shot.textContent = this.shot;
        hit.textContent = this.hit;
        dead.textContent = this.dead;
    }
};
// наш самописный объект show() будет содержать несколько методов
// после события клик будет происходить соответсвующее другое событие - попадание, непопадание, потопление коробля (добили)
// эти события мы будем отображать через смену класса в методе changeClass()

const show = {
    hit(elem) { // попадание
        this.changeClass(elem, 'hit'); // класс 'hit' будет отображаться, если попадаем
    },
    // промазали
    miss(elem) { // this - это объект show
        this.changeClass(elem, "miss"); // на элементы кликнутые добавляется крестик

    },

    dead(elem) { // убили корабль
        this.changeClass(elem, 'dead');
    },
    // метод смены класса будет принимать 2 параметра - тот элемент, на котором произошло событие
    // и класс, который нужно присвоить этому элементу
    // так как слово class зарезервировано, то используем например value
    changeClass(elem, value) {
        elem.className = value; // у каждого элемента есть свойство className, которое содержит список всех классов
        // которые есть у элемента. Если их нет, то это свойство будет просто пустое.
    }
};

// когда происходит событие клик (в методе init), создается объект события
// объект содержит все данные события - координаты клика, конкретную ячейку, 
// по которой был клик - таргет
const fire = (event) => {
    const target = event.target;
    console.log(event.target); // например <td id="22"></td>
    // у каждого элемента есть свойство classList, если элементу уже присвоен класс
    // то делаем ретерн, а также у каждого элемента есть свойство tagName
    // если при клике мы кликаем не на ячейку, то тоже ретерн
    if (target.classList.length !== 0 || target.tagName !== 'TD') return;
    show.miss(target);
    //------эти команды перенесли в метод updateData() 
    // play.shot = play.shot + 1; // так две операции 0+1 и присваивание
    // play.shot += 1; // так одна операция, так как оператор += есть в движке js
    // play.render();
    //----------конец переноса--------------
    play.updateData = 'shot'; // shot - выстрел/свойство из объекта play
    // с помощью цикла будем проверять координаты выстрелов/кликов
    // и есть ли такие координаты среди кораблей
    for (let i=0; i < game.ships.length; i++) {
        const ship = game.ships[i];
        const index = ship.location.indexOf(target.id); // id будут браться из верстки <td id="95"></td>
        // если id найдено не будет, то indexOf вернет -1
        // на основе этого мы можем проверять, если id будет больше или равен 0, то мы попали
        if (index >= 0) {
            show.hit(target);
            play.updateData = 'hit'; // запишем в ПОПАДАНИЙ одно попадание
            ship.hit[index] = 'x'; // вместо 'x' можно любой другой char внести, лишь бы строка пустой не оставалась в hit
            // если остаются пустые строки, то корабль полностью не потоплен и наоборот
            const life = ship.hit.indexOf('');
            if (life < 0) { // если пустых ячеек не осталось
                play.updateData = 'dead'; // присваиваем класс dead
                // show.dead(target);  так знак/класс dead появится только у одной клетки - у последней на которую нажали
                for (const id of ship.location) { //и для каждого id в таком ship.location 
                    show.dead(document.getElementById(id)); // будет присваиваться класс dead                 
                } 
                game.shipCount -= 1;

                if (game.shipCount < 1) {
                    header.textContent = 'Игра окончена!';
                    header.style.color = 'red';

                    if(play.shot < play.record || play.record === 0) {

                    localStorage.setItem('seaBattleRecord', play.shot); // в объекте play есть ключи-свойства  record: 0, shot: 0, hit: 0, dead
                    // в скобках мы первым параметром прописываем строку - это ключ, по которому мы будем получать данные
                    play.record = play.shot;
                    play.render();
                    }
                }

            }

        }
    }
};    
// function expression - можно вызывать только после объявления
// называется индентификатор (init), и далее присваивается безымянная функция
const init = () => {
    enemy.addEventListener('click', fire); // после события, наша программа должна как-то реагировать
    play.render();

    again.addEventListener('click', () => {
        location.reload(); // обращаемся к объекту location - он есть в любом браузере, и методу reload(), он перезапускает страницу
    })
};  // поэтому мы создаем объект на отображение нашей реакции
// так как это объект, то назовем его show()

// function expression можно и так написать,
// но вызов через go будет не доступным, через go сможем использовать для рекурсии и дебагинга
// const init = function go() {
//     enemy.addEventListener('click', fire); 
// };

init();

//-----------------------------------
// function declaration можно вызывать до объявления, такие функции всплывают
// интерпретатор js проходит код 2 раза: сначала читает всю программу,
// со второго раза только выполняет ее
// у функции такого вида уже являются прочитанными и содержаться в памяти
// со стороны кажется что это хорошо, что можно хоть где объявить такую функцию и хоть где вызывать,
// не переживая, что такая функция еще не была написана
// stop(); 

// function stop() {
//     console.log("stop");
// }

// ECMA2015 ИЛИ ES6