pragma solidity ^0.4.14;
import "./strings.sol";

contract Quiz {
    using strings for *;

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
    uint hits = 0;
    var s = playerAnswers.toSlice();
    var delim = ".".toSlice();
    var parts = new string[](s.count(delim) + 1);

    for (uint i = 0; i < parts.length; i++) {
        parts[i] = s.split(delim).toString();
        if (parts[i] == rightAnswers[i]) {
            hits++;
        }
    }
    players.push(msg.sender);
    hits.push(hits);

    return playerAnswers;
    }
}