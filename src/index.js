import "./styles.css";
import "./water.css"
import {changeUnit} from './utils'
const $ = (arg)=>Array.prototype.slice.call(document.querySelectorAll.bind(document)(arg))

var rpcurl = "http://localhost:6800/jsonrpc"

function info(msg = "No Message"){
  $("#info")[0].innerText = msg
}
async function cmd(method,obj) {
  let data = {
    jsonrpc: "2.0",
    method,
    id: 1,
    ...obj
  }
  try {
    let rst = await fetch(rpcurl, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
    })
  
  
    const json = await rst.json()
    return json
  } catch (error) {
    console.log(error)
    throw error("无法接受的指令")
  }
}

const tasks = $("#tasks")[0]
const _item = (task) => {
  const stateMap ={
    active: "▶",
    paused: "⏸",
    complete: "🆗",
    removed:"❌"
  }
  const file = task.files[0]
  const fileName = file.path
  // console.log(task)

  return `
  <tr>
			<td>${stateMap[task.status]}${fileName}</td>
			<td>${changeUnit(task.completedLength,task.totalLength).join("/")}</td>
			<td>${file.uris.filter(it => it.status==="used").length}</td>
			<td class="ctl" gid="${task.gid}"><button>⏸</button> <button>▶</button><button>❌</button></td>
	</tr>
  `
}

function adduri(url){
    cmd("aria2.addUri",{
      params:[[url]]
    }).then(resp=>{
      if(resp.error){
        info(resp.error.message)
      }
    })
}

function scan(){
  
  function taskCmd(name,id){
    return () => cmd(name,{
      params:[id]
    })
  }
  
  $("#tasks .ctl").forEach(it =>{
    const id = it.getAttribute("gid")
    const btns = it.querySelectorAll("button")
    btns[0].addEventListener("click", taskCmd("aria2.pause",id))
    btns[1].addEventListener("click", taskCmd("aria2.unpause",id))
    btns[2].addEventListener("click", async ()=>{
      await taskCmd("aria2.remove",id)()
      taskCmd("aria2.removeDownloadResult",id)()
    })
  })
}

$("#adduri")[0].addEventListener("click",()=>{
  const uri = $("#uri")[0].value
  adduri(uri)
})

setInterval(async ()=>{
  const active = await cmd("aria2.tellActive")
  const waiting = await cmd("aria2.tellWaiting",{params:[0,1000]})
  const stopped = await cmd("aria2.tellStopped",{params:[0,1000]})
  tasks.innerHTML = active.result.map(it => _item(it)).join("\n")
  tasks.innerHTML += waiting.result.map(it => _item(it)).join("\n")
  tasks.innerHTML += stopped.result.map(it => _item(it)).join("\n")
  const state  = (await cmd("aria2.getGlobalStat")).result
  document.title = `⬇${changeUnit(state.downloadSpeed)} ⬆${changeUnit(state.uploadSpeed)}`
  scan()
},2000);

(async function(){
  const conf = await cmd("aria2.getGlobalOption")
  var list = ""
  for(const key in conf.result){
    list += `<tr><td>${key}</td><td>${conf.result[key]}</td></tr>`
  }
  $("#conf")[0].innerHTML = list
})()

// navigator.serviceWorker.register('../sw.js')