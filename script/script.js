'use strict';

//получим кнопку "Ваш город"
const headerCityButton = document.querySelector('.header__city-button');


//определим хэш для всех страниц
let hash = location.hash.substring(1);



const updateLocation = () => {
    headerCityButton.textContent = localStorage.getItem('lomoda-location') ||
        "Ваш город";
}

//выведед город из локал сторэдж
// if (localStorage.getItem('lomoda-location')) {
//     headerCityButton.textContent = localStorage.getItem('lomoda-location');
// }



//обработчики событий
headerCityButton.addEventListener('click', () => {
    const city = prompt('Укажите ваш город').trim();
    if (city !== null) {
        localStorage.setItem('lomoda-location', city);
    }
    updateLocation();
});

updateLocation();


//блокировка скролла


const disableScroll = () => {

if (document.disableScroll) return;

    const widthScroll = window.innerWidth - document.body.offsetWidth;

    document.disableScroll = true;
    document.body.bdScrollY = window.scrollY; // сколько px отмотали от верха
    document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;  
    padding-right: ${widthScroll}px;
    `;
};

const enableScroll = () => {
    document.disableScroll = false;
    document.body.style.cssText = '';
    window.scroll({
        // top: '200'  // для примера. при закрытии корзины скролл на 200px
        top: document.body.bdScrollY //если был скролл до того, как нажали на корзину, он останется (иначе перескочит)
    });
};


//модальное окно

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const cartModalOpen = () => {
    cartOverlay.classList.add('cart-overlay-open');
    disableScroll();
};

const cartModalClose = () => {
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
};




//запрос базы данных

const getData = async () => {
    const data = await fetch('db.json');

    // console.log(data);
    if (data.ok) {
        return data.json();
    } else {
        throw new Error(`Данные не были получены, ошибка ${data.status} ${data.statusText}`);
    }
};



const getGoods = (callback, value) => {
    getData()
        .then(data => {
            if (value) {
                callback(data.filter(item => item.category == value))
            } else {
                callback(data);
            }

        })
        .catch(err => {
            callback(err);
        });
};

// getGoods((data) => {
//     console.warn(data);
// });




//добавляем новый класс по клику - открытие модального окна
subheaderCart.addEventListener('click', cartModalOpen);

cartOverlay.addEventListener('click', event => {
    const target = event.target;

    //закрываем окно по крестику или кликнуть мимо модального окна
    // if(target.classList.contains('cart__btn-close') || target.classList.contains('cart-overlay')) {
    //     cartModalClose();
    // }

    //второй способ -matces
    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
        cartModalClose();
    }
});


//Вывод товаров на страницу
//Пишем скрипт , чтобы он работал только на странице goods

try {


    const goodsList = document.querySelector('.goods__list');
    if (!goodsList) {
        throw 'This is not a goods page';
    }

    const createCard = ({
        id,
        preview,
        cost,
        brand,
        name,
        sizes
    }) => {

        // const { id, preview, cost, brand, name, sizes} = data;

        // const id = data.id;
        // const preview = data.preview;
        // const cost = data.cost;
        // const brand = data.brand;
        // const name = data.name;
        // const sizes = data.sizes;


        const li = document.createElement('li');

        li.classList.add('goods__item');
        li.innerHTML = `
        <article class="good">
                            <a class="good__link-img" href="card-good.html#${id}">
                                <img class="good__img" src="goods-image/${preview}" alt="">
                            </a>
                            <div class="good__description">
                                <p class="good__price">${cost} &#8381;</p>
                                <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                                ${sizes ? 
                                `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` : 
                                '' }                                    
                                <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                            </div>
                        </article>
        `;

        return li;
    };

    const renderGoodsList = data => {
        goodsList.textContent = '';

        // for (let i = 0; i < data.length; i++) {
        //    console.log('for:', data[i]);            
        // }

        // for (const item of data) {
        //     console.log('for of', item);
        // }

        data.forEach(item => {
            const card = createCard(item);
            goodsList.append(card);
        })
    };

    window.addEventListener('hashchange', () => {
        hash = location.hash.substring(1);
        getGoods(renderGoodsList, hash);


        const goodsTitle = document.querySelector('.goods__title');

        switch (hash) {
            case 'men':
                goodsTitle.textContent = 'Мужчинам';
                break;
            case 'women':
                goodsTitle.textContent = 'Женщинам';
                break;
            case 'kids':
                goodsTitle.textContent = 'Детям';
                break;
        }

    })

    getGoods(renderGoodsList, hash);





} catch (error) {
    console.warn(error);
}

