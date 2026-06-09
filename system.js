const scale = 1
const map_locations={}


function colonialQuest(pins){
  place_pin(parseInt(pins[0]), true)
  for(let x=1;x<pins.length;x++){
    place_pin(parseInt(pins[x]), false)
  }
}


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
async function start_me_up(){
    const params = new URLSearchParams(window.location.search);
    const filterClasses={
        character:[],
        person:[],
        group:[]

    }

    let scheduleData=null
    if(params.get('draft')){
        // in chf schedule builder owned by gove colonialheritage.org
        const url = "https://script.google.com/macros/s/AKfycbx5XJ-FlVy7qj3SjOw4mpd7ioUJYljaN5GEqhOd8PThX1m6weY7B26TXPdnJTueDOZP/exec?mode=draft"
        const response = await fetch(url);
        scheduleData = await response.json();
        console.log("using Draft ", scheduleData)
    }else{
        scheduleData = await getScheduleData()
    }



    const schedule = scheduleData.presentation
    const locations = scheduleData.location
    const groups = scheduleData.group



    console.log("schedule", schedule)
    const sched=[]
    for(const value of Object.values(schedule)){
        if(value.times){
            for(const event of value.times){
                event.presentation = value.name
                event.people = value.people
                sched.push(event)
            }
        }
    }
    sched.sort((a, b) => {
        const toMinutes = t => {
            const [time, period] = t.split(' ')
            let [h, m] = time.split(':').map(Number)
            if (period === 'PM' && h !== 12) h += 12
            if (period === 'AM' && h === 12) h = 0
            return h * 60 + m
        }
        return toMinutes(a.time) - toMinutes(b.time)
    })

    console.log("sched",sched)
    
    let currentTime = "No time like the present AM"
    for(const event of sched){
        if(currentTime !== event.time){
          addTimeRow(event.time)
          currentTime = event.time
        }
        console.log("event", event)
        const pres = schedule[event.presentation]
        if(!pres.hide){
          let modifier=""
          if(pres.audienceInvolved){
            modifier = "Arrive Early to participate"
          }
          console.log("pres.location", event.location)
          console.log("loations", locations)
          let theLocation = locations[event.location]
          if(!theLocation){theLocation=locations[pres.location]}
          if(!theLocation){theLocation=locations["Unknown"]}
          addRow(event, pres, theLocation, [])
        }



    }

    const byLastFirst = (a, b) => {
        const parts = n => { const w = n.trim().split(' '); return [w.at(-1), w.slice(0,-1).join(' ')] }
        const [aLast, aFirst] = parts(a)
        const [bLast, bFirst] = parts(b)
        return aLast.localeCompare(bLast) || aFirst.localeCompare(bFirst)
    }
    filterClasses.person.sort(byLastFirst)
    filterClasses.character.sort(byLastFirst)

    // build the filter options

   //build the group filter  
   console.log(groups)
   for(const [person,groupList] of Object.entries(groups)){
    for(const group of groupList){
        if(!filterClasses.group.includes(group)){
            if(group){
              filterClasses.group.push(group)
            }
        }
    }
   }
    filterClasses.group.sort()
    filterClasses.person.sort(byLastFirst)
    filterClasses.character.sort(byLastFirst)

    for(const group of filterClasses.group){
        
        option = document.createElement("option")
        option.value = nameToClass(group)
        option.innerHTML  = "Group: " + group
        tag("filter").appendChild(option)
    }

    for(const person of filterClasses.character){
        option = document.createElement("option")
        option.value = nameToClass(person)
        option.innerHTML  = "Historic Figure: " + person
        tag("filter").appendChild(option)
    }


    for(const person of filterClasses.person){
        option = document.createElement("option")
        option.value = nameToClass(person)
        option.innerHTML  = "Participant:" + person
        tag("filter").appendChild(option)
    }

   if(params.get("filter")){
        console.log("filter filter filter",params.get("filter") )
        filterSchedule(params.get("filter"))
    }
 
    if(params.get("filter")){
        console.log("filter filter filter",params.get("filter") )
        filterSchedule(params.get("filter"))
    }



    return
        // start of original code===================================

    make_map()

    //let params = new URLSearchParams(document.location.search);
    

    if(params.get("pin")){
        for(const pin of params.get("pin").split("-")){
            place_pin(parseInt(pin),false)
        }
    }else if(params.get("quest")){
        colonialQuest(params.get("quest").split("-"))
    }else if(params.get("show")){
        if(params.get("show")==="tents"){
            place_tents()
        }
    }else{
        place_pin(1)
        setTimeout(showMessage, 3000);
    }
    


   // filterSchedule()
    const spans = document.getElementsByTagName("span");
    for(let i=0; i < spans.length; i++){
        const elem=spans[i]
        console.log(elem.innerHTML)
        if(elem.dataset.number && !elem.innerHTML){
            elem.innerHTML = elem.dataset.time + " at #" + elem.dataset.number
        }    
    }
    // end of original code===================================

    function addTimeRow(time){
        const row = document.createElement("tr")
        const timeCeLL = document.createElement( "th")
        timeCeLL.innerHTML=time
        timeCeLL.colSpan=2
        row.appendChild(timeCeLL)
        tag("schedule-table").appendChild(row)

    }
    function addRow(event, pres, location, classNames){
        const title = event.presentation
        const description = pres.description
        const modifier =  pres.audienceInvolved ? "Arrive Early to participate" : ""
        
        
        const row = document.createElement("tr")
        if(pres.people){
            console.log("people", pres.people)
            for(const person of pres.people){
                if(person.name){
                    row.classList.add(nameToClass(person.name))
                    if(!filterClasses.person.includes(person.name)){
                        filterClasses.person.push(person.name)
                    }
                }
                if(person.character){
                    const className =nameToClass(person.character)
                    row.classList.add(nameToClass(person.character))
                    if(!filterClasses.character.includes(person.character)){
                        filterClasses.character.push(person.character)
                    }
                    if(groups[person.character]){
                        console.log(person.character,groups[person.character])
                        for(const group of groups[person.character]){
                            if(group){
                              const groupClass = nameToClass(group)
                              row.classList.add(groupClass)
                            }
                        }
                    }
                }
            }
        }
        let cell = document.createElement( "td")
        cell.innerHTML=title
        row.appendChild(cell)
        
        cell = document.createElement( "td")
        cell.innerHTML=description
        console.log("Location", location)
        let div=document.createElement("div")
        div.className = "location"

        const loc = document.createElement("span")
        loc.dataset.number="25"
        console.log("location",location)
        loc.innerHTML = `${location.name} (#${location.mapNumber})` 
        loc.className="map"
        if(modifier){
            const mod = document.createElement("div")
            mod.innerHTML = modifier
            mod.className="note"

            cell.appendChild(mod)
        }
        
        
        div.appendChild(loc)
        cell.appendChild(div)

        row.appendChild(cell)
        
        tag("schedule-table").appendChild(row)

    }
    function nameToClass(name){
        return name.replace(/\s+/g, '-').toLowerCase();
    }





    
}

function hideMessage(){
tag("message").style.display="none"
}
function showMessage(){
tag("message").style.bottom="50%"
}

async function getScheduleData(){
    const response = await fetch('current-schedule.json')
    return await response.json()
}



