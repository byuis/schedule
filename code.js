const scale = 1
const map_locations={}




function place_pins(text,pins, clear){
  for(let x=0;x<pins.length;x++){
    const pin=pins[x]
    let clearMe = x===0
    if(clear===false){
        clearMe=false
    }
    
    place_pin({dataset:{x:parseInt(pin[0])-0,y:parseInt(pin[1])-2,name:text}},clearMe)
  }
}


function place_pin(area, clear=true){
    console.log("typeof area", typeof area)
    if(typeof area==="number"){
        area={dataset:{number:area}}
    }
    console.log("at place pin.  Area number", area.dataset.number)
    if(clear){
        clear_all_pins()
    }
    const pin = document.createElement('img')
    pin.src = 'pin.svg'
    pin.width=30
    pin.className="pin"
    tag('map-div').appendChild(pin)

    //<div id="label" class="label">Label Text</div>
    const label = document.createElement('div')
    label.className="label"
    tag('map-div').appendChild(label)


    let x=area.dataset.x
    let y=area.dataset.y
    let name = area.dataset.name

    if(area.dataset.number){
        x=map_locations[area.dataset.number].x
        y=map_locations[area.dataset.number].y
        name=map_locations[area.dataset.number].name
    }
    console.log("at place pin")
    pin.style.visibility="visible"
    let left=(x-15)+"px"
    let top=(y-47)+"px"
    console.log(top,left)

    pin.style.left=left
    pin.style.top=top
    
    label.innerHTML=name

    label.style.left=(parseInt(x)-(label.offsetWidth/2))+"px"
    label.style.top=(parseInt(y)-50-label.offsetHeight)+"px"
    console.log("label.offsetWidth",label.offsetWidth)
    if(clear){
      label.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    }
}

function tag(id){
    return document.getElementById(id)
}

function clear_all_pins(){
    document.querySelectorAll('.pin').forEach(item => {item.remove()});
    document.querySelectorAll('.label').forEach(item => {item.remove()});
}
function add_rect(coords,func,show_pointer=true){
    let element = document.createElement( "AREA" )
    element.shape = "rect"
    element.coords = coords
    element.onclick = func
    if(!show_pointer){
        element.style.cursor='default'
    }
    tag("image-map").appendChild( element )
}

function add_area(coords,y,x,name,supplement_coords){
    const area_number=Object.keys(map_locations).length+1
    let element = document.createElement("AREA")
    element.shape = "rect"
    element.coords = coords
    
    element.onclick = function() {place_pin(this)}
    element.dataset.number=area_number
    tag("image-map").appendChild( element )

    element = document.createElement( "AREA" )
    element.shape = "circle"
    let c=(parseInt(x)) + "," + (parseInt(y)) + "," + 13
    // let c=(parseInt(x)-8) + "," + (parseInt(y)+51) + "," + 13
    console.log(c)
    element.coords = c
    element.onclick = function() {place_pin(this)}
    // element.dataset.x=Math.round(parseInt(x)*scale)
    // element.dataset.y=Math.round(parseInt(y)*scale)
    // element.dataset.name=name
    element.dataset.number=area_number

    tag("image-map").appendChild( element )

    map_locations[area_number]={
        x,
        y,
        name
    }

    if(supplement_coords){
        let element = document.createElement( "AREA" )
        coord_array=supplement_coords.split(",")
        switch(coord_array.length){
            case 2:
              element.shape = "circle"
              break
            case 4:
              element.shape = "rect"
              break
            default:
              element.shape = "poly"
        }

        for(let x=0;x<coord_array.length;x++){
            coord_array[x]=parseInt(coord_array[x])*scale
        }

        element.coords = coord_array.join()
        
        element.onclick = function() {place_pin(this)}
        // element.dataset.x=Math.round(parseInt(x)*scale)
        // element.dataset.y=Math.round(parseInt(y)*scale)
        // element.dataset.name=name
        element.dataset.number=area_number
        tag("image-map").appendChild( element )

    }

}

function filterSchedule(filter){
    if(!filter){return}
    
    console.log("filter=", filter)
    if(filter==="full"){
        for(row of document.querySelectorAll("tr")){
            row.style.display=""
        }
        return
    }
    tag("filter").value=filter
    for(row of document.querySelectorAll("tr")){
        console.log(row, row.classList.contains(filter))
        if(!(row.outerHTML.includes('colspan="2"') || row.classList.contains(filter))){
            row.style.display="none"
        }else{
            row.style.display=""
        }
    }

}
function start_me_up(){
    make_map()

    let params = new URLSearchParams(document.location.search);
    

    if(params.get("pin")){
        for(const pin of params.get("pin").split("-")){
            place_pin(parseInt(pin),false)
        }
    }else if(params.get("show")){
        if(params.get("show")==="tents"){
            place_tents()
        }
    }else{
        place_pin(1)
        setTimeout(showMessage, 3000);
    }
    

    if(params.get("filter")){
        console.log("filter filter filter",params.get("filter") )
        filterSchedule(params.get("filter"))
    }
    filterSchedule()
    const spans = document.getElementsByTagName("span");
    for(let i=0; i < spans.length; i++){
        const elem=spans[i]
        console.log(elem.innerHTML)
        if(elem.dataset.number && !elem.innerHTML){
            elem.innerHTML = elem.dataset.time + " at #" + elem.dataset.number
        }    
    }
    
}

function hideMessage(){
tag("message").style.display="none"
}
function showMessage(){
tag("message").style.bottom="50%"
}