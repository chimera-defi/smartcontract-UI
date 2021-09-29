const csjs = require("csjs-inject")
const colors = require('theme')
const bel = require("bel")

/******************************************************************************
  CSS
******************************************************************************/

css = csjs`
  @media only screen and (max-width: 3000px) {
    .preview {
      padding: 1% 2%;
      min-width: 350px;
      min-height: 100vh;
      font-family: 'Overpass Mono', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: ${colors.dark};
      color: ${colors.whiteSmoke};
    }
    .error {
      border: 1px solid ${colors.violetRed};
      position: relative;
      padding: 1em;
    }
    .errorTitle {
      position: absolute;
      top: -14px;
      left: 20px;
      background-color: ${colors.dark};
      padding: 0 5px 0 5px;
      font-size: 1.3rem;
      color: ${colors.violetRed};
    }
    .errorIcon {
      font-size: 1.3rem;
    }
    .visible {
      visibility: visible;
      height: 100%;
      padding: 0;
    }
    .hidden {
      visibility: hidden;
      height: 0;
    }
    .txReturn {
      position: relative;
      border: 2px dashed ${colors.darkSmoke};
      border-top: none;
      min-width: 230px;
      top: -41px;
      left: 20px;
      min-height: 80px;
      width: 546px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .deploying, .connecting {
      font-size: 0.9rem;
      margin-left: 3%;
    }
    .txReturnItem {
      position: relative;
      font-size: 0.7rem;
      display: flex;
      color: ${colors.whiteSmoke};
      border: 1px solid ${colors.darkSmoke};
      width: 87%;
      margin: 3%;
      padding: 3%;
      justify-content: space-between;
      flex-direction: column;
    }
    .contractName {
      cursor: pointer;
      font-size: 2rem;
      font-weight: bold;
      color: ${colors.whiteSmoke};
      margin: 10px 0 20px 10px;
      display: flex;
      align-items: end;
    }
    .contractName:hover {
      ${hover()}
    }
    .fnName {
      font-size: 1em;
      display: flex;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .faIcon {
      position: absolute;
      top: -16px;
      left: 0;
    }
    .name {
      font-size: 0.9em;
    }
    .stateMutability {
      margin-left: 5px;
      color: ${colors.whiteSmoke};
      border-radius: 20px;
      border: 1px solid;
      padding: 1px;
      font-size: 0.9rem;
      width: 65px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .constructorFn {
      padding-top: 18px;
      width: 600px;
    }
    .functions {
      font-size: 1.3rem;
      width: 570px;
    }
    .title {
      font-size: 1.3rem;
      display: flex;
      align-items: baseline;
      position: absolute;
      top: -13px;
      left: 20px;
      background-color: ${colors.dark};
    }
    .title:hover {
      ${hover()}
    }
    .deployTitle, .connectTitle {
      font-size: 1.3rem;
      background-color: ${colors.dark};
      padding: 0 5px 0 0;
      font-weight: 800;
    }
    .deploy, .connect {
      color: ${colors.whiteSmoke};
      display: flex;
      align-items: center;
      bottom: -15px;
      right: -12px;
      font-size: 1.8rem;
      position: absolute;
      background-color: ${colors.dark};
      cursor: pointer;
    }
    .deploy:hover, .connect:hover {
      ${hover()}
    }
    .send {
      display: flex;
      align-items: baseline;
      bottom: -16px;
      right: 13px;
      font-size: 2rem;
      position: absolute;
      background-color: ${colors.dark};
      color: ${colors.darkSmoke};
      padding-right: 5px;
    }
    .send:hover {
      ${hover()}
    }
    .bounce {
      animation: bounceRight 2s infinite;
    }
    @-webkit-keyframes bounceRight {
    0% {-webkit-transform: translateX(0);
      transform: translateX(0);}
    20% {-webkit-transform: translateX(0);
      transform: translateX(0);}
    40% {-webkit-transform: translateX(-30px);
      transform: translateX(-30px);}
    50% {-webkit-transform: translateX(0);
      transform: translateX(0);}
    60% {-webkit-transform: translateX(-15px);
      transform: translateX(-15px);}
    80% {-webkit-transform: translateX(0);
      transform: translateX(0);}
    100% {-webkit-transform: translateX(0);
      transform: translateX(0);}
    }
    @-moz-keyframes bounceRight {
      0% {transform: translateX(0);}
      20% {transform: translateX(0);}
      40% {transform: translateX(-30px);}
      50% {transform: translateX(0);}
      60% {transform: translateX(-15px);}
      80% {transform: translateX(0);}
      100% {transform: translateX(0);}
    }
    @keyframes bounceRight {
      0% {-ms-transform: translateX(0);
        transform: translateX(0);}
      20% {-ms-transform: translateX(0);
        transform: translateX(0);}
      40% {-ms-transform: translateX(-30px);
        transform: translateX(-30px);}
      50% {-ms-transform: translateX(0);
        transform: translateX(0);}
      60% {-ms-transform: translateX(-15px);
        transform: translateX(-15px);}
      80% {-ms-transform: translateX(0);
        transform: translateX(0);}
      100% {-ms-transform: translateX(0);
        transform: translateX(0);}
    }
    .fnContainer {
      position: relative;
    }
    .function {
      display: flex;
      flex-direction: column;
      position: relative;
      margin-left: 20px;
      margin-bottom: 10%;
      border: 2px dashed ${colors.darkSmoke};
    }
    .topContainer {
      display: flex;
      flex-direction: column;
      position: relative;
      border: 2px dashed ${colors.darkSmoke};
      padding: 2em 1em 3em 0em;
      width: 540px;
      margin: 3em 0 5em 20px;
      font-size: 0.75em;
    }
    .tabsContainer {
      display: flex;
      position: absolute;
      top: -30px;
      left: -1px;
      width: 33%;
    }
    .tab {
      border: 2px dashed ${colors.darkSmoke};
      color: ${colors.slateGrey};
      border-bottom: none;
      box-sizing: border-box;
      padding: 3% 13%;
      height: 29px;
      width: 100%;
      margin-right: 5px;
      font-size: 0.8rem;
    }
    .tab:hover {
      ${hover()}
    }
    .activetab {
      font-weight: bold;
      color: ${colors.whiteSmoke};
    }
    .ctor {}
    .connectContainer {}
    .signature {}
    .pure {
      color: ${colors.yellow};
    }
    .view {
      color: ${colors.lavender};
    }
    .nonpayable {
      color: ${colors.turquoise};
    }
    .payable {
      color: ${colors.orange};
    }
    .icon {
      margin-left: 5px;
      font-size: 0.9em;
    }
    .output {
      font-size: 0.7rem;
      display: flex;
      align-self: center;
      position: absolute;
      right: -17px;
    }
    .valError {
      color: ${colors.violetRed};
      display: flex;
      align-self: center;
    }
    .valSuccess {
      color: ${colors.aquaMarine};
      display: flex;
      align-self: center;
    }
    .inputContainer {
      font-family: 'Overpass Mono', sans-serif;
      margin: 15px 0 15px 0;
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: ${colors.whiteSmoke};
    }
    .inputParam {
      color: ${colors.slateGrey};
      display: flex;
      justify-content: center;
      font-size: 0.9rem;
      display: flex;
      min-width: 200px;
    }
    .inputFields {
    }
    .inputType {
    }
    .inputField {
      ${inputStyle()}
      position: relative;
      font-size: 0.9rem;
      color: ${colors.whiteSmoke};
      border-color: ${colors.slateGrey};
      border-radius: 0.2em;
      background-color: ${colors.darkSmoke};
      text-align: center;
      display: flex;
      width: 100%;
    }
    .inputField::placeholder {
      color: ${colors.whiteSmoke};
      text-align: center;
      opacity: 0.5;
    }
    .integerValue {
      ${inputStyle()}
      font-size: 0.9rem;
      color: ${colors.whiteSmoke};
      background-color: ${colors.darkSmoke};
      border-radius: 0.2em;
      display: flex;
      text-align: center;
      width: 60%;
    }
    .integerValue::placeholder {
      color: ${colors.whiteSmoke};
      text-align: center;
      opacity: 0.5;
    }
    .integerSlider {
      width: 40%;
      border: 1px solid ${colors.slateGrey};
      background: ${colors.darkSmoke};
      -webkit-appearance: none;
      height: 1px;
    }
    .integerSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      border: 1px solid ${colors.slateGrey};
      border-radius: 0.2em;
      height: 22px;
      width: 10px;
      background: ${colors.darkSmoke};
      cursor: pointer;
    }
    .integerField {
      position: relative;
      display: flex;
      width: 300px;
      align-items: center;
    }
    .booleanField {
      position: relative;
      display: flex;
      width: 300px;
      align-items: baseline;
      font-size: 0.9rem;
    }
    .stringField {
      position: relative;
      display: flex;
      width: 300px;
      justify-content: center;
    }
    .byteField {
      position: relative;
      display: flex;
      width: 300px;
      justify-content: center;
    }
    .addressField {
      position: relative;
      display: flex;
      width: 300px;
      justify-content: center;
    }
    .keyField {
      ${inputStyle()}
      border-right: none;
      background-color: ${colors.aquaMarine};
      border-color: ${colors.whiteSmoke};
    }
    .false {
      ${inputStyle()}
      border-right: none;
      width: 50%;
      text-align: center;
      cursor: pointer;
    }
    .true {
      ${inputStyle()}
      width: 50%;
      text-align: center;
      cursor: pointer;
    }
    .arrayContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
    }
    .arrayPlusMinus {
      margin: 10px;
    }
    .arrayPlus {
      cursor: pointer;
    }
    .arrayMinus {
      cursor: pointer;
    }
  }
  @media only screen and (max-device-width: 480px) {
    html {
      font-size: 30px;
    }
    .constructorFn, .functions {
      width: 80%;
    }
    .title {
      top: -30px;
    }
  }
`

function inputStyle() {
  return `
    border: 1px solid ${colors.slateGrey};
    background-color: ${colors.darkSmoke};
    color: ${colors.slateGrey};
    padding: 5px;
  `
}

function hover () {
  return `
    cursor: pointer;
    opacity: 0.6;
  `
}

function injectHeadStyles() {
  var fonts = [ "https://use.fontawesome.com/releases/v5.8.2/css/all.css",
  'https://fonts.googleapis.com/css?family=Overpass+Mono']
  var fontAwesome = bel`<link href=${fonts[0]} rel='stylesheet' type='text/css'>`
  var overpassMono = bel`<link href=${fonts[1]} rel='stylesheet' type='text/css'>`
  document.head.appendChild(fontAwesome)
  document.head.appendChild(overpassMono)
}

module.exports = {
  css: css,
  inputStyle: inputStyle,
  hover: hover,
  injectHeadStyles: injectHeadStyles
}