const scale = 0.25
const map_locations={}

function place_necessary(){
    place_pins("The necessary",[[2987,946],[327,1107],[1493,1845],[4465,1139],[3567,3359]])
}
function place_welcome(){
    place_pins("Welcome Table",[[1895,2000],[1821,455],[3103,3349],[4531,1751]])
}
function place_first_aid(){
    place_pins("First-Aid Station",[[1809,2081],[1741,457],[3205,3357]])
}
function place_well(){
    place_pins("Ice Water",[[2941,1829],[1585,491],[957,1663],[2493,1723],[4091,2095],[4105,2731],[3261,2613],[3471,2029]])
}


function place_pins(text,pins){
  for(let x=0;x<pins.length;x++){
    const pin=pins[x]
    place_pin({dataset:{x:Math.round(pin[0]*scale),y:Math.round(pin[1]*scale),name:text}},x===0)
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
    pin.width=Math.round(150*scale)
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
    let left=(x-Math.round(75*scale))+"px"
    let top=(y-Math.round(225*scale))+"px"
    console.log(top,left)

    pin.style.left=left
    pin.style.top=top
    
    label.innerHTML=name

    label.style.left=(parseInt(x)-(label.offsetWidth/2))+"px"
    label.style.top=(parseInt(y)-Math.round(245*scale)-label.offsetHeight)+"px"
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
        coord_array[x]=parseInt(coord_array[x])*scale
    }
    element.coords = coord_array.join()
    element.onclick = func
    if(!show_pointer){
        element.style.cursor='wait'
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
    let c=Math.round(parseInt(x)*scale) + "," + Math.round((parseInt(y)+35)*scale) + "," + Math.round(50*scale)
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
}
function make_map(){

    add_area('200,2190,820,2330','1913','2239','Gift Shop & Festival Information')
add_area('200,2330,820,2400','1820','2239','Brooker’s Ice Cream','2274,1815,2340,1927')
add_area('200,2400,820,2470','1700','1127','South Meeting House','1229,1856,1082,1692')
add_area('200,2470,820,2540','1733','735','Josiah Harmar Camp')
add_area('200,2540,820,2610','1583','539','Louisiana Governor')
add_area('200,2610,820,2680','1489','467','Militiaman','587,1524,332,1443')
add_area('200,2680,820,2750','1471','953','Hatter','1092,1514,954,1387')
add_area('200,2750,820,2820','1397','1171','Founders’ Corner')
add_area('200,2820,820,2890','1331','879','The Georges')
add_area('200,2890,820,2960','1259','709','Cup and Quill')
add_area('200,2960,820,3030','1150','600','Colonial Cooking')
add_area('200,3030,820,3100','1041','475','American Mess')
add_area('200,3100,820,3170','1074','757','American Camp','557,989,760,979,837,1020,1046,867,1224,856,1239,999,1117,999,1112,1050,806,1065,577,1040')
add_area('200,3170,820,3240','900','805','Military Surgeon','781,816,924,969')
add_area('200,3240,820,3353','600','1025','Period Men’s fashion (military and civilian)','893,545,995,703')
add_area('200,3353,820,3423','453','1187','Fighting Quaker Forge','1046,367,1194,484')
add_area('200,3423,820,3493','341','1451','Naval Recruitment','1285,265,1433,377')
add_area('200,3493,820,3563','953','1903','Continental Field','1504,923,2457,1274')
add_area('200,3563,820,3633','1307','2571','Dancing at 1:00, 1:30, 3:30')
add_area('200,3633,820,3703','1389','2562','Lucet Class at 12:30, 4:30')
add_area('821,2609,1430,2725','1745','2679','Historic Conversations')
add_area('821,2725,1430,2795','1911','2825','Children’s Games')
add_area('821,2795,1430,2865','1883','3119','Children’s Chores')
add_area('821,2865,1430,2935','2007','3003','Colonial School','2911,2075,3002,2136')
add_area('821,2935,1430,3005','1971','3257','Mayflower','3273,1993,3420,2100')
add_area('821,3005,1430,3075','2183','3221','Culper Spy Ring HQ')
add_area('821,3075,1430,3145','2439','2819','King’s Field','2615,2314,3064,2590')
add_area('821,3145,1430,3215','2719','3087','British Encampment','2926,2829,3084,3064')
add_area('821,3215,1430,3285','2833','3197','Laundress')
add_area('821,3285,1430,3355','2881','3341','Painted Hog Tavern','3237,2931,3359,3084')
add_area('821,3355,1430,3425','2983','3463','Colonial Living')
add_area('821,3425,1430,3495','3109','3357','Interpreter Camp')
add_area('821,3495,1430,3565','3175','2823','Gray’s Rope Walk','2763,3054,2845,3186')
add_area('821,3565,1430,3705','3063','3837','Carol’s Station, a Frontier Village','3823,3074,3950,3206')
add_area('1431,2805,2000,2875','2725','3303','Smallpox Inoculation','3364,2814,3395,2743,3446,2707,3359,2661,3288,2707')
add_area('1431,2875,2000,2945','2753','3473','Book Binder','3522,2885,3420,2824')
add_area('1431,2945,2000,3015','2733','3595','Historic Documents')
add_area('1431,3015,2000,3085','2883','3597','Calligrapher','3502,2880,3655,2778,3675,2839,3527,2926')
add_area('1431,3085,2000,3155','2755','3755','Print Shop','3828,2972,3711,2819')
add_area('1431,3155,2000,3225','2785','3881','Paper Making')
add_area('1431,3225,2000,3295','2697','3987','Luthier (fiddle maker)','3981,2768,3853,2636')
add_area('1431,3295,2000,3365','2599','4117','Steward’s Woodwork')
add_area('1431,3365,2000,3435','2481','4225','Coffin Maker','4067,2493,4067,2539,4174,2605,4220,2595,4159,2508,4108,2477')
add_area('1431,3435,2000,3505','2359','4200','Potter','4332,2472,4229,2401')
add_area('1431,3505,2000,3575','2251','4031','Chandlery','4169,2386,4042,2228')
add_area('1431,3575,2000,3645','2201','3837','Wildwood Mercantile','3945,2406,3837,2248')
add_area('1431,3645,2000,3715','2205','3685','Broom Maker','3757,2391,3823,2365,3731,2202,3675,2223')
add_area('4557,2113,5000,2183','2205','3573','Cooper','3670,2406,3578,2268')
add_area('4557,2183,5000,2253','2139','3639','Apothecary')
add_area('4557,2253,5000,2323','2207','3453','Basket Maker','3522,2381,3413,2268')
add_area('4557,2323,5000,2393','2071','3881','Pillory','4007,2181,3894,2049')
add_area('4557,2393,5000,2463','2183','4427','Fiber Arts','4495,2411,4374,2254')
add_area('4557,2463,5000,2533','1965','4425','Bakery','4587,2110,4459,1999')
add_area('4557,2533,5000,2603','1841','4243','Maria’s Lemonade')
add_area('5001,2113,5500,2183','1721','4367','Spoon Maker','4475,1866,4344,1734')
add_area('5001,2183,5500,2253','1857','4825','Jolley Art')
add_area('5001,2253,5500,2393','751','4763','Food Truck Round-up','5076,1132,4602,739')
add_area('5001,2393,5500,2463','827','4285','Dining Area')
add_area('5001,2463,5500,2603','371','3415','Military History Motor Pool')

add_rect('4577,2722,5336,2967',place_welcome)
add_rect('1790,469,1866,545',place_welcome)
add_rect('1846,2003,1943,2095',place_welcome)
add_rect('4495,1749,4577,1845',place_welcome)
add_rect('3059,3354,3150,3446',place_welcome)

add_rect('4577,2967,5336,3201',place_first_aid)
add_rect('1693,459,1790,551',place_first_aid)
add_rect('1764,2088,1851,2164',place_first_aid)
add_rect('3166,3362,3247,3438',place_first_aid)

add_rect('4577,3201,5336,3456',place_necessary)
add_rect('256,1121,373,1254',place_necessary)
add_rect('2906,948,3043,1101',place_necessary)
add_rect('1433,1856,1555,1998',place_necessary)
add_rect('4404,1127,4531,1305',place_necessary)
add_rect('3502,3354,3639,3517',place_necessary)

add_rect('4572,3456,5336,3665',place_well)
add_rect('1530,477,1652,594',place_well)
add_rect('903,1675,1020,1771',place_well)
add_rect('2442,1720,2554,1822',place_well)
add_rect('2885,1822,3008,1935',place_well)
add_rect('3420,2026,3527,2128',place_well)
add_rect('4037,2093,4144,2195',place_well)
add_rect('4047,2725,4154,2837',place_well)
add_rect('3201,2618,3308,2720',place_well)
add_rect('5754,3788,6,0',clear_all_pins,false)

place_pin(1)

}
