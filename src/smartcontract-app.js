const bel = require("bel")
const ethers = require('ethers')
const glossary = require('glossary')
const loadingAnimation = require('loadingAnimation')
const makeDeployReceipt = require('makeDeployReceipt')
const getArgs = require('getArgs')
const makeReturn = require('makeReturn')
const inputPayable = require("input-payable")

const { 
  css,
  injectHeadStyles
} = require('./css');
const {
  generateInputContainer,
  getContractFunctions,
  getConstructorInput
} = require('./components');
const colors = require('theme')
//const theme = require('theme')
//const setTheme = require('setTheme')
//setTheme(theme())

injectHeadStyles();
/******************************************************************************
  ETHERS
******************************************************************************/

window.ethers = ethers //@TODO remove after crosslink
var provider
var contract

async function getProvider() {
  if (window.web3 && window.web3.currentProvider) {
    try {
      // Acccounts now exposed
      provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
      // Request account access if needed
      await ethereum.enable();
    } catch (error) {
      console.log(error)
    }
  } else {
    window.open("https://metamask.io/")
  }
  return provider
}

// Helpers
function getConstructorName(solcMetadata) {
  if (solcMetadata.name) return solcMetadata.name;
  var file = Object.keys(solcMetadata.settings.compilationTarget)[0]
  return solcMetadata.settings.compilationTarget[file]
}
/*--------------------
      PAGE
--------------------*/
module.exports = displayContractUI;
// needed for greasy react hack
window.displayContractUI = displayContractUI;

function displayContractUI(result) {
  // in case of address bound contracts, do not allow deploys
  if (result[0].name && result[0].address) {
    return modularDisplayContractUI(result);
  } else {
    return displayContractUIFull(result);
  }
}

function modularDisplayContractUI(result) {
  var opts = {
    metadata: {
      compiler: { },
      name: result[0].name,
      address: result[0].address,
      language: null,
      output: {
        abi: result[0].abi
      },
      bytecode: null,
      settings: {},
      sources: { }
    }
  }
  var solcMetadata = opts.metadata
  var metadata = {
    compiler: null,
    compilationTarget: null,
    constructorName: solcMetadata.name,
    constructorInput: null,
    functions: getContractFunctions(solcMetadata),
    address: solcMetadata.address,
    bytecode: solcMetadata.bytecode,
    abi: solcMetadata.output.abi
  }
  return _displayContractUI(metadata);
}

function displayContractUIFull(result) {
  var opts = {
    metadata: {
      compiler: { version: result[0].compiler.version },
      language: result[0].compiler.language,
      address: result[0].address,
      output: {
        abi: result[0].abi,
        devdoc: result[0].metadata.devdoc,
        userdoc: result[0].metadata.userdoc
      },
      bytecode: result[0].binary.bytecodes.bytecode,
      settings: {
        compilationTarget: { '': result[0].sources.compilationTarget },
        evmVersion: result[0].compiler.evmVersion,
        libraries: result[0].sources.libraries,
        optimizer: { enabled: result[0].compiler.optimizer, runs: result[0].compiler.runs },
        remapings: result[0].sources.remappings
      },
      sources: { '': result[0].sources.sourcecode }
    }
  }
  var solcMetadata = opts.metadata
  var metadata = {
    compiler: solcMetadata.compiler.version,
    compilationTarget: solcMetadata.settings.compilationTarget,
    constructorName: getConstructorName(solcMetadata),
    constructorInput: getConstructorInput(solcMetadata),
    functions: getContractFunctions(solcMetadata),
    address: solcMetadata.address,
    bytecode: solcMetadata.bytecode,
    abi: solcMetadata.output.abi
  }

  return _displayContractUI(metadata);
}

