const getPets = async () => {
    try {
        let res = await fetch('../../data/pets.json');
        return res.json();
    } catch(err) {
        console.log('Error fetching data: ', err);
    } 
}

/**
 * Cards Display
 */

const displayCards = async () => {
    let pets = await getPets();
    let slider = [];

    let currentSlider = [];
    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        currentSlider.push(
            pets.find(pet => pet.name === card.children[1].innerText)
        );
    });
    
    while (slider.length < 3) {
        let random = Math.floor(Math.random() * pets.length);
        if (slider.indexOf(pets[random]) === -1 && currentSlider.indexOf(pets[random]) === -1) {
            slider.push(pets[random]);
        }
    }


    slider.forEach(pet => createCard(pet));
}

const createCard = (pet) => {
    const parent = document.querySelector('.cards');
    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    const p = document.createElement('p');
    const btn = document.createElement('button');

    img.setAttribute('src', pet.img);
    img.setAttribute('alt', `${pet.name} (${pet.type})`);
    p.innerText = pet.name;
    p.classList.add('card-title');
    btn.innerText = 'Learn more';
    btn.classList.add('button-secondary');

    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(btn);

    // POP-UP event listener
    card.addEventListener('click', showPopup);

    if (appendState === true) {
        parent.appendChild(card);
    } else {
        parent.prepend(card);
    }
}

displayCards();


/**
 * Carousel
 */

let appendState = true;

const carousel = document.querySelector('.cards');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

const swipeCards = (cssClass) => {
    // Disabling btns during animation
    leftBtn.disabled = true;
    rightBtn.disabled = true;

    // State to append or prepend
    cssClass === 'slide-left' ? appendState = false  : appendState = true;

    // Generate Cards
    displayCards();

    // Add Animation Class
    carousel.classList.add(cssClass);

    // Delete previous cards after delay
    setTimeout(deletePrevCards, 700)
}

const deletePrevCards = () => {
    let cards = document.querySelectorAll('.card');

    if (appendState === true) {
        cards[0].remove();
        cards[1].remove();
        cards[2].remove();
    } else {
        cards[3].remove();
        cards[4].remove();
        cards[5].remove();
    }

    carousel.classList.remove('slide-left');
    carousel.classList.remove('slide-right');

    leftBtn.disabled = false;
    rightBtn.disabled = false;
}

leftBtn.addEventListener('click', () => swipeCards('slide-left'));
rightBtn.addEventListener('click', () => swipeCards('slide-right'));


/**
 * POP-UP
 */

const showPopup = async (e) => {
    let pets = await getPets();
    let selectedPet = e.target.parentElement.children[1].innerText;

    let petData = pets.find(pet => pet.name === selectedPet);

    document.body.classList.add('scroll-off');
    generatePopup(petData);
}

const generatePopup = (pet) => {
    // Creation of elements
    const modal = document.createElement('div');
    const modalContent = document.createElement('div');
    const btn = document.createElement('button');
    const btnImg = document.createElement('img');
    const img = document.createElement('img');
    const textPart = document.createElement('div');
    const heading = document.createElement('h3');
    const subHeading = document.createElement('h4');
    const description = document.createElement('p');
    const list = document.createElement('ul');
    const age = document.createElement('li');
    const inoculations = document.createElement('li');
    const diseases = document.createElement('li');
    const parasites = document.createElement('li');

    // Attributes, Classes, Events and InnerContent
    modal.classList.add('modal');
    modal.addEventListener('click', hideOnClick);
    modalContent.classList.add('modal-content');
    modalContent.addEventListener('mouseenter', () => {
        document.getElementById('modal-btn').style.backgroundColor = 'unset';
    });
    modalContent.addEventListener('mouseleave', () => {
        document.getElementById('modal-btn').style.backgroundColor = 'var(--main-color)';
    });

    btn.className = 'button-secondary button-arrow';
    btn.id = 'modal-btn';
    btn.addEventListener('click', () => {
        document.querySelector('.modal').remove();
        document.body.classList.remove('scroll-off');
    });
    btnImg.setAttribute('src', '../../assets/icons/cross.svg');
    btnImg.setAttribute('alt', 'Close Modal');

    img.setAttribute('src', pet.img);
    img.setAttribute('alt', `${pet.name} (${pet.type})`);

    textPart.classList.add('modal-text');
    heading.innerText = pet.name;
    subHeading.innerText = `${pet.type} - ${pet.breed}`;
    description.innerText = pet.description;
    age.innerHTML = `<b>Age:</b> ${pet.age}`;
    inoculations.innerHTML = `<b>Inoculations:</b> ${pet.inoculations}`;
    diseases.innerHTML = `<b>Diseases:</b> ${pet.diseases}`;
    parasites.innerHTML = `<b>Parasites:</b> ${pet.parasites}`;

    // Appending
    list.appendChild(age);
    list.appendChild(inoculations);
    list.appendChild(diseases);
    list.appendChild(parasites);
    textPart.appendChild(heading);
    textPart.appendChild(subHeading);
    textPart.appendChild(description);
    textPart.appendChild(list);
    btn.appendChild(btnImg);
    modalContent.appendChild(btn);
    modalContent.appendChild(img);
    modalContent.appendChild(textPart);
    modal.appendChild(modalContent);

    // Body Appending
    document.body.appendChild(modal);
}

function hideOnClick(e) {
    let modal = document.querySelector('.modal');
    let modalContent = document.querySelector('.modal-content');
    if (e.target.contains(modalContent)) {
        modal.remove();
        document.body.classList.remove('scroll-off');
    }
}