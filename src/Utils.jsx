import * as THREE from 'three';
import { extend } from "@react-three/fiber"
import { useCsvDataStore } from "./Store"
import { MeshLine, MeshLineMaterial } from 'three.meshline'
import { MeshLineGeometry } from 'meshline'
import { ConstNode } from 'three/examples/jsm/nodes/Nodes.js';
extend({ MeshLine, MeshLineMaterial, MeshLineGeometry })

export function csvToArr(stringVal, splitter) {
    const [keys, ...rest] = stringVal
      .trim()
      .split("\n")
      .map((item) => item.split(splitter));
  
    const formedArr = rest.map((item) => {
      const object = {};
      keys.forEach((key, index) => (object[key] = item.at(index)));
      return object;
    });
    return formedArr;
}

export const readUploadedFileAsText = (inputFile) => {
    const temporaryFileReader = new FileReader();
    
    return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
        };
    
        temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
        };
        temporaryFileReader.readAsText(inputFile);
    });
};

export function hexToRgbA(hex, alpha){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+ alpha.toString() +')';
    }
    throw new Error('Bad Hex');
}

export function getPointsBetweenTgtMRM(index, missileName, tgtName){
    const missilePoint = new THREE.Vector3(
        useCsvDataStore.getState().data[index][missileName + ".pos.y[m]"]/1000,
        -useCsvDataStore.getState().data[index][missileName + ".pos.z[m]"]/1000,
        useCsvDataStore.getState().data[index][missileName + ".pos.x[m]"]/1000)
    const tgtPoint = new THREE.Vector3(
        useCsvDataStore.getState().data[index][tgtName + ".pos.y[m]"]/1000,
        -useCsvDataStore.getState().data[index][tgtName + ".pos.z[m]"]/1000,
        useCsvDataStore.getState().data[index][tgtName + ".pos.x[m]"]/1000)
    const points = []
    for(let i = 0; i < 11; i++){
        const scale = i/(11-1)
        points.push(new THREE.Vector3((tgtPoint.x-missilePoint.x)*scale + missilePoint.x, (tgtPoint.y-missilePoint.y)*scale + missilePoint.y, (tgtPoint.z-missilePoint.z)*scale + missilePoint.z))
    }
    return points
}
  
export function getGradationLineMeshMaterial(width, colorStop) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    let h = 64;
    let w = 128;

    canvas.width = w;
    canvas.height = h;
    ctx.lineWidth = width;

    let gradient = ctx.createLinearGradient(0, 0, w, 0);

    colorStop.forEach(([position, color]) => gradient.addColorStop(position, color));

    ctx.strokeStyle = gradient;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.shadowBlur = 40;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = '#00ff00';

    let texture = new THREE.Texture(canvas);

    texture.needsUpdate = true;

    let material = new MeshLineMaterial({
        useMap: true,
        map: texture,
        lineWidth: width,
        transparent: true,
        side: THREE.FrontSide,
        depthTest: true,
        opacity: .8
    });

    return material;
}

export function getLinkPoints(index, blueName, RedName){
    const bluePoint = new THREE.Vector3(
        useCsvDataStore.getState().data[index][blueName + ".pos.y[m]"]/1000,
        -useCsvDataStore.getState().data[index][blueName + ".pos.z[m]"]/1000,
        useCsvDataStore.getState().data[index][blueName + ".pos.x[m]"]/1000)
    const redPoint = new THREE.Vector3(
        useCsvDataStore.getState().data[index][RedName + ".pos.y[m]"]/1000,
        -useCsvDataStore.getState().data[index][RedName + ".pos.z[m]"]/1000,
        useCsvDataStore.getState().data[index][RedName + ".pos.x[m]"]/1000)
    const points = []
    for(let i = 0; i < 11; i++){
        const scale = i/(11-1)
        points.push(new THREE.Vector3((redPoint.x-bluePoint.x)*scale + bluePoint.x, (redPoint.y-bluePoint.y)*scale + bluePoint.y, (redPoint.z-bluePoint.z)*scale + bluePoint.z))
    }
    return points
}


