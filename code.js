const scale = 1
const map_locations={}

function place_necessary(){
    place_pins("The Necessary",[[694,894],[372,464],[80,276],[743,234],[1114,279]])
}
function place_welcome(){
    place_pins("Welcome Table",[[1125,426],[743,818],[297,493],[456,116]])
}
function place_first_aid(){
    place_pins("First-Aid Station",[[724,833],[318,505],[435,117],[1102,428]])
}
function place_well(){
    place_pins("Ice Water",[[866,510],[1022,526],[1024,685],[810,658],[620,430],[237,419],[394,124]])
}


function place_pins(text,pins){
  for(let x=0;x<pins.length;x++){
    const pin=pins[x]
    place_pin({dataset:{x:parseInt(pin[0])-0,y:parseInt(pin[1])-2,name:text}},x===0)
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
function start_me_up(){
    make_map()
    const spans = document.getElementsByTagName("span");
    for(let i=0; i < spans.length; i++){
        const elem=spans[i]
        console.log(elem.innerHTML)
        if(elem.dataset.number && !elem.innerHTML){
            elem.innerHTML = elem.dataset.time + " at #" + elem.dataset.number
        }    
    }
    setTimeout(function() { alert('You can tap on various part of the map and schedule to see where different locations are in the park.\n\nTap "OK" on this messagem then give it a try!'); }, 7000);
}
function make_map(){



    add_area('48,554,188,567','482','558','Gift Shop & Information')
    add_area('48,570,213,582','456','558','Find Your Colonial Relatives')
    add_area('46,586,176,601','427','282','South Meeting House')
    add_area('48,604,174,622','457','196','Josiah Harmar Camp')
    add_area('48,622,181,637','438','174','Andress Weapons, etc.')
    add_area('45,639,173,654','417','150','General Rochambeau')
    add_area('46,656,190,670','395','134','Gov. Bernardo de Galvez')
    add_area('46,672,120,688','370','122','Militiaman')
    add_area('46,691,97,707','380','255','Hatter')
    add_area('48,709,162,725','361','284','Founders’ Corner')
    add_area('44,726,198,744','335','228','The Georges’ Mercantile')
    add_area('46,744,190,760','314','176','Women’s Dress Maker')
    add_area('46,761,146,778','287','154','Cup and Quill')
    add_area('46,778,156,797','226','202','American Camp')
    add_area('47,795,164,812','152','257','Colonial Chocolate')
    add_area('45,815,186,832','114','297','Fighting Quaker Forge')
    add_area('44,831,152,848','141','338','John Paul Jones')
    add_area('46,848,159,864','239','476','Continental Field')
    add_area('46,865,124,881','328','641','The Grove')
    add_area('46,884,189,900','411','647','Historic Conversations')
    add_area('46,900,153,919','475','709','Colonial Games')
    
    add_area('203,661,310,678','470','776','Colonial Chores')
    add_area('205,679,334,696','503','748','Colonial School/Hall')
    add_area('204,696,285,714','498','811','Mayflower')
    add_area('204,713,342,730','537','793','Culper Spy Ring HQ')
    add_area('204,730,288,746','612','705','King’s Field')
    add_area('204,748,334,764','671','744','British Encampment')
    add_area('204,765,281,782','693','792','Laundress')
    add_area('203,783,334,799','712','821','Painted Hog Tavern')
    add_area('204,800,294,817','738','860','Leatherwork')
    add_area('203,818,325,832','762','885','Gray’s Rope Walk')
    add_area('205,835,292,852','796','863','Calligrapher')
    add_area('206,853,298,870','794','824','Basket Maker')
    add_area('204,871,289,885','768','822','Publick Hall')
    add_area('204,888,343,904','781','696','Native American Lore')
    add_area('202,905,295,922','832','910','Frontier Life')
                
    add_area('354,694,456,709','765','959','Carol’s Station')
    add_area('353,728,436,743','690','874','Bookbinder')
    add_area('356,745,432,761','695','928','Print Shop')
    add_area('355,762,452,780','680','996','Paper Making')
    add_area('356,780,447,798','660','1027','Spoon Maker')
    add_area('354,798,432,814','638','1048','Gunsmith')
    add_area('353,816,412,830','607','1043','Potter')
    add_area('358,832,450,850','578','1031','Woodworker')
    add_area('357,849,494,865','564','1001','Wildwood Mercantile')
    add_area('355,867,431,886','546','960','Chandlery')
    add_area('355,886,494,904','543','908','Cooper, Broom Maker')
    add_area('355,902,440,924','577','871','Apothecary')

    add_area('1126,517,1209,542','544','1104','Fiber Prep.')
    add_area('1130,542,1215,577','524','1099','Spinning and Weaving')
    add_area('1128,572,1204,590','482','1122','Bakehouse')
    add_area('1130,590,1228,607','468','1077','Cornish Pasties')
    add_area('1236,524,1345,537','457','1097','Maria’s Lemonade')
    add_area('1237,540,1356,555','448','1135','Brooker’s Ice Cream')
    add_area('1236,557,1306,572','460','1204','Jolley Art')
    add_area('1236,574,1356,591','200','1194','Food Truck Round-up')
    add_area('1235,588,1320,605','194','1107','Dining Area')

add_rect('1162,645,1313,691',place_welcome)
// add_rect('741,783,759,802',place_welcome)
// add_rect('1098,381,1115,403',place_welcome)
// add_rect('439,445,458,464',place_welcome)
// add_rect('420,61,439,79',place_welcome)


add_rect('1142,695,1310,740',place_first_aid)
// add_rect('765,788,784,802',place_first_aid)
// add_rect('413,467,437,486',place_first_aid)
// add_rect('400,62,418,81',place_first_aid)





add_rect('1142,738,1310,788',place_necessary)
// add_rect('847,784,879,817',place_necessary)
// add_rect('1076,227,1104,265',place_necessary)
// add_rect('703,182,732,216',place_necessary)
// add_rect('331,407,360,441',place_necessary)
// add_rect('39,222,67,253',place_necessary)





add_rect('1144,792,1305,840',place_well)
// add_rect('798,621,778,602',place_well)
// add_rect('983,465,1008,491',place_well)
// add_rect('827,451,853,474',place_well)
// add_rect('580,369,608,395',place_well)
// add_rect('695,399,723,423',place_well)
// add_rect('195,357,227,385',place_well)
// add_rect('355,65,384,91',place_well)
// add_rect('1013,653,985,625',place_well)









place_pin(1)

}
