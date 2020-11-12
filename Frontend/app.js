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
    formField : document.getElementById("input-form"),
    GemsSummaryGlobalContainer: document.querySelector('.gems-summary-container'),
    GemsSummaryDMContainer: document.querySelector('.gems-summary-dm-container'),
    GemsSummaryDSODContainer: document.querySelector('.gems-summary-dsod-container'),
    GemsSummaryGXContainer: document.querySelector('.gems-summary-gx-container'),
    GemsSummary5DSContainer: document.querySelector('.gems-summary-5ds-container'),
    GemsSummaryZexalContainer: document.querySelector('.gems-summary-zexal-container'),
}

let idCharacter = "";

let characterData = {
    name : "",
    world : "",
    currentLv : "",
    maxLv : "",
    charType : "",
}

const loadCharactersListbyWorld = world => { 

    const elementByWorld = getElementListCharacterByWorld(world)
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

function deleteCharacter() {
    const url = "http://localhost:8000/character/"
    const api = url.concat(idCharacter)

    fetch(api, {
        method : 'DELETE',
    })

    window.location.reload();
}

function outputCurrentDataToForm() {
    // change class (flag) of input form for marker process POST or PUT data
    elements.formField.classList.add("update-form")
    elements.formField.classList.remove("post-form")
    
    //console.log(characterData)
    elements.nameField.value = characterData.name
    elements.worldField.value = characterData.world
    elements.currentLvField.value = characterData.currentLv
    elements.maxLvField.value = characterData.maxLv
    elements.charTypeField.value = characterData.charType
}

function characterAction(event, world) {
    idCharacter = event.target.parentElement.parentElement.id;
    if (event.target.classList[1] === "fa-marker") {
        characterData.name = event.target.parentElement.parentElement.children[0].innerHTML
        characterData.world = world
        characterData.currentLv = event.target.parentElement.parentElement.children[1].innerHTML
        characterData.maxLv = event.target.parentElement.parentElement.children[2].innerHTML
        characterData.charType = event.target.parentElement.parentElement.children[3].innerHTML
        
        outputCurrentDataToForm(characterData)
    } else if (event.target.classList[1] === "fa-trash") {
        deleteCharacter()
    }
}

function formAction (event) {
    event.preventDefault()
    const statusForm = event.target.classList[0]
    if (statusForm === "post-form")
        addNewCharacter(event)
    else if (statusForm === "update-form")
        updateCharacter(event)
}

function updateCharacter(event) {
    event.preventDefault()

    characterData.name = elements.nameField.value
    characterData.world = elements.worldField.value.toUpperCase()
    characterData.currentLv = parseInt(elements.currentLvField.value)
    characterData.maxLv = parseInt(elements.maxLvField.value)
    characterData.charType = parseInt(elements.charTypeField.value)

    const url = "http://localhost:8000/character/"
    const api = url.concat(idCharacter)
    
    fetch(api, {
        method: 'PUT',
        body: JSON.stringify(characterData)
      })

    window.location.reload();
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
        method: 'POST',
        body: JSON.stringify(characterData)
      })

   window.location.reload();
}

const loadGemsSummaryGlobal = () => { 

    const api = "http://localhost:8000/gems-summary"
    
    fetch(api).
    then(res => res.json()).
    then(element => {
        html = '<h4>Obtainable Gems : %obtainableGems%</h4> <br> <h4>Obtain Gems : %obtainGems%</h4> <br> <h4>Available Gems : %availableGems%</h4>'
        
        newHtml = html.replace('%obtainableGems%', element.payload.obtainableGems)
        newHtml = newHtml.replace('%obtainGems%', element.payload.obtainGems)
        newHtml = newHtml.replace('%availableGems%', element.payload.availableGems)
        elements.GemsSummaryGlobalContainer.insertAdjacentHTML('beforeend', newHtml);
    })
} 

const loadGemsSummarybyWorld = world => { 

    const elementByWorld = getElementGemsSummaryByWorld(world)
    const url = "http://localhost:8000/gems-summary/"
    const api = url.concat(world)

    fetch(api).
    then(res => res.json()).
    then(element => {
        html = '<h4>Obtainable Gems : %obtainableGems%</h4> <br> <h4>Obtain Gems : %obtainGems%</h4> <br> <h4>Available Gems : %availableGems%</h4>'
        
        newHtml = html.replace('%obtainableGems%', element.payload.obtainableGems)
        newHtml = newHtml.replace('%obtainGems%', element.payload.obtainGems)
        newHtml = newHtml.replace('%availableGems%', element.payload.availableGems)
        elementByWorld.insertAdjacentHTML('beforeend', newHtml);
    })
} 

const getElementListCharacterByWorld = world => {
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

const getElementGemsSummaryByWorld = world => {
    if (world === "dm") {
        return elements.GemsSummaryDMContainer
    } else if (world === "dsod") {
        return elements.GemsSummaryDSODContainer
    } else if (world === "gx") {
        return elements.GemsSummaryGXContainer
    } else if (world === "5ds") {
        return elements.GemsSummary5DSContainer
    } else if (world === "zexal") {
        return elements.GemsSummaryZexalContainer
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

        // load all gems summary on each world
        loadGemsSummaryGlobal()
        loadGemsSummarybyWorld("dm")
        loadGemsSummarybyWorld("dsod")
        loadGemsSummarybyWorld("gx")
        loadGemsSummarybyWorld("5ds")
        loadGemsSummarybyWorld("zexal")
    });

    document.querySelector(DOMstrings.DMContainer).addEventListener('click', event => characterAction(event, "DM"));
    document.querySelector(DOMstrings.DSODContainer).addEventListener('click', event => characterAction(event, "DSOD"));
    document.querySelector(DOMstrings.GXContainer).addEventListener('click', event => characterAction(event, "GX"));
    document.querySelector(DOMstrings.FiveDSContainer).addEventListener('click', event => characterAction(event, "5DS"));
    document.querySelector(DOMstrings.ZexalContainer).addEventListener('click', event => characterAction(event, "Zexal"));
    document.getElementById(DOMstrings.SubmitButton).addEventListener('submit', event => formAction(event));
}

controller()

/*var ctx = document.getElementById('myChart').getContext('2d');
ctx.height = 50;
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    data : {
        datasets: [{
            data: [97600, 42800],
            backgroundColor: ["#0074D9", "#FF4136"]
        }],
    
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Red',
            'Yellow',
        ]
    },

    // Configuration options go here
    options: {}
});*/