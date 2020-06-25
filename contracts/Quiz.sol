pragma solidity ^0.4.14;

contract Quiz {
    address public owner;
    uint8[4] rightAnswers = [2, 3, 1, 4];
    address[] public players;
    uint8[] public playerHits;
    string public questions;

    event AnswerEvent(uint8 hitsCounter);

    constructor() public {
        owner = msg.sender;
    }

    function getPlayerHits() public view returns (uint8[] memory) {
        return playerHits;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function answerQuestions (uint8[] playerAnswers) public returns (uint8) {
        uint8 hits;

        for (uint i = 0; i < playerAnswers.length; i++) {
            if (playerAnswers[i] == rightAnswers[i]) {
                hits++;
            }
        }
        players.push(msg.sender);
        playerHits.push(hits);

        emit AnswerEvent(hits);

        return hits;
    }
}