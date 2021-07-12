'use strict';

//получим кнопку "Ваш город"
const headerCityButton = document.querySelector('.header__city-button');


//выведед город из локал сторедж
// if (localStorage.getItem('lomoda-location')) {
//     headerCityButton.textContent = localStorage.getItem('lomoda-location');
// }
//то же самое, но короче
headerCityButton.textContent = localStorage.getItem('lomoda-location') || "Ваш город";

//обработчики событий
headerCityButton.addEventListener('click', () => {
    const city = prompt('Укажите ваш город');
    headerCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
});


//модальное окно

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const cartModalOpen = ()=> {
    cartOverlay.classList.add('cart-overlay-open');
};

const cartModalClose = () => {
    cartOverlay.classList.remove('cart-overlay-open');
};

//добавляем новый класс по клику - открытие модального окна
subheaderCart.addEventListener('click', cartModalOpen);

cartOverlay.addEventListener('click', event => {
    const target = event.target;

    //закрываем окно по крестику или кликнуть мимо модального окна
    // if(target.classList.contains('cart__btn-close') || target.classList.contains('cart-overlay')) {
    //     cartModalClose();
    // }

    //второй способ -matces
    if(target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
        cartModalClose();
    }
});