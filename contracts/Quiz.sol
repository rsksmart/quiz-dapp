// pragma solidity >=0.4.21 <0.7.0;
pragma solidity ^0.4.14;
import "./strings.sol";
import "./stringUtils.sol";
contract Quiz {
    using strings for *;
    address public owner;
    string[4] rightAnswers = ["c", "a", "a", "b"];
    address[] public players;
    uint8[] public playerHits;
    string public questions;
    constructor() public {
        owner = msg.sender;
    }
    function getPlayerHits() public view returns (uint8[] memory) {
        return playerHits;
    }
    function getPlayers() public view returns (address[] memory) {
        return players;
    }
    function answerQuestions (string playerAnswers) public returns (string memory) {
        uint hits;
        var s = playerAnswers.toSlice();
        var delim = ".".toSlice();
        var parts = new string[](s.count(delim) + 1);
        for (uint i = 0; i < parts.length; i++) {
            parts[i] = s.split(delim).toString();
            // if (parts[i] == rightAnswers[i]) {
            if (StringUtils.equal(parts[i], rightAnswers[i])) {
                hits++;
            }
        }
        players.push(msg.sender);
        playerHits.push(4);
        // players[players.length] = msg.sender;
        // hits[index] = 0;
        return playerAnswers;
    }
}