function _displayContractUI(metadata) {   // compilation result metadata

  if (!metadata) {
    return  bel`
    <div class=${css.preview}>
      <div class=${css.error}>
        <div class=${css.errorTitle}>error <i class="${css.errorIcon} fa fa-exclamation-circle"></i></div>
        ${opts}
      </div>
    </div>
    `
  }

  if (!Array.isArray(metadata)) {
    //@TODO remove after crosslink
    window.abi = metadata.abi;
    window.bytecode = metadata.bytecode;

    function sort (functions) {
      return functions.filter(x => x.type === 'function').sort((a, b) => {
        var d=type2num(a) - type2num(b)
        if (d==0) {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
        }
        return d
      })
    }

    function type2num ({ stateMutability: sm }) {
      if (sm === 'view') return 1
      if (sm === 'nonpayable') return 2
      if (sm === 'pure') return 3
      if (sm === 'payable') return 4
      if (sm === undefined) return 5
    }

    var sorted = sort(metadata.functions)

    function functions (fn) {
      var label = fn.stateMutability
      var fnName = bel`<a title="${glossary(label)}" class=${css.fnName}><div class=${css.name}>${fn.name}</div></a>`
      var title = bel`<div class=${css.title} onclick=${e=>toggle(e, null, null)}>${fnName}</div>`
      var send = bel`<div class=${css.send} onclick=${e => sendTx(fn.name, label, e)}><i class="${css.icon} fa fa-arrow-circle-right"></i></div>`
      var functionClass = css[label]
      var el = bel`
      <div class=${css.fnContainer}>
        <div class="${functionClass} ${css.function}">
          ${title}
          <ul class=${css.visible}>
            ${fn.inputs}
            ${send}
          </ul>
        </div>
      </div>`
      if (label === 'payable')  send.parentNode.prepend(inputPayable(label))
      return el
    }

    async function sendTx (fnName, label, e) {
      var loader = bel`<div class=${css.txReturnItem}>Awaiting network confirmation ${loadingAnimation(colors)}</div>`
      var container = e.target.parentNode.parentNode.parentNode.parentNode
      var txReturn = container.querySelector("[class^='txReturn']") || bel`<div class=${css.txReturn}></div>`
      if (contract) {  // if deployed
        container.appendChild(txReturn)
        txReturn.appendChild(loader)
        let signer = await provider.getSigner()
        var allArgs = getArgs(container, 'inputContainer')
        var args = allArgs.args
        const contractType = contract.interface.functions[fnName].type
        let opts = {
          contract,
          metadata,
          provider,
          fnName
        }
        if (contractType === 'transaction') {
          const callableTx = await makeContractCallable (contract, fnName, provider, args, allArgs)
          opts.tx = callableTx
          opts.typeTransaction = true
          try {
            let contractAsCurrentSigner = contract.connect(signer)
            if (allArgs.overrides) { await contractAsCurrentSigner.functions[fnName](...args, allArgs.overrides) }
            else { await contractAsCurrentSigner.functions[fnName](...args) }
          } catch (e) { txReturn.children.length > 1 ? txReturn.removeChild(loader) : container.removeChild(txReturn) }
        } else {
          opts.typeTransaction = false
          try {
            let contractAsCurrentSigner = contract.connect(signer)
            if (allArgs.overrides) { opts.tx = await contractAsCurrentSigner.functions[fnName](...args, allArgs.overrides) }
            else { opts.tx = await contractAsCurrentSigner.functions[fnName](...args) }
          } catch (e) { txReturn.children.length > 1 ? txReturn.removeChild(loader) : container.removeChild(txReturn) }
        }
        loader.replaceWith(await makeReturn(opts))
      } else {
        let deploy = document.querySelector("[class^='deploy']")
        deploy.classList.add(css.bounce)
        setTimeout(()=>deploy.classList.remove(css.bounce), 3500)
      }
    }

    async function makeContractCallable (contract, fnName, provider, args, allArgs) {
      const fn = contract.interface.functions[fnName]
      if (fn.outputs.length > 0) {
        const signature = fn.signature
        const address = contract.address
        const type = fn.outputs[0].type
        let contractCallable = new ethers.Contract(address, [
          `function ${signature} constant returns(${type})`
        ], provider)
        let signer = await provider.getSigner()
        const callableAsCurrentSigner = await contractCallable.connect(signer)
        try {
          const callableFn =callableAsCurrentSigner.functions[fnName]
          return await callableFn(...args)
        } catch (e) { console.log(e) }
      } else return []
    }

    function toggleAll (e) {
      var fnContainer = e.currentTarget.parentElement.parentElement.children[2]
      var constructorToggle = e.currentTarget.children[0]
      var constructorIcon = constructorToggle.children[0]
      constructorToggle.removeChild(constructorIcon)
      var minus = bel`<i class="fa fa-minus-circle" title="Collapse">`
      var plus = bel`<i class="fa fa-plus-circle title='Expand to see the details'">`
      var icon = constructorIcon.className.includes('plus') ? minus : plus
      constructorToggle.appendChild(icon)
      for (var i = 0; i < fnContainer.children.length; i++) {
        var fn = fnContainer.children[i]
        var e = fn.children[0]
        toggle(e, fn, constructorIcon)
      }
    }

    function toggle (e, fun, constructorIcon) {
      var fn
      var toggleContainer
      function removeLogs (el) {
        var txReturn = el.parentNode.querySelectorAll("[class^='txReturn']")[0]
        if (txReturn) {
          txReturn.classList.remove(css.visible)
          txReturn.classList.add(css.hidden)
          txReturn.style.minHeight = 0
        }
      }
      function addLogs (el) {
        var txReturn = el.parentNode.querySelectorAll("[class^='txReturn']")[0]
        if (txReturn) {
          txReturn.classList.remove(css.hidden)
          txReturn.classList.add(css.visible)
          txReturn.style.minHeight = '80px'
        }
      }
      // TOGGLE triggered by toggleAll
      if (fun != null) {
        fn = fun.children[0]
        toggleContainer = e.children[1]
        var fnInputs = fn.children[1]
        // Makes sure all functions are opened or closed before toggleAll executes
        if (constructorIcon.className.includes('plus') && fnInputs.className === css.visible.toString()) {
          fnInputs.classList.remove(css.visible)
          fnInputs.classList.add(css.hidden)
          removeLogs(fn)
        }
        else if (constructorIcon.className.includes('minus') && fnInputs.className === css.hidden.toString()) {
          fnInputs.classList.remove(css.hidden)
          fnInputs.classList.add(css.visible)
          addLogs(fn)
        }
      // TOGGLE triggered with onclick on function title (toggle single function)
      } else {
        fn = e.currentTarget.parentNode
        toggleContainer = e.currentTarget.children[1]
      }
      // TOGGLE input fields in a function
      var params = fn.children[1]
      if (params.className === css.visible.toString()) {
        params.classList.remove(css.visible)
        params.classList.add(css.hidden)
        removeLogs(fn)
        fn.style.border = 'none'
        fn.style.marginBottom = 0
      } else {
        params.classList.remove(css.hidden)
        params.classList.add(css.visible)
        addLogs(fn)
        fn.style.border = `2px dashed ${colors.darkSmoke}`
        fn.style.marginBottom = '2em'
      }
    }

// Create and deploy contract using WEB3
    async function deployContract() {
      let abi = metadata.abi
      let bytecode = metadata.bytecode
      provider =  await getProvider()
      let signer = await provider.getSigner()
      var el = document.querySelector("[class^='ctor']")
      let factory = await new ethers.ContractFactory(abi, bytecode, signer)
      el.replaceWith(bel`<div class=${css.deploying}>Publishing to Ethereum network ${loadingAnimation(colors)}</div>`)
      try {
        var allArgs = getArgs(el, 'inputContainer')
        let args = allArgs.args
        var instance
        if (allArgs.overrides) { instance = await factory.deploy(...args, allArgs.overrides) }
        else { instance = await factory.deploy(...args) }
        // instance = await factory.deploy(...args)
        contract = instance
        let deployed = await contract.deployed()
        topContainer.innerHTML = ''
        topContainer.appendChild(makeDeployReceipt(provider, contract, false))
        activateSendTx(contract)
      } catch (e) {
        let loader = document.querySelector("[class^='deploying']")
        loader.replaceWith(ctor)
      }
    }

    function activateConnect (e) {
      console.log(e)
      if (active != e.target) {
        setToActive(e.target)
        topContainer.removeChild(ctor)
        topContainer.appendChild(connectContainer)
      }
    }

    function activatePublish (e) {
      if (active != e.target) {
        setToActive(e.target)
        topContainer.removeChild(connectContainer)
        topContainer.appendChild(ctor)
      }
    }

    async function connectToContract() {
      var el = document.querySelector("[class^='connectContainer']")
      var allArgs = getArgs(el, 'inputContainer')
      const address = allArgs.args[0]
      await _connectToContract(address);
    }

    async function _connectToContract (address, tries=0) {
      var el = document.querySelector("[class^='connectContainer']")
      let abi = metadata.abi
      provider =  await getProvider()
      el.replaceWith(bel`<div class=${css.connecting}>
        Connecting to the contract ${address}
        ${loadingAnimation(colors)}</div>`)
      try {
        contract = new ethers.Contract(address, abi, provider)
        var code = await provider.getCode(address)
        if (!code || code === '0x') {
          let loader = document.querySelector("[class^='connecting']")
          loader.replaceWith(connectContainer)
          console.log('Not a valid contract address')
        } else {
          topContainer.innerHTML = ''
          topContainer.appendChild(makeDeployReceipt(provider, contract, true))
          activateSendTx(contract)
        }
      } catch (e) {
        let loader = document.querySelector("[class^='connecting']")
        loader.replaceWith(connectContainer)
        console.log(e)
        if (tries==0) {
          return _connectToContract(address,1);
        } else {
          alert("Failed to connect to contract. Please try manually");
        }
      }
    }

    function setToActive (e) {
      e.classList.add(css.activetab)
      active.classList.remove(css.activetab)
      active = e
    }

    function activateSendTx(instance) {
      let sendButtons = document.querySelectorAll("[class^='send']")
      for(var i = 0;i < sendButtons.length;i++) {
        sendButtons[i].style.color = colors.slateGrey
      }
      for(var i = 0;i < sendButtons.length;i++) {
        sendButtons[i].style.color = colors.whiteSmoke
      }
    }

    var topContainer = bel`<div class=${css.topContainer}></div>`
    var ctor = bel`<div class="${css.ctor}">
      ${metadata.constructorInput}
      <div class=${css.deploy} onclick=${()=>deployContract()}
        title="Publish the contract first (this executes the Constructor function). After that you will be able to start sending/receiving data using the contract functions below.">
        <div class=${css.deployTitle}>Publish</div>
        <i class="${css.icon} fa fa-arrow-circle-right"></i>
      </div>
    </div>`
    const connectContainer = bel`<div class="${css.connectContainer}">
      ${generateInputContainer({name: 'contract_address', type:'address'})}
      <div class=${css.connect} onclick=${()=>connectToContract()}
        title="Enter address of the deployed contract you want to connect with. Select the correct network and click Connect. After that you will be able to interact with the chosen contract.">
        <div class=${css.connectTitle}>Connect</div>
        <i class="${css.icon} fa fa-arrow-circle-right"></i>
      </div>
    </div>`
    var active, tabs = bel`<div class=${css.tabsContainer}>
      ${active = bel`<div class="${css.tab} ${css.activetab}"
      onclick=${e=>activatePublish(e)}>Publish</div>`}
      <div class="${css.tab}"
      onclick=${e=>activateConnect(e)}>Connect</div>
    </div>`

    topContainer.appendChild(tabs)
    // First rendered tab is connect container if contract is already deployed from metadata
    if (metadata.address) {
      topContainer.appendChild(connectContainer)
    } else {
      topContainer.appendChild(ctor)
    }

      const cb = () => {
        _connectToContract(metadata.address);
      }

      const node = bel`
      <div class=${css.preview}>
        <div class=${css.constructorFn}>
          <div class=${css.contractName} onclick=${e=>toggleAll(e)} title="Expand to see the details">
            ${metadata.constructorName}
            <span class=${css.icon}><i class="fa fa-minus-circle" title="Expand to see the details"></i></span>
          </div>
        </div>
        ${topContainer}
        <div class=${css.functions}>${sorted.map(fn => { return functions(fn)})}</div>
      </div>`

      return {
        node, cb
      }
  }
}
