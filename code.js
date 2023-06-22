const scale = 1
const map_locations={}

function place_necessary(){
    place_pins("The Necessary",[[348,411],[54,230],[719,192],[866,790],[1090,235]])
}
function place_welcome(){
    place_pins("Welcome Table",[[431,63],[448,449],[750,787],[1107,388]])
}
function place_first_aid(){
    place_pins("First-Aid Station",[[410,64],[775,786],[426,468]])
}
function place_well(){
    place_pins("Ice Water",[[371,70],[214,363],[841,453],[996,471],[999,629],[786,602],[842,455],[708,405]])
}


function place_pins(text,pins){
  for(let x=0;x<pins.length;x++){
    const pin=pins[x]
    place_pin({dataset:{x:parseInt(pin[0])-0,y:parseInt(pin[1])-52,name:text}},x===0)
  }
}


function place_pin(area, clear=true){
    console.log("typeof area", typeof area)
    if(typeof area==="number"){
        area={dataset:{number:area}}
    }
    console.log("at palce pin.  Area number", area.dataset.number)
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
    let left=(x-22)+"px"
    let top=(y-3)+"px"
    console.log(top,left)

    pin.style.left=left
    pin.style.top=top
    
    label.innerHTML=name

    label.style.left=(parseInt(x)-(label.offsetWidth/2))+"px"
    label.style.top=(parseInt(y)-5-label.offsetHeight)+"px"
    console.log(label.offsetWidth)
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
    const coord_array = coords.split(",")
    for(let x=0;x<coord_array.length;x++){
        coord_array[x]=parseInt(coord_array[x])
    }
    element.coords = coord_array.join()
    element.onclick = func
    if(!show_pointer){
        element.style.cursor='default'
    }
    tag("image-map").appendChild( element )
}

