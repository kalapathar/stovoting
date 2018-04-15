Web3=require('web3')
solc=require('solc')
const fs = require('fs');
web3=new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//console.log(web3.eth.accounts)
code=fs.readFileSync('contracts/voting_v1.sol').toString()

compiledCode=solc.compile(code);
console.log(code)

//console.log(compiledCode);


abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface)
console.log("abiDefinition"+abiDefinition);
VotingContract = web3.eth.contract(abiDefinition)
console.log("Voting Contract"+ VotingContract);
byteCode = compiledCode.contracts[':Voting'].bytecode
console.log("bytecode: "+byteCode);
deployedContract = VotingContract.new(['Rama','Nick','Jose'],{data: byteCode, from: web3.eth.accounts[0], gas: 4700000})
console.log('deployed contract'+deployedContract);
console.log(deployedContract.address)
contractInstance = VotingContract.at(deployedContract.address)
console.log('instance'+contractInstance);




contractInstance.totalVotesFor.call('Rama')
{ [String: '0'] s: 1, e: 0, c: [ 0 ] }
contractInstance.voteForCandidate('Rama', {from: web3.eth.accounts[0]})
'0xdedc7ae544c3dde74ab5a0b07422c5a51b5240603d31074f5b75c0ebc786bf53'
contractInstance.voteForCandidate('Rama', {from: web3.eth.accounts[0]})
'0x02c054d238038d68b65d55770fabfca592a5cf6590229ab91bbe7cd72da46de9'
contractInstance.voteForCandidate('Rama', {from: web3.eth.accounts[0]})
'0x3da069a09577514f2baaa11bc3015a16edf26aad28dffbcd126bde2e71f2b76f'
contractInstance.totalVotesFor.call('Rama').toLocaleString()
'3'



deployedContract = VotingContract.new(['Ramesh','Nick','Jose'],{data: byteCode, from: web3.eth.accounts[0], gas: 4700000})


contractInstance.totalVotesFor.call('Ramesh')


contractInstance.voteForCandidate('Ramesh', {from: web3.eth.accounts[0]})
contractInstance.voteForCandidate('Ramesh', {from: web3.eth.accounts[0]})

contractInstance.totalVotesFor.call('Ramesh').toLocaleString()


Web3=require('artifacts')




contractInstance = VotingContract.at(deployedContract.address)

contractInstance.candidateList.call()

deployedContract.candidateList


var ele = document.createElement("script");
var scriptPath = "http://localhost:8080/app.js" //verify the script path
ele.setAttribute("src",scriptPath);
document.head.appendChild(ele)



(function (exports, require, module, __filename, __dirname) {

code=fs.readFileSync('contracts/voting_v1.sol').toString()
console.log(code)

	/* your code */
});