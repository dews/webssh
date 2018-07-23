Terminal.applyAddon(fit)
const term = new Terminal({
  cols: 80,
  rows: 24,
})
const ws = new WebSocket('ws://10.137.1.175:8999')

ws.addEventListener('open', function () {
    console.info('WebSocket connected')
})
ws.addEventListener('message', function (event) {
    console.debug('Message from server ', event.data)
    try { 
        let output= JSON.parse(event.data)
        term.write(output.output)
    }
    catch (e) {
	console.error(e)
    }
})

term.open(document.getElementById('terminal'))

term.on('data', data => ws.send(JSON.stringify({"input":data})))

window.addEventListener('resize', () => {
  term.fit()
})

term.fit()
term.on('resize', size => {
  console.debug('resize')
  let resizer = JSON.stringify({"resizer":[size.cols, size.rows]})
  ws.send(resizer)
})
