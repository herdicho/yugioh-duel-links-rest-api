const elements = {
    DMCharacterListTable: document.querySelector('.character-dm-container').children[1].children[0].children[0],
    DSODCharacterListTable: document.querySelector('.character-dsod-container').children[1].children[0].children[0],
    GXCharacterListTable: document.querySelector('.character-gx-container').children[1].children[0].children[0],
    FiveDSCharacterListTable: document.querySelector('.character-5ds-container').children[1].children[0].children[0],
    ZexalCharacterListTable: document.querySelector('.character-zexal-container').children[1].children[0].children[0],
}

const loadCharactersListbyWorld = world => { 

    const elementByWorld = getElementByWorld(world)
    const url = "http://localhost:8000/character-by-world/"
    const api = url.concat(world)
    
    fetch(api).
    then(res => res.json()).
    then(res => res.payload.forEach(element => {
        if (element.maxLv !== element.currentLv)
            html = '<tr id="%id%"> <td>%name%</td> <td>%curLv%</td> <td>%maxLv%</td> <th><i class="fas fa-marker"></i></th> <th><i class="fas fa-trash"></i></th> </tr>'
        else
            html = '<tr id="%id%"> <td class="max-lvl">%name%</td> <td class="max-lvl">%curLv%</td> <td class="max-lvl">%maxLv%</td> <th class="max-lvl"><i class="fas fa-marker"></i></th> <th class="max-lvl"><i class="fas fa-trash"></i></th> </tr>'
        
        newHtml = html.replace('%name%', element.name)
        newHtml = newHtml.replace('%curLv%', element.currentLv)
        newHtml = newHtml.replace('%maxLv%', element.maxLv)
        newHtml = newHtml.replace('"%id%"', element.id)
        elementByWorld.insertAdjacentHTML('afterend', newHtml);
    })).
    catch(error => console.log(`Failed to fetch world ${world} because there is no character on this world`))
} 

function deleteCharacter(id) {
    const url = "http://localhost:8000/character/"
    const api = url.concat(id)

    fetch(api, {
        method : 'DELETE',
    }).
    then(res => res.json()).
    then(console.log("Success Delete Character"))

    window.location.reload();
}

function updateCharacter(id, characterData) {
    /*const url = "http://localhost:8000/character/"
    const api = url.concat(id)

    fetch(api, {
        method : 'DELETE',
    }).
    then(res => res.json()).
    then(console.log("Success Delete Character"))

    window.location.reload();*/
    const nameField = document.getElementById("name")
    nameField.value = characterData.name
    const worldField = document.getElementById("world")
    worldField.value = characterData.world
    const currentLvField = document.getElementById("currentLv")
    currentLvField.value = characterData.currentLv
    const maxLvField = document.getElementById("maxLv")
    maxLvField.value = characterData.maxLv
}

function characterAction(event, world) {
    let id;
    if (event.target.classList[1] === "fa-marker") {
        const characterData = {
            name : event.target.parentElement.parentElement.children[0].innerHTML,
            world : world,
            currentLv : event.target.parentElement.parentElement.children[1].innerHTML,
            maxLv : event.target.parentElement.parentElement.children[2].innerHTML,
        }
        id = event.target.parentElement.parentElement.id;
        updateCharacter(id, characterData)
    } else if (event.target.classList[1] === "fa-trash") {
        id = event.target.parentElement.parentElement.id;
        deleteCharacter(id)
    }
}

const getElementByWorld = world => {
    if (world === "dm") {
        return elements.DMCharacterListTable
    } else if (world === "dsod") {
        return elements.DSODCharacterListTable
    } else if (world === "gx") {
        return elements.GXCharacterListTable
    } else if (world === "5ds") {
        return elements.FiveDSCharacterListTable
    } else if (world === "zexal") {
        return elements.ZexalCharacterListTable
    }
}

const controller = () => {

    var DOMstrings = {
        DMContainer: '.character-dm-container',
        DSODContainer: '.character-dsod-container',
        GXContainer: '.character-gx-container',
        FiveDSContainer: '.character-5ds-container',
        ZexalContainer: '.character-zexal-container',
    };

    window.addEventListener('load', () => {
        console.log("Apps Is Running")
       
        // load all characters list on each world
        loadCharactersListbyWorld("dm")
        loadCharactersListbyWorld("dsod")
        loadCharactersListbyWorld("gx")
        loadCharactersListbyWorld("5ds")
        loadCharactersListbyWorld("zexal")
    });

    document.querySelector(DOMstrings.DMContainer).addEventListener('click', event => characterAction(event, "DM"));
    document.querySelector(DOMstrings.DSODContainer).addEventListener('click', event => characterAction(event, "DM"));
    document.querySelector(DOMstrings.GXContainer).addEventListener('click', event => characterAction(event, "DM"));
    document.querySelector(DOMstrings.FiveDSContainer).addEventListener('click', event => characterAction(event, "DM"));
    document.querySelector(DOMstrings.ZexalContainer).addEventListener('click', event => characterAction(event, "DM"));
}

controller()