export function TimeFormat(duration) {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
  
    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";
  
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
  
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
  
    return ret;
  }


export function getBattleStats(data, file){
    const dT = 0.05
    const numMRM = 4
    const result = {Blue1:{}, Blue2:{}, Red1:{}, Red2:{}};
    const Drones = ["Blue1","Blue2","Red1","Red2"]
    let eventLog = [] // ex. "XX:XX Blue1 fired Missile1", "XX:XX Blue1 missed Missile1", 

    Drones.forEach((d, di) => {
        let penalty = 0
        let MRMstate = [1,1,1,1]
        let Hitstate = ["","","",""]
        let isKilled = ""
        let initPos = [0,0,0]
        let scoreHist = []
        let score = 0
        let isOutsideState = []
        let fireIndex = [-1,-1,-1,-1]
        let fireEndIndex = [-1,-1,-1,-1]
        let isAliveEndIndex = -1
        const DroneName = d
            const TeamName = DroneName.slice(0,-1)
            let OpponentTeam
            if(TeamName=="Blue"){
                OpponentTeam = "Red/Red"
            }else{
                OpponentTeam = "Blue/Blue"
            }
        data.forEach((el, i) => {
            if(di==0){
                eventLog.push([])
            }
            
            if(i==data.length-1){
                result[DroneName].isAlive = (el[TeamName + "/" + DroneName + ".isAlive"]=="True")
            }

            // when not alive
            if((data[i][TeamName + "/" + DroneName + ".isAlive"]=="False")&&(data[i-1][TeamName + "/" + DroneName + ".isAlive"]=="True")){
                isAliveEndIndex = i
            }
            result[DroneName].isAliveEndIndex = isAliveEndIndex

            // MRM
            for(let j=0; j<numMRM; j++){
                if(el[TeamName + "/" + DroneName + ":Missile" + (j+1).toString() + ".isFlying"] == "True"){
                    MRMstate[j] = 0 
                    if(data[i-1][TeamName + "/" + DroneName + ":Missile" + (j+1).toString() + ".isFlying"] == "False"){
                        eventLog[i].push(TimeFormat(el["Time[s]"]) + " [FOX 3] " + DroneName + " fired Missile" + (j+1).toString()) // ex. "XX:XX Blue1 fired Missile1"
                        fireIndex[j] = i 
                    }
                }
            }
            result[DroneName].mrm = MRMstate
            result[DroneName].fireIndex = fireIndex

            // Penalty
            if(el[TeamName + "/" + DroneName + ".pos.x[m]"]/1000 > 25){
                isOutsideState.push(true)
                penalty += -0.01*dT*Math.abs(el[TeamName + "/" + DroneName + ".pos.x[m]"]/1000-25)
                score += -0.01*dT*Math.abs(el[TeamName + "/" + DroneName + ".pos.x[m]"]/1000-25)
            }else if(el[TeamName + "/" + DroneName + ".pos.x[m]"]/1000 < -25){
                isOutsideState.push(true)
                penalty += -0.01*dT*Math.abs(el[TeamName + "/" + DroneName + ".pos.x[m]"]/1000+25)
                score += -0.01*dT*Math.abs(el[TeamName + "/" + DroneName + ".pos.x[m]"]/1000-25)
            }else{
                isOutsideState.push(false)
            }
            result[DroneName].penalty = penalty

            // PenaltyLog
            if(isOutsideState[i] && !isOutsideState[i-1]){
                eventLog[i].push(TimeFormat(el["Time[s]"]) + " [PENALTY] " + DroneName + " flies outside the designated airspace") 
            }else if(!isOutsideState[i] && isOutsideState[i-1]){
                eventLog[i].push(TimeFormat(el["Time[s]"]) + " [PENALTY] " + DroneName + " flies back to the designated airspace")
            }

            // HIT
            if(i>0){
                for(let j=0; j<numMRM; j++){
                if((el[TeamName + "/" + DroneName +  ":Missile" + (j+1).toString() + ".isFlying"]=="False") && (data[i-1][TeamName + "/" + DroneName + ":Missile" + (j+1).toString() + ".isFlying"] =="True")){
                        fireEndIndex[j] = i
                        const target = data[i-1][TeamName + "/" + DroneName + ":Missile" + (j+1).toString() + ".target.truth"]
                        if((el[target + ".isAlive"]=="False") && (data[i-1][target + ".isAlive"]=="True")){
                            Hitstate[j] = target
                            score += 1 // add 1 for hit target
                            eventLog[i].push(TimeFormat(el["Time[s]"]) + " [SPLASH] " + DroneName+ ":Missile" + (j+1).toString() + " splashed " + target)
                        }
                    } 
                }
            }
            result[DroneName].Hit = Hitstate
            result[DroneName].fireEndIndex = fireEndIndex
            
            // Killed
            if(i>0){
                for(let j=0; j<numMRM; j++){
                    //red1
                    if((el[OpponentTeam + "1:Missile" + (j+1).toString() + ".isFlying"]=="False") && (data[i-1][OpponentTeam + "1:Missile" + (j+1).toString() + ".isFlying"] =="True")){
                        const target = data[i-1][OpponentTeam + "1:Missile" + (j+1).toString() + ".target.truth"]
                        if(target == TeamName + "/" + DroneName){
                            if((el[TeamName + "/" + DroneName + ".isAlive"]=="False") && (data[i-1][TeamName + "/" + DroneName + ".isAlive"] =="True")){
                                //console.log(DroneName + ' is killed by 1') 
                                isKilled = OpponentTeam + "1:Missile" + (j+1).toString()
                                score += -1 // add -1 for being killed
                            }
                        }
                        
                    }
                    //red2
                    if((el[OpponentTeam + "2:Missile" + (j+1).toString() + ".isFlying"]=="False") && (data[i-1][OpponentTeam + "2:Missile" + (j+1).toString() + ".isFlying"] =="True")){
                        const target = data[i-1][OpponentTeam + "2:Missile" + (j+1).toString() + ".target.truth"]
                        if(target == TeamName + "/" + DroneName){
                            if((el[TeamName + "/" + DroneName + ".isAlive"]=="False") && (data[i-1][TeamName + "/" + DroneName + ".isAlive"] =="True")){
                                //console.log(DroneName + ' is killed by 2') 
                                isKilled = OpponentTeam + "2:Missile" + (j+1).toString()
                                score += -1 // add -1 for being killed
                            }
                        }
                    }
                }
            }
            result[DroneName].isKilled = isKilled
            
            
            // initPos
            if(i==0){
                initPos[0]=data[i][TeamName + "/" + DroneName + ".pos.x[m]"]/1000
                initPos[1]=data[i][TeamName + "/" + DroneName + ".pos.y[m]"]/1000
                initPos[2]=data[i][TeamName + "/" + DroneName + ".att.yaw[rad]"]*180/Math.PI
                result[DroneName].initPos = initPos
                eventLog[i].push(TimeFormat(el["Time[s]"]) + " [START] " + DroneName + " starts X: " + initPos[0].toFixed(1).toString() + " [km], Y: " + initPos[1].toFixed(1).toString() + " [km], Heading: " + initPos[2].toFixed(1).toString()+ " [deg]")
            }
            

            // append score history
            scoreHist.push(score)
        })
        result[DroneName].scoreHist = scoreHist
        if(TeamName =="Blue"){
            result[DroneName].agentName = file.nameB 
        }else{
            result[DroneName].agentName = file.nameR 
        }

        // shoot distribution
        let targetPosData = []
        result[DroneName].fireIndex.forEach((el, i)=>{
            if(el>0){
                const target = data[el][TeamName + "/" + DroneName + ":Missile" + (i+1).toString() + ".target.truth"]
                let x = (data[el][target + ".pos.x[m]"] - data[el][TeamName + "/" + DroneName + ".pos.x[m]"])/1000
                let y = (data[el][target + ".pos.y[m]"] - data[el][TeamName + "/" + DroneName + ".pos.y[m]"])/1000
                let z = (data[el][target + ".pos.z[m]"] - data[el][TeamName + "/" + DroneName + ".pos.z[m]"])/1000
                let roll = data[el][TeamName + "/" + DroneName + ".att.roll[rad]"]
                let pitch = data[el][TeamName + "/" + DroneName + ".att.pitch[rad]"]
                let yaw = data[el][TeamName + "/" + DroneName + ".att.yaw[rad]"]

                const x_local = Math.cos(pitch)*Math.cos(yaw)*x + Math.cos(pitch)*Math.sin(yaw)*y - Math.sin(pitch)*z
                const y_local = (Math.sin(roll)*Math.sin(pitch)*Math.cos(yaw) - Math.cos(roll)*Math.sin(yaw))*x 
                            + (Math.sin(roll)*Math.sin(pitch)*Math.sin(yaw) + Math.cos(roll)*Math.cos(yaw))*y 
                            + Math.sin(roll)*Math.cos(pitch)*z
                const z_local = (Math.cos(roll)*Math.sin(pitch)*Math.cos(yaw) + Math.sin(roll)*Math.sin(yaw))*x 
                    + (Math.cos(roll)*Math.sin(pitch)*Math.sin(yaw) - Math.sin(roll)*Math.cos(yaw))*y 
                    + Math.cos(roll)*Math.cos(pitch)*z

                targetPosData.push({pos: [x_local, y_local, z_local], isHit: (result[DroneName].Hit[i]!=='') ? true : false})
            }
        })
        result[DroneName].shootData = targetPosData

        // vulnerability distribution
        targetPosData = []
        result[DroneName].fireIndex.forEach((el, i)=>{
            if(el>0){
                const target = data[el][TeamName + "/" + DroneName + ":Missile" + (i+1).toString() + ".target.truth"]
                let x = (data[el][TeamName + "/" + DroneName + ".pos.x[m]"] - data[el][target + ".pos.x[m]"])/1000
                let y = (data[el][TeamName + "/" + DroneName + ".pos.y[m]"] - data[el][target + ".pos.y[m]"])/1000
                let z = (data[el][TeamName + "/" + DroneName + ".pos.z[m]"] - data[el][target + ".pos.z[m]"])/1000

                targetPosData.push({pos: [x, y, z], isHit: (result[DroneName].Hit[i]!=='') ? true : false})
            }
        })
        result[DroneName].vulnerabilityData = targetPosData
 
    })
    result.scoreBlue = result.Blue1.scoreHist[result.Blue1.scoreHist.length - 1] + result.Blue2.scoreHist[result.Blue2.scoreHist.length - 1]
    result.scoreRed = result.Red1.scoreHist[result.Red1.scoreHist.length - 1] + result.Red2.scoreHist[result.Red2.scoreHist.length - 1]

    result.eventLog = eventLog
    result.missionTime = TimeFormat(+data[data.length -1]["Time[s]"])
    result.missionTimeSec = +data[data.length -1]["Time[s]"]

    // Event log at end 
    if(result.scoreBlue>result.scoreRed){
        eventLog[data.length -1].push(result.missionTime + " [END] " + " Blue WIN")
    }else if(result.scoreBlue<result.scoreRed){
        eventLog[data.length -1].push(result.missionTime + " [END] " + " Red WIN")
    }else if(result.scoreBlue==result.scoreRed){
        eventLog[data.length -1].push(result.missionTime + " [END] " + " DRAW")
    }

    // Hit ratio
    Drones.forEach((d, di) => {
        let remainMRM = result[d].mrm.reduce((accumulator, currentValue) => {
            return accumulator + currentValue
        },0);
        let hits = result[d].Hit.reduce((accumulator, currentValue) => {
            if (currentValue == ""){
                return accumulator + 0
            }else{
                return accumulator + 1
            } 
        },0);
        let trials = numMRM - remainMRM
        if(trials==0){
            result[d].HitRatio = 0
        }else{
            result[d].HitRatio = hits / trials
        }
        
    })
    result.HitRatioBlue = (result.Blue1.HitRatio + result.Blue2.HitRatio)/2
    result.HitRatioRed = (result.Red1.HitRatio + result.Red2.HitRatio)/2
    
    //AveDistMRMLaunch: 3.55

    //AveDistMRMbeingLaunched: 3.55

    return result
}


