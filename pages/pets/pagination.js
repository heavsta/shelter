const getPets = async () => {
    try {
        let res = await fetch('../../data/pets.json');
        return res.json();
    } catch(err) {
        console.log('Error fetching data: ', err);
    } 
}

/**
 * Init Page
 */


let petsArr = [];
let page;
let index;
let size;

const init = async () => {
    let pets = await getPets();
    petsArr = [...pets];
    
    while (petsArr.length < 48) {
        pets = shuffle(pets);
        petsArr.push(...pets);
    }

    resetPagination();

    document.querySelector('.grid').replaceChildren();
    let activeList = petsArr.slice(index, size);
    activeList.forEach(pet => createCard(pet));
}

const createCard = (pet) => {
    const parent = document.querySelector('.grid');
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

    parent.appendChild(card);
}

// Fisher-Yates shuffle algorithm - stackoverflow
const shuffle = (array) => {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

init();

/**
 * Pagination
 */

const width768 = window.matchMedia('(max-width: 767px');
const width1280 = window.matchMedia('(max-width: 1280px');
width768.addEventListener('change', init);
width1280.addEventListener('change', init);

const pageBtn = document.getElementById('page-num');

const nextBtn =  document.getElementById('next');
nextBtn.addEventListener('click', () => {
    let maxPage = petsArr.length/size;
    if (page < maxPage) {
        index += size;
        page++;
        if (page === maxPage) { 
            nextBtn.setAttribute('disabled', true);
            nextBtn.className = 'button-arrow button-disabled';
            forwardBtn.setAttribute('disabled', true);
            forwardBtn.className = 'button-arrow button-disabled';
        } else if (page === 2) {
            prevBtn.removeAttribute('disabled');
            prevBtn.className = 'button-arrow button-secondary';
        }
        backwardBtn.removeAttribute('disabled');
        backwardBtn.className = 'button-arrow button-secondary';
        document.querySelector('.grid').replaceChildren();
        petsArr.slice(index, index + size).forEach(pet => createCard(pet));
        pageBtn.innerText = page;
    }
});

const prevBtn = document.getElementById('previous');
prevBtn.addEventListener('click', () => {
    let maxPage = petsArr.length/size;
    if (page > 1) {
        index -= size;
        page--;
        if (page === 1) { 
            prevBtn.disabled = true;
            prevBtn.className = 'button-arrow button-disabled';
            backwardBtn.disabled = true;
            backwardBtn.className = 'button-arrow button-disabled';
        } else if (page === maxPage - 1) {
            nextBtn.removeAttribute('disabled');
            nextBtn.className = 'button-arrow button-secondary';
        }
        forwardBtn.removeAttribute('disabled');
        forwardBtn.className = 'button-arrow button-secondary';
        document.querySelector('.grid').replaceChildren();
        petsArr.slice(index, index + size).forEach(pet => createCard(pet));
        pageBtn.innerText = page;
    }
});

const forwardBtn = document.getElementById('forward');
forwardBtn.addEventListener('click', () => {
    let maxPage = petsArr.length/size;
    if (page < maxPage) {
        index = petsArr.length - size;
        page = maxPage;
        nextBtn.setAttribute('disabled', true);
        nextBtn.className = 'button-arrow button-disabled';
        forwardBtn.setAttribute('disabled', true);
        forwardBtn.className = 'button-arrow button-disabled';
        prevBtn.removeAttribute('disabled');
        prevBtn.className = 'button-arrow button-secondary';
        backwardBtn.removeAttribute('disabled');
        backwardBtn.className = 'button-arrow button-secondary';

        document.querySelector('.grid').replaceChildren();
        petsArr.slice(index, index + size).forEach(pet => createCard(pet));
        pageBtn.innerText = page;
    }
});

const backwardBtn = document.getElementById('backward');
backwardBtn.addEventListener('click', () => {
    if (page > 1) {
        index = 0;
        page = 1;
        prevBtn.setAttribute('disabled', true);
        prevBtn.className = 'button-arrow button-disabled';
        backwardBtn.setAttribute('disabled', true);
        backwardBtn.className = 'button-arrow button-disabled';
        nextBtn.removeAttribute('disabled');
        nextBtn.className = 'button-arrow button-secondary';
        forwardBtn.removeAttribute('disabled');
        forwardBtn.className = 'button-arrow button-secondary';

        document.querySelector('.grid').replaceChildren();
        petsArr.slice(index, index + size).forEach(pet => createCard(pet));
        pageBtn.innerText = page;
    }
})

const resetPagination = () => {
    page = 1;
    pageBtn.innerText = page;
    index = 0;
    width768.matches ? size = 3 : width1280.matches ? size = 6 : size = 8;
    console.log(size)
    prevBtn.setAttribute('disabled', true);
    prevBtn.className = 'button-arrow button-disabled';
    backwardBtn.setAttribute('disabled', true);
    backwardBtn.className = 'button-arrow button-disabled';
    nextBtn.removeAttribute('disabled');
    nextBtn.className = 'button-arrow button-secondary';
    forwardBtn.removeAttribute('disabled');
    forwardBtn.className = 'button-arrow button-secondary';
}



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

const hideOnClick = (e) => {
    let modal = document.querySelector('.modal');
    let modalContent = document.querySelector('.modal-content');
    if (e.target.contains(modalContent)) {
        modal.remove();
        document.body.classList.remove('scroll-off');
    }
}