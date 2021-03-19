let allUsers = [];
let usersFiltered = [];

window.addEventListener('load', () => {
    // carrega div loading
    const loading = document.querySelector('.loading');
    // habilita loading enquanto carrega dados da api
    loading.style.display = 'block';

    // chama api e carrega array com retorno
    getUsers();
    // desativa loading
    loading.style.display = 'none';
});

async function getUsers() {
    const users = await fetch('https://randomuser.me/api/?seed=javascript&results=200&nat=BR&noinfo');
    const json = await users.json();
    
    allUsers = json.results.map(user => {
        const res = user;
        return {
            id: res.login.uuid,
            name: `${res.name.first} ${res.name.last}`,
            age: res.dob.age,
            gender: res.gender,
            picture: res.picture.thumbnail
        }
    });
    
    console.log(allUsers)

    render();
}

function render() {
    // pega campo input e botão
    const term = document.querySelector('#term');
    term.addEventListener('keyup', keyUpTerm);

    const button = document.querySelector('#search');
    button.addEventListener('click', clickButton);

    // valida se array filtrado tem resultados
    if(countUsersFiltered() === 0) {
        const filtered = document.querySelector('#filtered');
        const textFiltered = '<h4>Nenhum usuário filtrado</h4>';
        filtered.innerHTML = textFiltered;

        const summary = document.querySelector('#summary');
        const textSummary = '<h4>Nada a ser exibido</h4>';
        summary.innerHTML = textSummary;
        return;
    }

    // monta logica se achou
    const filtered = document.querySelector('#filtered');
    let textFiltered = `<h4>${countUsersFiltered()} Usuários encontrados </h4> <ul>`;
    usersFiltered.forEach(res => {
        textFiltered += `<li><img class="responsive-img" src="${res.picture}" alt="${res.name}">
                         ${res.name}, ${res.age} anos </li>`;
    });                        
    filtered.innerHTML = `${textFiltered} </ul>`;

    const summary = document.querySelector('#summary');
    let textSummary = `<h4>Estatísticas</h4>
                       <ul>
                        <li>Sexo masculino: ${countFilteredGender('male')}</li>
                        <li>Sexo feminino: ${countFilteredGender('female')}</li>
                        <li>Soma das idades: ${countFilteredAges()}</li>
                        <li>Média das idades: ${numberFormat(countFilteredAges('M') / countUsersFiltered())}</li>
                       </ul>`;
    summary.innerHTML = textSummary;

}

function countUsersFiltered() {
    return usersFiltered.length;
}

function keyUpTerm(event) {
    let termValue = event.target.value;
    document.getElementById('search').classList.remove('disabled');

    if(event.key === 'Enter' && handleButton(termValue) === true) {
        // faz o filtro no array principal com o termo digitado
        searchUser(termValue);
    }

    if(termValue === '') {
        document.getElementById('search').classList.add('disabled');
    }
    
    return;
    
}

function clickButton() {
    const termValue = document.getElementById('term').value;
    searchUser(termValue);
}

function handleButton(value) {
    if(value === '') {
        document.getElementById('search').classList.add('disabled');
        window.alert('digite ao menos uma letra para pesquisar');
        return false;
    }
    document.getElementById('search').classList.remove('disabled');
    return true;
}

function searchUser(term) {
    term = removeAccents(term);
    usersFiltered = allUsers.filter(res => removeAccents(res.name.toUpperCase()).indexOf(term.toUpperCase()) > -1);
    // usersFiltered = allUsers.filter(res => res.name.toUpperCase().indexOf(term.toUpperCase()) > -1);
    render();
}

function countFilteredGender(gender) {
    return count = usersFiltered.filter(res => res.gender === gender).reduce((acc) => {return acc + 1}, 0);
}

// filter(res => res.gender === gender)
function countFilteredAges() {
    return usersFiltered.reduce((acc, curr) => { return acc + curr.age}, 0);
}

function numberFormat(value) {
    // return Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 4 }).format(value);
    return value.toFixed(2);
}

function removeAccents(str) {
    const parsed = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return parsed;
}