export function analyzeMiscData(csvArr){
    const name = ["Blue/Blue1", "Blue/Blue2", "Red/Red1", "Red/Red2"]

    const newArr = csvArr.map((el, index)=>{
        for(let i=0; i<name.length; i++){
            el[name[i] + ".vt[m/s]"] = getVt(name[i], el)
            el[name[i] + ".Mach"] = getMachNum(name[i], el)
            el[name[i] + ".u[m/s]"] = getLocalSpeed(name[i], el).u
            el[name[i] + ".v[m/s]"] = getLocalSpeed(name[i], el).v
            el[name[i] + ".w[m/s]"] = getLocalSpeed(name[i], el).w
            el[name[i] + ".AOA[deg]"] = getAOA(name[i], el)
            el[name[i] + ".Beta[deg]"] = getBeta(name[i], el)
            el[name[i] + ".Gz"] = getGForce(name[i], el).z                   
        }
        return el
    })

    for(let i=0; i<name.length; i++){
        let RemainingMRM = 4
        for(let j=0; j<newArr.length; j++){
            if(isFiredMRM(name[i], newArr, j)){
                RemainingMRM += -1
            }
            newArr[j][name[i] + ".MRM"] = RemainingMRM
        }
    }
    //console.log(newArr)
    return newArr
}

