const colors = require('theme')
const {css} = require('./css');
const bel = require("bel")
const inputAddress = require("input-address")
const inputArray = require("input-array")
const inputInteger = require("input-integer")
const inputBoolean = require("input-boolean")
const inputString = require("input-string")
const inputByte = require("input-byte")
const inputPayable = require("input-payable")

    function generateInputContainer (field) {
      var theme = { classes: css, colors}
      var name = field.name
      var type = field.type
      var inputField = getInputField( {theme, type, cb})
      var inputContainer = bel`
        <div class=${css.inputContainer}>
          <div class=${css.inputParam} title="data type: ${type}">${name || 'key'}</div>
          <div class=${css.inputFields}>${inputField}</div>
          <div class=${css.output}></div>
        </div>`
      return inputContainer
      function cb (msg, el, value) {
        var oldOutput = el.parentNode.querySelector("[class^='output']")
        var output = oldOutput ? oldOutput : output = bel`<div class=${css.output}></div>`
        output.innerHTML = ""
        output.innerHTML = msg ? `<a class=${css.valError} title="${msg}"><i class="fa fa-exclamation"></i></a>` : `<a class=${css.valSuccess} title="The value is valid."><i class="fa fa-check"></i></a>`
        el.parentNode.appendChild(output)
      }
    }

    function getInputField ({ theme, type, cb}) {
      var field
      if ((type.search(/\]/) != -1)) {
        var arrayInfo = type.split('[')[1]
        var digit = arrayInfo.search(/\d/)
        field = inputArray({ theme, type, cb })
      } else {
        if ((type.search(/\buint/) != -1) || (type.search(/\bint/) != -1)) field = inputInteger({ theme, type, cb })
        if (type.search(/\bbyte/) != -1) field = inputByte({ theme, type, cb })
        if (type.search(/\bstring/) != -1) field = inputString({ theme, type, cb })
        if (type.search(/\bfixed/) != -1) field = inputInteger({ theme, type, cb })
        if (type.search(/\bbool/) != -1) field = inputBoolean({ theme, type, cb })
        if (type.search(/\baddress/) != -1) field = inputAddress({ theme, type, cb })
      }
      return field
    }


function treeForm(data) {
  return data.map(x => {
    if (x.components) {
      return bel`<li><div>${x.name} (${x.type})</div><ul>${treeForm(x.components)}</ul></li>`
    }
    if (!x.components) {
      return generateInputContainer(x)
    }
  })
}

function getAllInputs(fn) {
  if (fn.inputs) {
    return treeForm(fn.inputs)
  }
}

function getAllOutputs(fn) {
  if (fn.outputs) {
    return treeForm(fn.outputs)
  }
}

function getContractFunctions(solcMetadata) {
  return solcMetadata.output.abi.map(x => {
    var obj = {}
    obj.name = x.name
    obj.type = x.type
    obj.inputs = getAllInputs(x)
    obj.outputs = getAllOutputs(x)
    obj.stateMutability = x.stateMutability
    return obj
  })
}

function getConstructorInput(solcMetadata) {
  var payable = false
  var inputs = solcMetadata.output.abi.map(fn => {
    if (fn.type === "constructor") {
      if (fn.stateMutability === 'payable') payable = true
      return treeForm(fn.inputs)
    }
  })
  if (payable === true) inputs.unshift(inputPayable('payable'))
  return inputs
}

module.exports = {
  treeForm: treeForm,
  getInputField: getInputField,
  generateInputContainer: generateInputContainer,
  getContractFunctions: getContractFunctions,
  getConstructorInput: getConstructorInput
}
