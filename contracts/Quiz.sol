pragma solidity ^0.4.14;

contract Quiz {
    string[] rightAnswers = ["c", "a", "a", "b"];
    address[] public players;
    uint8[] public playerHits;

    constructor() public {
    }

    function getPlayerHits() public view returns (uint8[] memory) {
        return playerHits;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function answerQuestions (string playerAnswers) public returns (string memory) {
    }
}