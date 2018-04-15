// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

 import voting_artifacts from '../../build/contracts/Voting.json'

 import data from '../candidates.json'

 var Voting = contract(voting_artifacts);

 console.log(window);
 let candidates = {}

 let tokenPrice = null;
 //var votedcandidates=[];

 window.voteForCandidate = function(candidate) {
  //console.log("COMING HERE");
  
  let candidateName = $("#candidate").val();
  //console.log(candidateName);
  let voteTokens = $("#vote-tokens").val();
  $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
  $("#candidate").val("");
  $("#vote-tokens").val("");
  /* Voting.deployed() returns an instance of the contract. Every call
   * in Truffle returns a promise which is why we have used then()
   * everywhere we have a transaction call
   */



   Voting.deployed().then(function(contractInstance) {
     contractInstance.voteForCandidate(candidateName, voteTokens, {gas: 1400000, from: web3.eth.accounts[0]}).then(function() {
      let div_id = candidates[candidateName];
      return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
        $("#" + div_id).html(v.toString());
        $("#msg").html("");
      });
    });
   });
 }

/* The user enters the total no. of tokens to buy. We calculate the total cost and send it in
 * the request. We have to send the value in Wei. So, we use the toWei helper method to convert
 * from Ether to Wei.
 */

 window.buyTokens = function() {
  let tokensToBuy = $("#buy").val();
  let price = tokensToBuy * tokenPrice;
  console.log("This is the token price");
  console.log(price);
  $("#buy-msg").html("Purchase order has been submitted. Please wait.");
  Voting.deployed().then(function(contractInstance) {
    contractInstance.buy({value: web3.toWei(price, 'ether'), from: web3.eth.accounts[0]}).then(function(v) {
      $("#buy-msg").html("");
      web3.eth.getBalance(contractInstance.address, function(error, result) {
        $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
      });
    })
  });
  populateTokenData();
}

window.lookupVoterInfo = function() {
  let address = $("#voter-info").val();
  Voting.deployed().then(function(contractInstance) {
    contractInstance.voterDetails.call(address).then(function(v) {
      $("#tokens-bought").html("Total Tokens bought: " + v[0].toString());
      let votesPerCandidate = v[1];
      $("#votes-cast").empty();
      $("#votes-cast").append("Votes cast per candidate: <br>");
      let allCandidates = Object.keys(candidates);
      for(let i=0; i < allCandidates.length; i++) {
        $("#votes-cast").append(allCandidates[i] + ": " + votesPerCandidate[i] + "<br>");
      }
    });
  });
}

/* Instead of hardcoding the candidates hash, we now fetch the candidate list from
 * the blockchain and populate the array. Once we fetch the candidates, we setup the
 * table in the UI with all the candidates and the votes they have received.
 */
 function populateCandidates() {
  // $.getJSON('../candidates.json',function(data){
  //   console.log(data);
  // })
  //console.log(candidates_list);

  var user_address=90;
  alertify.parent(document.body)
  var candRow=$('#candRow');
  var candTemplate=$('#candTemplate');
  console.log(candTemplate);


  for (var i=0;i<data.length;i++){
        //console.log(data[i].picture);
        candTemplate.find('.panel-title').text(data[i].name);
        candTemplate.find('img').attr('src', data[i].picture);
        candTemplate.find('.cand-org').text(data[i].org);
        candTemplate.find('.cand-year').text(data[i].year);
        candTemplate.find('.cand-motto').text(data[i].motto);
        candTemplate.find('.btn-vote').attr('data-id', data[i].id);

        candRow.append(candTemplate.html());
        console.log('Sucess');
      }

      $('.btn-vote').click(function(evt){
        let ID = $(evt.toElement).data('id');
  //let check=$(evt.toElement).data.base
  let candidateName = $('.panel-title')[ID].innerHTML
  //console.log(evt);
  console.log(candidateName)
  //console.log("Vote Button Clicked!");

//let candidateName = $('.panel-title').val();
//let candidateName = candTemplate.find('.panel-title').text();
//let voteTokens = $("#vote-tokens").val();
let voteTokens=1;
//console.log(candidateName);
Voting.deployed().then(function(contractInstance){
  console.log("Contract Instance");
  console.log(contractInstance);
  contractInstance.hasvoted().then(function(v){

    console.log(v);
    if (!v){
      console.log(contractInstance.address);
      contractInstance.voteForCandidate(candidateName,voteTokens,{gas:1400000,from:web3.eth.accounts[0]}).then(function(){
        let div_id=candidates[candidateName];

        console.log(div_id);
        //votedcandidates.push(contractInstance.address)
        //console.log(votedcandidates);

      });
    }
    else{
      alertify.confirm("You have already voted!", function () {
      // user clicked "ok"

    });

    }

  });

})

})


      Voting.deployed().then(function(contractInstance) {
        let price=0.1;
        console.log("This is the price");
  //popup(contractInstance.address);
  alertify.confirm("Here is your contract address\n"+contractInstance.address, function () {
      // user clicked "ok"

    }, function() {
      // user clicked "cancel"
    });

  contractInstance.tokensSold.call().then(function(v) {
    let soldtoken=v.toNumber();
    if (soldtoken==0){
      contractInstance.buy({value: web3.toWei(price, 'ether'), from: web3.eth.accounts[0]}).then(function(v) {
        $("#buy-msg").html("");
        web3.eth.getBalance(contractInstance.address, function(error, result) {
          $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
        });
      })
    }
  });



  contractInstance.allCandidates.call().then(function(candidateArray) {
    for(let i=0; i < candidateArray.length; i++) {
  /* We store the candidate names as bytes32 on the blockchain. We use the
   * handy toUtf8 method to convert from bytes32 to string
   */
   candidates[web3.toUtf8(candidateArray[i])] = "candidate-" + i;
   console.log(candidates);
 }
 setupCandidateRows();
 populateCandidateVotes();
 populateTokenData();
});
});
    }

    function populateCandidateVotes() {
      // confirm dialog


      let candidateNames = Object.keys(candidates);
      for (var i = 0; i < candidateNames.length; i++) {
        let name = candidateNames[i];
        Voting.deployed().then(function(contractInstance) {
          contractInstance.totalVotesFor.call(name).then(function(v) {
            $("#" + candidates[name]).html(v.toString());
            //user_address=contractInstance.address;
          });
        });
      }


    }

    function setupCandidateRows() {
      Object.keys(candidates).forEach(function (candidate) { 
        $("#candidate-rows").append("<tr><td>" + candidate + "</td><td id='" + candidates[candidate] + "'></td></tr>");
      });
    }

    function popup(message){
      alertify.confirm("Here is your contract address\n"+message, function () {
      // user clicked "ok"

    }, function() {
      // user clicked "cancel"
    });

    }

/* Fetch the total tokens, tokens available for sale and the price of
 * each token and display in the UI
 */
 function populateTokenData() {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.totalTokens().then(function(v) {
      $("#tokens-total").html(v.toString());
    });
    contractInstance.tokensSold.call().then(function(v) {
      $("#tokens-sold").html(v.toString());
    });
    contractInstance.tokenPrice().then(function(v) {
      tokenPrice = parseFloat(web3.fromWei(v.toString()));
      $("#token-cost").html(tokenPrice + " Ether");
    });
    web3.eth.getBalance(contractInstance.address, function(error, result) {
      $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
    });
  });
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Voting.setProvider(web3.currentProvider);
  
  populateCandidates();

});
