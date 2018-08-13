var bel = require("bel")
var csjs = require("csjs-inject")
var checkInputType = require('check-input-type')

var fonts = [
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  'https://fonts.googleapis.com/css?family=Overpass+Mono" rel="stylesheet'
]
var fontAwesome = bel`<link href=${fonts[0]} rel='stylesheet' type='text/css'>`
var overpassMono = bel`<link href=${
  fonts[1]
} rel='stylesheet' type='text/css'>`
document.head.appendChild(fontAwesome)
document.head.appendChild(overpassMono)

var colors = {
  white: "#ffffff", // borders, font on input background
  dark: "#202020", //background dark
  whiteSmoke: "#f1f4f9", // background light
  lavenderGrey: "#e3e8ee", // inputs background
  slateGrey: "#8a929b", // text
  violetRed: "#e76685",
  aquaMarine: "#59c4bc",
  turquoise: "#14b9d5"
}

var css = csjs`
  body {
    font-family: 'Overpass Mono', monospace;
    background-color: ${colors.dark};
    font-size: 16px;
  }
  .function {
    color: ${colors.violetRed};
    padding: 2%;
    margin: 2%;
    border: 3px solid ${colors.white};
  }
  .inputContainer {
    font-family: 'Overpass Mono', monospace;
    margin-top: 5%;
    display: flex;
    font-size: 1em;
    color: ${colors.slateGrey};
    flex-direction: column;
  }
  .inputParam {
    margin-bottom: 2%;
    font-size: 1.5em;
    font-weight: bold;
    display: flex;
    justify-content: center
  }
  .inputFields {
    display: flex;
    justify-content: center
  }
  .inputType {
    display: flex;
    justify-content: center;
  }
  .inputField {
    ${inputStyle()}
    font-size: 1em;
    color: ${colors.slateGrey};
    text-align: center;
    display: flex;
    width: 100%;
  }
  .inputField::placeholder {
    color: ${colors.slateGrey};
    text-align: center;
    opacity: 0.5;
  }
  .icon {
    color: ${colors.white};
  }
  .integerValue {
    ${inputStyle()}
    font-size: 1em;
    color: ${colors.slateGrey};
    display: flex;
    text-align: center;
    width: 25%;
  }
  .integerValue::placeholder {
    color: ${colors.slateGrey};
    text-align: center;
    opacity: 0.5;
  }
  .integerSlider {
    width: 75%;
  }
  .integerField {
    display: flex;
    width: 300px;
    margin-bottom: 2%;
  }
  .booleanField {
    display: flex;
    width: 300px;
    justify-content: center;
    margin-bottom: 2%;
  }
  .stringField {
    display: flex;
    width: 300px;
    justify-content: center;
    margin-bottom: 2%;
  }
  .addressField {
    display: flex;
    width: 300px;
    justify-content: center;
    margin-bottom: 2%;
  }
  .minus {
    ${inputStyle()}
    border-right: none;
    background-color: ${colors.violetRed};
    text-align: center;
    width: 25px;
  }
  .plus {
    ${inputStyle()}
    border-left: none;
    background-color: ${colors.aquaMarine};
    text-align: center;
    width: 25px;
  }
  .keyField {
    ${inputStyle()}
    border-right: none;
    background-color: ${colors.aquaMarine}
  }
  .false {
    ${inputStyle()}
    border-right: none;
    background-color: ${colors.violetRed};
    color: ${colors.white};
    width: 50%;
    text-align: center;
  }
  .true {
    ${inputStyle()}
    color: ${colors.slateGrey};
    width: 50%;
    text-align: center;
  }
  .arrayContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .arrayInner {
    border: 1px solid red;
    padding: 1px;
    margin: 20px 2px 2px 20px;
  }
  .arrayInput {
    border: 1px solid blue;
    padding: 1px;
    margin: 20px 2px 2px 20px;
  }
  .arrayPlusMinus {
    margin: 2%;
  }
  .arrayPlus {
    cursor: pointer;
  }
  .arrayMinus {
    cursor: pointer;
  }
`;

function inputStyle() {
  return `
    border: 3px solid ${colors.white};
    background-color: ${colors.dark};
    padding: 5px 10px;
  `
}

var solcMetadata = {"compiler":{"version":"0.4.24+commit.e67f0147"},"language":"Solidity","output":{"abi":[{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256[2][3][]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256[2][3][]"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],"devdoc":{"methods":{}},"userdoc":{"methods":{}}},"settings":{"compilationTarget":{"browser/foo.sol":"SimpleStorage"},"evmVersion":"byzantium","libraries":{},"optimizer":{"enabled":false,"runs":200},"remappings":[]},"sources":{"browser/foo.sol":{"keccak256":"0xf03c24e2f7c372841d58f6f808e7bb2a5b73907437f03e0436e9d1b5d23206d9","urls":["bzzr://067d447ff937496a7487f9790e3e6ee3d7ba2d7e23220ac26a1c16ff049525df"]}},"version":1}

function getConstructorName() {
  var file = Object.keys(solcMetadata.settings.compilationTarget)[0]
  return solcMetadata.settings.compilationTarget[file]
}

function getConstructorInput() {
  return solcMetadata.output.abi.map(fn => {
    if (fn.type === "constructor") {
      return treeForm(fn.inputs)
    }
  })
}

function getContractFunctions() {
  return solcMetadata.output.abi.map(x => {
    var obj = {}
    obj.name = x.name
    obj.type = x.type
    obj.inputs = getAllInputs(x)
    obj.stateMutability = x.stateMutability
    return obj
  })
}

function getAllInputs(fn) {
  var inputs = []
  if (fn.inputs) {
    return treeForm(fn.inputs)
  }
}

function treeForm(data) {
  return data.map(x => {
    if (x.components) {
      return bel`<li><div>${x.name} (${x.type})</div><ul>${treeForm(
        x.components
      )}</ul></li>`
    }
    if (!x.components) {
      return contractUI(x)
    }
  })
}

var metadata = {
  compiler: solcMetadata.compiler.version,
  compilationTarget: solcMetadata.settings.compilationTarget,
  constructorName: getConstructorName(),
  constructorInput: getConstructorInput(),
  functions: getContractFunctions()
}

function contractUI(field) {
  var theme = { classes: css, colors}
  var name = field.name
  var type = field.type
  return checkInputType({name, theme, type})
}

/*--------------------
      PAGE
--------------------*/

function displayContractUI() {
  var html = bel`
    <div>
      <h1>${metadata.constructorName}</h1>
      ${metadata.constructorInput}
      <hr>
      <p>${displayFunctions()}</p>
    </div>
  `

  function displayFunctions() {
    return metadata.functions.map(fn => {
      if (fn.type === "function") {
        return bel`<div class=${css.function}>
        <h2>${fn.name} (${fn.stateMutability})</h2>
        <ul>${fn.inputs}</ul>
      </div>`
      }
    })
  }
  document.body.appendChild(html)
}

displayContractUI()