function getVt(name, element){
    let vx = +element[name + ".vel.x[m/s]"]
    let vy = +element[name + ".vel.y[m/s]"]
    let vz = +element[name + ".vel.z[m/s]"]
    return Math.pow((vx*vx+vy*vy+vz*vz),0.5)
}

function getISATemp(height){
    if(height>11000){
        return -56; // const -56C from 11km to 25km
    }else{
        return 15 - 6.5 * height/1000;
    }
}

function getSoundSpeed(temp){
    const absTemp = temp + 273.15;
    return Math.sqrt(1.4 * 286 * absTemp);
}

function getMachNum(name, element){
    const vt = getVt(name, element);
    const name_height = name + '.pos.z[m]';
    const height = -element[name_height];
    const temp = getISATemp(height);
    const a = getSoundSpeed(temp);
    return +(vt/a).toFixed(2);
}

function getLocalSpeed(name, element){
    const roll = +element[name + '.att.roll[rad]']
    const pitch = +element[name + '.att.pitch[rad]']
    const yaw = +element[name + '.att.yaw[rad]']
    const vx = +element[name + '.vel.x[m/s]']
    const vy = +element[name + '.vel.y[m/s]']
    const vz = +element[name + '.vel.z[m/s]']
    
    const u = Math.cos(pitch)*Math.cos(yaw)*vx + Math.cos(pitch)*Math.sin(yaw)*vy - Math.sin(pitch)*vz
    const v = (Math.sin(roll)*Math.sin(pitch)*Math.cos(yaw) - Math.cos(roll)*Math.sin(yaw))*vx 
                + (Math.sin(roll)*Math.sin(pitch)*Math.sin(yaw) + Math.cos(roll)*Math.cos(yaw))*vy 
                + Math.sin(roll)*Math.cos(pitch)*vz
    const w = (Math.cos(roll)*Math.sin(pitch)*Math.cos(yaw) + Math.sin(roll)*Math.sin(yaw))*vx 
        + (Math.cos(roll)*Math.sin(pitch)*Math.sin(yaw) - Math.sin(roll)*Math.cos(yaw))*vy 
        + Math.cos(roll)*Math.cos(pitch)*vz


    return {u: u, v: v, w: w};
}

