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
    }))
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
    window.addEventListener('load', () => {

        console.log("Apps Is Running")
       
        // load all characters list on each world
        loadCharactersListbyWorld("dm")
        loadCharactersListbyWorld("dsod")
        loadCharactersListbyWorld("gx")
        loadCharactersListbyWorld("5ds")
        loadCharactersListbyWorld("zexal")
    });
}

controller()