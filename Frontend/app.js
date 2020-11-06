const elements = {
    DMCharacterListTable: document.querySelector('.character-dm-container').children[1].children[0].children[0],
    DSODCharacterListTable: document.querySelector('.character-dsod-container').children[1].children[0].children[0],
    GXCharacterListTable: document.querySelector('.character-gx-container').children[1].children[0].children[0],
    FiveDSCharacterListTable: document.querySelector('.character-5ds-container').children[1].children[0].children[0],
    ZexalCharacterListTable: document.querySelector('.character-zexal-container').children[1].children[0].children[0],
    nameField : document.getElementById("name"),
    worldField : document.getElementById("world"),
    currentLvField : document.getElementById("currentLv"),
    maxLvField : document.getElementById("maxLv"),
    charTypeField : document.getElementById("charType"),
}

const loadCharactersListbyWorld = world => { 

    const elementByWorld = getElementByWorld(world)
    const url = "http://localhost:8000/character-by-world/"
    const api = url.concat(world)
    
    fetch(api).
    then(res => res.json()).
    then(res => res.payload.forEach(element => {
        if (element.maxLv !== element.currentLv)
            html = '<tr id="%id%"> <td>%name%</td> <td>%curLv%</td> <td>%maxLv%</td> <td>%charType%</td> <th><i class="fas fa-marker"></i></th> <th><i class="fas fa-trash"></i></th> </tr>'
        else
            html = '<tr id="%id%"> <td class="max-lvl">%name%</td> <td class="max-lvl">%curLv%</td> <td class="max-lvl">%maxLv%</td> <td class="max-lvl">%charType%</td> <th class="max-lvl"><i class="fas fa-marker"></i></th> <th class="max-lvl"><i class="fas fa-trash"></i></th> </tr>'
        
        newHtml = html.replace('%name%', element.name)
        newHtml = newHtml.replace('%curLv%', element.currentLv)
        newHtml = newHtml.replace('%maxLv%', element.maxLv)
        newHtml = newHtml.replace('%charType%', element.charType)
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
    })

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
    elements.nameField.value = characterData.name
    elements.worldField.value = characterData.world
    elements.currentLvField.value = characterData.currentLv
    elements.maxLvField.value = characterData.maxLv
    elements.charTypeField.value = characterData.charType
}

function characterAction(event, world) {
    let id;
    if (event.target.classList[1] === "fa-marker") {
        const characterData = {
            name : event.target.parentElement.parentElement.children[0].innerHTML,
            world : world,
            currentLv : event.target.parentElement.parentElement.children[1].innerHTML,
            maxLv : event.target.parentElement.parentElement.children[2].innerHTML,
            charType : event.target.parentElement.parentElement.children[3].innerHTML,
        }
        id = event.target.parentElement.parentElement.id;
        updateCharacter(id, characterData)
    } else if (event.target.classList[1] === "fa-trash") {
        id = event.target.parentElement.parentElement.id;
        deleteCharacter(id)
    }
}

function addNewCharacter(event) {
    event.preventDefault()
    const characterData = {
        name : elements.nameField.value,
        world : elements.worldField.value.toUpperCase(),
        currentLv : parseInt(elements.currentLvField.value),
        maxLv : parseInt(elements.maxLvField.value),
        charType : parseInt(elements.charTypeField.value),
    }

    const url = "http://localhost:8000/character"
    
    fetch(url, {
        method: 'post',
        body: JSON.stringify(characterData)
      })

   window.location.reload();
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
        SubmitButton: 'input-form',
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
    document.querySelector(DOMstrings.DSODContainer).addEventListener('click', event => characterAction(event, "DSOD"));
    document.querySelector(DOMstrings.GXContainer).addEventListener('click', event => characterAction(event, "GX"));
    document.querySelector(DOMstrings.FiveDSContainer).addEventListener('click', event => characterAction(event, "5DS"));
    document.querySelector(DOMstrings.ZexalContainer).addEventListener('click', event => characterAction(event, "Zexal"));
    document.getElementById(DOMstrings.SubmitButton).addEventListener('submit', event => addNewCharacter(event));
}

controller()