function getAOA(name, element){
    let localSpeed = new THREE.Vector3();
    localSpeed = getLocalSpeed(name, element);
    let AOA = Math.atan2(localSpeed.w, localSpeed.u)*180/Math.PI;
    return +AOA.toFixed(1);
}

function getBeta(name, element){
    let vt = getVt(name, element)
    let localSpeed = new THREE.Vector3();
    localSpeed = getLocalSpeed(name, element);
    let Beta = Math.asin((localSpeed.v/vt))*180/Math.PI;
    return +Beta.toFixed(1);
}

function getGForce(name, element){
    let localSpeed = getLocalSpeed(name, element);
    let p_dot = +element["Blue/Blue1.omega.x[rad/s]"] - element["Blue/Blue1.omega.z[rad/s]"]*Math.sin(+element["Blue/Blue1.att.pitch[rad]"])
    let q_dot = +element["Blue/Blue1.omega.y[rad/s]"]*Math.cos(+element["Blue/Blue1.att.roll[rad]"]) + element["Blue/Blue1.omega.z[rad/s]"]*Math.sin(+element["Blue/Blue1.att.roll[rad]"])*Math.cos(+element["Blue/Blue1.att.pitch[rad]"])
    let r_dot = -element["Blue/Blue1.omega.y[rad/s]"]*Math.sin(+element["Blue/Blue1.att.roll[rad]"]) + element["Blue/Blue1.omega.z[rad/s]"]*Math.cos(+element["Blue/Blue1.att.roll[rad]"])*Math.cos(+element["Blue/Blue1.att.pitch[rad]"])
    
    const gx = (q_dot*localSpeed.w - r_dot*localSpeed.v)/9.80665
    const gy = (r_dot*localSpeed.u - p_dot*localSpeed.w)/9.80665
    const gz = (p_dot*localSpeed.v - q_dot*localSpeed.u)/9.80665
    /*
    const gx = (r_dot*localSpeed.v - q_dot*localSpeed.w)/9.80665.toFixed(1)
    const gy = (p_dot*localSpeed.w - r_dot*localSpeed.u)/9.80665.toFixed(1)
    const gz = (q_dot*localSpeed.u - p_dot*localSpeed.v)/9.80665.toFixed(1)
    */
    return {x: gx.toFixed(1), y: gy.toFixed(1), z: (gz+1).toFixed(1)}
}