function add_area(coords,y,x,name,supplement_coords){
    const area_number=Object.keys(map_locations).length+1
    let element = document.createElement( "AREA" )
    element.shape = "rect"
    let coord_array = coords.split(",")
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

    element = document.createElement( "AREA" )
    element.shape = "circle"
    let c=(parseInt(x)-8) + "," + (parseInt(y)+51) + "," + 13
    console.log(c)
    element.coords = c
    element.onclick = function() {place_pin(this)}
    // element.dataset.x=Math.round(parseInt(x)*scale)
    // element.dataset.y=Math.round(parseInt(y)*scale)
    // element.dataset.name=name
    element.dataset.number=area_number

    tag("image-map").appendChild( element )

    map_locations[area_number]={
        x:Math.round(parseInt(x)*scale),
        y:Math.round(parseInt(y)*scale),
        name:name
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
function start_me_up(){
    make_map()
    const spans = document.getElementsByTagName("span");
    for(let i=0; i < spans.length; i++){
        const elem=spans[i]
        console.log(elem.innerHTML)
        if(elem.dataset.number && !elem.innerHTML){
            elem.innerHTML = map_locations[elem.dataset.number].name + ": #" + elem.dataset.number
        }    
    }
    setTimeout(function() { alert('You can tap on various part of the map and schedule to see where different locations are in the park.\n\nTap "OK" on this messagem then give it a try!'); }, 7000);
}
function make_map(){

    add_area('10,490,170,507.5','375','533',"Gift Shop & Information")
    add_area('10,507.5,170,525','351','533',"Find Your Colonial Relatives")
    add_area('10,525,170,542.5','321','258',"South Meeting House")
    add_area('10,542.5,170,560','329','158',"Josiah Harmar Camp")
    add_area('10,560,170,577.5','290','109',"Master Horner")
    add_area('10,577.5,170,595','268','92',"Militiaman")
    add_area('10,595,170,612.5','263','213',"Hatter")
    add_area('10,612.5,170,630','244','269',"Founders’ Corner")
    add_area('10,630,170,647.5','238','195',"The Georges")
    add_area('10,647.5,170,665','213','187',"Women’s Dress Maker")
    add_area('10,665,170,682.5','209','152',"Cup and Quill")
    add_area('10,682.5,170,700','182','122',"Camp Kitchen & Mess")
    add_area('10,700,170,717.5','158','162',"American Camp")
    add_area('10,717.5,170,735','121','177',"Military Surgeon")
    add_area('10,735,170,752.5','45','232',"Period Men's fashion")
    add_area('10,752.5,170,770','8','271',"Fighting Quaker Forge")
    add_area('10,770,170,787.5','34','311',"John Paul Jones")
    add_area('10,787.5,170,805','134','451',"Continental Field")
    add_area('10,805,170,822.5','222','618',"Dance Lessons 11:30, 3:30")
    add_area('10,822.5,170,840','242','615',"Sword Demos 10:30, 2:00")
    add_area('10,840,170,857.5','331','643',"Historic Conversations")
    add_area('170,580,320,615','373','682',"Colonial Games")
    add_area('170,615,320,632.5','367','752',"Colonial Chores")
    add_area('170,632.5,320,650','397','724',"Colonial School/Hall")
    add_area('170,650,320,667.5','386','788',"Mayflower")
    add_area('170,667.5,320,685','442','778',"Culper Spy Ring HQ")
    add_area('170,685,320,702.5','505','680',"King's Field",'625,522,733,588')
    add_area('170,702.5,320,720','576','747',"British Encampment")
    add_area('170,720,320,737.5','592','768',"Laundress")
    add_area('170,737.5,320,755','607','793',"Painted Hog Tavern")
    add_area('170,755,320,772.5','631','835',"Leatherwork")
    add_area('170,772.5,320,790','652','854',"Silversmith")
    add_area('170,790,320,807.5','675','836',"Calligrapher")
    add_area('170,807.5,320,825','680','807',"Basket Maker")
    add_area('170,825,320,842.5','655','792',"Publick Hall")
    add_area('170,842.5,320,860','683','671',"Gray's Rope Walk")
    add_area('320,648,460,683','658','933',"Carol's Station, a Frontier Village")
    add_area('320,683,460,718','578','805',"Soldiers, Scurvy & Sauerkraut")
    add_area('320,718,460,735.5','584','856',"Bookbinder")
    add_area('320,735.5,460,753','590','908',"Print Shop")
    add_area('320,753,460,770.5','568','971',"Paper Making")
    add_area('320,770.5,460,788','545','1003',"Woodworker")
    add_area('320,788,460,805.5','515','1030',"Gunsmith")
    add_area('320,805.5,460,823','484','1023',"Potter")
    add_area('320,823,460,840.5','457','981',"Wildwood Mercantile")
    add_area('320,840.5,460,858','445','934',"Broom Maker")
    add_area('1100,465,1190,482.5','446','894',"Cooper")
    add_area('1100,482.5,1190,500','446','868',"Apothecary")
    add_area('1100,500,1190,517.5','441','839',"Chandlery")
    add_area('1100,517.5,1190,535','437','1081',"Fiber Arts")
    add_area('1100,535,1190,552.5','377','1096',"Bakehouse")
    add_area('1100,552.5,1190,570','364','1050',"Spoon Maker")
    add_area('1190,465,1325,482.5','352','1072',"Maria’s Lemonade")
    add_area('1190,482.5,1325,500','354','1175',"Jolley Art")
    add_area('1190,500,1325,517.5','294','1166',"Brooker’s Ice Cream")
    add_area('1190,517.5,1325,535','93','1168',"Food Truck Round-up")
    add_area('1190,535,1325,552.5','87','1082',"Dining Area")
    
            



add_rect('1126,607,1243,647',place_welcome)
add_rect('741,783,759,802',place_welcome)
add_rect('1098,381,1115,403',place_welcome)
add_rect('439,445,458,464',place_welcome)
add_rect('420,61,439,79',place_welcome)


add_rect('1130,647,1237,675',place_first_aid)
add_rect('765,788,784,802',place_first_aid)
add_rect('413,467,437,486',place_first_aid)
add_rect('400,62,418,81',place_first_aid)





add_rect('1130,675,1237,710',place_necessary)
add_rect('847,784,879,817',place_necessary)
add_rect('1076,227,1104,265',place_necessary)
add_rect('703,182,732,216',place_necessary)
add_rect('331,407,360,441',place_necessary)
add_rect('39,222,67,253',place_necessary)





add_rect('1130,710,1237,745',place_well)
add_rect('798,621,778,602',place_well)
add_rect('983,465,1008,491',place_well)
add_rect('827,451,853,474',place_well)
add_rect('580,369,608,395',place_well)
add_rect('695,399,723,423',place_well)
add_rect('195,357,227,385',place_well)
add_rect('355,65,384,91',place_well)
add_rect('1013,653,985,625',place_well)









place_pin(1)

}
