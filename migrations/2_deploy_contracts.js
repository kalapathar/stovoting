var Voting = artifacts.require("./Voting.sol");
module.exports = function(deployer) {
  deployer.deploy(Voting, 1000, web3.toWei('0.1', 'ether'), ['Sam', 'Andrew', 'Ian', 'Jack','Jonah', 'Mariem', 'Atefeh']);
};