function isFiredMRM(name, arr, index){
    const numMRM=4
    for(let j=0; j<numMRM; j++){
        if(arr[index][name + ":Missile" + (j+1).toString() + ".isFlying"] == "True"){
            if(arr[index-1][name + ":Missile" + (j+1).toString() + ".isFlying"] == "False"){
                return true
            }
        }
    }
}

import { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import "./styles.css";

export default function Resizable({ direction, children }){
  let resizableProps
  const [innerHeight, setInnerHeight] = useState(window.innerWidth);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);
  const [height, setHeight] = useState(window.innerHeight * 0.75);

  useEffect(() => {
    let timer

    const resizeWindow = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
        if (window.innerHeight * 0.75 < height) {
            setHeight(window.innerHeight * 0.75);
          }
      }, 100);
    };
    window.addEventListener("resize", resizeWindow);

    return () => {
      window.removeEventListener("resize", resizeWindow);
    };
  }, []);

  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      width,
      height: Infinity,
      resizeHandles: ["e"],
      onResizeStop: (event, data) => {
        console.log(data);
        setWidth(data.size.width);
      }
    };
  } else {
    resizableProps = {
      className: "resize-vertical",
      minConstraints: [Infinity, 24],
      maxConstraints: [Infinity, innerHeight * 0.9],
      width: Infinity,
      height: 300,
      resizeHandles: ["n"],
      onResizeStop: (event, data) => {
        console.log(data);
        setHeight(data.size.height);
      }
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

